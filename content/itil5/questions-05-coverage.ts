import type { QuestionSeed } from '../types';

/**
 * ITIL Foundation (Version 5) — aanvullende vragen.
 *
 * Deze set dekt de assessment criteria die na de eerste vier bestanden nog geen
 * eigen vraag hadden, zodat elk criterium uit de syllabus minstens één keer
 * wordt getoetst. De verdeling over de examengebieden verandert hierdoor niet:
 * de examengenerator trekt nog steeds volgens de officiële weging.
 */

export const questions: QuestionSeed[] = [
  {
    id: 'itil5-q086',
    objective: '1.2.3',
    type: 'standard',
    bloom: 2,
    difficulty: 2,
    stem: {
      nl: 'Een softwareleverancier biedt hetzelfde platform aan in een variant voor zelfstandigen en een variant voor grote organisaties, met verschillende functies en serviceniveaus. Wat illustreert dit?',
      en: 'A software vendor offers the same platform in a version for freelancers and a version for large organizations, with different features and service levels. What does this illustrate?',
    },
    options: [
      {
        text: {
          nl: 'Twee serviceaanbiedingen op basis van hetzelfde digitale product, elk gericht op een andere consumentengroep',
          en: 'Two service offerings based on the same digital product, each aimed at a different consumer group',
        },
        correct: true,
      },
      {
        text: {
          nl: 'Twee verschillende digitale producten',
          en: 'Two different digital products',
        },
        rationale: {
          nl: 'Het onderliggende product is hetzelfde; wat verschilt is de formele beschrijving van wat er wordt aangeboden en aan wie.',
          en: 'The underlying product is the same; what differs is the formal description of what is offered and to whom.',
        },
      },
      {
        text: {
          nl: 'Twee waardestromen',
          en: 'Two value streams',
        },
        rationale: {
          nl: 'Een waardestroom is de reeks stappen waarmee waarde wordt geleverd, niet de beschrijving van het aanbod.',
          en: 'A value stream is the series of steps by which value is delivered, not the description of the offering.',
        },
      },
      {
        text: {
          nl: 'Twee servicerelaties van hetzelfde type',
          en: 'Two service relationships of the same type',
        },
        rationale: {
          nl: 'De relatietypes (basis, coöperatief, collaboratief) gaan over de aard van de samenwerking, niet over het aanbod.',
          en: 'Relationship types (basic, cooperative, collaborative) concern the nature of the collaboration, not the offering.',
        },
      },
    ],
    explanation: {
      nl: 'Een serviceaanbod is een formele beschrijving van een of meer services, ontworpen voor de behoeften van een specifieke consumentengroep. Eén digitaal product kan meerdere serviceaanbiedingen ondersteunen: het product levert de functionaliteit, het aanbod beschrijft de potentiële waarde voor die specifieke groep.',
      en: 'A service offering is a formal description of one or more services designed for the needs of a specific consumer group. One digital product can support multiple service offerings: the product provides functionality, the offering describes the potential value for that particular group.',
    },
    source: 'Syllabus 1.2.3',
  },
  {
    id: 'itil5-q087',
    objective: '1.2.4',
    type: 'standard',
    bloom: 2,
    difficulty: 2,
    stem: {
      nl: 'Een IT-medewerker helpt een gebruiker bij het instellen van zijn nieuwe laptop. Welke vorm van service-interactie is dit?',
      en: 'An IT support engineer helps a user configure their new laptop. Which form of service interaction is this?',
    },
    options: [
      { text: { nl: 'Een serviceactie', en: 'A service action' }, correct: true },
      {
        text: { nl: 'Toegang tot middelen', en: 'Access to resources' },
        rationale: {
          nl: 'Daarbij krijgt de consument toegang tot middelen die eigendom blijven van de aanbieder, zoals een platform of netwerk. Hier wordt actief werk verricht.',
          en: 'That gives the consumer access to resources that remain owned by the provider, such as a platform or network. Here, active work is being performed.',
        },
      },
      {
        text: { nl: 'Overdracht van goederen', en: 'Transfer of goods' },
        rationale: {
          nl: 'De laptop zelf zou overdracht van goederen kunnen zijn; het hélpen bij het instellen is een handeling, geen overdracht.',
          en: 'The laptop itself could be a transfer of goods; helping to configure it is an action, not a transfer.',
        },
      },
      {
        text: { nl: 'Waardeco-creatie', en: 'Value co-creation' },
        rationale: {
          nl: 'Dat is het overkoepelende resultaat van de servicerelatie, geen specifieke interactievorm.',
          en: 'That is the overarching outcome of the service relationship, not a specific interaction form.',
        },
      },
    ],
    explanation: {
      nl: 'Serviceacties worden uitgevoerd door de serviceverlener, of door verlener en consument samen. Voorbeelden: het afhandelen van een serviceverzoek, gebruikerstrainingen en consultaties. Digitale serviceverleners streven ernaar de behoefte aan serviceacties te verminderen, bijvoorbeeld door selfservice.',
      en: 'Service actions are performed by the service provider, or jointly by provider and consumer. Examples: handling a service request, user training and consultations. Digital service providers aim to reduce the need for service actions, for instance through self-service.',
    },
    source: 'Syllabus 1.2.4',
  },
  {
    id: 'itil5-q088',
    objective: '3.2.2',
    type: 'standard',
    bloom: 1,
    difficulty: 2,
    stem: {
      nl: "Wat is het doel van de activiteit 'ontwerpen' (design)?",
      en: "What is the purpose of the 'design' activity?",
    },
    options: [
      {
        text: {
          nl: 'Prototypes en specificaties voor producten en services ontwikkelen, waarbij functionaliteit, gebruikerservaring en operationele structuur gedetailleerd worden beschreven',
          en: 'Developing prototypes and specifications for products and services, detailing functionality, user experience and operational structure',
        },
        correct: true,
      },
      {
        text: {
          nl: 'De productroadmap laten aansluiten op de behoeften van consumenten en de organisatiestrategie',
          en: 'Aligning the product roadmap with consumer needs and the organizational strategy',
        },
        rationale: {
          nl: "Dit is het doel van 'ontdekken' (discover).",
          en: "This is the purpose of the 'discover' activity.",
        },
      },
      {
        text: {
          nl: 'Ontwerpen omzetten in functionele, geïntegreerde en geteste oplossingen',
          en: 'Transforming designs into functional, integrated and tested solutions',
        },
        rationale: {
          nl: "Dit is het doel van 'bouwen' (build); ontwerpen levert de specificaties, bouwen maakt ze werkend.",
          en: "This is the purpose of 'build'; design produces the specifications, build makes them work.",
        },
      },
      {
        text: {
          nl: 'Nieuwe producten gecontroleerd introduceren in de operationele omgeving',
          en: 'Introducing new products into the operational environment in a controlled way',
        },
        rationale: {
          nl: "Dit is het doel van 'transitie' (transition).",
          en: "This is the purpose of 'transition'.",
        },
      },
    ],
    explanation: {
      nl: 'Ontwerpen is een dynamische activiteit: nieuwe ideeën creëren, aanpassen aan veranderingen en oplossingen genereren. De aanpak kan proactief zijn (anticiperen op behoeften) of reactief (inspelen op vereisten). Mensgericht ontwerpen (human-centred design) stelt de behoeften en ervaringen van gebruikers voorop, met empathie en een iteratief proces.',
      en: 'Design is a dynamic activity: creating new ideas, adapting to change and generating solutions. The approach can be proactive (anticipating needs) or reactive (responding to requirements). Human-centred design puts user needs and experiences first, with empathy and an iterative process.',
    },
    source: 'Syllabus 3.2.2',
  },
  {
    id: 'itil5-q089',
    objective: '3.2.3',
    type: 'standard',
    bloom: 1,
    difficulty: 2,
    stem: {
      nl: "Wat is het doel van de activiteit 'verwerven' (acquire)?",
      en: "What is the purpose of the 'acquire' activity?",
    },
    options: [
      {
        text: {
          nl: 'Benodigde middelen efficiënt verkrijgen en toewijzen, en zo de duurzaamheid en schaalbaarheid van producten en services waarborgen',
          en: 'Efficiently obtaining and allocating required resources, ensuring the sustainability and scalability of products and services',
        },
        correct: true,
      },
      {
        text: {
          nl: 'Uitsluitend het inkopen van hardware en software bij externe leveranciers',
          en: 'Purchasing hardware and software from external suppliers only',
        },
        rationale: {
          nl: 'Verwerven omvat óók het intern herverdelen van bestaande middelen, niet alleen externe inkoop.',
          en: 'Acquire also covers internally reallocating existing resources, not just external purchasing.',
        },
      },
      {
        text: {
          nl: 'Leveranciers onboarden en offboarden',
          en: 'Onboarding and offboarding suppliers',
        },
        rationale: {
          nl: "Dat hoort bij 'transitie' (transition).",
          en: "That belongs to 'transition'.",
        },
      },
      {
        text: {
          nl: 'De benodigde competenties van medewerkers vaststellen',
          en: 'Determining the required staff competencies',
        },
        rationale: {
          nl: 'Dat valt onder de dimensie organisaties en mensen en onder de werkwijze workforce and talent management.',
          en: 'That falls under the organizations and people dimension and the workforce and talent management practice.',
        },
      },
    ],
    explanation: {
      nl: 'Verwerven zorgt dat er voldoende middelen beschikbaar zijn voor het beheren, leveren en ondersteunen van producten en services. Digitale producten combineren interne en externe middelen; verwerven omvat zowel extern inkopen als intern herverdelen. Het kan worden geactiveerd door evaluatiecycli, vanuit beheer of door leveranciers.',
      en: 'Acquire ensures sufficient resources are available for operating, delivering and supporting products and services. Digital products combine internal and external resources; acquire covers both external procurement and internal reallocation. It can be triggered by review cycles, from operations or by suppliers.',
    },
    source: 'Syllabus 3.2.3',
  },
  {
    id: 'itil5-q090',
    objective: '3.2.6',
    type: 'standard',
    bloom: 1,
    difficulty: 2,
    stem: {
      nl: "Wat is het doel van de activiteit 'beheren' (operate)?",
      en: "What is the purpose of the 'operate' activity?",
    },
    options: [
      {
        text: {
          nl: 'Digitale producten en ondersteunende systemen onderhouden en bewaken, en zo optimale prestaties en betrouwbaarheid garanderen',
          en: 'Maintaining and monitoring digital products and supporting systems to ensure optimal performance and reliability',
        },
        correct: true,
      },
      {
        text: {
          nl: 'Incidenten oplossen en de normale werking herstellen',
          en: 'Resolving incidents and restoring normal operation',
        },
        rationale: {
          nl: "Dit is het doel van 'ondersteunen' (support). Beheren is proactief onderhoud; ondersteunen komt in actie bij verstoringen.",
          en: "This is the purpose of 'support'. Operate is proactive maintenance; support acts when disruptions occur.",
        },
      },
      {
        text: {
          nl: 'Services leveren aan gebruikers en gebruikers aanmelden',
          en: 'Delivering services to users and onboarding users',
        },
        rationale: {
          nl: "Dit is het doel van 'leveren' (deliver).",
          en: "This is the purpose of 'deliver'.",
        },
      },
      {
        text: {
          nl: 'Wijzigingen autoriseren voordat ze naar productie gaan',
          en: 'Authorizing changes before they go to production',
        },
        rationale: {
          nl: 'Dat is de rol van change enablement binnen de transitie-activiteit.',
          en: 'That is the role of change enablement within the transition activity.',
        },
      },
    ],
    explanation: {
      nl: 'Beheren houdt producten en systemen stabiel, betrouwbaar en compliant. Het omvat routinetests, back-ups, monitoring en het verwerken van events, en het naleven van beleid rond continuïteit, beveiliging, certificaten en licenties. Deze activiteiten zijn grotendeels onzichtbaar voor klanten — tenzij er iets misgaat.',
      en: 'Operate keeps products and systems stable, reliable and compliant. It covers routine testing, backups, monitoring and processing events, and complying with policy on continuity, security, certificates and licences. These activities are largely invisible to customers — unless something goes wrong.',
    },
    source: 'Syllabus 3.2.6',
  },
  {
    id: 'itil5-q091',
    objective: '4.4.8',
    type: 'standard',
    bloom: 1,
    difficulty: 2,
    stem: {
      nl: 'Hoe definieert ITIL een ramp (disaster)?',
      en: 'How does ITIL define a disaster?',
    },
    options: [
      {
        text: {
          nl: 'Een plotselinge, onvoorziene gebeurtenis die grote schade veroorzaakt, waardoor de organisatie gedurende een vooraf bepaalde minimale periode geen essentiële bedrijfsactiviteiten kan uitvoeren',
          en: 'A sudden, unplanned event that causes great damage, leaving the organization unable to perform critical business activities for a predetermined minimum period',
        },
        correct: true,
      },
      {
        text: {
          nl: 'Een onderbreking van een service die niet gepland was, of een terugval in de kwaliteit ervan',
          en: 'An interruption to a service that was not planned, or a drop in its quality',
        },
        rationale: {
          nl: 'Dat is de definitie van een incident. Het onderscheid zit in de omvang en de duur van de onbeschikbaarheid van essentiële activiteiten.',
          en: 'That is the definition of an incident. The distinction lies in the scale and duration of the unavailability of critical activities.',
        },
      },
      {
        text: {
          nl: 'Een mankement of zwakke plek waaruit incidenten kunnen ontstaan',
          en: 'A defect or weak spot from which incidents can arise',
        },
        rationale: {
          nl: 'Dat is de definitie van een fout (error).',
          en: 'That is the definition of an error.',
        },
      },
      {
        text: {
          nl: 'Datgene waar een of meer incidenten uit voortkomen, of uit voort zouden kunnen komen',
          en: 'Whatever one or more incidents stem from, or could stem from',
        },
        rationale: {
          nl: 'Dat is de definitie van een probleem.',
          en: 'That is the definition of a problem.',
        },
      },
    ],
    explanation: {
      nl: 'De vier begrippen bij de activiteit ondersteunen: een fout is een gebrek dat incidenten kan veroorzaken; een probleem is een (mogelijke) oorzaak van incidenten; een bekende fout is een geanalyseerd maar nog niet opgelost probleem; een ramp is de zwaarste categorie, waarbij essentiële bedrijfsactiviteiten voor een bepaalde minimale periode stilliggen.',
      en: 'The four terms in the support activity: an error is a flaw that may cause incidents; a problem is a (potential) cause of incidents; a known error is a problem analysed but not yet resolved; a disaster is the most severe category, halting critical business activities for a defined minimum period.',
    },
    source: 'Syllabus 4.4.8',
  },
  {
    id: 'itil5-q092',
    objective: '4.4.12',
    type: 'standard',
    bloom: 2,
    difficulty: 3,
    stem: {
      nl: 'Een managed service provider beheert en ondersteunt klantplatformen, terwijl de klant zelf ontdekt wat nodig is en de leverancier het ontwerp en de bouw doet. Wat zegt dit over de waardeketen van deze organisatie?',
      en: 'A managed service provider operates and supports customer platforms, while the customer does the discovery and the vendor handles design and build. What does this say about this organization’s value chain?',
    },
    options: [
      {
        text: {
          nl: 'Het operationele model bepaalt welke waardeketenactiviteiten de organisatie zelf uitvoert; niet elke organisatie voert alle acht activiteiten uit',
          en: 'The operating model determines which value chain activities the organization performs itself; not every organization performs all eight activities',
        },
        correct: true,
      },
      {
        text: {
          nl: 'De organisatie past ITIL onjuist toe, want alle acht activiteiten zijn verplicht',
          en: 'The organization is applying ITIL incorrectly, because all eight activities are mandatory',
        },
        rationale: {
          nl: 'ITIL schrijft niets voor. De activiteiten worden gecombineerd afhankelijk van de context en het bedrijfsmodel.',
          en: 'ITIL prescribes nothing. Activities are combined depending on context and operating model.',
        },
      },
      {
        text: {
          nl: 'De organisatie heeft geen waardeketen omdat zij een deel uitbesteedt',
          en: 'The organization has no value chain because it outsources part of it',
        },
        rationale: {
          nl: 'Elke organisatie heeft een waardeketen; die is alleen anders samengesteld.',
          en: 'Every organization has a value chain; it is simply composed differently.',
        },
      },
      {
        text: {
          nl: 'De organisatie hoeft geen managementwerkwijzen te ontwikkelen',
          en: 'The organization does not need to develop management practices',
        },
        rationale: {
          nl: 'Juist wel: voor elke waardeketenactiviteit die je opneemt, ontwikkel je het bijbehorende managementvermogen.',
          en: 'On the contrary: for every value chain activity you include, you develop the corresponding management capability.',
        },
      },
    ],
    explanation: {
      nl: 'Het doel van de organisatie bepaalt de intentie; het operationele model, de waardeketen en de werkwijzen brengen die tot leven. Een interne IT-afdeling met volledige levenscyclus voert alle acht activiteiten uit; een managed service provider richt zich vooral op beheren en ondersteunen, waarbij ontdekken bij de klant ligt en ontwerpen en bouwen bij de leverancier. Wanneer je een activiteit opneemt, ontwikkel je daarvoor het benodigde managementvermogen.',
      en: 'The organization’s purpose defines intent; the operating model, value chain and practices bring it to life. An internal IT department covering the full lifecycle performs all eight activities; a managed service provider focuses mainly on operate and support, with discovery sitting at the customer and design and build at the vendor. When you include an activity, you develop the management capability it requires.',
    },
    source: 'Syllabus 4.4.12',
  },
  {
    id: 'itil5-q093',
    objective: '4.5.5',
    type: 'list',
    bloom: 2,
    difficulty: 2,
    stem: {
      nl: 'Welke twee voordelen bieden de officiële ITIL Practice Guides?',
      en: 'Which two benefits do the official ITIL Practice Guides offer?',
    },
    listItems: [
      {
        nl: 'Alle 34 werkwijzen volgen dezelfde structuur, wat ze onderling vergelijkbaar maakt',
        en: 'All 34 practices follow the same structure, making them comparable',
      },
      {
        nl: 'Zij schrijven per werkwijze een verplichte implementatievolgorde voor',
        en: 'They prescribe a mandatory implementation sequence per practice',
      },
      {
        nl: 'Zij zijn gekoppeld aan het ITIL-volwassenheidsmodel, wat voortdurend verbeteren ondersteunt',
        en: 'They are linked to the ITIL maturity model, supporting continual improvement',
      },
      {
        nl: 'Zij garanderen certificering van de organisatie na toepassing',
        en: 'They guarantee organizational certification once applied',
      },
    ],
    options: [
      { text: { nl: '1 en 3', en: '1 and 3' }, correct: true },
      {
        text: { nl: '1 en 2', en: '1 and 2' },
        rationale: {
          nl: 'Statement 2 is onjuist: de guides geven aanbevelingen voor succesvolle toepassing, geen verplichte volgorde.',
          en: 'Statement 2 is incorrect: the guides give recommendations for success, not a mandatory sequence.',
        },
      },
      {
        text: { nl: '2 en 4', en: '2 and 4' },
        rationale: {
          nl: 'Beide statements zijn onjuist; ITIL is een framework met aanbevelingen, geen certificeringsnorm voor organisaties.',
          en: 'Both statements are incorrect; ITIL is a framework of recommendations, not an organizational certification standard.',
        },
      },
      {
        text: { nl: '3 en 4', en: '3 and 4' },
        rationale: {
          nl: 'Statement 4 is onjuist: organisatiecertificering maakt geen deel uit van de Practice Guides.',
          en: 'Statement 4 is incorrect: organizational certification is not part of the Practice Guides.',
        },
      },
    ],
    explanation: {
      nl: 'De consistente opzet levert vier voordelen op: consistent (dezelfde structuur voor alle 34 werkwijzen), uitgebreid (mensen, processen, technologie én leveranciers), praktisch (met metrics, rollen en aanbevelingen) en gericht op voortdurend verbeteren (gekoppeld aan het volwassenheidsmodel).',
      en: 'The consistent format delivers four benefits: consistent (the same structure for all 34 practices), comprehensive (people, processes, technology and suppliers), practical (with metrics, roles and recommendations) and improvement-oriented (linked to the maturity model).',
    },
    source: 'Syllabus 4.5.5',
  },
  {
    id: 'itil5-q094',
    objective: '5.1.4',
    type: 'standard',
    bloom: 2,
    difficulty: 3,
    stem: {
      nl: 'De IT-afdeling van een bedrijf levert een digitale salarisadministratieservice. Voor de IT-afdeling is dit een kernwaardestroom. Hoe wordt de salarisadministratie zelf gezien vanuit het bedrijf als geheel?',
      en: 'A company’s IT department delivers a digital payroll service. For the IT department this is a core value stream. How is payroll itself viewed from the company as a whole?',
    },
    options: [
      {
        text: {
          nl: 'Als een ondersteunende waardestroom, omdat die het bedrijf in staat stelt zijn kernactiviteiten voor klanten uit te voeren',
          en: 'As an enabling value stream, because it allows the company to perform its core activities for customers',
        },
        correct: true,
      },
      {
        text: {
          nl: 'Ook als een kernwaardestroom, want de indeling is absoluut',
          en: 'Also as a core value stream, because the classification is absolute',
        },
        rationale: {
          nl: 'De indeling is juist relatief en hangt af van de scope van ‘de organisatie’ die je beschouwt.',
          en: 'The classification is relative and depends on the scope of ‘the organization’ you consider.',
        },
      },
      {
        text: {
          nl: 'Als een waardeketen',
          en: 'As a value chain',
        },
        rationale: {
          nl: 'Een waardeketen beschrijft activiteiten zoals ontworpen; een waardestroom beschrijft ze zoals uitgevoerd.',
          en: 'A value chain describes activities as designed; a value stream describes them as performed.',
        },
      },
      {
        text: {
          nl: 'Als een niet-waarde creërende activiteit',
          en: 'As a non-value-adding activity',
        },
        rationale: {
          nl: 'Niet-waarde creërende activiteiten (waste) horen geëlimineerd te worden; salarisadministratie is juist noodzakelijk.',
          en: 'Non-value-adding activities (waste) should be eliminated; payroll is genuinely necessary.',
        },
      },
    ],
    explanation: {
      nl: 'Een kernwaardestroom creëert waarde voor consumenten in de vorm die het operationele model beoogt. Een ondersteunende waardestroom creëert waarde voor interne klanten en maakt daarmee de kernwaardestromen mogelijk. De indeling is trapsgewijs en hangt af van welke ‘organisatie’ je als scope neemt: wat voor de IT-afdeling kern is, kan voor het bedrijf ondersteunend zijn.',
      en: 'A core value stream creates value for consumers in the form intended by the operating model. An enabling value stream creates value for internal customers and thereby enables the core value streams. The classification is layered and depends on which ‘organization’ you take as scope: what is core for the IT department can be enabling for the company.',
    },
    source: 'Syllabus 5.1.4',
  },
  {
    id: 'itil5-q095',
    objective: '5.2.1',
    type: 'standard',
    bloom: 2,
    difficulty: 2,
    stem: {
      nl: 'Een organisatie schrijft gedetailleerde procedures voor het oplossen van performanceproblemen in een microservices-architectuur, waar de oorzaak telkens anders blijkt. Wat gaat hier mis?',
      en: 'An organization writes detailed procedures for resolving performance problems in a microservices architecture, where the cause turns out to be different every time. What is going wrong?',
    },
    options: [
      {
        text: {
          nl: 'Gedetailleerde procedures werken in een geordende context, maar niet in een complexe; daar helpen experimenteren, multidisciplinaire teams en feedbackloops beter',
          en: 'Detailed procedures work in an ordered context but not a complex one; there, experimentation, multidisciplinary teams and feedback loops work better',
        },
        correct: true,
      },
      {
        text: {
          nl: 'De procedures zijn niet gedetailleerd genoeg; met meer detail zou het wel werken',
          en: 'The procedures are not detailed enough; with more detail it would work',
        },
        rationale: {
          nl: 'Meer detail verergert het probleem juist: procedures kunnen schadelijk zijn in situaties waarvoor ze niet zijn ontworpen.',
          en: 'More detail makes it worse: procedures can be harmful in situations they were not designed for.',
        },
      },
      {
        text: {
          nl: 'De organisatie had de situatie als chaotisch moeten classificeren',
          en: 'The organization should have classified the situation as chaotic',
        },
        rationale: {
          nl: 'Chaotisch betreft crisissituaties waarin eerst stabiliseren nodig is, zoals een grote outage of een actief datalek.',
          en: 'Chaotic refers to crisis situations requiring stabilization first, such as a major outage or an active breach.',
        },
      },
      {
        text: {
          nl: 'Procedures horen nooit thuis in product- en servicemanagement',
          en: 'Procedures never belong in product and service management',
        },
        rationale: {
          nl: 'In een geordende, voorspelbare context zijn procedures juist effectief en garanderen ze consistente resultaten.',
          en: 'In an ordered, predictable context procedures are effective and ensure consistent results.',
        },
      },
    ],
    explanation: {
      nl: 'Complexiteitsdenken onderscheidt vier contexten. Geordend werk (wachtwoordreset, standaard request) leent zich voor automatisering, runbooks en checklists. Complex werk (performanceproblemen in microservices, root cause analysis bij terugkerende incidenten) vraagt om experimenteren en feedbackloops. Chaotisch werk vraagt eerst om stabiliseren. Bij verward werk is de eerste taak structureren en classificeren.',
      en: 'Complexity thinking distinguishes four contexts. Ordered work (password reset, standard request) suits automation, runbooks and checklists. Complex work (microservice performance issues, root cause analysis of recurring incidents) calls for experimentation and feedback loops. Chaotic work requires stabilizing first. With confused work, the first task is to structure and classify.',
    },
    source: 'Syllabus 5.2.1',
  },
  {
    id: 'itil5-q096',
    objective: '5.3.2',
    type: 'standard',
    bloom: 2,
    difficulty: 2,
    stem: {
      nl: 'Hoe verhouden waardestroom-analyse (mapping) en waardestroom-management zich tot elkaar?',
      en: 'How do value stream mapping and value stream management relate to each other?',
    },
    options: [
      {
        text: {
          nl: 'Mapping is de techniek om stromen zichtbaar te maken en te analyseren; management is de doorlopende sturing en verbetering op basis daarvan',
          en: 'Mapping is the technique for making flows visible and analysing them; management is the ongoing steering and improvement based on that',
        },
        correct: true,
      },
      {
        text: {
          nl: 'Het zijn twee namen voor hetzelfde',
          en: 'They are two names for the same thing',
        },
        rationale: {
          nl: 'ITIL definieert ze apart: de een is een techniek, de ander een doorlopende managementpraktijk.',
          en: 'ITIL defines them separately: one is a technique, the other an ongoing management practice.',
        },
      },
      {
        text: {
          nl: 'Management gaat vooraf aan mapping',
          en: 'Management precedes mapping',
        },
        rationale: {
          nl: 'Je kunt pas sturen op wat je in kaart hebt gebracht; mapping levert het inzicht waarop management voortbouwt.',
          en: 'You can only steer what you have mapped; mapping provides the insight management builds on.',
        },
      },
      {
        text: {
          nl: 'Mapping is eenmalig, management is optioneel',
          en: 'Mapping is one-off and management is optional',
        },
        rationale: {
          nl: 'Beide zijn doorlopend; het gaat om voortdurende optimalisatie, niet om een eenmalige exercitie.',
          en: 'Both are ongoing; the point is continual optimization, not a one-off exercise.',
        },
      },
    ],
    explanation: {
      nl: 'Waardestroom-analyse visualiseert de stroom van werk, informatie en waarde in vijf stappen: identificeren, huidige situatie in kaart brengen, analyseren, gewenste situatie in kaart brengen, verbeteren. Waardestroom-management is de doorlopende focus op hoe het werk wordt gedaan: zowel management ván waardestromen (functioneert deze stroom goed?) als management dóór waardestromen (hoe sturen we de organisatie ermee?).',
      en: 'Value stream mapping visualizes the flow of work, information and value in five steps: identify, map the current state, analyse, map the target state, improve. Value stream management is the ongoing focus on how work gets done: both management of value streams (is this stream performing?) and management by value streams (how do we steer the organization with them?).',
    },
    source: 'Syllabus 5.3.2',
  },
  {
    id: 'itil5-q097',
    objective: '6.1.1',
    type: 'standard',
    bloom: 1,
    difficulty: 2,
    stem: {
      nl: 'Wat kenmerkt generatieve AI (GenAI) ten opzichte van andere vormen van AI?',
      en: 'What characterizes generative AI (GenAI) compared to other forms of AI?',
    },
    options: [
      {
        text: {
          nl: 'Het genereert nieuwe output — tekst, code, documentatie — die voorheen niet bestond, in reactie op prompts of triggers',
          en: 'It generates new output — text, code, documentation — that did not previously exist, in response to prompts or triggers',
        },
        correct: true,
      },
      {
        text: {
          nl: 'Het herkent patronen en afwijkingen in bestaande data',
          en: 'It recognizes patterns and anomalies in existing data',
        },
        rationale: {
          nl: 'Dat is de capability cognitie (cognition) uit het ITIL AI Capability Model.',
          en: 'That is the cognition capability from the ITIL AI Capability Model.',
        },
      },
      {
        text: {
          nl: 'Het verbetert de kwaliteit en relevantie van bestaande data',
          en: 'It improves the quality and relevance of existing data',
        },
        rationale: {
          nl: 'Dat is de capability curatie (curation).',
          en: 'That is the curation capability.',
        },
      },
      {
        text: {
          nl: 'Het voert autonoom acties uit in verschillende systemen',
          en: 'It autonomously executes actions across different systems',
        },
        rationale: {
          nl: 'Dat is de capability coördinatie (coordination), waar agentic AI op aansluit.',
          en: 'That is the coordination capability, which agentic AI builds on.',
        },
      },
    ],
    explanation: {
      nl: 'In het ITIL AI Capability Model hoort generatieve AI bij creatie (creation): het produceren van content, code, documentatie of andere artefacten die er nog niet waren. Agentic AI sluit aan bij coördinatie: autonoom acties uitvoeren, orkestreren of activeren, vaak als reactie op gebeurtenissen of patronen. De snelle opkomst van generatieve AI biedt kansen, maar vergroot ook de eisen aan governance, ethiek en datakwaliteit.',
      en: 'In the ITIL AI Capability Model, generative AI belongs to creation: producing content, code, documentation or other artefacts that did not exist before. Agentic AI aligns with coordination: autonomously executing, orchestrating or triggering actions, often in response to events or patterns. The rapid rise of generative AI brings opportunities but also raises the bar for governance, ethics and data quality.',
    },
    source: 'Syllabus 6.1.1',
  },
  {
    id: 'itil5-q098',
    objective: '6.1.3',
    type: 'standard',
    bloom: 2,
    difficulty: 2,
    stem: {
      nl: 'Op welke waardeketenactiviteiten kan AI worden ingezet?',
      en: 'To which value chain activities can AI be applied?',
    },
    options: [
      {
        text: {
          nl: 'Op alle activiteiten, van strategische planning en portfoliomanagement tot softwareontwikkeling, testen, monitoring en gebruikersondersteuning',
          en: 'To all activities, from strategic planning and portfolio management to software development, testing, monitoring and user support',
        },
        correct: true,
      },
      {
        text: {
          nl: 'Uitsluitend op ondersteunen, omdat daar chatbots worden ingezet',
          en: 'Only to support, because that is where chatbots are used',
        },
        rationale: {
          nl: 'Chatbots zijn één toepassing (de capability communicatie); AI raakt de hele levenscyclus.',
          en: 'Chatbots are one application (the communication capability); AI touches the entire lifecycle.',
        },
      },
      {
        text: {
          nl: 'Alleen op bouwen en transitie, omdat dat de technische activiteiten zijn',
          en: 'Only to build and transition, because those are the technical activities',
        },
        rationale: {
          nl: 'Ook ontdekken, ontwerpen en beheren profiteren van AI, bijvoorbeeld bij analyse en anomaliedetectie.',
          en: 'Discover, design and operate also benefit from AI, for instance in analysis and anomaly detection.',
        },
      },
      {
        text: {
          nl: 'Op geen enkele, zolang er geen AI-governance is vastgesteld',
          en: 'To none, as long as no AI governance has been established',
        },
        rationale: {
          nl: 'Governance is een randvoorwaarde voor verantwoord gebruik, geen verbod op toepassing.',
          en: 'Governance is a precondition for responsible use, not a prohibition on application.',
        },
      },
    ],
    explanation: {
      nl: 'AI ondersteunt digitaal product- en servicemanagement op alle niveaus door slimmere beslissingen en automatisering mogelijk te maken. Het verwerkt informatie snel, herkent patronen in incidenten en prestaties, en vermindert vooroordelen bij besluitvorming. AI wordt gezien als samenwerkingspartner die menselijke sterke punten versterkt — mensen blinken uit in creativiteit, empathie en contextueel begrip.',
      en: 'AI supports digital product and service management at all levels by enabling smarter decisions and automation. It processes information quickly, recognizes patterns in incidents and performance, and reduces bias in decision-making. AI is seen as a collaborative partner that amplifies human strengths — people excel at creativity, empathy and contextual understanding.',
    },
    source: 'Syllabus 6.1.3',
  },
  {
    id: 'itil5-q099',
    objective: '7.1.2',
    type: 'standard',
    bloom: 2,
    difficulty: 2,
    stem: {
      nl: 'Wat voegt DevOps toe aan de ITIL product- en servicelevenscyclus?',
      en: 'What does DevOps add to the ITIL product and service lifecycle?',
    },
    options: [
      {
        text: {
          nl: 'Gedetailleerde technieken voor snelle, continue levering, waarmee de uitvoering van levenscyclusactiviteiten wordt versneld en verbeterd',
          en: 'Detailed techniques for fast, continuous delivery that accelerate and improve the execution of lifecycle activities',
        },
        correct: true,
      },
      {
        text: {
          nl: 'Een vervangend model voor het ITIL-waardesysteem',
          en: 'A replacement model for the ITIL Value System',
        },
        rationale: {
          nl: 'DevOps vervangt het waardesysteem niet; het verbetert de uitvoering binnen dat systeem.',
          en: 'DevOps does not replace the value system; it improves execution within it.',
        },
      },
      {
        text: {
          nl: 'Governance en toezicht op digitale technologie',
          en: 'Governance and oversight of digital technology',
        },
        rationale: {
          nl: 'Dat is juist wat ITIL levert; DevOps brengt de praktische uitvoeringstechnieken.',
          en: 'That is what ITIL provides; DevOps brings the practical execution techniques.',
        },
      },
      {
        text: {
          nl: 'Een methode voor het managen van projecten en programma’s',
          en: 'A method for managing projects and programmes',
        },
        rationale: {
          nl: 'Dat is de bijdrage van PRINCE2, niet van DevOps.',
          en: 'That is PRINCE2’s contribution, not DevOps’.',
        },
      },
    ],
    explanation: {
      nl: 'DevOps biedt gedetailleerde technieken voor de levenscyclusactiviteiten ontdekken, ontwerpen, verwerven, bouwen, overdragen, beheren, leveren en ondersteunen. In combinatie met ITIL ontstaat een alomvattende aanpak: ITIL definieert hoe waarde wordt gecreëerd en gemanaged, DevOps verbetert de uitvoering met automatisering, samenwerking en snelle feedback. Samen balanceren ze stabiliteit en snelheid.',
      en: 'DevOps offers detailed techniques for the lifecycle activities discover, design, acquire, build, transition, operate, deliver and support. Combined with ITIL this forms a comprehensive approach: ITIL defines how value is created and managed, DevOps improves execution through automation, collaboration and rapid feedback. Together they balance stability and speed.',
    },
    source: 'Syllabus 7.1.2',
  },
  {
    id: 'itil5-q100',
    objective: '7.2.2',
    type: 'standard',
    bloom: 2,
    difficulty: 2,
    stem: {
      nl: 'Hoe vullen ITIL en PRINCE2 elkaar aan?',
      en: 'How do ITIL and PRINCE2 complement each other?',
    },
    options: [
      {
        text: {
          nl: 'ITIL biedt het operationele framework voor het creëren, leveren en verbeteren van digitale producten en services; PRINCE2 biedt gestructureerde methoden voor projecten, programma’s en portfolio’s',
          en: 'ITIL provides the operational framework for creating, delivering and improving digital products and services; PRINCE2 provides structured methods for projects, programmes and portfolios',
        },
        correct: true,
      },
      {
        text: {
          nl: 'PRINCE2 vervangt de projectmanagement-werkwijze binnen ITIL volledig',
          en: 'PRINCE2 fully replaces the project management practice within ITIL',
        },
        rationale: {
          nl: 'De ITIL Practice Guides introduceren project- en portfoliomanagement; PRINCE2 vult die aan met meer diepgang, maar vervangt ze niet.',
          en: 'The ITIL Practice Guides introduce project and portfolio management; PRINCE2 adds depth but does not replace them.',
        },
      },
      {
        text: {
          nl: 'ITIL is voor waterval-projecten en PRINCE2 voor agile projecten',
          en: 'ITIL is for waterfall projects and PRINCE2 for agile projects',
        },
        rationale: {
          nl: 'PRINCE2 kent zowel een traditionele als een Agile-variant; ITIL is geen projectmethode.',
          en: 'PRINCE2 has both a traditional and an Agile variant; ITIL is not a project method.',
        },
      },
      {
        text: {
          nl: 'Zij zijn niet te combineren omdat ze verschillende principes hanteren',
          en: 'They cannot be combined because they use different principles',
        },
        rationale: {
          nl: 'ITIL, PRINCE2, Agile en DevOps delen juist fundamentele principes, waardoor ze goed samenwerken.',
          en: 'ITIL, PRINCE2, Agile and DevOps share fundamental principles, which is why they work well together.',
        },
      },
    ],
    explanation: {
      nl: 'Effectief projectmanagement is essentieel omdat veel wijzigingen aan digitale producten via gestructureerde projecten worden doorgevoerd. PRINCE2 vult ITIL aan waar complexere of grootschaligere initiatieven meer diepgang en governance vragen, en de PRINCE2-fasen kunnen worden gekoppeld aan de ITIL-levenscyclusactiviteiten. Samen zorgen ze dat strategie, veranderinitiatieven en operationele processen op elkaar zijn afgestemd.',
      en: 'Effective project management is essential because many changes to digital products are delivered through structured projects. PRINCE2 complements ITIL where more complex or large-scale initiatives require greater depth and governance, and PRINCE2 phases can be mapped to the ITIL lifecycle activities. Together they align strategy, change initiatives and operational processes.',
    },
    source: 'Syllabus 7.2.2',
  },
];
