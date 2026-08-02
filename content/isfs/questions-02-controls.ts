import type { QuestionSeed } from '../types';

/**
 * EXIN ISFS — domein 3: Beheersmaatregelen (52,5%).
 *
 * Meer dan de helft van het examen. Onderverdeeld naar de vier control-thema's
 * van ISO/IEC 27001:2022 Annex A: organisatorisch, mensen, fysiek en
 * technologisch, plus het overkoepelende onderscheid naar soort maatregel.
 */

export const questions: QuestionSeed[] = [
  /* --- 3.1 Soorten beheersmaatregelen --------------------------------- */
  {
    id: 'isfs-q019',
    objective: '3.1.1',
    type: 'standard',
    bloom: 1,
    difficulty: 2,
    stem: {
      nl: 'Een organisatie installeert een inbraakalarm dat afgaat zodra iemand na sluitingstijd het pand betreedt. Om welk soort beheersmaatregel gaat het?',
      en: 'An organization installs a burglar alarm that sounds as soon as someone enters the premises after closing time. What type of control is this?',
    },
    options: [
      { text: { nl: 'Detectief', en: 'Detective' }, correct: true },
      {
        text: { nl: 'Preventief', en: 'Preventive' },
        rationale: {
          nl: 'Preventief voorkomt dat een incident optreedt, bijvoorbeeld een slot of een hek. Het alarm voorkomt de inbraak niet, het signaleert die.',
          en: 'Preventive stops an incident from occurring, for example a lock or a fence. The alarm does not prevent the break-in, it signals it.',
        },
      },
      {
        text: { nl: 'Repressief', en: 'Repressive' },
        rationale: {
          nl: 'Repressief beperkt de gevolgen tijdens het incident, bijvoorbeeld een sprinklerinstallatie of het uitschakelen van een gecompromitteerd account.',
          en: 'Repressive limits consequences during the incident, for example a sprinkler system or disabling a compromised account.',
        },
      },
      {
        text: { nl: 'Correctief', en: 'Corrective' },
        rationale: {
          nl: 'Correctief herstelt de situatie na afloop, bijvoorbeeld een back-up terugzetten.',
          en: 'Corrective restores the situation afterwards, for example restoring a backup.',
        },
      },
    ],
    explanation: {
      nl: 'Beveiligingsmaatregelen zijn gericht op een moment in de incidentcyclus (dreiging → incident → schade → herstel): reductief (dreigingen verkleinen), preventief (incidenten voorkomen), detectief (incidenten signaleren), repressief (de gevolgen tijdens het incident beperken), correctief (de ontstane schade herstellen) en evaluatief (achteraf leren en bijsturen). Daarnaast bestaan de risico-opties verzekeren, accepteren en ontwijken. Een alarm signaleert en is dus detectief.',
      en: 'Security controls target a moment in the incident cycle (threat → incident → damage → recovery): reductive (reduce threats), preventive (prevent incidents), detective (detect incidents), repressive (limit consequences during the incident), corrective (repair the damage caused) and evaluative (learn and adjust afterwards). Alongside these are the risk options of insuring, accepting and avoiding. An alarm detects and is therefore detective.',
    },
    source: 'Exameneis 3.1.1',
  },
  {
    id: 'isfs-q020',
    objective: '3.1.1',
    type: 'standard',
    bloom: 1,
    difficulty: 2,
    stem: {
      nl: 'Het terugzetten van een back-up na een ransomware-aanval is een voorbeeld van welke soort beheersmaatregel?',
      en: 'Restoring a backup after a ransomware attack is an example of which type of control?',
    },
    options: [
      { text: { nl: 'Correctief', en: 'Corrective' }, correct: true },
      {
        text: { nl: 'Repressief', en: 'Repressive' },
        rationale: {
          nl: 'Let op dit onderscheid: het máken van back-ups geldt als repressieve maatregel, omdat het de schade bij een incident beperkt. Het terugzetten ervan valt onder herstel en is dus correctief.',
          en: 'Note this distinction: making backups counts as a repressive control because it limits the damage of an incident. Restoring them falls under recovery and is therefore corrective.',
        },
      },
      {
        text: { nl: 'Detectief', en: 'Detective' },
        rationale: {
          nl: 'Detectief zou de virusscanner of het SIEM zijn dat de aanval signaleert.',
          en: 'Detective would be the antivirus or SIEM that signals the attack.',
        },
      },
      {
        text: { nl: 'Verzekering', en: 'Insurance' },
        rationale: {
          nl: 'Verzekering draagt de financiële gevolgen over aan een derde, maar herstelt de gegevens niet.',
          en: 'Insurance transfers the financial consequences to a third party but does not restore the data.',
        },
      },
    ],
    explanation: {
      nl: 'Correctieve maatregelen herstellen de ontstane schade nadat een incident heeft plaatsgevonden. Een veelgemaakte fout op het examen: het máken van een back-up is een repressieve maatregel (het beperkt de schade die een incident aanricht), terwijl het terúgzetten ervan correctief is (het herstelt). Dezelfde back-up, twee verschillende momenten in de incidentcyclus. Uitwijken naar een reservelocatie geldt overigens ook als repressief.',
      en: 'Corrective controls repair the damage caused after an incident has occurred. A common exam trap: making a backup is a repressive control (it limits the damage an incident causes), while restoring it is corrective (it repairs). The same backup, two different moments in the incident cycle. Switching to a fallback location also counts as repressive.',
    },
    source: 'Exameneis 3.1.1',
  },

  /* --- 3.2 Organisatorische beheersmaatregelen ------------------------ */
  {
    id: 'isfs-q021',
    objective: '3.2.1',
    type: 'standard',
    bloom: 2,
    difficulty: 2,
    stem: {
      nl: 'Wie bepaalt binnen een organisatie welke classificatie een informatiemiddel krijgt?',
      en: 'Who determines within an organization what classification an information asset receives?',
    },
    options: [
      {
        text: { nl: 'De eigenaar van het informatiemiddel', en: 'The owner of the information asset' },
        correct: true,
      },
      {
        text: {
          nl: 'De systeembeheerder waar de gegevens zijn opgeslagen',
          en: 'The system administrator where the data are stored',
        },
        rationale: {
          nl: 'De beheerder is verantwoordelijk voor de technische bewaring, niet voor het bepalen van de waarde en gevoeligheid.',
          en: 'The administrator is responsible for technical custody, not for determining value and sensitivity.',
        },
      },
      {
        text: {
          nl: 'De security officer',
          en: 'The security officer',
        },
        rationale: {
          nl: 'De security officer stelt het classificatieschema op en adviseert, maar de eigenaar past het toe op zijn informatie.',
          en: 'The security officer defines the classification scheme and advises, but the owner applies it to their information.',
        },
      },
      {
        text: {
          nl: 'Iedere gebruiker die met de gegevens werkt',
          en: 'Every user who works with the data',
        },
        rationale: {
          nl: 'Gebruikers moeten de classificatie kennen en naleven, maar niet zelf vaststellen.',
          en: 'Users must know and comply with the classification, but not set it themselves.',
        },
      },
    ],
    explanation: {
      nl: 'Classificatie bepaalt hoe gevoelig informatie is en welke maatregelen daarbij horen. Elk informatiemiddel heeft een eigenaar die de waarde kent en daarom de classificatie vaststelt. De classificatie bepaalt vervolgens de eisen aan opslag, transport, toegang, bewaartermijn en vernietiging. Labeling maakt de classificatie zichtbaar voor gebruikers.',
      en: 'Classification determines how sensitive information is and which controls apply. Every information asset has an owner who knows its value and therefore sets the classification. The classification then drives requirements for storage, transport, access, retention and destruction. Labelling makes the classification visible to users.',
    },
    source: 'Exameneis 3.2.1',
  },
  {
    id: 'isfs-q022',
    objective: '3.2.2',
    type: 'standard',
    bloom: 1,
    difficulty: 2,
    stem: {
      nl: 'Wat houdt het need-to-know-principe in?',
      en: 'What does the need-to-know principle entail?',
    },
    options: [
      {
        text: {
          nl: 'Medewerkers krijgen alleen toegang tot de informatie die zij nodig hebben voor de uitvoering van hun taak',
          en: 'Employees only receive access to the information they need to perform their task',
        },
        correct: true,
      },
      {
        text: {
          nl: 'Alle medewerkers moeten op de hoogte zijn van het informatiebeveiligingsbeleid',
          en: 'All employees must be aware of the information security policy',
        },
        rationale: {
          nl: 'Dat is bewustwording; need-to-know gaat specifiek over het beperken van toegang.',
          en: 'That is awareness; need-to-know specifically concerns restricting access.',
        },
      },
      {
        text: {
          nl: 'Informatie mag alleen worden gedeeld nadat de directie toestemming heeft gegeven',
          en: 'Information may only be shared after management has given permission',
        },
        rationale: {
          nl: 'Autorisatie hoort bij een rol of functie; individuele directietoestemming per geval is niet werkbaar.',
          en: 'Authorization belongs to a role or function; individual management approval per case is unworkable.',
        },
      },
      {
        text: {
          nl: 'Iedereen binnen een afdeling heeft dezelfde toegangsrechten',
          en: 'Everyone within a department has the same access rights',
        },
        rationale: {
          nl: 'Dit is juist het tegenovergestelde: toegang wordt bepaald door de taak, niet door de afdeling.',
          en: 'This is the opposite: access is determined by the task, not by the department.',
        },
      },
    ],
    explanation: {
      nl: 'Need-to-know beperkt toegang tot wat nodig is voor de taak; het verwante least privilege beperkt rechten tot het minimaal benodigde niveau. Samen met functiescheiding (segregation of duties) voorkomen ze dat één persoon een proces volledig alleen kan uitvoeren en misbruiken. Toegangsrechten moeten periodiek worden herzien, zeker bij functiewisseling en uitdiensttreding.',
      en: 'Need-to-know restricts access to what is required for the task; the related least privilege restricts rights to the minimum level needed. Together with segregation of duties they prevent one person from executing and abusing an entire process alone. Access rights must be reviewed periodically, especially on role change and departure.',
    },
    source: 'Exameneis 3.2.2',
  },
  {
    id: 'isfs-q023',
    objective: '3.2.2',
    type: 'standard',
    bloom: 2,
    difficulty: 2,
    stem: {
      nl: 'In een financieel proces mag degene die een betaling invoert deze niet zelf goedkeuren. Welke maatregel is dit?',
      en: 'In a financial process, the person entering a payment may not approve it themselves. Which control is this?',
    },
    options: [
      { text: { nl: 'Functiescheiding', en: 'Segregation of duties' }, correct: true },
      {
        text: { nl: 'Least privilege', en: 'Least privilege' },
        rationale: {
          nl: 'Least privilege beperkt de omvang van rechten van één persoon; functiescheiding verdeelt een proces bewust over meerdere personen.',
          en: 'Least privilege limits the extent of one person’s rights; segregation of duties deliberately splits a process across multiple people.',
        },
      },
      {
        text: { nl: 'Tweefactorauthenticatie', en: 'Two-factor authentication' },
        rationale: {
          nl: 'Dat is een technische maatregel om de identiteit te verifiëren, niet om bevoegdheden te scheiden.',
          en: 'That is a technical control for verifying identity, not for separating authority.',
        },
      },
      {
        text: { nl: 'Clear desk policy', en: 'Clear desk policy' },
        rationale: {
          nl: 'Dat is een maatregel om gevoelige informatie niet onbeheerd op werkplekken te laten liggen.',
          en: 'That is a control to prevent sensitive information being left unattended on desks.',
        },
      },
    ],
    explanation: {
      nl: 'Functiescheiding verdeelt taken en bevoegdheden zo dat één persoon een proces niet volledig alleen kan uitvoeren. Dat verlaagt de kans op fraude én op onopgemerkte fouten. Het vierogenprincipe is een concrete toepassing hiervan. Waar functiescheiding niet haalbaar is, zijn compenserende maatregelen nodig, zoals extra logging en controle achteraf.',
      en: 'Segregation of duties splits tasks and authorities so no single person can execute an entire process alone. That lowers the chance of fraud and of undetected errors. The four-eyes principle is a concrete application. Where segregation is not feasible, compensating controls are needed, such as additional logging and after-the-fact review.',
    },
    source: 'Exameneis 3.2.2',
  },
  {
    id: 'isfs-q024',
    objective: '3.2.3',
    type: 'standard',
    bloom: 2,
    difficulty: 2,
    stem: {
      nl: 'Waarom is het belangrijk dat medewerkers ook vermoedens van een beveiligingsincident melden, en niet alleen bevestigde incidenten?',
      en: 'Why is it important that employees also report suspected security incidents, and not only confirmed ones?',
    },
    options: [
      {
        text: {
          nl: 'Omdat vroege signalering de schade beperkt; wachten op zekerheid kost tijd waarin het incident zich verder ontwikkelt',
          en: 'Because early detection limits damage; waiting for certainty costs time during which the incident develops further',
        },
        correct: true,
      },
      {
        text: {
          nl: 'Omdat de AVG voorschrijft dat elk vermoeden binnen 72 uur bij de toezichthouder wordt gemeld',
          en: 'Because the GDPR requires every suspicion to be reported to the supervisory authority within 72 hours',
        },
        rationale: {
          nl: 'De meldplicht van 72 uur geldt voor datalekken met risico voor betrokkenen, niet voor elk intern vermoeden.',
          en: 'The 72-hour notification duty applies to data breaches posing a risk to data subjects, not to every internal suspicion.',
        },
      },
      {
        text: {
          nl: 'Omdat het aantal meldingen een prestatie-indicator is voor de securityafdeling',
          en: 'Because the number of reports is a performance indicator for the security department',
        },
        rationale: {
          nl: 'Meldingen tellen is geen doel op zich; het doel is schadebeperking en leren.',
          en: 'Counting reports is not an end in itself; the goal is limiting damage and learning.',
        },
      },
      {
        text: {
          nl: 'Omdat medewerkers anders aansprakelijk zijn voor de schade',
          en: 'Because employees would otherwise be liable for the damage',
        },
        rationale: {
          nl: 'Een meldcultuur werkt alleen zonder angst voor sancties; dreigen met aansprakelijkheid onderdrukt meldingen juist.',
          en: 'A reporting culture only works without fear of sanctions; threatening liability suppresses reporting.',
        },
      },
    ],
    explanation: {
      nl: 'Incidentmanagement in de context van informatiebeveiliging: melden, registreren, beoordelen, reageren, oplossen en leren. Vroege melding beperkt de schade. Een meldcultuur zonder angst voor sancties is essentieel — als medewerkers bang zijn om te melden, blijven incidenten onzichtbaar tot ze groot zijn. Elk incident levert bovendien input voor verbetering.',
      en: 'Incident management in the information security context: report, record, assess, respond, resolve and learn. Early reporting limits damage. A reporting culture free from fear of sanctions is essential — if employees are afraid to report, incidents stay invisible until they are large. Every incident also provides input for improvement.',
    },
    source: 'Exameneis 3.2.3',
  },
  {
    id: 'isfs-q025',
    objective: '3.2.3',
    type: 'standard',
    bloom: 2,
    difficulty: 2,
    stem: {
      nl: 'Wat is het doel van kwetsbaarhedenmanagement?',
      en: 'What is the purpose of vulnerability management?',
    },
    options: [
      {
        text: {
          nl: 'Kwetsbaarheden tijdig identificeren, beoordelen op risico en verhelpen voordat ze kunnen worden misbruikt',
          en: 'Identifying vulnerabilities in time, assessing their risk and remediating them before they can be exploited',
        },
        correct: true,
      },
      {
        text: {
          nl: 'Alle beschikbare patches direct installeren zodra ze uitkomen',
          en: 'Installing all available patches immediately upon release',
        },
        rationale: {
          nl: 'Patchen is een middel, geen doel. Patches moeten worden beoordeeld en getest; blind installeren kan zelf een storing veroorzaken.',
          en: 'Patching is a means, not an end. Patches must be assessed and tested; installing blindly can itself cause an outage.',
        },
      },
      {
        text: {
          nl: 'Aanvallers identificeren die het netwerk scannen',
          en: 'Identifying attackers scanning the network',
        },
        rationale: {
          nl: 'Dat is dreigingsmanagement en monitoring; kwetsbaarhedenmanagement richt zich op de eigen zwakheden.',
          en: 'That is threat management and monitoring; vulnerability management focuses on your own weaknesses.',
        },
      },
      {
        text: {
          nl: 'Vaststellen welke medewerkers de meeste beveiligingsfouten maken',
          en: 'Determining which employees make the most security mistakes',
        },
        rationale: {
          nl: 'Dat past niet bij een lerende beveiligingscultuur en is geen onderdeel van kwetsbaarhedenmanagement.',
          en: 'That does not fit a learning security culture and is not part of vulnerability management.',
        },
      },
    ],
    explanation: {
      nl: 'Kwetsbaarhedenmanagement is een doorlopend proces: inventariseren welke systemen er zijn, scannen op bekende kwetsbaarheden, prioriteren op basis van risico (niet alleen op technische ernst) en verhelpen door te patchen, te configureren of tijdelijk te compenseren. Dreigingsmanagement kijkt naar wat er van buiten op je afkomt; kwetsbaarhedenmanagement naar waar je zelf zwak staat.',
      en: 'Vulnerability management is an ongoing process: inventory which systems exist, scan for known vulnerabilities, prioritize based on risk (not just technical severity) and remediate by patching, reconfiguring or applying temporary compensating controls. Threat management looks at what is coming at you from outside; vulnerability management at where you are weak.',
    },
    source: 'Exameneis 3.2.3',
  },
  {
    id: 'isfs-q026',
    objective: '3.2.4',
    type: 'standard',
    bloom: 2,
    difficulty: 2,
    stem: {
      nl: 'Wat geeft de Recovery Time Objective (RTO) aan?',
      en: 'What does the Recovery Time Objective (RTO) indicate?',
    },
    options: [
      {
        text: {
          nl: 'De maximaal aanvaardbare tijd waarbinnen een proces of systeem weer beschikbaar moet zijn',
          en: 'The maximum acceptable time within which a process or system must be available again',
        },
        correct: true,
      },
      {
        text: {
          nl: 'De maximaal aanvaardbare hoeveelheid gegevensverlies, uitgedrukt in tijd',
          en: 'The maximum acceptable amount of data loss, expressed in time',
        },
        rationale: {
          nl: 'Dat is de Recovery Point Objective (RPO): hoeveel gegevens je mag kwijtraken, en dus hoe vaak je moet back-uppen.',
          en: 'That is the Recovery Point Objective (RPO): how much data you may lose, and therefore how often you must back up.',
        },
      },
      {
        text: {
          nl: 'De tijd die nodig is om een back-up te maken',
          en: 'The time needed to make a backup',
        },
        rationale: {
          nl: 'Dat is de back-upvenstertijd, een technische parameter zonder directe relatie tot de bedrijfseis.',
          en: 'That is the backup window, a technical parameter without a direct relation to the business requirement.',
        },
      },
      {
        text: {
          nl: 'De periode waarover gegevens bewaard moeten blijven',
          en: 'The period for which data must be retained',
        },
        rationale: {
          nl: 'Dat is de bewaartermijn, die vaak voortvloeit uit wetgeving.',
          en: 'That is the retention period, which often follows from legislation.',
        },
      },
    ],
    explanation: {
      nl: 'Bedrijfscontinuïteitsbeheer (BCM) begint met een business impact analyse: welke processen zijn kritiek en hoe lang kunnen ze uitvallen? Daaruit volgen RTO (hoe snel weer draaien) en RPO (hoeveel gegevensverlies acceptabel is). Een continuïteitsplan is pas betrouwbaar als het periodiek wordt getest — een ongetest plan is een aanname, geen maatregel.',
      en: 'Business continuity management (BCM) starts with a business impact analysis: which processes are critical and how long can they be down? From that follow the RTO (how quickly to be running again) and RPO (how much data loss is acceptable). A continuity plan is only reliable once it is tested periodically — an untested plan is an assumption, not a control.',
    },
    source: 'Exameneis 3.2.4',
  },
  {
    id: 'isfs-q027',
    objective: '3.2.4',
    type: 'standard',
    bloom: 1,
    difficulty: 2,
    stem: {
      nl: 'Wat is een hot site (stand-by arrangement)?',
      en: 'What is a hot site (stand-by arrangement)?',
    },
    options: [
      {
        text: {
          nl: 'Een volledig ingerichte uitwijklocatie die op zeer korte termijn de bedrijfsvoering kan overnemen',
          en: 'A fully equipped fallback location that can take over operations at very short notice',
        },
        correct: true,
      },
      {
        text: {
          nl: 'Een lege ruimte waar bij calamiteiten apparatuur kan worden geplaatst',
          en: 'An empty space where equipment can be installed in the event of a disaster',
        },
        rationale: {
          nl: 'Dat is een cold site: goedkoper, maar de ingebruikname duurt dagen tot weken.',
          en: 'That is a cold site: cheaper, but bringing it into use takes days to weeks.',
        },
      },
      {
        text: {
          nl: 'Een externe opslaglocatie voor back-upmedia',
          en: 'An external storage location for backup media',
        },
        rationale: {
          nl: 'Dat is offsite opslag; die bewaart gegevens maar neemt de bedrijfsvoering niet over.',
          en: 'That is offsite storage; it preserves data but does not take over operations.',
        },
      },
      {
        text: {
          nl: 'Een serverruimte met extra koeling',
          en: 'A server room with additional cooling',
        },
        rationale: {
          nl: 'Koeling is een fysieke omgevingsmaatregel, geen uitwijkvoorziening.',
          en: 'Cooling is a physical environmental control, not a fallback facility.',
        },
      },
    ],
    explanation: {
      nl: 'Uitwijkvoorzieningen lopen van cold site (lege ruimte, dagen tot weken) via warm site (deels ingericht, uren tot dagen) naar hot site (volledig ingericht en actueel, minuten tot uren). Hoe korter de RTO, hoe duurder de voorziening. De keuze volgt uit de business impact analyse, niet uit technische voorkeur.',
      en: 'Fallback facilities range from cold site (empty space, days to weeks) through warm site (partly equipped, hours to days) to hot site (fully equipped and current, minutes to hours). The shorter the RTO, the more expensive the facility. The choice follows from the business impact analysis, not from technical preference.',
    },
    source: 'Exameneis 3.2.4',
  },
  {
    id: 'isfs-q028',
    objective: '3.2.5',
    type: 'standard',
    bloom: 1,
    difficulty: 2,
    stem: {
      nl: 'Wat is het belangrijkste verschil tussen een interne en een externe audit?',
      en: 'What is the main difference between an internal and an external audit?',
    },
    options: [
      {
        text: {
          nl: 'Een interne audit wordt uitgevoerd door of namens de organisatie zelf; een externe audit door een onafhankelijke partij, bijvoorbeeld voor certificering',
          en: 'An internal audit is performed by or on behalf of the organization itself; an external audit by an independent party, for example for certification',
        },
        correct: true,
      },
      {
        text: {
          nl: 'Een interne audit is vrijwillig; een externe audit is wettelijk verplicht',
          en: 'An internal audit is voluntary; an external audit is required by law',
        },
        rationale: {
          nl: 'ISO/IEC 27001 vereist juist interne audits als onderdeel van het ISMS; externe certificering is in beginsel vrijwillig.',
          en: 'ISO/IEC 27001 actually requires internal audits as part of the ISMS; external certification is in principle voluntary.',
        },
      },
      {
        text: {
          nl: 'Een interne audit kijkt naar techniek; een externe audit naar processen',
          en: 'An internal audit looks at technology; an external audit at processes',
        },
        rationale: {
          nl: 'Beide kunnen zowel techniek als processen beoordelen; het onderscheid zit in de onafhankelijkheid.',
          en: 'Both can assess technology and processes; the distinction lies in independence.',
        },
      },
      {
        text: {
          nl: 'Een interne audit vindt jaarlijks plaats; een externe audit eenmalig',
          en: 'An internal audit happens annually; an external audit only once',
        },
        rationale: {
          nl: 'Externe certificering kent juist periodieke opvolgaudits en driejaarlijkse hercertificering.',
          en: 'External certification actually involves periodic surveillance audits and three-yearly recertification.',
        },
      },
    ],
    explanation: {
      nl: 'Audits en controles tonen aan of maatregelen bestaan én werken — het verschil tussen opzet, bestaan en werking. Interne audits zijn een verplicht onderdeel van het ISMS onder ISO/IEC 27001 en voeden de directiebeoordeling. Onafhankelijkheid van de auditor is essentieel: je beoordeelt niet je eigen werk.',
      en: 'Audits and checks demonstrate whether controls exist and work — the difference between design, existence and operating effectiveness. Internal audits are a mandatory part of the ISMS under ISO/IEC 27001 and feed the management review. Auditor independence is essential: you do not assess your own work.',
    },
    source: 'Exameneis 3.2.5',
  },
  {
    id: 'isfs-q029',
    objective: '3.2.3',
    type: 'standard',
    bloom: 2,
    difficulty: 2,
    stem: {
      nl: 'Waarom moet informatiebeveiliging al bij de start van een project worden meegenomen?',
      en: 'Why must information security be considered from the very start of a project?',
    },
    options: [
      {
        text: {
          nl: 'Omdat maatregelen die achteraf worden toegevoegd duurder en minder effectief zijn dan maatregelen die vanaf het ontwerp zijn meegenomen',
          en: 'Because controls added afterwards are more expensive and less effective than controls built in from the design stage',
        },
        correct: true,
      },
      {
        text: {
          nl: 'Omdat de security officer anders geen goedkeuring geeft voor het projectbudget',
          en: 'Because otherwise the security officer will not approve the project budget',
        },
        rationale: {
          nl: 'Dit maakt van beveiliging een formaliteit in plaats van een inhoudelijke afweging.',
          en: 'This turns security into a formality rather than a substantive consideration.',
        },
      },
      {
        text: {
          nl: 'Omdat de AVG voorschrijft dat elk project een risicoanalyse bevat',
          en: 'Because the GDPR requires every project to include a risk analysis',
        },
        rationale: {
          nl: 'De AVG vereist een DPIA alleen bij verwerkingen met een hoog risico, niet bij elk project.',
          en: 'The GDPR only requires a DPIA for high-risk processing, not for every project.',
        },
      },
      {
        text: {
          nl: 'Omdat projecten anders niet gecertificeerd kunnen worden',
          en: 'Because otherwise projects cannot be certified',
        },
        rationale: {
          nl: 'Certificering geldt voor het managementsysteem van de organisatie, niet voor losse projecten.',
          en: 'Certification applies to the organization’s management system, not to individual projects.',
        },
      },
    ],
    explanation: {
      nl: 'Dit is het principe van security by design: beveiligingseisen horen bij de eisen van het project, niet bij de oplevering. Achteraf ingebouwde maatregelen leiden tot lapmiddelen, hogere kosten en restrisico’s die blijven bestaan. Privacy by design en privacy by default zijn de AVG-tegenhangers hiervan voor persoonsgegevens.',
      en: 'This is the principle of security by design: security requirements belong with the project requirements, not with the handover. Controls bolted on afterwards lead to workarounds, higher costs and residual risks that persist. Privacy by design and privacy by default are the GDPR counterparts for personal data.',
    },
    source: 'Exameneis 3.2.3',
  },

  /* --- 3.3 Menselijke beheersmaatregelen ------------------------------ */
  {
    id: 'isfs-q030',
    objective: '3.3.1',
    type: 'standard',
    bloom: 2,
    difficulty: 2,
    stem: {
      nl: 'Wat is het doel van een geheimhoudingsverklaring (NDA)?',
      en: 'What is the purpose of a non-disclosure agreement (NDA)?',
    },
    options: [
      {
        text: {
          nl: 'Juridisch vastleggen dat vertrouwelijke informatie niet zonder toestemming mag worden gedeeld, ook na afloop van het dienstverband of contract',
          en: 'Legally recording that confidential information may not be shared without permission, including after employment or the contract ends',
        },
        correct: true,
      },
      {
        text: {
          nl: 'Vastleggen welke toegangsrechten een medewerker krijgt',
          en: 'Recording which access rights an employee receives',
        },
        rationale: {
          nl: 'Toegangsrechten worden vastgelegd in het autorisatiebeheer, niet in een NDA.',
          en: 'Access rights are recorded in authorization management, not in an NDA.',
        },
      },
      {
        text: {
          nl: 'De medewerker verplichten beveiligingsincidenten te melden',
          en: 'Obliging the employee to report security incidents',
        },
        rationale: {
          nl: 'De meldplicht staat in het beveiligingsbeleid en de gedragscode.',
          en: 'The reporting duty is set out in the security policy and code of conduct.',
        },
      },
      {
        text: {
          nl: 'De aansprakelijkheid van de organisatie bij een datalek beperken',
          en: 'Limiting the organization’s liability in the event of a data breach',
        },
        rationale: {
          nl: 'Een NDA regelt de verplichting van de ondertekenaar, niet de aansprakelijkheid van de organisatie richting derden.',
          en: 'An NDA governs the signatory’s obligation, not the organization’s liability towards third parties.',
        },
      },
    ],
    explanation: {
      nl: 'Menselijke maatregelen rond het dienstverband lopen van vóór indiensttreding (screening, referenties) via de contractfase (arbeidsvoorwaarden, gedragscode, NDA) tot uitdiensttreding (rechten intrekken, middelen innemen, geheimhouding blijft gelden). De NDA is bewust ook ná afloop bindend, want de vertrouwelijkheid van informatie stopt niet bij het einde van het contract.',
      en: 'People controls around employment span pre-employment (screening, references), the contract phase (terms, code of conduct, NDA) and termination (revoking rights, collecting assets, confidentiality continues). The NDA deliberately remains binding after the end, because the confidentiality of information does not stop when the contract does.',
    },
    source: 'Exameneis 3.3.1',
  },
  {
    id: 'isfs-q031',
    objective: '3.3.2',
    type: 'standard',
    bloom: 2,
    difficulty: 2,
    stem: {
      nl: 'Een organisatie wil de weerbaarheid tegen phishing vergroten. Welke aanpak is het meest effectief?',
      en: 'An organization wants to increase resilience against phishing. Which approach is most effective?',
    },
    options: [
      {
        text: {
          nl: 'Terugkerende bewustwordingsactiviteiten, waaronder simulaties, waarbij melden wordt beloond in plaats van fouten bestraft',
          en: 'Recurring awareness activities, including simulations, where reporting is rewarded rather than mistakes punished',
        },
        correct: true,
      },
      {
        text: {
          nl: 'Eenmalig een e-mail sturen met de tien kenmerken van phishing',
          en: 'Sending a single email listing the ten characteristics of phishing',
        },
        rationale: {
          nl: 'Eenmalige communicatie beklijft niet. Bewustwording vraagt om herhaling en oefening.',
          en: 'One-off communication does not stick. Awareness requires repetition and practice.',
        },
      },
      {
        text: {
          nl: 'Medewerkers die op een phishingsimulatie klikken publiek bekendmaken',
          en: 'Publicly naming employees who click on a phishing simulation',
        },
        rationale: {
          nl: 'Dit veroorzaakt angst en onderdrukt juist het melden van échte incidenten.',
          en: 'This causes fear and actively suppresses the reporting of real incidents.',
        },
      },
      {
        text: {
          nl: 'Uitsluitend vertrouwen op het spamfilter',
          en: 'Relying solely on the spam filter',
        },
        rationale: {
          nl: 'Technische filters vangen veel af, maar nooit alles. De mens blijft de laatste verdedigingslinie.',
          en: 'Technical filters catch a lot, but never everything. People remain the last line of defence.',
        },
      },
    ],
    explanation: {
      nl: 'Bewustwording is een doorlopend programma, geen eenmalige actie: introductietraining, periodieke opfrissing, simulaties, campagnes en heldere meldkanalen. Meten kan via meldpercentages en klikpercentages bij simulaties. Cruciaal is de cultuur: wie melden bestraft, krijgt minder meldingen — niet minder incidenten.',
      en: 'Awareness is an ongoing programme, not a one-off action: induction training, periodic refreshers, simulations, campaigns and clear reporting channels. It can be measured via reporting rates and click rates in simulations. Culture is crucial: punishing reporting yields fewer reports — not fewer incidents.',
    },
    source: 'Exameneis 3.3.2',
  },
  {
    id: 'isfs-q032',
    objective: '3.3.1',
    type: 'standard',
    bloom: 2,
    difficulty: 2,
    stem: {
      nl: 'Welke maatregel hoort bij het beëindigen van een dienstverband?',
      en: 'Which control belongs to the termination of employment?',
    },
    options: [
      {
        text: {
          nl: 'Toegangsrechten intrekken, bedrijfsmiddelen innemen en de medewerker wijzen op de blijvende geheimhoudingsplicht',
          en: 'Revoking access rights, collecting company assets and reminding the employee of the continuing confidentiality obligation',
        },
        correct: true,
      },
      {
        text: {
          nl: 'Een screening uitvoeren op het arbeidsverleden',
          en: 'Conducting a background screening of employment history',
        },
        rationale: {
          nl: 'Screening hoort bij de fase vóór indiensttreding.',
          en: 'Screening belongs to the pre-employment phase.',
        },
      },
      {
        text: {
          nl: 'De gedragscode laten ondertekenen',
          en: 'Having the code of conduct signed',
        },
        rationale: {
          nl: 'Dat gebeurt bij aanvang van het dienstverband.',
          en: 'That happens at the start of employment.',
        },
      },
      {
        text: {
          nl: 'De functiebeschrijving actualiseren',
          en: 'Updating the job description',
        },
        rationale: {
          nl: 'Dat is relevant bij functiewijziging, niet bij uitdiensttreding.',
          en: 'That is relevant on role change, not on termination.',
        },
      },
    ],
    explanation: {
      nl: 'Uitdiensttreding is een risicomoment: vergeten accounts blijven vaak jaren actief en zijn een geliefd aanvalspad. Het proces moet daarom sluitend zijn en gekoppeld aan HR, niet afhankelijk van een melding door de leidinggevende. Hetzelfde geldt bij functiewijziging: nieuwe rechten toekennen zonder oude in te trekken leidt tot rechtenstapeling.',
      en: 'Termination is a risk moment: forgotten accounts often stay active for years and are a favoured attack path. The process must therefore be watertight and linked to HR, not dependent on a manager remembering to report it. The same applies on role change: granting new rights without revoking old ones leads to privilege accumulation.',
    },
    source: 'Exameneis 3.3.1',
  },

  /* --- 3.4 Fysieke beheersmaatregelen --------------------------------- */
  {
    id: 'isfs-q033',
    objective: '3.4.3',
    type: 'standard',
    bloom: 2,
    difficulty: 2,
    stem: {
      nl: 'Hoe werken beschermingsringen (protection rings) bij fysieke beveiliging?',
      en: 'How do protection rings work in physical security?',
    },
    options: [
      {
        text: {
          nl: 'Als opeenvolgende schillen van buiten naar binnen, waarbij elke ring strengere toegangseisen kent naarmate de informatie gevoeliger is',
          en: 'As successive layers from outside inwards, where each ring has stricter access requirements as the information becomes more sensitive',
        },
        correct: true,
      },
      {
        text: {
          nl: 'Als parallelle maatregelen die onafhankelijk van elkaar hetzelfde gebied beschermen',
          en: 'As parallel controls that independently protect the same area',
        },
        rationale: {
          nl: 'Ringen zijn juist opeenvolgend en concentrisch; het idee is dat een aanvaller meerdere lagen moet doorbreken.',
          en: 'Rings are successive and concentric; the idea is that an attacker must breach multiple layers.',
        },
      },
      {
        text: {
          nl: 'Als een indeling van medewerkers in rechtenniveaus',
          en: 'As a classification of employees into rights levels',
        },
        rationale: {
          nl: 'Dat is logische toegangsbeveiliging (autorisatie), niet fysieke ringbescherming.',
          en: 'That is logical access control (authorization), not physical ring protection.',
        },
      },
      {
        text: {
          nl: 'Als een netwerksegmentatiemodel met VLAN’s',
          en: 'As a network segmentation model using VLANs',
        },
        rationale: {
          nl: 'Netwerksegmentatie is een technische maatregel; beschermingsringen zijn fysiek — al is het onderliggende gelaagdheidsprincipe hetzelfde.',
          en: 'Network segmentation is a technical control; protection rings are physical — though the underlying layering principle is the same.',
        },
      },
    ],
    explanation: {
      nl: 'De ringen lopen doorgaans van buitenring (terrein, hekwerk, verlichting) via de gebouwschil (toegangsdeuren, receptie, badge) en de werkruimte (afgesloten afdelingen) naar het object zelf (serverruimte, kluis, afgesloten kast). Hoe gevoeliger de informatie, hoe dieper in de ringen en hoe strenger de toegangseisen. Dit is het fysieke equivalent van defence in depth.',
      en: 'The rings typically run from the outer ring (grounds, fencing, lighting) through the building shell (access doors, reception, badge) and the work area (locked departments) to the object itself (server room, safe, locked cabinet). The more sensitive the information, the deeper within the rings and the stricter the access requirements. This is the physical equivalent of defence in depth.',
    },
    source: 'Exameneis 3.4.3',
  },
  {
    id: 'isfs-q034',
    objective: '3.4.1',
    type: 'standard',
    bloom: 1,
    difficulty: 2,
    stem: {
      nl: 'Een onbevoegde loopt achter een medewerker aan door een badge-deur naar binnen. Hoe heet deze techniek?',
      en: 'An unauthorized person follows an employee through a badge-controlled door. What is this technique called?',
    },
    options: [
      { text: { nl: 'Tailgating (meelopen)', en: 'Tailgating' }, correct: true },
      {
        text: { nl: 'Phishing', en: 'Phishing' },
        rationale: {
          nl: 'Phishing is het via digitale berichten ontfutselen van gegevens of het verleiden tot een handeling.',
          en: 'Phishing is extracting data or inducing an action through digital messages.',
        },
      },
      {
        text: { nl: 'Shoulder surfing', en: 'Shoulder surfing' },
        rationale: {
          nl: 'Shoulder surfing is meekijken over iemands schouder om bijvoorbeeld een wachtwoord af te lezen.',
          en: 'Shoulder surfing is looking over someone’s shoulder to read a password, for example.',
        },
      },
      {
        text: { nl: 'Spoofing', en: 'Spoofing' },
        rationale: {
          nl: 'Spoofing is het vervalsen van een identiteit, bijvoorbeeld een afzenderadres of IP-adres.',
          en: 'Spoofing is falsifying an identity, for example a sender address or IP address.',
        },
      },
    ],
    explanation: {
      nl: 'Tailgating is een vorm van social engineering die technische toegangscontrole omzeilt via menselijk gedrag — mensen houden nu eenmaal de deur voor elkaar open. Maatregelen: tourniquets of sluizen, bewustwording, een aanspreekcultuur en zichtbare badges. Het is een goed voorbeeld dat techniek zonder gedragsverandering onvoldoende is.',
      en: 'Tailgating is a form of social engineering that bypasses technical access control through human behaviour — people naturally hold doors for each other. Controls: turnstiles or airlocks, awareness, a culture of challenging strangers and visible badges. It is a good example of technology being insufficient without behavioural change.',
    },
    source: 'Exameneis 3.4.1',
  },
  {
    id: 'isfs-q035',
    objective: '3.4.2',
    type: 'standard',
    bloom: 1,
    difficulty: 2,
    stem: {
      nl: 'Wat houdt een clear desk- en clear screen-beleid in?',
      en: 'What does a clear desk and clear screen policy entail?',
    },
    options: [
      {
        text: {
          nl: 'Gevoelige documenten worden niet onbeheerd achtergelaten en werkstations worden vergrendeld bij het verlaten van de werkplek',
          en: 'Sensitive documents are not left unattended and workstations are locked when leaving the desk',
        },
        correct: true,
      },
      {
        text: {
          nl: 'Bureaus moeten aan het einde van de dag volledig leeg zijn voor de schoonmaak',
          en: 'Desks must be completely empty at the end of the day for cleaning',
        },
        rationale: {
          nl: 'Het doel is beveiliging, niet netheid; de maatregel geldt ook tijdens werktijd bij het verlaten van de werkplek.',
          en: 'The purpose is security, not tidiness; the control also applies during working hours when leaving the desk.',
        },
      },
      {
        text: {
          nl: 'Beeldschermen moeten voorzien zijn van een privacyfilter',
          en: 'Screens must be fitted with a privacy filter',
        },
        rationale: {
          nl: 'Een privacyfilter is een aanvullende maatregel tegen meekijken, niet de definitie van dit beleid.',
          en: 'A privacy filter is an additional control against onlookers, not the definition of this policy.',
        },
      },
      {
        text: {
          nl: 'Alle documenten moeten digitaal worden opgeslagen in plaats van op papier',
          en: 'All documents must be stored digitally instead of on paper',
        },
        rationale: {
          nl: 'Digitalisering is geen onderdeel van dit beleid; papieren documenten mogen bestaan, maar veilig opgeborgen.',
          en: 'Digitization is not part of this policy; paper documents may exist, but must be stored securely.',
        },
      },
    ],
    explanation: {
      nl: 'Deze maatregel beschermt informatie binnen beveiligde gebieden tegen inzage door collega’s zonder need-to-know, bezoekers, schoonmakers en onderhoudspersoneel. Aanvullend: afgesloten kasten, veilige vernietiging via papierversnipperaars, en beperkingen op het maken van foto’s in gevoelige ruimtes.',
      en: 'This control protects information within secure areas from being seen by colleagues without a need-to-know, visitors, cleaners and maintenance staff. Additionally: lockable cabinets, secure destruction via shredders, and restrictions on taking photographs in sensitive areas.',
    },
    source: 'Exameneis 3.4.2',
  },
  {
    id: 'isfs-q036',
    objective: '3.4.1',
    type: 'standard',
    bloom: 1,
    difficulty: 2,
    stem: {
      nl: 'Welke maatregel beschermt een serverruimte tegen uitval van de stroomvoorziening?',
      en: 'Which control protects a server room against power failure?',
    },
    options: [
      {
        text: {
          nl: 'Een UPS in combinatie met een noodstroomaggregaat',
          en: 'A UPS combined with an emergency generator',
        },
        correct: true,
      },
      {
        text: { nl: 'Een brandblusinstallatie', en: 'A fire suppression system' },
        rationale: {
          nl: 'Die beschermt tegen brand, niet tegen stroomuitval.',
          en: 'That protects against fire, not against power failure.',
        },
      },
      {
        text: { nl: 'Toegangscontrole met een badge', en: 'Badge-based access control' },
        rationale: {
          nl: 'Dat beschermt tegen onbevoegde fysieke toegang.',
          en: 'That protects against unauthorized physical access.',
        },
      },
      {
        text: { nl: 'Een verhoogde vloer', en: 'A raised floor' },
        rationale: {
          nl: 'Die dient voor kabelgeleiding, luchtstroom en bescherming tegen waterschade van onderaf.',
          en: 'That serves cable routing, airflow and protection against water damage from below.',
        },
      },
    ],
    explanation: {
      nl: 'Fysieke beveiliging beschermt tegen meer dan alleen inbraak. Omgevingsdreigingen vragen elk hun eigen maatregel: stroomuitval (UPS en aggregaat), brand (detectie en blussing), water (lekdetectie, geen leidingen boven apparatuur), temperatuur en vochtigheid (klimaatbeheersing) en stof. Een UPS overbrugt de seconden tot minuten; het aggregaat neemt het daarna over.',
      en: 'Physical security protects against more than break-ins. Environmental threats each need their own control: power failure (UPS and generator), fire (detection and suppression), water (leak detection, no pipes above equipment), temperature and humidity (climate control) and dust. A UPS bridges the seconds to minutes; the generator takes over from there.',
    },
    source: 'Exameneis 3.4.1, 3.4.2',
  },

  /* --- 3.5 Technische beheersmaatregelen ------------------------------ */
  {
    id: 'isfs-q037',
    objective: '3.5.4',
    type: 'standard',
    bloom: 1,
    difficulty: 2,
    stem: {
      nl: 'Wat is het verschil tussen authenticatie en autorisatie?',
      en: 'What is the difference between authentication and authorization?',
    },
    options: [
      {
        text: {
          nl: 'Authenticatie stelt vast wie je bent; autorisatie bepaalt wat je vervolgens mag',
          en: 'Authentication establishes who you are; authorization determines what you are then allowed to do',
        },
        correct: true,
      },
      {
        text: {
          nl: 'Authenticatie bepaalt wat je mag; autorisatie stelt vast wie je bent',
          en: 'Authentication determines what you may do; authorization establishes who you are',
        },
        rationale: {
          nl: 'Dit is precies omgekeerd. Een klassieke examenval.',
          en: 'This is exactly reversed. A classic exam trap.',
        },
      },
      {
        text: {
          nl: 'Authenticatie is technisch; autorisatie is organisatorisch',
          en: 'Authentication is technical; authorization is organizational',
        },
        rationale: {
          nl: 'Beide hebben technische én organisatorische aspecten; het onderscheid zit in identiteit versus rechten.',
          en: 'Both have technical and organizational aspects; the distinction is identity versus rights.',
        },
      },
      {
        text: {
          nl: 'Authenticatie geldt voor gebruikers; autorisatie voor systemen',
          en: 'Authentication applies to users; authorization to systems',
        },
        rationale: {
          nl: 'Beide gelden voor gebruikers én systemen; ook applicaties authenticeren zich tegenover elkaar.',
          en: 'Both apply to users and systems; applications also authenticate to each other.',
        },
      },
    ],
    explanation: {
      nl: 'De volgorde is: identificatie (wie beweer je te zijn — je gebruikersnaam), authenticatie (bewijs het — wachtwoord, token, biometrie) en autorisatie (wat mag je — je rechten). Authenticatiefactoren: iets wat je weet (wachtwoord), iets wat je hebt (token, smartcard) en iets wat je bent (biometrie). Meerfactorauthenticatie combineert factoren uit verschillende categorieën.',
      en: 'The order is: identification (who you claim to be — your username), authentication (prove it — password, token, biometrics) and authorization (what you may do — your rights). Authentication factors: something you know (password), something you have (token, smartcard) and something you are (biometrics). Multi-factor authentication combines factors from different categories.',
    },
    source: 'Exameneis 3.5.4',
  },
  {
    id: 'isfs-q038',
    objective: '3.5.4',
    type: 'standard',
    bloom: 1,
    difficulty: 2,
    stem: {
      nl: 'Een medewerker logt in met een wachtwoord én een code uit een authenticator-app. Waarom telt dit als tweefactorauthenticatie?',
      en: 'An employee logs in with a password and a code from an authenticator app. Why does this count as two-factor authentication?',
    },
    options: [
      {
        text: {
          nl: 'Omdat het twee factoren uit verschillende categorieën combineert: iets wat je weet en iets wat je hebt',
          en: 'Because it combines two factors from different categories: something you know and something you have',
        },
        correct: true,
      },
      {
        text: {
          nl: 'Omdat er twee handelingen nodig zijn om in te loggen',
          en: 'Because two actions are needed to log in',
        },
        rationale: {
          nl: 'Twee wachtwoorden achter elkaar zijn ook twee handelingen, maar blijven één factor.',
          en: 'Two passwords in a row are also two actions, but remain a single factor.',
        },
      },
      {
        text: {
          nl: 'Omdat de code elke 30 seconden verandert',
          en: 'Because the code changes every 30 seconds',
        },
        rationale: {
          nl: 'Het tijdgebonden karakter maakt de code sterker, maar bepaalt niet of iets een aparte factor is.',
          en: 'The time-based nature makes the code stronger but does not determine whether it is a separate factor.',
        },
      },
      {
        text: {
          nl: 'Omdat de app op een ander apparaat draait dan de browser',
          en: 'Because the app runs on a different device than the browser',
        },
        rationale: {
          nl: 'Een apart apparaat helpt, maar de code blijft ook op hetzelfde apparaat een aparte factor.',
          en: 'A separate device helps, but the code remains a distinct factor even on the same device.',
        },
      },
    ],
    explanation: {
      nl: 'De drie categorieën authenticatiefactoren zijn: iets wat je weet (wachtwoord, pincode), iets wat je hebt (token, smartcard, telefoon met authenticator) en iets wat je bent (vingerafdruk, gezicht, iris). Echte meerfactorauthenticatie combineert factoren uit verschillende categorieën — twee wachtwoorden zijn dus geen twee factoren.',
      en: 'The three categories of authentication factor are: something you know (password, PIN), something you have (token, smartcard, phone with authenticator) and something you are (fingerprint, face, iris). True multi-factor authentication combines factors from different categories — two passwords are therefore not two factors.',
    },
    source: 'Exameneis 3.5.4',
  },
  {
    id: 'isfs-q039',
    objective: '3.5.3',
    type: 'standard',
    bloom: 1,
    difficulty: 2,
    stem: {
      nl: 'Wat is de functie van een firewall?',
      en: 'What is the function of a firewall?',
    },
    options: [
      {
        text: {
          nl: 'Netwerkverkeer tussen zones filteren op basis van vastgestelde regels',
          en: 'Filtering network traffic between zones based on defined rules',
        },
        correct: true,
      },
      {
        text: {
          nl: 'Kwaadaardige software op werkstations detecteren en verwijderen',
          en: 'Detecting and removing malicious software on workstations',
        },
        rationale: {
          nl: 'Dat is de taak van antimalware-software.',
          en: 'That is the task of anti-malware software.',
        },
      },
      {
        text: {
          nl: 'Gegevens versleutelen tijdens transport over het internet',
          en: 'Encrypting data during transport over the internet',
        },
        rationale: {
          nl: 'Dat doen protocollen als TLS en oplossingen als een VPN.',
          en: 'That is done by protocols such as TLS and solutions such as a VPN.',
        },
      },
      {
        text: {
          nl: 'De identiteit van gebruikers vaststellen voordat zij toegang krijgen',
          en: 'Establishing user identity before granting access',
        },
        rationale: {
          nl: 'Dat is authenticatie, uitgevoerd door bijvoorbeeld een identity provider.',
          en: 'That is authentication, performed by an identity provider for instance.',
        },
      },
    ],
    explanation: {
      nl: 'Netwerkbeveiliging bestaat uit meerdere lagen: firewalls (verkeer filteren tussen zones), segmentatie en VLAN’s (scheiding zodat een inbraak zich niet verspreidt), IDS/IPS (aanvallen detecteren en blokkeren), VPN (versleutelde verbinding over een onvertrouwd netwerk), en een DMZ voor systemen die van buiten bereikbaar moeten zijn.',
      en: 'Network security consists of multiple layers: firewalls (filtering traffic between zones), segmentation and VLANs (separation so a breach does not spread), IDS/IPS (detecting and blocking attacks), VPN (encrypted connection over an untrusted network), and a DMZ for systems that must be reachable from outside.',
    },
    source: 'Exameneis 3.5.3',
  },
  {
    id: 'isfs-q040',
    objective: '3.5.5',
    type: 'standard',
    bloom: 1,
    difficulty: 2,
    stem: {
      nl: 'Een aanvaller stuurt een gerichte e-mail aan de financieel directeur, zogenaamd van de CEO, met het verzoek een spoedbetaling te doen. Hoe heet deze aanval?',
      en: 'An attacker sends a targeted email to the finance director, supposedly from the CEO, requesting an urgent payment. What is this attack called?',
    },
    options: [
      {
        text: { nl: 'CEO-fraude (whaling / spear phishing)', en: 'CEO fraud (whaling / spear phishing)' },
        correct: true,
      },
      {
        text: { nl: 'Spam', en: 'Spam' },
        rationale: {
          nl: 'Spam is ongevraagde bulkmail zonder specifiek doelwit of gerichte misleiding.',
          en: 'Spam is unsolicited bulk mail without a specific target or targeted deception.',
        },
      },
      {
        text: { nl: 'Een denial-of-service-aanval', en: 'A denial-of-service attack' },
        rationale: {
          nl: 'Een DoS-aanval richt zich op beschikbaarheid door een systeem te overbelasten.',
          en: 'A DoS attack targets availability by overloading a system.',
        },
      },
      {
        text: { nl: 'Een SQL-injectie', en: 'An SQL injection' },
        rationale: {
          nl: 'Dat is een technische aanval op een applicatie via ongevalideerde invoer.',
          en: 'That is a technical attack on an application via unvalidated input.',
        },
      },
    ],
    explanation: {
      nl: 'Phishing is ongericht en massaal; spear phishing is gericht op een specifiek persoon of kleine groep; whaling of CEO-fraude richt zich op bestuurders of medewerkers met betalingsbevoegdheid. Deze aanvallen omzeilen techniek door misbruik te maken van gezag, urgentie en vertrouwen. Maatregelen: bewustwording, functiescheiding bij betalingen, een vast verificatieproces via een tweede kanaal, en e-mailauthenticatie (SPF, DKIM, DMARC).',
      en: 'Phishing is untargeted and mass-scale; spear phishing targets a specific person or small group; whaling or CEO fraud targets executives or staff with payment authority. These attacks bypass technology by exploiting authority, urgency and trust. Controls: awareness, segregation of duties for payments, a fixed verification process via a second channel, and email authentication (SPF, DKIM, DMARC).',
    },
    source: 'Exameneis 3.5.5',
  },
  {
    id: 'isfs-q041',
    objective: '3.5.5',
    type: 'standard',
    bloom: 1,
    difficulty: 2,
    stem: {
      nl: 'Welke maatregel beschermt het meest direct tegen de gevolgen van een ransomware-besmetting?',
      en: 'Which control most directly protects against the consequences of a ransomware infection?',
    },
    options: [
      {
        text: {
          nl: 'Regelmatige, geteste back-ups die offline of onveranderbaar zijn opgeslagen',
          en: 'Regular, tested backups stored offline or in immutable form',
        },
        correct: true,
      },
      {
        text: {
          nl: 'Een sterk wachtwoordbeleid',
          en: 'A strong password policy',
        },
        rationale: {
          nl: 'Dat verkleint de kans op ongeautoriseerde toegang, maar helpt niet als de bestanden al versleuteld zijn.',
          en: 'That reduces the chance of unauthorized access but does not help once files are already encrypted.',
        },
      },
      {
        text: {
          nl: 'Een spamfilter',
          en: 'A spam filter',
        },
        rationale: {
          nl: 'Preventief nuttig, maar geen enkel filter houdt alles tegen; dit beschermt niet tegen de gevolgen.',
          en: 'Useful preventively, but no filter stops everything; this does not protect against the consequences.',
        },
      },
      {
        text: {
          nl: 'Een cyberverzekering',
          en: 'A cyber insurance policy',
        },
        rationale: {
          nl: 'Verzekering vangt financiële gevolgen op maar herstelt de gegevens en de bedrijfsvoering niet.',
          en: 'Insurance covers financial consequences but does not restore the data or operations.',
        },
      },
    ],
    explanation: {
      nl: 'Let op de vraagstelling: gevraagd wordt naar de gevolgen, niet naar het voorkómen. Back-ups zijn de correctieve maatregel die herstel mogelijk maakt. Cruciaal is wel dat ze geïsoleerd zijn (offline, immutable of op een apart account), want moderne ransomware zoekt actief naar back-ups. En: een back-up die nooit is teruggezet, is een aanname.',
      en: 'Note the question: it asks about the consequences, not about prevention. Backups are the corrective control that enables recovery. Crucially they must be isolated (offline, immutable or on a separate account), because modern ransomware actively hunts for backups. And: a backup that has never been restored is an assumption.',
    },
    source: 'Exameneis 3.5.5, 3.1.1',
  },
  {
    id: 'isfs-q042',
    objective: '3.5.6',
    type: 'standard',
    bloom: 2,
    difficulty: 2,
    stem: {
      nl: 'Waarom draagt logging bij aan informatiebeveiliging?',
      en: 'Why does logging contribute to information security?',
    },
    options: [
      {
        text: {
          nl: 'Omdat het handelingen herleidbaar maakt en daarmee detectie, onderzoek en eindverantwoordelijkheid mogelijk maakt',
          en: 'Because it makes actions traceable and thereby enables detection, investigation and accountability',
        },
        correct: true,
      },
      {
        text: {
          nl: 'Omdat logging voorkomt dat ongeautoriseerde handelingen plaatsvinden',
          en: 'Because logging prevents unauthorized actions from taking place',
        },
        rationale: {
          nl: 'Logging is detectief, niet preventief. Het legt vast wat er gebeurt; het houdt niets tegen. Wel kan het bekend zijn van logging een afschrikkende werking hebben.',
          en: 'Logging is detective, not preventive. It records what happens; it stops nothing. Knowing that logging exists can have a deterrent effect, though.',
        },
      },
      {
        text: {
          nl: 'Omdat logbestanden verplicht zijn onder de AVG',
          en: 'Because log files are mandatory under the GDPR',
        },
        rationale: {
          nl: 'De AVG vereist passende maatregelen; logging kan er een zijn, maar is niet als zodanig voorgeschreven.',
          en: 'The GDPR requires appropriate measures; logging can be one, but is not prescribed as such.',
        },
      },
      {
        text: {
          nl: 'Omdat logging de prestaties van systemen verbetert',
          en: 'Because logging improves system performance',
        },
        rationale: {
          nl: 'Logging kost juist opslag en verwerkingscapaciteit.',
          en: 'Logging actually consumes storage and processing capacity.',
        },
      },
    ],
    explanation: {
      nl: 'Logging en monitoring maken eindverantwoordelijkheid en controleerbaarheid praktisch mogelijk. Aandachtspunten: logs moeten beschermd zijn tegen wijziging (anders kan een aanvaller zijn sporen wissen), een passende bewaartermijn hebben, en actief worden beoordeeld — logs die niemand bekijkt, leveren geen detectie op. Let ook op privacy: loggen van gebruikershandelingen raakt persoonsgegevens.',
      en: 'Logging and monitoring make accountability and auditability practically possible. Points of attention: logs must be protected against modification (otherwise an attacker can erase their traces), have an appropriate retention period, and be actively reviewed — logs nobody looks at provide no detection. Also mind privacy: logging user actions involves personal data.',
    },
    source: 'Exameneis 3.5.6',
  },
  {
    id: 'isfs-q043',
    objective: '3.5.1',
    type: 'standard',
    bloom: 1,
    difficulty: 2,
    stem: {
      nl: 'Waarom is een actueel overzicht van informatiemiddelen (asset register) noodzakelijk?',
      en: 'Why is an up-to-date inventory of information assets (asset register) necessary?',
    },
    options: [
      {
        text: {
          nl: 'Omdat je niet kunt beschermen wat je niet weet te hebben; het overzicht is de basis voor classificatie, eigenaarschap en maatregelen',
          en: 'Because you cannot protect what you do not know you have; the inventory is the basis for classification, ownership and controls',
        },
        correct: true,
      },
      {
        text: {
          nl: 'Omdat de boekhouding de afschrijving van middelen moet kunnen berekenen',
          en: 'Because accounting must be able to calculate asset depreciation',
        },
        rationale: {
          nl: 'Dat is een financieel doel; het beveiligingsdoel is bescherming en verantwoording.',
          en: 'That is a financial purpose; the security purpose is protection and accountability.',
        },
      },
      {
        text: {
          nl: 'Omdat certificering een minimumaantal geregistreerde middelen vereist',
          en: 'Because certification requires a minimum number of registered assets',
        },
        rationale: {
          nl: 'Er bestaat geen minimumaantal; het gaat om volledigheid en actualiteit.',
          en: 'There is no minimum number; what matters is completeness and currency.',
        },
      },
      {
        text: {
          nl: 'Omdat alleen geregistreerde middelen verzekerd kunnen worden',
          en: 'Because only registered assets can be insured',
        },
        rationale: {
          nl: 'Verzekerbaarheid is een bijkomend voordeel, niet de reden vanuit informatiebeveiliging.',
          en: 'Insurability is a side benefit, not the information security rationale.',
        },
      },
    ],
    explanation: {
      nl: 'Assetmanagement omvat de hele levenscyclus: registreren, eigenaar toewijzen, classificeren, aanvaardbaar gebruik vastleggen, retourneren bij uitdiensttreding, en veilig verwijderen of vernietigen aan het einde. Vergeten systemen — schaduw-IT, oude servers, ongebruikte accounts — zijn een geliefd aanvalspad juist omdát ze niet in beeld zijn.',
      en: 'Asset management covers the full lifecycle: register, assign an owner, classify, define acceptable use, return on termination, and securely dispose of or destroy at end of life. Forgotten systems — shadow IT, legacy servers, unused accounts — are a favoured attack path precisely because they are not visible.',
    },
    source: 'Exameneis 3.5.1',
  },
  {
    id: 'isfs-q044',
    objective: '3.5.2',
    type: 'standard',
    bloom: 1,
    difficulty: 2,
    stem: {
      nl: 'Waarom mogen productiegegevens niet zonder meer in een testomgeving worden gebruikt?',
      en: 'Why should production data not be used in a test environment without precautions?',
    },
    options: [
      {
        text: {
          nl: 'Omdat testomgevingen doorgaans minder streng beveiligd zijn, waardoor vertrouwelijke gegevens onnodig risico lopen',
          en: 'Because test environments are usually less strictly secured, unnecessarily exposing confidential data to risk',
        },
        correct: true,
      },
      {
        text: {
          nl: 'Omdat testgegevens altijd willekeurig moeten zijn om geldige tests te doen',
          en: 'Because test data must always be random to produce valid tests',
        },
        rationale: {
          nl: 'Realistische gegevens zijn juist waardevol voor testen; de bezwaren zijn beveiligings- en privacygerelateerd, niet methodologisch.',
          en: 'Realistic data are actually valuable for testing; the objections are security and privacy related, not methodological.',
        },
      },
      {
        text: {
          nl: 'Omdat de productieomgeving daardoor trager wordt',
          en: 'Because it slows down the production environment',
        },
        rationale: {
          nl: 'Kopiëren kan tijdelijk belasting geven, maar dat is niet de beveiligingsreden.',
          en: 'Copying can cause temporary load, but that is not the security reason.',
        },
      },
      {
        text: {
          nl: 'Omdat ontwikkelaars geen toegang tot systemen mogen hebben',
          en: 'Because developers may not have access to systems',
        },
        rationale: {
          nl: 'Ontwikkelaars hebben wel degelijk toegang nodig tot hun omgevingen; het gaat om welke gegevens daarin staan.',
          en: 'Developers do need access to their environments; the issue is which data those contain.',
        },
      },
    ],
    explanation: {
      nl: 'Bij veilige systeemontwikkeling horen: scheiding van ontwikkel-, test- en productieomgevingen, veilige codeerrichtlijnen, invoervalidatie tegen injectie-aanvallen, code review, security testing, en het pseudonimiseren of anonimiseren van testgegevens. Als productiegegevens toch nodig zijn, gelden dezelfde beveiligingseisen als in productie.',
      en: 'Secure system development includes: separation of development, test and production environments, secure coding guidelines, input validation against injection attacks, code review, security testing, and pseudonymizing or anonymizing test data. If production data are nonetheless required, the same security requirements apply as in production.',
    },
    source: 'Exameneis 3.5.2',
  },
  {
    id: 'isfs-q045',
    objective: '3.5.4',
    type: 'standard',
    bloom: 1,
    difficulty: 3,
    stem: {
      nl: 'Wat maakt cryptografie met een publieke sleutelinfrastructuur (PKI) mogelijk bij een digitale handtekening?',
      en: 'What does public key infrastructure (PKI) cryptography enable in a digital signature?',
    },
    options: [
      {
        text: {
          nl: 'Het aantonen van de herkomst en de onveranderdheid van een bericht, waarbij de ondertekenaar dit niet geloofwaardig kan ontkennen',
          en: 'Demonstrating the origin and integrity of a message, such that the signer cannot credibly deny it',
        },
        correct: true,
      },
      {
        text: {
          nl: 'Het versleutelen van een bericht zodat alleen de afzender het kan lezen',
          en: 'Encrypting a message so only the sender can read it',
        },
        rationale: {
          nl: 'Bij versleuteling gaat het erom dat alleen de bedoelde ontvánger het kan lezen. Bovendien is versleuteling iets anders dan ondertekening.',
          en: 'Encryption is about only the intended recipient being able to read it. Moreover, encryption differs from signing.',
        },
      },
      {
        text: {
          nl: 'Het permanent verwijderen van gegevens van een gegevensdrager',
          en: 'Permanently erasing data from a storage medium',
        },
        rationale: {
          nl: 'Dat is veilige vernietiging (secure wiping), een andere maatregel.',
          en: 'That is secure erasure (wiping), a different control.',
        },
      },
      {
        text: {
          nl: 'Het versnellen van netwerkverkeer door compressie',
          en: 'Accelerating network traffic through compression',
        },
        rationale: {
          nl: 'Cryptografie kost juist rekencapaciteit en heeft geen relatie met compressie.',
          en: 'Cryptography actually consumes computing capacity and bears no relation to compression.',
        },
      },
    ],
    explanation: {
      nl: 'Asymmetrische cryptografie gebruikt een sleutelpaar: wat met de ene sleutel wordt versleuteld, kan alleen met de andere worden ontsleuteld. Bij ondertekenen gebruikt de afzender zijn privésleutel; iedereen kan met de publieke sleutel verifiëren. Dat levert authenticiteit, integriteit en onweerlegbaarheid (non-repudiation). Een certificaatautoriteit borgt binnen een PKI dat een publieke sleutel echt bij de gestelde eigenaar hoort.',
      en: 'Asymmetric cryptography uses a key pair: what is encrypted with one key can only be decrypted with the other. When signing, the sender uses their private key; anyone can verify with the public key. This delivers authenticity, integrity and non-repudiation. Within a PKI, a certificate authority guarantees that a public key genuinely belongs to the claimed owner.',
    },
    source: 'Exameneis 3.5.4',
  },
  {
    id: 'isfs-q046',
    objective: '3.5.3',
    type: 'standard',
    bloom: 1,
    difficulty: 2,
    stem: {
      nl: 'Wat is het doel van netwerksegmentatie?',
      en: 'What is the purpose of network segmentation?',
    },
    options: [
      {
        text: {
          nl: 'Voorkomen dat een aanvaller die één deel van het netwerk bereikt, zich vrij kan bewegen naar alle andere systemen',
          en: 'Preventing an attacker who reaches one part of the network from moving freely to all other systems',
        },
        correct: true,
      },
      {
        text: {
          nl: 'De internetsnelheid voor gebruikers verhogen',
          en: 'Increasing internet speed for users',
        },
        rationale: {
          nl: 'Prestatiewinst kan een bijeffect zijn, maar is niet het beveiligingsdoel.',
          en: 'Performance gains can be a side effect but are not the security purpose.',
        },
      },
      {
        text: {
          nl: 'Het aantal benodigde IP-adressen verminderen',
          en: 'Reducing the number of IP addresses required',
        },
        rationale: {
          nl: 'Segmentatie vraagt doorgaans juist om meer adresruimte en structuur.',
          en: 'Segmentation typically requires more address space and structure.',
        },
      },
      {
        text: {
          nl: 'Back-ups sneller kunnen maken',
          en: 'Making backups faster',
        },
        rationale: {
          nl: 'Back-upsnelheid staat los van segmentatie.',
          en: 'Backup speed is unrelated to segmentation.',
        },
      },
    ],
    explanation: {
      nl: 'Segmentatie beperkt laterale beweging: een aanvaller die één werkstation compromitteert, komt niet automatisch bij de servers of de productieomgeving. Dit is een toepassing van defence in depth — meerdere lagen, zodat het falen van één maatregel niet meteen tot volledige compromittatie leidt. Een DMZ is een specifiek segment voor systemen die van buiten bereikbaar moeten zijn.',
      en: 'Segmentation limits lateral movement: an attacker who compromises one workstation does not automatically reach the servers or production environment. This applies defence in depth — multiple layers, so the failure of one control does not immediately lead to full compromise. A DMZ is a specific segment for systems that must be reachable from outside.',
    },
    source: 'Exameneis 3.5.3',
  },
  {
    id: 'isfs-q047',
    objective: '3.5.1',
    type: 'standard',
    bloom: 1,
    difficulty: 2,
    stem: {
      nl: 'Een organisatie vervangt honderd laptops. Wat moet er gebeuren met de oude apparaten?',
      en: 'An organization is replacing a hundred laptops. What must happen to the old devices?',
    },
    options: [
      {
        text: {
          nl: 'De gegevensdragers moeten aantoonbaar veilig worden gewist of fysiek vernietigd voordat de apparaten het pand verlaten',
          en: 'The storage media must be demonstrably securely wiped or physically destroyed before the devices leave the premises',
        },
        correct: true,
      },
      {
        text: {
          nl: 'De bestanden verwijderen en de prullenbak legen volstaat',
          en: 'Deleting the files and emptying the recycle bin is sufficient',
        },
        rationale: {
          nl: 'Verwijderde bestanden zijn met standaardgereedschap eenvoudig terug te halen; alleen de verwijzing verdwijnt, niet de gegevens.',
          en: 'Deleted files are easily recovered with standard tools; only the reference disappears, not the data.',
        },
      },
      {
        text: {
          nl: 'De laptops mogen aan medewerkers worden meegegeven zolang het wachtwoord is gewijzigd',
          en: 'The laptops may be given to employees as long as the password has been changed',
        },
        rationale: {
          nl: 'Een wachtwoord beschermt de gegevens niet als iemand de schijf uitleest of van een ander medium opstart.',
          en: 'A password does not protect the data if someone reads the disk directly or boots from other media.',
        },
      },
      {
        text: {
          nl: 'Het volstaat de laptops te formatteren',
          en: 'Formatting the laptops is sufficient',
        },
        rationale: {
          nl: 'Een standaardformattering overschrijft de gegevens niet volledig en is onvoldoende voor gevoelige informatie.',
          en: 'A standard format does not fully overwrite the data and is insufficient for sensitive information.',
        },
      },
    ],
    explanation: {
      nl: 'Veilige afvoer hoort bij de laatste fase van de assetlevenscyclus. Methoden: meervoudig overschrijven, cryptografisch wissen (de versleutelingssleutel vernietigen bij volledig versleutelde schijven), degaussen bij magnetische media, of fysieke vernietiging. Belangrijk is de aantoonbaarheid: leg vast wát is vernietigd, wanneer en door wie — bij uitbesteding via een vernietigingscertificaat.',
      en: 'Secure disposal belongs to the final phase of the asset lifecycle. Methods: multiple overwrites, cryptographic erasure (destroying the encryption key on fully encrypted disks), degaussing for magnetic media, or physical destruction. Demonstrability matters: record what was destroyed, when and by whom — via a destruction certificate when outsourced.',
    },
    source: 'Exameneis 3.5.1',
  },
  {
    id: 'isfs-q048',
    objective: '3.5.6',
    type: 'standard',
    bloom: 2,
    difficulty: 3,
    stem: {
      nl: 'Waarom moeten logbestanden worden beschermd tegen wijziging?',
      en: 'Why must log files be protected against modification?',
    },
    options: [
      {
        text: {
          nl: 'Omdat een aanvaller anders zijn sporen kan wissen, waardoor detectie en bewijsvoering onmogelijk worden',
          en: 'Because otherwise an attacker can erase their traces, making detection and evidence impossible',
        },
        correct: true,
      },
      {
        text: {
          nl: 'Omdat logbestanden anders te veel opslagruimte innemen',
          en: 'Because log files would otherwise consume too much storage space',
        },
        rationale: {
          nl: 'Opslagbeheer is een praktisch punt, geen reden voor integriteitsbescherming.',
          en: 'Storage management is a practical matter, not a reason for integrity protection.',
        },
      },
      {
        text: {
          nl: 'Omdat gebruikers hun eigen logbestanden moeten kunnen inzien',
          en: 'Because users must be able to view their own log files',
        },
        rationale: {
          nl: 'Inzage is een privacy-aspect; bescherming tegen wijziging dient de betrouwbaarheid van het logboek.',
          en: 'Access is a privacy aspect; protection against modification serves the reliability of the log.',
        },
      },
      {
        text: {
          nl: 'Omdat de wet voorschrijft dat logs zeven jaar bewaard blijven',
          en: 'Because the law requires logs to be retained for seven years',
        },
        rationale: {
          nl: 'Bewaartermijnen verschillen per soort gegeven en per wet; zeven jaar is geen algemene regel voor logs.',
          en: 'Retention periods vary per data type and law; seven years is not a general rule for logs.',
        },
      },
    ],
    explanation: {
      nl: 'Een logboek is alleen bruikbaar als bewijs wanneer de integriteit ervan vaststaat. Maatregelen: logs direct wegschrijven naar een centrale, apart beveiligde logserver, append-only opslag, beperkte toegangsrechten (ook beheerders mogen logs niet kunnen aanpassen) en integriteitscontroles. Dit ondersteunt zowel controleerbaarheid als eindverantwoordelijkheid.',
      en: 'A log is only usable as evidence when its integrity is assured. Controls: write logs immediately to a central, separately secured log server, append-only storage, restricted access rights (administrators too must not be able to alter logs) and integrity checks. This supports both auditability and accountability.',
    },
    source: 'Exameneis 3.5.6',
  },
  {
    id: 'isfs-q049',
    objective: '3.2.2',
    type: 'standard',
    bloom: 2,
    difficulty: 2,
    stem: {
      nl: 'Waarom moeten toegangsrechten periodiek worden herzien?',
      en: 'Why must access rights be reviewed periodically?',
    },
    options: [
      {
        text: {
          nl: 'Omdat medewerkers bij functiewisselingen rechten stapelen die zij niet meer nodig hebben',
          en: 'Because employees accumulate rights on role changes that they no longer need',
        },
        correct: true,
      },
      {
        text: {
          nl: 'Omdat wachtwoorden na verloop van tijd verlopen',
          en: 'Because passwords expire over time',
        },
        rationale: {
          nl: 'Wachtwoordverloop is een aparte maatregel en staat los van de omvang van iemands rechten.',
          en: 'Password expiry is a separate control and is unrelated to the extent of someone’s rights.',
        },
      },
      {
        text: {
          nl: 'Omdat de AVG jaarlijkse herziening voorschrijft',
          en: 'Because the GDPR prescribes annual review',
        },
        rationale: {
          nl: 'De AVG vereist passende maatregelen maar noemt geen vaste herzieningsfrequentie voor autorisaties.',
          en: 'The GDPR requires appropriate measures but names no fixed review frequency for authorizations.',
        },
      },
      {
        text: {
          nl: 'Omdat systemen anders trager worden door te veel accounts',
          en: 'Because systems otherwise slow down due to too many accounts',
        },
        rationale: {
          nl: 'Prestaties zijn niet de reden; het risico is ongeautoriseerde toegang.',
          en: 'Performance is not the reason; the risk is unauthorized access.',
        },
      },
    ],
    explanation: {
      nl: 'Rechtenstapeling (privilege creep) ontstaat wanneer bij een functiewissel wel nieuwe rechten worden toegekend, maar oude niet worden ingetrokken. Na een aantal jaar heeft zo’n medewerker aanzienlijk meer toegang dan nodig, wat het need-to-know-principe en de functiescheiding ondermijnt. Periodieke herbeoordeling door de eigenaar van het systeem of de informatie corrigeert dit.',
      en: 'Privilege creep arises when a role change grants new rights without revoking the old ones. After a few years such an employee has considerably more access than needed, undermining need-to-know and segregation of duties. Periodic recertification by the system or information owner corrects this.',
    },
    source: 'Exameneis 3.2.2',
  },
  {
    id: 'isfs-q050',
    objective: '3.1.1',
    type: 'standard',
    bloom: 1,
    difficulty: 2,
    stem: {
      nl: 'Een organisatie plaatst een sprinklerinstallatie in de serverruimte. Om welk soort beheersmaatregel gaat het?',
      en: 'An organization installs a sprinkler system in the server room. What type of control is this?',
    },
    options: [
      { text: { nl: 'Repressief', en: 'Repressive' }, correct: true },
      {
        text: { nl: 'Preventief', en: 'Preventive' },
        rationale: {
          nl: 'De installatie voorkomt de brand niet; ze treedt pas in werking als er brand ís.',
          en: 'The system does not prevent the fire; it activates only once a fire exists.',
        },
      },
      {
        text: { nl: 'Detectief', en: 'Detective' },
        rationale: {
          nl: 'De rookmelder is detectief; de blusinstallatie beperkt vervolgens de gevolgen.',
          en: 'The smoke detector is detective; the suppression system then limits the consequences.',
        },
      },
      {
        text: { nl: 'Correctief', en: 'Corrective' },
        rationale: {
          nl: 'Correctief is het herstel achteraf, bijvoorbeeld het vervangen van beschadigde apparatuur.',
          en: 'Corrective is the restoration afterwards, for example replacing damaged equipment.',
        },
      },
    ],
    explanation: {
      nl: 'Repressieve maatregelen beperken de gevolgen terwijl het incident zich voltrekt. Naast blusinstallaties: het isoleren van een besmet netwerksegment, het blokkeren van een gecompromitteerd account, of het afsluiten van een lekkende waterleiding. Denken in de incidentcyclus — preventief, detectief, repressief, correctief — helpt bij het samenstellen van een evenwichtig maatregelenpakket.',
      en: 'Repressive controls limit consequences while the incident unfolds. Besides suppression systems: isolating an infected network segment, blocking a compromised account, or shutting off a leaking water pipe. Thinking in the incident cycle — preventive, detective, repressive, corrective — helps compose a balanced set of controls.',
    },
    source: 'Exameneis 3.1.1',
  },
];
