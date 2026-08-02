import type {
  CertificationSeed,
  DomainSeed,
  ObjectiveSeed,
} from '../types';

/**
 * ITIL Foundation (Version 5) — examenstructuur.
 *
 * Overgenomen uit de officiële PeopleCert-syllabus (Appendix 2, secties 2, 4
 * en 5). De wegingen bepalen hoeveel vragen een gegenereerd proefexamen uit
 * elk domein trekt, zodat een oefenexamen dezelfde verdeling heeft als het
 * echte examen.
 */

export const certification: CertificationSeed = {
  id: 'itil5-foundation',
  provider: 'PeopleCert',
  title: {
    nl: 'ITIL Foundation (Version 5)',
    en: 'ITIL Foundation (Version 5)',
  },
  description: {
    nl:
      'Kernconcepten van digitaal product- en servicemanagement: het ITIL-waardesysteem, ' +
      'de zeven leidende principes, de vier dimensies, de acht levenscyclusactiviteiten ' +
      'en de rol van AI. Gesloten boek, 40 vragen in 60 minuten, 26 goed om te slagen.',
    en:
      'Core concepts of digital product and service management: the ITIL Value System, ' +
      'the seven guiding principles, the four dimensions, the eight lifecycle activities ' +
      'and the role of AI. Closed book, 40 questions in 60 minutes, 26 correct to pass.',
  },
  questionCount: 40,
  passMark: 26,
  durationMinutes: 60,
  // PeopleCert kent 25% extra tijd toe wanneer het examen niet in je moedertaal is.
  extraTimeMinutes: 15,
  examLanguage: 'en',
  accentColor: '#7c3aed',
  sortOrder: 1,
};

export const domains: DomainSeed[] = [
  {
    code: '1',
    title: {
      nl: 'Kernbegrippen en definities',
      en: 'Key ITIL terms and definitions',
    },
    weight: 30.0,
  },
  {
    code: '2',
    title: {
      nl: 'De vier dimensies van product- en servicemanagement',
      en: 'The ITIL Four Dimensions of Product and Service Management',
    },
    weight: 10.0,
  },
  {
    code: '3',
    title: {
      nl: 'De ITIL product- en servicelevenscyclus',
      en: 'The ITIL Product and Service Lifecycle',
    },
    weight: 10.0,
  },
  {
    code: '4',
    title: {
      nl: 'Het ITIL-waardesysteem',
      en: 'The ITIL Value System',
    },
    weight: 40.0,
  },
  {
    code: '5',
    title: {
      nl: 'Waardestromen: identificatie, mapping en management',
      en: 'Value stream identification, mapping, and management',
    },
    weight: 5.0,
  },
  {
    code: '6',
    title: { nl: 'ITIL en AI', en: 'ITIL and AI' },
    weight: 2.5,
  },
  {
    code: '7',
    title: {
      nl: 'ITIL en andere frameworks',
      en: 'ITIL and other frameworks',
    },
    weight: 2.5,
  },
];

