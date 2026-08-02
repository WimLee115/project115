# Beveiliging — Project115

Ontwikkeld door B. van Rooij — <https://github.com/wimlee115>

## Kort

Project115 draait volledig op je eigen apparaat. Er is geen server van mij, geen
account en geen netwerkverkeer tijdens het gebruik. Dat maakt een hele categorie
kwetsbaarheden onmogelijk: er valt niets af te luisteren, geen sessie over te
nemen en geen database van iemand anders te benaderen.

Wat overblijft is wél de moeite waard om te melden. Zie hieronder.

## Welke versies

| Versie | Ondersteund |
| ------ | ----------- |
| 1.0.x  | ja          |

Er is één uitgave. Komt er een opvolger, dan wordt deze tabel bijgewerkt en
krijgt de vorige versie geen losse patches — de bedoeling is dat je overstapt op
de nieuwste.

## Iets gevonden?

Meld het via **[Security → Report a vulnerability](https://github.com/WimLee115/project115/security/advisories/new)**
op deze repository. Dat gaat privé, alleen ik zie het.

Liever niet via een openbaar issue, in elk geval niet voordat er een oplossing
is. Staat het advisory-formulier niet voor je open, open dan een issue met
alleen "beveiligingsmelding, graag contact" en verder geen details.

Zet erin wat je deed, wat er gebeurde en wat je verwachtte. Een proof of concept
helpt, maar is niet nodig als het uit de code al duidelijk is.

## Wat je van mij kunt verwachten

Dit is een hobbyproject van één persoon, geen bedrijf met een securityteam. Dat
is geen excuus, maar wel de reden dat ik hier geen reactietermijn beloof die ik
misschien niet haal. Wat ik wel doe:

- ik bevestig je melding zodra ik hem zie;
- ik laat weten of ik hem als kwetsbaarheid beschouw en waarom;
- gaat het om iets waardoor je studiegegevens of de ondertekening van de app in
  gevaar komen, dan gaat dat voor op al het andere;
- je krijgt vermelding bij de oplossing, tenzij je dat liever niet hebt.

## Waar het om gaat

Deze punten wegen het zwaarst:

- **De ondertekening van de Android-app.** Wie de keystore en zijn wachtwoord
  heeft, kan een update uitbrengen die Android accepteert als deze app. Die twee
  bestanden staan in `.gitignore`, worden overgeslagen bij het inpakken van een
  uitgave, en staan niet in deze repository. Zie je ergens toch een sleutel of
  een wachtwoord staan, meld dat dan meteen.
- **Je studiegegevens.** Die staan alleen op je eigen apparaat. Een fout waardoor
  ze alsnog ergens heen gaan, is een kwetsbaarheid.
- **De Docker-opzet.** Wie de webversie achter Caddy zet, draait wél een server.
  Fouten in de authenticatie, de sessieafhandeling of de rate limiting tellen
  mee.
- **De inhoud van de vragenbank.** Geen beveiligingsprobleem, maar wel iets om
  te melden: staat er iets in dat te dicht bij beschermd lesmateriaal komt, dan
  wordt het aangepast. Zie [GEBRUIKSVOORWAARDEN.md](GEBRUIKSVOORWAARDEN.md).

## Waar het niet om gaat

Om de verwachtingen gelijk te trekken — deze meldingen leiden niet tot een
oplossing:

- Het ontbreken van accounts, wachtwoordherstel of tweestapsverificatie in de
  offline versies. Dat is een keuze: er is niets om een account voor te maken.
- Dat de offline versies hun gegevens onversleuteld in de browseropslag bewaren.
  Wie bij je browserprofiel kan, kan bij je oefenresultaten. Dat is bekend en
  staat zo in [PRIVACY.md](PRIVACY.md).
- Meldingen uit een scanner zonder werkend scenario erbij, helemaal als het gaat
  om een ontwikkelafhankelijkheid die niet in de uitgeleverde app terechtkomt.
- Dat de APK buiten de Play Store om wordt verspreid. Dat is bewust; de reden
  staat in [INSTALLEREN.md](INSTALLEREN.md).

## Wat er al aan gedaan is

- Afhankelijkheden worden bewaakt door Dependabot, de code door CodeQL.
- Geheimen staan nergens in de code: de keystore krijgt bij aanmaken een
  willekeurig wachtwoord van 24 bytes, en `.env` gaat nooit mee in wat er
  verspreid wordt.
- Wachtwoorden voor de serverversie worden gehasht met Argon2, en het aanmelden
  is voorzien van rate limiting.
- Bij elke wijziging draaien de typecontrole, de tests en een productiebuild.
