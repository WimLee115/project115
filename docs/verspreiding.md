# Project115 verspreiden

Hoe je de studiehub bij andere docenten krijgt, en waar je op moet letten.

Ontwikkeld door B. van Rooij.

## Drie vormen, drie doelgroepen

| Vorm | Voor wie | Wat de ontvanger moet doen |
|---|---|---|
| **Browserversie** | iedereen, elk apparaat | een link openen |
| **Android-app (APK)** | wie hem op zijn telefoon wil | bestand openen, eenmalig toestemming geven |
| **Docker-webversie** | een school die hem centraal draait | Docker draaien, accounts beheren |

De browserversie is verreweg de laagste drempel en werkt op telefoon, tablet,
laptop en Chromebook. De APK is prettiger op een telefoon — een echt pictogram,
geen browserbalk — maar vraagt eenmalig een handeling die sommige mensen eng
vinden. De Docker-versie is er voor het geval een school hem in eigen beheer
wil; die vraagt technische kennis en is niet bedoeld voor individuele docenten.

Advies: **stuur de link naar de browserversie, en de APK erbij voor wie hem op
zijn telefoon wil.**

## Wat je meestuurt

```bash
cd android-app
npm run verify          # eerst controleren dat alles klopt
npm run package         # → release/
```

In `release/` staat dan:

```
Project115-1.1.1.apk           de Android-app
Project115-1.1.1-web.zip       de browserversie, uit te pakken op een webserver
INSTALLEREN.md                 instructie voor de ontvanger
PRIVACY.md                     wat de app met gegevens doet
```

Wat er **niet** in zit en er ook nooit in hoort: `release-key.jks` en
`android/keystore.properties`. Wie die twee heeft, kan een update uitbrengen die
Android accepteert als jouw app. Het pakketscript slaat ze over, maar controleer
het bij twijfel zelf.

## De browserversie ergens neerzetten

De inhoud van `dist-web/` is een gewone statische website. Er is geen build op
de server nodig en geen database.

Wat werkt:

- **GitHub Pages** — gratis, HTTPS inbegrepen, een link die je kunt mailen.
- **Een map op de schoolwebserver** — `base: './'` maakt de app onafhankelijk
  van de submap waarin hij staat.
- **Netlify, Cloudflare Pages, of elke andere statische host** — map erin
  slepen.

Wat **niet** werkt: het `index.html` rechtstreeks vanaf de schijf openen. De app
heeft `http://` of `https://` nodig; Chrome staat IndexedDB niet toe op een
`file://`-adres, en dan bewaart de app je voortgang niet. Een dubbelklikbaar
bestand is dus geen optie, hoe aantrekkelijk dat ook zou zijn.

HTTPS is verder een vereiste voor de service worker. Zonder HTTPS werkt de app
wel, maar niet offline.

## De APK verspreiden

Het bestand kan gewoon mee als bijlage, via WeTransfer, of via een link.

De ontvanger krijgt bij het openen de melding dat installeren uit onbekende
bronnen niet is toegestaan, met een knop om het voor die ene app toe te staan.
Dat is normaal bij software die niet uit de Play Store komt en het staat ook zo
in `INSTALLEREN.md`.

Sommige mailproviders — Gmail voorop — weigeren `.apk`-bijlagen. Zip het bestand
of gebruik een link.

### Waarom niet in de Play Store

Bewust niet. Publiceren kost eenmalig 25 dollar, vraagt een privacyverklaring op
een openbare URL, een verplichte beoordeling die dagen tot weken duurt, en een
jaarlijkse bevestiging dat de app nog onderhouden wordt. Voor een app die je met
een handvol collega's deelt, is dat allemaal overhead zonder opbrengst — je hebt
geen vindbaarheid nodig als je de link zelf verstuurt.

Mocht dat ooit veranderen: de app is er technisch klaar voor. Er is dan een
`bundleRelease` nodig in plaats van `assembleRelease`, en de privacyverklaring
staat al in `PRIVACY.md`.

## Updates

De app controleert nergens op updates; er is geen server om het aan te vragen.
Een nieuwe versie verspreid je dus zelf.

- **Browserversie**: nieuwe bestanden op de server zetten. De service worker
  ziet bij het eerstvolgende bezoek dat de cachenaam is veranderd en haalt alles
  opnieuw op. Gebruikers merken er niets van behalve dat het even laadt.
- **APK**: nieuwe APK sturen. Android installeert hem over de oude heen zolang
  het `versionCode` in `android/app/build.gradle` hoger is en de handtekening
  dezelfde is. Verhoog dus altijd het `versionCode`, en gebruik altijd dezelfde
  sleutel.

Voortgang blijft bij beide bewaard: die staat in IndexedDB, niet in de
programmabestanden.

## Wat je mag verspreiden en wat niet

De vragen, toelichtingen en begrippen in deze app zijn **origineel geschreven**
aan de hand van de openbaar gepubliceerde examenspecificaties van PeopleCert en
EXIN. Er zijn geen examenvragen overgenomen, en er staat geen cursustekst in.
Verspreiden mag daarom.

Wat er níét in zit en er ook niet in mag: het Nederlandstalige reference manual
van ITMG, de EXIN preparation guide, het examenboek van Hintzbergen, of enige
andere letterlijke tekst uit lesmateriaal. Dat is auteursrechtelijk beschermd
werk van anderen. De volledige contentverantwoording staat in `../PLAN.md`,
hoofdstuk 5.

De app vermeldt in **Instellingen › Over** wie de merknamen bezitten en dat hij
niet gelieerd is aan PeopleCert of EXIN. Laat die tekst staan.

## Contact bij vragen van ontvangers

De app verzamelt niets en verstuurt niets, dus er is geen dienst die kan
uitvallen en geen gegeven dat kan lekken. Vragen die je wel kunt verwachten:

**"Ik zie mijn voortgang niet meer."** De gegevens staan in de browseropslag van
dat ene apparaat. Ze verdwijnen als je de app-gegevens wist, of — bij de
browserversie — als je de sitegegevens van de browser opruimt. Adviseer om af en
toe te exporteren via **Instellingen › Gegevens**.

**"Kan ik op twee apparaten studeren?"** Ja, maar niet automatisch synchroon.
Exporteer op het ene apparaat, importeer op het andere. Importeren vervangt wat
er stond.

**"Zijn dit de echte examenvragen?"** Nee. Zie hierboven.
