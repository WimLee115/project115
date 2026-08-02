# Project115 — plan en verantwoording

**Tweetalige studiehub voor ITIL Foundation (Version 5) en EXIN Information Security Foundation based on ISO/IEC 27001.**

Ontwikkeld door B. van Rooij.

---

## 1. Wat dit moet opleveren

Twee examens halen, allebei met cesuur 65%. Alles in deze applicatie is daarop
gericht. Concreet:

| | ITIL Foundation (Version 5) | EXIN ISFS (ISO/IEC 27001) |
|---|---|---|
| Aanbieder | PeopleCert | EXIN |
| Vragen | 40 | 40 |
| Tijd | 60 min (+15 min extra tijd) | 60 min |
| Cesuur | 26 goed (65%) | 26 goed (65%) |
| Boek | Gesloten | Gesloten |
| Bloom | 40% niveau 1, 60% niveau 2 | Niveau 1 en 2 |
| Taal examen | Engels | Nederlands |

De extra tijd bij ITIL is de 25% die PeopleCert toekent wanneer het examen niet
in je moedertaal is. Die is als optie in de app opgenomen, zodat je kunt oefenen
onder precies de condities die op de examendag gelden.

### Weging van de examengebieden

Deze getallen bepalen hoeveel vragen een gegenereerd proefexamen per gebied
trekt. Ze komen uit de officiële syllabus en preparation guide, niet uit een
schatting.

**ITIL Foundation (Version 5)**

| # | Examengebied | Weging | Vragen per examen |
|---|---|---|---|
| 1 | Kernbegrippen en definities | 30,0% | 12 |
| 2 | De vier dimensies | 10,0% | 4 |
| 3 | Product- en servicelevenscyclus | 10,0% | 4 |
| 4 | **Het ITIL-waardesysteem** | **40,0%** | **16** |
| 5 | Waardestromen | 5,0% | 2 |
| 6 | ITIL en AI | 2,5% | 1 |
| 7 | ITIL en andere frameworks | 2,5% | 1 |

**EXIN ISFS**

| # | Exameneis | Weging | Vragen per examen |
|---|---|---|---|
| 1 | Informatie en beveiliging | 27,5% | 11 |
| 2 | Dreigingen en risico's | 12,5% | 5 |
| 3 | **Beheersmaatregelen** | **52,5%** | **21** |
| 4 | Wet- en regelgeving en normen | 7,5% | 3 |

De praktische les uit deze tabellen: bij ITIL zit 40% van je examen in het
waardesysteem (de zeven principes, governance, de waardeketen, de
managementwerkwijzen en het verbetermodel). Bij ISFS zit meer dan de helft in de
beheersmaatregelen. Daar ligt je studietijd.

---

## 2. Waarom de applicatie is zoals hij is

### Vragen hangen aan één assessment-criterium

Elke vraag is gekoppeld aan precies één criterium uit de syllabus (ITIL 1.1.1 tot
7.2.2, ISFS 1.1.1 tot 4.2.2). Dat maakt het verschil tussen "je scoorde 62%" en
"je zakt op 4.2.4 — progress iteratively with feedback". Alleen het tweede
vertelt je wat je moet doen.

### Proefexamens volgen de officiële verdeling

Een willekeurige greep uit de vragenbank geeft een vertekend beeld. De generator
verdeelt de 40 vragen met de grootste-restmethode over de examengebieden, zodat
de verdeling exact klopt en het totaal altijd op 40 uitkomt. Dat is
geverifieerd met tests tegen de database.

### Geen feedback tijdens een proefexamen

In examenmodus stuurt de server geen enkele informatie over juistheid mee — niet
zichtbaar en niet verborgen in de payload. Dat is getest: de e2e-suite
controleert dat de HTML geen `"isCorrect": true` en geen gevulde toelichtingen
bevat. De oefenmodus doet het omgekeerde en geeft juist directe feedback,
inclusief de reden waarom elke afleider fout is.

### De timer staat op de server

De klok rekent met `startedAt` uit de database, niet met een lokale teller. Een
tabblad sluiten, de pagina herladen of de computer in slaap zetten levert geen
extra tijd op. Antwoorden worden direct weggeschreven, dus een onderbroken
examen hervat precies waar je was.

### Spaced repetition met FSRS

