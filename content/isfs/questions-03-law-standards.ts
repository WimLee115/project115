import type { QuestionSeed } from '../types';

/**
 * EXIN ISFS — domein 4: Wet- en regelgeving en normen (7,5%).
 *
 * Klein domein (circa drie vragen per examen), maar met scherp afgebakende
 * feiten: welke norm regelt wat, en welke wetgeving raakt informatiebeveiliging.
 */

export const questions: QuestionSeed[] = [
  {
    id: 'isfs-q051',
    objective: '4.2.1',
    type: 'standard',
    bloom: 1,
    difficulty: 2,
    stem: {
      nl: 'Wat is het verschil tussen ISO/IEC 27001 en ISO/IEC 27002?',
      en: 'What is the difference between ISO/IEC 27001 and ISO/IEC 27002?',
    },
    options: [
      {
        text: {
          nl: 'ISO/IEC 27001 bevat de eisen waaraan een ISMS moet voldoen en is certificeerbaar; ISO/IEC 27002 geeft richtlijnen en implementatieadvies bij de beheersmaatregelen',
          en: 'ISO/IEC 27001 contains the requirements an ISMS must meet and is certifiable; ISO/IEC 27002 provides guidance and implementation advice for the controls',
        },
        correct: true,
      },
      {
        text: {
          nl: 'ISO/IEC 27001 geldt voor overheden, ISO/IEC 27002 voor bedrijven',
          en: 'ISO/IEC 27001 applies to governments, ISO/IEC 27002 to companies',
        },
        rationale: {
          nl: 'Beide normen zijn sectoronafhankelijk en toepasbaar op elke organisatie.',
          en: 'Both standards are sector-independent and applicable to any organization.',
        },
      },
      {
        text: {
          nl: 'ISO/IEC 27002 is de nieuwere versie die ISO/IEC 27001 vervangt',
          en: 'ISO/IEC 27002 is the newer version replacing ISO/IEC 27001',
        },
        rationale: {
          nl: 'De normen bestaan naast elkaar en vullen elkaar aan; de een vervangt de ander niet.',
          en: 'The standards exist alongside each other and are complementary; neither replaces the other.',
        },
      },
      {
        text: {
          nl: 'ISO/IEC 27001 gaat over techniek, ISO/IEC 27002 over organisatie',
          en: 'ISO/IEC 27001 concerns technology, ISO/IEC 27002 concerns organization',
        },
        rationale: {
          nl: 'Beide dekken organisatorische, menselijke, fysieke én technologische aspecten.',
          en: 'Both cover organizational, people, physical and technological aspects.',
        },
      },
    ],
    explanation: {
      nl: 'De 27000-familie: ISO/IEC 27000 geeft het overzicht en de begrippen (en is gratis beschikbaar), ISO/IEC 27001 stelt de eisen aan het ISMS en is de norm waartegen wordt gecertificeerd, en ISO/IEC 27002 geeft praktische richtlijnen bij de beheersmaatregelen. Ezelsbrug: 27001 = wat je moet doen, 27002 = hoe je het kunt doen.',
      en: 'The 27000 family: ISO/IEC 27000 provides the overview and vocabulary (and is freely available), ISO/IEC 27001 sets the ISMS requirements and is the standard organizations certify against, and ISO/IEC 27002 gives practical guidance on the controls. Memory aid: 27001 = what you must do, 27002 = how you can do it.',
    },
    source: 'Exameneis 4.2.1',
  },
  {
    id: 'isfs-q052',
    objective: '4.2.1',
    type: 'standard',
    bloom: 1,
    difficulty: 2,
    stem: {
      nl: 'Welke norm bevat de begrippen en definities die binnen de hele 27000-reeks worden gebruikt?',
      en: 'Which standard contains the vocabulary and definitions used throughout the 27000 series?',
    },
    options: [
      { text: { nl: 'ISO/IEC 27000', en: 'ISO/IEC 27000' }, correct: true },
      {
        text: { nl: 'ISO/IEC 27001', en: 'ISO/IEC 27001' },
        rationale: {
          nl: 'Deze norm bevat de eisen aan het managementsysteem, niet het overkoepelende begrippenkader.',
          en: 'This standard contains the management system requirements, not the overarching vocabulary.',
        },
      },
      {
        text: { nl: 'ISO/IEC 27002', en: 'ISO/IEC 27002' },
        rationale: {
          nl: 'Deze norm geeft richtlijnen bij de beheersmaatregelen.',
          en: 'This standard provides guidance on the controls.',
        },
      },
      {
        text: { nl: 'ISO 9001', en: 'ISO 9001' },
        rationale: {
          nl: 'ISO 9001 is de norm voor kwaliteitsmanagementsystemen, niet voor informatiebeveiliging.',
          en: 'ISO 9001 is the standard for quality management systems, not information security.',
        },
      },
    ],
    explanation: {
      nl: 'ISO/IEC 27000 geeft een overzicht van de 27000-familie en definieert de gemeenschappelijke begrippen. Andere leden van de familie: 27005 (informatiebeveiligingsrisicomanagement), 27017 (cloudsecurity), 27018 (privacy in de cloud) en 27701 (privacy-informatiemanagement, als uitbreiding op 27001).',
      en: 'ISO/IEC 27000 provides an overview of the 27000 family and defines the common vocabulary. Other members of the family: 27005 (information security risk management), 27017 (cloud security), 27018 (privacy in the cloud) and 27701 (privacy information management, as an extension to 27001).',
    },
    source: 'Exameneis 4.2.1, 4.2.2',
  },
  {
    id: 'isfs-q053',
    objective: '4.1.1',
    type: 'standard',
    bloom: 1,
    difficulty: 2,
    stem: {
      nl: 'Binnen welke termijn moet een datalek met risico voor betrokkenen volgens de AVG bij de toezichthouder worden gemeld?',
      en: 'Within what period must a data breach posing a risk to data subjects be reported to the supervisory authority under the GDPR?',
    },
    options: [
      { text: { nl: 'Binnen 72 uur na ontdekking', en: 'Within 72 hours of becoming aware' }, correct: true },
      {
        text: { nl: 'Binnen 24 uur na ontdekking', en: 'Within 24 hours of becoming aware' },
        rationale: {
          nl: 'Kortere termijnen gelden binnen andere regimes, maar de AVG hanteert 72 uur.',
          en: 'Shorter deadlines apply under other regimes, but the GDPR uses 72 hours.',
        },
      },
      {
        text: { nl: 'Binnen één week na ontdekking', en: 'Within one week of becoming aware' },
        rationale: {
          nl: 'Dit is te ruim; de AVG-termijn is aanzienlijk korter.',
          en: 'This is too generous; the GDPR deadline is considerably shorter.',
        },
      },
      {
        text: {
          nl: 'Alleen bij het jaarlijkse compliance-verslag',
          en: 'Only in the annual compliance report',
        },
        rationale: {
          nl: 'Datalekmeldingen zijn incidentgedreven, niet periodiek.',
          en: 'Data breach notifications are incident-driven, not periodic.',
        },
      },
    ],
    explanation: {
      nl: 'De AVG (in het Engels GDPR) verplicht tot melding aan de toezichthouder — in Nederland de Autoriteit Persoonsgegevens — binnen 72 uur na ontdekking, tenzij het onwaarschijnlijk is dat het lek een risico oplevert. Bij een hoog risico moeten ook de betrokkenen zelf worden geïnformeerd. Daarnaast geldt een verplichting om alle datalekken intern te registreren, ook de niet-meldingsplichtige.',
      en: 'The GDPR requires notification to the supervisory authority — in the Netherlands the Dutch Data Protection Authority — within 72 hours of becoming aware, unless the breach is unlikely to result in a risk. Where the risk is high, the data subjects themselves must also be informed. There is additionally an obligation to record all data breaches internally, including those not requiring notification.',
    },
    source: 'Exameneis 4.1.1',
  },
  {
    id: 'isfs-q054',
    objective: '4.1.1',
    type: 'standard',
    bloom: 1,
    difficulty: 2,
    stem: {
      nl: 'Wat zijn persoonsgegevens volgens de AVG?',
      en: 'What are personal data under the GDPR?',
    },
    options: [
      {
        text: {
          nl: 'Alle informatie over een geïdentificeerde of identificeerbare natuurlijke persoon',
          en: 'Any information relating to an identified or identifiable natural person',
        },
        correct: true,
      },
      {
        text: {
          nl: 'Uitsluitend naam, adres en burgerservicenummer',
          en: 'Only name, address and national identification number',
        },
        rationale: {
          nl: 'Het begrip is veel breder: ook IP-adressen, locatiegegevens, foto’s en online identificatoren vallen eronder.',
          en: 'The concept is far broader: IP addresses, location data, photos and online identifiers also qualify.',
        },
      },
      {
        text: {
          nl: 'Alleen gegevens die digitaal worden verwerkt',
          en: 'Only data processed digitally',
        },
        rationale: {
          nl: 'Ook gestructureerde papieren dossiers vallen onder de AVG.',
          en: 'Structured paper files also fall under the GDPR.',
        },
      },
      {
        text: {
          nl: 'Alle gegevens die een organisatie vertrouwelijk heeft verklaard',
          en: 'All data an organization has declared confidential',
        },
        rationale: {
          nl: 'Vertrouwelijkheid is een classificatiekeuze van de organisatie; of iets persoonsgegeven is, volgt uit de wet.',
          en: 'Confidentiality is an organizational classification choice; whether something is personal data follows from the law.',
        },
      },
    ],
    explanation: {
      nl: 'Identificeerbaar betekent dat een persoon direct of indirect te herleiden is, bijvoorbeeld via een identificatienummer, locatiegegevens of een online identificator. Bijzondere persoonsgegevens — gezondheid, religie, ras, politieke opvatting, seksuele gerichtheid, biometrie — kennen een strenger regime. Kernbeginselen: doelbinding, dataminimalisatie, juistheid, opslagbeperking, integriteit en vertrouwelijkheid, en verantwoordingsplicht.',
      en: 'Identifiable means a person can be traced directly or indirectly, for example via an identification number, location data or an online identifier. Special categories of personal data — health, religion, race, political opinion, sexual orientation, biometrics — are subject to a stricter regime. Core principles: purpose limitation, data minimization, accuracy, storage limitation, integrity and confidentiality, and accountability.',
    },
    source: 'Exameneis 4.1.1',
  },
  {
    id: 'isfs-q055',
    objective: '4.2.2',
    type: 'standard',
    bloom: 1,
    difficulty: 2,
    stem: {
      nl: 'Wat is de Baseline Informatiebeveiliging Overheid (BIO)?',
      en: 'What is the Baseline Informatiebeveiliging Overheid (BIO)?',
    },
    options: [
      {
        text: {
          nl: 'Het gezamenlijke normenkader voor informatiebeveiliging binnen de Nederlandse overheid, gebaseerd op ISO/IEC 27001 en 27002',
          en: 'The joint information security framework for the Dutch government, based on ISO/IEC 27001 and 27002',
        },
        correct: true,
      },
      {
        text: {
          nl: 'Een Europese verordening over de beveiliging van vitale infrastructuur',
          en: 'A European regulation on securing critical infrastructure',
        },
        rationale: {
          nl: 'Dat raakt aan de NIS2-richtlijn; de BIO is een Nederlands normenkader voor de overheid.',
          en: 'That relates to the NIS2 directive; the BIO is a Dutch framework for government.',
        },
      },
      {
        text: {
          nl: 'Een certificeringsschema voor beveiligingsproducten',
          en: 'A certification scheme for security products',
        },
        rationale: {
          nl: 'Productcertificering verloopt via andere schema’s, zoals Common Criteria.',
          en: 'Product certification runs through other schemes, such as Common Criteria.',
        },
      },
      {
        text: {
          nl: 'De Nederlandse vertaling van ISO/IEC 27002',
          en: 'The Dutch translation of ISO/IEC 27002',
        },
        rationale: {
          nl: 'De BIO is geen vertaling maar een concretisering met specifieke overheidsmaatregelen.',
          en: 'The BIO is not a translation but a concretization with government-specific controls.',
        },
      },
    ],
    explanation: {
      nl: 'De BIO vertaalt ISO/IEC 27001 en 27002 naar de overheidscontext en maakt de eisen concreet met basisbeveiligingsniveaus. Andere relevante kaders naast de 27000-reeks: NEN 7510 voor de zorg, PCI DSS voor betaalkaartgegevens, de NIS2-richtlijn voor essentiële en belangrijke entiteiten, en het NIST Cybersecurity Framework.',
      en: 'The BIO translates ISO/IEC 27001 and 27002 into the government context and makes the requirements concrete with baseline security levels. Other relevant frameworks alongside the 27000 series: NEN 7510 for healthcare, PCI DSS for payment card data, the NIS2 directive for essential and important entities, and the NIST Cybersecurity Framework.',
    },
    source: 'Exameneis 4.2.2',
  },
  {
    id: 'isfs-q056',
    objective: '4.1.1',
    type: 'standard',
    bloom: 1,
    difficulty: 2,
    stem: {
      nl: 'Een organisatie schakelt een extern bedrijf in dat namens haar persoonsgegevens verwerkt. Welk document is dan verplicht?',
      en: 'An organization engages an external company to process personal data on its behalf. Which document is then mandatory?',
    },
    options: [
      {
        text: { nl: 'Een verwerkersovereenkomst', en: 'A data processing agreement' },
        correct: true,
      },
      {
        text: {
          nl: 'Een geheimhoudingsverklaring met elke individuele medewerker van het bedrijf',
          en: 'A non-disclosure agreement with every individual employee of that company',
        },
        rationale: {
          nl: 'Geheimhouding regel je via de verwerker; individuele NDA’s met diens personeel zijn niet de wettelijke eis.',
          en: 'Confidentiality is arranged via the processor; individual NDAs with their staff are not the legal requirement.',
        },
      },
      {
        text: {
          nl: 'Een ISO/IEC 27001-certificaat van de leverancier',
          en: 'An ISO/IEC 27001 certificate from the supplier',
        },
        rationale: {
          nl: 'Een certificaat is nuttig bewijs van volwassenheid maar niet wettelijk verplicht.',
          en: 'A certificate is useful evidence of maturity but is not legally required.',
        },
      },
      {
        text: {
          nl: 'Een jaarlijks auditrapport',
          en: 'An annual audit report',
        },
        rationale: {
          nl: 'Auditrechten kunnen in de overeenkomst worden opgenomen, maar het rapport zelf is niet de verplichte basis.',
          en: 'Audit rights can be included in the agreement, but the report itself is not the mandatory basis.',
        },
      },
    ],
    explanation: {
      nl: 'De AVG onderscheidt de verwerkingsverantwoordelijke (bepaalt doel en middelen) en de verwerker (verwerkt in opdracht). Tussen beide is een verwerkersovereenkomst verplicht, waarin onder meer staan: doel en aard van de verwerking, beveiligingsmaatregelen, inschakelen van subverwerkers, meldplicht bij datalekken, en teruggave of vernietiging van gegevens na afloop. De verantwoordelijke blijft aansprakelijk.',
      en: 'The GDPR distinguishes the controller (determines purpose and means) and the processor (processes on instruction). A data processing agreement between them is mandatory, covering among other things: the purpose and nature of processing, security measures, engaging sub-processors, breach notification duties, and return or destruction of data afterwards. The controller remains liable.',
    },
    source: 'Exameneis 4.1.1, 1.3.2',
  },
];
