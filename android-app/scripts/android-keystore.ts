import { execFileSync } from 'node:child_process';
import { randomBytes } from 'node:crypto';
import { existsSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Maakt de sleutel waarmee uitgaven van de app worden ondertekend.
 *
 * Android installeert geen APK zonder handtekening, en — belangrijker — het
 * accepteert alleen een update die met dezélfde sleutel is ondertekend. De
 * sleutel is daarmee geen formaliteit maar het enige wat een volgende versie
 * over de bestaande installatie heen laat gaan.
 *
 * Het wachtwoord wordt hier gegenereerd en niet gevraagd. Een zelfbedacht
 * wachtwoord dat je toch in een bestand moet zetten om te kunnen bouwen, is
 * geen wachtwoord maar een formaliteit; dan liever 32 willekeurige bytes die
 * niet ergens anders ook in gebruik zijn.
 */

const root = fileURLToPath(new URL('..', import.meta.url));
const keystore = join(root, 'release-key.jks');
const properties = join(root, 'android/keystore.properties');

const ALIAS = 'project115';
/** Ruim langer dan de app zal bestaan; verlopen is hier alleen maar last. */
const VALIDITY_DAYS = 10_000;

if (existsSync(keystore)) {
  console.error(`De sleutel bestaat al: ${keystore}`);
  console.error('Overschrijven zou elke bestaande installatie onopwaardeerbaar maken.');
  console.error('Verwijder het bestand handmatig als je zeker weet dat je opnieuw wilt beginnen.');
  process.exit(1);
}

const javaHome = process.env.JAVA_HOME;
const keytool = javaHome ? join(javaHome, 'bin/keytool') : 'keytool';

// base64url: geen tekens die in een properties-bestand of een shell iets
// betekenen.
const password = randomBytes(24).toString('base64url');

execFileSync(
  keytool,
  [
    '-genkeypair',
    '-v',
    '-keystore', keystore,
    '-alias', ALIAS,
    '-keyalg', 'RSA',
    '-keysize', '4096',
    '-validity', String(VALIDITY_DAYS),
    '-storepass', password,
    '-keypass', password,
    '-dname', 'CN=B. van Rooij, OU=Project115, O=Project115, C=NL',
  ],
  { stdio: 'inherit' },
);

writeFileSync(
  properties,
  `# Ondertekening van de uitgave-APK.
#
# NOOIT MEEVERSPREIDEN. Dit bestand en release-key.jks staan in .gitignore en
# worden overgeslagen door scripts/package-release.ts.
#
# Wie deze twee heeft, kan een update uitbrengen die Android accepteert als
# jouw app. Bewaar een kopie op een veilige plek buiten dit project; raak je ze
# kwijt, dan kun je geen update meer uitbrengen over een bestaande installatie.

storeFile=../release-key.jks
storePassword=${password}
keyAlias=${ALIAS}
keyPassword=${password}
`,
  { encoding: 'utf8', mode: 0o600 },
);

console.log('');
console.log(`[android] sleutel aangemaakt: ${keystore}`);
console.log(`[android] wachtwoord staat in: ${properties}`);
console.log('');
console.log('Maak nu een kopie van beide bestanden op een veilige plek buiten dit');
console.log('project. Zonder die twee kun je later geen update uitbrengen die over');
console.log('een bestaande installatie heen gaat.');
