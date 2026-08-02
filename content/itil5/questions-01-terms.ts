import type { QuestionSeed } from '../types';

/**
 * ITIL Foundation (Version 5) — domein 1: Kernbegrippen en definities (30%).
 *
 * Zwaarste domein van het examen. De vragen zijn origineel geschreven op basis
 * van de assessment criteria uit de PeopleCert-syllabus; de afleiders zijn
 * bewust gekozen op veelgemaakte denkfouten (output/outcome, utility/warranty,
 * klant/gebruiker/sponsor, product/service).
 */

export const questions: QuestionSeed[] = [
  {
    id: 'itil5-q001',
    objective: '1.1.2',
    type: 'standard',
    bloom: 1,
    difficulty: 1,
    stem: {
      nl: 'Wat is de definitie van een service?',
      en: 'What is the definition of a service?',
    },
    options: [
      {
        text: {
          nl: 'Een manier om gezamenlijke waardecreatie mogelijk te maken door uitkomsten te faciliteren die klanten willen bereiken, zonder dat de klant specifieke kosten en risico’s hoeft te managen',
          en: 'A means of enabling value co-creation by facilitating outcomes that customers want to achieve, without the customer having to manage specific costs and risks',
        },
        correct: true,
      },
      {
        text: {
          nl: 'Een configuratie van de middelen van een organisatie, ontworpen om waarde te bieden aan een consument',
          en: "A configuration of an organization's resources designed to offer value for a consumer",
        },
        rationale: {
          nl: 'Dit is de definitie van een product, niet van een service. Een product biedt functionaliteit; een service maakt waarderealisatie mogelijk door gebruik.',
          en: 'This is the definition of a product, not a service. A product offers functionality; a service enables value realization through use.',
        },
      },
      {
        text: {
          nl: 'Een formele beschrijving van een of meer services die zijn ontworpen om te voldoen aan de behoeften van een specifieke consumentengroep',
          en: 'A formal description of one or more services designed to address the needs of a target consumer group',
        },
        rationale: {
          nl: 'Dit is de definitie van een serviceaanbod (service offering). Het aanbod beschrijft de potentiële waarde; de service is het middel zelf.',
          en: 'This is the definition of a service offering. The offering describes potential value; the service is the means itself.',
        },
      },
      {
        text: {
          nl: 'Een geheel van organisatorische middelen en vermogen, ontworpen voor het uitvoeren van werk of het bereiken van een doelstelling',
          en: 'A set of organizational resources and capabilities designed for performing work or accomplishing an objective',
        },
        rationale: {
          nl: 'Dit is de definitie van een managementwerkwijze (management practice).',
          en: 'This is the definition of a management practice.',
        },
      },
    ],
    explanation: {
      nl: 'Twee elementen maken deze definitie herkenbaar: waardeco-creatie en het overnemen van kosten en risico’s. Een serviceverlener neemt een deel van de kosten en risico’s over die de klant anders zelf zou moeten dragen. Precies dat onderscheidt een service van een los product.',
      en: 'Two elements make this definition recognizable: value co-creation and the transfer of costs and risks. A service provider takes on part of the costs and risks the customer would otherwise carry. That is exactly what distinguishes a service from a standalone product.',
    },
    source: 'Syllabus 1.1.2',
  },
  {
    id: 'itil5-q002',
    objective: '1.3.4',
    type: 'standard',
    bloom: 2,
    difficulty: 2,
    stem: {
      nl: 'Een IT-team levert een nieuwe selfserviceportal op. Zes weken later blijkt dat de servicedesk 30% minder telefoontjes krijgt. Wat is in dit voorbeeld de outcome?',
      en: 'An IT team delivers a new self-service portal. Six weeks later, the service desk receives 30% fewer calls. In this example, what is the outcome?',
    },
    options: [
      {
        text: {
          nl: 'De vermindering van 30% in telefoontjes naar de servicedesk',
          en: 'The 30% reduction in calls to the service desk',
        },
        correct: true,
      },
      {
        text: {
          nl: 'De opgeleverde selfserviceportal',
          en: 'The delivered self-service portal',
        },
        rationale: {
          nl: 'De portal is de output: het tastbare resultaat van de activiteit. De outcome is wat er door die output verandert voor een belanghebbende.',
          en: 'The portal is the output: the tangible deliverable of the activity. The outcome is what changes for a stakeholder because of that output.',
        },
      },
      {
        text: {
          nl: 'De documentatie en trainingsmaterialen bij de portal',
          en: 'The documentation and training materials accompanying the portal',
        },
        rationale: {
          nl: 'Ook dit zijn outputs — deliverables die door de activiteit zijn geproduceerd.',
          en: 'These are also outputs — deliverables produced by the activity.',
        },
      },
      {
        text: {
          nl: 'De zes weken doorlooptijd tussen oplevering en meting',
          en: 'The six-week period between delivery and measurement',
        },
        rationale: {
          nl: 'Dit is een tijdsaanduiding, geen resultaat voor een belanghebbende.',
          en: 'This is a time indication, not a result for a stakeholder.',
        },
      },
    ],
    explanation: {
      nl: 'Output is een tastbaar of niet-tastbaar op te leveren resultaat van een activiteit (de portal). Outcome is een resultaat voor een belanghebbende dat mogelijk wordt gemaakt door een of meer outputs (minder telefoontjes). Ezelsbrug: output is wat je oplevert, outcome is wat er verandert.',
      en: 'Output is a tangible or intangible deliverable of an activity (the portal). Outcome is a result for a stakeholder enabled by one or more outputs (fewer calls). Memory aid: output is what you deliver, outcome is what changes.',
    },
    source: 'Syllabus 1.3.3, 1.3.4',
  },
  {
    id: 'itil5-q003',
    objective: '1.1.7',
    type: 'standard',
    bloom: 1,
    difficulty: 2,
    stem: {
      nl: 'Welke uitspraak beschrijft garantie (warranty) correct?',
      en: 'Which statement correctly describes warranty?',
    },
    options: [
      {
        text: {
          nl: 'De zekerheid dat een product of service aan de overeengekomen eisen voldoet — ‘geschikt voor gebruik’',
          en: "The assurance that a product or service will meet agreed requirements — 'fit for use'",
        },
        correct: true,
      },
      {
        text: {
          nl: 'De functionaliteit die een product of service biedt — ‘geschikt voor het doel’',
          en: "The functionality offered by a product or service — 'fit for purpose'",
        },
        rationale: {
          nl: 'Dit is bruikbaarheid (utility): wát de service doet. Garantie gaat over hóe de service presteert.',
          en: 'This is utility: what the service does. Warranty concerns how the service performs.',
        },
      },
      {
        text: {
          nl: 'De som van functionele en emotionele interacties zoals ervaren door de gebruiker',
          en: 'The sum of functional and emotional interactions as perceived by the user',
        },
        rationale: {
          nl: 'Dit is de gebruikerservaring (user experience, UX).',
          en: 'This is user experience (UX).',
        },
      },
      {
        text: {
          nl: 'De garantie dat een product voldoet aan eisen op het gebied van rentmeesterschap van de omgeving, sociale vooruitgang en economische groei',
          en: 'The assurance that a product meets requirements for environmental stewardship, social progress and economic growth',
        },
        rationale: {
          nl: 'Dit is duurzaamheid (sustainability), in ITIL Version 5 een zelfstandige component van servicewaarde.',
          en: 'This is sustainability, in ITIL Version 5 a separate component of service value.',
        },
      },
    ],
    explanation: {
      nl: 'Garantie betreft aspecten als beschikbaarheid, capaciteit, beveiligingsniveau en continuïteit. In ITIL Version 5 geldt: servicewaarde = bruikbaarheid + garantie + duurzaamheid + ervaring. Utility = wat (fit for purpose), warranty = hoe (fit for use).',
      en: 'Warranty covers aspects such as availability, capacity, security levels and continuity. In ITIL Version 5: service value = utility + warranty + sustainability + experience. Utility = what (fit for purpose), warranty = how (fit for use).',
    },
    source: 'Syllabus 1.1.7, 1.4.11',
  },
  {
    id: 'itil5-q004',
    objective: '1.4.4',
    type: 'standard',
    bloom: 1,
    difficulty: 2,
    stem: {
      nl: 'Een CFO keurt het budget goed voor een nieuw samenwerkingsplatform. Welke rol vervult de CFO hiermee?',
      en: 'A CFO approves the budget for a new collaboration platform. Which role does the CFO fulfil?',
    },
    options: [
      { text: { nl: 'Sponsor', en: 'Sponsor' }, correct: true },
      {
        text: { nl: 'Klant (customer)', en: 'Customer' },
        rationale: {
          nl: 'De klant definieert de eisen en draagt verantwoordelijkheid voor de uitkomsten. Budget goedkeuren hoort bij de sponsor.',
          en: 'The customer defines requirements and is responsible for outcomes. Approving budget belongs to the sponsor.',
        },
      },
      {
        text: { nl: 'Gebruiker (user)', en: 'User' },
        rationale: {
          nl: 'De gebruiker maakt gebruik van de service. Overigens kan de CFO daarnaast óók gebruiker zijn — rollen kunnen samenvallen in één persoon.',
          en: 'The user uses the service. Note that the CFO may also be a user — roles can coincide in one person.',
        },
      },
      {
        text: { nl: 'Serviceprovider', en: 'Service provider' },
        rationale: {
          nl: 'De serviceprovider is een organisatie die verantwoordelijk is voor de levering en ondersteuning van services, geen rol aan de consumentenkant.',
          en: 'The service provider is an organization responsible for delivering and supporting services, not a role on the consumer side.',
        },
      },
    ],
    explanation: {
      nl: 'ITIL onderscheidt drie rollen aan de kant van de serviceconsument. Sponsor: keurt het budget goed. Klant: definieert de eisen en is verantwoordelijk voor de uitkomsten. Gebruiker: gebruikt de service. Deze rollen kunnen in één persoon samenvallen en kunnen tegenstrijdige verwachtingen hebben.',
      en: 'ITIL distinguishes three roles on the service consumer side. Sponsor: approves the budget. Customer: defines requirements and is accountable for outcomes. User: uses the service. These roles can coincide in one person and may hold conflicting expectations.',
    },
    source: 'Syllabus 1.4.4',
  },
  {
    id: 'itil5-q005',
    objective: '1.4.2',
    type: 'missing_word',
    bloom: 1,
    difficulty: 2,
    stem: {
      nl: 'Identificeer het ontbrekende woord in de volgende zin.\n\nEen [ ? ] servicerelatie richt zich typisch op innovatie en groei, betrekt het operationele, tactische én strategische niveau, en kent vaak contracten op maat of zelfs geen formele overeenkomst.',
      en: 'Identify the missing word in the following sentence.\n\nA [ ? ] service relationship typically focuses on innovation and growth, involves the operational, tactical and strategic levels, and often features tailored contracts or even no formal agreement.',
    },
    options: [
      {
        text: { nl: 'collaboratieve (samenwerkende)', en: 'collaborative' },
        correct: true,
      },
      {
        text: { nl: 'coöperatieve', en: 'cooperative' },
        rationale: {
          nl: 'Een coöperatieve relatie richt zich op verbetering en effectiviteit, op operationeel en tactisch niveau, met geavanceerde SLA’s.',
          en: 'A cooperative relationship focuses on improvement and effectiveness, at operational and tactical level, with advanced SLAs.',
        },
      },
      {
        text: { nl: 'basis', en: 'basic' },
        rationale: {
          nl: 'Een basisrelatie richt zich op ondersteuning en efficiëntie, uitsluitend op operationeel niveau, met standaardcontracten voor de massamarkt.',
          en: 'A basic relationship focuses on support and efficiency, purely at operational level, with standard mass-market contracts.',
        },
      },
      {
        text: { nl: 'commerciële', en: 'commercial' },
        rationale: {
          nl: 'ITIL kent geen relatietype ‘commercieel’. De drie typen zijn basis, coöperatief en collaboratief.',
          en: 'ITIL does not define a ‘commercial’ relationship type. The three types are basic, cooperative and collaborative.',
        },
      },
    ],
    explanation: {
      nl: 'ITIL onderscheidt drie typen servicerelaties. Basis: ondersteuning en efficiëntie, operationeel, standaard commodity-services. Coöperatief: verbetering en effectiviteit, operationeel en tactisch, geconfigureerde services. Collaboratief (partnerschap): innovatie en groei, alle drie de niveaus, services op maat met unieke waardeproposities. Hoe nauwer de relatie, hoe groter de band van zichtbaarheid.',
      en: 'ITIL distinguishes three types of service relationship. Basic: support and efficiency, operational, standard commodity services. Cooperative: improvement and effectiveness, operational and tactical, configured services. Collaborative (partnership): innovation and growth, all three levels, tailored services with unique value propositions. The closer the relationship, the wider the band of visibility.',
    },
    source: 'Syllabus 1.4.2, 1.4.10',
  },
  {
    id: 'itil5-q006',
    objective: '1.3.2',
    type: 'list',
    bloom: 2,
    difficulty: 3,
    stem: {
      nl: 'Welke twee uitspraken over kosten en risico’s in servicerelaties zijn CORRECT?',
      en: 'Which two statements about costs and risks in service relationships are CORRECT?',
    },
    listItems: [
      {
        nl: 'Kosten die door de service worden verlaagd of geëlimineerd, worden gedragen door de serviceverlener',
        en: 'Costs removed or reduced by the service are borne by the service provider',
      },
      {
        nl: 'Een service brengt nooit nieuwe risico’s met zich mee voor de serviceconsument',
        en: 'A service never introduces new risks for the service consumer',
      },
      {
        nl: 'Risico’s die worden opgelegd door het gebruik van de service, worden gedragen door de serviceconsument',
        en: 'Risks imposed by using the service are borne by the service consumer',
      },
      {
        nl: 'Waarde wordt uitsluitend bepaald door de serviceverlener',
        en: 'Value is determined solely by the service provider',
      },
    ],
    options: [
      { text: { nl: '1 en 3', en: '1 and 3' }, correct: true },
      {
        text: { nl: '1 en 2', en: '1 and 2' },
        rationale: {
          nl: 'Statement 2 is onjuist: services kunnen wel degelijk nieuwe kosten en risico’s introduceren. Een service is pas waardevol als de positieve effecten zwaarder wegen dan de negatieve.',
          en: 'Statement 2 is incorrect: services can absolutely introduce new costs and risks. A service is only valuable when positive effects outweigh negative ones.',
        },
      },
      {
        text: { nl: '2 en 4', en: '2 and 4' },
        rationale: {
          nl: 'Beide statements zijn onjuist. Waarde is bovendien subjectief en wordt bepaald door de behoeften van de serviceconsument.',
          en: 'Both statements are incorrect. Moreover, value is subjective and defined by the service consumer’s needs.',
        },
      },
      {
        text: { nl: '3 en 4', en: '3 and 4' },
        rationale: {
          nl: 'Statement 4 is onjuist: waarde is subjectief en wordt gevormd door de service-ervaring van de consument, niet eenzijdig bepaald door de aanbieder.',
          en: 'Statement 4 is incorrect: value is subjective and shaped by the consumer’s service experience, not unilaterally determined by the provider.',
        },
      },
    ],
    explanation: {
      nl: 'Er zijn twee soorten kosten en twee soorten risico’s. Verwijderd/verminderd door de service: gedragen door de serviceverlener — dat is de waardepropositie. Opgelegd door de service: gedragen door de serviceconsument. Services worden pas als waardevol beschouwd wanneer de positieve effecten zwaarder wegen dan de negatieve.',
      en: 'There are two kinds of costs and two kinds of risks. Removed or reduced by the service: borne by the provider — that is the value proposition. Imposed by the service: borne by the consumer. Services are considered valuable only when the positive effects outweigh the negative ones.',
    },
    source: 'Syllabus 1.3.2, 1.3.6',
  },
  {
    id: 'itil5-q007',
    objective: '1.4.1',
    type: 'standard',
    bloom: 2,
    difficulty: 2,
    stem: {
      nl: 'Een organisatie ontwikkelt standaard softwarepakketten met een eigen roadmap en verkoopt deze aan meerdere afnemers. Welke rol vervult deze organisatie in servicerelaties?',
      en: 'An organization develops standard software packages with its own roadmap and sells them to multiple customers. Which role does this organization fulfil in service relationships?',
    },
    options: [
      {
        text: {
          nl: 'Leverancier van digitale producten (digital product vendor)',
          en: 'Digital product vendor',
        },
        correct: true,
      },
      {
        text: { nl: 'Serviceprovider', en: 'Service provider' },
        rationale: {
          nl: 'De serviceprovider is verantwoordelijk voor de levering én ondersteuning van services. Hier ligt de nadruk op het creëren en verbeteren van het product zelf.',
          en: 'The service provider is responsible for delivering and supporting services. Here the emphasis is on creating and improving the product itself.',
        },
      },
      {
        text: { nl: 'Serviceconsument', en: 'Service consumer' },
        rationale: {
          nl: 'De serviceconsument is verantwoordelijk voor de inkoop en het gebruik van services — de tegenovergestelde kant van de relatie.',
          en: 'The service consumer is responsible for procuring and using services — the opposite side of the relationship.',
        },
      },
      {
        text: { nl: 'Service-integrator', en: 'Service integrator' },
        rationale: {
          nl: 'Een service-integrator brengt meerdere services en aanbieders samen tot één samenhangende serviceverlening voor de klant.',
          en: 'A service integrator brings multiple services and providers together into one coherent service for the customer.',
        },
      },
    ],
    explanation: {
      nl: 'Een leverancier van digitale producten is verantwoordelijk voor de creatie en voortdurende verbetering van digitale producten en het bijbehorende serviceaanbod. Kenmerkend zijn standaardproducten met een eigen roadmap en eigen voorwaarden. Organisaties vervullen vaak meerdere rollen tegelijk: consument voor de één, provider voor de ander.',
      en: 'A digital product vendor is responsible for creating and continually improving digital products and related service offerings. Typical traits are standard products with their own roadmap and terms. Organizations often fulfil several roles at once: consumer to one party, provider to another.',
    },
    source: 'Syllabus 1.4.1, 1.4.9',
  },
  {
    id: 'itil5-q008',
    objective: '1.2.2',
    type: 'standard',
    bloom: 1,
    difficulty: 1,
    stem: {
      nl: 'Een cloudprovider geeft klanten toegang tot rekencapaciteit die eigendom blijft van de provider. Welke vorm van service-interactie is dit?',
      en: 'A cloud provider gives customers access to compute capacity that remains owned by the provider. Which form of service interaction is this?',
    },
    options: [
      {
        text: { nl: 'Toegang tot middelen', en: 'Access to resources' },
        correct: true,
      },
      {
        text: { nl: 'Overdracht van goederen', en: 'Transfer of goods' },
        rationale: {
          nl: 'Bij overdracht van goederen gaat het eigendom over naar de consument. Bij digitale services is dit juist zeldzaam; providers minimaliseren dit bewust.',
          en: 'Transfer of goods means ownership passes to the consumer. In digital services this is rare; providers deliberately minimize it.',
        },
      },
      {
        text: { nl: 'Serviceactie', en: 'Service action' },
        rationale: {
          nl: 'Een serviceactie wordt uitgevoerd door de serviceverlener of samen met de consument, zoals het afhandelen van een serviceverzoek of een training.',
          en: 'A service action is performed by the provider or jointly with the consumer, such as handling a service request or delivering training.',
        },
      },
      {
        text: { nl: 'Waardeco-creatie', en: 'Value co-creation' },
        rationale: {
          nl: 'Waardeco-creatie is het overkoepelende resultaat van de servicerelatie, geen specifieke vorm van service-interactie.',
          en: 'Value co-creation is the overarching result of the service relationship, not a specific form of service interaction.',
        },
      },
    ],
    explanation: {
      nl: 'Een serviceaanbod kan drie dingen omvatten: overdracht van goederen (eigendom gaat over, zeldzaam bij digitale services), serviceacties (uitgevoerd door de provider of samen met de consument), en toegang tot middelen (de middelen blijven eigendom van de provider — denk aan hotelkamers, applicaties, platforms, netwerken en cloud-services).',
      en: 'A service offering can include three things: transfer of goods (ownership passes, rare in digital services), service actions (performed by the provider or jointly with the consumer), and access to resources (resources remain owned by the provider — think hotel rooms, applications, platforms, networks and cloud services).',
    },
    source: 'Syllabus 1.2.2, 1.2.4',
  },
  {
    id: 'itil5-q009',
    objective: '1.1.3',
    type: 'negative',
    bloom: 2,
    difficulty: 2,
    stem: {
      nl: 'Welke uitspraak over de relatie tussen digitale producten en digitale services is NIET juist?',
      en: 'Which statement about the relationship between digital products and digital services is NOT correct?',
    },
    options: [
      {
        text: {
          nl: 'Eén digitaal product kan altijd maar één digitale service mogelijk maken',
          en: 'One digital product can only ever enable one digital service',
        },
        correct: true,
      },
      {
        text: {
          nl: 'Digitale services zijn altijd gebaseerd op digitale producten',
          en: 'Digital services are always based on digital products',
        },
        rationale: {
          nl: 'Dit is juist: een digitale service is per definitie geheel of grotendeels afhankelijk van digitale producten.',
          en: 'This is correct: a digital service by definition depends wholly or largely on digital products.',
        },
      },
      {
        text: {
          nl: 'Producten bieden functionaliteiten; het serviceaanbod beschrijft de potentiële waarde',
          en: 'Products offer functionality; the service offering describes the potential value',
        },
        rationale: {
          nl: 'Dit is juist en vormt de kern van het onderscheid tussen product en service.',
          en: 'This is correct and forms the core of the product-versus-service distinction.',
        },
      },
      {
        text: {
          nl: 'Wanneer klanten het aanbod accepteren, begint de levering en het gebruik van de service',
          en: 'When customers accept the offering, delivery and use of the service begin',
        },
        rationale: {
          nl: 'Dit is juist: acceptatie van het serviceaanbod is het startpunt van de serviceverlening.',
          en: 'This is correct: acceptance of the service offering marks the start of service delivery.',
        },
      },
    ],
    explanation: {
      nl: 'De relatie tussen producten en services is veel-op-veel: één product kan meerdere services mogelijk maken, en één service kan op meerdere producten gebaseerd zijn. Let bij negatieve vragen goed op het woord NIET — je zoekt de uitspraak die onjuist is.',
      en: 'The relationship between products and services is many-to-many: one product can enable multiple services, and one service can be based on multiple products. With negative questions, watch the word NOT carefully — you are looking for the incorrect statement.',
    },
    source: 'Syllabus 1.1.3',
  },
  {
    id: 'itil5-q010',
    objective: '1.4.5',
    type: 'standard',
    bloom: 1,
    difficulty: 2,
    stem: {
      nl: 'Wat wordt in ITIL bedoeld met serviceniveau (service level)?',
      en: 'What does ITIL mean by service level?',
    },
    options: [
      {
        text: {
          nl: 'Een reeks meetwaarden (metrics) die de verwachte of behaalde servicekwaliteit definiëren',
          en: 'A set of metrics that define the expected or achieved quality of a service',
        },
        correct: true,
      },
      {
        text: {
          nl: 'Een gedocumenteerde overeenkomst tussen serviceverlener en klant over de geleverde services',
          en: 'A documented agreement between a service provider and a customer about the services delivered',
        },
        rationale: {
          nl: 'Dat is de Service Level Agreement (SLA). De SLA legt serviceniveaus vast; het serviceniveau zelf is de set meetwaarden.',
          en: 'That is the service level agreement (SLA). The SLA records service levels; the service level itself is the set of metrics.',
        },
      },
      {
        text: {
          nl: 'De som van de kenmerken van een service die relevant zijn voor het vermogen te voldoen aan gestelde behoeften',
          en: 'The sum of the characteristics of a service relevant to its ability to meet stated needs',
        },
        rationale: {
          nl: 'Dit is servicekwaliteit. Servicekwaliteit wordt gemanaged door verwachtingen om te zetten in meetwaarden — en die meetwaarden vormen het serviceniveau.',
          en: 'This is service quality. Service quality is managed by translating expectations into metrics — and those metrics form the service level.',
        },
      },
      {
        text: {
          nl: 'De mate waarin gebruikers tevreden zijn over hun interacties met de service',
          en: 'The degree to which users are satisfied with their interactions with the service',
        },
        rationale: {
          nl: 'Dit raakt aan gebruikerservaring (UX), een van de vier categorieën waarop servicekwaliteit wordt gemeten, maar niet aan de definitie van serviceniveau.',
          en: 'This touches on user experience (UX), one of the four categories on which service quality is measured, but not the definition of service level.',
        },
      },
    ],
    explanation: {
      nl: 'Servicekwaliteit wordt gemanaged door verwachtingen om te zetten in meetwaarden. Die meetwaarden definiëren het serviceniveau. ITIL onderscheidt vier categorieën servicelevel-metrics — bruikbaarheid, garantie, duurzaamheid en ervaring — die samen een evenwichtig beeld geven. Geen enkele categorie is belangrijker dan de andere.',
      en: 'Service quality is managed by translating expectations into metrics. Those metrics define the service level. ITIL distinguishes four categories of service level metrics — utility, warranty, sustainability and experience — which together give a balanced picture. No category is more important than the others.',
    },
    source: 'Syllabus 1.4.5, 1.4.6',
  },
  {
    id: 'itil5-q011',
    objective: '1.4.3',
    type: 'standard',
    bloom: 1,
    difficulty: 2,
    stem: {
      nl: 'Wat is kenmerkend voor de stappen in een servicetraject (service journey)?',
      en: 'What is characteristic of the steps in a service journey?',
    },
    options: [
      {
        text: {
          nl: 'Ze hoeven niet in een vaste volgorde plaats te vinden en kunnen zelfs gelijktijdig verlopen',
          en: 'They do not need to occur in a fixed order and can even take place simultaneously',
        },
        correct: true,
      },
      {
        text: {
          nl: 'Ze verlopen altijd strikt sequentieel van verkennen tot reflecteren',
          en: 'They always proceed strictly sequentially from explore to reflect',
        },
        rationale: {
          nl: 'Een vaste volgorde is juist niet vereist. Dit is een klassieke afleider: ITIL benadrukt consequent flexibiliteit boven lineariteit.',
          en: 'A fixed order is explicitly not required. This is a classic distractor: ITIL consistently emphasizes flexibility over linearity.',
        },
      },
      {
        text: {
          nl: 'Ze worden uitsluitend uitgevoerd door de serviceverlener',
          en: 'They are performed exclusively by the service provider',
        },
        rationale: {
          nl: 'Het servicetraject omvat activiteiten en interacties van álle betrokken organisaties, dus ook van de serviceconsument.',
          en: 'The service journey covers activities and interactions of all organizations involved, including the service consumer.',
        },
      },
      {
        text: {
          nl: 'Ze zijn identiek voor elke servicerelatie, ongeacht het type',
          en: 'They are identical for every service relationship, regardless of type',
        },
        rationale: {
          nl: 'De invulling verschilt sterk per relatietype; onder meer de band van zichtbaarheid hangt af van hoe nauw de relatie is.',
          en: 'The way steps play out differs markedly per relationship type; the band of visibility, for one, depends on how close the relationship is.',
        },
      },
    ],
    explanation: {
      nl: 'Het servicetraject is de som van alle activiteiten en interacties van organisaties in servicerelaties. De stappen zijn: verkennen (explore), betrekken (engage), aanbieden (offer), overeenkomst bereiken (agree), onboarden (onboard), co-creëren (co-create) en reflecteren (reflect). Ze kennen geen vaste volgorde.',
      en: 'The service journey is the sum of all activities and interactions of organizations in service relationships. The steps are: explore, engage, offer, agree, onboard, co-create and reflect. They follow no fixed order.',
    },
    source: 'Syllabus 1.4.3',
  },
  {
    id: 'itil5-q012',
    objective: '1.3.1',
    type: 'standard',
    bloom: 1,
    difficulty: 1,
    stem: {
      nl: 'Hoe definieert ITIL waarde (value)?',
      en: 'How does ITIL define value?',
    },
    options: [
      {
        text: {
          nl: 'De waargenomen voordelen, bruikbaarheid en het belang van iets',
          en: 'The perceived benefits, usefulness and importance of something',
        },
        correct: true,
      },
      {
        text: {
          nl: 'De totale kosten die een organisatie bespaart door een service af te nemen',
          en: 'The total costs an organization saves by consuming a service',
        },
        rationale: {
          nl: 'Kostenbesparing kan een onderdeel van waarde zijn, maar waarde is breder en bovendien subjectief.',
          en: 'Cost saving can be part of value, but value is broader and moreover subjective.',
        },
      },
      {
        text: {
          nl: 'De meetbare output die een activiteit oplevert',
          en: 'The measurable output produced by an activity',
        },
        rationale: {
          nl: 'Dit is de definitie van output. Sturen op output in plaats van waarde is precies de denkfout die ITIL wil voorkomen.',
          en: 'This is the definition of output. Steering on output instead of value is exactly the mistake ITIL aims to prevent.',
        },
      },
      {
        text: {
          nl: 'De prijs die een serviceconsument bereid is te betalen',
          en: 'The price a service consumer is willing to pay',
        },
        rationale: {
          nl: 'Prijs is een financiële uitdrukking; waarde omvat ook niet-financiële voordelen en is per stakeholder verschillend.',
          en: 'Price is a financial expression; value also includes non-financial benefits and differs per stakeholder.',
        },
      },
    ],
    explanation: {
      nl: 'Waarde is de waargenomen voordelen, bruikbaarheid en het belang van iets. Belangrijk: waarde is subjectief (gevormd door de service-ervaring), dynamisch (verandert in de tijd) en wordt gezamenlijk gecreëerd (co-creatie) door aanbieder en consument samen.',
      en: 'Value is the perceived benefits, usefulness and importance of something. Importantly, value is subjective (shaped by the service experience), dynamic (changes over time) and co-created by provider and consumer together.',
    },
    source: 'Syllabus 1.3.1',
  },
  {
    id: 'itil5-q013',
    objective: '1.1.1',
    type: 'standard',
    bloom: 1,
    difficulty: 2,
    stem: {
      nl: 'Wat is digitaal product- en servicemanagement?',
      en: 'What is digital product and service management?',
    },
    options: [
      {
        text: {
          nl: 'Een reeks gespecialiseerde organisatorische mogelijkheden (capabilities) om waarde te creëren voor klanten in de vorm van digitale producten en services',
          en: 'A set of specialized organizational capabilities for creating value for customers in the form of digital products and services',
        },
        correct: true,
      },
      {
        text: {
          nl: 'Het geheel van technologische hulpmiddelen waarmee een organisatie haar IT-infrastructuur beheert',
          en: 'The collection of technological tools with which an organization manages its IT infrastructure',
        },
        rationale: {
          nl: 'Dit reduceert servicemanagement tot techniek. ITIL benadrukt juist dat capabilities mensen, processen, methoden én technologie combineren.',
          en: 'This reduces service management to technology. ITIL stresses that capabilities combine people, processes, methods and technology.',
        },
      },
      {
        text: {
          nl: 'Een systeem van regels en beleid om data-activa gedurende hun levenscyclus te beschermen',
          en: 'A system of rules and policies to protect data assets throughout their lifecycle',
        },
        rationale: {
          nl: 'Dit beschrijft data governance, een onderdeel van de dimensie informatie en technologie.',
          en: 'This describes data governance, an element of the information and technology dimension.',
        },
      },
      {
        text: {
          nl: 'Het proces waarmee incidenten worden opgelost en de normale werking wordt hersteld',
          en: 'The process by which incidents are resolved and normal operation is restored',
        },
        rationale: {
          nl: 'Dit beschrijft de levenscyclusactiviteit ondersteunen (support), één onderdeel van het geheel.',
          en: 'This describes the support lifecycle activity, one element of the whole.',
        },
      },
    ],
    explanation: {
      nl: 'Het sleutelwoord is capabilities: gespecialiseerde organisatorische mogelijkheden. Een capability beschrijft wat je als organisatie duurzaam kunt; een practice beschrijft hoe je iets organiseert en uitvoert. Het doel is waardecreatie mogelijk maken gedurende de hele levenscyclus.',
      en: 'The key word is capabilities: specialized organizational capabilities. A capability describes what an organization can sustainably do; a practice describes how it organizes and performs it. The purpose is to enable value creation across the entire lifecycle.',
    },
    source: 'Syllabus 1.1.1',
  },
  {
    id: 'itil5-q014',
    objective: '1.4.11',
    type: 'standard',
    bloom: 2,
    difficulty: 3,
    stem: {
      nl: 'Een serviceverlener wil zijn SLA voor een gebruikersgerichte digitale service compleet maken. Welke combinatie moet volgens ITIL Version 5 in elk geval worden afgedekt?',
      en: 'A service provider wants to make the SLA for a user-facing digital service complete. Which combination must be covered according to ITIL Version 5?',
    },
    options: [
      {
        text: {
          nl: 'Bruikbaarheid, garantie en duurzaamheid, aangevuld met meetgegevens over de gebruikerservaring',
          en: 'Utility, warranty and sustainability, supplemented with user experience metrics',
        },
        correct: true,
      },
      {
        text: {
          nl: 'Uitsluitend beschikbaarheid, capaciteit en responstijden',
          en: 'Availability, capacity and response times only',
        },
        rationale: {
          nl: 'Dit zijn garantie-aspecten. Een SLA die alleen garantie afdekt, mist bruikbaarheid, duurzaamheid en ervaring.',
          en: 'These are warranty aspects. An SLA covering only warranty misses utility, sustainability and experience.',
        },
      },
      {
        text: {
          nl: 'De prijs, de contractduur en de opzegtermijn',
          en: 'Price, contract duration and notice period',
        },
        rationale: {
          nl: 'Dit zijn commerciële voorwaarden, geen servicekwaliteitsafspraken.',
          en: 'These are commercial terms, not service quality agreements.',
        },
      },
      {
        text: {
          nl: 'Bruikbaarheid en garantie; duurzaamheid valt buiten de scope van een SLA',
          en: 'Utility and warranty; sustainability falls outside the scope of an SLA',
        },
        rationale: {
          nl: 'In ITIL Version 5 is duurzaamheid juist expliciet toegevoegd als component van servicewaarde en hoort het wél in de SLA thuis.',
          en: 'In ITIL Version 5 sustainability was explicitly added as a component of service value and does belong in the SLA.',
        },
      },
    ],
    explanation: {
      nl: 'SLA’s voor digitale services dienen bruikbaarheid, garantie én duurzaamheid af te dekken. Voor gebruikersgerichte services moeten daarnaast meetgegevens over de gebruikerservaring worden opgenomen. Servicewaarde = bruikbaarheid + garantie + duurzaamheid + ervaring. Duurzaamheid is in Version 5 een zelfstandige component geworden.',
      en: 'SLAs for digital services should cover utility, warranty and sustainability. For user-facing services, user experience metrics must also be included. Service value = utility + warranty + sustainability + experience. Sustainability became a standalone component in Version 5.',
    },
    source: 'Syllabus 1.4.6, 1.4.11',
  },
  {
    id: 'itil5-q015',
    objective: '1.1.6',
    type: 'standard',
    bloom: 1,
    difficulty: 2,
    stem: {
      nl: 'Waarom streven digitale serviceverleners ernaar de overdracht van goederen te minimaliseren?',
      en: 'Why do digital service providers aim to minimize the transfer of goods?',
    },
    options: [
      {
        text: {
          nl: 'Omdat overdracht van goederen betekent dat het eigendom en daarmee kosten en risico’s naar de consument verschuiven, wat haaks staat op de waardepropositie van een digitale service',
          en: 'Because transfer of goods shifts ownership, and with it costs and risks, to the consumer, which runs counter to the value proposition of a digital service',
        },
        correct: true,
      },
      {
        text: {
          nl: 'Omdat ITIL de overdracht van goederen verbiedt binnen een serviceaanbod',
          en: 'Because ITIL prohibits the transfer of goods within a service offering',
        },
        rationale: {
          nl: 'ITIL verbiedt niets; overdracht van goederen is een erkende, zij het zeldzame, vorm van service-interactie bij digitale services.',
          en: 'ITIL prohibits nothing; transfer of goods is a recognized, if rare, form of service interaction in digital services.',
        },
      },
      {
        text: {
          nl: 'Omdat goederen niet kunnen worden opgenomen in een serviceaanbod',
          en: 'Because goods cannot be included in a service offering',
        },
        rationale: {
          nl: 'Een serviceaanbod kan wel degelijk goederen omvatten, naast serviceacties en toegang tot middelen.',
          en: 'A service offering can indeed include goods, alongside service actions and access to resources.',
        },
      },
      {
        text: {
          nl: 'Omdat overdracht van goederen altijd duurder is dan toegang tot middelen',
          en: 'Because transfer of goods is always more expensive than access to resources',
        },
        rationale: {
          nl: 'Kosten zijn contextafhankelijk; de reden is principieel, niet louter financieel.',
          en: 'Costs are context-dependent; the reason is fundamental, not merely financial.',
        },
      },
    ],
    explanation: {
      nl: 'Bij overdracht van goederen gaat het eigendom over naar de serviceconsument, die daarmee de bijbehorende kosten en risico’s draagt. Juist het overnemen van kosten en risico’s is de kern van een service. Bij digitale services is toegang tot middelen daarom de dominante vorm van interactie.',
      en: 'With transfer of goods, ownership passes to the service consumer, who then bears the associated costs and risks. Taking on costs and risks is precisely the essence of a service. In digital services, access to resources is therefore the dominant interaction form.',
    },
    source: 'Syllabus 1.1.6, 1.2.4',
  },
  {
    id: 'itil5-q016',
    objective: '1.3.5',
    type: 'list',
    bloom: 2,
    difficulty: 2,
    stem: {
      nl: 'Welke twee uitspraken over waardeco-creatie zijn CORRECT?',
      en: 'Which two statements about value co-creation are CORRECT?',
    },
    listItems: [
      {
        nl: 'Waarde ontstaat door actieve samenwerking tussen serviceverlener en serviceconsument',
        en: 'Value arises through active collaboration between service provider and service consumer',
      },
      {
        nl: 'De serviceverlener bepaalt eenzijdig hoeveel waarde een service oplevert',
        en: 'The service provider unilaterally determines how much value a service delivers',
      },
      {
        nl: 'Waarde is dynamisch en kan in de loop van de tijd veranderen',
        en: 'Value is dynamic and can change over time',
      },
      {
        nl: 'Waarde is objectief meetbaar en voor elke stakeholder gelijk',
        en: 'Value is objectively measurable and identical for every stakeholder',
      },
    ],
    options: [
      { text: { nl: '1 en 3', en: '1 and 3' }, correct: true },
      {
        text: { nl: '1 en 2', en: '1 and 2' },
        rationale: {
          nl: 'Statement 2 is onjuist: co-creatie betekent juist dat beide partijen bijdragen. De consument levert input, zorgt voor adoptie en draagt bij aan het realiseren van het gewenste resultaat.',
          en: 'Statement 2 is incorrect: co-creation means both parties contribute. The consumer provides input, drives adoption and contributes to achieving the desired outcome.',
        },
      },
      {
        text: { nl: '2 en 4', en: '2 and 4' },
        rationale: {
          nl: 'Beide statements zijn onjuist en beschrijven precies het oude, eenzijdige denken dat ITIL wil vervangen.',
          en: 'Both statements are incorrect and describe exactly the old, one-sided thinking ITIL aims to replace.',
        },
      },
      {
        text: { nl: '3 en 4', en: '3 and 4' },
        rationale: {
          nl: 'Statement 4 is onjuist: waarde is subjectief. Wat voor de ene stakeholder veel waarde heeft, kan voor een ander minder relevant zijn.',
          en: 'Statement 4 is incorrect: value is subjective. What is highly valuable to one stakeholder may be less relevant to another.',
        },
      },
    ],
    explanation: {
      nl: 'Waardeco-creatie betekent dat waarde ontstaat wanneer meerdere belanghebbenden samenwerken. IT levert meestal mogelijkheden; stakeholders leveren input, zorgen voor adoptie en dragen bij aan het gewenste resultaat. Waarde is bovendien subjectief én dynamisch.',
      en: 'Value co-creation means value emerges when multiple stakeholders collaborate. IT usually provides possibilities; stakeholders provide input, drive adoption and contribute to the desired result. Value is moreover subjective and dynamic.',
    },
    source: 'Syllabus 1.3.1, 1.3.5',
  },
  {
    id: 'itil5-q017',
    objective: '1.2.1',
    type: 'standard',
    bloom: 2,
    difficulty: 2,
    stem: {
      nl: 'Wat is het doel van een serviceaanbod (service offering)?',
      en: 'What is the purpose of a service offering?',
    },
    options: [
      {
        text: {
          nl: 'Formeel beschrijven welke services zijn ontworpen om te voldoen aan de behoeften van een specifieke consumentengroep, inclusief de potentiële waarde',
          en: 'To formally describe which services are designed to address the needs of a target consumer group, including the potential value',
        },
        correct: true,
      },
      {
        text: {
          nl: 'De technische specificaties van het onderliggende digitale product vastleggen',
          en: 'To record the technical specifications of the underlying digital product',
        },
        rationale: {
          nl: 'Dat is de productspecificatie: een gedetailleerde beschrijving van eigenschappen, functionaliteiten en technische vereisten.',
          en: 'That is the product specification: a detailed description of features, functionality and technical requirements.',
        },
      },
      {
        text: {
          nl: 'De serviceniveaus en boeteclausules juridisch bindend vastleggen',
          en: 'To legally record service levels and penalty clauses',
        },
        rationale: {
          nl: 'Dat is de rol van de SLA of het contract, niet van het serviceaanbod.',
          en: 'That is the role of the SLA or contract, not of the service offering.',
        },
      },
      {
        text: {
          nl: 'De volgorde van activiteiten vastleggen waarmee de service wordt geleverd',
          en: 'To record the sequence of activities by which the service is delivered',
        },
        rationale: {
          nl: 'Dat beschrijft een waardestroom of proces, niet het serviceaanbod.',
          en: 'That describes a value stream or process, not the service offering.',
        },
      },
    ],
    explanation: {
      nl: 'Een serviceaanbod is een formele beschrijving van een of meer services, gericht op een specifieke consumentengroep. Het kan goederen, toegang tot middelen en serviceacties omvatten. Producten bieden functionaliteiten; het serviceaanbod beschrijft de potentiële waarde daarvan. Zodra de klant het aanbod accepteert, begint de levering.',
      en: 'A service offering is a formal description of one or more services aimed at a specific consumer group. It can include goods, access to resources and service actions. Products offer functionality; the service offering describes its potential value. Once the customer accepts the offering, delivery begins.',
    },
    source: 'Syllabus 1.2.1, 1.2.3',
  },
  {
    id: 'itil5-q018',
    objective: '1.4.8',
    type: 'standard',
    bloom: 2,
    difficulty: 2,
    stem: {
      nl: 'Waarvoor is een serviceconsument in een servicerelatie verantwoordelijk?',
      en: 'What is a service consumer responsible for in a service relationship?',
    },
    options: [
      {
        text: {
          nl: 'De inkoop (en verwerving) en het gebruik van services',
          en: 'Procuring (and acquiring) and using services',
        },
        correct: true,
      },
      {
        text: {
          nl: 'De levering en ondersteuning van services',
          en: 'Delivering and supporting services',
        },
        rationale: {
          nl: 'Dit is de verantwoordelijkheid van de serviceprovider.',
          en: 'This is the service provider’s responsibility.',
        },
      },
      {
        text: {
          nl: 'De creatie en voortdurende verbetering van digitale producten',
          en: 'Creating and continually improving digital products',
        },
        rationale: {
          nl: 'Dit is de verantwoordelijkheid van de leverancier van digitale producten (vendor).',
          en: 'This is the digital product vendor’s responsibility.',
        },
      },
      {
        text: {
          nl: 'Het coördineren van meerdere aanbieders tot één samenhangende serviceverlening',
          en: 'Coordinating multiple providers into one coherent service',
        },
        rationale: {
          nl: 'Dit is de rol van de service-integrator, die intern gemanaged of extern belegd kan zijn.',
          en: 'This is the service integrator’s role, which can be managed internally or delegated externally.',
        },
      },
    ],
    explanation: {
      nl: 'De serviceconsument is verantwoordelijk voor inkoop en gebruik. Binnen de consument onderscheidt ITIL de rollen sponsor (budget), klant (eisen en uitkomsten) en gebruiker (gebruik). Organisaties vormen ketens en netwerken: dezelfde organisatie is vaak consument voor de één en provider voor de ander.',
      en: 'The service consumer is responsible for procurement and use. Within the consumer, ITIL distinguishes the sponsor (budget), customer (requirements and outcomes) and user (use) roles. Organizations form chains and networks: the same organization is often a consumer to one party and a provider to another.',
    },
    source: 'Syllabus 1.4.1, 1.4.8',
  },
  {
    id: 'itil5-q019',
    objective: '1.1.4',
    type: 'standard',
    bloom: 1,
    difficulty: 1,
    stem: {
      nl: 'Wat is voortdurend verbeteren (continual improvement)?',
      en: 'What is continual improvement?',
    },
    options: [
      {
        text: {
          nl: 'Een terugkerende organisatorische activiteit op alle niveaus, om ervoor te zorgen dat de organisatie voortdurend voldoet aan de verwachtingen van de stakeholders',
          en: 'A recurring organizational activity performed at all levels to ensure the organization continually meets stakeholder expectations',
        },
        correct: true,
      },
      {
        text: {
          nl: 'Een eenmalig verbeterproject dat na oplevering wordt afgesloten',
          en: 'A one-off improvement project that closes after delivery',
        },
        rationale: {
          nl: 'Het woord ‘terugkerend’ is essentieel: verbetering is structureel en herhalend, geen project met een einddatum.',
          en: 'The word ‘recurring’ is essential: improvement is structural and repeating, not a project with an end date.',
        },
      },
      {
        text: {
          nl: 'Een ononderbroken proces dat zonder pauzes doorloopt',
          en: 'An uninterrupted process that runs without pauses',
        },
        rationale: {
          nl: 'Dat is de betekenis van ‘continu’, niet van ‘continual’. Verbetering verloopt in cycli met tussenpozen: evalueren, aanpassen, leren, herhalen.',
          en: 'That is the meaning of ‘continuous’, not ‘continual’. Improvement runs in cycles with intervals: evaluate, adjust, learn, repeat.',
        },
      },
      {
        text: {
          nl: 'Een activiteit die uitsluitend door het bestuursorgaan wordt uitgevoerd',
          en: 'An activity performed exclusively by the governing body',
        },
        rationale: {
          nl: 'Voortdurend verbeteren vindt juist plaats op álle niveaus van de organisatie.',
          en: 'Continual improvement takes place at all levels of the organization.',
        },
      },
    ],
    explanation: {
      nl: 'Let op het onderscheid tussen ‘continual’ (voortdurend, in cycli met tussenpozen) en ‘continuous’ (continu, ononderbroken). Voortdurend verbeteren is van toepassing op het gehele ITIL-waardesysteem: producten, services, werkwijzen én relaties.',
      en: 'Note the distinction between ‘continual’ (recurring, in cycles with intervals) and ‘continuous’ (uninterrupted). Continual improvement applies to the entire ITIL Value System: products, services, practices and relationships.',
    },
    source: 'Syllabus 1.1.4',
  },
  {
    id: 'itil5-q020',
    objective: '1.1.5',
    type: 'standard',
    bloom: 1,
    difficulty: 2,
    stem: {
      nl: 'Wat beschrijft het ITIL Product and Service Lifecycle Model?',
      en: 'What does the ITIL Product and Service Lifecycle Model describe?',
    },
    options: [
      {
        text: {
          nl: 'De managementactiviteiten die organisaties in elke fase van de levenscyclus van digitale producten en services uitvoeren',
          en: 'The management activities organizations perform in each phase of the digital product and service lifecycle',
        },
        correct: true,
      },
      {
        text: {
          nl: 'De verplichte volgorde waarin producten moeten worden ontwikkeld en uitgefaseerd',
          en: 'The mandatory sequence in which products must be developed and retired',
        },
        rationale: {
          nl: 'De activiteiten kennen geen vaste volgorde; ze worden in de juiste context gecombineerd tot waardestromen.',
          en: 'The activities follow no fixed order; they are combined in context to form value streams.',
        },
      },
      {
        text: {
          nl: 'De contractuele fasen van een servicerelatie tussen aanbieder en consument',
          en: 'The contractual phases of a service relationship between provider and consumer',
        },
        rationale: {
          nl: 'Dit raakt aan het servicetraject (service journey), een ander model.',
          en: 'This relates to the service journey, a different model.',
        },
      },
      {
        text: {
          nl: 'De 34 managementwerkwijzen en hun onderlinge afhankelijkheden',
          en: 'The 34 management practices and their interdependencies',
        },
        rationale: {
          nl: 'De werkwijzen máken de levenscyclusactiviteiten mogelijk, maar vormen zelf niet het levenscyclusmodel.',
          en: 'The practices enable the lifecycle activities but do not themselves constitute the lifecycle model.',
        },
      },
    ],
    explanation: {
      nl: 'Om kwaliteit en voortdurende verbetering te waarborgen, managen organisaties producten en services gedurende hun gehele levenscyclus. Het model beschrijft de acht managementactiviteiten: ontdekken, ontwerpen, verwerven, bouwen, transitie, beheren, leveren en ondersteunen. Deze zijn niet sequentieel en worden iteratief toegepast.',
      en: 'To ensure quality and continual improvement, organizations manage products and services across their entire lifecycle. The model describes eight management activities: discover, design, acquire, build, transition, operate, deliver and support. These are not sequential and are applied iteratively.',
    },
    source: 'Syllabus 1.1.5, 3.1.1',
  },
  {
    id: 'itil5-q021',
    objective: '1.4.7',
    type: 'negative',
    bloom: 1,
    difficulty: 2,
    stem: {
      nl: 'Welke van de volgende is GEEN kenmerk van een organisatie zoals ITIL die definieert?',
      en: 'Which of the following is NOT a characteristic of an organization as ITIL defines it?',
    },
    options: [
      {
        text: {
          nl: 'Een organisatie moet altijd uit minimaal twee rechtspersonen bestaan',
          en: 'An organization must always consist of at least two legal entities',
        },
        correct: true,
      },
      {
        text: {
          nl: 'Een organisatie kan een volledige rechtspersoon zijn, zoals een bedrijf',
          en: 'An organization can be a full legal entity, such as a company',
        },
        rationale: {
          nl: 'Dit is juist en het meest voorkomende geval.',
          en: 'This is correct and the most common case.',
        },
      },
      {
        text: {
          nl: 'Een organisatie kan een onderdeel zijn van een rechtspersoon, zoals één of meerdere teams',
          en: 'An organization can be part of a legal entity, such as one or more teams',
        },
        rationale: {
          nl: 'Dit is juist: het ITIL-waardesysteem kan ook op een organisatie-eenheid worden toegepast.',
          en: 'This is correct: the ITIL Value System can also be applied to an organizational unit.',
        },
      },
      {
        text: {
          nl: 'Een organisatie kan een zelfstandig individu zijn of een multinational',
          en: 'An organization can be a single individual or a multinational',
        },
        rationale: {
          nl: 'Dit is juist: grootte en type zijn niet begrensd.',
          en: 'This is correct: size and type are unbounded.',
        },
      },
    ],
    explanation: {
      nl: 'Een organisatie is een persoon of groep personen met eigen functies, verantwoordelijkheden, bevoegdheden en relaties om haar doelstellingen te bereiken. Dat kan een volledige rechtspersoon zijn, een onderdeel daarvan, een groep rechtspersonen, of zelfs één individu. Een minimum van twee rechtspersonen bestaat niet.',
      en: 'An organization is a person or group of people with its own functions, responsibilities, authorities and relationships to achieve its objectives. That can be a full legal entity, a part of one, a group of entities, or even a single individual. There is no minimum of two legal entities.',
    },
    source: 'Syllabus 1.4.1, 1.4.7',
  },
  {
    id: 'itil5-q022',
    objective: '1.3.6',
    type: 'standard',
    bloom: 2,
    difficulty: 3,
    stem: {
      nl: 'Wanneer wordt een service door een serviceconsument als waardevol ervaren?',
      en: 'When is a service perceived as valuable by a service consumer?',
    },
    options: [
      {
        text: {
          nl: 'Wanneer de positieve effecten zwaarder wegen dan de negatieve effecten',
          en: 'When the positive effects outweigh the negative effects',
        },
        correct: true,
      },
      {
        text: {
          nl: 'Wanneer de service geen enkele nieuwe kosten of risico’s introduceert',
          en: 'When the service introduces no new costs or risks whatsoever',
        },
        rationale: {
          nl: 'Dit is onrealistisch: vrijwel elke service brengt nieuwe kosten en risico’s met zich mee. Het gaat om de balans.',
          en: 'This is unrealistic: nearly every service introduces new costs and risks. What matters is the balance.',
        },
      },
      {
        text: {
          nl: 'Wanneer alle overeengekomen serviceniveaus worden gehaald',
          en: 'When all agreed service levels are met',
        },
        rationale: {
          nl: 'Serviceniveaus halen is noodzakelijk maar niet voldoende: een service kan technisch perfect presteren en toch weinig waarde opleveren.',
          en: 'Meeting service levels is necessary but not sufficient: a service can perform technically perfectly and still deliver little value.',
        },
      },
      {
        text: {
          nl: 'Wanneer de serviceverlener alle kosten en risico’s volledig overneemt',
          en: 'When the service provider fully absorbs all costs and risks',
        },
        rationale: {
          nl: 'De provider neemt een deel van de kosten en risico’s over, niet alle. De consument houdt altijd de kosten en risico’s van het gebruik zelf.',
          en: 'The provider takes on part of the costs and risks, not all. The consumer always retains the costs and risks of use itself.',
        },
      },
    ],
    explanation: {
      nl: 'Services helpen consumenten uitkomsten te bereiken en nemen daarbij een deel van de kosten en risico’s over. Tegelijk kunnen ze nieuwe kosten en risico’s introduceren en soms bepaalde beoogde uitkomsten negatief beïnvloeden. Het oordeel is dus een saldo: pas als de positieve aspecten zwaarder wegen, is er sprake van waarde.',
      en: 'Services help consumers achieve outcomes while taking on part of the costs and risks. At the same time they may introduce new costs and risks and sometimes negatively affect certain intended outcomes. The judgement is therefore a net balance: only when positive aspects outweigh negative ones is there value.',
    },
    source: 'Syllabus 1.3.6',
  },
  {
    id: 'itil5-q023',
    objective: '1.4.10',
    type: 'standard',
    bloom: 2,
    difficulty: 3,
    stem: {
      nl: 'Wat gebeurt er met de band van zichtbaarheid (band of visibility) naarmate een servicerelatie nauwer wordt?',
      en: 'What happens to the band of visibility as a service relationship becomes closer?',
    },
    options: [
      { text: { nl: 'Deze wordt groter', en: 'It becomes wider' }, correct: true },
      {
        text: { nl: 'Deze wordt kleiner', en: 'It becomes narrower' },
        rationale: {
          nl: 'Precies andersom: hoe nauwer de relatie, hoe meer partijen van elkaar zien.',
          en: 'Exactly the opposite: the closer the relationship, the more the parties see of each other.',
        },
      },
      {
        text: {
          nl: 'Deze blijft gelijk, ongeacht het relatietype',
          en: 'It stays the same, regardless of relationship type',
        },
        rationale: {
          nl: 'De band van zichtbaarheid hangt juist expliciet af van het type servicerelatie.',
          en: 'The band of visibility explicitly depends on the type of service relationship.',
        },
      },
      {
        text: {
          nl: 'Deze verdwijnt volledig bij een partnerschap',
          en: 'It disappears entirely in a partnership',
        },
        rationale: {
          nl: 'Bij een partnerschap is de zichtbaarheid maximaal, niet afwezig.',
          en: 'In a partnership visibility is at its maximum, not absent.',
        },
      },
    ],
    explanation: {
      nl: 'De band van zichtbaarheid is de som van de aspecten die aanbieder en consument van elkaar kunnen zien. Bij een basisrelatie zien partijen weinig van elkaar; bij een collaboratieve relatie (partnerschap) delen ze middelen, gegevens en soms zelfs reputatie. Hoe nauwer de relatie, hoe groter de band van zichtbaarheid.',
      en: 'The band of visibility is the sum of the aspects provider and consumer can see of each other. In a basic relationship the parties see little of each other; in a collaborative relationship (partnership) they share resources, data and sometimes even reputation. The closer the relationship, the wider the band of visibility.',
    },
    source: 'Syllabus 1.4.3, 1.4.10',
  },
  {
    id: 'itil5-q024',
    objective: '1.1.7',
    type: 'missing_word',
    bloom: 1,
    difficulty: 2,
    stem: {
      nl: 'Identificeer het ontbrekende woord in de volgende zin.\n\n[ ? ] is de garantie dat een product of service voldoet aan, en zal blijven voldoen aan, de eisen op het gebied van rentmeesterschap van de omgeving, sociale vooruitgang en economische groei.',
      en: 'Identify the missing word in the following sentence.\n\n[ ? ] is the assurance that a product or service meets, and will continue to meet, requirements for environmental stewardship, social progress and economic growth.',
    },
    options: [
      { text: { nl: 'Duurzaamheid', en: 'Sustainability' }, correct: true },
      {
        text: { nl: 'Garantie', en: 'Warranty' },
        rationale: {
          nl: 'Garantie is de zekerheid dat een product of service aan de overeengekomen eisen voldoet — beschikbaarheid, capaciteit, beveiliging, continuïteit.',
          en: 'Warranty is the assurance that a product or service meets agreed requirements — availability, capacity, security, continuity.',
        },
      },
      {
        text: { nl: 'Betrouwbaarheid', en: 'Reliability' },
        rationale: {
          nl: 'Betrouwbaarheid is het vermogen van een product of service om gedurende een bepaalde tijd of aantal cycli naar behoren te functioneren.',
          en: 'Reliability is the ability of a product or service to function as required for a given time or number of cycles.',
        },
      },
      {
        text: { nl: 'Servicekwaliteit', en: 'Service quality' },
        rationale: {
          nl: 'Servicekwaliteit is de som van de kenmerken die relevant zijn voor het vermogen te voldoen aan expliciete en impliciete behoeften.',
          en: 'Service quality is the sum of characteristics relevant to the ability to meet stated and implied needs.',
        },
      },
    ],
    explanation: {
      nl: 'Duurzaamheid is in ITIL Version 5 een zelfstandige component van servicewaarde geworden, naast bruikbaarheid, garantie en ervaring. Rentmeesterschap (stewardship) betekent het verantwoord en toekomstgericht managen van middelen, in het belang van huidige én toekomstige generaties.',
      en: 'In ITIL Version 5, sustainability became a standalone component of service value alongside utility, warranty and experience. Stewardship means managing resources responsibly and with a view to the future, in the interest of both current and future generations.',
    },
    source: 'Syllabus 1.1.7',
  },
  {
    id: 'itil5-q025',
    objective: '1.4.9',
    type: 'standard',
    bloom: 2,
    difficulty: 3,
    stem: {
      nl: 'Een organisatie huurt een externe partij in om de afhankelijkheden tussen vijf leveranciers te coördineren, zodat de klant één samenhangende serviceverlening ervaart. Welke rol vervult deze externe partij?',
      en: 'An organization hires an external party to coordinate the dependencies between five suppliers so the customer experiences one coherent service. Which role does this external party fulfil?',
    },
    options: [
      { text: { nl: 'Service-integrator', en: 'Service integrator' }, correct: true },
      {
        text: {
          nl: 'Leverancier van digitale producten',
          en: 'Digital product vendor',
        },
        rationale: {
          nl: 'Een vendor creëert en verbetert digitale producten; coördineren van andere partijen hoort daar niet bij.',
          en: 'A vendor creates and improves digital products; coordinating other parties is not part of that.',
        },
      },
      {
        text: { nl: 'Sponsor', en: 'Sponsor' },
        rationale: {
          nl: 'De sponsor keurt het budget goed en is een rol aan de consumentenkant.',
          en: 'The sponsor approves the budget and is a role on the consumer side.',
        },
      },
      {
        text: { nl: 'Bestuursorgaan', en: 'Governing body' },
        rationale: {
          nl: 'Het bestuursorgaan is op het hoogste niveau verantwoordelijk voor prestaties en naleving binnen de eigen organisatie.',
          en: 'The governing body is accountable at the highest level for performance and compliance within its own organization.',
        },
      },
    ],
    explanation: {
      nl: 'Organisaties opereren vaak binnen complexe servicenetwerken. Een service-integrator brengt meerdere services en serviceverleners samen en stemt ze op elkaar af, zodat voor de klant één samenhangende serviceverlening ontstaat. Die rol kan intern worden gemanaged of aan een externe partij worden gedelegeerd.',
      en: 'Organizations often operate within complex service networks. A service integrator brings multiple services and providers together and aligns them so the customer experiences one coherent service. That role can be managed internally or delegated to an external party.',
    },
    source: 'Syllabus 1.4.9, 2.2.2',
  },
  {
    id: 'itil5-q026',
    objective: '1.4.6',
    type: 'standard',
    bloom: 1,
    difficulty: 1,
    stem: {
      nl: 'Wat is een Service Level Agreement (SLA)?',
      en: 'What is a service level agreement (SLA)?',
    },
    options: [
      {
        text: {
          nl: 'Een gedocumenteerde overeenkomst tussen een serviceverlener en een klant waarin de geleverde services en het overeengekomen niveau van elke service worden vastgelegd',
          en: 'A documented agreement between a service provider and a customer that identifies the services delivered and the agreed level of each service',
        },
        correct: true,
      },
      {
        text: {
          nl: 'Een reeks meetwaarden die de behaalde servicekwaliteit definiëren',
          en: 'A set of metrics defining the achieved service quality',
        },
        rationale: {
          nl: 'Dat is het serviceniveau. De SLA is het document waarin die niveaus worden vastgelegd en overeengekomen.',
          en: 'That is the service level. The SLA is the document in which those levels are recorded and agreed.',
        },
      },
      {
        text: {
          nl: 'Een formele beschrijving van services voor een specifieke consumentengroep',
          en: 'A formal description of services for a specific consumer group',
        },
        rationale: {
          nl: 'Dat is het serviceaanbod (service offering).',
          en: 'That is the service offering.',
        },
      },
      {
        text: {
          nl: 'Een overeenkomst tussen twee interne teams over onderlinge ondersteuning',
          en: 'An agreement between two internal teams about mutual support',
        },
        rationale: {
          nl: 'De SLA-definitie spreekt expliciet over serviceverlener en klant, niet specifiek over interne teams.',
          en: 'The SLA definition explicitly refers to service provider and customer, not specifically internal teams.',
        },
      },
    ],
    explanation: {
      nl: 'De SLA is de gebruikelijke manier om een gedeeld begrip te creëren van verwachte en behaalde servicekwaliteit. Formaliteit, scope en aanpasbaarheid hangen af van het type service en de relatie. Voor digitale services moet een SLA bruikbaarheid, garantie én duurzaamheid afdekken.',
      en: 'The SLA is the usual way to create shared understanding of expected and achieved service quality. Its formality, scope and adaptability depend on the service type and the relationship. For digital services, an SLA should cover utility, warranty and sustainability.',
    },
    source: 'Syllabus 1.4.6',
  },
  {
    id: 'itil5-q027',
    objective: '1.1.2',
    type: 'standard',
    bloom: 2,
    difficulty: 2,
    stem: {
      nl: 'Waarom levert een verzameling technische componenten op zichzelf nog geen waarde op?',
      en: 'Why does a collection of technical components on its own not yet deliver value?',
    },
    options: [
      {
        text: {
          nl: 'Omdat waarde pas ontstaat wanneer mensen, afspraken, capaciteit en technologie samen een gewenste uitkomst mogelijk maken',
          en: 'Because value only emerges when people, agreements, capacity and technology together enable a desired outcome',
        },
        correct: true,
      },
      {
        text: {
          nl: 'Omdat technische componenten per definitie geen onderdeel zijn van een digitaal product',
          en: 'Because technical components are by definition not part of a digital product',
        },
        rationale: {
          nl: 'Een digitaal product is juist een combinatie van middelen gebaseerd op digitale technologie; componenten horen er wel degelijk bij.',
          en: 'A digital product is precisely a combination of resources based on digital technology; components are certainly part of it.',
        },
      },
      {
        text: {
          nl: 'Omdat waarde alleen door de serviceverlener kan worden gecreëerd',
          en: 'Because value can only be created by the service provider',
        },
        rationale: {
          nl: 'Waarde wordt juist gezamenlijk gecreëerd (co-creatie) door aanbieder en consument.',
          en: 'Value is co-created by provider and consumer together.',
        },
      },
      {
        text: {
          nl: 'Omdat componenten pas waarde krijgen zodra ze in een SLA zijn opgenomen',
          en: 'Because components only gain value once included in an SLA',
        },
        rationale: {
          nl: 'Een SLA legt afspraken vast over serviceniveaus, maar creëert op zichzelf geen waarde.',
          en: 'An SLA records agreements about service levels but does not itself create value.',
        },
      },
    ],
    explanation: {
      nl: 'Dit is de servicegedachte: componenten (tools, systemen) leveren niet automatisch waarde. Een service combineert mensen, afspraken, capaciteit en technologie zodat een gewenste outcome haalbaar wordt. Wie alleen naar output kijkt, optimaliseert activiteiten in plaats van effecten.',
      en: 'This is the service mindset: components (tools, systems) do not automatically deliver value. A service combines people, agreements, capacity and technology so a desired outcome becomes achievable. Focusing only on output optimizes activities instead of effects.',
    },
    source: 'Syllabus 1.1.2, 1.3.5',
  },
  {
    id: 'itil5-q028',
    objective: '1.3.3',
    type: 'list',
    bloom: 1,
    difficulty: 2,
    stem: {
      nl: 'Welke twee van de volgende zijn voorbeelden van een output?',
      en: 'Which two of the following are examples of an output?',
    },
    listItems: [
      {
        nl: 'Een opgeleverde release van een applicatie',
        en: 'A delivered release of an application',
      },
      {
        nl: 'Een daling van het aantal incidenten met 20%',
        en: 'A 20% reduction in the number of incidents',
      },
      {
        nl: 'Een geschreven gebruikershandleiding',
        en: 'A written user manual',
      },
      {
        nl: 'Medewerkers die sneller hun werk kunnen doen',
        en: 'Employees being able to do their work faster',
      },
    ],
    options: [
      { text: { nl: '1 en 3', en: '1 and 3' }, correct: true },
      {
        text: { nl: '1 en 2', en: '1 and 2' },
        rationale: {
          nl: 'Statement 2 is een outcome: een resultaat voor een belanghebbende dat door outputs mogelijk is gemaakt.',
          en: 'Statement 2 is an outcome: a result for a stakeholder enabled by outputs.',
        },
      },
      {
        text: { nl: '2 en 4', en: '2 and 4' },
        rationale: {
          nl: 'Beide zijn outcomes, geen outputs. Ze beschrijven wat er verandert, niet wat er is opgeleverd.',
          en: 'Both are outcomes, not outputs. They describe what changes, not what is delivered.',
        },
      },
      {
        text: { nl: '3 en 4', en: '3 and 4' },
        rationale: {
          nl: 'Statement 4 is een outcome: het beschrijft een effect voor een belanghebbende.',
          en: 'Statement 4 is an outcome: it describes an effect for a stakeholder.',
        },
      },
    ],
    explanation: {
      nl: 'Output is een tastbaar of niet-tastbaar op te leveren resultaat van een activiteit: een release, documentatie, een workflow. Outcome is een resultaat voor een belanghebbende dat door een of meer outputs mogelijk wordt gemaakt: sneller werken, minder incidenten, lagere doorlooptijd. ITIL stuurt op doorvragen: wat leverde dit op, voor wie, en helpt het bij de doelen?',
      en: 'Output is a tangible or intangible deliverable of an activity: a release, documentation, a workflow. Outcome is a result for a stakeholder enabled by one or more outputs: working faster, fewer incidents, shorter lead times. ITIL encourages probing: what did this deliver, for whom, and does it help achieve the goals?',
    },
    source: 'Syllabus 1.3.3, 1.3.4',
  },
];
