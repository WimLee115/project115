import type { QuestionSeed } from '../types';

/**
 * EXIN ISFS — domein 1 (Informatie en beveiliging, 27,5%) en
 * domein 2 (Dreigingen en risico's, 12,5%).
 *
 * EXIN-examens zijn vaak scenariogericht: een korte situatieschets gevolgd
 * door de vraag welk begrip, welke maatregel of welke strategie van toepassing
 * is. Dat patroon is hier aangehouden.
 */

export const questions: QuestionSeed[] = [
  /* --- 1.1 Concepten met betrekking tot informatie -------------------- */
  {
    id: 'isfs-q001',
    objective: '1.1.1',
    type: 'standard',
    bloom: 2,
    difficulty: 1,
    stem: {
      nl: 'Een logbestand bevat de regel "192.168.1.14 – 08:32 – login mislukt". Een analist stelt vast dat dit de vijfde mislukte poging binnen een minuut is vanaf hetzelfde adres. Wat is hier het verschil tussen data en informatie?',
      en: 'A log file contains the line "192.168.1.14 – 08:32 – login failed". An analyst determines this is the fifth failed attempt within a minute from the same address. What is the difference between data and information here?',
    },
    options: [
      {
        text: {
          nl: 'De logregel is data; de vaststelling dat het om een mogelijke aanval gaat is informatie',
          en: 'The log line is data; the determination that this may be an attack is information',
        },
        correct: true,
      },
      {
        text: {
          nl: 'De logregel is informatie; de vaststelling is kennis',
          en: 'The log line is information; the determination is knowledge',
        },
        rationale: {
          nl: 'Een losse logregel heeft nog geen betekenis en is dus data, geen informatie.',
          en: 'A single log line carries no meaning yet and is therefore data, not information.',
        },
      },
      {
        text: {
          nl: 'Beide zijn data, want alles in een logbestand is data',
          en: 'Both are data, because everything in a log file is data',
        },
        rationale: {
          nl: 'De opslaglocatie bepaalt niet of iets data of informatie is; interpretatie in een context doet dat.',
          en: 'The storage location does not determine whether something is data or information; interpretation in context does.',
        },
      },
      {
        text: {
          nl: 'Er is geen verschil; data en informatie zijn synoniemen',
          en: 'There is no difference; data and information are synonyms',
        },
        rationale: {
          nl: 'Het onderscheid is fundamenteel binnen informatiebeveiliging: je beveiligt informatie vanwege de waarde ervan.',
          en: 'The distinction is fundamental in information security: you protect information because of its value.',
        },
      },
    ],
    explanation: {
      nl: 'Data zijn ruwe, op zichzelf staande feiten zonder betekenis. Informatie is data die is geïnterpreteerd, in een context is geplaatst en daardoor betekenis heeft gekregen. Die betekenis maakt informatie waardevol — en daarmee het beschermen waard.',
      en: 'Data are raw, standalone facts without meaning. Information is data that has been interpreted, placed in context and thereby given meaning. That meaning is what makes information valuable — and therefore worth protecting.',
    },
    source: 'Exameneis 1.1.1',
  },
  {
    id: 'isfs-q002',
    objective: '1.2.1',
    type: 'standard',
    bloom: 2,
    difficulty: 1,
    stem: {
      nl: 'Door een fout in een import zijn de saldi van 200 klanten met een factor 10 vermenigvuldigd. Welk betrouwbaarheidsaspect is geschonden?',
      en: 'Due to an import error, the balances of 200 customers were multiplied by a factor of 10. Which reliability aspect has been breached?',
    },
    options: [
      { text: { nl: 'Integriteit', en: 'Integrity' }, correct: true },
      {
        text: { nl: 'Vertrouwelijkheid', en: 'Confidentiality' },
        rationale: {
          nl: 'Vertrouwelijkheid gaat over wie toegang heeft tot informatie. Hier is niets uitgelekt; de gegevens zijn onjuist geworden.',
          en: 'Confidentiality concerns who has access to information. Nothing leaked here; the data became incorrect.',
        },
      },
      {
        text: { nl: 'Beschikbaarheid', en: 'Availability' },
        rationale: {
          nl: 'Beschikbaarheid gaat over toegankelijkheid op het moment dat je de informatie nodig hebt. De gegevens zijn wel beschikbaar, maar niet juist.',
          en: 'Availability concerns accessibility when the information is needed. The data are available, just not correct.',
        },
      },
      {
        text: { nl: 'Controleerbaarheid', en: 'Auditability' },
        rationale: {
          nl: 'Controleerbaarheid is een aanvullend aspect: kunnen vaststellen of iets juist is verlopen. Hier is het primaire aspect integriteit.',
          en: 'Auditability is a supplementary aspect: being able to establish whether something proceeded correctly. Here the primary aspect is integrity.',
        },
      },
    ],
    explanation: {
      nl: 'De BIV-driehoek: Beschikbaarheid (de informatie is toegankelijk wanneer nodig), Integriteit (de informatie is juist, volledig en tijdig) en Vertrouwelijkheid (alleen bevoegden hebben toegang). Onjuiste saldi raken de juistheid van gegevens en dus de integriteit.',
      en: 'The CIA triad: Availability (information is accessible when needed), Integrity (information is correct, complete and timely) and Confidentiality (only authorized parties have access). Incorrect balances affect data correctness and therefore integrity.',
    },
    source: 'Exameneis 1.2.1',
  },
  {
    id: 'isfs-q003',
    objective: '1.2.1',
    type: 'standard',
    bloom: 2,
    difficulty: 2,
    stem: {
      nl: 'Een ransomware-aanval versleutelt de bestandsservers. De gegevens zijn niet gestolen en niet gewijzigd, maar niemand kan er nog bij. Welk aspect is primair geschonden?',
      en: 'A ransomware attack encrypts the file servers. The data were not stolen and not modified, but nobody can access them. Which aspect is primarily breached?',
    },
    options: [
      { text: { nl: 'Beschikbaarheid', en: 'Availability' }, correct: true },
      {
        text: { nl: 'Vertrouwelijkheid', en: 'Confidentiality' },
        rationale: {
          nl: 'Er is in dit scenario expliciet niets gestolen of ingezien door onbevoegden.',
          en: 'In this scenario nothing was explicitly stolen or viewed by unauthorized parties.',
        },
      },
      {
        text: { nl: 'Integriteit', en: 'Integrity' },
        rationale: {
          nl: 'De gegevens zijn niet inhoudelijk gewijzigd; ze zijn onbereikbaar gemaakt. Bij moderne ransomware met datadiefstal zouden meerdere aspecten geraakt zijn.',
          en: 'The data content was not modified; it was made inaccessible. With modern ransomware involving data theft, multiple aspects would be affected.',
        },
      },
      {
        text: { nl: 'Eindverantwoordelijkheid', en: 'Accountability' },
        rationale: {
          nl: 'Eindverantwoordelijkheid gaat over wie aanspreekbaar is, niet over de aard van de schending.',
          en: 'Accountability concerns who can be held answerable, not the nature of the breach.',
        },
      },
    ],
    explanation: {
      nl: 'Beschikbaarheid betekent dat informatie toegankelijk en bruikbaar is op het moment dat een bevoegde gebruiker die nodig heeft. Versleuteling door een aanvaller maakt de informatie ontoegankelijk, zonder de inhoud te wijzigen of prijs te geven. Let bij examenvragen goed op wat er precies wél en niet is gebeurd.',
      en: 'Availability means information is accessible and usable when an authorized user needs it. Encryption by an attacker makes information inaccessible without changing or disclosing its content. In exam questions, read carefully what did and did not happen.',
    },
    source: 'Exameneis 1.2.1',
  },
  {
    id: 'isfs-q004',
    objective: '1.2.2',
    type: 'standard',
    bloom: 1,
    difficulty: 2,
    stem: {
      nl: 'Wat betekent eindverantwoordelijkheid (accountability) binnen informatiebeveiliging?',
      en: 'What does accountability mean within information security?',
    },
    options: [
      {
        text: {
          nl: 'Dat handelingen herleidbaar zijn tot een individu of entiteit die daarop aanspreekbaar is',
          en: 'That actions can be traced back to an individual or entity who can be held answerable for them',
        },
        correct: true,
      },
      {
        text: {
          nl: 'Dat een organisatie een verzekering afsluit tegen informatiebeveiligingsincidenten',
          en: 'That an organization takes out insurance against information security incidents',
        },
        rationale: {
          nl: 'Verzekering is een risicostrategie en een soort beheersmaatregel, geen definitie van eindverantwoordelijkheid.',
          en: 'Insurance is a risk strategy and a type of control, not a definition of accountability.',
        },
      },
      {
        text: {
          nl: 'Dat alle medewerkers een geheimhoudingsverklaring ondertekenen',
          en: 'That all employees sign a non-disclosure agreement',
        },
        rationale: {
          nl: 'Een NDA is een menselijke beheersmaatregel die eindverantwoordelijkheid ondersteunt, maar er niet de definitie van is.',
          en: 'An NDA is a people control that supports accountability but is not its definition.',
        },
      },
      {
        text: {
          nl: 'Dat informatie altijd binnen de organisatie blijft',
          en: 'That information always remains within the organization',
        },
        rationale: {
          nl: 'Dit raakt aan vertrouwelijkheid, niet aan eindverantwoordelijkheid.',
          en: 'This touches on confidentiality, not accountability.',
        },
      },
    ],
    explanation: {
      nl: 'Eindverantwoordelijkheid en controleerbaarheid zijn aanvullende aspecten naast de BIV-driehoek. Eindverantwoordelijkheid betekent dat handelingen herleidbaar zijn tot een aanspreekbare partij; controleerbaarheid betekent dat achteraf kan worden vastgesteld of processen en maatregelen correct hebben gewerkt. Logging en monitoring maken beide praktisch mogelijk.',
      en: 'Accountability and auditability are supplementary aspects alongside the CIA triad. Accountability means actions can be traced to an answerable party; auditability means it can be established afterwards whether processes and controls worked correctly. Logging and monitoring make both practically possible.',
    },
    source: 'Exameneis 1.2.2',
  },
  {
    id: 'isfs-q005',
    objective: '1.3.1',
    type: 'standard',
    bloom: 1,
    difficulty: 2,
    stem: {
      nl: 'Wat is het belangrijkste doel van een informatiebeveiligingsbeleid?',
      en: 'What is the main purpose of an information security policy?',
    },
    options: [
      {
        text: {
          nl: 'De richting en het commitment van de directie vastleggen en het kader bieden waarbinnen beveiligingsmaatregelen worden gekozen',
          en: 'To record management’s direction and commitment and provide the framework within which security controls are chosen',
        },
        correct: true,
      },
      {
        text: {
          nl: 'Een technische beschrijving geven van alle geïnstalleerde beveiligingsproducten',
          en: 'To provide a technical description of all installed security products',
        },
        rationale: {
          nl: 'Technische details horen in onderliggende procedures en werkinstructies, niet in het beleid.',
          en: 'Technical details belong in underlying procedures and work instructions, not in the policy.',
        },
      },
      {
        text: {
          nl: 'De organisatie vrijwaren van aansprakelijkheid bij een datalek',
          en: 'To indemnify the organization from liability in the event of a data breach',
        },
        rationale: {
          nl: 'Een beleid vrijwaart niet van aansprakelijkheid; het toont juist aan dat er gestuurd wordt op beveiliging.',
          en: 'A policy does not indemnify from liability; it demonstrates that security is being managed.',
        },
      },
      {
        text: {
          nl: 'Vastleggen welke leverancier de beveiliging uitvoert',
          en: 'To record which supplier performs the security work',
        },
        rationale: {
          nl: 'Leveranciersafspraken staan in contracten en verwerkersovereenkomsten, niet in het beleid zelf.',
          en: 'Supplier arrangements are recorded in contracts and processing agreements, not in the policy itself.',
        },
      },
    ],
    explanation: {
      nl: 'Het informatiebeveiligingsbeleid wordt vastgesteld en gedragen door de directie. Het bevat doelstellingen, scope, uitgangspunten, rollen en verantwoordelijkheden, en de wijze waarop naleving wordt getoetst. Het beleid is richtinggevend; procedures en werkinstructies maken het concreet.',
      en: 'The information security policy is established and endorsed by senior management. It contains objectives, scope, principles, roles and responsibilities, and how compliance is assessed. The policy sets direction; procedures and work instructions make it concrete.',
    },
    source: 'Exameneis 1.3.1',
  },
  {
    id: 'isfs-q006',
    objective: '1.3.3',
    type: 'standard',
    bloom: 1,
    difficulty: 2,
    stem: {
      nl: 'Wie is binnen een organisatie doorgaans eindverantwoordelijk voor informatiebeveiliging?',
      en: 'Who is typically ultimately responsible for information security within an organization?',
    },
    options: [
      {
        text: {
          nl: 'De directie of het hoogste leidinggevende orgaan',
          en: 'Senior management or the highest governing body',
        },
        correct: true,
      },
      {
        text: {
          nl: 'De chief information security officer (CISO)',
          en: 'The chief information security officer (CISO)',
        },
        rationale: {
          nl: 'De CISO geeft richting, adviseert en coördineert, maar de eindverantwoordelijkheid blijft bij de directie liggen.',
          en: 'The CISO provides direction, advises and coordinates, but ultimate responsibility remains with senior management.',
        },
      },
      {
        text: {
          nl: 'De systeembeheerder die de techniek inricht',
          en: 'The system administrator who configures the technology',
        },
        rationale: {
          nl: 'De beheerder voert maatregelen uit; verantwoordelijkheid voor het geheel ligt hoger in de organisatie.',
          en: 'The administrator implements controls; responsibility for the whole sits higher in the organization.',
        },
      },
      {
        text: {
          nl: 'Iedere medewerker afzonderlijk voor zijn eigen werkplek',
          en: 'Each individual employee for their own workstation',
        },
        rationale: {
          nl: 'Elke medewerker heeft een eigen verantwoordelijkheid, maar dat is niet de eindverantwoordelijkheid voor het geheel.',
          en: 'Every employee has an individual responsibility, but that is not ultimate responsibility for the whole.',
        },
      },
    ],
    explanation: {
      nl: 'Rollen: de directie is eindverantwoordelijk en stelt het beleid vast. De CISO of information security manager (ISM) geeft richting op strategisch en tactisch niveau. De information security officer (ISO) vertaalt beleid naar de praktijk binnen een domein. De eigenaar van informatie bepaalt de classificatie. Iedere medewerker heeft een eigen verantwoordelijkheid.',
      en: 'Roles: senior management is ultimately responsible and establishes the policy. The CISO or information security manager (ISM) provides direction at strategic and tactical level. The information security officer (ISO) translates policy into practice within a domain. The information owner determines the classification. Every employee has an individual responsibility.',
    },
    source: 'Exameneis 1.3.3',
  },
  {
    id: 'isfs-q007',
    objective: '1.3.2',
    type: 'standard',
    bloom: 2,
    difficulty: 2,
    stem: {
      nl: 'Een organisatie besteedt haar salarisadministratie uit aan een externe partij die persoonsgegevens verwerkt. Welke maatregel is hierbij het belangrijkst?',
      en: 'An organization outsources its payroll to an external party that processes personal data. Which control is most important here?',
    },
    options: [
      {
        text: {
          nl: 'Beveiligingseisen contractueel vastleggen, inclusief een verwerkersovereenkomst, en de naleving periodiek toetsen',
          en: 'Contractually recording security requirements, including a data processing agreement, and periodically assessing compliance',
        },
        correct: true,
      },
      {
        text: {
          nl: 'Erop vertrouwen dat de leverancier gecertificeerd is en verder geen afspraken maken',
          en: 'Trusting that the supplier is certified and making no further arrangements',
        },
        rationale: {
          nl: 'Een certificaat is een indicatie, geen garantie, en zegt niets over de specifieke afspraken voor jouw gegevens.',
          en: 'A certificate is an indication, not a guarantee, and says nothing about the specific arrangements for your data.',
        },
      },
      {
        text: {
          nl: 'De verantwoordelijkheid voor de gegevens volledig overdragen aan de leverancier',
          en: 'Fully transferring responsibility for the data to the supplier',
        },
        rationale: {
          nl: 'Onder de AVG blijft de verwerkingsverantwoordelijke aansprakelijk; verantwoordelijkheid kun je niet wegcontracteren.',
          en: 'Under the GDPR the controller remains liable; responsibility cannot be contracted away.',
        },
      },
      {
        text: {
          nl: 'Alle gegevens versleutelen zodat de leverancier ze niet kan lezen',
          en: 'Encrypting all data so the supplier cannot read them',
        },
        rationale: {
          nl: 'Technisch onmogelijk bij salarisverwerking: de leverancier moet de gegevens juist verwerken.',
          en: 'Technically impossible for payroll processing: the supplier must actually process the data.',
        },
      },
    ],
    explanation: {
      nl: 'Bij uitbesteding blijft de organisatie verantwoordelijk. Beveiliging in de leveranciersketen vraagt om: beveiligingseisen in contracten, een verwerkersovereenkomst bij persoonsgegevens, afspraken over incidentmelding, het recht om te auditen, en periodieke toetsing van de naleving. Due diligence vooraf, due care tijdens de looptijd.',
      en: 'When outsourcing, the organization remains responsible. Security in the supplier chain requires: security requirements in contracts, a data processing agreement for personal data, arrangements for incident notification, the right to audit, and periodic compliance assessment. Due diligence beforehand, due care throughout.',
    },
    source: 'Exameneis 1.3.2',
  },
  {
    id: 'isfs-q008',
    objective: '1.1.2',
    type: 'standard',
    bloom: 2,
    difficulty: 2,
    stem: {
      nl: 'Wat is een ISMS (Information Security Management System)?',
      en: 'What is an ISMS (information security management system)?',
    },
    options: [
      {
        text: {
          nl: 'Het geheel van beleid, processen, procedures en middelen waarmee een organisatie informatiebeveiliging systematisch inricht, uitvoert, bewaakt en verbetert',
          en: 'The set of policies, processes, procedures and resources with which an organization systematically establishes, operates, monitors and improves information security',
        },
        correct: true,
      },
      {
        text: {
          nl: 'Een softwarepakket dat beveiligingsincidenten registreert en analyseert',
          en: 'A software package that records and analyses security incidents',
        },
        rationale: {
          nl: 'Dat is een SIEM. Een ISMS is een managementsysteem, geen tool.',
          en: 'That is a SIEM. An ISMS is a management system, not a tool.',
        },
      },
      {
        text: {
          nl: 'De afdeling die verantwoordelijk is voor de beveiliging van de IT-infrastructuur',
          en: 'The department responsible for securing the IT infrastructure',
        },
        rationale: {
          nl: 'Een ISMS is een systeem van werken, geen organisatieonderdeel.',
          en: 'An ISMS is a system of working, not an organizational unit.',
        },
      },
      {
        text: {
          nl: 'Het certificaat dat een organisatie ontvangt na een geslaagde audit',
          en: 'The certificate an organization receives after a successful audit',
        },
        rationale: {
          nl: 'Het certificaat bevestigt dat een ISMS aan de eisen voldoet; het ís het ISMS niet.',
          en: 'The certificate confirms that an ISMS meets the requirements; it is not the ISMS itself.',
        },
      },
    ],
    explanation: {
      nl: 'ISO/IEC 27001 stelt de eisen aan een ISMS. Het ISMS werkt volgens de Plan-Do-Check-Act-cyclus: plannen (context, scope, risicobeoordeling, doelstellingen), uitvoeren (maatregelen implementeren), controleren (monitoren, meten, auditeren) en bijsturen (corrigeren en verbeteren). Zo wordt beveiliging een doorlopend proces in plaats van een eenmalig project.',
      en: 'ISO/IEC 27001 sets the requirements for an ISMS. The ISMS operates on the Plan-Do-Check-Act cycle: plan (context, scope, risk assessment, objectives), do (implement controls), check (monitor, measure, audit) and act (correct and improve). This makes security an ongoing process rather than a one-off project.',
    },
    source: 'Exameneis 1.1.2',
  },
  {
    id: 'isfs-q009',
    objective: '1.1.2',
    type: 'standard',
    bloom: 2,
    difficulty: 2,
    stem: {
      nl: 'Waarom is informatie voor een organisatie een bedrijfsmiddel (asset)?',
      en: 'Why is information a business asset for an organization?',
    },
    options: [
      {
        text: {
          nl: 'Omdat informatie waarde vertegenwoordigt voor de bedrijfsvoering en verlies, wijziging of openbaarmaking ervan schade veroorzaakt',
          en: 'Because information represents value for business operations and its loss, modification or disclosure causes damage',
        },
        correct: true,
      },
      {
        text: {
          nl: 'Omdat informatie altijd op de balans van de organisatie staat',
          en: 'Because information always appears on the organization’s balance sheet',
        },
        rationale: {
          nl: 'Informatie staat zelden als post op de balans, maar is desondanks een waardevol bedrijfsmiddel.',
          en: 'Information rarely appears as a balance sheet item, yet is still a valuable business asset.',
        },
      },
      {
        text: {
          nl: 'Omdat de AVG voorschrijft dat informatie als bedrijfsmiddel wordt aangemerkt',
          en: 'Because the GDPR prescribes that information be designated a business asset',
        },
        rationale: {
          nl: 'De AVG regelt de bescherming van persoonsgegevens, niet de boekhoudkundige status van informatie.',
          en: 'The GDPR governs the protection of personal data, not the accounting status of information.',
        },
      },
      {
        text: {
          nl: 'Omdat informatie in tegenstelling tot fysieke middelen niet kan worden gestolen',
          en: 'Because unlike physical assets, information cannot be stolen',
        },
        rationale: {
          nl: 'Informatie kan juist wel worden gestolen — en anders dan bij fysieke diefstal blijft het origineel vaak aanwezig, waardoor de diefstal onopgemerkt blijft.',
          en: 'Information certainly can be stolen — and unlike physical theft, the original often remains, which is why the theft goes unnoticed.',
        },
      },
    ],
    explanation: {
      nl: 'Informatie is waardevol én kwetsbaar. Dat is de kern van informatiebeveiliging: informatiebeveiliging is de bescherming van de vertrouwelijkheid, integriteit en beschikbaarheid van informatie. Omdat informatie waarde heeft, is er een belang om die te beschermen tegen dreigingen die deze aspecten aantasten.',
      en: 'Information is both valuable and vulnerable. That is the core of information security: information security is the protection of the confidentiality, integrity and availability of information. Because information has value, there is an interest in protecting it against threats to these aspects.',
    },
    source: 'Exameneis 1.1.2',
  },
  {
    id: 'isfs-q010',
    objective: '1.2.2',
    type: 'standard',
    bloom: 1,
    difficulty: 2,
    stem: {
      nl: 'Een auditor wil achteraf vaststellen of een betaling correct is geautoriseerd. Welk betrouwbaarheidsaspect maakt dit mogelijk?',
      en: 'An auditor wants to establish afterwards whether a payment was correctly authorized. Which reliability aspect makes this possible?',
    },
    options: [
      { text: { nl: 'Controleerbaarheid', en: 'Auditability' }, correct: true },
      {
        text: { nl: 'Beschikbaarheid', en: 'Availability' },
        rationale: {
          nl: 'Beschikbaarheid zorgt dat de gegevens toegankelijk zijn, maar niet dat de gang van zaken achteraf te reconstrueren is.',
          en: 'Availability ensures the data are accessible but not that the course of events can be reconstructed afterwards.',
        },
      },
      {
        text: { nl: 'Vertrouwelijkheid', en: 'Confidentiality' },
        rationale: {
          nl: 'Vertrouwelijkheid beperkt juist wie toegang heeft; dat helpt de auditor niet bij reconstructie.',
          en: 'Confidentiality restricts who has access; that does not help the auditor reconstruct events.',
        },
      },
      {
        text: { nl: 'Integriteit', en: 'Integrity' },
        rationale: {
          nl: 'Integriteit borgt de juistheid van de gegevens zelf, maar controleerbaarheid gaat over het kunnen aantonen dat het proces correct is verlopen.',
          en: 'Integrity safeguards the correctness of the data itself, while auditability concerns being able to demonstrate the process ran correctly.',
        },
      },
    ],
    explanation: {
      nl: 'Controleerbaarheid (auditability) betekent dat achteraf kan worden vastgesteld of processen, transacties en maatregelen correct zijn verlopen. Logging, audittrails en functiescheiding maken dit mogelijk. Samen met eindverantwoordelijkheid vormt dit een aanvulling op de BIV-driehoek.',
      en: 'Auditability means it can be established afterwards whether processes, transactions and controls ran correctly. Logging, audit trails and segregation of duties make this possible. Together with accountability, this supplements the CIA triad.',
    },
    source: 'Exameneis 1.2.2',
  },

  {
    id: 'isfs-q057',
    objective: '1.3.1',
    type: 'standard',
    bloom: 1,
    difficulty: 2,
    stem: {
      nl: 'Welk onderdeel hoort NIET thuis in een informatiebeveiligingsbeleid?',
      en: 'Which element does NOT belong in an information security policy?',
    },
    options: [
      {
        text: {
          nl: 'De wachtwoorden van de beheeraccounts',
          en: 'The passwords of the administrator accounts',
        },
        correct: true,
      },
      {
        text: {
          nl: 'De doelstellingen en de scope van informatiebeveiliging',
          en: 'The objectives and scope of information security',
        },
        rationale: {
          nl: 'Dit hoort er juist wel in: het beleid bakent af waarop het van toepassing is.',
          en: 'This does belong: the policy delimits what it applies to.',
        },
      },
      {
        text: {
          nl: 'De rollen en verantwoordelijkheden binnen informatiebeveiliging',
          en: 'The roles and responsibilities within information security',
        },
        rationale: {
          nl: 'Dit hoort er wel in: zonder belegde verantwoordelijkheden gebeurt er niets.',
          en: 'This does belong: without assigned responsibilities nothing happens.',
        },
      },
      {
        text: {
          nl: 'De wijze waarop naleving van het beleid wordt getoetst',
          en: 'How compliance with the policy is assessed',
        },
        rationale: {
          nl: 'Dit hoort er wel in: beleid zonder toetsing blijft een papieren werkelijkheid.',
          en: 'This does belong: policy without assessment remains a paper reality.',
        },
      },
    ],
    explanation: {
      nl: 'Wachtwoorden zijn geheimen, geen beleid. Ze horen in een wachtwoordkluis met strikte toegangscontrole, niet in een document dat organisatiebreed wordt verspreid. Het beleid legt vast wát er moet gebeuren en wie waarvoor verantwoordelijk is; concrete geheimen en technische details horen in onderliggende procedures en beveiligde opslag.',
      en: 'Passwords are secrets, not policy. They belong in a password vault with strict access control, not in a document distributed across the organization. The policy records what must happen and who is responsible; concrete secrets and technical details belong in underlying procedures and secure storage.',
    },
    source: 'Exameneis 1.3.1',
  },
  {
    id: 'isfs-q058',
    objective: '1.3.3',
    type: 'standard',
    bloom: 1,
    difficulty: 2,
    stem: {
      nl: 'Wat is de rol van de eigenaar van een informatiemiddel?',
      en: 'What is the role of the owner of an information asset?',
    },
    options: [
      {
        text: {
          nl: 'Bepalen welke waarde het middel heeft, het classificeren en beslissen wie er toegang toe krijgt',
          en: 'Determining the asset’s value, classifying it and deciding who gets access to it',
        },
        correct: true,
      },
      {
        text: {
          nl: 'De technische back-ups uitvoeren en de opslag beheren',
          en: 'Performing the technical backups and managing storage',
        },
        rationale: {
          nl: 'Dat is de rol van de beheerder (custodian), die de maatregelen uitvoert die de eigenaar bepaalt.',
          en: 'That is the custodian’s role, executing the controls the owner determines.',
        },
      },
      {
        text: {
          nl: 'Het informatiebeveiligingsbeleid opstellen en vaststellen',
          en: 'Drafting and establishing the information security policy',
        },
        rationale: {
          nl: 'Beleid opstellen gebeurt door de CISO of ISM; vaststellen doet de directie.',
          en: 'Drafting the policy is done by the CISO or ISM; establishing it is done by senior management.',
        },
      },
      {
        text: {
          nl: 'Beveiligingsincidenten onderzoeken en afhandelen',
          en: 'Investigating and handling security incidents',
        },
        rationale: {
          nl: 'Dat hoort bij incidentmanagement en het securityteam.',
          en: 'That belongs to incident management and the security team.',
        },
      },
    ],
    explanation: {
      nl: 'De eigenaar kent de bedrijfswaarde van de informatie en is daarom degene die classificeert en autoriseert. De beheerder (custodian) voert vervolgens de bijbehorende technische maatregelen uit. Dit onderscheid is essentieel: wie de techniek beheert, weet doorgaans niet hoe gevoelig de inhoud is.',
      en: 'The owner knows the business value of the information and is therefore the one who classifies and authorizes. The custodian then implements the corresponding technical controls. This distinction is essential: whoever manages the technology usually does not know how sensitive the content is.',
    },
    source: 'Exameneis 1.3.3, 3.2.1',
  },
  {
    id: 'isfs-q059',
    objective: '1.1.2',
    type: 'standard',
    bloom: 2,
    difficulty: 2,
    stem: {
      nl: 'Waarom is informatiebeveiliging meer dan alleen een IT-aangelegenheid?',
      en: 'Why is information security more than just an IT matter?',
    },
    options: [
      {
        text: {
          nl: 'Omdat informatie ook op papier, in gesprekken en in de hoofden van medewerkers bestaat, en veel incidenten door menselijk handelen ontstaan',
          en: 'Because information also exists on paper, in conversations and in people’s heads, and many incidents arise from human behaviour',
        },
        correct: true,
      },
      {
        text: {
          nl: 'Omdat de IT-afdeling geen verstand heeft van beveiliging',
          en: 'Because the IT department has no understanding of security',
        },
        rationale: {
          nl: 'De IT-afdeling speelt juist een cruciale rol; het punt is dat zij het niet alléén kan.',
          en: 'The IT department plays a crucial role; the point is that it cannot do it alone.',
        },
      },
      {
        text: {
          nl: 'Omdat de AVG voorschrijft dat beveiliging bij juridische zaken wordt belegd',
          en: 'Because the GDPR requires security to be assigned to the legal department',
        },
        rationale: {
          nl: 'De AVG schrijft geen organisatorische indeling voor; ze eist passende maatregelen.',
          en: 'The GDPR prescribes no organizational structure; it requires appropriate measures.',
        },
      },
      {
        text: {
          nl: 'Omdat technische maatregelen altijd duurder zijn dan organisatorische',
          en: 'Because technical controls are always more expensive than organizational ones',
        },
        rationale: {
          nl: 'Kosten variëren sterk en zijn niet de reden voor de brede scope van informatiebeveiliging.',
          en: 'Costs vary widely and are not the reason for the broad scope of information security.',
        },
      },
    ],
    explanation: {
      nl: 'ISO/IEC 27001 verdeelt de beheersmaatregelen niet voor niets over vier thema’s: organisatorisch, mensen, fysiek en technologisch. Een sterk versleuteld systeem helpt niet als een medewerker het wachtwoord op een briefje schrijft of een onbevoegde meeloopt door de toegangsdeur. Techniek is één van de vier pijlers, niet het geheel.',
      en: 'ISO/IEC 27001 divides controls across four themes for good reason: organizational, people, physical and technological. A strongly encrypted system does not help if an employee writes the password on a note or an unauthorized person tailgates through the access door. Technology is one of four pillars, not the whole.',
    },
    source: 'Exameneis 1.1.2, 3.1.1',
  },
  {
    id: 'isfs-q060',
    objective: '1.2.1',
    type: 'standard',
    bloom: 2,
    difficulty: 3,
    stem: {
      nl: 'Een ziekenhuis maakt patiëntdossiers strikt vertrouwelijk door ze achter zoveel beveiligingslagen te zetten dat artsen er tijdens een spoedgeval niet snel bij kunnen. Wat gaat hier mis?',
      en: 'A hospital makes patient records strictly confidential by placing them behind so many security layers that doctors cannot access them quickly in an emergency. What is going wrong here?',
    },
    options: [
      {
        text: {
          nl: 'De balans tussen de BIV-aspecten is zoek: vertrouwelijkheid gaat ten koste van beschikbaarheid',
          en: 'The balance between the CIA aspects is lost: confidentiality comes at the expense of availability',
        },
        correct: true,
      },
      {
        text: {
          nl: 'De integriteit van de dossiers is aangetast',
          en: 'The integrity of the records has been compromised',
        },
        rationale: {
          nl: 'De gegevens zijn niet onjuist geworden; ze zijn moeilijk bereikbaar.',
          en: 'The data have not become incorrect; they are hard to reach.',
        },
      },
      {
        text: {
          nl: 'Er is te weinig aandacht besteed aan vertrouwelijkheid',
          en: 'Too little attention has been paid to confidentiality',
        },
        rationale: {
          nl: 'Precies andersom: vertrouwelijkheid is hier doorgeslagen ten koste van een ander aspect.',
          en: 'The opposite: confidentiality has been overdone at the expense of another aspect.',
        },
      },
      {
        text: {
          nl: 'De controleerbaarheid is niet geregeld',
          en: 'Auditability has not been arranged',
        },
        rationale: {
          nl: 'Over logging en reconstructie zegt dit scenario niets.',
          en: 'This scenario says nothing about logging or reconstruction.',
        },
      },
    ],
    explanation: {
      nl: 'De drie BIV-aspecten staan soms op gespannen voet met elkaar. Maximale vertrouwelijkheid gaat vrijwel altijd ten koste van beschikbaarheid, en omgekeerd. Het doel van informatiebeveiliging is niet elk aspect maximeren, maar een passend evenwicht kiezen op basis van een risicoafweging — in een ziekenhuis weegt beschikbaarheid bij spoed zwaar mee. Een noodprocedure met achteraf controle (break-glass) is hier de gebruikelijke oplossing.',
      en: 'The three CIA aspects can be in tension with each other. Maximum confidentiality nearly always comes at the cost of availability, and vice versa. The goal of information security is not to maximize every aspect but to choose an appropriate balance based on a risk assessment — in a hospital, availability in emergencies weighs heavily. An emergency procedure with after-the-fact review (break-glass) is the usual solution here.',
    },
    source: 'Exameneis 1.2.1',
  },

  /* --- 2.1 Dreigingen en risico's ------------------------------------- */
  {
    id: 'isfs-q011',
    objective: '2.1.1',
    type: 'standard',
    bloom: 2,
    difficulty: 2,
    stem: {
      nl: 'Een serverruimte heeft geen brandmelder. Er ontstaat brand in het gebouw. Wat is in deze situatie de kwetsbaarheid?',
      en: 'A server room has no fire detector. A fire breaks out in the building. What is the vulnerability in this situation?',
    },
    options: [
      {
        text: { nl: 'Het ontbreken van de brandmelder', en: 'The absence of the fire detector' },
        correct: true,
      },
      {
        text: { nl: 'De brand', en: 'The fire' },
        rationale: {
          nl: 'De brand is de dreiging die zich manifesteert — een niet-menselijke dreiging.',
          en: 'The fire is the threat materializing — a non-human threat.',
        },
      },
      {
        text: {
          nl: 'De uitval van de bedrijfsvoering',
          en: 'The disruption of business operations',
        },
        rationale: {
          nl: 'Dat is de schade of impact, het gevolg van de gerealiseerde dreiging.',
          en: 'That is the damage or impact, the consequence of the realized threat.',
        },
      },
      {
        text: {
          nl: 'De kans dat er brand ontstaat',
          en: 'The likelihood of a fire occurring',
        },
        rationale: {
          nl: 'Dat is de waarschijnlijkheid (likelihood), een van de twee factoren waaruit risico wordt bepaald.',
          en: 'That is likelihood, one of the two factors from which risk is determined.',
        },
      },
    ],
    explanation: {
      nl: 'De keten: een dreiging (brand) benut een kwetsbaarheid (geen brandmelder) en veroorzaakt daarmee schade (uitval). Risico is de combinatie van de kans dat dit gebeurt en de impact als het gebeurt. Beheersmaatregelen grijpen in op de kwetsbaarheid, de kans of de impact.',
      en: 'The chain: a threat (fire) exploits a vulnerability (no fire detector) and thereby causes damage (disruption). Risk is the combination of the likelihood of this happening and the impact if it does. Controls act on the vulnerability, the likelihood or the impact.',
    },
    source: 'Exameneis 2.1.1',
  },
  {
    id: 'isfs-q012',
    objective: '2.1.3',
    type: 'standard',
    bloom: 1,
    difficulty: 2,
    stem: {
      nl: 'Een organisatie besluit een bepaalde online dienst niet aan te bieden omdat de beveiligingsrisico’s te groot zijn. Welke risicostrategie is dit?',
      en: 'An organization decides not to offer a particular online service because the security risks are too great. Which risk strategy is this?',
    },
    options: [
      { text: { nl: 'Risicomijdend (risk avoiding)', en: 'Risk avoiding' }, correct: true },
      {
        text: {
          nl: 'Risicodragend (risicoacceptatie)',
          en: 'Risk bearing (risk acceptance)',
        },
        rationale: {
          nl: 'Bij risicodragend accepteer je het risico bewust en ga je door met de activiteit. Hier wordt de activiteit juist gestaakt.',
          en: 'With risk bearing you consciously accept the risk and continue the activity. Here the activity is abandoned.',
        },
      },
      {
        text: { nl: 'Risiconeutraal', en: 'Risk neutral' },
        rationale: {
          nl: 'Bij risiconeutraal neem je maatregelen zodat de dreiging zich niet meer manifesteert of de schade beperkt blijft — de activiteit gaat wel door.',
          en: 'With risk neutral you take measures so the threat no longer materializes or the damage stays limited — the activity does continue.',
        },
      },
      {
        text: { nl: 'Risico-overdracht via verzekering', en: 'Risk transfer via insurance' },
        rationale: {
          nl: 'Bij overdracht breng je de financiële gevolgen onder bij een derde, maar blijf je de activiteit uitvoeren.',
          en: 'With transfer you place the financial consequences with a third party but continue the activity.',
        },
      },
    ],
    explanation: {
      nl: 'De risicostrategieën: risicodragend (het risico bewust accepteren), risicomijdend (maatregelen nemen die de dreiging wegnemen, bijvoorbeeld door de activiteit te staken) en risiconeutraal (maatregelen die de kans of de schade beperken tot een aanvaardbaar niveau). Overdracht, bijvoorbeeld via verzekering, wordt vaak als vierde variant genoemd.',
      en: 'The risk strategies: risk bearing (consciously accepting the risk), risk avoiding (taking measures that remove the threat, for example by abandoning the activity) and risk neutral (measures that limit likelihood or damage to an acceptable level). Transfer, for example via insurance, is often named as a fourth variant.',
    },
    source: 'Exameneis 2.1.3',
  },
  {
    id: 'isfs-q013',
    objective: '2.1.2',
    type: 'standard',
    bloom: 1,
    difficulty: 2,
    stem: {
      nl: 'Na een datalek daalt het klantvertrouwen en loopt de omzet met 15% terug. Om welk type schade gaat het?',
      en: 'After a data breach, customer trust declines and revenue falls by 15%. What type of damage is this?',
    },
    options: [
      { text: { nl: 'Indirecte schade', en: 'Indirect damage' }, correct: true },
      {
        text: { nl: 'Directe schade', en: 'Direct damage' },
        rationale: {
          nl: 'Directe schade is het onmiddellijke, aanwijsbare gevolg: vernielde apparatuur, verloren gegevens, kosten van herstel.',
          en: 'Direct damage is the immediate, identifiable consequence: destroyed equipment, lost data, recovery costs.',
        },
      },
      {
        text: { nl: 'Restschade', en: 'Residual damage' },
        rationale: {
          nl: 'Dit is geen erkende categorie. Restrisico bestaat wel: het risico dat overblijft na maatregelen.',
          en: 'This is not a recognized category. Residual risk does exist: the risk remaining after controls.',
        },
      },
      {
        text: { nl: 'Verzekerbare schade', en: 'Insurable damage' },
        rationale: {
          nl: 'Verzekerbaarheid is geen schadecategorie maar een eigenschap; zowel directe als indirecte schade kan verzekerbaar zijn.',
          en: 'Insurability is not a damage category but a property; both direct and indirect damage can be insurable.',
        },
      },
    ],
    explanation: {
      nl: 'Directe schade is het onmiddellijke gevolg van een incident: beschadigde apparatuur, verloren gegevens, herstelkosten. Indirecte schade is het gevolg dáárvan: reputatieverlies, omzetdaling, boetes, claims, verlies van marktpositie. Indirecte schade is vaak groter en moeilijker te herstellen dan de directe schade.',
      en: 'Direct damage is the immediate consequence of an incident: damaged equipment, lost data, recovery costs. Indirect damage is the consequence of that: reputational loss, revenue decline, fines, claims, loss of market position. Indirect damage is often larger and harder to repair than the direct damage.',
    },
    source: 'Exameneis 2.1.2',
  },
  {
    id: 'isfs-q014',
    objective: '2.1.4',
    type: 'standard',
    bloom: 1,
    difficulty: 3,
    stem: {
      nl: 'Een organisatie berekent dat een storing gemiddeld tweemaal per jaar optreedt en telkens € 20.000 kost. Welke grootheid is € 40.000 per jaar?',
      en: 'An organization calculates that an outage occurs on average twice a year and costs € 20,000 each time. Which quantity is € 40,000 per year?',
    },
    options: [
      {
        text: { nl: 'Annualized loss expectancy (ALE)', en: 'Annualized loss expectancy (ALE)' },
        correct: true,
      },
      {
        text: {
          nl: 'Single loss expectancy (SLE)',
          en: 'Single loss expectancy (SLE)',
        },
        rationale: {
          nl: 'De SLE is de schade per gebeurtenis: € 20.000.',
          en: 'The SLE is the damage per event: € 20,000.',
        },
      },
      {
        text: {
          nl: 'Annualized rate of occurrence (ARO)',
          en: 'Annualized rate of occurrence (ARO)',
        },
        rationale: {
          nl: 'De ARO is de frequentie per jaar: 2.',
          en: 'The ARO is the frequency per year: 2.',
        },
      },
      {
        text: { nl: 'Restrisico', en: 'Residual risk' },
        rationale: {
          nl: 'Het restrisico is wat overblijft ná het treffen van maatregelen.',
          en: 'Residual risk is what remains after controls have been applied.',
        },
      },
    ],
    explanation: {
      nl: 'Bij kwantitatieve risicoanalyse geldt: ALE = SLE × ARO. Hier: € 20.000 × 2 = € 40.000 per jaar. Dit bedrag is het richtsnoer voor wat een maatregel jaarlijks mag kosten. Bij kwalitatieve risicoanalyse werk je met klassen (hoog, midden, laag) omdat betrouwbare cijfers ontbreken.',
      en: 'In quantitative risk analysis: ALE = SLE × ARO. Here: € 20,000 × 2 = € 40,000 per year. This figure guides what a control may cost annually. In qualitative risk analysis you work with classes (high, medium, low) because reliable figures are unavailable.',
    },
    source: 'Exameneis 2.1.4',
  },
  {
    id: 'isfs-q015',
    objective: '2.1.1',
    type: 'standard',
    bloom: 2,
    difficulty: 2,
    stem: {
      nl: 'Een medewerker laat per ongeluk een usb-stick met klantgegevens in de trein liggen. Om wat voor soort dreiging gaat het?',
      en: 'An employee accidentally leaves a USB stick with customer data on the train. What kind of threat is this?',
    },
    options: [
      {
        text: { nl: 'Een menselijke, niet-opzettelijke dreiging', en: 'A human, unintentional threat' },
        correct: true,
      },
      {
        text: {
          nl: 'Een niet-menselijke dreiging',
          en: 'A non-human threat',
        },
        rationale: {
          nl: 'Niet-menselijke dreigingen zijn natuurlijke of technische oorzaken zoals brand, overstroming of hardwarefalen.',
          en: 'Non-human threats are natural or technical causes such as fire, flooding or hardware failure.',
        },
      },
      {
        text: {
          nl: 'Een menselijke, opzettelijke dreiging',
          en: 'A human, intentional threat',
        },
        rationale: {
          nl: 'Er is geen sprake van opzet; het gaat om een ongeluk. Opzettelijk zou bijvoorbeeld diefstal of sabotage zijn.',
          en: 'There is no intent; this is an accident. Intentional would be theft or sabotage, for instance.',
        },
      },
      {
        text: {
          nl: 'Geen dreiging maar een kwetsbaarheid',
          en: 'Not a threat but a vulnerability',
        },
        rationale: {
          nl: 'De kwetsbaarheid zou zijn dat de stick niet versleuteld was; het verliezen zelf is de dreiging die zich manifesteert.',
          en: 'The vulnerability would be that the stick was unencrypted; losing it is the threat materializing.',
        },
      },
    ],
    explanation: {
      nl: 'Dreigingen worden ingedeeld in menselijke en niet-menselijke dreigingen. Menselijke dreigingen zijn opzettelijk (diefstal, sabotage, hacking, fraude) of niet-opzettelijk (vergissingen, verlies, onwetendheid). Niet-menselijke dreigingen zijn bijvoorbeeld brand, water, storm en technisch falen. Een groot deel van de incidenten komt voort uit menselijke fouten — vandaar het belang van bewustwording.',
      en: 'Threats are classified as human and non-human. Human threats are intentional (theft, sabotage, hacking, fraud) or unintentional (mistakes, loss, ignorance). Non-human threats include fire, water, storm and technical failure. A large share of incidents stems from human error — hence the importance of awareness.',
    },
    source: 'Exameneis 2.1.1',
  },
  {
    id: 'isfs-q016',
    objective: '2.1.1',
    type: 'standard',
    bloom: 2,
    difficulty: 2,
    stem: {
      nl: 'Wat blijft er over nadat een organisatie beheersmaatregelen heeft getroffen voor een geïdentificeerd risico?',
      en: 'What remains after an organization has implemented controls for an identified risk?',
    },
    options: [
      { text: { nl: 'Restrisico', en: 'Residual risk' }, correct: true },
      {
        text: { nl: 'Nul risico', en: 'Zero risk' },
        rationale: {
          nl: 'Volledige uitsluiting van risico bestaat niet en zou bovendien onbetaalbaar zijn.',
          en: 'Complete elimination of risk does not exist and would moreover be unaffordable.',
        },
      },
      {
        text: { nl: 'Indirecte schade', en: 'Indirect damage' },
        rationale: {
          nl: 'Indirecte schade is een gevolg van een incident, geen resterend risiconiveau.',
          en: 'Indirect damage is a consequence of an incident, not a remaining risk level.',
        },
      },
      {
        text: { nl: 'Een kwetsbaarheid', en: 'A vulnerability' },
        rationale: {
          nl: 'Een kwetsbaarheid is een zwakte die benut kan worden, geen aanduiding voor het overblijvende risiconiveau.',
          en: 'A vulnerability is a weakness that can be exploited, not a term for the remaining risk level.',
        },
      },
    ],
    explanation: {
      nl: 'Risicomanagement is de cyclus van identificeren, analyseren, beoordelen, behandelen en monitoren van risico’s. Na risicobehandeling blijft er altijd een restrisico over. De directie moet dat restrisico expliciet accepteren — dat is een bewuste bestuurlijke keuze, geen technische.',
      en: 'Risk management is the cycle of identifying, analysing, evaluating, treating and monitoring risks. After risk treatment a residual risk always remains. Senior management must explicitly accept that residual risk — a conscious governance decision, not a technical one.',
    },
    source: 'Exameneis 2.1.1, 2.1.3',
  },
  {
    id: 'isfs-q017',
    objective: '2.1.4',
    type: 'standard',
    bloom: 1,
    difficulty: 2,
    stem: {
      nl: 'Wanneer kiest een organisatie voor een kwalitatieve in plaats van een kwantitatieve risicoanalyse?',
      en: 'When does an organization choose a qualitative rather than a quantitative risk analysis?',
    },
    options: [
      {
        text: {
          nl: 'Wanneer betrouwbare cijfers over kans en schade ontbreken en men met klassen als hoog, midden en laag werkt',
          en: 'When reliable figures on likelihood and damage are lacking and classes such as high, medium and low are used',
        },
        correct: true,
      },
      {
        text: {
          nl: 'Wanneer de organisatie beschikt over gedetailleerde historische schadecijfers',
          en: 'When the organization has detailed historical loss figures',
        },
        rationale: {
          nl: 'Juist dan is een kwantitatieve analyse mogelijk, met SLE, ARO en ALE.',
          en: 'That is precisely when a quantitative analysis is possible, using SLE, ARO and ALE.',
        },
      },
      {
        text: {
          nl: 'Wanneer de wet een financiële onderbouwing verplicht stelt',
          en: 'When the law requires a financial substantiation',
        },
        rationale: {
          nl: 'Een financiële onderbouwing vraagt juist om kwantitatieve analyse.',
          en: 'A financial substantiation calls for quantitative analysis.',
        },
      },
      {
        text: {
          nl: 'Wanneer het risico als aanvaardbaar wordt beschouwd',
          en: 'When the risk is considered acceptable',
        },
        rationale: {
          nl: 'De aanvaardbaarheid is de uitkomst van de analyse, niet het criterium voor de methodekeuze.',
          en: 'Acceptability is the outcome of the analysis, not the criterion for choosing a method.',
        },
      },
    ],
    explanation: {
      nl: 'Kwantitatieve risicoanalyse drukt risico uit in geld (ALE = SLE × ARO) en vraagt om betrouwbare cijfers. Kwalitatieve analyse werkt met inschattingen en klassen en is bruikbaar wanneer die cijfers ontbreken — wat in de praktijk vaak zo is. In de praktijk worden beide methoden vaak gecombineerd.',
      en: 'Quantitative risk analysis expresses risk in money (ALE = SLE × ARO) and requires reliable figures. Qualitative analysis works with estimates and classes and is usable when those figures are lacking — which is often the case in practice. In practice both methods are frequently combined.',
    },
    source: 'Exameneis 2.1.4',
  },
  {
    id: 'isfs-q018',
    objective: '2.1.1',
    type: 'standard',
    bloom: 2,
    difficulty: 3,
    stem: {
      nl: 'Welke fasen doorloopt de incidentcyclus in de juiste volgorde?',
      en: 'Which phases does the incident cycle go through, in the correct order?',
    },
    options: [
      {
        text: {
          nl: 'Dreiging → incident → schade → herstel',
          en: 'Threat → incident → damage → recovery',
        },
        correct: true,
      },
      {
        text: {
          nl: 'Incident → dreiging → herstel → schade',
          en: 'Incident → threat → recovery → damage',
        },
        rationale: {
          nl: 'Een dreiging gaat altijd vooraf aan het incident; herstel volgt op de schade.',
          en: 'A threat always precedes the incident; recovery follows the damage.',
        },
      },
      {
        text: {
          nl: 'Kwetsbaarheid → risico → maatregel → acceptatie',
          en: 'Vulnerability → risk → control → acceptance',
        },
        rationale: {
          nl: 'Dit beschrijft de risicomanagementcyclus, niet de incidentcyclus.',
          en: 'This describes the risk management cycle, not the incident cycle.',
        },
      },
      {
        text: {
          nl: 'Plan → do → check → act',
          en: 'Plan → do → check → act',
        },
        rationale: {
          nl: 'Dit is de PDCA-cyclus waarop het ISMS is gebaseerd.',
          en: 'This is the PDCA cycle on which the ISMS is based.',
        },
      },
    ],
    explanation: {
      nl: 'De incidentcyclus koppelt de soorten maatregelen aan een fase: preventief werkt vóór de dreiging zich manifesteert, detectief signaleert het incident, repressief beperkt de gevolgen tijdens het incident, en correctief herstelt de situatie erna. Het denken in deze cyclus helpt bij het kiezen van een evenwichtig maatregelenpakket.',
      en: 'The incident cycle links types of control to a phase: preventive acts before the threat materializes, detective signals the incident, repressive limits the consequences during the incident, and corrective restores the situation afterwards. Thinking in this cycle helps in selecting a balanced set of controls.',
    },
    source: 'Exameneis 2.1.1, 3.1.1',
  },
];
