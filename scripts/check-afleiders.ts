/**
 * Controleert of afleiders nog wel duidelijk fout zijn.
 *
 * `validateAll` in content/index.ts bewaakt de structuur: precies één juist
 * antwoord, vier opties, elke afleider met een rationale. Wat het niet ziet, is
 * of een afleider inhoudelijk te dicht tegen het juiste antwoord aan is gaan
 * liggen. Dat is precies wat er misgaat als je definities herformuleert: twee
 * opties gaan hetzelfde betekenen en de vraag heeft opeens twee goede
 * antwoorden, zonder dat er iets aan de structuur mankeert.
 *
 * Dit script vergelijkt binnen elke vraag elke afleider met het juiste antwoord
 * en met de andere afleiders. Boven de drempel is het een signaal om zelf te
 * kijken — geen bewijs van een fout: 'menselijk, opzettelijk' en 'menselijk,
 * niet-opzettelijk' lijken sterk op elkaar en horen dat ook te doen.
 *
 *   npx tsx scripts/check-afleiders.ts
 *   npx tsx scripts/check-afleiders.ts 0.8      (strengere drempel)
 */
import { contentPacks } from '../content/index';

const DREMPEL = Number(process.argv[2] ?? 0.75);

/** Woorden die overal voorkomen en niets zeggen over de betekenis. */
const STOP = new Set([
  'de', 'het', 'een', 'van', 'en', 'of', 'die', 'dat', 'is', 'zijn', 'op', 'in',
  'te', 'voor', 'met', 'aan', 'bij', 'als', 'door', 'naar', 'uit', 'om', 'er',
  'the', 'a', 'an', 'of', 'and', 'or', 'that', 'is', 'are', 'to', 'for', 'with',
  'on', 'in', 'at', 'by', 'as', 'from', 'it', 'its',
]);

function woorden(t: string): Set<string> {
  return new Set(
    t
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9 ]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 2 && !STOP.has(w)),
  );
}

/** Jaccard: hoeveel betekenisdragende woorden delen twee teksten? */
function gelijkenis(a: string, b: string): number {
  const wa = woorden(a);
  const wb = woorden(b);
  if (wa.size === 0 || wb.size === 0) return 0;
  let gedeeld = 0;
  for (const w of wa) if (wb.has(w)) gedeeld++;
  return gedeeld / (wa.size + wb.size - gedeeld);
}

let vragen = 0;
let signalen = 0;

for (const pack of contentPacks) {
  for (const q of pack.questions) {
    vragen++;
    const juist = q.options.find((o) => o.correct === true);
    if (!juist) continue;

    for (const taal of ['nl', 'en'] as const) {
      const goed = juist.text?.[taal];
      if (!goed) continue;

      for (const [i, optie] of q.options.entries()) {
        if (optie.correct) continue;
        const fout = optie.text?.[taal];
        if (!fout) continue;

        const r = gelijkenis(goed, fout);
        if (r >= DREMPEL) {
          signalen++;
          console.log(`\n[${pack.certification.id}] ${q.id} — afleider ${i + 1} (${taal}) lijkt ${Math.round(r * 100)}% op het juiste antwoord`);
          console.log(`  vraag:    ${q.stem?.[taal]?.slice(0, 90) ?? '?'}`);
          console.log(`  juist:    ${goed}`);
          console.log(`  afleider: ${fout}`);
          if (optie.rationale?.[taal]) {
            console.log(`  rationale: ${optie.rationale[taal]}`);
          }
        }
      }
    }
  }
}

console.log(`\n${vragen} vragen nagelopen bij drempel ${DREMPEL}.`);
if (signalen === 0) {
  console.log('Geen afleider komt te dicht bij zijn juiste antwoord.');
} else {
  console.log(`${signalen} signaal(en) om zelf na te kijken — dit zijn geen fouten, maar plekken waar het onderscheid dun is.`);
}
