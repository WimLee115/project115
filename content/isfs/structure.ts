import type {
  CertificationSeed,
  DomainSeed,
  ObjectiveSeed,
} from '../types';

/**
 * EXIN Information Security Foundation based on ISO/IEC 27001 — examenstructuur.
 *
 * Overgenomen uit de officiële EXIN preparation guide (editie 202305,
 * hoofdstuk 2 Exameneisen). De examenspecificaties zijn hier fijnmaziger dan
 * bij ITIL: EXIN publiceert een weging per subonderwerp, niet alleen per
 * hoofdonderwerp. Die fijnmazigheid gebruikt de examengenerator direct.
 */

export const certification: CertificationSeed = {
  id: 'exin-isfs',
  provider: 'EXIN',
  title: {
    nl: 'EXIN Information Security Foundation (ISO/IEC 27001)',
    en: 'EXIN Information Security Foundation based on ISO/IEC 27001',
  },
  description: {
    nl:
      'Basisprincipes van informatiebeveiliging: de BIV-driehoek, dreigingen en risico’s, ' +
      'en de organisatorische, menselijke, fysieke en technische beheersmaatregelen. ' +
      'Gesloten boek, 40 vragen in 60 minuten, cesuur 65% (26/40).',
    en:
      'Fundamentals of information security: the CIA triad, threats and risks, and the ' +
      'organizational, people, physical and technological controls. ' +
      'Closed book, 40 questions in 60 minutes, pass mark 65% (26/40).',
  },
  questionCount: 40,
  passMark: 26,
  durationMinutes: 60,
  // EXIN kent geen standaard extra tijd toe voor de Nederlandstalige variant.
  extraTimeMinutes: 0,
  examLanguage: 'nl',
  accentColor: '#0369a1',
  sortOrder: 2,
};

export const domains: DomainSeed[] = [
  {
    code: '1',
    title: {
      nl: 'Informatie en beveiliging',
      en: 'Information and security',
    },
    weight: 27.5,
  },
  {
    code: '2',
    title: { nl: "Dreigingen en risico's", en: 'Threats and risks' },
    weight: 12.5,
  },
  {
    code: '3',
    title: { nl: 'Beheersmaatregelen', en: 'Controls' },
    weight: 52.5,
  },
  {
    code: '4',
    title: {
      nl: 'Wet- en regelgeving en normen',
      en: 'Legislation, regulations and standards',
    },
    weight: 7.5,
  },
];

const T = {
  concepts: {
    nl: '1.1 Concepten met betrekking tot informatie',
    en: '1.1 Concepts related to information',
  },
  reliability: {
    nl: '1.2 Betrouwbaarheidsaspecten',
    en: '1.2 Reliability aspects',
  },
  organization: {
    nl: '1.3 Informatie beveiligen in de organisatie',
    en: '1.3 Securing information in the organization',
  },
  risks: { nl: "2.1 Dreigingen en risico's", en: '2.1 Threats and risks' },
  controlsOutline: {
    nl: '3.1 Schetsen van beheersmaatregelen',
    en: '3.1 Outline of controls',
  },
  organizational: {
    nl: '3.2 Organisatorische beheersmaatregelen',
    en: '3.2 Organizational controls',
  },
  people: {
    nl: '3.3 Menselijke beheersmaatregelen',
    en: '3.3 People controls',
  },
  physical: {
    nl: '3.4 Fysieke beheersmaatregelen',
    en: '3.4 Physical controls',
  },
  technological: {
    nl: '3.5 Technische beheersmaatregelen',
    en: '3.5 Technological controls',
  },
  legislation: {
    nl: '4.1 Wet- en regelgeving',
    en: '4.1 Legislation and regulations',
  },
  standards: { nl: '4.2 Normen', en: '4.2 Standards' },
} as const;

/**
 * Weging per examenspecificatie, zoals EXIN die publiceert. Deze getallen
 * bepalen hoeveel vragen een gegenereerd proefexamen per subonderwerp trekt.
 */
export const specificationWeights: Record<string, number> = {
  '1.1': 10,
  '1.2': 7.5,
  '1.3': 10,
  '2.1': 12.5,
  '3.1': 2.5,
  '3.2': 15,
  '3.3': 7.5,
  '3.4': 10,
  '3.5': 17.5,
  '4.1': 2.5,
  '4.2': 5,
};

