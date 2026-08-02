# Project115

Tweetalige (NL/EN) studiehub voor **ITIL Foundation (Version 5)** en **EXIN
Information Security Foundation based on ISO/IEC 27001**.

Volledige proefexamens onder echte examencondities, spaced repetition met FSRS,
zwakke-plek-analyse per leerdoel en een tweetalig glossarium. Alles draait
lokaal; er gaat geen enkel gegeven het internet op.

*Ontwikkeld door B. van Rooij.*

---

> **Liever een leesbare handleiding?** `Project115 - Handleiding.pdf` in deze map
> is een opgemaakt document van 10 pagina's met alles wat je nodig hebt:
> opstarten, de examenwegingen, een studieaanpak in vier fasen en het oplossen
> van problemen. Opnieuw genereren: `npm run docs`.

## Starten

### De makkelijke manier

**Dubbelklik op `start.sh`** — of draai het vanuit een terminal:

```bash
./start.sh
```

Meer is het niet. Het script controleert of alles aanwezig is, installeert de
eerste keer wat nodig is, maakt een beveiligingssleutel en de database aan,
laadt de vragenbank en opent je browser. Bij problemen krijg je een melding in
gewone taal in plaats van een foutspoor.

Afsluiten: `Ctrl+C` in het venster. Is dat venster per ongeluk gesloten, dan
stopt `./stop.sh` de hub alsnog.

Wil je Project115 in je programmamenu? Kopieer het snelkoppelingsbestand:

```bash
cp Project115.desktop ~/.local/share/applications/
```

De eerste keer duurt het opstarten enkele minuten (onderdelen installeren en het
programma klaarmaken). Daarna is het een kwestie van seconden.

### Handmatig

```bash
npm install
cp .env.example .env
echo "APP_SECRET=$(openssl rand -base64 48)" >> .env
npm run setup     # database aanmaken en vragenbank laden
npm run dev       # of: npm run build && npm start
```

Open <http://localhost:3000>. De eerste keer kom je op het installatiescherm om
je account aan te maken.

### Docker met HTTPS in je eigen netwerk (aanbevolen)

```bash
# Daemon starten als die nog niet draait
sudo systemctl start docker

# Geheim en adres instellen
cp .env.example .env
echo "APP_SECRET=$(openssl rand -base64 48)" >> .env
# Pas SITE_ADDRESS aan naar het adres van deze machine, bijvoorbeeld:
#   SITE_ADDRESS=https://192.168.2.5
#   SITE_ADDRESS=https://project115.local

docker compose up -d --build
```

De hub is daarna bereikbaar op het adres uit `SITE_ADDRESS`, ook vanaf je
telefoon in hetzelfde netwerk.

**Certificaatwaarschuwing wegwerken.** Caddy maakt een eigen certificaatautoriteit
aan die je browser niet kent. Je kunt die eenmalig vertrouwen:

```bash
# CA-certificaat uit de container halen
docker compose cp caddy:/data/caddy/pki/authorities/local/root.crt ./caddy-root.crt

# Systeembreed vertrouwen op Debian/Kali
sudo cp caddy-root.crt /usr/local/share/ca-certificates/project115-caddy.crt
sudo update-ca-certificates
```

In Firefox voeg je het certificaat toe via *Instellingen → Privacy & Beveiliging
→ Certificaten → Certificaten weergeven → Autoriteiten → Importeren*.

---

## Gebruik

| Onderdeel | Waarvoor |
|---|---|
| **Dashboard** | Examengereedheid, dagen tot je examen, wat er te herhalen staat |
| **Proefexamen** | 40 vragen, 60 minuten, geen feedback — zoals het echte examen |
| **Oefenen** | Directe feedback met toelichting, of gericht op je zwakke plekken |
| **Herhalen** | Dagelijkse FSRS-wachtrij met vragen en begrippen |
| **Begrippen** | Doorzoekbaar NL/EN-glossarium, toe te voegen als flashcards |
| **Voortgang** | Score per examengebied en per leerdoel, scoreverloop |
| **Instellingen** | Examendatum, taal, tweestapsverificatie, gegevensexport |

