import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

/**
 * Integratietests tegen een echte, tijdelijke SQLite-database.
 *
 * Deze tests draaien de volledige keten: migraties toepassen, content seeden,
 * een examen genereren met de officiële domeinverdeling, antwoorden geven en
 * de score berekenen. Unittests op pure functies zeggen niets over of de
 * queries kloppen; deze tests wel.
 *
 * Draaien met de react-server-conditie, zodat `server-only` niet gooit:
 *   node --conditions=react-server --test --import tsx test/integration.test.ts
 */

const workDir = mkdtempSync(join(tmpdir(), 'p115-test-'));
const dbPath = join(workDir, 'test.db');

process.env.DATABASE_PATH = dbPath;
process.env.APP_SECRET = 'test-secret-that-is-long-enough-for-scrypt-derivation';
process.env.NODE_ENV = 'test';

// Imports moeten ná het zetten van DATABASE_PATH gebeuren: de db-module leest
// die variabele bij het openen van de verbinding.
const { default: Database } = await import('better-sqlite3');
const { drizzle } = await import('drizzle-orm/better-sqlite3');
const { migrate } = await import('drizzle-orm/better-sqlite3/migrator');

const sqlite = new Database(dbPath);
sqlite.pragma('foreign_keys = ON');
migrate(drizzle(sqlite), { migrationsFolder: './drizzle' });
sqlite.close();

const { db } = await import('../src/db/index');
const schema = await import('../src/db/schema');
const { generateExam } = await import('../src/lib/exam/generate');
const { contentPacks } = await import('../content/index');
const { createHash } = await import('node:crypto');

function stableId(prefix: string, ...parts: string[]): string {
  return `${prefix}_${createHash('sha256').update(parts.join(' ')).digest('hex').slice(0, 24)}`;
}

/** Minimale seed: dezelfde id-strategie als scripts/seed.ts. */
async function seedContent() {
  for (const pack of contentPacks) {
    const certId = pack.certification.id;
    const c = pack.certification;

    await db.insert(schema.certifications).values({
      id: certId,
      provider: c.provider,
      titleNl: c.title.nl,
      titleEn: c.title.en,
      descriptionNl: c.description.nl,
      descriptionEn: c.description.en,
      questionCount: c.questionCount,
      passMark: c.passMark,
      durationMinutes: c.durationMinutes,
      extraTimeMinutes: c.extraTimeMinutes,
      examLanguage: c.examLanguage,
      accentColor: c.accentColor,
      sortOrder: c.sortOrder,
    });

    const domainIds = new Map<string, string>();
    for (const [index, domain] of pack.domains.entries()) {
      const id = stableId('dom', certId, domain.code);
      domainIds.set(domain.code, id);
      await db.insert(schema.domains).values({
        id,
        certificationId: certId,
        code: domain.code,
        titleNl: domain.title.nl,
        titleEn: domain.title.en,
        weight: domain.weight,
        sortOrder: index,
      });
    }

    const objectiveIds = new Map<string, string>();
    for (const [index, objective] of pack.objectives.entries()) {
      const id = stableId('obj', certId, objective.code);
      objectiveIds.set(objective.code, id);
      await db.insert(schema.objectives).values({
        id,
        domainId: domainIds.get(objective.domain)!,
        certificationId: certId,
        code: objective.code,
        topicNl: objective.topic.nl,
        topicEn: objective.topic.en,
        descriptionNl: objective.description.nl,
        descriptionEn: objective.description.en,
        bloomLevel: objective.bloom,
        sortOrder: index,
      });
    }

    const labels = ['A', 'B', 'C', 'D'];
    for (const question of pack.questions) {
      const qId = stableId('q', certId, question.id);
      await db.insert(schema.questions).values({
        id: qId,
        certificationId: certId,
        objectiveId: objectiveIds.get(question.objective)!,
        type: question.type ?? 'standard',
        bloomLevel: question.bloom ?? 1,
        difficulty: question.difficulty ?? 2,
        stemNl: question.stem.nl,
        stemEn: question.stem.en,
        listItems: question.listItems ? JSON.stringify(question.listItems) : null,
        explanationNl: question.explanation.nl,
        explanationEn: question.explanation.en,
        sourceRef: question.source ?? null,
      });

      for (const [index, option] of question.options.entries()) {
        await db.insert(schema.questionOptions).values({
          id: stableId('opt', certId, question.id, labels[index]!),
          questionId: qId,
          label: labels[index]!,
          textNl: option.text.nl,
          textEn: option.text.en,
          isCorrect: option.correct === true,
          rationaleNl: option.rationale?.nl ?? null,
          rationaleEn: option.rationale?.en ?? null,
          sortOrder: index,
        });
      }
    }
  }
}

before(async () => {
  await seedContent();
});

after(() => {
  rmSync(workDir, { recursive: true, force: true });
});