FSRS modelleert per kaart je geheugentoestand en plant de herhaling op het moment
dat je het bijna vergeten bent. Bij `requestRetention: 0,9` mik je op 90% kans
dat je het antwoord nog weet — de balans tussen zekerheid en het aantal
herhalingen per dag. Elk oefenantwoord voedt het schema automatisch: fout telt
als *Again*, goed als *Good*. Je hoeft zelf niets te plannen.

### Tweetaligheid zit in het datamodel

Elke vraag, optie, toelichting en begrip heeft een Nederlandse én een Engelse
tekst als aparte kolom. Tijdens het studeren wissel je per vraag van taal zonder
serverronde. Dat is functioneel: het ITIL-examen is Engelstalig terwijl je
cursusmateriaal Nederlands is, en bij sommige begrippen lopen de talen
verraderlijk uiteen (*continual* is voortdurend, niet continu).

---

## 3. Beveiliging

De hub draait in je eigen netwerk en bevat je studiegegevens en inloggegevens.
Onderstaande maatregelen zijn geïmplementeerd en getest.

### Authenticatie

| Maatregel | Uitwerking |
|---|---|
| Wachtwoordhashing | Argon2id, 19 MiB geheugen, 2 iteraties (OWASP-aanbeveling) |
| Wachtwoordeisen | Minimaal 12 tekens; weigert bekende lijsten, je e-mailadres en je naam |
| Tweede factor | TOTP (RFC 6238), secret versleuteld met AES-256-GCM |
| Herstelcodes | Acht stuks, gehasht opgeslagen |
| Brute force | Rate limiting op e-mailadres; accountvergrendeling na 10 mislukte pogingen |
| Timingaanval | Bij een onbekend e-mailadres wordt alsnog een hash berekend |

### Sessies

Het sessietoken staat alleen in een `httpOnly`-cookie; de database bewaart
uitsluitend de SHA-256 daarvan. Een databaselek levert dus geen sessieovername
op. Er zijn twee vervaltermijnen: een glijdende van 7 dagen (verlengt bij
gebruik) en een absolute van 30 dagen die nooit wordt verlengd. In productie
krijgt de cookie de `__Host-`-prefix, de strengste variant die de browser kent.

### Transport en browser

| Header | Waarde | Waarom |
|---|---|---|
| Content-Security-Policy | nonce per request, `strict-dynamic` | XSS; geen `unsafe-inline` voor scripts |
| Strict-Transport-Security | 2 jaar, incl. subdomeinen | Downgrade naar HTTP |
| X-Frame-Options / frame-ancestors | `DENY` / `'none'` | Clickjacking |
| X-Content-Type-Options | `nosniff` | MIME-sniffing |
| Referrer-Policy | `no-referrer` | Lekken van URL's |
| Cross-Origin-Opener-Policy | `same-origin` | Spectre-klasse aanvallen |
| Permissions-Policy | camera, microfoon, locatie uit | Ongebruikte browserfuncties |

### Applicatie

- **Invoervalidatie**: elke Server Action valideert met Zod vóór er iets met de
  database gebeurt.
- **Autorisatie per query**: elke query op een poging filtert op `userId`. Een
  geraden attempt-id levert niets op — getest in de e2e-suite.
- **CSRF**: `SameSite=Lax` plus de Origin-controle die Next.js op Server Actions
  uitvoert.
- **Rate limiting**: persistent in SQLite, zodat een herstart de rem niet opheft.
- **Auditlog**: append-only, zonder wachtwoorden, tokens of TOTP-codes.
- **Container**: draait als niet-root, read-only bestandssysteem, alle
  capabilities gedropt, `no-new-privileges`.
- **Geen uitgaand verkeer**: de app praat alleen met zichzelf. Geen CDN's, geen
  externe fonts, geen telemetrie.

---

## 4. Architectuur

```
Browser ──HTTPS──► Caddy ──HTTP (intern)──► Next.js ──► SQLite
                     │                         │
              TLS, interne CA          Server Components,
              securityheaders          Server Actions
```

| Laag | Keuze | Reden |
|---|---|---|
| Framework | Next.js 16 (App Router), React 19 | Server Components houden de vragenbank op de server |
| Taal | TypeScript strict, `noUncheckedIndexedAccess` | Fouten bij het compileren, niet tijdens een examen |
| Database | SQLite via better-sqlite3, WAL | Eén bestand, geen server, triviaal te back-uppen |
| ORM | Drizzle | Typeveilige queries, migraties in SQL |
| Validatie | Zod 4 | Eén schema voor typing én runtime-controle |
| Styling | Tailwind CSS 4 met CSS-variabelen | Licht en donker allebei volwaardig |
| Herhaling | ts-fsrs | Moderne opvolger van SM-2 |
| Proxy | Caddy 2 | TLS zonder configuratie, ook met een interne CA |

