# Project115 voor Android en de browser

Offline studiehub voor **ITIL Foundation (Version 5)** en **EXIN Information
Security Foundation based on ISO/IEC 27001**.

Ontwikkeld door B. van Rooij.

Dezelfde code levert twee verpakkingen op:

| | Android-app | Browserversie |
|---|---|---|
| Uitvoer | `dist/` → APK | `dist-web/` |
| Installatie | APK op het toestel | link openen, eventueel toevoegen aan beginscherm |
| Offline | altijd | na het eerste bezoek, via een service worker |
| Opslag | IndexedDB op het toestel | IndexedDB in de browser |
| Server nodig | nee | alleen om de bestanden te serveren |

Geen van beide heeft een account, een backend of een internetverbinding nodig.

## Waarom dit naast de webversie bestaat

De webversie in de bovenliggende map is een Next.js-applicatie met accounts,
sessies en SQLite, bedoeld om in Docker te draaien op je eigen netwerk. Dat is
de juiste vorm voor een studiehub op je pc, maar niet voor een telefoon in de
trein: je wilt daar geen server aanzetten en geen inlogscherm doorlopen.

Deze versie draait daarom volledig op het toestel. Wat dat betekent voor de
architectuur staat per bestand in de kop van dat bestand toegelicht; de
belangrijkste keuzes:

- **IndexedDB in plaats van SQLite** (`src/lib/store.ts`). Alleen jouw
  voortgang wordt opgeslagen — enkele duizenden kleine records na een jaar
  studeren. Daar is geen queryplanner voor nodig, wel een opslag die zonder
  native plugin werkt.
- **De vragenbank in het geheugen** (`src/lib/content.ts`). Circa 160 vragen en
  120 begrippen, statisch en read-only. Ze komen uit `../content`, dezelfde
  bron als de webversie — een kopie zou onvermijdelijk gaan afwijken.
- **Eigen id-berekening** (`src/lib/id.ts`). De webversie hasht zijn content-id's
  met `node:crypto`; dat bestaat in een WebView niet. De implementatie hier moet
  daar byte voor byte gelijk aan zijn, anders wijst een geïmporteerd
  herhaalschema naar vragen die niet bestaan. `test/id.test.ts` bewaakt dat over
  de volledige vragenbank.
- **PBKDF2 in plaats van Argon2id** (`src/lib/lock.ts`). De pincode beschermt
  tegen iemand die je ontgrendelde telefoon even vasthoudt, niet tegen iemand
  die het toestel root. Dat staat ook zo in de app.
- **Geen routerbibliotheek, geen vertaalbibliotheek, geen grafiekbibliotheek.**
  Tien routes, twee talen en acht staafjes passen elk in vijftig regels.

De volledige verantwoording van de examenwegingen, de contentherkomst en de
beveiliging staat in `../PLAN.md`.

## Ontwikkelen

Vereist **Node 22 of hoger** (de Capacitor-CLI weigert lager).

```bash
npm install
npm run dev          # http://localhost:5173
```

De app draait in een gewone browser; alleen de trilfeedback en het delen van een
export doen daar niets.

## Controleren

```bash
npm run verify       # typecontrole + tests + beide builds
```

Losse onderdelen:

```bash
npm run typecheck
npm run test
```

De tests draaien tegen de échte vragenbank en niet tegen fixtures. Ze bewaken
onder meer dat elk examengebied gevuld kan worden volgens de officiële weging,
dat lijstvragen hun optievolgorde houden, en dat de id-berekening gelijk is aan
die van de webversie.

## Browserversie bouwen

```bash
npm run build:web    # → dist-web/
npm run preview:web  # lokaal bekijken
```

`scripts/build-web.ts` bouwt met Vite en voegt daarna het manifest en een
service worker toe. Die service worker zit bewust **niet** in de Android-build:
daar staan de bestanden al op het toestel, en een cache ernaast zou een oude
versie kunnen vasthouden naast een net geïnstalleerde update.

De inhoud van `dist-web/` kan op elke webserver of statische host. Er is geen
build-stap op de server nodig en geen configuratie behalve het serveren van de
bestanden.

## Android-app bouwen

Vereist naast Node 22 ook:

- **JDK 21** (`/usr/lib/jvm/java-21-openjdk-amd64` op deze machine)
- de **Android SDK** met platform 36 en build-tools 36
- ImageMagick 7, alleen voor `npm run android:assets`

```bash
export JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64
export ANDROID_HOME="$HOME/Android/Sdk"

npm run android:assets     # icoon en startscherm (eenmalig, of na een wijziging)
npm run android:debug      # testbouw, ondertekend met de debugsleutel
npm run android:release    # uitgave, ondertekend met de eigen sleutel
```

De map `android/` is gegenereerd door `npx cap add android` en mag opnieuw
gegenereerd worden; `npm run android:assets` zet het icoon en het startscherm
daarna terug.

### Ondertekenen

Een APK moet ondertekend zijn voordat Android hem installeert. De debugbouw
gebruikt de standaard debugsleutel en is alleen geschikt om zelf te testen.

Voor een uitgave hoort een eigen sleutel:

```bash
npm run android:keystore   # maakt release-key.jks en keystore.properties
```

> **Bewaar `release-key.jks` en het wachtwoord op een veilige plek buiten dit
> project.** Raak je de sleutel kwijt, dan kun je geen update meer uitbrengen
> die over de bestaande installatie heen gaat; iedereen die de app heeft moet
> hem dan eerst verwijderen. Beide bestanden staan in `.gitignore` en horen
> nooit mee te gaan in wat je verspreidt.

## Verspreiden

Zie `../docs/verspreiding.md`.

## Gegevens uitwisselen met de webversie

Beide versies schrijven hetzelfde JSON-formaat. Een export uit de webversie kun
je hier inlezen en andersom, via **Instellingen › Gegevens**. Wat er niet in
gaat: wachtwoordhashes, sessietokens en TOTP-secrets — dat zijn inloggegevens,
geen studiegegevens, en ze horen niet in een bestand dat in een downloadmap of
een chat belandt.

Importeren **vervangt** wat er op het toestel staat en voegt niet samen.
Samenvoegen van twee herhaalschema's vereist een keuze per kaart over welk
'due'-moment geldt, en elke automatische keuze daarin is een gok met je
planning.
