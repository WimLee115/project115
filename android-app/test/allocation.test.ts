import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import { allocateByWeight, createRandom, shuffle } from '../src/lib/allocation';

/**
 * Verdeling van examenvragen over de examengebieden.
 *
 * Dezelfde tests als in de webversie, en dat is precies de bedoeling: de
 * verdeling bepaalt of een proefexamen representatief is, en die mag niet per
 * platform verschillen.
 */

const ITIL_WEIGHTS = [
  { code: '1', weight: 30 },
  { code: '2', weight: 10 },
  { code: '3', weight: 10 },
  { code: '4', weight: 40 },
  { code: '5', weight: 5 },
  { code: '6', weight: 2.5 },
  { code: '7', weight: 2.5 },
];

describe('allocateByWeight', () => {
  test('verdeelt 40 vragen volgens de ITIL-wegingen', () => {
    const allocation = allocateByWeight(ITIL_WEIGHTS, 40);

    assert.equal(allocation.get('1'), 12);
    assert.equal(allocation.get('2'), 4);
    assert.equal(allocation.get('3'), 4);
    assert.equal(allocation.get('4'), 16);
    assert.equal(allocation.get('5'), 2);
    assert.equal(allocation.get('6'), 1);
    assert.equal(allocation.get('7'), 1);
  });

  test('telt altijd exact op tot het gevraagde aantal', () => {
    // De grootste-restmethode moet bij elk aantal sluitend zijn; afronden per
    // gebied zou hier een examen van 39 of 41 vragen opleveren.
    for (let total = 1; total <= 120; total++) {
      const allocation = allocateByWeight(ITIL_WEIGHTS, total);
      const sum = [...allocation.values()].reduce((acc, value) => acc + value, 0);
      assert.equal(sum, total, `verdeling van ${total} vragen telt niet op tot ${total}`);
    }
  });

  test('geeft nul terug wanneer alle wegingen nul zijn', () => {
    const allocation = allocateByWeight([{ code: 'a', weight: 0 }], 10);
    assert.equal(allocation.get('a'), 0);
  });

  test('verdeelt niets wanneer er geen gebieden zijn', () => {
    assert.equal(allocateByWeight([], 40).size, 0);
  });
});

describe('shuffle', () => {
  test('laat de invoer ongemoeid en behoudt alle elementen', () => {
    const input = [1, 2, 3, 4, 5];
    const output = shuffle(input, createRandom(42));

    assert.deepEqual(input, [1, 2, 3, 4, 5], 'de invoer mag niet wijzigen');
    assert.deepEqual([...output].sort((a, b) => a - b), input);
  });

  test('is deterministisch bij een vaste seed', () => {
    const items = Array.from({ length: 20 }, (_, index) => index);
    assert.deepEqual(shuffle(items, createRandom(7)), shuffle(items, createRandom(7)));
  });

  test('geeft bij verschillende seeds een andere volgorde', () => {
    const items = Array.from({ length: 20 }, (_, index) => index);
    assert.notDeepEqual(shuffle(items, createRandom(1)), shuffle(items, createRandom(2)));
  });
});

describe('createRandom', () => {
  test('blijft binnen [0, 1)', () => {
    const random = createRandom(123);
    for (let i = 0; i < 1000; i++) {
      const value = random();
      assert.ok(value >= 0 && value < 1, `waarde buiten bereik: ${value}`);
    }
  });
});