### Datamodel

15 tabellen. De kern:

- `certifications` → `domains` → `objectives` → `questions` → `question_options`
- `attempts` → `attempt_questions` (onveranderlijk vastgelegd per poging)
- `fsrs_cards` → `fsrs_reviews` (herhaalschema per gebruiker per item)
- `users`, `sessions`, `audit_log`, `rate_limits`, `glossary_terms`, `study_plans`

Antwoorden worden per poging bevroren vastgelegd, inclusief de optievolgorde die
je zag. Ook als een vraag later wordt gecorrigeerd, blijft een oud examenrapport
reproduceerbaar.

---

## 5. Contentverantwoording

### Herkomst

De vragen zijn **origineel geschreven** op basis van de leerdoelen uit:

- *ITIL Foundation (Version 5) — Syllabus*, PeopleCert (Appendix 2)
- *ITIL Foundation (Version 5) — Nederlandstalig Reference Manual v1.0*, ITMG
- *Preparation guide EXIN Information Security Foundation based on ISO/IEC 27001*,
  editie 202305
- *Basiskennis informatiebeveiliging op basis van ISO 27001 en ISO 27002*,
  Hintzbergen e.a., 4e herziene druk (de door EXIN voorgeschreven
  examenliteratuur)

Er zijn geen examenvragen overgenomen. Elke vraag verwijst via het veld `source`
naar het criterium waarop hij toetst, zodat je bij twijfel zelf kunt nakijken.

### Omvang

| | ITIL 5 | ISFS |
|---|---|---|
| Vragen | 100 | 60 |
| Leerdoelen gedekt | 95 / 95 | 31 / 31 |
| Begrippen | 62 | 58 |
| Vraagtypes | standard, negative, missing word, list | standard |

Elk assessment-criterium uit beide syllabi wordt door minstens één vraag
getoetst. Per examengebied is er ruim voldoende voorraad voor meerdere
verschillende proefexamens:

| Examengebied | Vragen | Nodig per examen |
|---|---|---|
| ITIL 1 — Kernbegrippen | 30 | 12 |
| ITIL 2 — Vier dimensies | 7 | 4 |
| ITIL 3 — Levenscyclus | 11 | 4 |
| ITIL 4 — Waardesysteem | 35 | 16 |
| ITIL 5 — Waardestromen | 8 | 2 |
| ITIL 6 — AI | 5 | 1 |
| ITIL 7 — Frameworks | 4 | 1 |
| ISFS 1 — Informatie en beveiliging | 14 | 11 |
| ISFS 2 — Dreigingen en risico's | 8 | 5 |
| ISFS 3 — Beheersmaatregelen | 32 | 21 |
| ISFS 4 — Wet- en regelgeving | 6 | 3 |

Bij ITIL komen alle vier de PeopleCert-vraagtypes voor, inclusief de
'list'-vraag waarbij je twee van vier statements kiest. EXIN gebruikt uitsluitend
standaard meerkeuzevragen; dat is in de content weerspiegeld.

### Kwaliteitsbewaking

Een validator draait bij het seeden én als test, en weigert door te gaan bij:

- een vraag met niet precies één juist antwoord of niet precies vier opties;
- een verwijzing naar een niet-bestaand leerdoel;
- een `list`-vraag zonder vier statements;
- een ontbrekende vertaling;
- twee identieke antwoordopties binnen één vraag;
- domeinwegingen die niet optellen tot 100%.

Daarnaast waarschuwt hij bij afleiders zonder rationale en bij examengebieden met
te weinig vragen voor een volledig examen.

### Inhoudelijke verificatie tegen de bronnen

Naast de automatische validatie is de inhoud handmatig getoetst aan het
cursusmateriaal. Twee correcties kwamen daaruit voort:

1. **Soorten beheersmaatregelen (ISFS 3.1.1).** De eerste versie noemde er zes
   volgens de EXIN-begrippenlijst. Het examenboek hanteert in de incidentcyclus
   een iets andere set, met *evaluatief* erbij en met verzekeren, accepteren en
   ontwijken als aparte risico-opties. De toelichting is daarop aangepast.