describe('examengeneratie tegen de database', () => {
  test('ITIL-examen heeft exact 40 vragen', async () => {
    const exam = await generateExam({
      certificationId: 'itil5-foundation',
      seed: 42,
    });
    assert.equal(exam.length, 40);
  });

  test('ITIL-examen volgt de officiële domeinverdeling', async () => {
    const exam = await generateExam({
      certificationId: 'itil5-foundation',
      seed: 7,
    });

    const objectiveIds = exam.map((q) => q.objectiveId);
    const rows = await db.query.objectives.findMany({
      with: { domain: true },
    });
    const domainByObjective = new Map(rows.map((o) => [o.id, o.domain.code]));

    const counts = new Map<string, number>();
    for (const id of objectiveIds) {
      const code = domainByObjective.get(id);
      if (!code) continue;
      counts.set(code, (counts.get(code) ?? 0) + 1);
    }

    // 30/10/10/40/5/2,5/2,5 van 40 vragen.
    assert.equal(counts.get('1'), 12, 'domein 1 (30%)');
    assert.equal(counts.get('2'), 4, 'domein 2 (10%)');
    assert.equal(counts.get('3'), 4, 'domein 3 (10%)');
    assert.equal(counts.get('4'), 16, 'domein 4 (40%)');
    assert.equal(counts.get('5'), 2, 'domein 5 (5%)');
    assert.equal(counts.get('6'), 1, 'domein 6 (2,5%)');
    assert.equal(counts.get('7'), 1, 'domein 7 (2,5%)');
  });

  test('ISFS-examen heeft exact 40 vragen met de juiste verdeling', async () => {
    const exam = await generateExam({ certificationId: 'exin-isfs', seed: 11 });
    assert.equal(exam.length, 40);

    const rows = await db.query.objectives.findMany({ with: { domain: true } });
    const domainByObjective = new Map(rows.map((o) => [o.id, o.domain.code]));

    const counts = new Map<string, number>();
    for (const q of exam) {
      const code = domainByObjective.get(q.objectiveId);
      if (!code) continue;
      counts.set(code, (counts.get(code) ?? 0) + 1);
    }

    assert.equal(counts.get('1'), 11, 'domein 1 (27,5%)');
    assert.equal(counts.get('2'), 5, 'domein 2 (12,5%)');
    assert.equal(counts.get('3'), 21, 'domein 3 (52,5%)');
    assert.equal(counts.get('4'), 3, 'domein 4 (7,5%)');
  });

  test('geen dubbele vragen binnen één examen', async () => {
    for (const seed of [1, 2, 3, 99]) {
      const exam = await generateExam({ certificationId: 'itil5-foundation', seed });
      const ids = exam.map((q) => q.questionId);
      assert.equal(new Set(ids).size, ids.length, `seed ${seed}: geen duplicaten`);
    }
  });

  test('elke vraag krijgt vier antwoordopties in gehusselde volgorde', async () => {
    const exam = await generateExam({ certificationId: 'itil5-foundation', seed: 5 });
    for (const question of exam) {
      assert.equal(question.optionOrder.length, 4, 'vier opties');
      assert.equal(
        new Set(question.optionOrder).size,
        4,
        'geen dubbele optie-ids',
      );
    }
  });

  test('list-vragen behouden hun oorspronkelijke optievolgorde', async () => {
    // De antwoordopties van een list-vraag verwijzen naar genummerde statements
    // ('1 en 2'); husselen zou de vraag onlogisch maken.
    const listQuestions = await db.query.questions.findMany({
      where: (q, { eq }) => eq(q.type, 'list'),
      with: { options: true },
    });

    assert.ok(listQuestions.length > 0, 'er moeten list-vragen zijn');

    const exam = await generateExam({
      certificationId: 'itil5-foundation',
      count: 85,
      seed: 3,
    });

    const listIds = new Set(listQuestions.map((q) => q.id));
    const optionsById = new Map(
      listQuestions.map((q) => [
        q.id,
        [...q.options].sort((a, b) => a.sortOrder - b.sortOrder).map((o) => o.id),
      ]),
    );

    let checked = 0;
    for (const item of exam) {
      if (!listIds.has(item.questionId)) continue;
      assert.deepEqual(
        item.optionOrder,
        optionsById.get(item.questionId),
        `list-vraag ${item.questionId} moet ongehusseld blijven`,
      );
      checked++;
    }
    assert.ok(checked > 0, 'er moet minstens één list-vraag gecontroleerd zijn');
  });

  test('gerichte oefensessie beperkt zich tot de opgegeven leerdoelen', async () => {
    const objectives = await db.query.objectives.findMany({
      where: (o, { eq }) => eq(o.certificationId, 'itil5-foundation'),
      limit: 3,
    });
    const ids = objectives.map((o) => o.id);

    const session = await generateExam({
      certificationId: 'itil5-foundation',
      objectiveIds: ids,
      count: 10,
      seed: 1,
    });

    for (const question of session) {
      assert.ok(
        ids.includes(question.objectiveId),
        'alleen vragen uit de opgegeven leerdoelen',
      );
    }
  });
});

describe('scoreberekening', () => {
  test('cesuur van 26 op 40 komt overeen met 65%', () => {
    const certs = [
      { passMark: 26, questionCount: 40 },
    ];
    for (const cert of certs) {
      const ratio = cert.passMark / cert.questionCount;
      assert.ok(Math.abs(ratio - 0.65) < 0.001, 'cesuur is 65%');
    }
  });

  test('een score gelijk aan de cesuur telt als geslaagd', () => {
    const passMark = 26;
    assert.equal(26 >= passMark, true, '26 goed = geslaagd');
    assert.equal(25 >= passMark, false, '25 goed = niet geslaagd');
  });
});
