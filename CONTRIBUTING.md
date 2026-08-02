# Bijdragen aan Project115

Fijn dat je dit openslaat. Dit is een eenmansproject, gebouwd naast een baan en
twee examens, dus verwacht geen strak releaseproces. Wat hieronder staat is
bedoeld om je tijd niet te verspillen.

## Waar ik het meest aan heb

**Inhoudelijke fouten.** Dit weegt het zwaarst. Een vraag met een verkeerd
gemarkeerd antwoord, een toelichting die de stof verkeerd uitlegt, of een
begrip dat niet klopt met de huidige syllabus — dat maakt de app schadelijk in
plaats van nuttig, want iemand leert dan iets verkeerds voor een examen dat
geld kost.

Meld het met: welke vraag (bestand en regelnummer of de vraagtekst), wat er
niet klopt, en waar het volgens jou wél op staat. Een verwijzing naar de
syllabus of het officiële materiaal helpt, maar plak geen lappen cursustekst in
een issue — zie hieronder.

**Auteursrechtelijke bezwaren.** Zie je iets dat te dicht bij beschermd
lesmateriaal komt, meld het. Ook als je van PeopleCert, EXIN of een
trainingsaanbieder bent: het wordt aangepast of verwijderd, zonder discussie.
Zie [GEBRUIKSVOORWAARDEN.md](GEBRUIKSVOORWAARDEN.md).

**Beveiligingsproblemen.** Niet via een issue — zie
[SECURITY.md](SECURITY.md).

**Vertaal- en taalfouten.** De app is tweetalig. Kromme zinnen in een van beide
talen mogen gemeld worden.

## Waar ik minder aan heb

- Grote herstructureringen van de code zonder dat er iets kapot was.
- Nieuwe afhankelijkheden. De app draait offline en dat wil ik zo houden; elke
  package erbij is iets wat mee moet in de APK en wat onderhouden moet worden.
- Extra certificeringen erbij. Leuk idee, maar ik kan alleen instaan voor stof
  die ik zelf heb bestudeerd.

## Belangrijk: geen cursustekst in bijdragen

Plak geen tekst uit officieel cursusmateriaal, oefenexamens of het ITIL-boek in
een issue, een pull request of de vragenbank. Ook niet "ter illustratie". De
vragenbank moet origineel werk blijven; dat is precies de reden dat hij
bruikbaar is om te verspreiden.

Schrijf een vraag dus zelf, aan de hand van het assessment-criterium waar hij
bij hoort. Beschrijf bij een correctie in eigen woorden wat er mis is, met een
verwijzing naar de bron in plaats van een citaat eruit.

## Code

Zelf draaien: zie [ONTWIKKELEN.md](ONTWIKKELEN.md).

Voordat je een pull request opent:

```bash
npm run verify     # typecontrole, lint, tests en een productiebuild
```

Dat is dezelfde controle die de CI draait. Loopt hij lokaal door, dan loopt hij
daar ook door.

Voor de vragenbank geldt bovendien dat `content/index.ts` zichzelf valideert:
elk assessment-criterium moet gedekt zijn, de wegingen moeten optellen tot 100%
en elke vraag heeft precies vier opties met precies één juist antwoord. De CI
laat het weten als dat niet meer klopt.

## Stijl

De code en de teksten zijn Nederlandstalig becommentarieerd, in gewone zinnen.
Commentaar legt uit *waarom* iets zo is, niet *wat* er staat — dat laatste
leest een mens zelf wel in de code. Sluit daarop aan en het past vanzelf.

## Tot slot

Ik reageer als ik tijd heb, en soms duurt dat. Dat is geen desinteresse. Blijft
iets te lang liggen, geef gerust een seintje in de draad.