/** Onderwerpen, hergebruikt over meerdere leerdoelen. */
const T = {
  productService: {
    nl: '1.1 Product- en servicemanagement',
    en: '1.1 Product and service management',
  },
  serviceOffering: { nl: '1.2 Serviceaanbod', en: '1.2 Service offering' },
  valueCoCreation: { nl: '1.3 Waardeco-creatie', en: '1.3 Value co-creation' },
  serviceRelationships: {
    nl: '1.4 Servicerelaties',
    en: '1.4 Service relationships',
  },
  fourDimIntro: {
    nl: '2.1 Introductie tot de vier dimensies',
    en: '2.1 Introduction to the ITIL Four Dimensions',
  },
  fourDimFactors: {
    nl: '2.2 Interne en externe factoren',
    en: '2.2 Internal factors and External factors',
  },
  lifecycleIntro: {
    nl: '3.1 Introductie tot de levenscyclus',
    en: '3.1 Introduction to the Product and Service Lifecycle',
  },
  lifecyclePurpose: {
    nl: '3.2 Doel van de levenscyclusactiviteiten',
    en: '3.2 Purpose of the lifecycle management activities',
  },
  vsComponents: {
    nl: '4.1 Componenten van het ITIL-waardesysteem',
    en: '4.1 Components of the ITIL Value System',
  },
  guidingPrinciples: {
    nl: '4.2 De ITIL leidende principes',
    en: '4.2 The ITIL Guiding Principles',
  },
  governance: { nl: '4.3 Governance', en: '4.3 Governance' },
  valueChain: { nl: '4.4 Waardeketen', en: '4.4 Value chain' },
  practices: {
    nl: '4.5 Managementwerkwijzen',
    en: '4.5 Management practices',
  },
  continualImprovement: {
    nl: '4.6 Het ITIL-model voor voortdurend verbeteren',
    en: '4.6 The ITIL Continual Improvement Model',
  },
  vsKeyConcepts: {
    nl: '5.1 Kernbegrippen van waardestromen',
    en: '5.1 Key concepts of value stream mapping and management',
  },
  vsApplication: {
    nl: '5.2 Toepassing van waardestromen',
    en: '5.2 Application of value streams',
  },
  vsPurpose: {
    nl: '5.3 Doel van waardestroom-mapping en -management',
    en: '5.3 Purpose of value stream mapping and management',
  },
  aiIntro: { nl: '6.1 Introductie tot AI', en: '6.1 Introduction to AI' },
  aiGovernance: { nl: '6.2 ITIL AI-governance', en: '6.2 ITIL AI Governance' },
  devops: { nl: '7.1 ITIL en DevOps', en: '7.1 ITIL and DevOps' },
  prince2: { nl: '7.2 ITIL en PRINCE2', en: '7.2 ITIL and PRINCE2' },
} as const;

