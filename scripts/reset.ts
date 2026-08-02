/**
 * Zet de database terug naar de begintoestand.
 *
 * Dit verwijdert de databasebestanden en bouwt ze opnieuw op met `db:migrate`
 * en `db:seed`. De content komt daarmee terug; je studiegegevens niet.
 *
 * Weg zijn: je pogingen, je antwoorden, je herhaalschema, je instellingen en je
 * aanmeldgegevens. Dat is het hele punt van dit script, maar het is ook precies
 * wat je een week voor een examen niet per ongeluk wilt doen. Daarom vraagt het
 * om bevestiging, tenzij je `--force` meegeeft.
 *
 *   npm run db:reset
 *   npm run db:reset -- --force
 *
 * Wil je alleen de vragenbank bijwerken en je voortgang behouden, gebruik dan
 * `npm run db:seed`. Dat script is idempotent en laat je historie met rust.
 *
 * (Alles staat in een async functie omdat dit project CommonJS is; top-level
 * await gaat daar niet.)
 */
import { createInterface } from 'node:readline/promises';
import { execFileSync } from 'node:child_process';
import { existsSync, rmSync, copyFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { stdin, stdout } from 'node:process';

async function main() {
  const path = resolve(process.env.DATABASE_PATH ?? './data/project115.db');
  const bestanden = [path, `${path}-wal`, `${path}-shm`];
  const aanwezig = bestanden.filter((f) => existsSync(f));
  const force = process.argv.includes('--force');

  console.log(`[reset] database: ${path}`);

  if (aanwezig.length === 0) {
    console.log('[reset] er staat nog geen database; alleen opbouwen');
  } else {
    if (!force) {
      console.log('');
      console.log('  Dit verwijdert je studiegegevens: pogingen, antwoorden,');
      console.log('  herhaalschema, instellingen en aanmeldgegevens.');
      console.log('');
      console.log('  Wil je alleen de vragenbank bijwerken? Gebruik `npm run db:seed`.');
      console.log('');

      const rl = createInterface({ input: stdin, output: stdout });
      const antwoord = await rl.question('  Typ "wissen" om door te gaan: ');
      rl.close();

      if (antwoord.trim().toLowerCase() !== 'wissen') {
        console.log('[reset] afgebroken, er is niets veranderd');
        process.exitCode = 1;
        return;
      }
    }

    // Een kopie kost niets en heeft al vaker een vergissing goedgemaakt.
    const backup = `${path}.backup`;
    copyFileSync(path, backup);
    console.log(`[reset] kopie van de oude database: ${backup}`);

    for (const f of aanwezig) rmSync(f);
    console.log(`[reset] ${aanwezig.length} bestand(en) verwijderd`);
  }

  const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
  execFileSync(npm, ['run', 'db:migrate'], { stdio: 'inherit' });
  execFileSync(npm, ['run', 'db:seed'], { stdio: 'inherit' });

  console.log('[reset] klaar');
}

main().catch((err) => {
  console.error('[reset] mislukt:', err instanceof Error ? err.message : err);
  process.exit(1);
});
