import type { QuestionSeed } from '../types';

/**
 * ITIL Foundation (Version 5) — domein 2 (vier dimensies, 10%) en
 * domein 3 (product- en servicelevenscyclus, 10%).
 */

export const questions: QuestionSeed[] = [
  /* --- Domein 2: De vier dimensies ------------------------------------ */
  {
    id: 'itil5-q029',
    objective: '2.1.1',
    type: 'standard',
    bloom: 1,
    difficulty: 1,
    stem: {
      nl: 'Wat zijn de vier dimensies van product- en servicemanagement?',
      en: 'What are the ITIL Four Dimensions of Product and Service Management?',
    },
    options: [
      {
        text: {
          nl: 'Organisaties en mensen; informatie en technologie; partners en leveranciers; waardestromen en processen',
          en: 'Organizations and people; information and technology; partners and suppliers; value streams and processes',
        },
        correct: true,
      },
      {
        text: {
          nl: 'Mensen; processen; producten; partners',
          en: 'People; processes; products; partners',
        },
        rationale: {
          nl: 'Dit zijn de vier P’s uit oudere servicemanagementmodellen, niet de ITIL-dimensies.',
          en: 'These are the four Ps from older service management models, not the ITIL dimensions.',
        },
      },
      {
        text: {
          nl: 'Politiek; economisch; sociaal; technologisch',
          en: 'Political; economic; social; technological',
        },
        rationale: {
          nl: 'Dit zijn vier van de zes PESTLE-factoren: externe factoren die de dimensies beïnvloeden, niet de dimensies zelf.',
          en: 'These are four of the six PESTLE factors: external factors influencing the dimensions, not the dimensions themselves.',
        },
      },
      {
        text: {
          nl: 'Leidende principes; governance; waardeketen; voortdurend verbeteren',
          en: 'Guiding principles; governance; value chain; continual improvement',
        },
        rationale: {
          nl: 'Dit zijn vier van de vijf componenten van het ITIL-waardesysteem (de vijfde is managementwerkwijzen).',
          en: 'These are four of the five components of the ITIL Value System (the fifth is management practices).',
        },
      },
    ],
    explanation: {
      nl: 'De vier dimensies zijn gezamenlijk cruciaal voor het effectief en efficiënt creëren van waarde. Ze zijn intern gericht en worden beïnvloed door externe PESTLE-factoren, die vaak buiten de controle van de organisatie vallen.',
      en: 'The four dimensions are jointly crucial for creating value effectively and efficiently. They are internally focused and are influenced by external PESTLE factors, which often lie outside the organization’s control.',
    },
    source: 'Syllabus 2.1.1',
  },
  {
    id: 'itil5-q030',
    objective: '2.2.1',
    type: 'standard',
    bloom: 1,
    difficulty: 1,
    stem: {
      nl: 'Waar staat de afkorting PESTLE voor?',
      en: 'What does the acronym PESTLE stand for?',
    },
    options: [
      {
        text: {
          nl: 'Politiek, Economisch, Sociaal, Technologisch, Juridisch (Legal), Milieu (Environmental)',
          en: 'Political, Economic, Social, Technological, Legal, Environmental',
        },
        correct: true,
      },
      {
        text: {
          nl: 'Prestatie, Efficiëntie, Beveiliging (Security), Technologie, Leiderschap, Ervaring',
          en: 'Performance, Efficiency, Security, Technology, Leadership, Experience',
        },
        rationale: {
          nl: 'Deze woorden vormen geen erkend model voor externe factoren.',
          en: 'These words do not form a recognized model for external factors.',
        },
      },
      {
        text: {
          nl: 'Proces, Ervaring, Service, Technologie, Levering, Evaluatie',
          en: 'Process, Experience, Service, Technology, Logistics, Evaluation',
        },
        rationale: {
          nl: 'Deze termen zijn intern gericht; PESTLE gaat juist over externe factoren.',
          en: 'These terms are internally focused; PESTLE concerns external factors.',
        },
      },
      {
        text: {
          nl: 'Partners, Mensen (Employees), Systemen, Tools, Wetgeving, Ethiek',
          en: 'Partners, Employees, Systems, Tools, Legislation, Ethics',
        },
        rationale: {
          nl: 'Dit is een verzonnen combinatie die deels de dimensies en deels externe factoren mengt.',
          en: 'This is a made-up combination mixing dimensions with external factors.',
        },
      },
    ],
    explanation: {
      nl: 'PESTLE beschrijft de externe factoren die de vier dimensies beperken of beïnvloeden en die vaak buiten de controle van de organisatie vallen. Het principe ‘denk en werk holistisch’ vraagt onder meer om deze factoren continu te monitoren en analyseren.',
      en: 'PESTLE describes the external factors that constrain or influence the four dimensions and often lie outside the organization’s control. The ‘think and work holistically’ principle calls for continuously monitoring and analysing these factors.',
    },
    source: 'Syllabus 2.2.1',
  },
  {
    id: 'itil5-q031',
    objective: '2.1.3',
    type: 'standard',
    bloom: 2,
    difficulty: 2,
    stem: {
      nl: 'Waarom is een holistische benadering van de vier dimensies belangrijk?',
      en: 'Why is a holistic approach to the four dimensions important?',
    },
    options: [
      {
        text: {
          nl: 'Omdat het verwaarlozen van één dimensie leidt tot suboptimale of mislukte producten en services, ook als de andere dimensies goed zijn ingericht',
          en: 'Because neglecting one dimension leads to suboptimal or failed products and services, even when the other dimensions are well organized',
        },
        correct: true,
      },
      {
        text: {
          nl: 'Omdat de dimensies in een vaste volgorde moeten worden doorlopen',
          en: 'Because the dimensions must be addressed in a fixed order',
        },
        rationale: {
          nl: 'De dimensies zijn perspectieven die je gelijktijdig hanteert, geen fasen met een volgorde.',
          en: 'The dimensions are perspectives applied simultaneously, not phases with a sequence.',
        },
      },
      {
        text: {
          nl: 'Omdat elke dimensie door een aparte afdeling moet worden beheerd',
          en: 'Because each dimension must be managed by a separate department',
        },
        rationale: {
          nl: 'Dit zou juist silo’s creëren; holistisch werken betekent alle onderdelen van de organisatie integreren.',
          en: 'This would create silos; working holistically means integrating all parts of the organization.',
        },
      },
      {
        text: {
          nl: 'Omdat de dimensie ‘informatie en technologie’ altijd de belangrijkste is',
          en: 'Because the ‘information and technology’ dimension is always the most important',
        },
        rationale: {
          nl: 'Geen enkele dimensie is intrinsiek belangrijker; ze zijn gezamenlijk cruciaal.',
          en: 'No dimension is intrinsically more important; they are jointly crucial.',
        },
      },
    ],
    explanation: {
      nl: 'De vier dimensies vertegenwoordigen perspectieven die relevant zijn op alle niveaus: individueel productontwerp, managementwerkwijzen en het waardesysteem als geheel. Ze zijn gezamenlijk cruciaal voor effectieve en efficiënte waardecreatie. Verwaarlozing van één dimensie ondermijnt het geheel.',
      en: 'The four dimensions represent perspectives relevant at all levels: individual product design, management practices and the value system as a whole. They are jointly crucial for effective and efficient value creation. Neglecting one dimension undermines the whole.',
    },
    source: 'Syllabus 2.1.2, 2.1.3',
  },
  {
    id: 'itil5-q032',
    objective: '2.2.2',
    type: 'standard',
    bloom: 2,
    difficulty: 2,
    stem: {
      nl: 'Een organisatie herstructureert haar teams zodat de teamindeling past bij de gewenste modulaire productarchitectuur. Op welk principe is deze aanpak gebaseerd?',
      en: 'An organization restructures its teams so the team layout matches the intended modular product architecture. Which principle underlies this approach?',
    },
    options: [
      {
        text: {
          nl: 'De omgekeerde Conway-aanpak',
          en: 'The inverse Conway manoeuvre',
        },
        correct: true,
      },
      {
        text: {
          nl: 'Het principe ‘houd het eenvoudig en praktisch’',
          en: "The 'keep it simple and practical' guiding principle",
        },
        rationale: {
          nl: 'Dat principe gaat over het minimaliseren van stappen en het elimineren van wat geen waarde toevoegt, niet over teamstructuur versus architectuur.',
          en: 'That principle is about minimizing steps and eliminating what adds no value, not about team structure versus architecture.',
        },
      },
      {
        text: { nl: 'Complexiteitsdenken', en: 'Complexity thinking' },
        rationale: {
          nl: 'Complexiteitsdenken gaat over het herkennen van complexiteitsniveaus (geordend, complex, chaotisch, verward) bij besluitvorming.',
          en: 'Complexity thinking is about recognizing complexity levels (ordered, complex, chaotic, confused) in decision-making.',
        },
      },
      {
        text: {
          nl: 'Mensgericht ontwerpen (human-centred design)',
          en: 'Human-centred design',
        },
        rationale: {
          nl: 'HCD is een ontwerpbenadering die prioriteit geeft aan behoeften en ervaringen van gebruikers.',
          en: 'HCD is a design approach prioritizing user needs and experiences.',
        },
      },
    ],
    explanation: {
      nl: 'De wet van Conway stelt dat de structuur van systemen die een organisatie ontwerpt een kopie is van haar communicatiestructuur. De omgekeerde aanpak draait dit om: structureer je teams bewust zó dat de gewenste productarchitectuur ontstaat. Dit valt onder de dimensie ‘organisaties en mensen’.',
      en: 'Conway’s Law states that the structure of systems an organization designs mirrors its communication structure. The inverse manoeuvre reverses this: deliberately structure teams so the intended product architecture emerges. This falls under the ‘organizations and people’ dimension.',
    },
    source: 'Syllabus 2.2.2',
  },
  {
    id: 'itil5-q033',
    objective: '2.1.2',
    type: 'standard',
    bloom: 2,
    difficulty: 2,
    stem: {
      nl: 'Onder welke dimensie valt het managen van afhankelijkheden van derden en het bepalen van een leveranciersstrategie?',
      en: 'Under which dimension do managing third-party dependencies and defining a supplier strategy fall?',
    },
    options: [
      {
        text: { nl: 'Partners en leveranciers', en: 'Partners and suppliers' },
        correct: true,
      },
      {
        text: {
          nl: 'Waardestromen en processen',
          en: 'Value streams and processes',
        },
        rationale: {
          nl: 'Deze dimensie behandelt organisatorische en organisatie-overschrijdende workflows: welke activiteiten worden ondernomen en hoe ze zijn georganiseerd.',
          en: 'This dimension covers organizational and cross-organizational workflows: which activities are undertaken and how they are organized.',
        },
      },
      {
        text: { nl: 'Organisaties en mensen', en: 'Organizations and people' },
        rationale: {
          nl: 'Deze dimensie gaat over structuur, cultuur, rollen, vaardigheden en leiderschap binnen de organisatie.',
          en: 'This dimension concerns structure, culture, roles, skills and leadership within the organization.',
        },
      },
      {
        text: {
          nl: 'Informatie en technologie',
          en: 'Information and technology',
        },
        rationale: {
          nl: 'Deze dimensie betreft data, informatie en technologieën, inclusief data governance en het gebruik van AI.',
          en: 'This dimension concerns data, information and technologies, including data governance and the use of AI.',
        },
      },
    ],
    explanation: {
      nl: 'Iedere organisatie is tot op zekere hoogte afhankelijk van services van anderen. De leveranciersstrategie wordt bepaald door strategische focus, bedrijfscultuur, schaarste aan middelen, kostenoverwegingen, vakexpertise, externe beperkingen en vraagpatronen.',
      en: 'Every organization depends to some degree on services from others. Supplier strategy is shaped by strategic focus, corporate culture, resource scarcity, cost considerations, subject-matter expertise, external constraints and demand patterns.',
    },
    source: 'Syllabus 2.1.2, 2.2.2',
  },
  {
    id: 'itil5-q034',
    objective: '2.2.2',
    type: 'standard',
    bloom: 2,
    difficulty: 2,
    stem: {
      nl: 'Wat is het verschil tussen data, informatie en kennis?',
      en: 'What is the difference between data, information and knowledge?',
    },
    options: [
      {
        text: {
          nl: 'Data zijn ruwe feiten zonder intrinsieke betekenis, informatie is verwerkte data met context en betekenis, en kennis is toegepaste informatie en ervaring',
          en: 'Data are raw facts without intrinsic meaning, information is processed data with context and meaning, and knowledge is applied information and experience',
        },
        correct: true,
      },
      {
        text: {
          nl: 'Data zijn digitaal, informatie is analoog, en kennis is menselijk',
          en: 'Data are digital, information is analogue, and knowledge is human',
        },
        rationale: {
          nl: 'Het onderscheid gaat over betekenis en toepassing, niet over het medium.',
          en: 'The distinction concerns meaning and application, not the medium.',
        },
      },
      {
        text: {
          nl: 'Data en informatie zijn synoniemen; alleen kennis is een apart begrip',
          en: 'Data and information are synonyms; only knowledge is a separate concept',
        },
        rationale: {
          nl: 'Data en informatie zijn wel degelijk verschillend: data zonder context heeft geen waarde.',
          en: 'Data and information genuinely differ: data without context has no value.',
        },
      },
      {
        text: {
          nl: 'Kennis is data die is opgeslagen in een kennisbank',
          en: 'Knowledge is data stored in a knowledge base',
        },
        rationale: {
          nl: 'Opslaglocatie bepaalt niet of iets kennis is; kennis vraagt om toepassing en ervaring.',
          en: 'Storage location does not determine whether something is knowledge; knowledge requires application and experience.',
        },
      },
    ],
    explanation: {
      nl: 'Informatie heeft alleen waarde als het tot resultaten leidt; data zonder context heeft geen waarde. Data governance — een systeem van regels, beleid, standaarden, processen en beheersmaatregelen — zorgt ervoor dat gegevens gedurende hun levenscyclus veilig, bruikbaar en betrouwbaar blijven.',
      en: 'Information only has value when it leads to results; data without context has no value. Data governance — a system of rules, policies, standards, processes and controls — keeps data secure, usable and reliable across its lifecycle.',
    },
    source: 'Syllabus 2.1.2, 2.2.2',
  },
  {
    id: 'itil5-q035',
    objective: '2.2.2',
    type: 'list',
    bloom: 2,
    difficulty: 2,
    stem: {
      nl: 'Welke twee uitspraken over de dimensie ‘organisaties en mensen’ zijn CORRECT?',
      en: "Which two statements about the 'organizations and people' dimension are CORRECT?",
    },
    listItems: [
      {
        nl: 'Cultuur is een geheel van waarden dat door een groep wordt gedeeld en tot uiting komt in gedrag',
        en: 'Culture is a set of values shared by a group and expressed in behaviour',
      },
      {
        nl: 'Een veiligheidscultuur betekent dat medewerkers nooit fouten mogen maken',
        en: 'A safety culture means employees must never make mistakes',
      },
      {
        nl: 'Leiders brengen het succes van de organisatie in balans met het welzijn van stakeholders',
        en: 'Leaders balance organizational success with stakeholder wellbeing',
      },
      {
        nl: 'De organisatiestructuur moet losstaan van de cultuur en strategie',
        en: 'The organizational structure should be independent of culture and strategy',
      },
    ],
    options: [
      { text: { nl: '1 en 3', en: '1 and 3' }, correct: true },
      {
        text: { nl: '1 en 2', en: '1 and 2' },
        rationale: {
          nl: 'Statement 2 is onjuist: een veiligheidscultuur vraagt juist om realistisch zijn over mislukkingen en ze als leermomenten te zien, zonder anderen de schuld te geven.',
          en: 'Statement 2 is incorrect: a safety culture calls for being realistic about failures and treating them as learning moments, without blaming others.',
        },
      },
      {
        text: { nl: '2 en 4', en: '2 and 4' },
        rationale: {
          nl: 'Beide statements zijn onjuist en beschrijven precies wat ITIL afraadt.',
          en: 'Both statements are incorrect and describe exactly what ITIL advises against.',
        },
      },
      {
        text: { nl: '3 en 4', en: '3 and 4' },
        rationale: {
          nl: 'Statement 4 is onjuist: de structuur dient de cultuur en strategie juist mogelijk te maken en te ondersteunen.',
          en: 'Statement 4 is incorrect: the structure should enable and support culture and strategy.',
        },
      },
    ],
    explanation: {
      nl: 'Een veiligheidscultuur is er een waarin mensen zich op hun gemak voelen zichzelf te zijn. Gewenst gedrag: handel naar de veiligheidsvoorschriften, toon kwetsbaarheid, stimuleer feedback, wees vriendelijk en meelevend, en wees realistisch over mislukkingen. De organisatiestructuur dient de cultuur en strategie mogelijk te maken.',
      en: 'A safety culture is one where people feel comfortable being themselves. Desired behaviours: act on safety guidance, show vulnerability, encourage feedback, be kind and compassionate, and be realistic about failures. The organizational structure should enable culture and strategy.',
    },
    source: 'Syllabus 2.2.2',
  },

  /* --- Domein 3: Product- en servicelevenscyclus ---------------------- */
  {
    id: 'itil5-q036',
    objective: '3.1.1',
    type: 'standard',
    bloom: 1,
    difficulty: 2,
    stem: {
      nl: 'Welke reeks geeft de acht levenscyclusactiviteiten correct weer?',
      en: 'Which sequence correctly lists the eight lifecycle management activities?',
    },
    options: [
      {
        text: {
          nl: 'Ontdekken, ontwerpen, verwerven, bouwen, transitie, beheren, leveren, ondersteunen',
          en: 'Discover, design, acquire, build, transition, operate, deliver, support',
        },
        correct: true,
      },
      {
        text: {
          nl: 'Plannen, verbeteren, betrekken, ontwerpen en transitie, verkrijgen/bouwen, leveren en ondersteunen',
          en: 'Plan, improve, engage, design and transition, obtain/build, deliver and support',
        },
        rationale: {
          nl: 'Dit zijn de zes waardeketenactiviteiten uit ITIL 4, niet de acht levenscyclusactiviteiten van Version 5.',
          en: 'These are the six value chain activities from ITIL 4, not the eight lifecycle activities of Version 5.',
        },
      },
      {
        text: {
          nl: 'Verkennen, betrekken, aanbieden, overeenkomst bereiken, onboarden, co-creëren, reflecteren',
          en: 'Explore, engage, offer, agree, onboard, co-create, reflect',
        },
        rationale: {
          nl: 'Dit zijn de zeven stappen van het servicetraject (service journey), een ander model.',
          en: 'These are the seven steps of the service journey, a different model.',
        },
      },
      {
        text: {
          nl: 'Identificeren, in kaart brengen, analyseren, ontwerpen, verbeteren',
          en: 'Identify, map, analyse, design, improve',
        },
        rationale: {
          nl: 'Dit zijn de vijf stappen van waardestroom-analyse (value stream mapping).',
          en: 'These are the five steps of value stream mapping.',
        },
      },
    ],
    explanation: {
      nl: 'De acht activiteiten worden niet in een vaste volgorde uitgevoerd. Ze worden in de juiste context gecombineerd tot waardestromen: reeksen stappen die een organisatie gebruikt om producten en services te creëren en te leveren.',
      en: 'The eight activities are not performed in a fixed order. They are combined in context to form value streams: sequences of steps an organization uses to create and deliver products and services.',
    },
    source: 'Syllabus 3.1.1',
  },
  {
    id: 'itil5-q037',
    objective: '3.2.1',
    type: 'standard',
    bloom: 1,
    difficulty: 2,
    stem: {
      nl: "Wat is het doel van de activiteit 'ontdekken' (discover)?",
      en: "What is the purpose of the 'discover' activity?",
    },
    options: [
      {
        text: {
          nl: 'Ervoor zorgen dat de productroadmap en het bijbehorende serviceaanbod continu aansluiten op de behoeften van serviceconsumenten en op de organisatiestrategie',
          en: 'Ensuring the product roadmap and related service offerings continuously align with service consumer needs and the organizational strategy',
        },
        correct: true,
      },
      {
        text: {
          nl: 'Prototypes en specificaties ontwikkelen voor producten en services',
          en: 'Developing prototypes and specifications for products and services',
        },
        rationale: {
          nl: "Dit is het doel van 'ontwerpen' (design).",
          en: "This is the purpose of the 'design' activity.",
        },
      },
      {
        text: {
          nl: 'Benodigde middelen efficiënt verkrijgen en toewijzen',
          en: 'Efficiently obtaining and allocating required resources',
        },
        rationale: {
          nl: "Dit is het doel van 'verwerven' (acquire).",
          en: "This is the purpose of the 'acquire' activity.",
        },
      },
      {
        text: {
          nl: 'Incidenten identificeren en oplossen en procedures voor noodherstel uitvoeren',
          en: 'Identifying and resolving incidents and executing disaster recovery procedures',
        },
        rationale: {
          nl: "Dit is het doel van 'ondersteunen' (support).",
          en: "This is the purpose of the 'support' activity.",
        },
      },
    ],
    explanation: {
      nl: 'Ontdekken is een continu proces en geen eenmalige activiteit met lange tussenpozen. Het vindt plaats op drie niveaus: organisatieniveau (visie, strategie, doelgroep), portfolioniveau en productniveau. Het resultaat is een bijgewerkte productroadmap.',
      en: 'Discover is a continuous process, not a one-off activity performed at long intervals. It happens at three levels: organizational (vision, strategy, target audience), portfolio and product. Its result is an updated product roadmap.',
    },
    source: 'Syllabus 3.2.1',
  },
  {
    id: 'itil5-q038',
    objective: '3.2.5',
    type: 'standard',
    bloom: 1,
    difficulty: 2,
    stem: {
      nl: "Wat is het doel van de activiteit 'transitie' (transition)?",
      en: "What is the purpose of the 'transition' activity?",
    },
    options: [
      {
        text: {
          nl: 'Nieuwe of bijgewerkte producten naadloos introduceren in operationele omgevingen en effectieve onboarding en offboarding van leveranciers garanderen',
          en: 'Seamlessly introducing new or updated products into operational environments and ensuring effective onboarding and offboarding of suppliers',
        },
        correct: true,
      },
      {
        text: {
          nl: 'Digitale producten ontwikkelen, integreren en testen',
          en: 'Developing, integrating and testing digital products',
        },
        rationale: {
          nl: "Dit is het doel van 'bouwen' (build).",
          en: "This is the purpose of the 'build' activity.",
        },
      },
      {
        text: {
          nl: 'Digitale producten en ondersteunende systemen onderhouden en bewaken',
          en: 'Maintaining and monitoring digital products and supporting systems',
        },
        rationale: {
          nl: "Dit is het doel van 'beheren' (operate).",
          en: "This is the purpose of the 'operate' activity.",
        },
      },
      {
        text: {
          nl: 'Services leveren aan gebruikers en gebruikers aan- en afmelden',
          en: 'Delivering services to users and onboarding/offboarding users',
        },
        rationale: {
          nl: "Dit is het doel van 'leveren' (deliver). Let op het verschil: transitie onboardt léveranciers, leveren onboardt gebruikers.",
          en: "This is the purpose of the 'deliver' activity. Note the difference: transition onboards suppliers, deliver onboards users.",
        },
      },
    ],
    explanation: {
      nl: 'Tijdens de transitie worden gebouwde of verworven producten naar de productieomgeving verplaatst. Sleutelbegrippen: release (een versie die beschikbaar wordt gesteld voor gebruik), change (het toevoegen, wijzigen of verwijderen van iets met effect op producten en services) en deployment (het verplaatsen van een servicecomponent naar een gecontroleerde omgeving).',
      en: 'During transition, built or acquired products are moved into the production environment. Key terms: release (a version made available for use), change (adding, modifying or removing anything that could affect products and services) and deployment (moving a service component into a controlled environment).',
    },
    source: 'Syllabus 3.2.5, 4.4.4',
  },
  {
    id: 'itil5-q039',
    objective: '3.1.3',
    type: 'negative',
    bloom: 2,
    difficulty: 2,
    stem: {
      nl: 'Welke uitspraak over de levenscyclusactiviteiten is NIET juist?',
      en: 'Which statement about the lifecycle management activities is NOT correct?',
    },
    options: [
      {
        text: {
          nl: 'De activiteiten moeten altijd in de volgorde van ontdekken tot ondersteunen worden doorlopen',
          en: 'The activities must always be performed in order from discover through to support',
        },
        correct: true,
      },
      {
        text: {
          nl: 'De activiteiten worden in de juiste context gecombineerd om waardestromen te vormen',
          en: 'The activities are combined in the appropriate context to form value streams',
        },
        rationale: {
          nl: 'Dit is juist en verklaart waarom een vaste volgorde niet nodig is.',
          en: 'This is correct and explains why a fixed order is unnecessary.',
        },
      },
      {
        text: {
          nl: 'De omvang en volgorde kunnen variëren afhankelijk van de architectuur en de organisatorische context',
          en: 'Scope and sequence can vary depending on architecture and organizational context',
        },
        rationale: {
          nl: 'Dit is juist: dezelfde activiteiten worden per organisatie anders ingevuld.',
          en: 'This is correct: the same activities are applied differently per organization.',
        },
      },
      {
        text: {
          nl: 'Niet elke organisatie voert alle acht activiteiten zelf uit',
          en: 'Not every organization performs all eight activities itself',
        },
        rationale: {
          nl: 'Dit is juist: een managed service provider voert bijvoorbeeld vooral beheren en ondersteunen uit, terwijl ontdekken bij de klant ligt.',
          en: 'This is correct: a managed service provider mainly performs operate and support, while discover sits with the customer.',
        },
      },
    ],
    explanation: {
      nl: 'De activiteiten zijn flexibel en adaptief, niet altijd sequentieel, en dienen aan te sluiten bij de organisatiestrategie en klantbehoeften. Het bedrijfsmodel bepaalt welke activiteiten intern worden uitgevoerd en welke gedeeld of extern belegd zijn.',
      en: 'The activities are flexible and adaptive, not always sequential, and should align with organizational strategy and customer needs. The operating model determines which activities are performed internally and which are shared or outsourced.',
    },
    source: 'Syllabus 3.1.3',
  },
  {
    id: 'itil5-q040',
    objective: '3.2.8',
    type: 'standard',
    bloom: 1,
    difficulty: 2,
    stem: {
      nl: "Wat is het doel van de activiteit 'ondersteunen' (support)?",
      en: "What is the purpose of the 'support' activity?",
    },
    options: [
      {
        text: {
          nl: 'Incidenten identificeren en oplossen, procedures voor noodherstel uitvoeren en feedback van consumenten verzamelen',
          en: 'Identifying and resolving incidents, executing disaster recovery procedures and collecting consumer feedback',
        },
        correct: true,
      },
      {
        text: {
          nl: 'Het operationele product managen om de overeengekomen prestaties, stabiliteit en continuïteit te garanderen',
          en: 'Managing the operational product to ensure agreed performance, stability and continuity',
        },
        rationale: {
          nl: "Dit is het doel van 'beheren' (operate). Beheren is proactief onderhoud; ondersteunen is herstel bij verstoringen.",
          en: "This is the purpose of the 'operate' activity. Operate is proactive maintenance; support is restoration after disruption.",
        },
      },
      {
        text: {
          nl: 'Digitale services leveren op basis van live producten en deze beschikbaar stellen',
          en: 'Delivering digital services based on live products and making them available',
        },
        rationale: {
          nl: "Dit is het doel van 'leveren' (deliver).",
          en: "This is the purpose of the 'deliver' activity.",
        },
      },
      {
        text: {
          nl: 'De benodigde middelen en componenten verkrijgen of toewijzen',
          en: 'Obtaining or allocating the required resources and components',
        },
        rationale: {
          nl: "Dit is het doel van 'verwerven' (acquire).",
          en: "This is the purpose of the 'acquire' activity.",
        },
      },
    ],
    explanation: {
      nl: 'Ondersteunen herstelt de normale werking van producten bij gebruikersverstoringen. Het omvat het oplossen van incidenten én rampen, volledig herstel van services, en het identificeren van fouten in producten. Het kan geautomatiseerd en proactief zijn, maar ook reactief wanneer nodig.',
      en: 'Support restores the normal operation of products when users experience disruptions. It covers resolving incidents and disasters, full restoration of services, and identifying errors in products. It can be automated and proactive, but also reactive when needed.',
    },
    source: 'Syllabus 3.2.8',
  },
  {
    id: 'itil5-q041',
    objective: '3.2.7',
    type: 'missing_word',
    bloom: 1,
    difficulty: 2,
    stem: {
      nl: 'Identificeer het ontbrekende woord in de volgende zin.\n\nHet doel van de activiteit [ ? ] is het leveren van services aan gebruikers, het managen van het aan- en afmelden van gebruikers, het handhaven van kwaliteitsnormen en het verzamelen van feedback.',
      en: 'Identify the missing word in the following sentence.\n\nThe purpose of the [ ? ] activity is delivering services to users, managing user onboarding and offboarding, maintaining quality standards and collecting feedback.',
    },
    options: [
      { text: { nl: 'leveren (deliver)', en: 'deliver' }, correct: true },
      {
        text: { nl: 'ondersteunen (support)', en: 'support' },
        rationale: {
          nl: 'Ondersteunen richt zich op het identificeren en oplossen van incidenten en het herstellen van de normale werking.',
          en: 'Support focuses on identifying and resolving incidents and restoring normal operation.',
        },
      },
      {
        text: { nl: 'beheren (operate)', en: 'operate' },
        rationale: {
          nl: 'Beheren richt zich op het onderhouden en bewaken van producten en ondersteunende systemen.',
          en: 'Operate focuses on maintaining and monitoring products and supporting systems.',
        },
      },
      {
        text: { nl: 'transitie (transition)', en: 'transition' },
        rationale: {
          nl: 'Transitie introduceert producten in de operationele omgeving en onboardt léveranciers, geen gebruikers.',
          en: 'Transition introduces products into operational environments and onboards suppliers, not users.',
        },
      },
    ],
    explanation: {
      nl: 'De leveringsactiviteit richt zich op het leveren van services aan gebruikers in overeenstemming met SLA’s. Dit omvat het afhandelen van serviceaanvragen, het inwerken van nieuwe gebruikers en andere serviceacties. Let op het onderscheid: transitie onboardt leveranciers, leveren onboardt gebruikers.',
      en: 'The deliver activity focuses on providing services to users in line with SLAs. It includes handling service requests, onboarding new users and other service actions. Note the distinction: transition onboards suppliers, deliver onboards users.',
    },
    source: 'Syllabus 3.2.7',
  },
  {
    id: 'itil5-q042',
    objective: '3.1.2',
    type: 'standard',
    bloom: 2,
    difficulty: 3,
    stem: {
      nl: 'Wat is het verschil tussen een ‘enabling’ en een ‘supporting’ managementwerkwijze bij een waardeketenactiviteit?',
      en: "What is the difference between an 'enabling' and a 'supporting' management practice for a value chain activity?",
    },
    options: [
      {
        text: {
          nl: 'Enabling werkwijzen zijn direct betrokken bij de activiteit; supporting werkwijzen ondersteunen deze met informatie en methoden zonder direct betrokken te zijn',
          en: 'Enabling practices are directly involved in the activity; supporting practices support it with information and methods without being directly involved',
        },
        correct: true,
      },
      {
        text: {
          nl: 'Enabling werkwijzen zijn verplicht; supporting werkwijzen zijn optioneel',
          en: 'Enabling practices are mandatory; supporting practices are optional',
        },
        rationale: {
          nl: 'Geen van beide is verplicht. De mapping moet altijd worden aangepast aan de specifieke organisatie en het product.',
          en: 'Neither is mandatory. The mapping should always be adapted to the specific organization and product.',
        },
      },
      {
        text: {
          nl: 'Enabling werkwijzen behoren tot de algemene groep; supporting werkwijzen tot de product- en servicemanagementgroep',
          en: 'Enabling practices belong to the general group; supporting practices to the product and service management group',
        },
        rationale: {
          nl: 'De indeling enabling/supporting staat los van de indeling in algemene versus product- en servicemanagementwerkwijzen. Dezelfde werkwijze kan bij de ene activiteit enabling zijn en bij de andere supporting.',
          en: 'The enabling/supporting split is independent of the general versus product and service management grouping. The same practice can be enabling for one activity and supporting for another.',
        },
      },
      {
        text: {
          nl: 'Enabling werkwijzen worden geautomatiseerd; supporting werkwijzen worden handmatig uitgevoerd',
          en: 'Enabling practices are automated; supporting practices are performed manually',
        },
        rationale: {
          nl: 'Automatisering heeft geen relatie met dit onderscheid.',
          en: 'Automation bears no relation to this distinction.',
        },
      },
    ],
    explanation: {
      nl: 'Elke waardeketenactiviteit wordt mogelijk gemaakt en ondersteund door meerdere werkwijzen. De activiteit ‘ontwerpen’ wordt bijvoorbeeld door 17 werkwijzen mogelijk gemaakt (enabling) en door zeven ondersteund (supporting). Dezelfde werkwijze kan per activiteit een andere rol hebben.',
      en: 'Every value chain activity is enabled and supported by several practices. The ‘design’ activity, for example, is enabled by 17 practices and supported by seven. The same practice can play a different role per activity.',
    },
    source: 'Syllabus 3.1.2, 4.5.3',
  },
  {
    id: 'itil5-q043',
    objective: '3.2.4',
    type: 'standard',
    bloom: 1,
    difficulty: 2,
    stem: {
      nl: "Welke activiteiten horen bij de levenscyclusactiviteit 'bouwen' (build)?",
      en: "Which activities belong to the 'build' lifecycle activity?",
    },
    options: [
      {
        text: {
          nl: 'Softwareontwikkeling, systeemintegratie, configuratie en procesontwikkeling, inclusief documentatie, validatie en testen',
          en: 'Software development, system integration, configuration and process development, including documentation, validation and testing',
        },
        correct: true,
      },
      {
        text: {
          nl: 'Marktonderzoek, portfolio-optimalisatie en het opstellen van roadmaps',
          en: 'Market research, portfolio optimization and roadmap creation',
        },
        rationale: {
          nl: "Dit hoort bij 'ontdekken' (discover), dat op organisatie-, portfolio- en productniveau plaatsvindt.",
          en: "This belongs to 'discover', which takes place at organizational, portfolio and product level.",
        },
      },
      {
        text: {
          nl: 'Het uitvoeren van routinetests, back-ups en het verwerken van events',
          en: 'Performing routine tests, backups and processing events',
        },
        rationale: {
          nl: "Dit hoort bij 'beheren' (operate).",
          en: "This belongs to 'operate'.",
        },
      },
      {
        text: {
          nl: 'Het extern inkopen of intern herverdelen van middelen',
          en: 'Externally procuring or internally reallocating resources',
        },
        rationale: {
          nl: "Dit hoort bij 'verwerven' (acquire).",
          en: "This belongs to 'acquire'.",
        },
      },
    ],
    explanation: {
      nl: 'Bouwen transformeert oplossingsontwerpen in werkende producten en services. Het kan worden geautomatiseerd met continue integratie: ontwikkelaars voegen codeaanpassingen regelmatig samen in een centrale repository, waarna geautomatiseerde builds en tests draaien om integratiefouten vroeg te ontdekken.',
      en: 'Build transforms solution designs into working products and services. It can be automated through continuous integration: developers regularly merge code changes into a central repository, after which automated builds and tests run to detect integration errors early.',
    },
    source: 'Syllabus 3.2.4, 4.4.5',
  },
];