2. **Back-ups (ISFS 3.1.1).** Het examenboek merkt het *maken* van een back-up
   aan als repressieve maatregel — het beperkt de schade van een incident —
   terwijl het *terugzetten* correctief is. Dat onderscheid stond er niet in en
   is nu expliciet gemaakt, inclusief als afleider met uitleg. Dit is precies
   het type nuance waarop een examenvraag kan draaien.

Gecontroleerde en bevestigde feiten uit de bronnen zijn onder meer: de
incidentcyclus (dreiging → incident → schade → herstel), de drie
risicostrategieën, kwalitatieve versus kwantitatieve risicoanalyse, de rol van
de eigenaar bij classificatie en autorisatie, en aan ITIL-zijde alle definities,
de zeven principes, de acht levenscyclusactiviteiten met hun succesmetrics, de
zes capabilities van het AI Capability Model en de structuur van de Practice
Guides.

---

## 6. Wat is gebouwd en getest

### Functionaliteit

- [x] Proefexamen onder examencondities (timer, geen feedback, markeren,
      navigatiegrid, automatische inlevering)
- [x] Volledig examenrapport met score per examengebied en de rationale per
      afleider
- [x] Oefenmodus met directe feedback
- [x] Gerichte oefensessies op je zwakste leerdoelen
- [x] Spaced repetition met FSRS, voor vragen én begrippen
- [x] Voortgangsdashboard met examengereedheid, scoreverloop en score per
      leerdoel
- [x] Tweetalig glossarium met flashcardmodus
- [x] Tweestapsverificatie, wachtwoordbeheer, sessieoverzicht, auditlog
- [x] Gegevensexport als JSON
- [x] Werkt zonder JavaScript (progressive enhancement) — getest

### Tests

| Suite | Aantal | Status |
|---|---|---|
| Contentvalidatie en examenspecificaties | 18 | geslaagd |
| Integratie tegen echte database | 9 | geslaagd |
| End-to-end over HTTP (lokaal) | 50 | geslaagd |
| End-to-end over HTTPS (containers) | 50 | geslaagd |
| Containeropstelling | 41 | geslaagd |
| Startscript vanaf nul en bij hergebruik | — | geslaagd |
| Typecheck (`tsc --noEmit`) | — | schoon |
| Productiebuild | 17 routes | geslaagd |

Draai alles met `npm run verify`.

De end-to-end suite start een echt proefexamen via het formulier — dus zonder
JavaScript, langs dezelfde weg als een browser met scripts uitgeschakeld — en
controleert onder meer dat de examenpagina geen juiste antwoorden in de payload
zet, dat een tweede start geen tweede poging aanmaakt, en dat een niet-ingelogde
bezoeker een poging niet kan openen.

### Containeropstelling

De volledige opstelling is gedraaid en getest: image bouwen, containers starten,
initialisatie (migraties plus 160 vragen en 120 begrippen in de
container-database), netwerkisolatie, HTTPS met alle securityheaders, alle
routes achter de proxy, containerhardening en persistentie over een herstart.
Daarna is de complete gebruikersreis nogmaals over HTTPS tegen de draaiende
containers gedraaid — 50 van 50 geslaagd. Image: 302 MB.

Twee dingen kwamen daarbij aan het licht:

1. **Caddy gaf 503 op alles.** De health check stond op `/login`, maar die route
   redirect (307) wanneer er nog geen account bestaat, en Caddy beschouwt alles
   buiten 2xx als een ongezonde upstream. Opgelost met een eigen
   `/api/health`-endpoint dat altijd 200 geeft en geen interne staat prijsgeeft.
2. **De build faalde met SQLITE_BUSY.** De databasemodule opende een verbinding
   bij het importeren, en tijdens `next build` doen zeven parallelle workers dat
   tegelijk op een nog niet bestaande database — een race op het instellen van
   de WAL-modus. De verbinding wordt nu lui opgezet via een Proxy: pas bij het
   eerste echte gebruik. Dat is sowieso zuiniger.

### Bug die de tests vonden

