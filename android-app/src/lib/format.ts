import type { Locale } from './content';

/**
 * Weergave van datums, tijden en getallen.
 *
 * Op één plek, want een examentijd die op het ene scherm '58:02' is en op het
 * andere '58 min' laat je twijfelen of je hetzelfde ziet. Alle tijdstempels in
 * deze app zijn Unix-seconden in UTC; de omzetting naar lokale tijd gebeurt
 * hier en nergens anders.
 */

const dateFormats: Record<Locale, Intl.DateTimeFormat> = {
  nl: new Intl.DateTimeFormat('nl-NL', { day: 'numeric', month: 'short', year: 'numeric' }),
  en: new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
};

const dateTimeFormats: Record<Locale, Intl.DateTimeFormat> = {
  nl: new Intl.DateTimeFormat('nl-NL', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }),
  en: new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }),
};

export function formatDate(seconds: number, locale: Locale): string {
  return dateFormats[locale].format(new Date(seconds * 1000));
}

export function formatDateTime(seconds: number, locale: Locale): string {
  return dateTimeFormats[locale].format(new Date(seconds * 1000));
}

/**
 * Klok voor de aftellende examentijd: `mm:ss`, of `u:mm:ss` zodra het over een
 * uur gaat. Altijd twee cijfers, zodat de breedte niet springt bij elke tik.
 */
export function formatClock(seconds: number): string {
  const safe = Math.max(0, Math.floor(seconds));
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  const rest = safe % 60;

  const mm = String(minutes).padStart(2, '0');
  const ss = String(rest).padStart(2, '0');

  return hours > 0 ? `${hours}:${mm}:${ss}` : `${mm}:${ss}`;
}

/** Verstreken tijd in woorden, voor een examenrapport. */
export function formatDuration(seconds: number, locale: Locale): string {
  const safe = Math.max(0, Math.floor(seconds));
  if (safe < 60) return `${safe} s`;

  const minutes = Math.floor(safe / 60);
  if (minutes < 60) return `${minutes} min`;

  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest === 0
    ? `${hours} ${locale === 'nl' ? 'u' : 'h'}`
    : `${hours} ${locale === 'nl' ? 'u' : 'h'} ${rest} min`;
}

/**
 * Hele dagen tot een datum, gerekend vanaf middernacht.
 *
 * Vanaf middernacht en niet vanaf het huidige tijdstip: een examen morgen om
 * negen uur is 'morgen', ook als je er om elf uur 's avonds naar kijkt.
 */
export function daysUntil(seconds: number): number {
  const target = new Date(seconds * 1000);
  target.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return Math.round((target.getTime() - today.getTime()) / 86_400_000);
}

/** Percentage zonder decimalen; `null` wordt een streepje. */
export function formatPercent(ratio: number | null): string {
  if (ratio === null || !Number.isFinite(ratio)) return '—';
  return `${Math.round(ratio * 100)}%`;
}

/** Datum als `jjjj-mm-dd` voor een `<input type="date">`. */
export function toDateInput(seconds: number): string {
  const date = new Date(seconds * 1000);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

/**
 * Leest `jjjj-mm-dd` terug naar Unix-seconden op middernacht lokale tijd.
 * Geeft `null` bij een leeg of ongeldig veld.
 */
export function fromDateInput(value: string): number | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  const date = new Date(year, month - 1, day, 0, 0, 0, 0);
  if (Number.isNaN(date.getTime())) return null;

  // `new Date(2026, 12, 40)` is geen fout maar 9 januari 2027. Terugrekenen is
  // de enige manier om onmogelijke datums te herkennen — een dag 31 in februari
  // hoort niet stilletjes maart te worden.
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return Math.floor(date.getTime() / 1000);
}
