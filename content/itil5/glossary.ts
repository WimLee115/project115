import type { GlossarySeed } from '../types';

/**
 * ITIL Foundation (Version 5) — tweetalig glossarium.
 *
 * Alle begrippen die de syllabus expliciet als 'Define ...' opvoert. Het
 * examen is Engelstalig, dus de Engelse term is leidend; de Nederlandse term
 * staat erbij omdat het cursusmateriaal Nederlandstalig is en die twee bij
 * sommige begrippen verraderlijk uit elkaar lopen (continual/continu).
 *
 * HERKOMST — lees dit voordat je hier iets aan verandert.
 *
 * De definities in dit bestand zijn niet origineel. Het zijn de gangbare
 * formuleringen uit het officiële ITIL-materiaal; het auteursrecht daarop ligt
 * bij PeopleCert International Ltd. Ze staan hier omdat het examen precies die
 * formuleringen toetst — bij een 'missing word'-vraag moet je de officiële zin
 * herkennen, niet een parafrase ervan.
 *
 * Dat maakt dit glossarium een verwijzing naar het bronmateriaal, geen
 * vervanging ervan. De toelichtingen in het veld `note` zijn wél van de auteur.
 *
 * Zie GEBRUIKSVOORWAARDEN.md, sectie 'Over de inhoud'. Meent een rechthebbende
 * dat een passage hier weg moet, dan gebeurt dat zonder discussie.
 */