De end-to-end suite legde een fout bloot die bij handmatig klikken lang
onopgemerkt zou blijven: Next.js prerenderde `/`, `/login` en `/setup` als
statische pagina's. Daardoor werd de vraag "bestaat er al een account?" tijdens
de **build** beantwoord en bevroren. Concreet: bouw je de app terwijl er nog
geen account is, dan blijft het registratiescherm bereikbaar nadat je er wél een
hebt aangemaakt. De drie routes zijn nu expliciet dynamisch gemaakt en de build
bevestigt dat alle 16 routes per request worden gerenderd.

---

## 7. Studieaanpak

Een suggestie, geen voorschrift.

**Fase 1 — oriëntatie (week 1).** Lees het cursusmateriaal door en gebruik de
oefenmodus met 20 vragen per sessie. Nog geen proefexamens: die zijn nu alleen
demotiverend en verbranden vragen die je later nodig hebt voor een eerlijke meting.

**Fase 2 — opbouw (week 2–3).** Dagelijks de herhaalwachtrij leegmaken plus één
oefensessie. Zet het glossarium in de wachtrij; bij ISFS is de begrippenlijst
letterlijk examenstof. Eerste proefexamen aan het eind van week 2 als nulmeting.

**Fase 3 — bijsturen (week 4+).** Proefexamen, daarna het dashboard erbij en
gericht oefenen op de leerdoelen onder de 65%. Herhaal. Het cijfer dat telt is
niet je gemiddelde maar je laatste score, en of die stabiel boven de 26 ligt.

**Laatste week.** Twee tot drie volledige proefexamens onder echte condities:
timer aan, geen naslag, in één keer uitzitten. Bij ITIL: oefen in het Engels, dat
is de examentaal.

Vuistregel voor examengereedheid: drie opeenvolgende proefexamens met 30 of meer
goed (75%). Dan heb je marge voor een slechte dag.

---

## 8. Uitbreidingsmogelijkheden

Niet gebouwd, wel voorbereid in het datamodel:

- **Importeren van eigen vragen** — `questions.origin` kent al de waarde
  `'import'`. Handig als je je officiële oefenexamens lokaal wilt toevoegen.
- **Meerdere gebruikers** — het datamodel is er al op ingericht; alleen de
  registratie is bewust op één account begrensd.
- **WebAuthn / passkeys** — als aanvulling of vervanging van TOTP.
- **Extra certificeringen** — een nieuwe map onder `content/` met structuur,
  vragen en glossarium is genoeg; de rest van de app is generiek.
- **PWA voor offline gebruik** — nuttig om in de trein te herhalen.

---

## 9. Bekende beperkingen

Eerlijk is eerlijk:

1. **De image wordt netwerkloos gebouwd.** Op deze machine draait Mullvad VPN
   met DNS-lekbescherming, die UDP-poort 53 vanaf Docker-bridges blokkeert — ook
   met *Local network sharing* op `allow`. Getest met Alpine én Debian, met
   `--network=host`, met `--dns=1.1.1.1` en met DNS-over-TCP: geen enkele
   variant kan namen resolven. De Dockerfile gebruikt daarom de `node_modules`
   van de host, met een base-image die daarop is afgestemd (Debian bookworm voor
   glibc, Node 20 voor de ABI van `better-sqlite3`). Werkt jouw omgeving wél met
   netwerk, dan staat de nettere `npm ci`-variant in `DOCKER.md`.
2. **De vragenbank is niet door PeopleCert of EXIN gevalideerd.** Hij is
   geschreven op basis van de officiële leerdoelen en het cursusmateriaal, en
   inhoudelijk geverifieerd tegen die bronnen, maar het blijft eigen werk.
   Wijkt een vraag af van wat je in het cursusmateriaal leest, ga dan uit van
   het cursusmateriaal en pas de vraag aan.
3. **GenAI en Agentic AI staan alleen in de Glossary van het Official Book.**
   Dat boek is hier niet beschikbaar. Vraag `itil5-q097` is daarom gebaseerd op
   wat het reference manual expliciet stelt over generatieve AI en op het AI
   Capability Model, niet op een letterlijke glossarydefinitie.
4. **Geen QR-code bij het instellen van 2FA.** Je voert het secret handmatig in.
   Dat werkt in elke authenticator-app en scheelt een dependency.
5. **De ISFS-vragen zijn alle van het type 'standard'.** Dat is bewust: EXIN
   gebruikt uitsluitend standaard meerkeuzevragen. De vier vraagtypes van
   PeopleCert komen alleen bij ITIL voor.
