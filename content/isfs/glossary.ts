import type { GlossarySeed } from '../types';

/**
 * EXIN ISFS — tweetalig glossarium.
 *
 * De EXIN preparation guide bevat een begrippenlijst met de Engelse en
 * Nederlandse term naast elkaar. Die vertaalparen zijn hier overgenomen en
 * aangevuld met een definitie, omdat EXIN expliciet stelt dat het kennen van
 * de term alleen onvoldoende is: kandidaten moeten de begrippen begrijpen en
 * er voorbeelden bij kunnen geven.
 *
 * HERKOMST — anders dan bij ITIL.
 *
 * Van EXIN komen alleen de termparen (welke Nederlandse term hoort bij welke
 * Engelse); de begrippenlijst zelf is een opsomming van vakterminologie en
 * daarmee eerder een feit dan een creatieve keuze. De definities en
 * toelichtingen erbij zijn wél door de auteur geschreven — één uitzondering
 * daargelaten, de omschrijving van informatiebeveiliging, die zo standaard is
 * dat er weinig aan te variëren valt.
 *
 * Vergelijk itil5/glossary.ts: dáár waren de definities aanvankelijk wél
 * overgenomen, en zijn ze in 1.1.0 herschreven. Zie GEBRUIKSVOORWAARDEN.md,
 * sectie 'Over de inhoud'.
 */