export const glossary: GlossarySeed[] = [
  {
    termEn: 'Service',
    termNl: 'Service',
    objective: '1.1.2',
    definition: {
      nl: 'Een manier om gezamenlijke waardecreatie mogelijk te maken door uitkomsten te faciliteren die klanten willen bereiken, zonder dat de klant specifieke kosten en risico’s hoeft te managen.',
      en: 'A means of enabling value co-creation by facilitating outcomes that customers want to achieve, without the customer having to manage specific costs and risks.',
    },
    note: {
      nl: 'De twee herkenningspunten: waardeco-creatie én het overnemen van kosten en risico’s.',
      en: 'The two recognition points: value co-creation and the transfer of costs and risks.',
    },
  },
  {
    termEn: 'Product',
    termNl: 'Product',
    objective: '1.1.2',
    definition: {
      nl: 'Een configuratie van de middelen (resources) van een organisatie, ontworpen om waarde te bieden aan een consument.',
      en: "A configuration of an organization's resources designed to offer value for a consumer.",
    },
    note: {
      nl: 'Producten bieden functionaliteiten; services maken waarderealisatie mogelijk door gebruik.',
      en: 'Products offer functionality; services enable value realization through use.',
    },
  },
  {
    termEn: 'Digital product',
    termNl: 'Digitaal product',
    objective: '1.1.3',
    definition: {
      nl: 'Een combinatie van de middelen van een organisatie, gebaseerd op digitale technologie en ontworpen om waarde te bieden aan consumenten.',
      en: "A combination of an organization's resources, based on digital technology and designed to offer value for consumers.",
    },
  },
  {
    termEn: 'Digital service',
    termNl: 'Digitale service',
    objective: '1.1.3',
    definition: {
      nl: 'Een service die geheel of grotendeels afhankelijk is van digitale producten.',
      en: 'A service that fully or largely depends on digital products.',
    },
    note: {
      nl: 'Eén product kan meerdere services mogelijk maken en één service kan op meerdere producten rusten.',
      en: 'One product can enable multiple services and one service can rest on multiple products.',
    },
  },
  {
    termEn: 'Utility',
    termNl: 'Bruikbaarheid',
    objective: '1.1.7',
    definition: {
      nl: 'De functionaliteit die een product of service biedt. Het ‘wat’: geschikt voor het doel (fit for purpose).',
      en: 'The functionality offered by a product or service. The ‘what’: fit for purpose.',
    },
  },
  {
    termEn: 'Warranty',
    termNl: 'Garantie / zekerheid',
    objective: '1.1.7',
    definition: {
      nl: 'De zekerheid dat een product of service aan de overeengekomen eisen voldoet. Het ‘hoe’: geschikt voor gebruik (fit for use). Betreft beschikbaarheid, capaciteit, beveiliging en continuïteit.',
      en: 'The assurance that a product or service will meet agreed requirements. The ‘how’: fit for use. Covers availability, capacity, security and continuity.',
    },
  },
  {
    termEn: 'Sustainability',
    termNl: 'Duurzaamheid',
    objective: '1.1.7',
    definition: {
      nl: 'De garantie dat een product of service voldoet en zal blijven voldoen aan de eisen op het gebied van rentmeesterschap van de omgeving, sociale vooruitgang en economische groei.',
      en: 'The assurance that a product or service meets, and will continue to meet, requirements for environmental stewardship, social progress and economic growth.',
    },
    note: {
      nl: 'Nieuw als zelfstandige component van servicewaarde in Version 5.',
      en: 'New as a standalone component of service value in Version 5.',
    },
  },
  {
    termEn: 'User experience (UX)',
    termNl: 'Gebruikerservaring',
    objective: '1.1.7',
    definition: {
      nl: 'De som van functionele en emotionele interacties met een service en serviceverlener, zoals ervaren door de gebruiker.',
      en: 'The sum of functional and emotional interactions with a service and service provider, as perceived by the user.',
    },
    note: {
      nl: 'Klantervaring (CX) is dezelfde definitie, maar dan zoals ervaren door de klant.',
      en: 'Customer experience (CX) has the same definition, but as perceived by the customer.',
    },
  },
  {
    termEn: 'Value',
    termNl: 'Waarde',
    objective: '1.3.1',
    definition: {
      nl: 'De waargenomen voordelen, bruikbaarheid en het belang van iets.',
      en: 'The perceived benefits, usefulness and importance of something.',
    },
    note: {
      nl: 'Waarde is subjectief, dynamisch en wordt gezamenlijk gecreëerd.',
      en: 'Value is subjective, dynamic and co-created.',
    },
  },
  {
    termEn: 'Output',
    termNl: 'Output',
    objective: '1.3.3',
    definition: {
      nl: 'Een tastbaar of niet-tastbaar op te leveren resultaat (deliverable) van een activiteit.',
      en: 'A tangible or intangible deliverable of an activity.',
    },
    note: {
      nl: 'Output is wat je oplevert; outcome is wat er verandert.',
      en: 'Output is what you deliver; outcome is what changes.',
    },
  },
  {
    termEn: 'Outcome',
    termNl: 'Uitkomst / eindresultaat',
    objective: '1.3.3',
    definition: {
      nl: 'Een resultaat voor een belanghebbende dat mogelijk wordt gemaakt door een of meer outputs.',
      en: 'A result for a stakeholder enabled by one or more outputs.',
    },
  },
  {
    termEn: 'Cost',
    termNl: 'Kosten',
    objective: '1.3.2',
    definition: {
      nl: 'De hoeveelheid geld die is uitgegeven aan een specifieke activiteit, resource, product of service.',
      en: 'The amount of money spent on a specific activity, resource, product or service.',
    },
    note: {
      nl: 'Twee soorten: verwijderd door de service (provider draagt) en opgelegd door de service (consument draagt).',
      en: 'Two kinds: removed by the service (provider bears) and imposed by the service (consumer bears).',
    },
  },
  {
    termEn: 'Risk',
    termNl: 'Risico',
    objective: '1.3.2',
    definition: {
      nl: 'Een mogelijke gebeurtenis die schade of verlies kan toebrengen of het moeilijker maakt om doelstellingen te bereiken.',
      en: 'A possible event that could cause harm or loss, or make it more difficult to achieve objectives.',
    },
  },
  {
    termEn: 'Service offering',
    termNl: 'Serviceaanbod',
    objective: '1.2.1',
    definition: {
      nl: 'Een formele beschrijving van een of meer services die zijn ontworpen om te voldoen aan de behoeften van een specifieke consumentengroep. Kan goederen, toegang tot middelen en serviceacties omvatten.',
      en: 'A formal description of one or more services designed to address the needs of a target consumer group. May include goods, access to resources and service actions.',
    },
  },
  {
    termEn: 'Organization',
    termNl: 'Organisatie',
    objective: '1.4.1',
    definition: {
      nl: 'Een persoon of groep personen met eigen functies, verantwoordelijkheden, bevoegdheden en relaties om haar doelstellingen te bereiken.',
      en: 'A person or a group of people that has its own functions with responsibilities, authorities and relationships to achieve its objectives.',
    },
  },
  {
    termEn: 'Service provider',
    termNl: 'Serviceprovider',
    objective: '1.4.1',
    definition: {
      nl: 'Een organisatie die verantwoordelijk is voor de levering en ondersteuning van services.',
      en: 'An organization responsible for the delivery and support of services.',
    },
  },
  {
    termEn: 'Service consumer',
    termNl: 'Serviceconsument',
    objective: '1.4.1',
    definition: {
      nl: 'Een organisatie die verantwoordelijk is voor de inkoop (en verwerving) en het gebruik van services.',
      en: 'An organization responsible for the procurement (and acquisition) and use of services.',
    },
  },
  {
    termEn: 'Digital product vendor',
    termNl: 'Leverancier van digitale producten',
    objective: '1.4.1',
    definition: {
      nl: 'Een organisatie die verantwoordelijk is voor de creatie en voortdurende verbetering van digitale producten en bijbehorend serviceaanbod.',
      en: 'An organization responsible for the creation and continual improvement of digital products and related service offerings.',
    },
  },
  {
    termEn: 'Sponsor',
    termNl: 'Sponsor',
    objective: '1.4.4',
    definition: {
      nl: 'De rol die het budget voor het gebruik van services goedkeurt.',
      en: 'The role that authorizes the budget for service consumption.',
    },
  },
  {
    termEn: 'Customer',
    termNl: 'Klant',
    objective: '1.4.4',
    definition: {
      nl: 'De rol die de eisen voor producten en services definieert en verantwoordelijkheid draagt voor de uitkomsten door het gebruik van die services.',
      en: 'The role that defines the requirements for products and services and takes responsibility for the outcomes of service consumption.',
    },
  },
  {
    termEn: 'User',
    termNl: 'Gebruiker',
    objective: '1.4.4',
    definition: {
      nl: 'De rol die gebruikmaakt van services.',
      en: 'The role that uses services.',
    },
    note: {
      nl: 'Sponsor, klant en gebruiker kunnen samenvallen in één persoon.',
      en: 'Sponsor, customer and user can coincide in one person.',
    },
  },
  {
    termEn: 'Service journey',
    termNl: 'Servicetraject',
    objective: '1.4.3',
    definition: {
      nl: 'De som van alle activiteiten en interacties die worden uitgevoerd door organisaties in servicerelaties om hun rol als serviceprovider en serviceconsument te vervullen.',
      en: 'The sum of all activities and interactions performed by organizations involved in service relationships to fulfil their roles as service provider and service consumer.',
    },
    note: {
      nl: 'Stappen: verkennen, betrekken, aanbieden, overeenkomst bereiken, onboarden, co-creëren, reflecteren. Geen vaste volgorde.',
      en: 'Steps: explore, engage, offer, agree, onboard, co-create, reflect. No fixed order.',
    },
  },
  {
    termEn: 'Band of visibility',
    termNl: 'Band van zichtbaarheid',
    objective: '1.4.10',
    definition: {
      nl: 'De som van de aspecten van de serviceafnemer die zichtbaar zijn voor de serviceverlener, en omgekeerd. Hoe nauwer de relatie, hoe groter de band.',
      en: 'The sum of the aspects of the service consumer visible to the provider, and vice versa. The closer the relationship, the wider the band.',
    },
  },
  {
    termEn: 'Service quality',
    termNl: 'Servicekwaliteit',
    objective: '1.4.5',
    definition: {
      nl: 'De som van de kenmerken van een service die relevant zijn voor het vermogen ervan om te voldoen aan de expliciet en impliciet gestelde behoeften.',
      en: 'The sum of a service’s characteristics relevant to its ability to satisfy stated and implied needs.',
    },
  },
  {
    termEn: 'Service level',
    termNl: 'Serviceniveau',
    objective: '1.4.5',
    definition: {
      nl: 'Een reeks meetwaarden (metrics) die de verwachte of behaalde servicekwaliteit definiëren.',
      en: 'A set of metrics that define the expected or achieved quality of a service.',
    },
  },
  {
    termEn: 'Service level agreement (SLA)',
    termNl: 'Serviceniveauovereenkomst',
    objective: '1.4.6',
    definition: {
      nl: 'Een gedocumenteerde overeenkomst tussen een serviceverlener en een klant waarin de geleverde services en het overeengekomen niveau van elke service worden vastgelegd.',
      en: 'A documented agreement between a service provider and a customer that identifies both the services required and the agreed level of each service.',
    },
  },
  {
    termEn: 'Continual improvement',
    termNl: 'Voortdurend verbeteren',
    objective: '1.1.4',
    definition: {
      nl: 'Een terugkerende organisatorische activiteit die op alle niveaus wordt uitgevoerd om ervoor te zorgen dat de organisatie voortdurend voldoet aan de verwachtingen van de stakeholders.',
      en: 'A recurring organizational activity performed at all levels to ensure that an organization’s performance continually meets stakeholders’ expectations.',
    },
    note: {
      nl: 'Let op: ‘continual’ = voortdurend, in cycli met tussenpozen. Niet ‘continu’ (ononderbroken).',
      en: 'Note: ‘continual’ means recurring, in cycles with intervals. Not ‘continuous’ (uninterrupted).',
    },
  },
  {
    termEn: 'Governance',
    termNl: 'Governance / organisatiebestuur',
    objective: '4.3.1',
    definition: {
      nl: 'Het systeem waarmee een organisatie wordt geleid en beheerst.',
      en: 'The system by which an organization is directed and controlled.',
    },
    note: {
      nl: 'Activiteiten: belanghebbenden betrekken, evalueren, aansturen, monitoren.',
      en: 'Activities: engage stakeholders, evaluate, direct, monitor.',
    },
  },
  {
    termEn: 'Value chain',
    termNl: 'Waardeketen',
    objective: '4.4.1',
    definition: {
      nl: 'Een geheel van activiteiten dat waarde creëert door het leveren van een product of service.',
      en: 'A set of activities that creates value by delivering a product or service.',
    },
    note: {
      nl: 'Waardeketen = zoals ontworpen. Waardestroom = zoals daadwerkelijk uitgevoerd.',
      en: 'Value chain = as designed. Value stream = as actually performed.',
    },
  },
  {
    termEn: 'Value stream',
    termNl: 'Waardestroom',
    objective: '5.1.1',
    definition: {
      nl: 'Een reeks stappen die een organisatie gebruikt om producten en services te creëren en te leveren aan een serviceconsument.',
      en: 'A series of steps an organization uses to create and deliver products and services to a service consumer.',
    },
  },
  {
    termEn: 'Core value stream',
    termNl: 'Kernwaardestroom',
    objective: '5.1.1',
    definition: {
      nl: 'Een reeks stappen die waarde creëren voor consumenten in een vorm die is beoogd door het operationele model van de organisatie.',
      en: 'A series of steps that create value for consumers in the form intended by the organization’s operating model.',
    },
  },
  {
    termEn: 'Enabling value stream',
    termNl: 'Ondersteunende waardestroom',
    objective: '5.1.1',
    definition: {
      nl: 'De reeks stappen die waarde creëren voor interne klanten en zo de kernwaardestromen van de organisatie mogelijk maken.',
      en: 'The series of steps that create value for internal customers, thereby enabling the organization’s core value streams.',
    },
  },
  {
    termEn: 'Complexity thinking',
    termNl: 'Complexiteitsdenken',
    objective: '5.1.3',
    definition: {
      nl: 'Een benadering van analyse en besluitvorming gebaseerd op de erkenning en het begrip van de verschillende complexiteitsniveaus die inherent zijn aan systemen en hun context.',
      en: 'An approach to analysis and decision-making based on recognizing and understanding the different levels of complexity inherent in systems and their context.',
    },
    note: {
      nl: 'Vier contexten: geordend, complex, chaotisch, verward.',
      en: 'Four contexts: ordered, complex, chaotic, confused.',
    },
  },
  {
    termEn: 'Management practice',
    termNl: 'Managementwerkwijze',
    objective: '4.5.1',
    definition: {
      nl: 'Een geheel van organisatorische middelen en vermogen (capabilities), ontworpen en ingezet voor het uitvoeren van werk of het bereiken van een doelstelling.',
      en: 'A set of organizational resources and capabilities designed and deployed for performing work or accomplishing an objective.',
    },
    note: {
      nl: '34 werkwijzen: 22 product- en servicemanagement, 12 algemeen.',
      en: '34 practices: 22 product and service management, 12 general.',
    },
  },
  {
    termEn: 'Process',
    termNl: 'Proces',
    objective: '4.5.1',
    definition: {
      nl: 'Een geheel van onderling verbonden of interactieve activiteiten die input omzetten in output.',
      en: 'A set of interrelated or interacting activities that transform inputs into outputs.',
    },
  },
  {
    termEn: 'Operating model',
    termNl: 'Operationeel model / bedrijfsmodel',
    objective: '4.4.9',
    definition: {
      nl: 'Een conceptuele en/of visuele weergave van hoe een organisatie samen met haar klanten en andere belanghebbenden waarde creëert, en hoe de organisatie functioneert.',
      en: 'A conceptual and/or visual representation of how an organization creates value with its customers and other stakeholders, and how it operates.',
    },
  },
  {
    termEn: 'Incident',
    termNl: 'Incident',
    objective: '4.4.3',
    definition: {
      nl: 'Een ongeplande onderbreking van een service of een vermindering van de kwaliteit van een service.',
      en: 'An unplanned interruption to a service or reduction in the quality of a service.',
    },
  },
  {
    termEn: 'Event',
    termNl: 'Gebeurtenis',
    objective: '4.4.3',
    definition: {
      nl: 'Elke statuswijziging die van belang is voor het management van een service of ander configuratie-item.',
      en: 'Any change of state that has significance for the management of a service or other configuration item.',
    },
    note: {
      nl: 'Een event is géén onderbreking; het is een statuswijziging.',
      en: 'An event is not an interruption; it is a change of state.',
    },
  },
  {
    termEn: 'Problem',
    termNl: 'Probleem',
    objective: '4.4.8',
    definition: {
      nl: 'Een oorzaak, of mogelijke oorzaak, van een of meer incidenten.',
      en: 'A cause, or potential cause, of one or more incidents.',
    },
  },
  {
    termEn: 'Error',
    termNl: 'Fout',
    objective: '4.4.8',
    definition: {
      nl: 'Een gebrek of kwetsbaarheid die incidenten kan veroorzaken.',
      en: 'A flaw or vulnerability that may cause incidents.',
    },
  },
  {
    termEn: 'Known error',
    termNl: 'Bekende fout',
    objective: '4.4.8',
    definition: {
      nl: 'Een probleem dat is geanalyseerd, maar nog niet is opgelost.',
      en: 'A problem that has been analysed but has not been resolved.',
    },
  },
  {
    termEn: 'Disaster',
    termNl: 'Ramp',
    objective: '4.4.8',
    definition: {
      nl: 'Een plotselinge, onvoorziene gebeurtenis die grote schade of ernstig verlies veroorzaakt, waardoor de organisatie gedurende een vooraf bepaalde minimale periode geen essentiële bedrijfsactiviteiten kan uitvoeren.',
      en: 'A sudden, unplanned event that causes great damage or serious loss, leaving an organization unable to perform critical business activities for a predetermined minimum period.',
    },
  },
  {
    termEn: 'Change',
    termNl: 'Wijziging',
    objective: '4.4.4',
    definition: {
      nl: 'Het toevoegen, wijzigen of verwijderen van alles wat een direct of indirect effect kan hebben op producten en services.',
      en: 'The addition, modification or removal of anything that could have a direct or indirect effect on products and services.',
    },
  },
  {
    termEn: 'Release',
    termNl: 'Release',
    objective: '4.4.4',
    definition: {
      nl: 'Een versie van een product, service of ander configuratie-item, of een verzameling configuratie-items, die beschikbaar wordt gesteld voor gebruik.',
      en: 'A version of a product, service or other configuration item, or a collection of configuration items, that is made available for use.',
    },
  },
  {
    termEn: 'Deployment',
    termNl: 'Uitrol / implementatie',
    objective: '4.4.4',
    definition: {
      nl: 'Het verplaatsen van een servicecomponent naar een gecontroleerde omgeving.',
      en: 'The movement of a service component into a controlled environment.',
    },
  },
  {
    termEn: 'Continuous integration',
    termNl: 'Continue integratie',
    objective: '4.4.5',
    definition: {
      nl: 'Een methode waarbij ontwikkelaars hun codeaanpassingen regelmatig samenvoegen in een centrale repository, waarna geautomatiseerde builds en tests worden uitgevoerd.',
      en: 'A method in which developers regularly merge their code changes into a central repository, after which automated builds and tests are run.',
    },
  },
  {
    termEn: 'Continuous delivery',
    termNl: 'Continue oplevering',
    objective: '4.4.5',
    definition: {
      nl: 'Technieken en tools waarmee software-updates op elk gewenst moment in productie kunnen worden genomen; de uitrolbeslissing wordt per geval genomen.',
      en: 'Techniques and tools that allow software updates to be released to production at any time; the deployment decision is taken case by case.',
    },
    note: {
      nl: 'Klaar voor productie, uitrol handmatig.',
      en: 'Production-ready, deployment manual.',
    },
  },
  {
    termEn: 'Continuous deployment',
    termNl: 'Continue uitrol',
    objective: '4.4.5',
    definition: {
      nl: 'Technieken en tools waarmee elke wijziging die de geautomatiseerde tests doorstaat automatisch naar productie wordt uitgerold, zonder verdere autorisatie.',
      en: 'Techniques and tools that automatically deploy every change passing automated tests to production, without further authorization.',
    },
    note: {
      nl: 'Gebaseerd op continuous delivery. Automatische productie-uitrol.',
      en: 'Built on continuous delivery. Automatic production deployment.',
    },
  },
  {
    termEn: 'Reliability',
    termNl: 'Betrouwbaarheid',
    objective: '4.4.6',
    definition: {
      nl: 'Het vermogen van een product of service om gedurende een bepaalde tijd of een bepaald aantal cycli naar behoren te functioneren.',
      en: 'The ability of a product or service to perform as required for a given time or number of cycles.',
    },
  },
  {
    termEn: 'Site Reliability Engineering (SRE)',
    termNl: 'Site Reliability Engineering',
    objective: '4.4.6',
    definition: {
      nl: 'Een discipline die aspecten van software-engineering toepast op infrastructuur- en operationele problemen, gericht op schaalbare en zeer betrouwbare systemen, met sterke nadruk op automatisering.',
      en: 'A discipline that applies aspects of software engineering to infrastructure and operations problems, aiming for highly scalable and reliable systems, with a strong focus on automation.',
    },
  },
  {
    termEn: 'Observability',
    termNl: 'Observeerbaarheid',
    objective: '4.4.6',
    definition: {
      nl: 'Het vermogen om de interne toestand van een complex systeem te begrijpen door de externe output ervan te analyseren, zoals metrics, logboeken en traces.',
      en: 'The ability to understand the internal state of a complex system by analysing its external outputs, such as metrics, logs and traces.',
    },
  },
  {
    termEn: 'Service request',
    termNl: 'Serviceaanvraag',
    objective: '4.4.7',
    definition: {
      nl: 'Een verzoek van een gebruiker of een door de gebruiker gemachtigde vertegenwoordiger dat leidt tot een serviceactie die volgens de overeenkomst onderdeel is van de standaard serviceverlening.',
      en: 'A request from a user or a user’s authorized representative that initiates a service action agreed as a normal part of service delivery.',
    },
    note: {
      nl: 'Er is niets kapot: dit is normale, overeengekomen dienstverlening.',
      en: 'Nothing is broken: this is normal, agreed service delivery.',
    },
  },
  {
    termEn: 'Product specification',
    termNl: 'Productspecificatie',
    objective: '4.4.2',
    definition: {
      nl: 'Een gedetailleerde beschrijving van de cruciale aspecten, vereisten en kenmerken van een te ontwikkelen product.',
      en: 'A detailed description of the crucial aspects, requirements and characteristics of a product to be developed.',
    },
  },
  {
    termEn: 'Product prototype',
    termNl: 'Productprototype',
    objective: '4.4.2',
    definition: {
      nl: 'Een eerste versie van een product die de basisvorm, functionaliteit en operationele mogelijkheden demonstreert, gebruikt om ontwerp en hypotheses te toetsen.',
      en: 'An early version of a product demonstrating basic form, functionality and operational capability, used to test design and hypotheses.',
    },
  },
  {
    termEn: 'Critical success factor (CSF)',
    termNl: 'Kritieke succesfactor',
    objective: '4.5.6',
    definition: {
      nl: 'Een noodzakelijke voorwaarde die vervuld moet zijn om succes te bereiken.',
      en: 'A necessary precondition that must be fulfilled for success to be achieved.',
    },
    note: {
      nl: 'CSF = de voorwaarde. KPI/metric = de meting of eraan is voldaan.',
      en: 'CSF = the condition. KPI/metric = the measurement of whether it is met.',
    },
  },
  {
    termEn: 'Metric',
    termNl: 'Meetwaarde',
    objective: '4.5.6',
    definition: {
      nl: 'Een meetwaarde die wordt gebruikt om iets te evalueren of te managen.',
      en: 'A measurement used to evaluate or manage something.',
    },
  },
  {
    termEn: 'AI governance',
    termNl: 'AI-governance',
    objective: '6.2.1',
    definition: {
      nl: 'Het geheel van kaders, beleid en beheersmaatregelen dat het verantwoorde, ethische en compliant gebruik van AI binnen een organisatie borgt.',
      en: 'The set of frameworks, policies and controls that ensure responsible, ethical and compliant use of AI within an organization.',
    },
  },
  {
    termEn: 'Data governance',
    termNl: 'Data governance',
    objective: '6.2.1',
    definition: {
      nl: 'Een systeem van regels, beleid, standaarden, processen en beheersmaatregelen die organisaties implementeren om hun data-activa effectief te managen.',
      en: 'A system of rules, policies, standards, processes and controls that organizations implement to manage their data assets effectively.',
    },
  },
  {
    termEn: "Conway's Law",
    termNl: 'De wet van Conway',
    objective: '2.2.2',
    definition: {
      nl: 'De structuur van de systemen die een organisatie ontwerpt is een kopie van de communicatiestructuur binnen die organisatie.',
      en: 'The structure of the systems an organization designs is a copy of the communication structure within that organization.',
    },
    note: {
      nl: 'De omgekeerde aanpak: structureer teams bewust zó dat de gewenste architectuur ontstaat.',
      en: 'The inverse manoeuvre: deliberately structure teams so the intended architecture emerges.',
    },
  },
  {
    termEn: 'PESTLE',
    termNl: 'PESTLE',
    objective: '2.2.1',
    definition: {
      nl: 'De externe factoren die de vier dimensies beïnvloeden: Politiek, Economisch, Sociaal, Technologisch, Juridisch (Legal) en Milieu (Environmental).',
      en: 'The external factors influencing the four dimensions: Political, Economic, Social, Technological, Legal and Environmental.',
    },
  },
  {
    termEn: 'Culture',
    termNl: 'Cultuur',
    objective: '2.2.2',
    definition: {
      nl: 'Een geheel van waarden dat door een groep mensen wordt gedeeld en tot uiting komt in hun gedrag, ideeën, overtuigingen en gebruiken.',
      en: 'A set of values shared by a group of people, expressed in their behaviour, ideas, beliefs and customs.',
    },
  },
  {
    termEn: 'Safety culture',
    termNl: 'Veiligheidscultuur',
    objective: '2.2.2',
    definition: {
      nl: 'Een organisatiecultuur waarin mensen zich op hun gemak voelen om zichzelf te zijn en zichzelf te uiten.',
      en: 'An organizational culture in which people feel comfortable being and expressing themselves.',
    },
  },
];
