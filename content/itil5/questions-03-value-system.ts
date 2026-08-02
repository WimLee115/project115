import type { QuestionSeed } from '../types';

/**
 * ITIL Foundation (Version 5) — domein 4: Het ITIL-waardesysteem (40%).
 *
 * Het zwaarste domein van het examen: 16 van de 40 vragen. Bevat de zeven
 * leidende principes, governance, de waardeketen met bijbehorende definities,
 * de managementwerkwijzen en het model voor voortdurend verbeteren.
 */

export const questions: QuestionSeed[] = [
  /* --- 4.1 Componenten van het ITIL-waardesysteem --------------------- */
  {
    id: 'itil5-q044',
    objective: '4.1.1',
    type: 'standard',
    bloom: 1,
    difficulty: 2,
    stem: {
      nl: 'Uit welke vijf componenten bestaat het ITIL-waardesysteem?',
      en: 'Which five components make up the ITIL Value System?',
    },
    options: [
      {
        text: {
          nl: 'Leidende principes, governance, waardeketen, managementwerkwijzen en voortdurend verbeteren',
          en: 'Guiding principles, governance, value chain, management practices and continual improvement',
        },
        correct: true,
      },
      {
        text: {
          nl: 'Organisaties en mensen, informatie en technologie, partners en leveranciers, waardestromen en processen, governance',
          en: 'Organizations and people, information and technology, partners and suppliers, value streams and processes, governance',
        },
        rationale: {
          nl: 'De eerste vier zijn de vier dimensies, niet de componenten van het waardesysteem.',
          en: 'The first four are the four dimensions, not the components of the value system.',
        },
      },
      {
        text: {
          nl: 'Kans, vraag, waardeketen, producten en services, waarde',
          en: 'Opportunity, demand, value chain, products and services, value',
        },
        rationale: {
          nl: 'Kans en vraag zijn de inputs van het waardesysteem en waarde is de outcome — geen componenten.',
          en: 'Opportunity and demand are the inputs of the value system and value is the outcome — not components.',
        },
      },
      {
        text: {
          nl: 'Strategie, ontwerp, transitie, exploitatie en voortdurende serviceverbetering',
          en: 'Strategy, design, transition, operation and continual service improvement',
        },
        rationale: {
          nl: 'Dit is de levenscyclusindeling uit ITIL v3, die in ITIL 4 en 5 niet meer wordt gebruikt.',
          en: 'This is the ITIL v3 lifecycle structure, no longer used in ITIL 4 and 5.',
        },
      },
    ],
    explanation: {
      nl: 'Het ITIL VS combineert governance en management van digitale technologie in één systeem. De belangrijkste input is kans (opportunity) en vraag (demand); de outcome is waarde voor serviceafnemers en andere stakeholders.',
      en: 'The ITIL VS combines governance and management of digital technology in one system. Its main input is opportunity and demand; its outcome is value for service consumers and other stakeholders.',
    },
    source: 'Syllabus 4.1.1',
  },
  {
    id: 'itil5-q045',
    objective: '4.1.2',
    type: 'standard',
    bloom: 2,
    difficulty: 2,
    stem: {
      nl: 'Wat is de belangrijkste input van het ITIL-waardesysteem?',
      en: 'What is the main input of the ITIL Value System?',
    },
    options: [
      {
        text: { nl: 'Kans (opportunity) en vraag (demand)', en: 'Opportunity and demand' },
        correct: true,
      },
      {
        text: {
          nl: 'Waarde voor stakeholders',
          en: 'Value for stakeholders',
        },
        rationale: {
          nl: 'Waarde is juist de outcome van het waardesysteem, niet de input.',
          en: 'Value is the outcome of the value system, not its input.',
        },
      },
      {
        text: {
          nl: 'De vier dimensies van product- en servicemanagement',
          en: 'The four dimensions of product and service management',
        },
        rationale: {
          nl: 'De vier dimensies leveren de middelen die werkwijzen combineren; ze zijn geen input van het systeem als geheel.',
          en: 'The four dimensions provide the resources practices combine; they are not an input to the system as a whole.',
        },
      },
      {
        text: {
          nl: 'De zeven leidende principes',
          en: 'The seven guiding principles',
        },
        rationale: {
          nl: 'De leidende principes zijn een component van het waardesysteem, geen input ervan.',
          en: 'The guiding principles are a component of the value system, not an input to it.',
        },
      },
    ],
    explanation: {
      nl: 'Kansen zijn opties of mogelijkheden om waarde toe te voegen of de organisatie te verbeteren. Vraag is de behoefte of het verlangen naar producten en services bij interne en externe gebruikers. Het waardesysteem zet deze input om in waardevolle eindresultaten.',
      en: 'Opportunities are options or possibilities to add value or otherwise improve the organization. Demand is the need or desire for products and services among internal and external users. The value system converts this input into valuable outcomes.',
    },
    source: 'Syllabus 4.1.2',
  },

  /* --- 4.2 De leidende principes -------------------------------------- */
  {
    id: 'itil5-q046',
    objective: '4.2.1',
    type: 'negative',
    bloom: 1,
    difficulty: 2,
    stem: {
      nl: 'Welke van de volgende is GEEN ITIL leidend principe?',
      en: 'Which of the following is NOT an ITIL guiding principle?',
    },
    options: [
      {
        text: {
          nl: 'Meet alles wat meetbaar is',
          en: 'Measure everything that can be measured',
        },
        correct: true,
      },
      {
        text: { nl: 'Focus op waarde', en: 'Focus on value' },
        rationale: {
          nl: 'Dit is het eerste leidende principe.',
          en: 'This is the first guiding principle.',
        },
      },
      {
        text: {
          nl: 'Houd het eenvoudig en praktisch',
          en: 'Keep it simple and practical',
        },
        rationale: {
          nl: 'Dit is een van de zeven leidende principes.',
          en: 'This is one of the seven guiding principles.',
        },
      },
      {
        text: {
          nl: 'Werk samen en bevorder transparantie',
          en: 'Collaborate and promote visibility',
        },
        rationale: {
          nl: 'Dit is een van de zeven leidende principes.',
          en: 'This is one of the seven guiding principles.',
        },
      },
    ],
    explanation: {
      nl: 'De zeven principes zijn: focus op waarde; begin waar je bent; maak iteratieve voortgang met feedback; werk samen en bevorder transparantie; denk en werk holistisch; houd het eenvoudig en praktisch; optimaliseer en automatiseer. ‘Meet alles wat meetbaar is’ druist juist in tegen ITIL: een te grote afhankelijkheid van data kan vertekening introduceren.',
      en: 'The seven principles are: focus on value; start where you are; progress iteratively with feedback; collaborate and promote visibility; think and work holistically; keep it simple and practical; optimize and automate. ‘Measure everything measurable’ actually contradicts ITIL: over-reliance on data can introduce bias.',
    },
    source: 'Syllabus 4.2.1',
  },
  {
    id: 'itil5-q047',
    objective: '4.2.3',
    type: 'standard',
    bloom: 2,
    difficulty: 2,
    stem: {
      nl: 'Een organisatie wil haar verouderde incidentproces vervangen. Het team stelt voor alles weg te gooien en volledig opnieuw te beginnen. Welk leidend principe wordt hier genegeerd?',
      en: 'An organization wants to replace its outdated incident process. The team proposes discarding everything and starting completely from scratch. Which guiding principle is being ignored?',
    },
    options: [
      { text: { nl: 'Begin waar je bent', en: 'Start where you are' }, correct: true },
      {
        text: {
          nl: 'Maak iteratieve voortgang met feedback',
          en: 'Progress iteratively with feedback',
        },
        rationale: {
          nl: 'Dit principe gaat over het opdelen van werk in beheersbare iteraties met ingebouwde feedbackloops.',
          en: 'This principle is about breaking work into manageable iterations with built-in feedback loops.',
        },
      },
      {
        text: { nl: 'Optimaliseer en automatiseer', en: 'Optimize and automate' },
        rationale: {
          nl: 'Dit principe gaat over vereenvoudigen vóór automatiseren en over governance bij het inzetten van technologie.',
          en: 'This principle is about simplifying before automating and governing the use of technology.',
        },
      },
      {
        text: { nl: 'Denk en werk holistisch', en: 'Think and work holistically' },
        rationale: {
          nl: 'Dit principe gaat over het geïntegreerd aanpakken van activiteiten in plaats van als losse onderdelen.',
          en: 'This principle is about addressing activities in an integrated way rather than as separate parts.',
        },
      },
    ],
    explanation: {
      nl: 'Begin waar je bent: begin niet opnieuw zonder eerst te overwegen wat er al beschikbaar is en hoe daarop kan worden voortgebouwd. Alles weggooien is zelden nodig, zelden verstandig en vaak zeer inefficiënt. Neem rechtstreeks waar en meet bestaande services om te bepalen wat hergebruikt kan worden — al kan de conclusie soms wél zijn dat niets bruikbaar is.',
      en: 'Start where you are: do not begin anew without first considering what is already available and how it can be built upon. Discarding everything is rarely necessary, rarely wise and often highly inefficient. Observe directly and measure existing services to determine what can be reused — although sometimes the conclusion genuinely is that nothing is reusable.',
    },
    source: 'Syllabus 4.2.3',
  },
  {
    id: 'itil5-q048',
    objective: '4.2.3',
    type: 'standard',
    bloom: 2,
    difficulty: 3,
    stem: {
      nl: 'Wat is volgens het principe ‘begin waar je bent’ de voorkeursmanier om de huidige situatie te begrijpen?',
      en: "According to the 'start where you are' principle, what is the preferred way to understand the current situation?",
    },
    options: [
      {
        text: {
          nl: 'Rechtstreekse waarneming, ondersteund door metingen',
          en: 'Direct observation, supported by measurement',
        },
        correct: true,
      },
      {
        text: {
          nl: 'Uitsluitend afgaan op bestaande managementrapportages',
          en: 'Relying solely on existing management reports',
        },
        rationale: {
          nl: 'Binnen organisaties is er vaak een discrepantie tussen rapportages en de werkelijkheid, door meetproblemen of onbedoelde vertekening.',
          en: 'Within organizations there is often a gap between reports and reality, due to measurement difficulties or unintended bias.',
        },
      },
      {
        text: {
          nl: 'Een externe consultant een benchmarkrapport laten opstellen',
          en: 'Having an external consultant produce a benchmark report',
        },
        rationale: {
          nl: 'Een frisse blik is nuttig, maar een benchmark vervangt geen directe waarneming van de eigen situatie.',
          en: 'A fresh perspective helps, but a benchmark does not replace direct observation of your own situation.',
        },
      },
      {
        text: {
          nl: 'Zo veel mogelijk meetwaarden verzamelen en pas daarna kijken',
          en: 'Collecting as many metrics as possible before looking at anything',
        },
        rationale: {
          nl: 'Metingen ondersteunen waarneming, maar vervangen die niet. Bovendien kan het meten zelf de resultaten beïnvloeden.',
          en: 'Measurement supports observation but does not replace it. Moreover, measuring can itself affect the results.',
        },
      },
    ],
    explanation: {
      nl: 'Gebruik metingen ter ondersteuning van, en niet ter vervanging van, wat wordt waargenomen. Rechtstreekse waarneming is altijd de voorkeursoptie. Laat bij voorkeur ook iemand met weinig voorkennis observeren: die heeft geen vooroordelen en ziet dingen die betrokkenen missen. Wees niet bang om ‘domme’ vragen te stellen.',
      en: 'Use measurement to support, not replace, what is observed. Direct observation is always preferred. Ideally have someone with little prior knowledge observe as well: they carry no bias and notice things insiders miss. Do not be afraid to ask ‘stupid’ questions.',
    },
    source: 'Syllabus 4.2.3',
  },
  {
    id: 'itil5-q049',
    objective: '4.2.4',
    type: 'standard',
    bloom: 2,
    difficulty: 2,
    stem: {
      nl: 'Wat is een feedback-loop?',
      en: 'What is a feedback loop?',
    },
    options: [
      {
        text: {
          nl: 'Een situatie waarbij een deel van de output van een activiteit wordt gebruikt als nieuwe input',
          en: 'A situation where part of the output of an activity is used as new input',
        },
        correct: true,
      },
      {
        text: {
          nl: 'Een periodiek overleg waarin klanttevredenheid wordt besproken',
          en: 'A periodic meeting in which customer satisfaction is discussed',
        },
        rationale: {
          nl: 'Dit is een mogelijk hulpmiddel om feedback te verzamelen, niet de definitie van een feedback-loop.',
          en: 'This is a possible means of collecting feedback, not the definition of a feedback loop.',
        },
      },
      {
        text: {
          nl: 'De informatie over reacties en meningen van belanghebbenden',
          en: 'Information about stakeholder reactions and opinions',
        },
        rationale: {
          nl: 'Dat is de definitie van feedback zelf; de loop is het mechanisme waarmee die feedback terugkeert als input.',
          en: 'That is the definition of feedback itself; the loop is the mechanism by which that feedback returns as input.',
        },
      },
      {
        text: {
          nl: 'Een herhaling van een mislukte iteratie',
          en: 'A repetition of a failed iteration',
        },
        rationale: {
          nl: 'Feedbackloops zijn niet gekoppeld aan mislukking; ze zijn ingebouwd in elke iteratie.',
          en: 'Feedback loops are not tied to failure; they are built into every iteration.',
        },
      },
    ],
    explanation: {
      nl: 'Feedback is informatie over reacties en meningen van belanghebbenden, die als basis dient voor verbetering. Feedback moet in elke iteratie ingebouwd worden: vóór, tijdens en na. Tijdgebonden (timeboxed), iteratief werken met feedbackloops levert grotere flexibiliteit, snellere reacties, eerdere detectie van storingen en betere kwaliteit.',
      en: 'Feedback is information about stakeholder reactions and opinions that forms the basis for improvement. Feedback should be built into every iteration: before, during and after. Timeboxed, iterative working with feedback loops yields greater flexibility, faster responses, earlier failure detection and better quality.',
    },
    source: 'Syllabus 4.2.4',
  },
  {
    id: 'itil5-q050',
    objective: '4.2.5',
    type: 'standard',
    bloom: 2,
    difficulty: 2,
    stem: {
      nl: 'Welke uitspraak past bij het principe ‘werk samen en bevorder transparantie’?',
      en: "Which statement fits the 'collaborate and promote visibility' principle?",
    },
    options: [
      {
        text: {
          nl: 'Samenwerking betekent niet automatisch consensus',
          en: 'Collaboration does not automatically mean consensus',
        },
        correct: true,
      },
      {
        text: {
          nl: 'Alle beslissingen moeten unaniem door alle stakeholders worden gedragen',
          en: 'All decisions must be unanimously supported by all stakeholders',
        },
        rationale: {
          nl: 'Dit is precies wat ITIL nuanceert: samenwerken betekent de juiste mensen betrekken, niet wachten op unanimiteit.',
          en: 'This is exactly what ITIL qualifies: collaborating means involving the right people, not waiting for unanimity.',
        },
      },
      {
        text: {
          nl: 'Transparantie is vooral belangrijk richting externe klanten',
          en: 'Visibility matters mainly towards external customers',
        },
        rationale: {
          nl: 'Transparantie over werkdruk en voortgang is juist ook intern cruciaal: gebrek aan inzicht leidt tot slechte beslissingen en lage acceptatie.',
          en: 'Visibility of workload and progress is crucial internally too: lack of insight leads to poor decisions and low adoption.',
        },
      },
      {
        text: {
          nl: 'Communiceer altijd in dezelfde vorm naar alle doelgroepen',
          en: 'Always communicate in the same form to every audience',
        },
        rationale: {
          nl: 'Communicatie dient juist plaats te vinden op een manier die wordt begrepen door de ontvanger.',
          en: 'Communication should take place in a way the recipient understands.',
        },
      },
    ],
    explanation: {
      nl: 'Bij dit principe hoort: samenwerking betekent niet automatisch consensus; communiceer op een manier die wordt begrepen; beslissingen kunnen alleen worden genomen op basis van zichtbare data; gebruik AI om silo’s te doorbreken. Slechte zichtbaarheid vergroot het risico dat werk als lage prioriteit wordt gezien.',
      en: 'This principle includes: collaboration does not automatically mean consensus; communicate in a way that is understood; decisions can only be made on visible data; use AI to break down silos. Poor visibility increases the risk that work is treated as low priority.',
    },
    source: 'Syllabus 4.2.5',
  },
  {
    id: 'itil5-q051',
    objective: '4.2.8',
    type: 'standard',
    bloom: 2,
    difficulty: 2,
    stem: {
      nl: 'Wat is de juiste volgorde volgens het principe ‘optimaliseer en automatiseer’?',
      en: "What is the correct order according to the 'optimize and automate' principle?",
    },
    options: [
      {
        text: {
          nl: 'Eerst vereenvoudigen en optimaliseren, daarna automatiseren',
          en: 'Simplify and optimize first, then automate',
        },
        correct: true,
      },
      {
        text: {
          nl: 'Eerst automatiseren, daarna optimaliseren op basis van de meetgegevens',
          en: 'Automate first, then optimize based on the resulting metrics',
        },
        rationale: {
          nl: 'Een inefficiënt proces automatiseren maakt het alleen sneller inefficiënt. Automatisering omwille van automatisering verhoogt kosten en risico’s.',
          en: 'Automating an inefficient process only makes it inefficient faster. Automation for its own sake raises costs and risks.',
        },
      },
      {
        text: {
          nl: 'Optimaliseren en automatiseren gebeuren altijd gelijktijdig',
          en: 'Optimizing and automating always happen simultaneously',
        },
        rationale: {
          nl: 'ITIL is expliciet over de volgorde: vereenvoudig en/of optimaliseer vóórdat je automatiseert.',
          en: 'ITIL is explicit about the order: simplify and/or optimize before automating.',
        },
      },
      {
        text: {
          nl: 'Automatiseer alleen wat niet geoptimaliseerd kan worden',
          en: 'Only automate what cannot be optimized',
        },
        rationale: {
          nl: 'Dit keert de bedoeling om: optimalisatie gaat vooraf aan automatisering, niet als alternatief ervoor.',
          en: 'This inverts the intent: optimization precedes automation, it is not an alternative to it.',
        },
      },
    ],
    explanation: {
      nl: 'Vereenvoudig en/of optimaliseer vóórdat je automatiseert. Definieer metrics die de waarde weerspiegelen en gebruik de andere leidende principes. Het gebruik van technologie, met name generatieve AI, dient onderworpen te zijn aan governance, ethisch beleid en compliance-richtlijnen — op het gebied van duurzaamheid, ethiek, privacy en beveiliging.',
      en: 'Simplify and/or optimize before automating. Define metrics that reflect value and use the other guiding principles. The use of technology, particularly generative AI, should be subject to governance, ethical policy and compliance guidance — covering sustainability, ethics, privacy and security.',
    },
    source: 'Syllabus 4.2.8',
  },
  {
    id: 'itil5-q052',
    objective: '4.2.9',
    type: 'standard',
    bloom: 2,
    difficulty: 3,
    stem: {
      nl: 'Hoe verhouden de zeven leidende principes zich tot elkaar?',
      en: 'How do the seven guiding principles relate to each other?',
    },
    options: [
      {
        text: {
          nl: 'Ze zijn allemaal even belangrijk en versterken elkaar; er is geen vaste hiërarchie, al kan de situatie sommige principes relevanter maken',
          en: 'They are all equally important and reinforce each other; there is no fixed hierarchy, although the situation may make some more relevant',
        },
        correct: true,
      },
      {
        text: {
          nl: 'Ze vormen een strikte hiërarchie waarbij ‘focus op waarde’ altijd voorgaat',
          en: "They form a strict hierarchy in which 'focus on value' always takes precedence",
        },
        rationale: {
          nl: 'Er is geen vaste hiërarchische volgorde tussen de principes; ze zijn allemaal even belangrijk voor het waardesysteem.',
          en: 'There is no fixed hierarchical order between the principles; all are equally important to the value system.',
        },
      },
      {
        text: {
          nl: 'Een organisatie kiest twee principes en past uitsluitend die toe',
          en: 'An organization picks two principles and applies only those',
        },
        rationale: {
          nl: 'ITIL waarschuwt hier expliciet voor: organisaties dienen zich niet op slechts één of twee principes te baseren.',
          en: 'ITIL explicitly warns against this: organizations should not rely on just one or two principles.',
        },
      },
      {
        text: {
          nl: 'Ze staan los van elkaar en kunnen onafhankelijk worden toegepast',
          en: 'They are independent of each other and can be applied in isolation',
        },
        rationale: {
          nl: 'De principes werken juist op elkaar in en zijn van elkaar afhankelijk.',
          en: 'The principles interact and depend on each other.',
        },
      },
    ],
    explanation: {
      nl: 'De principes werken op elkaar in en zijn van elkaar afhankelijk. Organisaties dienen de relevantie van álle principes te overwegen en hoe ze elkaar aanvullen. Er is geen vaste hiërarchische volgorde — ze zijn allemaal even belangrijk voor het ITIL-waardesysteem. In de praktijk kunnen sommige principes, afhankelijk van de situatie, belangrijker zijn.',
      en: 'The principles interact and are interdependent. Organizations should consider the relevance of all principles and how they complement each other. There is no fixed hierarchical order — all are equally important to the ITIL Value System. In practice, some may matter more depending on the situation.',
    },
    source: 'Syllabus 4.2.9',
  },
  {
    id: 'itil5-q053',
    objective: '4.2.2',
    type: 'list',
    bloom: 2,
    difficulty: 2,
    stem: {
      nl: 'Welke twee uitspraken over het principe ‘focus op waarde’ zijn CORRECT?',
      en: "Which two statements about the 'focus on value' principle are CORRECT?",
    },
    listItems: [
      {
        nl: 'Waarde voor de serviceconsument is subjectief en wordt gevormd door de service-ervaring',
        en: 'Value for the service consumer is subjective and shaped by the service experience',
      },
      {
        nl: 'Focus op waarde geldt alleen tijdens verbeteringsinitiatieven, niet tijdens normale operatie',
        en: 'Focus on value applies only during improvement initiatives, not during normal operations',
      },
      {
        nl: 'Waarde is dynamisch en verandert in de loop van de tijd en onder verschillende omstandigheden',
        en: 'Value is dynamic and changes over time and under different circumstances',
      },
      {
        nl: 'Alleen de serviceverlener hoeft te weten waarom de consument de service gebruikt',
        en: 'Only the service provider needs to know why the consumer uses the service',
      },
    ],
    options: [
      { text: { nl: '1 en 3', en: '1 and 3' }, correct: true },
      {
        text: { nl: '1 en 2', en: '1 and 2' },
        rationale: {
          nl: 'Statement 2 is onjuist: focus op waarde geldt zowel tijdens normale operationele activiteiten als tijdens verbeteringsinitiatieven.',
          en: 'Statement 2 is incorrect: focus on value applies during normal operations as well as improvement initiatives.',
        },
      },
      {
        text: { nl: '2 en 4', en: '2 and 4' },
        rationale: {
          nl: 'Beide statements zijn onjuist. Een focus op waarde moet juist bij álle medewerkers worden gestimuleerd.',
          en: 'Both statements are incorrect. A focus on value should be encouraged among all staff.',
        },
      },
      {
        text: { nl: '3 en 4', en: '3 and 4' },
        rationale: {
          nl: 'Statement 4 is onjuist: het principe vraagt juist om een focus op waarde bij alle medewerkers te stimuleren.',
          en: 'Statement 4 is incorrect: the principle calls for encouraging a focus on value among all employees.',
        },
      },
    ],
    explanation: {
      nl: 'Waarde voor de serviceconsument is gedefinieerd door hun behoeften, bereikt door resultaten en geoptimaliseerde kosten en risico’s, subjectief (gevormd door de service-ervaring) en dynamisch. Het principe toepassen betekent onder meer: weet hoe consumenten elke service gebruiken, stimuleer een focus op waarde bij alle medewerkers, en integreer dit in elke stap van elk verbeteringsinitiatief.',
      en: 'Value for the service consumer is defined by their needs, achieved through outcomes and optimized costs and risks, subjective (shaped by the service experience) and dynamic. Applying the principle means knowing how consumers use each service, encouraging a value focus among all staff, and integrating it into every step of every improvement initiative.',
    },
    source: 'Syllabus 4.2.2',
  },
  {
    id: 'itil5-q054',
    objective: '4.2.7',
    type: 'standard',
    bloom: 2,
    difficulty: 2,
    stem: {
      nl: 'Een team ontwerpt een proces en probeert voor elke denkbare uitzondering een aparte procedure te schrijven. Welk advies past bij het principe ‘houd het eenvoudig en praktisch’?',
      en: "A team designs a process and tries to write a separate procedure for every conceivable exception. Which advice fits the 'keep it simple and practical' principle?",
    },
    options: [
      {
        text: {
          nl: 'Ontwerp regels om uitzonderingen effectief af te handelen, in plaats van voor elke uitzondering een oplossing te bouwen',
          en: 'Design rules to handle exceptions effectively rather than building a solution for every exception',
        },
        correct: true,
      },
      {
        text: {
          nl: 'Negeer alle uitzonderingen en ontwerp alleen voor het standaardgeval',
          en: 'Ignore all exceptions and design only for the standard case',
        },
        rationale: {
          nl: 'Ontwerpers dienen wél rekening te houden met uitzonderingen; ze kunnen ze alleen niet allemaal afdekken.',
          en: 'Designers should account for exceptions; they simply cannot cover them all.',
        },
      },
      {
        text: {
          nl: 'Automatiseer elke uitzonderingsprocedure zodat de complexiteit onzichtbaar wordt',
          en: 'Automate every exception procedure so the complexity becomes invisible',
        },
        rationale: {
          nl: 'Automatiseren van onnodige complexiteit lost niets op; vereenvoudig eerst.',
          en: 'Automating unnecessary complexity solves nothing; simplify first.',
        },
      },
      {
        text: {
          nl: 'Voeg extra goedkeuringsstappen toe om fouten bij uitzonderingen te voorkomen',
          en: 'Add extra approval steps to prevent errors in exception cases',
        },
        rationale: {
          nl: 'Streef juist naar het minimaliseren van het aantal stappen dat nodig is om een doel te bereiken.',
          en: 'Aim instead to minimize the number of steps needed to achieve a goal.',
        },
      },
    ],
    explanation: {
      nl: 'Het bieden van een oplossing voor elke uitzondering leidt tot overmatige complexiteit. Ontwerpers houden rekening met uitzonderingen maar dekken ze niet allemaal af; in plaats daarvan ontwerpen ze regels om uitzonderingen af te handelen. Als een proces, product, service, actie of metric geen waarde toevoegt, elimineer het dan.',
      en: 'Providing a solution for every exception leads to excessive complexity. Designers account for exceptions but do not cover them all; instead they design rules to handle exceptions. If a process, product, service, action or metric adds no value, eliminate it.',
    },
    source: 'Syllabus 4.2.7',
  },
  {
    id: 'itil5-q055',
    objective: '4.2.6',
    type: 'standard',
    bloom: 2,
    difficulty: 2,
    stem: {
      nl: 'Wat omvat de holistische benadering binnen het ITIL-waardesysteem?',
      en: 'What does the holistic approach within the ITIL Value System include?',
    },
    options: [
      {
        text: {
          nl: 'Rekening houden met alle vier dimensies, de volledige levenscyclus overzien, de positie in de toeleveringsketen kennen en PESTLE-factoren continu monitoren',
          en: 'Considering all four dimensions, overseeing the full lifecycle, knowing your position in the supply chain and continuously monitoring PESTLE factors',
        },
        correct: true,
      },
      {
        text: {
          nl: 'Elke afdeling laten optimaliseren binnen haar eigen verantwoordelijkheidsgebied',
          en: 'Letting each department optimize within its own area of responsibility',
        },
        rationale: {
          nl: 'Dit creëert juist silo’s. Holistisch werken betekent alle onderdelen van de organisatie integreren.',
          en: 'This creates silos. Working holistically means integrating all parts of the organization.',
        },
      },
      {
        text: {
          nl: 'Alleen die levenscyclusfasen beschouwen die de organisatie zelf beheerst',
          en: 'Considering only those lifecycle phases the organization itself controls',
        },
        rationale: {
          nl: 'Juist ook fasen buiten de eigen controle moeten worden begrepen en geobserveerd.',
          en: 'Phases outside your own control must also be understood and observed.',
        },
      },
      {
        text: {
          nl: 'De vier dimensies in volgorde van belangrijkheid rangschikken',
          en: 'Ranking the four dimensions in order of importance',
        },
        rationale: {
          nl: 'De dimensies zijn gezamenlijk cruciaal; ze worden niet gerangschikt.',
          en: 'The dimensions are jointly crucial; they are not ranked.',
        },
      },
    ],
    explanation: {
      nl: 'Geen enkel product, service, werkwijze, proces, team of leverancier staat op zichzelf. Een holistische aanpak betekent: alle onderdelen van de organisatie integreren, zorgen voor volledige transparantie van vraag tot eindresultaat, en de onderlinge afhankelijkheden en impact van veranderingen erkennen.',
      en: 'No product, service, practice, process, team or supplier stands alone. A holistic approach means integrating all parts of the organization, ensuring full transparency from demand to outcome, and recognizing interdependencies and the impact of changes.',
    },
    source: 'Syllabus 4.2.6',
  },

  /* --- 4.3 Governance -------------------------------------------------- */
  {
    id: 'itil5-q056',
    objective: '4.3.1',
    type: 'standard',
    bloom: 1,
    difficulty: 1,
    stem: {
      nl: 'Hoe definieert ITIL governance?',
      en: 'How does ITIL define governance?',
    },
    options: [
      {
        text: {
          nl: 'Het systeem waarmee een organisatie wordt geleid en beheerst',
          en: 'The system by which an organization is directed and controlled',
        },
        correct: true,
      },
      {
        text: {
          nl: 'Het geheel van processen waarmee dagelijkse operationele beslissingen worden genomen',
          en: 'The set of processes by which daily operational decisions are made',
        },
        rationale: {
          nl: 'Dat is uitvoering (management), niet governance. Governance gaat over kaders, keuzes en sturing.',
          en: 'That is execution (management), not governance. Governance concerns frameworks, choices and direction.',
        },
      },
      {
        text: {
          nl: 'Een systeem van regels en beleid om data-activa te managen',
          en: 'A system of rules and policies to manage data assets',
        },
        rationale: {
          nl: 'Dit is data governance, een specifieke toepassing binnen de dimensie informatie en technologie.',
          en: 'This is data governance, a specific application within the information and technology dimension.',
        },
      },
      {
        text: {
          nl: 'Het naleven van externe wet- en regelgeving',
          en: 'Complying with external laws and regulations',
        },
        rationale: {
          nl: 'Compliance is een verantwoordelijkheid van het bestuursorgaan, maar governance is breder dan naleving alleen.',
          en: 'Compliance is a responsibility of the governing body, but governance is broader than compliance alone.',
        },
      },
    ],
    explanation: {
      nl: 'Governance definieert hoe organisaties worden aangestuurd en beheerst, inclusief toezicht op digitale technologie. Het biedt richting (direction), toezicht (oversight) en verantwoording (accountability). Governance = kaders, keuzes en sturing; practices = manieren van werken om het uit te voeren.',
      en: 'Governance defines how organizations are directed and controlled, including oversight of digital technology. It provides direction, oversight and accountability. Governance = frameworks, choices and direction; practices = ways of working to execute it.',
    },
    source: 'Syllabus 4.3.1',
  },
  {
    id: 'itil5-q057',
    objective: '4.3.2',
    type: 'standard',
    bloom: 2,
    difficulty: 2,
    stem: {
      nl: 'Door welke activiteiten wordt governance van digitale technologie gerealiseerd?',
      en: 'Through which activities is governance of digital technology realized?',
    },
    options: [
      {
        text: {
          nl: 'Belanghebbenden betrekken, evalueren, aansturen en monitoren',
          en: 'Engage stakeholders, evaluate, direct and monitor',
        },
        correct: true,
      },
      {
        text: {
          nl: 'Plannen, uitvoeren, controleren en bijsturen (PDCA)',
          en: 'Plan, do, check, act (PDCA)',
        },
        rationale: {
          nl: 'PDCA is een verbetercyclus die onder meer in ISO 27001 wordt gebruikt, niet de ITIL-governanceactiviteiten.',
          en: 'PDCA is an improvement cycle used in ISO 27001 among others, not the ITIL governance activities.',
        },
      },
      {
        text: {
          nl: 'Ontdekken, ontwerpen, bouwen en leveren',
          en: 'Discover, design, build and deliver',
        },
        rationale: {
          nl: 'Dit zijn vier van de acht levenscyclusactiviteiten, geen governanceactiviteiten.',
          en: 'These are four of the eight lifecycle activities, not governance activities.',
        },
      },
      {
        text: {
          nl: 'Identificeren, analyseren, verbeteren en borgen',
          en: 'Identify, analyse, improve and embed',
        },
        rationale: {
          nl: 'Dit lijkt op waardestroom-analyse maar is geen erkende governance-activiteitenset.',
          en: 'This resembles value stream mapping but is not a recognized set of governance activities.',
        },
      },
    ],
    explanation: {
      nl: 'Het bestuursorgaan betrekt belanghebbenden om behoeften in kaart te brengen, evalueert de huidige staat van de organisatie, stuurt aan door beleid en strategieën vast te stellen, en monitort prestaties en naleving. Het hoogste bestuursorgaan blijft altijd eindverantwoordelijk (accountable), ook wanneer bevoegdheden zijn gedelegeerd.',
      en: 'The governing body engages stakeholders to map needs, evaluates the organization’s current state, directs by setting policies and strategies, and monitors performance and compliance. The highest governing body always remains accountable, even when authority is delegated.',
    },
    source: 'Syllabus 4.3.2',
  },

  /* --- 4.4 Waardeketen en definities ---------------------------------- */
  {
    id: 'itil5-q058',
    objective: '4.4.10',
    type: 'standard',
    bloom: 2,
    difficulty: 2,
    stem: {
      nl: 'Een team heeft de oorzaak van een terugkerende storing geanalyseerd en gedocumenteerd, maar nog geen permanente oplossing doorgevoerd. Hoe wordt dit aangeduid?',
      en: 'A team has analysed and documented the cause of a recurring failure but has not yet implemented a permanent fix. What is this called?',
    },
    options: [
      { text: { nl: 'Een bekende fout (known error)', en: 'A known error' }, correct: true },
      {
        text: { nl: 'Een incident', en: 'An incident' },
        rationale: {
          nl: 'Een incident is een ongeplande onderbreking of kwaliteitsvermindering van een service — het zichtbare symptoom, niet de geanalyseerde oorzaak.',
          en: 'An incident is an unplanned interruption or reduction in quality of a service — the visible symptom, not the analysed cause.',
        },
      },
      {
        text: { nl: 'Een probleem', en: 'A problem' },
        rationale: {
          nl: 'Een probleem is een oorzaak of mogelijke oorzaak van incidenten. Zodra het is geanalyseerd maar nog niet opgelost, heet het een bekende fout.',
          en: 'A problem is a cause or potential cause of incidents. Once analysed but not yet resolved, it is called a known error.',
        },
      },
      {
        text: { nl: 'Een event', en: 'An event' },
        rationale: {
          nl: 'Een event is elke statuswijziging die van belang is voor het management van een service of configuratie-item.',
          en: 'An event is any change of state significant for the management of a service or configuration item.',
        },
      },
    ],
    explanation: {
      nl: 'De keten: een fout (error) is een gebrek of kwetsbaarheid die incidenten kan veroorzaken. Een probleem is een oorzaak, of mogelijke oorzaak, van een of meer incidenten. Een bekende fout is een probleem dat is geanalyseerd, maar nog niet is opgelost. Een incident is een ongeplande onderbreking of vermindering van de kwaliteit van een service.',
      en: 'The chain: an error is a flaw or vulnerability that may cause incidents. A problem is a cause, or potential cause, of one or more incidents. A known error is a problem that has been analysed but not yet resolved. An incident is an unplanned interruption or reduction in the quality of a service.',
    },
    source: 'Syllabus 4.4.8, 4.4.10',
  },
  {
    id: 'itil5-q059',
    objective: '4.4.3',
    type: 'standard',
    bloom: 1,
    difficulty: 2,
    stem: {
      nl: 'Wat is het verschil tussen een event en een incident?',
      en: 'What is the difference between an event and an incident?',
    },
    options: [
      {
        text: {
          nl: 'Een event is elke statuswijziging die van belang is voor het management van een service of configuratie-item; een incident is een ongeplande onderbreking of kwaliteitsvermindering van een service',
          en: 'An event is any change of state significant for the management of a service or configuration item; an incident is an unplanned interruption or reduction in the quality of a service',
        },
        correct: true,
      },
      {
        text: {
          nl: 'Een event is altijd negatief; een incident is altijd positief',
          en: 'An event is always negative; an incident is always positive',
        },
        rationale: {
          nl: 'Events zijn neutraal: ze signaleren een statuswijziging, die zowel routinematig als zorgwekkend kan zijn.',
          en: 'Events are neutral: they signal a change of state, which can be routine or concerning.',
        },
      },
      {
        text: {
          nl: 'Een event wordt door gebruikers gemeld; een incident wordt automatisch gedetecteerd',
          en: 'An event is reported by users; an incident is detected automatically',
        },
        rationale: {
          nl: 'De meldingsroute bepaalt het onderscheid niet. Beide kunnen automatisch of handmatig worden gesignaleerd.',
          en: 'The reporting route does not determine the distinction. Both can be detected automatically or manually.',
        },
      },
      {
        text: {
          nl: 'Een event is een geplande onderbreking; een incident is een ongeplande onderbreking',
          en: 'An event is a planned interruption; an incident is an unplanned interruption',
        },
        rationale: {
          nl: 'Een event is geen onderbreking maar een statuswijziging. Dit is een veelvoorkomende verwarring.',
          en: 'An event is not an interruption but a change of state. This is a common confusion.',
        },
      },
    ],
    explanation: {
      nl: 'Het begrijpen van dit verschil helpt operationele teams weten wanneer ze moeten monitoren en wanneer ze moeten ingrijpen. Events horen bij de activiteit ‘beheren’ (monitoring en eventmanagement); incidenten leiden tot de activiteit ‘ondersteunen’.',
      en: 'Understanding this difference helps operational teams know when to monitor and when to intervene. Events belong to the ‘operate’ activity (monitoring and event management); incidents lead to the ‘support’ activity.',
    },
    source: 'Syllabus 4.4.3',
  },
  {
    id: 'itil5-q060',
    objective: '4.4.5',
    type: 'standard',
    bloom: 1,
    difficulty: 3,
    stem: {
      nl: 'Wat is het verschil tussen continuous delivery en continuous deployment?',
      en: 'What is the difference between continuous delivery and continuous deployment?',
    },
    options: [
      {
        text: {
          nl: 'Bij continuous delivery is de software klaar voor productie maar wordt de uitrol handmatig besloten; bij continuous deployment wordt elke wijziging die de tests doorstaat automatisch uitgerold zonder verdere autorisatie',
          en: 'With continuous delivery the software is production-ready but deployment is decided manually; with continuous deployment every change passing the tests is deployed automatically without further authorization',
        },
        correct: true,
      },
      {
        text: {
          nl: 'Continuous delivery geldt voor infrastructuur, continuous deployment voor applicaties',
          en: 'Continuous delivery applies to infrastructure, continuous deployment to applications',
        },
        rationale: {
          nl: 'Het onderscheid gaat over het al dan niet automatisch uitrollen, niet over het type component.',
          en: 'The distinction concerns whether deployment is automatic, not the type of component.',
        },
      },
      {
        text: {
          nl: 'Continuous deployment gaat vooraf aan continuous delivery',
          en: 'Continuous deployment precedes continuous delivery',
        },
        rationale: {
          nl: 'Precies andersom: continuous deployment is gebaseerd op continuous delivery.',
          en: 'It is the other way round: continuous deployment builds on continuous delivery.',
        },
      },
      {
        text: {
          nl: 'Beide termen betekenen hetzelfde en worden door elkaar gebruikt',
          en: 'Both terms mean the same thing and are used interchangeably',
        },
        rationale: {
          nl: 'ITIL definieert ze expliciet als twee verschillende begrippen.',
          en: 'ITIL explicitly defines them as two distinct concepts.',
        },
      },
    ],
    explanation: {
      nl: 'Ezelsbrug: delivery = klaar voor productie, mens beslist. Deployment = automatisch naar productie, geen mens nodig. Continuous deployment is gebaseerd op continuous delivery. Continuous integration is weer iets anders: ontwikkelaars voegen hun codeaanpassingen regelmatig samen in een centrale repository, waarna geautomatiseerde builds en tests draaien.',
      en: 'Memory aid: delivery = production-ready, a human decides. Deployment = automatically to production, no human needed. Continuous deployment builds on continuous delivery. Continuous integration is different again: developers regularly merge code changes into a central repository, after which automated builds and tests run.',
    },
    source: 'Syllabus 4.4.5',
  },
  {
    id: 'itil5-q061',
    objective: '4.4.6',
    type: 'standard',
    bloom: 1,
    difficulty: 2,
    stem: {
      nl: 'Wat is observeerbaarheid (observability)?',
      en: 'What is observability?',
    },
    options: [
      {
        text: {
          nl: 'Het vermogen om de interne toestand van een complex systeem te begrijpen door de externe output ervan te analyseren, zoals metrics, logboeken en traces',
          en: 'The ability to understand the internal state of a complex system by analysing its external outputs, such as metrics, logs and traces',
        },
        correct: true,
      },
      {
        text: {
          nl: 'Het vermogen van een product om gedurende een bepaalde tijd naar behoren te functioneren',
          en: 'The ability of a product to function as required for a given period of time',
        },
        rationale: {
          nl: 'Dit is betrouwbaarheid (reliability).',
          en: 'This is reliability.',
        },
      },
      {
        text: {
          nl: 'Een discipline die software-engineering toepast op infrastructuur- en operationele problemen',
          en: 'A discipline applying software engineering to infrastructure and operational problems',
        },
        rationale: {
          nl: 'Dit is Site Reliability Engineering (SRE).',
          en: 'This is Site Reliability Engineering (SRE).',
        },
      },
      {
        text: {
          nl: 'De mate waarin aspecten van de aanbieder zichtbaar zijn voor de consument',
          en: 'The degree to which aspects of the provider are visible to the consumer',
        },
        rationale: {
          nl: 'Dit is de band van zichtbaarheid (band of visibility) uit het hoofdstuk over servicerelaties.',
          en: 'This is the band of visibility from the service relationships chapter.',
        },
      },
    ],
    explanation: {
      nl: 'Om betrouwbaarheid te versterken maakt operationeel beheer gebruik van SRE en observeerbaarheid. SRE past software-engineering toe op infrastructuur- en operationele problemen, gericht op beschikbaarheid, prestaties en betrouwbaarheid, met sterke nadruk op automatisering. De drie pijlers van observeerbaarheid zijn metrics, logs en traces.',
      en: 'To strengthen reliability, operations uses SRE and observability. SRE applies software engineering to infrastructure and operational problems, targeting availability, performance and reliability with a strong emphasis on automation. The three pillars of observability are metrics, logs and traces.',
    },
    source: 'Syllabus 4.4.6',
  },
  {
    id: 'itil5-q062',
    objective: '4.4.9',
    type: 'standard',
    bloom: 1,
    difficulty: 2,
    stem: {
      nl: 'Wat is een operationeel model (operating model)?',
      en: 'What is an operating model?',
    },
    options: [
      {
        text: {
          nl: 'Een conceptuele en/of visuele weergave van hoe een organisatie samen met klanten en stakeholders waarde creëert, en hoe de organisatie functioneert',
          en: 'A conceptual and/or visual representation of how an organization creates value together with customers and stakeholders, and how the organization operates',
        },
        correct: true,
      },
      {
        text: {
          nl: 'Een geheel van activiteiten dat waarde creëert door het leveren van een product of service',
          en: 'A set of activities that creates value by delivering a product or service',
        },
        rationale: {
          nl: 'Dit is de definitie van de waardeketen (value chain), het centrale onderdeel van het waardesysteem.',
          en: 'This is the definition of the value chain, the central component of the value system.',
        },
      },
      {
        text: {
          nl: 'Wat een organisatie doet voor haar klanten en andere stakeholders en waarom',
          en: 'What an organization does for its customers and other stakeholders, and why',
        },
        rationale: {
          nl: 'Dit is het doel (purpose) van de organisatie. Het doel bepaalt de intentie; het operationeel model brengt die intentie tot leven.',
          en: 'This is the organization’s purpose. Purpose defines intent; the operating model brings that intent to life.',
        },
      },
      {
        text: {
          nl: 'Een reeks stappen die een organisatie gebruikt om producten en services te leveren aan een consument',
          en: 'A series of steps an organization uses to create and deliver products and services to a consumer',
        },
        rationale: {
          nl: 'Dit is de definitie van een waardestroom (value stream).',
          en: 'This is the definition of a value stream.',
        },
      },
    ],
    explanation: {
      nl: 'Het doel van een organisatie bepaalt haar intentie, maar het zijn het operationele model, de waardeketen en de werkwijzen die die intentie tot leven brengen. ITIL structureert het bedrijfsmodel rond de vier dimensies: waardestromen en processen, organisaties en mensen, informatie en technologie, partners en leveranciers.',
      en: 'An organization’s purpose defines its intent, but the operating model, value chain and practices bring that intent to life. ITIL structures the operating model around the four dimensions: value streams and processes, organizations and people, information and technology, partners and suppliers.',
    },
    source: 'Syllabus 4.4.9, 4.4.12',
  },
  {
    id: 'itil5-q063',
    objective: '4.4.2',
    type: 'standard',
    bloom: 1,
    difficulty: 2,
    stem: {
      nl: 'Wat is een productprototype?',
      en: 'What is a product prototype?',
    },
    options: [
      {
        text: {
          nl: 'Een eerste versie van een product die de basisvorm, functionaliteit en operationele mogelijkheden demonstreert en wordt gebruikt om ontwerp en hypotheses te toetsen',
          en: 'An early version of a product demonstrating basic form, functionality and operational capability, used to test design and hypotheses',
        },
        correct: true,
      },
      {
        text: {
          nl: 'Een gedetailleerde beschrijving van de cruciale aspecten, vereisten en kenmerken van een te ontwikkelen product',
          en: 'A detailed description of the crucial aspects, requirements and characteristics of a product to be developed',
        },
        rationale: {
          nl: 'Dit is de productspecificatie. Specificatie beschrijft; prototype demonstreert.',
          en: 'This is the product specification. A specification describes; a prototype demonstrates.',
        },
      },
      {
        text: {
          nl: 'Een versie van een product die beschikbaar wordt gesteld voor gebruik',
          en: 'A version of a product that is made available for use',
        },
        rationale: {
          nl: 'Dit is een release, een begrip uit de transitie-activiteit.',
          en: 'This is a release, a term from the transition activity.',
        },
      },
      {
        text: {
          nl: 'Een testomgeving waarin wijzigingen worden gevalideerd voordat ze naar productie gaan',
          en: 'A test environment in which changes are validated before going to production',
        },
        rationale: {
          nl: 'Dit beschrijft een omgeving, niet een productversie.',
          en: 'This describes an environment, not a product version.',
        },
      },
    ],
    explanation: {
      nl: 'Beide begrippen horen bij de activiteit ‘ontwerpen’. De productspecificatie bevat beschrijvingen van producteigenschappen, functionaliteiten, technische vereisten, prestatiecriteria en gebruikersinterface-details. Prototypes variëren in complexiteit, van visuele mockups tot volledig functionele modellen.',
      en: 'Both terms belong to the ‘design’ activity. The product specification contains descriptions of product features, functionality, technical requirements, performance criteria and user interface details. Prototypes vary in complexity, from visual mockups to fully functional models.',
    },
    source: 'Syllabus 4.4.2',
  },
  {
    id: 'itil5-q064',
    objective: '4.4.7',
    type: 'standard',
    bloom: 1,
    difficulty: 1,
    stem: {
      nl: 'Wat is een serviceaanvraag (service request)?',
      en: 'What is a service request?',
    },
    options: [
      {
        text: {
          nl: 'Een verzoek van een gebruiker of gemachtigde vertegenwoordiger dat leidt tot een serviceactie die volgens de overeenkomst onderdeel is van de standaard serviceverlening',
          en: 'A request from a user or authorized representative that initiates a service action agreed as a normal part of service delivery',
        },
        correct: true,
      },
      {
        text: {
          nl: 'Een melding van een ongeplande onderbreking van een service',
          en: 'A report of an unplanned interruption to a service',
        },
        rationale: {
          nl: 'Dat is een incident. Het onderscheid is essentieel: een serviceaanvraag is normaal en gepland, een incident is een verstoring.',
          en: 'That is an incident. The distinction is essential: a service request is normal and planned, an incident is a disruption.',
        },
      },
      {
        text: {
          nl: 'Een verzoek tot het toevoegen, wijzigen of verwijderen van iets met effect op producten en services',
          en: 'A request to add, modify or remove anything that could affect products and services',
        },
        rationale: {
          nl: 'Dat is een change. Changes lopen via change enablement, serviceaanvragen via service request management.',
          en: 'That is a change. Changes go through change enablement, service requests through service request management.',
        },
      },
      {
        text: {
          nl: 'Een offerteaanvraag aan een leverancier voor nieuwe middelen',
          en: 'A quotation request to a supplier for new resources',
        },
        rationale: {
          nl: 'Dit hoort bij de activiteit ‘verwerven’ (acquire) en bij leveranciersmanagement.',
          en: 'This belongs to the ‘acquire’ activity and supplier management.',
        },
      },
    ],
    explanation: {
      nl: 'Serviceaanvragen horen bij de activiteit ‘leveren’ (deliver). SLA’s definiëren de normen voor levering en serviceaanvragen, en beschrijven hoe gebruikers die services activeren. Kernpunt: een serviceaanvraag is onderdeel van de normale, overeengekomen serviceverlening — er is niets kapot.',
      en: 'Service requests belong to the ‘deliver’ activity. SLAs define the standards for delivery and service requests, and describe how users trigger those services. Key point: a service request is part of normal, agreed service delivery — nothing is broken.',
    },
    source: 'Syllabus 4.4.7',
  },
  {
    id: 'itil5-q065',
    objective: '4.4.11',
    type: 'standard',
    bloom: 2,
    difficulty: 3,
    stem: {
      nl: 'Welke succesindicator hoort bij de levenscyclusactiviteit ‘transitie’?',
      en: "Which success metric belongs to the 'transition' lifecycle activity?",
    },
    options: [
      {
        text: {
          nl: 'Negatieve impact van de overgang op de beschikbaarheid en prestaties van de service',
          en: 'Negative impact of the transition on service availability and performance',
        },
        correct: true,
      },
      {
        text: {
          nl: 'Marktrelevantie van de producten en services',
          en: 'Market relevance of the products and services',
        },
        rationale: {
          nl: 'Dit is een succesindicator van ‘ontdekken’ (discover), samen met strategische relevantie en commercieel succes.',
          en: 'This is a success metric of ‘discover’, alongside strategic relevance and commercial success.',
        },
      },
      {
        text: {
          nl: 'Snelheid van het herstel van de normale serviceverlening',
          en: 'Speed of restoring normal service delivery',
        },
        rationale: {
          nl: 'Dit is een succesindicator van ‘ondersteunen’ (support).',
          en: 'This is a success metric of ‘support’.',
        },
      },
      {
        text: {
          nl: 'Kwaliteit van de productspecificaties en -prototypes',
          en: 'Quality of the product specifications and prototypes',
        },
        rationale: {
          nl: 'Dit is een succesindicator van ‘ontwerpen’ (design).',
          en: 'This is a success metric of ‘design’.',
        },
      },
    ],
    explanation: {
      nl: 'Succesindicatoren van transitie zijn onder meer: de overgangscyclus (tijdlijn en duur), de negatieve impact op beschikbaarheid en prestaties, het aantal en de impact van fouten bij of als gevolg van transities, naleving van de productroadmap, en tevredenheid van stakeholders. Vrijwel elke activiteit kent daarnaast een tevredenheids- en een nalevingsmetric.',
      en: 'Transition success metrics include: the transition cycle (timeline and duration), negative impact on availability and performance, the number and impact of errors during or resulting from transitions, adherence to the product roadmap, and stakeholder satisfaction. Nearly every activity also has a satisfaction and a compliance metric.',
    },
    source: 'Syllabus 4.4.11',
  },

  /* --- 4.5 Managementwerkwijzen --------------------------------------- */
  {
    id: 'itil5-q066',
    objective: '4.5.2',
    type: 'standard',
    bloom: 1,
    difficulty: 2,
    stem: {
      nl: 'In welke twee groepen verdeelt ITIL de 34 managementwerkwijzen?',
      en: 'Into which two groups does ITIL divide the 34 management practices?',
    },
    options: [
      {
        text: {
          nl: 'Algemene managementwerkwijzen en product- en servicemanagementwerkwijzen',
          en: 'General management practices and product and service management practices',
        },
        correct: true,
      },
      {
        text: {
          nl: 'Enabling werkwijzen en supporting werkwijzen',
          en: 'Enabling practices and supporting practices',
        },
        rationale: {
          nl: 'Dit is de indeling naar betrokkenheid bij een specifieke waardeketenactiviteit, niet de indeling van de werkwijzen zelf. Dezelfde werkwijze kan bij de ene activiteit enabling zijn en bij de andere supporting.',
          en: 'This classifies involvement in a specific value chain activity, not the practices themselves. The same practice can be enabling for one activity and supporting for another.',
        },
      },
      {
        text: {
          nl: 'Technische werkwijzen en organisatorische werkwijzen',
          en: 'Technical practices and organizational practices',
        },
        rationale: {
          nl: 'Deze indeling bestaat niet binnen ITIL.',
          en: 'This grouping does not exist within ITIL.',
        },
      },
      {
        text: {
          nl: 'Verplichte werkwijzen en optionele werkwijzen',
          en: 'Mandatory practices and optional practices',
        },
        rationale: {
          nl: 'ITIL kent geen verplichte werkwijzen; organisaties ontwikkelen het vermogen dat past bij hun operationele model.',
          en: 'ITIL has no mandatory practices; organizations develop the capabilities that fit their operating model.',
        },
      },
    ],
    explanation: {
      nl: 'ITIL omvat 34 managementwerkwijzen: 22 product- en servicemanagementwerkwijzen (zoals incidentmanagement, change enablement en servicedesk) en 12 algemene managementwerkwijzen (zoals risicomanagement, portfoliomanagement en voortdurend verbeteren). De algemene werkwijzen zijn breder toepasbaar dan alleen IT.',
      en: 'ITIL includes 34 management practices: 22 product and service management practices (such as incident management, change enablement and service desk) and 12 general management practices (such as risk management, portfolio management and continual improvement). The general practices apply more broadly than IT alone.',
    },
    source: 'Syllabus 4.5.2',
  },
  {
    id: 'itil5-q067',
    objective: '4.5.1',
    type: 'standard',
    bloom: 1,
    difficulty: 1,
    stem: {
      nl: 'Wat is een managementwerkwijze (management practice)?',
      en: 'What is a management practice?',
    },
    options: [
      {
        text: {
          nl: 'Een geheel van organisatorische middelen en vermogen (capabilities), ontworpen en ingezet voor het uitvoeren van werk of het bereiken van een doelstelling',
          en: 'A set of organizational resources and capabilities designed and deployed for performing work or accomplishing an objective',
        },
        correct: true,
      },
      {
        text: {
          nl: 'Een geheel van onderling verbonden activiteiten die input omzetten in output',
          en: 'A set of interrelated or interacting activities that transform inputs into outputs',
        },
        rationale: {
          nl: 'Dit is de definitie van een proces. Elke managementwerkwijze omvat meerdere processen.',
          en: 'This is the definition of a process. Each management practice includes multiple processes.',
        },
      },
      {
        text: {
          nl: 'Een reeks stappen die een organisatie gebruikt om waarde te leveren aan een consument',
          en: 'A series of steps an organization uses to deliver value to a consumer',
        },
        rationale: {
          nl: 'Dit is een waardestroom (value stream).',
          en: 'This is a value stream.',
        },
      },
      {
        text: {
          nl: 'Een universele aanbeveling die beslissingen en acties in alle omstandigheden begeleidt',
          en: 'A universal recommendation guiding decisions and actions in all circumstances',
        },
        rationale: {
          nl: 'Dit is een leidend principe (guiding principle).',
          en: 'This is a guiding principle.',
        },
      },
    ],
    explanation: {
      nl: 'Let op het onderscheid tussen capability en practice: een capability beschrijft wat je als organisatie duurzaam kunt; een practice beschrijft hoe je iets organiseert en uitvoert. Werkwijzen combineren middelen uit de vier dimensies om managementvermogen te creëren.',
      en: 'Note the distinction between capability and practice: a capability describes what an organization can sustainably do; a practice describes how it organizes and performs it. Practices combine resources from the four dimensions to create management capability.',
    },
    source: 'Syllabus 4.5.1',
  },
  {
    id: 'itil5-q068',
    objective: '4.5.4',
    type: 'list',
    bloom: 2,
    difficulty: 2,
    stem: {
      nl: 'Welke twee onderdelen komen voor in de vaste structuur van elke ITIL Practice Guide?',
      en: 'Which two elements appear in the consistent structure of every ITIL Practice Guide?',
    },
    listItems: [
      {
        nl: 'Algemene informatie: doel, scope, kernbegrippen, succesfactoren en belangrijke metrics',
        en: 'General information: purpose, scope, key terms, success factors and key metrics',
      },
      {
        nl: 'Een verplichte implementatieplanning met vaste doorlooptijden',
        en: 'A mandatory implementation plan with fixed timelines',
      },
      {
        nl: 'Beoordeling en ontwikkeling van het vermogen, met volwassenheidsmodel en zelfevaluatie',
        en: 'Capability assessment and development, with a maturity model and self-assessment',
      },
      {
        nl: 'Een gecertificeerde lijst van goedgekeurde leveranciers',
        en: 'A certified list of approved suppliers',
      },
    ],
    options: [
      { text: { nl: '1 en 3', en: '1 and 3' }, correct: true },
      {
        text: { nl: '1 en 2', en: '1 and 2' },
        rationale: {
          nl: 'Statement 2 is onjuist: de guides bevatten aanbevelingen voor succesvolle toepassing, geen verplichte planning met vaste doorlooptijden.',
          en: 'Statement 2 is incorrect: the guides contain recommendations for success, not a mandatory plan with fixed timelines.',
        },
      },
      {
        text: { nl: '2 en 4', en: '2 and 4' },
        rationale: {
          nl: 'Beide statements zijn onjuist; ITIL schrijft geen leveranciers voor en legt geen doorlooptijden op.',
          en: 'Both statements are incorrect; ITIL neither prescribes suppliers nor imposes timelines.',
        },
      },
      {
        text: { nl: '3 en 4', en: '3 and 4' },
        rationale: {
          nl: 'Statement 4 is onjuist: er bestaat geen gecertificeerde leverancierslijst binnen de Practice Guides.',
          en: 'Statement 4 is incorrect: there is no certified supplier list within the Practice Guides.',
        },
      },
    ],
    explanation: {
      nl: 'Elke Practice Guide volgt dezelfde structuur: algemene informatie; waardestromen en processen; organisaties en mensen; informatie en technologie; partners en leveranciers; beoordeling en ontwikkeling van het vermogen; en aanbevelingen voor succesvolle toepassing. Voordelen: consistent, uitgebreid, praktisch en gekoppeld aan het volwassenheidsmodel.',
      en: 'Every Practice Guide follows the same structure: general information; value streams and processes; organizations and people; information and technology; partners and suppliers; capability assessment and development; and recommendations for success. Benefits: consistent, comprehensive, practical and linked to the maturity model.',
    },
    source: 'Syllabus 4.5.4, 4.5.5',
  },
  {
    id: 'itil5-q069',
    objective: '4.5.6',
    type: 'standard',
    bloom: 1,
    difficulty: 2,
    stem: {
      nl: 'Wat is een kritieke succesfactor (critical success factor, CSF)?',
      en: 'What is a critical success factor (CSF)?',
    },
    options: [
      {
        text: {
          nl: 'Een noodzakelijke voorwaarde die vervuld moet zijn om succes te bereiken',
          en: 'A necessary precondition that must be fulfilled to achieve success',
        },
        correct: true,
      },
      {
        text: {
          nl: 'Een meetwaarde die wordt gebruikt om iets te evalueren of te managen',
          en: 'A measurement used to evaluate or manage something',
        },
        rationale: {
          nl: 'Dit is de definitie van een metric. Een CSF is de voorwaarde; metrics en KPI’s maken meetbaar of eraan wordt voldaan.',
          en: 'This is the definition of a metric. A CSF is the condition; metrics and KPIs make it measurable whether it is met.',
        },
      },
      {
        text: {
          nl: 'Het doel van de organisatie zoals vastgelegd door het bestuursorgaan',
          en: 'The organization’s purpose as set by the governing body',
        },
        rationale: {
          nl: 'Het doel beschrijft wat een organisatie doet en waarom, niet welke voorwaarden voor succes gelden.',
          en: 'Purpose describes what an organization does and why, not which conditions are needed for success.',
        },
      },
      {
        text: {
          nl: 'Een risico dat moet worden gemitigeerd voordat een project kan starten',
          en: 'A risk that must be mitigated before a project can start',
        },
        rationale: {
          nl: 'Een risico is een mogelijke gebeurtenis die schade kan toebrengen; dat is iets anders dan een succesvoorwaarde.',
          en: 'A risk is a possible event that could cause harm; that differs from a success condition.',
        },
      },
    ],
    explanation: {
      nl: 'Bij het definiëren van de gewenste situatie in het model voor voortdurend verbeteren formuleer je verbeteringsdoelstellingen met CSF’s (de noodzakelijke voorwaarden) en KPI’s (de meetbare indicatoren), waar mogelijk SMART geformuleerd.',
      en: 'When defining the target state in the continual improvement model, you formulate improvement objectives with CSFs (the necessary conditions) and KPIs (the measurable indicators), formulated SMART where possible.',
    },
    source: 'Syllabus 4.5.6',
  },

  /* --- 4.6 Voortdurend verbeteren ------------------------------------- */
  {
    id: 'itil5-q070',
    objective: '4.6.1',
    type: 'standard',
    bloom: 1,
    difficulty: 2,
    stem: {
      nl: 'Wat is de eerste stap van het ITIL-model voor voortdurend verbeteren?',
      en: 'What is the first step of the ITIL Continual Improvement Model?',
    },
    options: [
      { text: { nl: 'Wat is de visie?', en: 'What is the vision?' }, correct: true },
      {
        text: { nl: 'Waar staan we nu?', en: 'Where are we now?' },
        rationale: {
          nl: 'Dit is de tweede stap. Zonder eerst de visie te bepalen, weet je niet waar je de huidige situatie tegen afzet.',
          en: 'This is the second step. Without first setting the vision, you have no reference to assess the current state against.',
        },
      },
      {
        text: { nl: 'Onderneem actie', en: 'Take action' },
        rationale: {
          nl: 'Dit is de vijfde stap, na visie, huidige situatie, gewenste situatie en planning.',
          en: 'This is the fifth step, after vision, current state, target state and planning.',
        },
      },
      {
        text: { nl: 'Waar willen we naartoe?', en: 'Where do we want to be?' },
        rationale: {
          nl: 'Dit is de derde stap, waarin je de gewenste situatie definieert met CSF’s en KPI’s.',
          en: 'This is the third step, defining the target state with CSFs and KPIs.',
        },
      },
    ],
    explanation: {
      nl: 'De zeven stappen: 1) Wat is de visie? 2) Waar staan we nu? 3) Waar willen we naartoe? 4) Hoe komen we daar? 5) Onderneem actie. 6) Zijn we op de goede weg? 7) Hoe zorgen we ervoor dat de verbeteringen relevant blijven? Verbeterinitiatieven beginnen altijd met afstemming op de organisatievisie en de verwachte waarde.',
      en: 'The seven steps: 1) What is the vision? 2) Where are we now? 3) Where do we want to be? 4) How do we get there? 5) Take action. 6) Did we get there? 7) How do we keep the momentum going? Improvement initiatives always start by aligning with the organizational vision and expected value.',
    },
    source: 'Syllabus 4.6.1',
  },
  {
    id: 'itil5-q071',
    objective: '4.6.2',
    type: 'standard',
    bloom: 2,
    difficulty: 2,
    stem: {
      nl: 'Waarom is de stap ‘Waar staan we nu?’ essentieel in het model voor voortdurend verbeteren?',
      en: "Why is the 'Where are we now?' step essential in the continual improvement model?",
    },
    options: [
      {
        text: {
          nl: 'Omdat de huidige situatie de basissituatie vormt waartegen voortgang wordt gemeten',
          en: 'Because the current state forms the baseline against which progress is measured',
        },
        correct: true,
      },
      {
        text: {
          nl: 'Omdat je pas na deze stap de visie kunt bepalen',
          en: 'Because only after this step can the vision be defined',
        },
        rationale: {
          nl: 'De visie wordt juist als eerste stap bepaald; de huidige situatie wordt daaraan afgemeten.',
          en: 'The vision is defined as the first step; the current state is assessed against it.',
        },
      },
      {
        text: {
          nl: 'Omdat deze stap verplicht is voor certificering',
          en: 'Because this step is required for certification',
        },
        rationale: {
          nl: 'Het ITIL-model is geen certificeringseis; het is een gestructureerde aanpak voor verbetering.',
          en: 'The ITIL model is not a certification requirement; it is a structured approach to improvement.',
        },
      },
      {
        text: {
          nl: 'Omdat je hiermee bepaalt welke leverancier de verbetering uitvoert',
          en: 'Because it determines which supplier will implement the improvement',
        },
        rationale: {
          nl: 'Leveranciersselectie maakt geen deel uit van deze stap.',
          en: 'Supplier selection is not part of this step.',
        },
      },
    ],
    explanation: {
      nl: 'In deze stap beoordeel je: bestaande producten en services inclusief de waarde die gebruikers eraan toekennen, de competenties en vaardigheden van medewerkers, de bestaande werkprocessen en procedures, de beschikbare technologische oplossingen, en feedback, ervaringen en cultuurindicatoren. Zonder basissituatie kun je vooruitgang niet aantonen.',
      en: 'In this step you assess: existing products and services including the value users attach to them, staff competencies and skills, existing workflows and procedures, available technological solutions, and feedback, experiences and cultural indicators. Without a baseline you cannot demonstrate progress.',
    },
    source: 'Syllabus 4.6.2',
  },
  {
    id: 'itil5-q072',
    objective: '4.6.3',
    type: 'standard',
    bloom: 2,
    difficulty: 2,
    stem: {
      nl: 'Wat moet er gebeuren wanneer de doelstellingen van een verbeterinitiatief NIET zijn behaald?',
      en: 'What should happen when the objectives of an improvement initiative have NOT been achieved?',
    },
    options: [
      {
        text: {
          nl: 'Belanghebbenden informeren over de redenen, de geleerde lessen analyseren, documenteren en delen, en verbeteringen voorstellen voor volgende iteraties',
          en: 'Inform stakeholders of the reasons, analyse, document and share lessons learned, and propose improvements for the next iterations',
        },
        correct: true,
      },
      {
        text: {
          nl: 'Het initiatief stopzetten en de verantwoordelijke aanwijzen',
          en: 'Stop the initiative and identify who was responsible',
        },
        rationale: {
          nl: 'ITIL is expliciet: beschouw afwijkingen als leermomenten, niet als redenen om iemand de schuld te geven.',
          en: 'ITIL is explicit: treat deviations as learning moments, not as reasons to blame someone.',
        },
      },
      {
        text: {
          nl: 'De doelstellingen achteraf bijstellen zodat ze wel gehaald lijken',
          en: 'Retroactively adjust the objectives so they appear to have been met',
        },
        rationale: {
          nl: 'Dit ondermijnt de betrouwbaarheid van meting en het lerend vermogen van de organisatie.',
          en: 'This undermines the reliability of measurement and the organization’s ability to learn.',
        },
      },
      {
        text: {
          nl: 'Direct doorgaan naar het volgende verbeterinitiatief',
          en: 'Move straight on to the next improvement initiative',
        },
        rationale: {
          nl: 'Zonder analyse en het delen van lessen herhaalt de organisatie dezelfde fouten.',
          en: 'Without analysis and sharing lessons, the organization repeats the same mistakes.',
        },
      },
    ],
    explanation: {
      nl: 'Dit hoort bij de laatste stap: ‘Hoe zorgen we ervoor dat de verbeteringen relevant blijven?’ Bij wél behaalde doelstellingen gebruik je verandermanagement en kennismanagement om verbeteringen te borgen. Dit sluit aan bij de veiligheidscultuur: realistisch zijn over mislukkingen en ze als leermomenten beschouwen.',
      en: 'This belongs to the final step: ‘How do we keep the momentum going?’ When objectives are met, you use change management and knowledge management to embed improvements. This aligns with the safety culture: being realistic about failures and treating them as learning moments.',
    },
    source: 'Syllabus 4.6.2, 4.6.3',
  },
  {
    id: 'itil5-q073',
    objective: '4.5.3',
    type: 'standard',
    bloom: 2,
    difficulty: 2,
    stem: {
      nl: 'Wat is de rol van managementwerkwijzen binnen het ITIL-waardesysteem?',
      en: 'What is the role of management practices within the ITIL Value System?',
    },
    options: [
      {
        text: {
          nl: 'Zij maken de waardeketenactiviteiten mogelijk en ondersteunen deze, door middelen uit de vier dimensies te combineren tot managementvermogen',
          en: 'They enable and support the value chain activities by combining resources from the four dimensions into management capability',
        },
        correct: true,
      },
      {
        text: {
          nl: 'Zij vervangen de waardeketenactiviteiten in organisaties die volwassen genoeg zijn',
          en: 'They replace the value chain activities in organizations that are mature enough',
        },
        rationale: {
          nl: 'Werkwijzen vervangen niets; ze maken activiteiten mogelijk en ondersteunen ze.',
          en: 'Practices replace nothing; they enable and support activities.',
        },
      },
      {
        text: {
          nl: 'Zij bepalen de strategische richting van de organisatie',
          en: 'They set the strategic direction of the organization',
        },
        rationale: {
          nl: 'Richting geven is de rol van governance en het bestuursorgaan.',
          en: 'Setting direction is the role of governance and the governing body.',
        },
      },
      {
        text: {
          nl: 'Zij vormen de input van het waardesysteem',
          en: 'They form the input of the value system',
        },
        rationale: {
          nl: 'De input is kans en vraag; werkwijzen zijn een component van het systeem.',
          en: 'The input is opportunity and demand; practices are a component of the system.',
        },
      },
    ],
    explanation: {
      nl: 'Elke werkwijze draagt bij aan het managen van een specifiek aspect van digitale producten en services. Gezamenlijk stellen ze organisaties in staat producten en services effectief te managen gedurende hun gehele levenscyclus. Werkwijzen bieden de methoden en middelen die ervoor zorgen dat waardeketenactiviteiten goed verlopen.',
      en: 'Each practice contributes to managing a specific aspect of digital products and services. Together they enable organizations to manage products and services effectively across the entire lifecycle. Practices provide the methods and resources that make value chain activities work.',
    },
    source: 'Syllabus 4.5.3',
  },
  {
    id: 'itil5-q074',
    objective: '4.4.1',
    type: 'standard',
    bloom: 1,
    difficulty: 1,
    stem: {
      nl: 'Wat is de waardeketen (value chain)?',
      en: 'What is the value chain?',
    },
    options: [
      {
        text: {
          nl: 'Een geheel van activiteiten dat waarde creëert door het leveren van een product of service',
          en: 'A set of activities that creates value by delivering a product or service',
        },
        correct: true,
      },
      {
        text: {
          nl: 'De keten van leveranciers waarvan een organisatie afhankelijk is',
          en: 'The chain of suppliers an organization depends on',
        },
        rationale: {
          nl: 'Dit is de toeleveringsketen (supply chain), een ander begrip.',
          en: 'This is the supply chain, a different concept.',
        },
      },
      {
        text: {
          nl: 'De volgorde waarin managementwerkwijzen worden toegepast',
          en: 'The order in which management practices are applied',
        },
        rationale: {
          nl: 'Werkwijzen kennen geen vaste volgorde; ze maken activiteiten mogelijk.',
          en: 'Practices follow no fixed order; they enable activities.',
        },
      },
      {
        text: {
          nl: 'De daadwerkelijke opeenvolging van activiteiten zoals die worden uitgevoerd',
          en: 'The actual sequence of activities as they are performed',
        },
        rationale: {
          nl: 'Dit beschrijft een waardestroom (value stream): ‘zoals uitgevoerd’, tegenover de waardeketen ‘zoals ontworpen’.',
          en: 'This describes a value stream: ‘as performed’, versus the value chain ‘as designed’.',
        },
      },
    ],
    explanation: {
      nl: 'De waardeketen is het centrale onderdeel van het ITIL-waardesysteem: een reeks activiteiten op hoog niveau om de levenscyclus van digitale producten en services te managen en waarde te creëren. Belangrijk onderscheid: waardeketen = zoals ontworpen; waardestroom = zoals daadwerkelijk uitgevoerd.',
      en: 'The value chain is the central component of the ITIL Value System: a set of high-level activities to manage the lifecycle of digital products and services and create value. Key distinction: value chain = as designed; value stream = as actually performed.',
    },
    source: 'Syllabus 4.4.1',
  },
  {
    id: 'itil5-q075',
    objective: '4.4.4',
    type: 'missing_word',
    bloom: 1,
    difficulty: 2,
    stem: {
      nl: 'Identificeer het ontbrekende woord in de volgende zin.\n\nEen [ ? ] is een versie van een product, service of ander configuratie-item, of een verzameling configuratie-items, die beschikbaar wordt gesteld voor gebruik.',
      en: 'Identify the missing word in the following sentence.\n\nA [ ? ] is a version of a product, service or other configuration item, or a collection of configuration items, that is made available for use.',
    },
    options: [
      { text: { nl: 'release', en: 'release' }, correct: true },
      {
        text: { nl: 'deployment', en: 'deployment' },
        rationale: {
          nl: 'Deployment is het verplaatsen van een servicecomponent naar een gecontroleerde omgeving.',
          en: 'Deployment is moving a service component into a controlled environment.',
        },
      },
      {
        text: { nl: 'change', en: 'change' },
        rationale: {
          nl: 'Een change is het toevoegen, wijzigen of verwijderen van alles wat effect kan hebben op producten en services.',
          en: 'A change is the addition, modification or removal of anything that could affect products and services.',
        },
      },
      {
        text: { nl: 'prototype', en: 'prototype' },
        rationale: {
          nl: 'Een prototype is een eerste versie die basisvorm en functionaliteit demonstreert, niet iets dat voor gebruik beschikbaar wordt gesteld.',
          en: 'A prototype is an early version demonstrating basic form and functionality, not something made available for use.',
        },
      },
    ],
    explanation: {
      nl: 'Release, change en deployment horen alle drie bij de activiteit ‘transitie’. Ezelsbrug: change = de beslissing/autorisatie, release = het pakket dat beschikbaar komt, deployment = de fysieke verplaatsing naar de omgeving.',
      en: 'Release, change and deployment all belong to the ‘transition’ activity. Memory aid: change = the decision/authorization, release = the package that becomes available, deployment = the physical move into the environment.',
    },
    source: 'Syllabus 4.4.4',
  },
];