export const objectives: ObjectiveSeed[] = [
  /* --- 1. Informatie en beveiliging (27,5%) --------------------------- */
  {
    code: '1.1.1',
    domain: '1',
    topic: T.concepts,
    bloom: 2,
    description: {
      nl: 'Het verschil tussen data en informatie uitleggen.',
      en: 'Explain the difference between data and information.',
    },
  },
  {
    code: '1.1.2',
    domain: '1',
    topic: T.concepts,
    bloom: 2,
    description: {
      nl: 'Concepten met betrekking tot informatiebeveiligingsmanagement uitleggen.',
      en: 'Explain concepts related to information security management.',
    },
  },
  {
    code: '1.2.1',
    domain: '1',
    topic: T.reliability,
    bloom: 2,
    description: {
      nl: 'De waarde van de BIV-driehoek uitleggen.',
      en: 'Explain the value of the CIA triad.',
    },
  },
  {
    code: '1.2.2',
    domain: '1',
    topic: T.reliability,
    bloom: 1,
    description: {
      nl: 'De concepten eindverantwoordelijkheid en controleerbaarheid beschrijven.',
      en: 'Describe the concepts of accountability and auditability.',
    },
  },
  {
    code: '1.3.1',
    domain: '1',
    topic: T.organization,
    bloom: 1,
    description: {
      nl: 'De doelstellingen en inhoud van een informatiebeveiligingsbeleid schetsen.',
      en: 'Outline the objectives and content of an information security policy.',
    },
  },
  {
    code: '1.3.2',
    domain: '1',
    topic: T.organization,
    bloom: 2,
    description: {
      nl: 'Uitleggen hoe informatiebeveiliging kan worden gewaarborgd wanneer er met leveranciers wordt gewerkt.',
      en: 'Explain how information security can be ensured when working with suppliers.',
    },
  },
  {
    code: '1.3.3',
    domain: '1',
    topic: T.organization,
    bloom: 1,
    description: {
      nl: 'Rollen en verantwoordelijkheden schetsen die verband houden met informatiebeveiliging.',
      en: 'Outline roles and responsibilities related to information security.',
    },
  },

  /* --- 2. Dreigingen en risico's (12,5%) ------------------------------ */
  {
    code: '2.1.1',
    domain: '2',
    topic: T.risks,
    bloom: 2,
    description: {
      nl: "Dreigingen, risico's en risicomanagement uitleggen.",
      en: 'Explain threats, risks and risk management.',
    },
  },
  {
    code: '2.1.2',
    domain: '2',
    topic: T.risks,
    bloom: 1,
    description: {
      nl: 'Soorten schade beschrijven.',
      en: 'Describe types of damage.',
    },
  },
  {
    code: '2.1.3',
    domain: '2',
    topic: T.risks,
    bloom: 1,
    description: {
      nl: 'Risicostrategieën beschrijven.',
      en: 'Describe risk strategies.',
    },
  },
  {
    code: '2.1.4',
    domain: '2',
    topic: T.risks,
    bloom: 1,
    description: {
      nl: 'Risicoanalyse beschrijven.',
      en: 'Describe risk analysis.',
    },
  },

  /* --- 3. Beheersmaatregelen (52,5%) ---------------------------------- */
  {
    code: '3.1.1',
    domain: '3',
    topic: T.controlsOutline,
    bloom: 1,
    description: {
      nl: 'Voorbeelden geven van elke soort beheersmaatregel.',
      en: 'Give examples of each type of control.',
    },
  },
  {
    code: '3.2.1',
    domain: '3',
    topic: T.organizational,
    bloom: 2,
    description: {
      nl: 'Uitleggen hoe informatiemiddelen worden geclassificeerd.',
      en: 'Explain how information assets are classified.',
    },
  },
  {
    code: '3.2.2',
    domain: '3',
    topic: T.organizational,
    bloom: 1,
    description: {
      nl: 'Beheersmaatregelen voor de toegang tot informatie beschrijven.',
      en: 'Describe controls for access to information.',
    },
  },
  {
    code: '3.2.3',
    domain: '3',
    topic: T.organizational,
    bloom: 2,
    description: {
      nl: 'Dreigings- en kwetsbaarhedenmanagement, projectmanagement en incidentmanagement uitleggen in de context van informatiebeveiliging.',
      en: 'Explain threat and vulnerability management, project management and incident management in the context of information security.',
    },
  },
  {
    code: '3.2.4',
    domain: '3',
    topic: T.organizational,
    bloom: 2,
    description: {
      nl: 'De waarde van bedrijfscontinuïteit uitleggen.',
      en: 'Explain the value of business continuity.',
    },
  },
  {
    code: '3.2.5',
    domain: '3',
    topic: T.organizational,
    bloom: 1,
    description: {
      nl: 'De waarde van audits en controles beschrijven.',
      en: 'Describe the value of audits and checks.',
    },
  },
  {
    code: '3.3.1',
    domain: '3',
    topic: T.people,
    bloom: 2,
    description: {
      nl: 'Uitleggen hoe informatiebeveiliging wordt verbeterd met contracten en overeenkomsten.',
      en: 'Explain how information security is improved with contracts and agreements.',
    },
  },
  {
    code: '3.3.2',
    domain: '3',
    topic: T.people,
    bloom: 2,
    description: {
      nl: 'Uitleggen hoe bewustwording met betrekking tot informatiebeveiliging wordt verhoogd.',
      en: 'Explain how information security awareness is increased.',
    },
  },
  {
    code: '3.4.1',
    domain: '3',
    topic: T.physical,
    bloom: 1,
    description: {
      nl: 'Beheersmaatregelen voor fysieke toegang beschrijven.',
      en: 'Describe controls for physical access.',
    },
  },
  {
    code: '3.4.2',
    domain: '3',
    topic: T.physical,
    bloom: 1,
    description: {
      nl: 'Beschrijven hoe informatie binnen beveiligde gebieden wordt beschermd.',
      en: 'Describe how information is protected within secure areas.',
    },
  },
  {
    code: '3.4.3',
    domain: '3',
    topic: T.physical,
    bloom: 2,
    description: {
      nl: 'Uitleggen hoe beschermingsringen werken.',
      en: 'Explain how protection rings work.',
    },
  },
  {
    code: '3.5.1',
    domain: '3',
    topic: T.technological,
    bloom: 1,
    description: {
      nl: 'Schetsen hoe informatiemiddelen worden beheerd.',
      en: 'Outline how information assets are managed.',
    },
  },
  {
    code: '3.5.2',
    domain: '3',
    topic: T.technological,
    bloom: 1,
    description: {
      nl: 'Beschrijven hoe systemen worden ontwikkeld met aandacht voor informatiebeveiliging.',
      en: 'Describe how systems are developed with attention to information security.',
    },
  },
  {
    code: '3.5.3',
    domain: '3',
    topic: T.technological,
    bloom: 1,
    description: {
      nl: 'Beheersmaatregelen noemen die de netwerkbeveiliging waarborgen.',
      en: 'Name controls that ensure network security.',
    },
  },
  {
    code: '3.5.4',
    domain: '3',
    topic: T.technological,
    bloom: 1,
    description: {
      nl: 'Technische beheersmaatregelen voor toegangsbeheer (access control) beschrijven.',
      en: 'Describe technological controls for access control.',
    },
  },
  {
    code: '3.5.5',
    domain: '3',
    topic: T.technological,
    bloom: 1,
    description: {
      nl: 'Beschrijven hoe informatiesystemen worden beschermd tegen malware, phishing en spam.',
      en: 'Describe how information systems are protected against malware, phishing and spam.',
    },
  },
  {
    code: '3.5.6',
    domain: '3',
    topic: T.technological,
    bloom: 2,
    description: {
      nl: 'Uitleggen hoe logging en monitoring bijdragen aan informatiebeveiliging.',
      en: 'Explain how logging and monitoring contribute to information security.',
    },
  },

  /* --- 4. Wet- en regelgeving en normen (7,5%) ------------------------ */
  {
    code: '4.1.1',
    domain: '4',
    topic: T.legislation,
    bloom: 1,
    description: {
      nl: 'Voorbeelden geven van wet- en regelgeving met betrekking tot informatiebeveiliging.',
      en: 'Give examples of legislation and regulations related to information security.',
    },
  },
  {
    code: '4.2.1',
    domain: '4',
    topic: T.standards,
    bloom: 1,
    description: {
      nl: 'De inhoud van de normen ISO/IEC 27000, ISO/IEC 27001 en ISO/IEC 27002 schetsen.',
      en: 'Outline the content of the ISO/IEC 27000, ISO/IEC 27001 and ISO/IEC 27002 standards.',
    },
  },
  {
    code: '4.2.2',
    domain: '4',
    topic: T.standards,
    bloom: 1,
    description: {
      nl: 'De inhoud van andere normen met betrekking tot informatiebeveiliging schetsen.',
      en: 'Outline the content of other standards related to information security.',
    },
  },
];