export const objectives: ObjectiveSeed[] = [
  /* --- 1. Kernbegrippen en definities (30%) --------------------------- */
  {
    code: '1.1.1',
    domain: '1',
    topic: T.productService,
    bloom: 1,
    description: {
      nl: 'Digitaal product- en servicemanagement definiëren.',
      en: 'Define digital product and service management.',
    },
  },
  {
    code: '1.1.2',
    domain: '1',
    topic: T.productService,
    bloom: 1,
    description: {
      nl: 'Product en service definiëren als kernbegrip van digitaal product- en servicemanagement.',
      en: 'Define product and service as a key concept of digital product and service management.',
    },
  },
  {
    code: '1.1.3',
    domain: '1',
    topic: T.productService,
    bloom: 1,
    description: {
      nl: 'Digitaal product en digitale service definiëren als kernbegrip.',
      en: 'Define digital product and digital service as a key concept.',
    },
  },
  {
    code: '1.1.4',
    domain: '1',
    topic: T.productService,
    bloom: 1,
    description: {
      nl: 'Voortdurend verbeteren definiëren als kernbegrip.',
      en: 'Define continual improvement as a key concept.',
    },
  },
  {
    code: '1.1.5',
    domain: '1',
    topic: T.productService,
    bloom: 1,
    description: {
      nl: 'De ITIL product- en servicelevenscyclus definiëren als kernbegrip.',
      en: 'Define the ITIL Product and Service Lifecycle as a key concept.',
    },
  },
  {
    code: '1.1.6',
    domain: '1',
    topic: T.productService,
    bloom: 1,
    description: { nl: 'Goederen (goods) definiëren.', en: 'Define goods.' },
  },
  {
    code: '1.1.7',
    domain: '1',
    topic: T.productService,
    bloom: 1,
    description: {
      nl: 'Bruikbaarheid (utility), garantie (warranty), gebruikerservaring en duurzaamheid definiëren.',
      en: 'Define utility, warranty, user experience and sustainability.',
    },
  },
  {
    code: '1.2.1',
    domain: '1',
    topic: T.serviceOffering,
    bloom: 1,
    description: { nl: 'Serviceaanbod definiëren.', en: 'Define service offering.' },
  },
  {
    code: '1.2.2',
    domain: '1',
    topic: T.serviceOffering,
    bloom: 1,
    description: {
      nl: 'Serviceacties, overdracht van goederen en toegang tot middelen definiëren.',
      en: 'Define service actions, transfer of goods, and access to resources.',
    },
  },
  {
    code: '1.2.3',
    domain: '1',
    topic: T.serviceOffering,
    bloom: 2,
    description: { nl: 'Serviceaanbod uitleggen.', en: 'Explain service offering.' },
  },
  {
    code: '1.2.4',
    domain: '1',
    topic: T.serviceOffering,
    bloom: 2,
    description: {
      nl: 'Serviceacties, overdracht van goederen en toegang tot middelen uitleggen.',
      en: 'Explain service actions, transfer of goods, and access to resources.',
    },
  },
  {
    code: '1.3.1',
    domain: '1',
    topic: T.valueCoCreation,
    bloom: 1,
    description: {
      nl: 'Waarde en waardeco-creatie definiëren.',
      en: 'Define value and value co-creation.',
    },
  },
  {
    code: '1.3.2',
    domain: '1',
    topic: T.valueCoCreation,
    bloom: 1,
    description: { nl: 'Kosten en risico definiëren.', en: 'Define cost and risk.' },
  },
  {
    code: '1.3.3',
    domain: '1',
    topic: T.valueCoCreation,
    bloom: 1,
    description: {
      nl: 'Output en outcome definiëren.',
      en: 'Define output and outcome.',
    },
  },
  {
    code: '1.3.4',
    domain: '1',
    topic: T.valueCoCreation,
    bloom: 2,
    description: {
      nl: 'Het verschil tussen output en outcome begrijpen.',
      en: 'Understand the difference between output and outcome.',
    },
  },
  {
    code: '1.3.5',
    domain: '1',
    topic: T.valueCoCreation,
    bloom: 2,
    description: {
      nl: 'Uitleggen hoe het gebruik van producten en services waardeco-creatie mogelijk maakt.',
      en: 'Explain how the use of products and services enables the co-creation of value.',
    },
  },
  {
    code: '1.3.6',
    domain: '1',
    topic: T.valueCoCreation,
    bloom: 2,
    description: {
      nl: 'Uitleggen hoe uitkomsten, kosten en risico’s bijdragen aan waardeco-creatie.',
      en: 'Explain how outcomes, costs, risks contribute to value co-creation.',
    },
  },
  {
    code: '1.4.1',
    domain: '1',
    topic: T.serviceRelationships,
    bloom: 1,
    description: {
      nl: 'Organisatie, serviceprovider, serviceconsument en leverancier van digitale producten definiëren.',
      en: 'Define organization, service provider, service consumer, and digital product vendor.',
    },
  },
  {
    code: '1.4.2',
    domain: '1',
    topic: T.serviceRelationships,
    bloom: 1,
    description: {
      nl: 'Basis-, coöperatieve en collaboratieve (partnerschap) servicerelatie definiëren.',
      en: 'Define basic, cooperative, and collaborative (partnership) service relationship.',
    },
  },
  {
    code: '1.4.3',
    domain: '1',
    topic: T.serviceRelationships,
    bloom: 1,
    description: {
      nl: 'Het servicetraject (service journey) definiëren.',
      en: 'Define the service journey.',
    },
  },
  {
    code: '1.4.4',
    domain: '1',
    topic: T.serviceRelationships,
    bloom: 1,
    description: {
      nl: 'De rollen sponsor, klant en gebruiker definiëren.',
      en: 'Define sponsor, customer, and user roles.',
    },
  },
  {
    code: '1.4.5',
    domain: '1',
    topic: T.serviceRelationships,
    bloom: 1,
    description: {
      nl: 'Servicekwaliteit en serviceniveau definiëren.',
      en: 'Define service quality and service level.',
    },
  },
  {
    code: '1.4.6',
    domain: '1',
    topic: T.serviceRelationships,
    bloom: 1,
    description: {
      nl: 'Service Level Agreement (SLA) definiëren.',
      en: 'Define Service Level Agreement (SLA).',
    },
  },
  {
    code: '1.4.7',
    domain: '1',
    topic: T.serviceRelationships,
    bloom: 1,
    description: {
      nl: 'De rol van serviceproviders in servicerelaties begrijpen.',
      en: 'Understand the role of service providers in service relationships.',
    },
  },
  {
    code: '1.4.8',
    domain: '1',
    topic: T.serviceRelationships,
    bloom: 2,
    description: {
      nl: 'De rol van serviceconsumenten in servicerelaties begrijpen.',
      en: 'Understand the role of service consumers in service relationships.',
    },
  },
  {
    code: '1.4.9',
    domain: '1',
    topic: T.serviceRelationships,
    bloom: 2,
    description: {
      nl: 'De rol van leveranciers van digitale producten in servicerelaties begrijpen.',
      en: 'Understand the role of digital product vendors in service relationships.',
    },
  },
  {
    code: '1.4.10',
    domain: '1',
    topic: T.serviceRelationships,
    bloom: 2,
    description: {
      nl: 'Het verschil begrijpen tussen basis-, coöperatieve en collaboratieve servicerelaties.',
      en: 'Understand the difference between basic, cooperative, and collaborative service relationships.',
    },
  },
  {
    code: '1.4.11',
    domain: '1',
    topic: T.serviceRelationships,
    bloom: 2,
    description: {
      nl: 'Bruikbaarheid, garantie, gebruikerservaring en duurzaamheid uitleggen als kernbegrippen van servicerelaties.',
      en: 'Explain utility, warranty, user experience, sustainability as key concepts of service relationships.',
    },
  },

  /* --- 2. De vier dimensies (10%) ------------------------------------- */
  {
    code: '2.1.1',
    domain: '2',
    topic: T.fourDimIntro,
    bloom: 1,
    description: {
      nl: 'De vier dimensies opsommen: organisaties en mensen, partners en leveranciers, informatie en technologie, waardestromen en processen.',
      en: 'List the ITIL Four Dimensions: organizations and people, partners and suppliers, information and technology, value streams and processes.',
    },
  },
  {
    code: '2.1.2',
    domain: '2',
    topic: T.fourDimIntro,
    bloom: 2,
    description: {
      nl: 'De scope van elk van de vier dimensies begrijpen.',
      en: 'Understand the scope of each of the ITIL Four Dimensions.',
    },
  },
  {
    code: '2.1.3',
    domain: '2',
    topic: T.fourDimIntro,
    bloom: 2,
    description: {
      nl: 'Het belang van de holistische benadering van de vier dimensies uitleggen.',
      en: 'Explain the importance of the holistic approach of the ITIL Four Dimensions.',
    },
  },
  {
    code: '2.2.1',
    domain: '2',
    topic: T.fourDimFactors,
    bloom: 1,
    description: {
      nl: 'De externe factoren kennen die de vier dimensies beïnvloeden (PESTLE).',
      en: 'Know the external factors that influence the ITIL Four Dimensions (PESTLE).',
    },
  },
  {
    code: '2.2.2',
    domain: '2',
    topic: T.fourDimFactors,
    bloom: 2,
    description: {
      nl: '‘Organisaties en mensen’, ‘partners en leveranciers’, ‘informatie en technologie’ en ‘waardestromen en processen’ uitleggen.',
      en: "Explain 'organizations and people', 'partners and suppliers', 'information and technology', 'value streams and processes'.",
    },
  },

  /* --- 3. Product- en servicelevenscyclus (10%) ------------------------ */
  {
    code: '3.1.1',
    domain: '3',
    topic: T.lifecycleIntro,
    bloom: 1,
    description: {
      nl: 'De levenscyclusactiviteiten opsommen: ontdekken, ontwerpen, verwerven, bouwen, transitie, beheren, leveren, ondersteunen.',
      en: 'List the digital product and service lifecycle management activities: discover, design, acquire, build, transition, operate, deliver, support.',
    },
  },
  {
    code: '3.1.2',
    domain: '3',
    topic: T.lifecycleIntro,
    bloom: 2,
    description: {
      nl: 'De levenscyclus begrijpen en hoe de waardeketenactiviteiten deze mogelijk maken.',
      en: 'Understand the ITIL Product and Service Lifecycle and how the value chain activities enable it.',
    },
  },
  {
    code: '3.1.3',
    domain: '3',
    topic: T.lifecycleIntro,
    bloom: 2,
    description: {
      nl: 'Begrijpen dat de activiteiten niet sequentieel of lineair zijn en iteratief gebruikt kunnen worden.',
      en: 'Understand that the lifecycle management activities are not sequential nor linear and can be used iteratively.',
    },
  },
  {
    code: '3.2.1',
    domain: '3',
    topic: T.lifecyclePurpose,
    bloom: 1,
    description: {
      nl: "Het doel van de activiteit 'ontdekken' (discover) kennen.",
      en: "Know the purpose of the 'discover' activity.",
    },
  },
  {
    code: '3.2.2',
    domain: '3',
    topic: T.lifecyclePurpose,
    bloom: 1,
    description: {
      nl: "Het doel van de activiteit 'ontwerpen' (design) kennen.",
      en: "Know the purpose of the 'design' activity.",
    },
  },
  {
    code: '3.2.3',
    domain: '3',
    topic: T.lifecyclePurpose,
    bloom: 1,
    description: {
      nl: "Het doel van de activiteit 'verwerven' (acquire) kennen.",
      en: "Know the purpose of the 'acquire' activity.",
    },
  },
  {
    code: '3.2.4',
    domain: '3',
    topic: T.lifecyclePurpose,
    bloom: 1,
    description: {
      nl: "Het doel van de activiteit 'bouwen' (build) kennen.",
      en: "Know the purpose of the 'build' activity.",
    },
  },
  {
    code: '3.2.5',
    domain: '3',
    topic: T.lifecyclePurpose,
    bloom: 1,
    description: {
      nl: "Het doel van de activiteit 'transitie' (transition) kennen.",
      en: "Know the purpose of the 'transition' activity.",
    },
  },
  {
    code: '3.2.6',
    domain: '3',
    topic: T.lifecyclePurpose,
    bloom: 1,
    description: {
      nl: "Het doel van de activiteit 'beheren' (operate) kennen.",
      en: "Know the purpose of the 'operate' activity.",
    },
  },
  {
    code: '3.2.7',
    domain: '3',
    topic: T.lifecyclePurpose,
    bloom: 1,
    description: {
      nl: "Het doel van de activiteit 'leveren' (deliver) kennen.",
      en: "Know the purpose of the 'deliver' activity.",
    },
  },
  {
    code: '3.2.8',
    domain: '3',
    topic: T.lifecyclePurpose,
    bloom: 1,
    description: {
      nl: "Het doel van de activiteit 'ondersteunen' (support) kennen.",
      en: "Know the purpose of the 'support' activity.",
    },
  },

  /* --- 4. Het ITIL-waardesysteem (40%) -------------------------------- */
  {
    code: '4.1.1',
    domain: '4',
    topic: T.vsComponents,
    bloom: 1,
    description: {
      nl: 'De componenten van het ITIL-waardesysteem en hun rol kennen: leidende principes, governance, waardeketen, managementwerkwijzen, voortdurend verbeteren.',
      en: 'Know the components of the ITIL Value System and their role: guiding principles, governance, value chain, management practices, continual improvement.',
    },
  },
  {
    code: '4.1.2',
    domain: '4',
    topic: T.vsComponents,
    bloom: 2,
    description: {
      nl: 'Het ITIL-waardesysteem en het doel ervan uitleggen.',
      en: 'Explain the ITIL Value System (ITIL VS) and its purpose.',
    },
  },
  {
    code: '4.2.1',
    domain: '4',
    topic: T.guidingPrinciples,
    bloom: 1,
    description: {
      nl: 'De zeven ITIL leidende principes opsommen.',
      en: 'List the ITIL Guiding Principles.',
    },
  },
  {
    code: '4.2.2',
    domain: '4',
    topic: T.guidingPrinciples,
    bloom: 2,
    description: {
      nl: "Het principe 'focus op waarde' begrijpen en hoe het toegepast moet worden.",
      en: "Understand the 'focus on value' guiding principle and how it should be used.",
    },
  },
  {
    code: '4.2.3',
    domain: '4',
    topic: T.guidingPrinciples,
    bloom: 2,
    description: {
      nl: "Het principe 'begin waar je bent' begrijpen en hoe het toegepast moet worden.",
      en: "Understand the 'start where you are' guiding principle and how it should be used.",
    },
  },
  {
    code: '4.2.4',
    domain: '4',
    topic: T.guidingPrinciples,
    bloom: 2,
    description: {
      nl: "Het principe 'maak iteratieve voortgang met feedback' begrijpen en hoe het toegepast moet worden.",
      en: "Understand the 'progress iteratively with feedback' guiding principle and how it should be used.",
    },
  },
  {
    code: '4.2.5',
    domain: '4',
    topic: T.guidingPrinciples,
    bloom: 2,
    description: {
      nl: "Het principe 'werk samen en bevorder transparantie' begrijpen en hoe het toegepast moet worden.",
      en: "Understand the 'collaborate and promote visibility' guiding principle and how it should be used.",
    },
  },
  {
    code: '4.2.6',
    domain: '4',
    topic: T.guidingPrinciples,
    bloom: 2,
    description: {
      nl: "Het principe 'denk en werk holistisch' begrijpen en hoe het toegepast moet worden.",
      en: "Understand the 'think and work holistically' guiding principle and how it should be used.",
    },
  },
  {
    code: '4.2.7',
    domain: '4',
    topic: T.guidingPrinciples,
    bloom: 2,
    description: {
      nl: "Het principe 'houd het eenvoudig en praktisch' begrijpen en hoe het toegepast moet worden.",
      en: "Understand the 'keep it simple and practical' guiding principle and how it should be used.",
    },
  },
  {
    code: '4.2.8',
    domain: '4',
    topic: T.guidingPrinciples,
    bloom: 2,
    description: {
      nl: "Het principe 'optimaliseer en automatiseer' begrijpen en hoe het toegepast moet worden.",
      en: "Understand the 'optimize and automate' guiding principle and how it should be used.",
    },
  },
  {
    code: '4.2.9',
    domain: '4',
    topic: T.guidingPrinciples,
    bloom: 2,
    description: {
      nl: 'De interactie tussen de leidende principes beschrijven en hoe ze samenwerken.',
      en: 'Describe the interaction of the ITIL Guiding Principles and how they work together.',
    },
  },
  {
    code: '4.3.1',
    domain: '4',
    topic: T.governance,
    bloom: 1,
    description: { nl: 'Governance definiëren.', en: 'Define governance.' },
  },
  {
    code: '4.3.2',
    domain: '4',
    topic: T.governance,
    bloom: 2,
    description: {
      nl: 'De faciliterende aard en de activiteiten van governance uitleggen.',
      en: 'Explain the enabling nature and the activities of governance.',
    },
  },
  {
    code: '4.4.1',
    domain: '4',
    topic: T.valueChain,
    bloom: 1,
    description: { nl: 'Waardeketen definiëren.', en: 'Define value chain.' },
  },
  {
    code: '4.4.2',
    domain: '4',
    topic: T.valueChain,
    bloom: 1,
    description: {
      nl: 'Productspecificatie en productprototype definiëren.',
      en: 'Define product specification and product prototype.',
    },
  },
  {
    code: '4.4.3',
    domain: '4',
    topic: T.valueChain,
    bloom: 1,
    description: {
      nl: 'Incident en event (gebeurtenis) definiëren.',
      en: 'Define incident and event.',
    },
  },
  {
    code: '4.4.4',
    domain: '4',
    topic: T.valueChain,
    bloom: 1,
    description: {
      nl: 'Release en test definiëren.',
      en: 'Define release and test.',
    },
  },
  {
    code: '4.4.5',
    domain: '4',
    topic: T.valueChain,
    bloom: 1,
    description: {
      nl: 'Continuous integration, continuous delivery en continuous deployment definiëren.',
      en: 'Define continuous integration, continuous delivery and continuous deployment.',
    },
  },
  {
    code: '4.4.6',
    domain: '4',
    topic: T.valueChain,
    bloom: 1,
    description: {
      nl: 'Betrouwbaarheid, Site Reliability Engineering (SRE) en observeerbaarheid definiëren.',
      en: 'Define reliability, Site Reliability Engineering (SRE), and observability.',
    },
  },
  {
    code: '4.4.7',
    domain: '4',
    topic: T.valueChain,
    bloom: 1,
    description: {
      nl: 'Serviceaanvraag (service request) definiëren.',
      en: 'Define service request.',
    },
  },
  {
    code: '4.4.8',
    domain: '4',
    topic: T.valueChain,
    bloom: 1,
    description: {
      nl: 'Ramp (disaster), probleem, fout en bekende fout definiëren.',
      en: 'Define disaster, problem, error, and known error.',
    },
  },
  {
    code: '4.4.9',
    domain: '4',
    topic: T.valueChain,
    bloom: 1,
    description: {
      nl: 'Operationeel model (operating model) definiëren.',
      en: 'Define operating model.',
    },
  },
  {
    code: '4.4.10',
    domain: '4',
    topic: T.valueChain,
    bloom: 2,
    description: {
      nl: 'Onderscheid maken tussen een probleem, een fout en een bekende fout.',
      en: 'Distinguish between a problem, an error and a known error.',
    },
  },
  {
    code: '4.4.11',
    domain: '4',
    topic: T.valueChain,
    bloom: 2,
    description: {
      nl: 'De belangrijkste succesmetrics van de waardeketenactiviteiten begrijpen.',
      en: 'Understand the key success metrics of the value chain activities.',
    },
  },
  {
    code: '4.4.12',
    domain: '4',
    topic: T.valueChain,
    bloom: 2,
    description: {
      nl: 'Uitleggen hoe het doel en operationeel model van een organisatie worden ondersteund door waardeketenactiviteiten en managementwerkwijzen.',
      en: "Explain how an organization's purpose and operating model are supported by value chain activities and management practices.",
    },
  },
  {
    code: '4.5.1',
    domain: '4',
    topic: T.practices,
    bloom: 1,
    description: {
      nl: 'Managementwerkwijze (management practice) definiëren.',
      en: 'Define management practice.',
    },
  },
  {
    code: '4.5.2',
    domain: '4',
    topic: T.practices,
    bloom: 1,
    description: {
      nl: 'De groepen managementwerkwijzen kennen: algemene en product- en servicemanagementwerkwijzen.',
      en: 'Know the management practice groups: general and product and service management practices.',
    },
  },
  {
    code: '4.5.3',
    domain: '4',
    topic: T.practices,
    bloom: 2,
    description: {
      nl: 'De rol van managementwerkwijzen binnen het ITIL-waardesysteem begrijpen.',
      en: 'Understand the role of the management practices in the ITIL Value System.',
    },
  },
  {
    code: '4.5.4',
    domain: '4',
    topic: T.practices,
    bloom: 2,
    description: {
      nl: 'De structuur van de ITIL Practice Guides uitleggen.',
      en: 'Explain the structure of the ITIL Practice Guides.',
    },
  },
  {
    code: '4.5.5',
    domain: '4',
    topic: T.practices,
    bloom: 2,
    description: {
      nl: 'De voordelen van de ITIL Practice Guides uitleggen.',
      en: 'Explain the benefits of the ITIL Practice Guides.',
    },
  },
  {
    code: '4.5.6',
    domain: '4',
    topic: T.practices,
    bloom: 1,
    description: {
      nl: 'Metric en kritieke succesfactor (CSF) definiëren.',
      en: 'Define metric and critical success factor (CSF).',
    },
  },
  {
    code: '4.6.1',
    domain: '4',
    topic: T.continualImprovement,
    bloom: 1,
    description: {
      nl: 'De stappen van het ITIL-model voor voortdurend verbeteren opsommen.',
      en: 'List the steps of the ITIL Continual Improvement Model.',
    },
  },
  {
    code: '4.6.2',
    domain: '4',
    topic: T.continualImprovement,
    bloom: 2,
    description: {
      nl: 'De stappen van het ITIL-model voor voortdurend verbeteren begrijpen.',
      en: 'Understand the steps of the ITIL Continual Improvement Model.',
    },
  },
  {
    code: '4.6.3',
    domain: '4',
    topic: T.continualImprovement,
    bloom: 2,
    description: {
      nl: 'Voortdurend verbeteren binnen het ITIL-waardesysteem en de rol ervan in de organisatie beschrijven.',
      en: 'Describe continual improvement within the ITIL Value System and its role in the organization.',
    },
  },

  /* --- 5. Waardestromen (5%) ------------------------------------------ */
  {
    code: '5.1.1',
    domain: '5',
    topic: T.vsKeyConcepts,
    bloom: 1,
    description: {
      nl: 'Waardestroom, kernwaardestroom en ondersteunende waardestroom definiëren.',
      en: 'Define value stream, core value stream, and enabling value stream.',
    },
  },
  {
    code: '5.1.2',
    domain: '5',
    topic: T.vsKeyConcepts,
    bloom: 1,
    description: {
      nl: 'Waardestroom-mapping en waardestroom-management definiëren.',
      en: 'Define value stream mapping and value stream management.',
    },
  },
  {
    code: '5.1.3',
    domain: '5',
    topic: T.vsKeyConcepts,
    bloom: 1,
    description: {
      nl: 'Complexiteitsdenken (complexity thinking) definiëren.',
      en: 'Define complexity thinking.',
    },
  },
  {
    code: '5.1.4',
    domain: '5',
    topic: T.vsKeyConcepts,
    bloom: 2,
    description: {
      nl: 'Het verschil begrijpen tussen een kernwaardestroom en een ondersteunende waardestroom.',
      en: 'Understand the difference between a core and an enabling value stream.',
    },
  },
  {
    code: '5.2.1',
    domain: '5',
    topic: T.vsApplication,
    bloom: 2,
    description: {
      nl: 'Begrijpen hoe workflows geoptimaliseerd moeten worden voor complexiteit.',
      en: 'Understand how workflows need to be optimized for complexity.',
    },
  },
  {
    code: '5.3.1',
    domain: '5',
    topic: T.vsPurpose,
    bloom: 1,
    description: {
      nl: 'Het doel van waardestroom-mapping en -management kennen.',
      en: 'Know the purpose of value stream mapping and management.',
    },
  },
  {
    code: '5.3.2',
    domain: '5',
    topic: T.vsPurpose,
    bloom: 2,
    description: {
      nl: 'De relatie tussen waardestroom-mapping en waardestroom-management begrijpen.',
      en: 'Understand the relationship between value stream mapping and value stream management.',
    },
  },
  {
    code: '5.3.3',
    domain: '5',
    topic: T.vsPurpose,
    bloom: 2,
    description: {
      nl: 'De elementen van een waardestroomkaart begrijpen.',
      en: 'Understand the elements of a value stream map.',
    },
  },

  /* --- 6. ITIL en AI (2,5%) ------------------------------------------- */
  {
    code: '6.1.1',
    domain: '6',
    topic: T.aiIntro,
    bloom: 1,
    description: {
      nl: 'Artificial Intelligence (AI), AI-volwassenheid, GenAI en Agentic AI definiëren.',
      en: 'Define Artificial Intelligence (AI), AI maturity, GenAI, and Agentic AI.',
    },
  },
  {
    code: '6.1.2',
    domain: '6',
    topic: T.aiIntro,
    bloom: 2,
    description: {
      nl: 'Begrijpen hoe AI kan helpen in de product- en serviceontwikkelingscyclus en bij automatisering.',
      en: 'Understand how AI can assist in the product and service development lifecycle and in automation.',
    },
  },
  {
    code: '6.1.3',
    domain: '6',
    topic: T.aiIntro,
    bloom: 2,
    description: {
      nl: 'Begrijpen hoe AI benut kan worden binnen de ITIL-waardeketenactiviteiten.',
      en: 'Understand how AI can be leveraged throughout the ITIL value chain activities.',
    },
  },
  {
    code: '6.2.1',
    domain: '6',
    topic: T.aiGovernance,
    bloom: 1,
    description: { nl: 'AI-governance definiëren.', en: 'Define AI governance.' },
  },
  {
    code: '6.2.2',
    domain: '6',
    topic: T.aiGovernance,
    bloom: 2,
    description: {
      nl: 'Het ITIL AI Capability Model begrijpen.',
      en: 'Understand the ITIL AI Capability Model.',
    },
  },

  /* --- 7. ITIL en andere frameworks (2,5%) ---------------------------- */
  {
    code: '7.1.1',
    domain: '7',
    topic: T.devops,
    bloom: 2,
    description: {
      nl: 'Begrijpen hoe ITIL en DevOps samen gebruikt kunnen worden.',
      en: 'Understand how ITIL and DevOps can be used together.',
    },
  },
  {
    code: '7.1.2',
    domain: '7',
    topic: T.devops,
    bloom: 2,
    description: {
      nl: 'Begrijpen hoe ITIL en DevOps complementair zijn in het managen van de product- en servicelevenscyclus.',
      en: 'Understand how ITIL and DevOps are complementary in the management of the product and service lifecycle.',
    },
  },
  {
    code: '7.2.1',
    domain: '7',
    topic: T.prince2,
    bloom: 2,
    description: {
      nl: 'Begrijpen waarom projectmanagement belangrijk is binnen ITIL.',
      en: 'Understand why project management is important in ITIL.',
    },
  },
  {
    code: '7.2.2',
    domain: '7',
    topic: T.prince2,
    bloom: 2,
    description: {
      nl: 'Begrijpen hoe ITIL en PRINCE2 complementair zijn in het managen van de product- en servicelevenscyclus.',
      en: 'Understand how ITIL and PRINCE2 are complementary in the management of the product and service lifecycle.',
    },
  },
];
