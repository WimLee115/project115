import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';

import { sha256Hex, stableId } from '../src/lib/id';
import { certifications, domains, glossary, objectives, questions } from '../src/lib/content';
import { contentPacks } from '../../content/index';

/**
 * Identifiertests.
 *
 * Dit is de belangrijkste test van de app-versie, en tegelijk de saaiste. De
 * webversie kent zijn content-id's toe met `createHash('sha256')` uit Node; de
 * app doet dat met een eigen implementatie omdat die module in een WebView niet
 * bestaat. Wijken die twee ook maar één byte af, dan verwijst een geïmporteerd
 * herhaalschema naar vragen die niet bestaan — en dat merk je pas als je
 * voortgang stilletjes leeg blijkt.
 */

/** Zoals `stableId` in `scripts/seed.ts` van de webversie. */
function referenceStableId(prefix: string, ...parts: string[]): string {
  const hash = createHash('sha256').update(parts.join(' ')).digest('hex');
  return `${prefix}_${hash.slice(0, 24)}`;
}

describe('sha256Hex', () => {
  test('komt overeen met node:crypto voor bekende invoer', () => {
    const samples = [
      '',
      'a',
      'abc',
      'Project115',
      'itil5 itil5-q001 A',
      // Precies op de blokgrens: 55, 56 en 64 tekens dekken de padding-randen af.
      'x'.repeat(55),
      'x'.repeat(56),
      'x'.repeat(64),
      'x'.repeat(1000),
      // Meerbyte-tekens, want de vragenbank staat er vol mee.
      'beschikbaarheid, integriteit én vertrouwelijkheid',
      'Grün — naïve façade 日本語',
    ];

    for (const sample of samples) {
      assert.equal(
        sha256Hex(sample),
        createHash('sha256').update(sample).digest('hex'),
        `afwijkende hash voor ${JSON.stringify(sample.slice(0, 40))}`,
      );
    }
  });
});

describe('stableId', () => {
  test('heeft de vorm prefix_24hex', () => {
    assert.match(stableId('q', 'itil5', 'itil5-q001'), /^q_[0-9a-f]{24}$/);
  });

  test('is gelijk aan de berekening van de webversie voor élke certificering', () => {
    for (const certification of certifications) {
      assert.equal(certification.id, certification.id, 'certificerings-id komt uit de bron');
    }

    for (const domain of domains) {
      assert.equal(
        domain.id,
        referenceStableId('dom', domain.certificationId, domain.code),
      );
    }

    for (const objective of objectives) {
      assert.equal(
        objective.id,
        referenceStableId('obj', objective.certificationId, objective.code),
      );
    }

    for (const question of questions) {
      assert.equal(
        question.id,
        referenceStableId('q', question.certificationId, question.seedId),
      );

      for (const option of question.options) {
        assert.equal(
          option.id,
          referenceStableId('opt', question.certificationId, question.seedId, option.label),
        );
      }
    }

    for (const term of glossary) {
      assert.equal(
        term.id,
        referenceStableId('term', term.certificationId, term.termEn),
      );
    }
  });

  test('dekt de volledige vragenbank en niet slechts een deel ervan', () => {
    const expected = contentPacks.reduce((sum, pack) => sum + pack.questions.length, 0);
    assert.equal(questions.length, expected, 'elke bronvraag moet zijn ingelezen');
    assert.ok(questions.length > 100, 'de vragenbank hoort niet leeg te zijn');
  });
});