export const glossary: GlossarySeed[] = [
  /* --- Informatie en betrouwbaarheid ---------------------------------- */
  {
    termEn: 'Data',
    termNl: 'Data',
    objective: '1.1.1',
    definition: {
      nl: 'Ruwe, op zichzelf staande feiten en cijfers zonder intrinsieke betekenis.',
      en: 'Raw, standalone facts and figures without intrinsic meaning.',
    },
  },
  {
    termEn: 'Information',
    termNl: 'Informatie',
    objective: '1.1.1',
    definition: {
      nl: 'Data die is geïnterpreteerd en in een context is geplaatst, waardoor die betekenis en waarde heeft gekregen.',
      en: 'Data that has been interpreted and placed in context, thereby acquiring meaning and value.',
    },
  },
  {
    termEn: 'Confidentiality',
    termNl: 'Vertrouwelijkheid',
    objective: '1.2.1',
    definition: {
      nl: 'De eigenschap dat informatie alleen toegankelijk is voor wie daartoe bevoegd is.',
      en: 'The property that information is accessible only to those authorized to have access.',
    },
    note: {
      nl: 'De V van de BIV-driehoek; in het Engels de C van CIA.',
      en: 'The C of the CIA triad.',
    },
  },
  {
    termEn: 'Integrity',
    termNl: 'Integriteit',
    objective: '1.2.1',
    definition: {
      nl: 'De eigenschap dat informatie juist, volledig en tijdig is en niet ongeautoriseerd is gewijzigd.',
      en: 'The property that information is accurate, complete and timely and has not been modified without authorization.',
    },
  },
  {
    termEn: 'Availability',
    termNl: 'Beschikbaarheid',
    objective: '1.2.1',
    definition: {
      nl: 'De eigenschap dat informatie toegankelijk en bruikbaar is op het moment dat een bevoegde gebruiker die nodig heeft.',
      en: 'The property that information is accessible and usable when an authorized user requires it.',
    },
  },
  {
    termEn: 'Accountability',
    termNl: 'Eindverantwoordelijkheid',
    objective: '1.2.2',
    definition: {
      nl: 'De eigenschap dat handelingen herleidbaar zijn tot een individu of entiteit die daarop aanspreekbaar is.',
      en: 'The property that actions can be traced to an individual or entity that can be held answerable for them.',
    },
  },
  {
    termEn: 'Auditability',
    termNl: 'Controleerbaarheid',
    objective: '1.2.2',
    definition: {
      nl: 'De eigenschap dat achteraf kan worden vastgesteld of processen, transacties en maatregelen correct zijn verlopen.',
      en: 'The property that it can be established afterwards whether processes, transactions and controls operated correctly.',
    },
  },
  {
    termEn: 'Information security',
    termNl: 'Informatiebeveiliging',
    objective: '1.1.2',
    definition: {
      nl: 'Het waarborgen dat informatie vertrouwelijk blijft, klopt, en beschikbaar is op het moment dat je haar nodig hebt.',
      en: 'Safeguarding that information stays confidential, remains correct, and is there at the moment you need it.',
    },
  },
  {
    termEn: 'Information security management system (ISMS)',
    termNl: 'Managementsysteem voor informatiebeveiliging',
    objective: '1.1.2',
    definition: {
      nl: 'Het geheel van beleid, processen, procedures en middelen waarmee een organisatie informatiebeveiliging systematisch inricht, uitvoert, bewaakt en verbetert.',
      en: 'The set of policies, processes, procedures and resources with which an organization systematically establishes, operates, monitors and improves information security.',
    },
    note: {
      nl: 'ISO/IEC 27001 stelt de eisen; het ISMS werkt volgens de PDCA-cyclus.',
      en: 'ISO/IEC 27001 sets the requirements; the ISMS runs on the PDCA cycle.',
    },
  },
  {
    termEn: 'Plan, Do, Check, Act (PDCA)',
    termNl: 'Plan, Do, Check, Act (PDCA)',
    objective: '1.1.2',
    definition: {
      nl: 'De verbetercyclus waarop het ISMS is gebaseerd: plannen, uitvoeren, controleren en bijsturen.',
      en: 'The improvement cycle on which the ISMS is based: plan, do, check and act.',
    },
  },
  {
    termEn: 'Information security policy',
    termNl: 'Informatiebeveiligingsbeleid',
    objective: '1.3.1',
    definition: {
      nl: 'Het door de directie vastgestelde document met de doelstellingen, uitgangspunten, scope en verantwoordelijkheden voor informatiebeveiliging.',
      en: 'The management-approved document setting out the objectives, principles, scope and responsibilities for information security.',
    },
  },
  {
    termEn: 'Chief information security officer (CISO)',
    termNl: 'Chief information security officer (CISO)',
    objective: '1.3.3',
    definition: {
      nl: 'De rol die op strategisch niveau richting geeft aan informatiebeveiliging en de directie adviseert.',
      en: 'The role that provides strategic direction for information security and advises senior management.',
    },
    note: {
      nl: 'Adviseert en coördineert; de eindverantwoordelijkheid blijft bij de directie.',
      en: 'Advises and coordinates; ultimate responsibility remains with senior management.',
    },
  },

  /* --- Dreigingen en risico's ----------------------------------------- */
  {
    termEn: 'Threat',
    termNl: 'Dreiging',
    objective: '2.1.1',
    definition: {
      nl: 'Een mogelijke oorzaak van een ongewenst incident dat schade kan toebrengen aan informatie of systemen.',
      en: 'A potential cause of an unwanted incident that may harm information or systems.',
    },
    note: {
      nl: 'Onderverdeeld in menselijke (opzettelijk of niet-opzettelijk) en niet-menselijke dreigingen.',
      en: 'Divided into human (intentional or unintentional) and non-human threats.',
    },
  },
  {
    termEn: 'Vulnerability',
    termNl: 'Kwetsbaarheid',
    objective: '2.1.1',
    definition: {
      nl: 'Een zwakte in een middel of maatregel die door een dreiging kan worden benut.',
      en: 'A weakness in an asset or control that can be exploited by a threat.',
    },
  },
  {
    termEn: 'Risk',
    termNl: 'Risico',
    objective: '2.1.1',
    definition: {
      nl: 'De combinatie van de kans dat een dreiging een kwetsbaarheid benut en de impact die daaruit voortvloeit.',
      en: 'The combination of the likelihood that a threat exploits a vulnerability and the resulting impact.',
    },
  },
  {
    termEn: 'Threat agent',
    termNl: 'Aanvaller',
    objective: '2.1.1',
    definition: {
      nl: 'De partij die een dreiging tot uitvoering brengt, bijvoorbeeld een hacker, een insider of een crimineel collectief.',
      en: 'The party that carries out a threat, for example a hacker, an insider or a criminal group.',
    },
  },
  {
    termEn: 'Exposure',
    termNl: 'Blootstelling',
    objective: '2.1.1',
    definition: {
      nl: 'De mate waarin een middel is blootgesteld aan een dreiging doordat een kwetsbaarheid aanwezig is.',
      en: 'The extent to which an asset is exposed to a threat because a vulnerability is present.',
    },
  },
  {
    termEn: 'Direct damage',
    termNl: 'Directe schade',
    objective: '2.1.2',
    definition: {
      nl: 'Het onmiddellijke, aanwijsbare gevolg van een incident, zoals beschadigde apparatuur, verloren gegevens of herstelkosten.',
      en: 'The immediate, identifiable consequence of an incident, such as damaged equipment, lost data or recovery costs.',
    },
  },
  {
    termEn: 'Indirect damage',
    termNl: 'Indirecte schade',
    objective: '2.1.2',
    definition: {
      nl: 'Het vervolggevolg van een incident, zoals reputatieverlies, omzetdaling, boetes of claims.',
      en: 'The knock-on consequence of an incident, such as reputational loss, revenue decline, fines or claims.',
    },
    note: {
      nl: 'Vaak groter en moeilijker te herstellen dan de directe schade.',
      en: 'Often larger and harder to repair than the direct damage.',
    },
  },
  {
    termEn: 'Risk avoiding',
    termNl: 'Risicomijdend',
    objective: '2.1.3',
    definition: {
      nl: 'De risicostrategie waarbij maatregelen worden genomen die de dreiging wegnemen, bijvoorbeeld door de risicovolle activiteit te staken.',
      en: 'The risk strategy of taking measures that remove the threat, for example by abandoning the risky activity.',
    },
  },
  {
    termEn: 'Risk bearing (risk acceptance)',
    termNl: 'Risicodragend (risicoacceptatie)',
    objective: '2.1.3',
    definition: {
      nl: 'De risicostrategie waarbij het risico bewust wordt geaccepteerd zonder aanvullende maatregelen.',
      en: 'The risk strategy of consciously accepting the risk without additional controls.',
    },
  },
  {
    termEn: 'Risk neutral',
    termNl: 'Risiconeutraal',
    objective: '2.1.3',
    definition: {
      nl: 'De risicostrategie waarbij maatregelen de kans of de schade terugbrengen tot een aanvaardbaar niveau.',
      en: 'The risk strategy in which controls reduce the likelihood or damage to an acceptable level.',
    },
  },
  {
    termEn: 'Residual risk',
    termNl: 'Restrisico',
    objective: '2.1.3',
    definition: {
      nl: 'Het risico dat overblijft nadat beheersmaatregelen zijn getroffen.',
      en: 'The risk that remains after controls have been implemented.',
    },
    note: {
      nl: 'Moet expliciet door de directie worden geaccepteerd.',
      en: 'Must be explicitly accepted by senior management.',
    },
  },
  {
    termEn: 'Single loss expectancy (SLE)',
    termNl: 'Single loss expectancy (SLE)',
    objective: '2.1.4',
    definition: {
      nl: 'De verwachte schade per keer dat een incident optreedt.',
      en: 'The expected loss each time an incident occurs.',
    },
  },
  {
    termEn: 'Annualized rate of occurrence (ARO)',
    termNl: 'Annualized rate of occurrence (ARO)',
    objective: '2.1.4',
    definition: {
      nl: 'De verwachte frequentie waarmee een incident per jaar optreedt.',
      en: 'The expected frequency with which an incident occurs per year.',
    },
  },
  {
    termEn: 'Annualized loss expectancy (ALE)',
    termNl: 'Annualized loss expectancy (ALE)',
    objective: '2.1.4',
    definition: {
      nl: 'De verwachte jaarlijkse schade, berekend als SLE × ARO.',
      en: 'The expected annual loss, calculated as SLE × ARO.',
    },
  },
  {
    termEn: 'Qualitative risk analysis',
    termNl: 'Kwalitatieve risicoanalyse',
    objective: '2.1.4',
    definition: {
      nl: 'Risicoanalyse op basis van inschattingen en klassen zoals hoog, midden en laag, toegepast wanneer betrouwbare cijfers ontbreken.',
      en: 'Risk analysis based on estimates and classes such as high, medium and low, used when reliable figures are unavailable.',
    },
  },
  {
    termEn: 'Quantitative risk analysis',
    termNl: 'Kwantitatieve risicoanalyse',
    objective: '2.1.4',
    definition: {
      nl: 'Risicoanalyse waarbij risico in geld wordt uitgedrukt, met behulp van SLE, ARO en ALE.',
      en: 'Risk analysis expressing risk in monetary terms, using SLE, ARO and ALE.',
    },
  },

  /* --- Soorten beheersmaatregelen ------------------------------------- */
  {
    termEn: 'Preventive control',
    termNl: 'Preventieve beheersmaatregel',
    objective: '3.1.1',
    definition: {
      nl: 'Een maatregel die voorkomt dat een incident optreedt, zoals een slot, toegangscontrole of een firewall.',
      en: 'A control that prevents an incident from occurring, such as a lock, access control or a firewall.',
    },
  },
  {
    termEn: 'Detective control',
    termNl: 'Detectieve beheersmaatregel',
    objective: '3.1.1',
    definition: {
      nl: 'Een maatregel die signaleert dat een incident plaatsvindt of heeft plaatsgevonden, zoals een alarm, logging of een virusscanner.',
      en: 'A control that signals an incident is occurring or has occurred, such as an alarm, logging or antivirus software.',
    },
  },
  {
    termEn: 'Repressive control',
    termNl: 'Repressieve beheersmaatregel',
    objective: '3.1.1',
    definition: {
      nl: 'Een maatregel die de gevolgen beperkt terwijl het incident zich voltrekt, zoals een blusinstallatie of het isoleren van een netwerksegment.',
      en: 'A control that limits consequences while the incident unfolds, such as a suppression system or isolating a network segment.',
    },
  },
  {
    termEn: 'Corrective control',
    termNl: 'Correctieve beheersmaatregel',
    objective: '3.1.1',
    definition: {
      nl: 'Een maatregel die de situatie herstelt nadat het incident heeft plaatsgevonden, zoals het terugzetten van een back-up.',
      en: 'A control that restores the situation after the incident, such as restoring a backup.',
    },
  },
  {
    termEn: 'Reductive control',
    termNl: 'Reductieve beheersmaatregel',
    objective: '3.1.1',
    definition: {
      nl: 'Een maatregel die vooraf de kans of de omvang van de schade verkleint.',
      en: 'A control that reduces the likelihood or extent of damage in advance.',
    },
  },
  {
    termEn: 'Insurance',
    termNl: 'Verzekering',
    objective: '3.1.1',
    definition: {
      nl: 'Een maatregel waarbij de financiële gevolgen van een incident worden overgedragen aan een derde partij.',
      en: 'A control transferring the financial consequences of an incident to a third party.',
    },
  },

  /* --- Organisatorisch en menselijk ----------------------------------- */
  {
    termEn: 'Classification',
    termNl: 'Classificatie',
    objective: '3.2.1',
    definition: {
      nl: 'Het indelen van informatie naar gevoeligheid en belang, waarmee wordt bepaald welke maatregelen van toepassing zijn.',
      en: 'Categorizing information by sensitivity and importance, thereby determining which controls apply.',
    },
    note: {
      nl: 'Wordt vastgesteld door de eigenaar van het informatiemiddel.',
      en: 'Determined by the owner of the information asset.',
    },
  },
  {
    termEn: 'Access control',
    termNl: 'Toegangsbeheer',
    objective: '3.2.2',
    definition: {
      nl: 'Het geheel van maatregelen waarmee wordt bepaald wie onder welke voorwaarden toegang krijgt tot informatie en systemen.',
      en: 'The set of controls determining who gains access to information and systems, and under what conditions.',
    },
  },
  {
    termEn: 'Segregation of duties',
    termNl: 'Functiescheiding',
    objective: '3.2.2',
    definition: {
      nl: 'Het verdelen van taken en bevoegdheden zodat één persoon een proces niet volledig alleen kan uitvoeren.',
      en: 'Dividing tasks and authorities so no single person can execute an entire process alone.',
    },
  },
  {
    termEn: 'Authentication',
    termNl: 'Authenticatie',
    objective: '3.5.4',
    definition: {
      nl: 'Het vaststellen dat iemand of iets daadwerkelijk is wie of wat wordt beweerd.',
      en: 'Establishing that someone or something genuinely is who or what is claimed.',
    },
  },
  {
    termEn: 'Authorization',
    termNl: 'Autorisatie',
    objective: '3.5.4',
    definition: {
      nl: 'Het toekennen van rechten waarmee wordt bepaald wat een geauthenticeerde gebruiker mag doen.',
      en: 'Granting rights that determine what an authenticated user is permitted to do.',
    },
    note: {
      nl: 'Volgorde: identificatie → authenticatie → autorisatie.',
      en: 'Order: identification → authentication → authorization.',
    },
  },
  {
    termEn: 'Business continuity management (BCM)',
    termNl: 'Bedrijfscontinuïteitsbeheer',
    objective: '3.2.4',
    definition: {
      nl: 'Het proces dat waarborgt dat kritieke bedrijfsprocessen bij een ernstige verstoring kunnen doorgaan of snel worden hervat.',
      en: 'The process ensuring critical business processes can continue or be quickly resumed after a serious disruption.',
    },
  },
  {
    termEn: 'Stand-by arrangement (hot site)',
    termNl: 'Hot site op afroep',
    objective: '3.2.4',
    definition: {
      nl: 'Een volledig ingerichte uitwijklocatie die op zeer korte termijn de bedrijfsvoering kan overnemen.',
      en: 'A fully equipped fallback location able to take over operations at very short notice.',
    },
  },
  {
    termEn: 'Incident cycle',
    termNl: 'Incidentcyclus',
    objective: '2.1.1',
    definition: {
      nl: 'De opeenvolging dreiging → incident → schade → herstel, waaraan de soorten beheersmaatregelen worden gekoppeld.',
      en: 'The sequence threat → incident → damage → recovery, to which the types of control are linked.',
    },
  },
  {
    termEn: 'Non-disclosure agreement (NDA)',
    termNl: 'Geheimhoudingsverklaring',
    objective: '3.3.1',
    definition: {
      nl: 'Een overeenkomst waarin wordt vastgelegd dat vertrouwelijke informatie niet zonder toestemming mag worden gedeeld, ook na afloop van het contract.',
      en: 'An agreement recording that confidential information may not be shared without permission, including after the contract ends.',
    },
  },
  {
    termEn: 'Code of conduct',
    termNl: 'Gedragscode',
    objective: '3.3.1',
    definition: {
      nl: 'De vastgelegde regels voor aanvaardbaar gedrag en gebruik van bedrijfsmiddelen door medewerkers.',
      en: 'The documented rules for acceptable behaviour and use of company assets by employees.',
    },
  },
  {
    termEn: 'Due care',
    termNl: 'Due care',
    objective: '1.3.2',
    definition: {
      nl: 'De zorgvuldigheid die van een organisatie mag worden verwacht bij het treffen en onderhouden van beveiligingsmaatregelen.',
      en: 'The care that may be expected of an organization in implementing and maintaining security controls.',
    },
  },
  {
    termEn: 'Due diligence',
    termNl: 'Due diligence',
    objective: '1.3.2',
    definition: {
      nl: 'Het vooraf zorgvuldig onderzoeken van risico’s, bijvoorbeeld bij het selecteren van een leverancier.',
      en: 'Carefully investigating risks in advance, for example when selecting a supplier.',
    },
  },

  /* --- Fysiek en technisch -------------------------------------------- */
  {
    termEn: 'Protection ring',
    termNl: 'Beschermingsring',
    objective: '3.4.3',
    definition: {
      nl: 'Een schil van fysieke beveiliging; opeenvolgende ringen van buiten naar binnen kennen steeds strengere toegangseisen.',
      en: 'A layer of physical security; successive rings from outside inwards impose progressively stricter access requirements.',
    },
  },
  {
    termEn: 'Cryptography',
    termNl: 'Cryptografie',
    objective: '3.5.4',
    definition: {
      nl: 'Het versleutelen van informatie zodat die alleen leesbaar is voor wie over de juiste sleutel beschikt.',
      en: 'Encrypting information so it is readable only by those holding the correct key.',
    },
  },
  {
    termEn: 'Public key infrastructure (PKI)',
    termNl: 'Public Key Infrastructure (PKI)',
    objective: '3.5.4',
    definition: {
      nl: 'Het geheel van certificaten, certificaatautoriteiten en procedures waarmee publieke sleutels betrouwbaar aan eigenaren worden gekoppeld.',
      en: 'The set of certificates, certificate authorities and procedures that reliably bind public keys to their owners.',
    },
  },
  {
    termEn: 'Digital signature',
    termNl: 'Digitale handtekening',
    objective: '3.5.4',
    definition: {
      nl: 'Een cryptografische techniek die de herkomst en onveranderdheid van een bericht aantoont en onweerlegbaarheid biedt.',
      en: 'A cryptographic technique that demonstrates the origin and integrity of a message and provides non-repudiation.',
    },
  },
  {
    termEn: 'Virtual private network (VPN)',
    termNl: 'Virtual private network (VPN)',
    objective: '3.5.3',
    definition: {
      nl: 'Een versleutelde verbinding over een onvertrouwd netwerk, waardoor gegevens onderweg beschermd zijn.',
      en: 'An encrypted connection over an untrusted network, protecting data in transit.',
    },
  },
  {
    termEn: 'Phishing',
    termNl: 'Phishing',
    objective: '3.5.5',
    definition: {
      nl: 'Een aanval waarbij via misleidende berichten wordt geprobeerd gegevens te ontfutselen of een handeling uit te lokken.',
      en: 'An attack using deceptive messages to extract data or induce an action.',
    },
    note: {
      nl: 'Spear phishing is gericht; whaling of CEO-fraude richt zich op bestuurders.',
      en: 'Spear phishing is targeted; whaling or CEO fraud targets executives.',
    },
  },
  {
    termEn: 'Biometrics',
    termNl: 'Biometrie',
    objective: '3.5.4',
    definition: {
      nl: 'Authenticatie op basis van unieke lichaamskenmerken, zoals een vingerafdruk, gezicht of iris.',
      en: 'Authentication based on unique physical characteristics, such as a fingerprint, face or iris.',
    },
    note: {
      nl: 'De categorie “iets wat je bent”. Biometrische gegevens zijn bijzondere persoonsgegevens onder de AVG.',
      en: 'The “something you are” category. Biometric data are special category personal data under the GDPR.',
    },
  },
  {
    termEn: 'Backup',
    termNl: 'Back-up',
    objective: '3.5.1',
    definition: {
      nl: 'Een kopie van gegevens waarmee de oorspronkelijke gegevens na verlies of beschadiging kunnen worden hersteld.',
      en: 'A copy of data enabling the original data to be restored after loss or corruption.',
    },
    note: {
      nl: 'Een back-up die nooit is teruggezet, is een aanname en geen maatregel.',
      en: 'A backup that has never been restored is an assumption, not a control.',
    },
  },

  /* --- Wet- en regelgeving en normen ---------------------------------- */
  {
    termEn: 'Personally identifiable information (PII)',
    termNl: 'Persoonlijk identificeerbare informatie',
    objective: '4.1.1',
    definition: {
      nl: 'Alle informatie over een geïdentificeerde of identificeerbare natuurlijke persoon.',
      en: 'Any information relating to an identified or identifiable natural person.',
    },
  },
  {
    termEn: 'Compliance',
    termNl: 'Naleving',
    objective: '4.1.1',
    definition: {
      nl: 'Het voldoen aan wet- en regelgeving, contractuele afspraken en intern beleid.',
      en: 'Meeting legal and regulatory requirements, contractual obligations and internal policy.',
    },
  },
  {
    termEn: 'Privacy',
    termNl: 'Privacy',
    objective: '4.1.1',
    definition: {
      nl: 'Het recht van een persoon op bescherming van zijn persoonlijke levenssfeer en persoonsgegevens.',
      en: 'A person’s right to protection of their private life and personal data.',
    },
    note: {
      nl: 'Privacy en informatiebeveiliging overlappen maar zijn niet hetzelfde: beveiliging is een middel, privacy een recht.',
      en: 'Privacy and information security overlap but are not identical: security is a means, privacy a right.',
    },
  },
  {
    termEn: 'Cyber crime',
    termNl: 'Cybercrime',
    objective: '4.1.1',
    definition: {
      nl: 'Strafbare handelingen waarbij informatietechnologie het doelwit of het middel is.',
      en: 'Criminal acts in which information technology is the target or the means.',
    },
  },
];