**Sneltoetsen tijdens een examen:** `A`–`D` antwoorden, `←` `→` navigeren,
`F` markeren voor later.

---

## Beheer

```bash
npm run verify          # typecheck + alle tests + productiebuild
npm run test            # unit- en integratietests
npm run test:e2e        # end-to-end tegen een draaiende server
npm run db:seed         # vragenbank opnieuw laden (behoudt je voortgang)
npm run db:generate     # nieuwe migratie na een schemawijziging
```

### Back-up

De hele hub is één SQLite-bestand.

```bash
# Lokaal
cp data/project115.db "backups/project115-$(date +%F).db"

# Uit Docker
docker compose exec app sh -c 'cat /data/project115.db' > "backups/project115-$(date +%F).db"
```

Maak de back-up bij voorkeur terwijl er geen examen loopt. Via *Instellingen →
Gegevens exporteren* haal je daarnaast een leesbaar JSON-bestand op met al je
pogingen, antwoorden en herhaalschema.

---

## Vragen toevoegen of aanpassen

De vragenbank staat als TypeScript in `content/`, niet als losse data. Daardoor
vangt de compiler fouten die anders pas tijdens een proefexamen zouden opvallen.

```
content/
├── types.ts              # contentmodel
├── index.ts              # samenvoegen + validatie
├── itil5/
│   ├── structure.ts      # certificering, examengebieden, 95 leerdoelen
│   ├── questions-*.ts    # 100 vragen, alle 95 leerdoelen gedekt
│   └── glossary.ts       # 62 begrippen
└── isfs/
    ├── structure.ts      # certificering, exameneisen, 31 leerdoelen
    ├── questions-*.ts    # 60 vragen, alle 31 exameneisen gedekt
    └── glossary.ts       # 58 begrippen
```

Een vraag toevoegen:

```ts
{
  id: 'itil5-q101',           // uniek, nooit hergebruiken
  objective: '4.2.5',         // bestaand criterium uit structure.ts
  type: 'standard',           // standard | negative | missing_word | list
  bloom: 2,
  difficulty: 2,
  stem: { nl: '...', en: '...' },
  options: [
    { text: { nl: '...', en: '...' }, correct: true },
    { text: { nl: '...', en: '...' }, rationale: { nl: 'Waarom fout...', en: '...' } },
    // precies vier opties, precies één juist
  ],
  explanation: { nl: '...', en: '...' },
  source: 'Syllabus 4.2.5',
}
```

Daarna `npm run test:unit` (de validator draait mee) en `npm run db:seed`. Je
studievoortgang blijft behouden: het seeden werkt bij als update, niet als
opnieuw aanmaken.

---

## Beveiliging in het kort

- Argon2id-wachtwoorden, TOTP-tweestapsverificatie, versleutelde secrets
- Sessietokens alleen gehasht in de database, met een absolute vervaltermijn
- CSP met een nonce per request, geen `unsafe-inline` voor scripts
- Rate limiting en accountvergrendeling tegen brute force
- Append-only auditlog van beveiligingsgebeurtenissen
- Container draait als niet-root met read-only bestandssysteem
- Geen uitgaand verkeer, geen telemetrie, geen externe afhankelijkheden bij runtime

Volledige verantwoording in [PLAN.md](./PLAN.md).

---

## Verantwoording van de inhoud

De vragen zijn origineel geschreven op basis van de officiële leerdoelen uit de
PeopleCert-syllabus en de EXIN preparation guide, en inhoudelijk geverifieerd
tegen het cursusmateriaal en de voorgeschreven examenliteratuur. Er zijn geen
examenvragen overgenomen.

ITIL® en PRINCE2® zijn geregistreerde handelsmerken van PeopleCert. EXIN® is een
geregistreerd handelsmerk van EXIN Holding B.V. Dit project is niet gelieerd aan
of goedgekeurd door PeopleCert of EXIN.

---

## Techniek

Next.js 16 (App Router) · React 19 · TypeScript strict · Tailwind CSS 4 ·
Drizzle ORM · SQLite · Zod 4 · ts-fsrs · Argon2id · Caddy 2

Node.js 20.9 of hoger.
