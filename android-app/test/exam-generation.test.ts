import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import { certifications, domainsFor, getQuestion, questionsFor } from '../src/lib/content';
import { generateExam } from '../src/lib/exam';
import { allocateByWeight } from '../src/lib/allocation';

/**
 * Samenstelling van een proefexamen.
 *
 * Getest tegen de échte vragenbank en niet tegen verzonnen data: de vraag is
 * juist of de bank vol genoeg is om elk examengebied naar rato te vullen. Een
 * generator die op fixtures werkt maar in de praktijk een domein leeg laat,
 * merk je anders pas tijdens het oefenen.
 */

describe('generateExam', () => {
  for (const certification of certifications) {
    describe(certification.id, () => {
      test('levert het volledige aantal examenvragen', () => {
        const exam = generateExam({ certificationId: certification.id, seed: 1 });
        assert.equal(exam.length, certification.questionCount);
      });

      test('bevat geen enkele vraag dubbel', () => {
        const exam = generateExam({ certificationId: certification.id, seed: 2 });
        assert.equal(new Set(exam.map((item) => item.questionId)).size, exam.length);
      });

      test('volgt de officiële weging van de examengebieden', () => {
        const exam = generateExam({ certificationId: certification.id, seed: 3 });
        const wanted = allocateByWeight(domainsFor(certification.id), certification.questionCount);

        const actual = new Map<string, number>();
        for (const item of exam) {
          const question = getQuestion(item.questionId);
          assert.ok(question, 'elke gegenereerde vraag moet bestaan');
          actual.set(question.domainCode, (actual.get(question.domainCode) ?? 0) + 1);
        }

        for (const [code, expected] of wanted) {
          const available = questionsFor(certification.id).filter(
            (question) => question.domainCode === code,
          ).length;

          // Een gebied kan alleen tekortkomen als de bank er te weinig van heeft;
          // in dat geval vult de generator aan uit de andere gebieden.
          assert.equal(
            actual.get(code) ?? 0,
            Math.min(expected, available),
            `examengebied ${code} kreeg het verkeerde aantal vragen`,
          );
        }
      });

      test('geeft bij dezelfde seed exact hetzelfde examen', () => {
        assert.deepEqual(
          generateExam({ certificationId: certification.id, seed: 99 }),
          generateExam({ certificationId: certification.id, seed: 99 }),
        );
      });

      test('husselt de opties, behalve bij lijstvragen', () => {
        const exam = generateExam({ certificationId: certification.id, seed: 4 });

        for (const item of exam) {
          const question = getQuestion(item.questionId);
          assert.ok(question);

          const original = [...question.options]
            .sort((a, b) => a.sortOrder - b.sortOrder)
            .map((option) => option.id);

          assert.deepEqual(
            [...item.optionOrder].sort(),
            [...original].sort(),
            'de husselvolgorde mag geen opties toevoegen of weglaten',
          );

          if (question.type === 'list') {
            // Lijstvragen verwijzen naar genummerde uitspraken ('1 en 2');
            // husselen zou het antwoord onlogisch maken.
            assert.deepEqual(item.optionOrder, original, `${question.seedId} is een lijstvraag`);
          }
        }
      });
    });
  }

  test('beperkt zich tot de opgegeven leerdoelen', () => {
    const certification = certifications[0];
    assert.ok(certification);

    const objectiveId = questionsFor(certification.id)[0]?.objectiveId;
    assert.ok(objectiveId);

    const exam = generateExam({
      certificationId: certification.id,
      count: 5,
      objectiveIds: [objectiveId],
      seed: 5,
    });

    assert.ok(exam.length > 0, 'een gericht examen mag niet leeg zijn');
    for (const item of exam) {
      assert.equal(item.objectiveId, objectiveId);
    }
  });

  test('werpt een fout bij een onbekende certificering', () => {
    assert.throws(() => generateExam({ certificationId: 'bestaat-niet' }), /Onbekende certificering/);
  });

  test('mijdt recent geziene vragen zolang er alternatieven zijn', () => {
    const certification = certifications[0];
    assert.ok(certification);

    const pool = questionsFor(certification.id);
    const excluded = pool.slice(0, 5).map((question) => question.id);

    const exam = generateExam({
      certificationId: certification.id,
      count: 5,
      excludeQuestionIds: excluded,
      seed: 6,
    });

    for (const item of exam) {
      assert.ok(
        !excluded.includes(item.questionId),
        'een recent geziene vraag hoort niet terug te komen zolang de bank ruimte biedt',
      );
    }
  });
});
