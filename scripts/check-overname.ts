/**
 * Controleert of er formuleringen terugkeren die eerder als overgenomen zijn
 * herkend en herschreven.
 *
 * In 1.0.0 stonden er definities in de vragenbank die grotendeels letterlijk
 * uit het bronmateriaal kwamen. Die zijn in 1.1.0 herschreven, maar die
 * operatie keek alleen naar het veld `definition` in het glossarium en naar de
 * `text` van antwoordopties. Daardoor bleven dezelfde zinnen staan in `stem`,
 * `explanation` en `rationale` — velden die niemand had nagelopen. Dit script
 * kijkt naar alle vijf.
 *
 * Hoe het werkt zonder het bronmateriaal terug te zetten: van elke verwijderde
 * formulering zijn groepen van acht opeenvolgende woorden genomen en per groep
 * is een SHA-256 opgeslagen, ingekort tot twaalf tekens. Uit die hashes is de
 * oorspronkelijke tekst niet terug te rekenen, maar een woordgroep die
 * terugkeert levert wel dezelfde hash op. Het bestand met vingerafdrukken
 * bevat dus geen letter beschermde tekst.
 *
 * Acht woorden is de maat die ook bij het herschrijven is gebruikt. Korter
 * levert ruis op — twee mensen die dezelfde vakterm uitleggen gebruiken nu
 * eenmaal dezelfde vier woorden. Langer laat te veel door.
 *
 * Een treffer is een signaal, geen bewijs. Sommige formuleringen zijn zo
 * gangbaar dat ze niet te vermijden zijn. Loop ze na en herschrijf wat
 * inhoudelijk uit de bron komt.
 *
 *   npx tsx scripts/check-overname.ts
 *   npx tsx scripts/check-overname.ts 5     (pas vanaf 5 groepen melden)
 */
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { contentPacks } from '../content/index';

const HIER = dirname(fileURLToPath(import.meta.url));
const WORTEL = join(HIER, '..');
const VINGERAFDRUKKEN = join(HIER, 'overgenomen-formuleringen.json');

/** Vanaf hoeveel gedeelde woordgroepen een fragment wordt gemeld. */
const DREMPEL = Number(process.argv[2] ?? 1);

const GROEP = 8;

/**
 * Zelfde normalisatie als bij het aanmaken van de vingerafdrukken. Accenten
 * eraf en leestekens weg, zodat een herschrijving die alleen de interpunctie
 * verandert er niet doorheen glipt.
 */
function woorden(tekst: string): string[] {
  return tekst
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9 ]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

function groepen(tekst: string): Set<string> {
  const w = woorden(tekst);
  const uit = new Set<string>();
  for (let i = 0; i + GROEP <= w.length; i++) {
    uit.add(createHash('sha256').update(w.slice(i, i + GROEP).join(' ')).digest('hex').slice(0, 12));
  }
  return uit;
}

type Fragment = { waar: string; veld: string; tekst: string };

/** Alles wat een lezer te zien krijgt: stem, opties, rationales, uitleg, begrippen. */
function teVerzamelen(): Fragment[] {
  const uit: Fragment[] = [];
  const beide = (waar: string, veld: string, t: { nl: string; en: string }) => {
    uit.push({ waar, veld: `${veld}.nl`, tekst: t.nl });
    uit.push({ waar, veld: `${veld}.en`, tekst: t.en });
  };

  for (const pack of contentPacks) {
    for (const v of pack.questions) {
      beide(v.id, 'stem', v.stem);
      beide(v.id, 'explanation', v.explanation);
      v.options.forEach((o, i) => {
        beide(v.id, `options[${i}].text`, o.text);
        if (o.rationale) beide(v.id, `options[${i}].rationale`, o.rationale);
      });
    }
    for (const b of pack.glossary) {
      beide(b.termEn, 'definition', b.definition);
      if (b.note) beide(b.termEn, 'note', b.note);
    }
  }
  return uit;
}

const bestand = JSON.parse(readFileSync(VINGERAFDRUKKEN, 'utf8')) as {
  groepsgrootte: number;
  herkomst: string;
  hashes: string[];
};

if (bestand.groepsgrootte !== GROEP) {
  console.error(
    `De vingerafdrukken zijn gemaakt met groepen van ${bestand.groepsgrootte} woorden, dit script rekent met ${GROEP}.`,
  );
  process.exit(2);
}

const bekend = new Set(bestand.hashes);
const treffers: { waar: string; veld: string; aantal: number; tekst: string }[] = [];

for (const f of teVerzamelen()) {
  let aantal = 0;
  for (const h of groepen(f.tekst)) if (bekend.has(h)) aantal++;
  if (aantal >= DREMPEL) treffers.push({ ...f, aantal });
}

treffers.sort((a, b) => b.aantal - a.aantal);

const pad = relative(WORTEL, VINGERAFDRUKKEN);
console.log(
  `\n${bekend.size} vingerafdrukken uit ${pad}, groepen van ${GROEP} woorden.\n` +
    `Herkomst: ${bestand.herkomst}\n`,
);

if (treffers.length === 0) {
  console.log('Geen fragment deelt nog een woordgroep met de herschreven formuleringen.\n');
  process.exit(0);
}

console.log(`${treffers.length} fragment(en) met overlap, aflopend gesorteerd:\n`);
for (const t of treffers) {
  const kort = t.tekst.length > 110 ? `${t.tekst.slice(0, 110)}...` : t.tekst;
  console.log(`  ${String(t.aantal).padStart(3)} groep(en)  ${t.waar}  ${t.veld}`);
  console.log(`               ${kort.replace(/\n/g, ' ')}\n`);
}

console.log(
  'Dit is een signaal, geen fout. Korte, gangbare vaktaal levert onvermijdelijk\n' +
    'overlap op; loop na welke fragmenten inhoudelijk uit het bronmateriaal komen.\n',
);
