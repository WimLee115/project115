# Privacy — Project115

Ontwikkeld door B. van Rooij — <https://github.com/wimlee115>

Versie 1.1.1

## Kort

De app verzamelt niets, verstuurt niets en heeft geen account. Alles wat je doet
blijft op het apparaat waarop je het doet.

Er is geen server om gegevens naartoe te sturen. Dat is geen belofte over hoe
zorgvuldig ermee wordt omgegaan — er is domweg niets waar iets naartoe kán.

## Wat de app opslaat

Op je eigen apparaat, in de opslag van de app zelf (IndexedDB):

- welke proefexamens en oefensessies je hebt gedaan, met je antwoorden en de
  tijd die je erover deed;
- je herhaalschema: per vraag en per begrip wanneer die weer aan de beurt is;
- je instellingen: taal, weergave, je naam als je die invult, en je
  examendatum als je die instelt;
- als je een pincode instelt: alleen een afgeleide daarvan (PBKDF2-SHA256 met
  310.000 iteraties en een willekeurig zout), nooit de pincode zelf.

Meer niet. Geen locatie, geen contacten, geen apparaat-id, geen gebruiksstatistiek.

## Wat de app niet doet

- Geen analytics, telemetrie of crashrapportage.
- Geen advertenties en geen advertentie-SDK's.
- Geen trackers van derden.
- Geen cloudopslag en geen synchronisatie.
- Geen enkel netwerkverzoek tijdens het gebruik. De vragenbank zit in de app en
  je voortgang staat in de lokale opslag; er is niets op te halen.

De enige uitgaande verwijzing is de GitHub-link in **Instellingen › Over**, en
die opent pas nadat je er zelf op tikt — in je browser, buiten de app.

## Als je exporteert

Via **Instellingen › Gegevens › Exporteren** schrijft de app je studiegegevens
naar een JSON-bestand, zodat je ze kunt bewaren of naar een ander apparaat
overzetten. Dat bestand komt op je eigen toestel te staan (map *Documenten*) en
gaat alleen ergens heen als jij het zelf deelt.

In dat bestand zit je voortgang. Er zit geen pincode in, geen wachtwoordhash en
geen sessiegegeven.

## Toestemmingen

De Android-app vraagt geen toestemmingen bij het gebruik. Hij gebruikt de
standaardtoegang tot zijn eigen opslag, en een deelvenster wanneer je zelf op
exporteren tikt.

## Je gegevens weggooien

- **In de app** — Instellingen › Gegevens › Studiegegevens wissen.
- **Android** — Instellingen › Apps › Project115 › Opslag › Gegevens wissen.
- **Browser** — de sitegegevens van de pagina wissen.

Er blijft daarna niets achter, ook niet elders, want er stond nergens anders
iets.

## Wie hierachter zit

Project115 is gemaakt door B. van Rooij als studiehulpmiddel, en gedeeld met
docenten. Er zit geen bedrijf achter, geen verdienmodel en geen
verwerkersovereenkomst — er worden namelijk geen gegevens verwerkt buiten je
eigen apparaat.

Vragen: <https://github.com/wimlee115>
