import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import { contentPacks, validateAll, packStats, itil5, isfs } from '../content/index';

/**
 * Contenttests.
 *
 * Deze tests bewaken wat een validator niet kan afleiden: dat de
 * examenstructuur overeenkomt met de officiële syllabus. Een verkeerd
 * overgenomen weging of cesuur maakt elk proefexamen ongeschikt, en dat merk
 * je pas op de examendag.
 */

describe('contentvalidatie', () => {
  test('geen fouten in de vragenbank', () => {
    const issues = validateAll();
    const errors = issues.filter((i) => i.severity === 'error');
    assert.deepEqual(
      errors.map((e) => `${e.pack}/${e.questionId ?? '-'}: ${e.message}`),
      [],
      'Er mogen geen contentfouten zijn',
    );
  });

  test('elke vraag heeft precies één juist antwoord en vier opties', () => {
    for (const pack of contentPacks) {
      for (const question of pack.questions) {
        assert.equal(
          question.options.length,
          4,
          `${question.id} moet vier opties hebben`,
        );
        assert.equal(
          question.options.filter((o) => o.correct === true).length,
          1,
          `${question.id} moet precies één juist antwoord hebben`,
        );
      }
    }
  });

  test('vraag-ids zijn uniek over alle packs heen', () => {
    const seen = new Set<string>();
    for (const pack of contentPacks) {
      for (const question of pack.questions) {
        assert.ok(!seen.has(question.id), `Dubbele vraag-id: ${question.id}`);
        seen.add(question.id);
      }
    }
  });

  test('list-vragen hebben vier statements', () => {
    for (const pack of contentPacks) {
      for (const question of pack.questions.filter((q) => q.type === 'list')) {
        assert.equal(
          question.listItems?.length,
          4,
          `${question.id} moet vier statements hebben`,
        );
      }
    }
  });

  test('elke vraag verwijst naar een bestaand leerdoel', () => {
    for (const pack of contentPacks) {
      const codes = new Set(pack.objectives.map((o) => o.code));
      for (const question of pack.questions) {
        assert.ok(
          codes.has(question.objective),
          `${question.id} verwijst naar onbekend leerdoel ${question.objective}`,
        );
      }
    }
  });
});

describe('ITIL Foundation (Version 5) — examenspecificatie', () => {
  test('examenopzet komt overeen met de PeopleCert-syllabus', () => {
    const c = itil5.certification;
    assert.equal(c.questionCount, 40, '40 vragen');
    assert.equal(c.passMark, 26, 'cesuur 26 van 40 (65%)');
    assert.equal(c.durationMinutes, 60, '60 minuten');
    assert.equal(c.extraTimeMinutes, 15, '25% extra tijd = 15 minuten');
    assert.equal(c.examLanguage, 'en', 'het examen is Engelstalig');
  });

  test('domeinwegingen komen overeen met de syllabus', () => {
    const expected: Record<string, number> = {
      '1': 30.0,
      '2': 10.0,
      '3': 10.0,
      '4': 40.0,
      '5': 5.0,
      '6': 2.5,
      '7': 2.5,
    };
    for (const domain of itil5.domains) {
      assert.equal(
        domain.weight,
        expected[domain.code],
        `weging domein ${domain.code}`,
      );
    }
    const total = itil5.domains.reduce((sum, d) => sum + d.weight, 0);
    assert.equal(total, 100, 'wegingen tellen op tot 100%');
  });

  test('alle vier PeopleCert-vraagtypes komen voor', () => {
    const stats = packStats(itil5);
    for (const type of ['standard', 'negative', 'missing_word', 'list']) {
      assert.ok(
        (stats.byType[type] ?? 0) > 0,
        `vraagtype '${type}' moet voorkomen`,
      );
    }
  });

  test('elk domein heeft genoeg vragen voor een volledig examen', () => {
    const stats = packStats(itil5);
    for (const domain of stats.byDomain) {
      const needed = Math.round((domain.weight / 100) * 40);
      assert.ok(
        domain.questionCount >= needed,
        `domein ${domain.code} heeft ${domain.questionCount} vragen, nodig: ${needed}`,
      );
    }
  });
});

describe('EXIN ISFS — examenspecificatie', () => {
  test('examenopzet komt overeen met de EXIN preparation guide', () => {
    const c = isfs.certification;
    assert.equal(c.questionCount, 40, '40 vragen');
    assert.equal(c.passMark, 26, 'cesuur 65% (26 van 40)');
    assert.equal(c.durationMinutes, 60, '60 minuten');
    assert.equal(c.examLanguage, 'nl', 'de Nederlandstalige variant');
  });

  test('domeinwegingen komen overeen met de exameneisen', () => {
    const expected: Record<string, number> = {
      '1': 27.5,
      '2': 12.5,
      '3': 52.5,
      '4': 7.5,
    };
    for (const domain of isfs.domains) {
      assert.equal(
        domain.weight,
        expected[domain.code],
        `weging domein ${domain.code}`,
      );
    }
    const total = isfs.domains.reduce((sum, d) => sum + d.weight, 0);
    assert.equal(total, 100, 'wegingen tellen op tot 100%');
  });

  test('alle exameneisen zijn gedekt door minimaal één vraag', () => {
    const covered = new Set(isfs.questions.map((q) => q.objective));
    const uncovered = isfs.objectives
      .filter((o) => !covered.has(o.code))
      .map((o) => o.code);
    assert.deepEqual(uncovered, [], 'elke exameneis moet gedekt zijn');
  });

  test('elk domein heeft genoeg vragen voor een volledig examen', () => {
    const stats = packStats(isfs);
    for (const domain of stats.byDomain) {
      const needed = Math.round((domain.weight / 100) * 40);
      assert.ok(
        domain.questionCount >= needed,
        `domein ${domain.code} heeft ${domain.questionCount} vragen, nodig: ${needed}`,
      );
    }
  });
});

describe('glossarium', () => {
  test('elke term is tweetalig en heeft een definitie', () => {
    for (const pack of contentPacks) {
      for (const term of pack.glossary) {
        assert.ok(term.termEn.trim().length > 0, 'Engelse term');
        assert.ok(term.termNl.trim().length > 0, 'Nederlandse term');
        assert.ok(term.definition.nl.trim().length > 0, `NL-definitie van ${term.termEn}`);
        assert.ok(term.definition.en.trim().length > 0, `EN-definitie van ${term.termEn}`);
      }
    }
  });
});
