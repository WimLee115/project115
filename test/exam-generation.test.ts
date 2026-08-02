import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import { allocateByWeight } from '../src/lib/exam/allocation';

/**
 * Tests voor de verdeling van examenvragen over de examengebieden.
 *
 * De verdeling is de reden dat een proefexamen representatief is. Als de
 * afronding hier misgaat, krijg je een examen van 39 of 41 vragen, of een
 * domein dat structureel te licht is vertegenwoordigd.
 */

describe('allocateByWeight', () => {
  test('verdeelt 40 vragen volgens de ITIL-wegingen', () => {
    const weights = [
      { code: '1', weight: 30 },
      { code: '2', weight: 10 },
      { code: '3', weight: 10 },
      { code: '4', weight: 40 },
      { code: '5', weight: 5 },
      { code: '6', weight: 2.5 },
      { code: '7', weight: 2.5 },
    ];

    const result = allocateByWeight(weights, 40);

    assert.equal(result.get('1'), 12, '30% van 40 = 12');
    assert.equal(result.get('2'), 4, '10% van 40 = 4');
    assert.equal(result.get('3'), 4, '10% van 40 = 4');
    assert.equal(result.get('4'), 16, '40% van 40 = 16');
    assert.equal(result.get('5'), 2, '5% van 40 = 2');
    assert.equal(result.get('6'), 1, '2,5% van 40 = 1');
    assert.equal(result.get('7'), 1, '2,5% van 40 = 1');

    const total = [...result.values()].reduce((sum, n) => sum + n, 0);
    assert.equal(total, 40, 'het totaal moet exact 40 zijn');
  });

  test('verdeelt 40 vragen volgens de ISFS-wegingen', () => {
    const weights = [
      { code: '1', weight: 27.5 },
      { code: '2', weight: 12.5 },
      { code: '3', weight: 52.5 },
      { code: '4', weight: 7.5 },
    ];

    const result = allocateByWeight(weights, 40);
    const total = [...result.values()].reduce((sum, n) => sum + n, 0);

    assert.equal(total, 40, 'het totaal moet exact 40 zijn');
    assert.equal(result.get('3'), 21, '52,5% van 40 = 21');
    assert.equal(result.get('1'), 11, '27,5% van 40 = 11');
    assert.equal(result.get('2'), 5, '12,5% van 40 = 5');
    assert.equal(result.get('4'), 3, '7,5% van 40 = 3');
  });

  test('telt altijd exact op tot het gevraagde aantal, ook bij lastige afronding', () => {
    const weights = [
      { code: 'a', weight: 33.33 },
      { code: 'b', weight: 33.33 },
      { code: 'c', weight: 33.34 },
    ];

    for (const total of [1, 5, 7, 10, 40, 99]) {
      const result = allocateByWeight(weights, total);
      const sum = [...result.values()].reduce((acc, n) => acc + n, 0);
      assert.equal(sum, total, `verdeling van ${total} moet exact kloppen`);
    }
  });

  test('gaat om met een leeg gewicht zonder te crashen', () => {
    const result = allocateByWeight([{ code: 'a', weight: 0 }], 10);
    assert.equal(result.get('a'), 0);
  });
});
