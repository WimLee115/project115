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
 * De definities zijn eigen formuleringen. In 1.0.0 waren ze woordelijk
 * overgenomen uit het officiële materiaal; in 1.1.0 zijn ze herschreven met de
 * betekenis als uitgangspunt. Schrijf een nieuwe definitie dus in eigen
 * bewoording, en neem er geen over uit een reference manual of preparation
 * guide.
 *
 * Eén uitzondering, en die is belangrijk: de benamingen blijven staan. De vier
 * dimensies, de acht levenscyclusactiviteiten, de vijf componenten van het
 * waardesysteem, en de losse woorden waar het examen op toetst — vermogen,
 * verantwoordelijk, waargenomen. Bij een 'missing word'-vraag is precies dat
 * woord het antwoord; parafraseren maakt de vraag onbeantwoordbaar.
 *
 * Dit glossarium toetst of je de stof kent; het is geen vervanging van het
 * cursusmateriaal.
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
      nl: 'Een vorm van dienstverlening waarbij aanbieder en afnemer samen waarde tot stand brengen: de afnemer bereikt de uitkomsten die hij nastreeft, terwijl het beheersen van de bijbehorende kosten en risico’s bij de aanbieder blijft liggen.',
      en: 'A form of provision in which supplier and consumer bring about value together: the consumer reaches the outcomes it is after, while responsibility for the associated costs and risks stays with the supplier.',
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
      nl: 'Middelen van een organisatie, zo samengesteld dat die samenstelling bedoeld is om een afnemer waarde te bieden.',
      en: 'Resources of an organization, put together in an arrangement meant to offer a consumer value.',
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
      nl: 'Een product waarvan de samenstelling op digitale technologie berust en dat langs die weg baat oplevert voor afnemers.',
      en: 'A product whose make-up rests on digital technology and that brings consumers benefit by that route.',
    },
  },
  {
    termEn: 'Digital service',
    termNl: 'Digitale service',
    objective: '1.1.3',
    definition: {
      nl: 'Een service die zonder digitale producten niet of nauwelijks te leveren valt.',
      en: 'A service that could not be delivered, or barely so, without digital products.',
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
      nl: 'De zekerheid dat een product of service nu én later blijft voldoen aan wat er op drie terreinen wordt gevraagd: zorgvuldig omgaan met de omgeving, bijdragen aan de samenleving, en economisch houdbaar blijven.',
      en: 'The assurance that a product or service keeps meeting what is asked of it on three fronts — careful handling of the environment, contribution to society, and economic viability — now and later.',
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
      nl: 'Alles wat een gebruiker meemaakt in de omgang met een service en met de partij die hem levert, zowel het praktische als het gevoelsmatige.',
      en: 'Everything a user goes through in dealing with a service and with the party providing it, on the practical level as well as the emotional one.',
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
      nl: 'Het voordeel, het nut en het belang dat iemand aan iets toekent — zoals díe persoon het ervaart.',
      en: 'The benefit, usefulness and importance someone attaches to something — as that person experiences it.',
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
      nl: 'Wat een belanghebbende uiteindelijk bereikt doordat er een of meer outputs zijn opgeleverd.',
      en: 'What a stakeholder ends up achieving because one or more outputs were delivered.',
    },
  },
  {
    termEn: 'Cost',
    termNl: 'Kosten',
    objective: '1.3.2',
    definition: {
      nl: 'Het geld dat aan een bepaalde activiteit, resource, product of service is besteed.',
      en: 'The money that has gone into a particular activity, resource, product or service.',
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
      nl: 'Iets dat zich kan voordoen en dan schade of verlies oplevert, of het halen van doelstellingen bemoeilijkt.',
      en: 'Something that may occur and, if it does, brings damage or loss or gets in the way of meeting objectives.',
    },
  },
  {
    termEn: 'Service offering',
    termNl: 'Serviceaanbod',
    objective: '1.2.1',
    definition: {
      nl: 'Een vastgelegde omschrijving van een of meer services, toegesneden op wat een bepaalde groep afnemers nodig heeft. Daarin kunnen goederen zitten, toegang tot middelen, en handelingen die voor de afnemer worden verricht.',
      en: 'A documented description of one or more services, tailored to what a particular group of consumers needs. It may cover goods, access to resources, and actions carried out on the consumer’s behalf.',
    },
  },
  {
    termEn: 'Organization',
    termNl: 'Organisatie',
    objective: '1.4.1',
    definition: {
      nl: 'Eén persoon of een groep mensen die over eigen taken, verantwoordelijkheden, bevoegdheden en onderlinge verhoudingen beschikt om de eigen doelen te halen.',
      en: 'One person or a group of people with their own tasks, responsibilities, authorities and working relationships, aimed at meeting objectives of their own.',
    },
  },
  {
    termEn: 'Service provider',
    termNl: 'Serviceprovider',
    objective: '1.4.1',
    definition: {
      nl: 'De organisatie die de verantwoordelijkheid draagt voor het leveren en ondersteunen van services.',
      en: 'The organization bearing responsibility for supplying services and supporting them.',
    },
  },
  {
    termEn: 'Service consumer',
    termNl: 'Serviceconsument',
    objective: '1.4.1',
    definition: {
      nl: 'De organisatie die de verantwoordelijkheid draagt voor het inkopen of anderszins verkrijgen van services, en voor het gebruik ervan.',
      en: 'The organization bearing responsibility for buying or otherwise obtaining services, and for using them.',
    },
  },
  {
    termEn: 'Digital product vendor',
    termNl: 'Leverancier van digitale producten',
    objective: '1.4.1',
    definition: {
      nl: 'De organisatie die de verantwoordelijkheid draagt voor het maken en het blijven verbeteren van digitale producten en het serviceaanbod eromheen.',
      en: 'The organization bearing responsibility for building digital products and the service offerings around them, and for keeping both improving.',
    },
  },
  {
    termEn: 'Sponsor',
    termNl: 'Sponsor',
    objective: '1.4.4',
    definition: {
      nl: 'De rol die het budget fiatteert waaruit services worden afgenomen.',
      en: 'The role that sanctions the budget out of which services are obtained.',
    },
  },
  {
    termEn: 'Customer',
    termNl: 'Klant',
    objective: '1.4.4',
    definition: {
      nl: 'De rol die vastlegt wat producten en services moeten kunnen, en die aanspreekbaar is op wat het gebruik ervan oplevert.',
      en: 'The role that lays down what products and services must be able to do, and that answers for what their use yields.',
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
      nl: 'Alle eigenschappen van een service bij elkaar, voor zover die bepalen of hij voorziet in wat er gevraagd is — uitgesproken of niet.',
      en: 'All the properties of a service taken together, insofar as they determine whether it provides what was asked for, spelled out or not.',
    },
  },
  {
    termEn: 'Service level',
    termNl: 'Serviceniveau',
    objective: '1.4.5',
    definition: {
      nl: 'De meetwaarden waarmee je vastlegt welke servicekwaliteit verwacht wordt, of welke er behaald is.',
      en: 'The metrics by which you pin down the service quality that is expected, or the one that was reached.',
    },
  },
  {
    termEn: 'Service level agreement (SLA)',
    termNl: 'Serviceniveauovereenkomst',
    objective: '1.4.6',
    definition: {
      nl: 'Een vastgelegde afspraak tussen aanbieder en klant, waarin staat welke services worden geleverd en welk niveau daarbij per service is afgesproken.',
      en: 'A written arrangement between provider and customer setting out which services are supplied and what level has been agreed for each of them.',
    },
  },
  {
    termEn: 'Continual improvement',
    termNl: 'Voortdurend verbeteren',
    objective: '1.1.4',
    definition: {
      nl: 'Werk dat een organisatie steeds opnieuw en op elk niveau oppakt, om te blijven waarmaken wat belanghebbenden van haar verwachten.',
      en: 'Work an organization takes up again and again, at every level, so that it keeps living up to what stakeholders expect of it.',
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
      nl: 'Het geheel van sturing en toezicht waarmee een organisatie op koers wordt gehouden.',
      en: 'The arrangement of direction and oversight that keeps an organization on course.',
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
      nl: 'De activiteiten die samen waarde opleveren doordat er een product of service uit voortkomt.',
      en: 'The activities that jointly yield value because a product or service comes out of them.',
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
      nl: 'De opeenvolging van stappen waarmee een organisatie producten en services tot stand brengt en bij de afnemer krijgt.',
      en: 'The succession of steps by which an organization brings products and services into being and gets them to the consumer.',
    },
  },
  {
    termEn: 'Core value stream',
    termNl: 'Kernwaardestroom',
    objective: '5.1.1',
    definition: {
      nl: 'Een waardestroom die afnemers precies datgene oplevert waarvoor het operationele model van de organisatie is ingericht.',
      en: 'A value stream that yields consumers exactly what the organization’s operating model is set up to provide.',
    },
  },
  {
    termEn: 'Enabling value stream',
    termNl: 'Ondersteunende waardestroom',
    objective: '5.1.1',
    definition: {
      nl: 'Een waardestroom die intern waarde oplevert en daarmee de kernwaardestromen hun werk laat doen.',
      en: 'A value stream that yields value internally and thereby lets the core value streams do their work.',
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
      nl: 'Middelen en vermogen (capabilities) van een organisatie, bij elkaar gebracht en ingezet om werk te verzetten of een doel te halen.',
      en: 'An organization’s resources and capabilities, brought together and put to work to get something done or reach an objective.',
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
      nl: 'Activiteiten die op elkaar ingrijpen en samen input tot output verwerken.',
      en: 'Activities that act on one another and together work inputs up into outputs.',
    },
  },
  {
    termEn: 'Operating model',
    termNl: 'Operationeel model / bedrijfsmodel',
    objective: '4.4.9',
    definition: {
      nl: 'Een beschrijving of schema van de manier waarop een organisatie werkt en waarop zij samen met klanten en andere belanghebbenden waarde tot stand brengt.',
      en: 'A description or diagram of the way an organization works, and of how it brings about value together with customers and other stakeholders.',
    },
  },
  {
    termEn: 'Incident',
    termNl: 'Incident',
    objective: '4.4.3',
    definition: {
      nl: 'Een onderbreking van een service die niet gepland was, of een terugval in de kwaliteit ervan.',
      en: 'An interruption to a service that was not planned, or a drop in its quality.',
    },
  },
  {
    termEn: 'Event',
    termNl: 'Gebeurtenis',
    objective: '4.4.3',
    definition: {
      nl: 'Een toestandsverandering die ertoe doet voor het beheer van een service of ander configuratie-item.',
      en: 'A shift in state that matters for managing a service or other configuration item.',
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
      nl: 'Datgene waar een of meer incidenten uit voortkomen, of uit voort zouden kunnen komen.',
      en: 'Whatever one or more incidents stem from, or could stem from.',
    },
  },
  {
    termEn: 'Error',
    termNl: 'Fout',
    objective: '4.4.8',
    definition: {
      nl: 'Een mankement of zwakke plek waaruit incidenten kunnen ontstaan.',
      en: 'A defect or weak spot from which incidents can arise.',
    },
  },
  {
    termEn: 'Known error',
    termNl: 'Bekende fout',
    objective: '4.4.8',
    definition: {
      nl: 'Een probleem dat is doorgrond zonder dat het al verholpen is.',
      en: 'A problem that has been got to the bottom of without yet being put right.',
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
      nl: 'Iets erbij zetten, aanpassen of weghalen, waar producten en services rechtstreeks of langs een omweg iets van kunnen merken.',
      en: 'Adding, adjusting or taking away anything that products and services could feel the effects of, straight away or by way of something else.',
    },
  },
  {
    termEn: 'Release',
    termNl: 'Release',
    objective: '4.4.4',
    definition: {
      nl: 'Een uitvoering van een product, een service of een of meer configuratie-items, zoals die voor gebruik wordt vrijgegeven.',
      en: 'An edition of a product, a service or one or more configuration items, as it is released for use.',
    },
  },
  {
    termEn: 'Deployment',
    termNl: 'Uitrol / implementatie',
    objective: '4.4.4',
    definition: {
      nl: 'Een servicecomponent overbrengen naar een omgeving die onder beheer staat.',
      en: 'Moving a service component across into an environment that is under control.',
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
      nl: 'Het vermogen van een product of service om naar behoren te blijven werken, een afgesproken periode lang of een afgesproken aantal cycli achtereen.',
      en: 'The capacity of a product or service to keep working as it should, for an agreed span of time or an agreed number of cycles in a row.',
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
      nl: 'Kunnen doorgronden wat er binnen in een ingewikkeld systeem gebeurt, puur op grond van wat het naar buiten afgeeft: metrics, logboeken en traces.',
      en: 'Being able to work out what goes on inside a complicated system purely from what it gives off: metrics, logs and traces.',
    },
  },
  {
    termEn: 'Service request',
    termNl: 'Serviceaanvraag',
    objective: '4.4.7',
    definition: {
      nl: 'Een aanvraag van een gebruiker, of van iemand die namens hem mag optreden, waarop een serviceactie volgt die als gewoon onderdeel van de dienstverlening is afgesproken.',
      en: 'A request from a user, or from someone entitled to act for them, that sets off a service action agreed to be a routine part of the service.',
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
      nl: 'Systemen die een organisatie ontwerpt, kopiëren de manier waarop er binnen die organisatie met elkaar wordt gecommuniceerd.',
      en: 'Systems an organization designs copy the way people inside that organization communicate with one another.',
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
      nl: 'De waarden die een groep mensen met elkaar deelt, zichtbaar in hoe zij zich gedragen en in wat zij denken, geloven en gewoon zijn te doen.',
      en: 'The values a group of people hold in common, showing in how they behave and in what they think, believe and are used to doing.',
    },
  },
  {
    termEn: 'Safety culture',
    termNl: 'Veiligheidscultuur',
    objective: '2.2.2',
    definition: {
      nl: 'Een organisatiecultuur waarin niemand zich hoeft in te houden om te zeggen wat hij vindt of te zijn wie hij is.',
      en: 'An organizational culture where no one has to hold back from saying what they think or being who they are.',
    },
  },
];
