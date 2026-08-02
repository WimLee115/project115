import type { QuestionSeed } from '../types';

/**
 * ITIL Foundation (Version 5) — domein 5 (waardestromen, 5%),
 * domein 6 (ITIL en AI, 2,5%) en domein 7 (andere frameworks, 2,5%).
 *
 * Samen goed voor 4 van de 40 examenvragen. Domein 6 en 7 zijn nieuw in
 * Version 5 en leveren per examen doorgaans één vraag elk.
 */

export const questions: QuestionSeed[] = [
  /* --- Domein 5: Waardestromen ---------------------------------------- */
  {
    id: 'itil5-q076',
    objective: '5.1.1',
    type: 'standard',
    bloom: 1,
    difficulty: 2,
    stem: {
      nl: 'Wat is een kernwaardestroom (core value stream)?',
      en: 'What is a core value stream?',
    },
    options: [
      {
        text: {
          nl: 'Een reeks stappen die waarde creëren voor consumenten in een vorm die is beoogd door het operationele model van de organisatie',
          en: 'A series of steps that create value for consumers in the form intended by the organization’s operating model',
        },
        correct: true,
      },
      {
        text: {
          nl: 'De reeks stappen die waarde creëren voor interne klanten en zo andere waardestromen mogelijk maken',
          en: 'The series of steps that create value for internal customers and thereby enable other value streams',
        },
        rationale: {
          nl: 'Dit is een ondersteunende waardestroom (enabling value stream).',
          en: 'This is an enabling value stream.',
        },
      },
      {
        text: {
          nl: 'De activiteiten die de meeste omzet genereren voor de organisatie',
          en: 'The activities that generate the most revenue for the organization',
        },
        rationale: {
          nl: 'Omzet is geen criterium; het onderscheid gaat over wie de klant is en of het aansluit bij het operationele model.',
          en: 'Revenue is not the criterion; the distinction concerns who the customer is and whether it aligns with the operating model.',
        },
      },
      {
        text: {
          nl: 'De verzameling managementwerkwijzen die direct betrokken zijn bij een activiteit',
          en: 'The set of management practices directly involved in an activity',
        },
        rationale: {
          nl: 'Dit zijn de enabling werkwijzen bij een waardeketenactiviteit, een ander concept.',
          en: 'These are the enabling practices for a value chain activity, a different concept.',
        },
      },
    ],
    explanation: {
      nl: 'De indeling is relatief en hangt af van de scope van ‘de organisatie’. Een digitale salarisadministratieservice kan een kernwaardestroom zijn voor de IT-afdeling, terwijl de salarisadministratie zelf een ondersteunende waardestroom is voor het bedrijf als geheel.',
      en: 'The classification is relative and depends on the scope of ‘the organization’. A digital payroll service can be a core value stream for the IT department, while payroll itself is an enabling value stream for the company as a whole.',
    },
    source: 'Syllabus 5.1.1, 5.1.4',
  },
  {
    id: 'itil5-q077',
    objective: '5.3.3',
    type: 'standard',
    bloom: 2,
    difficulty: 2,
    stem: {
      nl: 'Welke stap komt NIET voor in waardestroom-analyse (value stream mapping)?',
      en: 'Which step does NOT occur in value stream mapping?',
    },
    options: [
      {
        text: {
          nl: 'Certificeer de waardestroom volgens een externe norm',
          en: 'Certify the value stream against an external standard',
        },
        correct: true,
      },
      {
        text: {
          nl: 'Breng de huidige waardestroom in kaart',
          en: 'Map the current value stream',
        },
        rationale: {
          nl: 'Dit is stap 2 van de vijf stappen.',
          en: 'This is step 2 of the five steps.',
        },
      },
      {
        text: {
          nl: 'Breng de gewenste waardestroom in kaart',
          en: 'Map the target value stream',
        },
        rationale: {
          nl: 'Dit is stap 4 van de vijf stappen.',
          en: 'This is step 4 of the five steps.',
        },
      },
      {
        text: {
          nl: 'Plan en implementeer verbeteringen',
          en: 'Plan and implement improvements',
        },
        rationale: {
          nl: 'Dit is stap 5, de afsluitende stap.',
          en: 'This is step 5, the final step.',
        },
      },
    ],
    explanation: {
      nl: 'De vijf stappen zijn: 1) identificeer de waardestroom, 2) breng de huidige waardestroom in kaart, 3) analyseer de waardestroom, 4) breng de gewenste waardestroom in kaart, 5) plan en implementeer verbeteringen. Certificering maakt hier geen deel van uit.',
      en: 'The five steps are: 1) identify the value stream, 2) map the current value stream, 3) analyse the value stream, 4) map the target value stream, 5) plan and implement improvements. Certification is not part of this.',
    },
    source: 'Syllabus 5.3.3',
  },
  {
    id: 'itil5-q078',
    objective: '5.1.3',
    type: 'standard',
    bloom: 1,
    difficulty: 2,
    stem: {
      nl: 'Welke vier complexiteitscontexten onderscheidt ITIL?',
      en: 'Which four complexity contexts does ITIL distinguish?',
    },
    options: [
      {
        text: {
          nl: 'Geordend, complex, chaotisch en verward',
          en: 'Ordered, complex, chaotic and confused',
        },
        correct: true,
      },
      {
        text: {
          nl: 'Eenvoudig, gemiddeld, moeilijk en onmogelijk',
          en: 'Simple, moderate, difficult and impossible',
        },
        rationale: {
          nl: 'Dit is een gradatie van moeilijkheid, geen model voor complexiteitscontexten.',
          en: 'This is a scale of difficulty, not a model of complexity contexts.',
        },
      },
      {
        text: {
          nl: 'Volatiel, onzeker, complex en ambigu',
          en: 'Volatile, uncertain, complex and ambiguous',
        },
        rationale: {
          nl: 'Dit is VUCA, dat een omgeving beschrijft, niet de vier werkcontexten voor besluitvorming.',
          en: 'This is VUCA, describing an environment rather than the four work contexts for decision-making.',
        },
      },
      {
        text: {
          nl: 'Strategisch, tactisch, operationeel en uitvoerend',
          en: 'Strategic, tactical, operational and executive',
        },
        rationale: {
          nl: 'Dit zijn organisatieniveaus, die onder meer bij servicerelaties een rol spelen.',
          en: 'These are organizational levels, relevant for instance in service relationships.',
        },
      },
    ],
    explanation: {
      nl: 'Geordend werk (wachtwoordreset, standaard request) leent zich voor automatisering en checklists. Complex werk (performanceproblemen in microservices, root cause analysis) vraagt om experimenteren en feedbackloops. Chaotisch werk (grote outage, ransomware) vraagt eerst om stabiliseren. Bij verward werk is de eerste taak structureren en classificeren.',
      en: 'Ordered work (password reset, standard request) suits automation and checklists. Complex work (microservice performance issues, root cause analysis) calls for experimentation and feedback loops. Chaotic work (major outage, ransomware) requires stabilizing first. With confused work, the first task is to structure and classify.',
    },
    source: 'Syllabus 5.1.3, 5.2.1',
  },
  {
    id: 'itil5-q079',
    objective: '5.1.2',
    type: 'standard',
    bloom: 2,
    difficulty: 3,
    stem: {
      nl: 'Wat is het verschil tussen ‘management van’ en ‘management door’ waardestromen?',
      en: "What is the difference between 'management of' and 'management by' value streams?",
    },
    options: [
      {
        text: {
          nl: 'Bij management ván is de waardestroom het object van sturing; bij management dóór is de waardestroom het middel om de organisatie te sturen',
          en: 'With management of, the value stream is the object being managed; with management by, the value stream is the means of managing the organization',
        },
        correct: true,
      },
      {
        text: {
          nl: 'Management ván is strategisch; management dóór is operationeel',
          en: 'Management of is strategic; management by is operational',
        },
        rationale: {
          nl: 'Het onderscheid gaat over object versus middel, niet over organisatieniveau.',
          en: 'The distinction concerns object versus means, not organizational level.',
        },
      },
      {
        text: {
          nl: 'Management ván gebeurt door de serviceverlener; management dóór door de consument',
          en: 'Management of is done by the provider; management by is done by the consumer',
        },
        rationale: {
          nl: 'Beide vormen worden binnen dezelfde organisatie toegepast.',
          en: 'Both forms are applied within the same organization.',
        },
      },
      {
        text: {
          nl: 'Management ván is handmatig; management dóór is geautomatiseerd',
          en: 'Management of is manual; management by is automated',
        },
        rationale: {
          nl: 'Beide worden ondersteund door automatisering en meting.',
          en: 'Both are supported by automation and measurement.',
        },
      },
    ],
    explanation: {
      nl: 'Management ván waardestromen stelt de vraag: functioneert deze waardestroom goed? Management dóór waardestromen stelt de vraag: hoe gebruiken we waardestromen om de organisatie te sturen? Waardestroom-management omvat beide en wordt ondersteund door automatisering en meting.',
      en: 'Management of value streams asks: is this value stream performing well? Management by value streams asks: how do we use value streams to steer the organization? Value stream management covers both and is supported by automation and measurement.',
    },
    source: 'Syllabus 5.1.2, 5.3.2',
  },
  {
    id: 'itil5-q080',
    objective: '5.3.1',
    type: 'list',
    bloom: 2,
    difficulty: 2,
    stem: {
      nl: 'Welke twee categorieën activiteiten worden binnen waardestroom-analyse onderscheiden?',
      en: 'Which two categories of activity are distinguished within value stream analysis?',
    },
    listItems: [
      {
        nl: 'Waarde creërend: activiteiten die waarde creëren vanuit het perspectief van de klant',
        en: 'Value-adding: activities that create value from the customer’s perspective',
      },
      {
        nl: 'Winstgevend: activiteiten die direct omzet genereren',
        en: 'Profitable: activities that directly generate revenue',
      },
      {
        nl: 'Niet-waarde creërend (waste): activiteiten die geen waarde toevoegen en geëlimineerd dienen te worden',
        en: 'Non-value-adding (waste): activities that add no value and should be eliminated',
      },
      {
        nl: 'Verplicht: activiteiten die door ITIL worden voorgeschreven',
        en: 'Mandatory: activities prescribed by ITIL',
      },
    ],
    options: [
      { text: { nl: '1 en 3', en: '1 and 3' }, correct: true },
      {
        text: { nl: '1 en 2', en: '1 and 2' },
        rationale: {
          nl: 'Statement 2 is onjuist: winstgevendheid is geen categorie binnen waardestroom-analyse.',
          en: 'Statement 2 is incorrect: profitability is not a category within value stream analysis.',
        },
      },
      {
        text: { nl: '2 en 4', en: '2 and 4' },
        rationale: {
          nl: 'Beide statements zijn onjuist; ITIL schrijft geen activiteiten voor.',
          en: 'Both statements are incorrect; ITIL prescribes no activities.',
        },
      },
      {
        text: { nl: '3 en 4', en: '3 and 4' },
        rationale: {
          nl: 'Statement 4 is onjuist: ITIL is een framework met aanbevelingen, geen voorschrift.',
          en: 'Statement 4 is incorrect: ITIL is a framework of recommendations, not prescriptions.',
        },
      },
    ],
    explanation: {
      nl: 'Activiteiten worden gecategoriseerd naar hun bijdrage aan de beoogde waarde: waarde creërend, ondersteunend, coördinerend, noodzakelijk niet-waarde creërend (bijvoorbeeld vanuit compliance) en niet-waarde creërend (waste, te elimineren). Waardestroom-analyse maakt workflows zichtbaar en brengt knelpunten en verspilling aan het licht.',
      en: 'Activities are categorized by their contribution to intended value: value-adding, supporting, coordinating, necessary non-value-adding (for example for compliance) and non-value-adding (waste, to be eliminated). Value stream mapping makes workflows visible and reveals bottlenecks and waste.',
    },
    source: 'Syllabus 5.3.1, 5.3.3',
  },

  /* --- Domein 6: ITIL en AI ------------------------------------------- */
  {
    id: 'itil5-q081',
    objective: '6.2.2',
    type: 'standard',
    bloom: 2,
    difficulty: 2,
    stem: {
      nl: 'Een AI-systeem vat lange incidentrapporten samen en vertaalt ze zodat gebruikers ze sneller begrijpen. Welke capability uit het ITIL AI Capability Model is dit?',
      en: 'An AI system summarizes long incident reports and translates them so users understand them faster. Which capability from the ITIL AI Capability Model is this?',
    },
    options: [
      { text: { nl: 'Clarification (verduidelijking)', en: 'Clarification' }, correct: true },
      {
        text: { nl: 'Creation (creatie)', en: 'Creation' },
        rationale: {
          nl: 'Creation gaat over het genereren van nieuwe output — content, code, documentatie — die voorheen niet bestond.',
          en: 'Creation is about generating new output — content, code, documentation — that did not exist before.',
        },
      },
      {
        text: { nl: 'Cognition (cognitie)', en: 'Cognition' },
        rationale: {
          nl: 'Cognition gaat over het identificeren van patronen, afwijkingen of verborgen inzichten in data.',
          en: 'Cognition is about identifying patterns, anomalies or hidden insights in data.',
        },
      },
      {
        text: { nl: 'Coordination (coördinatie)', en: 'Coordination' },
        rationale: {
          nl: 'Coordination gaat over het autonoom uitvoeren, orkestreren of activeren van acties in verschillende systemen.',
          en: 'Coordination is about autonomously executing, orchestrating or triggering actions across systems.',
        },
      },
    ],
    explanation: {
      nl: 'Het ITIL AI Capability Model kent zes capabilities, alle beginnend met een C: Creation (nieuwe output genereren), Curation (kwaliteit en relevantie van bestaande data verbeteren), Clarification (vinden, begrijpen, samenvatten, vertalen), Cognition (patronen en inzichten herkennen), Communication (natuurlijke interface) en Coordination (autonoom acties orkestreren).',
      en: 'The ITIL AI Capability Model has six capabilities, all starting with C: Creation (generating new output), Curation (improving quality and relevance of existing data), Clarification (finding, understanding, summarizing, translating), Cognition (recognizing patterns and insights), Communication (natural interface) and Coordination (autonomously orchestrating actions).',
    },
    source: 'Syllabus 6.2.2',
  },
  {
    id: 'itil5-q082',
    objective: '6.1.2',
    type: 'standard',
    bloom: 2,
    difficulty: 2,
    stem: {
      nl: 'Welke uitdaging brengt de groei van AI met zich mee voor organisaties?',
      en: 'What challenge does the growth of AI bring for organizations?',
    },
    options: [
      {
        text: {
          nl: 'AI-tools zijn slechts zo goed als de data waarop ze getraind zijn, waardoor datakwaliteit, governance, ethiek en compliance cruciaal worden',
          en: 'AI tools are only as good as the data they are trained on, making data quality, governance, ethics and compliance crucial',
        },
        correct: true,
      },
      {
        text: {
          nl: 'AI maakt menselijke besluitvorming volledig overbodig',
          en: 'AI makes human decision-making entirely redundant',
        },
        rationale: {
          nl: 'AI wordt gezien als samenwerkingspartner die menselijke sterke punten versterkt, niet als vervanging. Mensen blinken uit in creativiteit, empathie en contextueel begrip.',
          en: 'AI is seen as a collaborative partner that amplifies human strengths, not a replacement. People excel at creativity, empathy and contextual understanding.',
        },
      },
      {
        text: {
          nl: 'AI kan uitsluitend worden toegepast binnen de activiteit ‘bouwen’',
          en: "AI can only be applied within the 'build' activity",
        },
        rationale: {
          nl: 'AI wordt op alle niveaus gebruikt: van strategische planning en portfoliomanagement tot softwareontwikkeling, testen, monitoring en gebruikersondersteuning.',
          en: 'AI is used at all levels: from strategic planning and portfolio management to software development, testing, monitoring and user support.',
        },
      },
      {
        text: {
          nl: 'AI vervangt de noodzaak van de vier dimensies',
          en: 'AI removes the need for the four dimensions',
        },
        rationale: {
          nl: 'AI valt juist binnen de dimensie informatie en technologie en raakt daarnaast alle andere dimensies.',
          en: 'AI sits within the information and technology dimension and also touches all the others.',
        },
      },
    ],
    explanation: {
      nl: 'AI ondersteunt digitaal product- en servicemanagement door slimmere beslissingen en automatisering mogelijk te maken. Tegelijk geldt: datakwaliteit en -controle zijn cruciaal, eisen op het gebied van governance, ethiek en compliance nemen toe, en generatieve AI biedt nieuwe mogelijkheden maar ook nieuwe risico’s.',
      en: 'AI supports digital product and service management by enabling smarter decisions and automation. At the same time: data quality and control are crucial, governance, ethics and compliance requirements are increasing, and generative AI offers new possibilities as well as new risks.',
    },
    source: 'Syllabus 6.1.2, 6.1.3',
  },
  {
    id: 'itil5-q083',
    objective: '6.2.1',
    type: 'standard',
    bloom: 1,
    difficulty: 2,
    stem: {
      nl: 'Waarop richt data governance zich?',
      en: 'What does data governance focus on?',
    },
    options: [
      {
        text: {
          nl: 'Een systeem van regels, beleid, standaarden, processen en beheersmaatregelen om data-activa effectief te managen, zodat gegevens veilig, bruikbaar en betrouwbaar blijven',
          en: 'A system of rules, policies, standards, processes and controls to manage data assets effectively, keeping data secure, usable and reliable',
        },
        correct: true,
      },
      {
        text: {
          nl: 'Het technisch beveiligen van databases tegen ongeautoriseerde toegang',
          en: 'Technically securing databases against unauthorized access',
        },
        rationale: {
          nl: 'Toegangsbeveiliging is één beheersmaatregel binnen een breder governance-systeem.',
          en: 'Access security is one control within a broader governance system.',
        },
      },
      {
        text: {
          nl: 'Het bepalen van de strategische richting van de organisatie',
          en: 'Setting the strategic direction of the organization',
        },
        rationale: {
          nl: 'Dat is de rol van organisatiebrede governance en het bestuursorgaan.',
          en: 'That is the role of corporate governance and the governing body.',
        },
      },
      {
        text: {
          nl: 'Het trainen van AI-modellen op bedrijfsdata',
          en: 'Training AI models on company data',
        },
        rationale: {
          nl: 'Data governance máákt effectief AI-gebruik mogelijk, maar is niet het trainen zelf.',
          en: 'Data governance enables effective AI use but is not the training itself.',
        },
      },
    ],
    explanation: {
      nl: 'Data governance rust op zes kernprincipes: strategische afstemming, verantwoordelijkheid en eigenaarschap, beleid en procedures, transparantie en controleerbaarheid, integriteit, en aanpassingsvermogen. Organisaties dienen effectieve data governance te hebben om verantwoord gebruik van AI-technologieën mogelijk te maken.',
      en: 'Data governance rests on six core principles: strategic alignment, accountability and ownership, policies and procedures, transparency and auditability, integrity, and adaptability. Organizations need effective data governance to enable responsible use of AI technologies.',
    },
    source: 'Syllabus 6.2.1',
  },

  /* --- Domein 7: ITIL en andere frameworks ---------------------------- */
  {
    id: 'itil5-q084',
    objective: '7.1.1',
    type: 'standard',
    bloom: 2,
    difficulty: 2,
    stem: {
      nl: 'Hoe verhouden ITIL en DevOps zich tot elkaar?',
      en: 'How do ITIL and DevOps relate to each other?',
    },
    options: [
      {
        text: {
          nl: 'ITIL biedt structuur en governance voor het managen van digitale producten en services; DevOps biedt praktische technieken voor snelle, continue ontwikkeling en operations',
          en: 'ITIL provides structure and governance for managing digital products and services; DevOps provides practical techniques for fast, continuous development and operations',
        },
        correct: true,
      },
      {
        text: {
          nl: 'DevOps vervangt ITIL in moderne digitale organisaties',
          en: 'DevOps replaces ITIL in modern digital organizations',
        },
        rationale: {
          nl: 'Ze zijn complementair, niet concurrerend. Geen enkel framework volstaat op zichzelf voor de huidige digitale omgevingen.',
          en: 'They are complementary, not competing. No single framework suffices on its own for today’s digital environments.',
        },
      },
      {
        text: {
          nl: 'ITIL en DevOps zijn onverenigbaar omdat ITIL waterval is en DevOps agile',
          en: 'ITIL and DevOps are incompatible because ITIL is waterfall and DevOps is agile',
        },
        rationale: {
          nl: 'Dit is een misvatting: ITIL Version 5 benadrukt juist iteratief werken, feedbackloops en automatisering.',
          en: 'This is a misconception: ITIL Version 5 emphasizes iterative working, feedback loops and automation.',
        },
      },
      {
        text: {
          nl: 'DevOps is een van de 34 ITIL-managementwerkwijzen',
          en: 'DevOps is one of the 34 ITIL management practices',
        },
        rationale: {
          nl: 'DevOps is een zelfstandig framework, geen ITIL-werkwijze.',
          en: 'DevOps is an independent framework, not an ITIL practice.',
        },
      },
    ],
    explanation: {
      nl: 'ITIL definieert hoe waarde wordt gecreëerd en gemanaged binnen het waardesysteem; DevOps verbetert de uitvoering door automatisering, samenwerking en snelle feedback. Samen helpen ze organisaties een balans te vinden tussen stabiliteit en snelheid.',
      en: 'ITIL defines how value is created and managed within the value system; DevOps improves execution through automation, collaboration and rapid feedback. Together they help organizations balance stability and speed.',
    },
    source: 'Syllabus 7.1.1, 7.1.2',
  },
  {
    id: 'itil5-q085',
    objective: '7.2.1',
    type: 'standard',
    bloom: 2,
    difficulty: 2,
    stem: {
      nl: 'Waarom is projectmanagement belangrijk binnen ITIL?',
      en: 'Why is project management important within ITIL?',
    },
    options: [
      {
        text: {
          nl: 'Omdat veel wijzigingen aan digitale producten en services via gestructureerde projecten worden doorgevoerd en zo gecontroleerd overgaan in operationele services',
          en: 'Because many changes to digital products and services are implemented through structured projects and thus transition into operational services in a controlled way',
        },
        correct: true,
      },
      {
        text: {
          nl: 'Omdat ITIL uitsluitend kan worden toegepast binnen projecten',
          en: 'Because ITIL can only be applied within projects',
        },
        rationale: {
          nl: 'ITIL richt zich op het managen van producten en services gedurende hun hele levenscyclus, niet alleen op projecten.',
          en: 'ITIL focuses on managing products and services across their full lifecycle, not just projects.',
        },
      },
      {
        text: {
          nl: 'Omdat projectmanagement de zeven leidende principes vervangt',
          en: 'Because project management replaces the seven guiding principles',
        },
        rationale: {
          nl: 'De principes blijven onverkort gelden; projectmanagement vult ITIL aan.',
          en: 'The principles remain fully in force; project management complements ITIL.',
        },
      },
      {
        text: {
          nl: 'Omdat elke waardeketenactiviteit als project moet worden uitgevoerd',
          en: 'Because every value chain activity must be run as a project',
        },
        rationale: {
          nl: 'Veel werk is juist routinematig of continu, en leent zich niet voor een projectvorm.',
          en: 'Much work is routine or continuous and does not lend itself to a project format.',
        },
      },
    ],
    explanation: {
      nl: 'ITIL biedt fundamentele richtlijnen voor project- en portfoliomanagement, maar complexere of grootschaligere initiatieven vereisen vaak de diepgang van uitgebreide methodologieën. PRINCE2 vult ITIL daarin aan: ITIL levert het operationele framework, PRINCE2 de gestructureerde methoden voor projecten, programma’s en portfolio’s.',
      en: 'ITIL provides foundational guidance for project and portfolio management, but more complex or large-scale initiatives often require the depth of comprehensive methodologies. PRINCE2 complements ITIL here: ITIL supplies the operational framework, PRINCE2 the structured methods for projects, programmes and portfolios.',
    },
    source: 'Syllabus 7.2.1, 7.2.2',
  },
];
