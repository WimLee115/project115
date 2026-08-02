import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import {
  daysUntil,
  formatClock,
  formatDuration,
  formatPercent,
  fromDateInput,
  toDateInput,
} from '../src/lib/format';

/**
 * Weergavefuncties.
 *
 * Klein grut, maar de klok in een examen mag niet verspringen en een
 * examendatum mag niet een dag verschuiven door een tijdzone. Beide gaan
 * makkelijk stuk en beide vallen op precies het verkeerde moment op.
 */

describe('formatClock', () => {
  test('toont minuten en seconden met vaste breedte', () => {
    assert.equal(formatClock(0), '00:00');
    assert.equal(formatClock(9), '00:09');
    assert.equal(formatClock(59), '00:59');
    assert.equal(formatClock(60), '01:00');
    assert.equal(formatClock(3599), '59:59');
  });

  test('schakelt over op uren zodra dat nodig is', () => {
    assert.equal(formatClock(3600), '1:00:00');
    assert.equal(formatClock(4271), '1:11:11');
  });

  test('gaat niet onder nul', () => {
    assert.equal(formatClock(-5), '00:00');
  });
});

describe('formatDuration', () => {
  test('rekent seconden om naar leesbare tijd', () => {
    assert.equal(formatDuration(45, 'nl'), '45 s');
    assert.equal(formatDuration(600, 'nl'), '10 min');
    assert.equal(formatDuration(3600, 'nl'), '1 u');
    assert.equal(formatDuration(3600, 'en'), '1 h');
    assert.equal(formatDuration(3900, 'nl'), '1 u 5 min');
  });
});

describe('formatPercent', () => {
  test('rondt af op hele procenten', () => {
    assert.equal(formatPercent(0), '0%');
    assert.equal(formatPercent(0.655), '66%');
    assert.equal(formatPercent(1), '100%');
  });

  test('toont een streepje wanneer er niets te tonen is', () => {
    assert.equal(formatPercent(null), '—');
    assert.equal(formatPercent(Number.NaN), '—');
  });
});

describe('datumvelden', () => {
  test('heen en terug levert dezelfde dag op', () => {
    const seconds = fromDateInput('2026-08-14');
    assert.ok(seconds !== null);
    assert.equal(toDateInput(seconds), '2026-08-14');
  });

  test('weigert onzin', () => {
    assert.equal(fromDateInput(''), null);
    assert.equal(fromDateInput('14-08-2026'), null);
    assert.equal(fromDateInput('2026-13-40'), null);
  });

  test('landt op middernacht lokale tijd en niet in UTC', () => {
    const seconds = fromDateInput('2026-08-14');
    assert.ok(seconds !== null);

    const date = new Date(seconds * 1000);
    assert.equal(date.getHours(), 0);
    assert.equal(date.getMinutes(), 0);
    assert.equal(date.getDate(), 14);
  });
});

describe('daysUntil', () => {
  test('telt hele dagen vanaf middernacht', () => {
    const today = new Date();
    today.setHours(23, 30, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(9, 0, 0, 0);

    // Vlak voor middernacht naar een examen van morgenochtend kijken moet
    // 'morgen' opleveren en niet 'vandaag'.
    assert.equal(daysUntil(Math.floor(tomorrow.getTime() / 1000)), 1);
  });

  test('geeft nul voor vandaag en negatief voor het verleden', () => {
    const now = Math.floor(Date.now() / 1000);
    assert.equal(daysUntil(now), 0);
    assert.ok(daysUntil(now - 3 * 86_400) < 0);
  });
});
