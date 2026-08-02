/**
 * Controleert de vragenbank zonder er een database bij nodig te hebben.
 *
 * `npm run db:seed` doet deze controle ook, maar pas op het moment dat je
 * seedt. Dit script draait los, en daarmee in de CI: elke pull request die de
 * content raakt, valt door de mand voordat er iets wordt uitgegeven.
 *
 * Gecontroleerd wordt onder meer of elk assessment-criterium door een vraag
 * gedekt is, of de wegingen per examengebied optellen tot 100%, en of elke
 * vraag precies vier opties heeft met precies één juist antwoord. Wat er
 * precies wordt nagelopen staat in content/index.ts, functie validatePack.
 *
 *   npm run validate
 */
import { contentPacks, validateAll, packStats } from '../content/index';

const issues = validateAll();
const errors = issues.filter((i) => i.severity === 'error');
const warnings = issues.filter((i) => i.severity === 'warning');

/* --- Overzicht per pakket --------------------------------------------- */

for (const pack of contentPacks) {
  const s = packStats(pack);
  console.log(`\n[${s.certification}]`);
  console.log(`  vragen:      ${s.totalQuestions}`);
  console.log(`  leerdoelen:  ${s.totalObjectives}`);

  for (const d of s.byDomain) {
    const dekking =
      d.objectiveCount === 0
        ? '—'
        : `${d.coveredObjectives}/${d.objectiveCount}`;
    const gat = d.coveredObjectives < d.objectiveCount ? '  <- niet compleet' : '';
    console.log(
      `    ${d.code.padEnd(4)} ${String(d.weight).padStart(5)}%` +
        `  ${String(d.questionCount).padStart(3)} vragen` +
        `  leerdoelen gedekt: ${dekking}${gat}`,
    );
  }
}

/* --- Uitkomst ---------------------------------------------------------- */

if (warnings.length > 0) {
  console.warn(`\n${warnings.length} waarschuwing(en):`);
  for (const w of warnings.slice(0, 25)) {
    console.warn(`  - [${w.pack}${w.questionId ? `/${w.questionId}` : ''}] ${w.message}`);
  }
  if (warnings.length > 25) console.warn(`  ... en nog ${warnings.length - 25}`);
}

if (errors.length > 0) {
  console.error(`\nAFGEBROKEN — ${errors.length} fout(en) in de content:`);
  for (const e of errors) {
    console.error(`  - [${e.pack}${e.questionId ? `/${e.questionId}` : ''}] ${e.message}`);
  }
  process.exit(1);
}

console.log(`\nDe vragenbank is in orde — ${warnings.length} waarschuwing(en), geen fouten.`);
