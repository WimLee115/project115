/**
 * Tweetaligheid (NL/EN).
 *
 * Bewust geen vertaalbibliotheek: de app heeft één vaste set teksten en twee
 * talen. Een platte, volledig getypeerde woordenlijst geeft compilerfouten bij
 * een ontbrekende vertaling — precies wat je wilt.
 */

export type Locale = 'nl' | 'en';

export const LOCALES: Locale[] = ['nl', 'en'];

export function isLocale(value: unknown): value is Locale {
  return value === 'nl' || value === 'en';
}

/** Kiest de juiste taalvariant uit een tweetalig veld. */
export function pick(
  locale: Locale,
  nl: string | null | undefined,
  en: string | null | undefined,
): string {
  const value = locale === 'nl' ? nl : en;
  // Terugvallen op de andere taal is beter dan een lege vraag tonen.
  return value ?? (locale === 'nl' ? en : nl) ?? '';
}

const nl = {
  'app.name': 'Project115',
  'app.tagline': 'Studiehub voor ITIL en ISO 27001',
  'app.author': 'Ontwikkeld door B. van Rooij',

  'nav.dashboard': 'Dashboard',
  'nav.exam': 'Proefexamen',
  'nav.practice': 'Oefenen',
  'nav.review': 'Herhalen',
  'nav.glossary': 'Begrippen',
  'nav.stats': 'Voortgang',
  'nav.settings': 'Instellingen',
  'nav.logout': 'Uitloggen',

  'lock.title': 'Vergrendeld',
  'lock.prompt': 'Voer je pincode in.',
  'lock.wrong': 'Die pincode klopt niet.',
  'lock.tooMany': 'Te veel pogingen. Wacht even en probeer het opnieuw.',
  'lock.unlock': 'Ontgrendelen',
  'lock.setTitle': 'Pincode instellen',
  'lock.setIntro':
    'Kies een pincode van vier tot acht cijfers. Hij beschermt je studiegegevens als iemand anders je telefoon in handen krijgt.',
  'lock.newPin': 'Nieuwe pincode',
  'lock.repeatPin': 'Herhaal pincode',
  'lock.mismatch': 'De twee pincodes zijn niet gelijk.',
  'lock.tooShort': 'Een pincode is minimaal vier cijfers.',
  'lock.currentPin': 'Huidige pincode',
  'lock.remove': 'Pincode verwijderen',
  'lock.forgot':
    'Pincode kwijt? Verwijder de app-gegevens via Instellingen › Apps › Project115. Je studiegegevens gaan dan verloren, tenzij je een export hebt.',

  'exam.start': 'Start proefexamen',
  'exam.startShort': 'Starten',
  'exam.question': 'Vraag',
  'exam.of': 'van',
  'exam.next': 'Volgende',
  'exam.previous': 'Vorige',
  'exam.flag': 'Markeer voor later',
  'exam.flagged': 'Gemarkeerd',
  'exam.submit': 'Inleveren',
  'exam.submitConfirm':
    'Weet je zeker dat je wilt inleveren? Je kunt daarna niets meer wijzigen.',
  'exam.timeLeft': 'Resterende tijd',
  'exam.unanswered': 'onbeantwoord',
  'exam.answered': 'beantwoord',
  'exam.overview': 'Overzicht',
  'exam.timeUp': 'De tijd is om. Het examen is automatisch ingeleverd.',
  'exam.conditions': 'Examencondities',
  'exam.extraTime': 'Extra tijd (25%) voor niet-moedertaalsprekers',
  'exam.noFeedback': 'Geen feedback tijdens het examen, net als bij het echte examen.',
  'exam.inProgress': 'Examen bezig',
  'exam.resume': 'Hervatten',

  'result.title': 'Examenrapport',
  'result.passed': 'Geslaagd',
  'result.failed': 'Niet geslaagd',
  'result.score': 'Score',
  'result.passMark': 'Cesuur',
  'result.timeUsed': 'Gebruikte tijd',
  'result.byDomain': 'Score per examengebied',
  'result.review': 'Antwoorden nakijken',
  'result.correct': 'Goed',
  'result.incorrect': 'Fout',
  'result.yourAnswer': 'Jouw antwoord',
  'result.correctAnswer': 'Juiste antwoord',
  'result.explanation': 'Toelichting',
  'result.notAnswered': 'Niet beantwoord',
  'result.autoSubmitted': 'Automatisch ingeleverd toen de tijd om was.',
  // Kort, want dit staat in een kolom van een derde schermbreedte; de volledige
  // uitleg staat op het instelscherm van het examen.
  'result.extraTime': 'Extra tijd',

  'practice.title': 'Oefenen',
  'practice.subtitle': 'Directe feedback en toelichting bij elke vraag.',
  'practice.checkAnswer': 'Controleer antwoord',
  'practice.continue': 'Volgende vraag',
  'practice.finish': 'Sessie afronden',
  'practice.weakSpots': 'Zwakke plekken oefenen',
  'practice.weakSpotsDesc':
    'Vragen uit de leerdoelen waar je onder de cesuur scoort.',

  'review.title': 'Herhalen',
  'review.due': 'Nu aan de beurt',
  'review.noneDue': 'Niets te herhalen. Kom later terug of start een oefensessie.',
  'review.again': 'Opnieuw',
  'review.hard': 'Moeilijk',
  'review.good': 'Goed',
  'review.easy': 'Makkelijk',
  'review.showAnswer': 'Toon antwoord',
  'review.nextIn': 'Volgende keer over',
  'review.dayShort': 'd',
  'review.minuteShort': 'min',

  'glossary.title': 'Begrippen',
  'glossary.search': 'Zoek een begrip...',
  'glossary.noResults': 'Geen begrippen gevonden.',
  'glossary.flashcards': 'Flashcards',
  'glossary.terms': 'begrippen',

  'stats.title': 'Voortgang',
  'stats.readiness': 'Examengereedheid',
  'stats.attempts': 'Pogingen',
  'stats.avgScore': 'Gemiddelde score',
  'stats.bestScore': 'Beste score',
  'stats.lastAttempt': 'Laatste poging',
  'stats.trend': 'Scoreverloop',
  'stats.byObjective': 'Per leerdoel',
  'stats.weakest': 'Zwakste leerdoelen',
  'stats.strongest': 'Sterkste leerdoelen',
  'stats.noData': 'Nog geen gegevens. Start een proefexamen of oefensessie.',
  'stats.mastery': 'Beheersing',
  'stats.questionsSeen': 'vragen gezien',
  'stats.practiceThis': 'Oefen dit',

  'dashboard.welcome': 'Welkom terug',
  'dashboard.daysUntilExam': 'dagen tot je examen',
  'dashboard.setExamDate': 'Examendatum instellen',
  'dashboard.dueToday': 'Vandaag te herhalen',
  'dashboard.cards': 'kaarten',
  'dashboard.startStudying': 'Beginnen met studeren',
  'dashboard.recentAttempts': 'Recente pogingen',
  'dashboard.noAttempts': 'Nog geen pogingen.',

  'settings.title': 'Instellingen',
  'settings.language': 'Taal',
  'settings.languageDesc':
    'Taal van de interface. Vragen kun je tijdens het studeren per stuk omschakelen.',
  'settings.examDate': 'Examendatum',
  'settings.dailyTarget': 'Dagelijks herhaaldoel',
  'settings.extraTime': 'Standaard extra tijd bij proefexamens',
  'settings.security': 'Beveiliging',
  'settings.pin': 'Pincode',
  'settings.pinOn': 'Ingesteld',
  'settings.pinOff': 'Niet ingesteld',
  'settings.pinDesc':
    'Vraagt om een pincode bij het openen van de app. Beschermt je studiegegevens, niet meer dan dat.',
  'settings.lockOnBackground': 'Vergrendelen zodra de app naar de achtergrond gaat',
  'settings.theme': 'Weergave',
  'settings.themeSystem': 'Systeem volgen',
  'settings.themeLight': 'Licht',
  'settings.themeDark': 'Donker',
  'settings.name': 'Naam',
  'settings.enable': 'Inschakelen',
  'settings.disable': 'Uitschakelen',
  'settings.change': 'Wijzigen',
  'settings.save': 'Opslaan',
  'settings.saved': 'Opgeslagen.',
  'settings.data': 'Gegevens',
  'settings.exportData': 'Exporteren',
  'settings.exportDesc':
    'Schrijft al je studiegegevens naar een JSON-bestand dat je kunt delen of bewaren.',
  'settings.exported': 'Geëxporteerd naar',
  'settings.importData': 'Importeren',
  'settings.importDesc':
    'Leest een export van deze app of van de webversie. Wat er nu op dit toestel staat, wordt vervangen.',
  'settings.importConfirm':
    'Weet je het zeker? Je huidige voortgang op dit toestel wordt overschreven.',
  'settings.imported': 'Geïmporteerd:',
  'settings.importFailed': 'Het bestand kon niet gelezen worden.',
  'settings.reset': 'Studiegegevens wissen',
  'settings.resetDesc':
    'Verwijdert pogingen, antwoorden en het herhaalschema. De vragenbank blijft.',
  'settings.resetConfirm':
    'Dit verwijdert al je voortgang op dit toestel. Dit kan niet ongedaan worden gemaakt.',
  'settings.about': 'Over',
  'settings.version': 'Versie',
  'settings.contentStats': 'Vragenbank',

  'common.cancel': 'Annuleren',
  'common.confirm': 'Bevestigen',
  'common.close': 'Sluiten',
  'common.back': 'Terug',
  'common.loading': 'Laden...',
  'common.error': 'Er ging iets mis.',
  'common.minutes': 'minuten',
  'common.questions': 'vragen',
  'common.language.nl': 'Nederlands',
  'common.language.en': 'Engels',
  'common.showInEnglish': 'Toon in het Engels',
  'common.showInDutch': 'Toon in het Nederlands',
  'common.objective': 'Leerdoel',
  'common.source': 'Bron',
  'common.domain': 'Examengebied',
  'common.weight': 'Weging',
  'common.done': 'Klaar',
  'common.yes': 'Ja',
  'common.no': 'Nee',
  'common.remove': 'Verwijderen',
  'common.of': 'van',
  'common.offline': 'Deze app werkt volledig zonder internet.',

  'exam.setupTitle': 'Proefexamen instellen',
  'exam.abandon': 'Sessie afbreken',
  'exam.abandonConfirm':
    'De lopende sessie wordt verwijderd. Je antwoorden gaan verloren.',
  'exam.exitWarning':
    'Je zit midden in een examen. Weet je zeker dat je wilt stoppen?',

  'practice.sessionLength': 'Aantal vragen',
  'practice.startPractice': 'Oefensessie starten',

  'review.sessionDone': 'Je bent bij.',
  'review.reviewedToday': 'vandaag herhaald',
  'review.target': 'dagdoel',
  'review.addGlossary': 'Begrippen toevoegen aan herhaling',
  'review.added': 'toegevoegd aan je herhaalwachtrij.',
  'review.allAdded': 'Alle begrippen staan al in je herhaalwachtrij.',
  'review.suspend': 'Uit de roulatie halen',
  'review.rate': 'Hoe goed wist je dit?',
  'review.remaining': 'nog te gaan',

  'common.all': 'Alles',

  'exam.chooseCertification': 'Kies een certificering',
  'exam.noTimeLimit': 'Geen tijdslimiet',
  'exam.aboutToStart':
    'Zodra je start loopt de klok. Zorg dat je een uur ongestoord zit.',

  'practice.focus': 'Waar wil je op oefenen?',
  'practice.allObjectives': 'Alle leerdoelen',
  'practice.noWeakSpots':
    'Nog geen zwakke plekken bekend. Maak eerst een proefexamen of oefensessie.',

  'stats.coverage': 'Dekking van de vragenbank',
  'stats.objectivesUntouched': 'nog niet geoefend',

  'settings.studyPlan': 'Studieplan',
  'settings.notSet': 'Niet ingesteld',
  'settings.chooseFile': 'Bestand kiezen',
  'settings.dailyTargetDesc':
    'Richtgetal voor het aantal kaarten per dag. De app bepaalt zelf wat er aan de beurt is.',

  'dashboard.examToday': 'Vandaag is je examen',
  'dashboard.examTomorrow': 'Morgen is je examen',
  'dashboard.examPast': 'De ingestelde examendatum is verstreken.',

  'about.privacy': 'Privacy',
  'about.privacyBody':
    'Deze app verzamelt niets, verstuurt niets en heeft geen internetverbinding nodig. Je studiegegevens staan alleen op dit toestel en verlaten het pas wanneer je zelf exporteert.',
  'about.content': 'Herkomst van de vragen',
  'about.contentBody':
    'Alle vragen, antwoorden, toelichtingen en begrippen zijn origineel geschreven aan de hand van de openbaar gepubliceerde examenspecificaties. Er zijn geen officiële examenvragen overgenomen en er staat geen cursustekst in.',
  'about.contribute': 'Help mee verbeteren',
  'about.contributeBody':
    'Deze app is beter geworden van iedereen die iets terugmeldde. Kom je een vraag tegen die niet klopt, een toelichting die de stof verkeerd uitlegt, of een begrip dat achterloopt op de syllabus? Meld het op GitHub — het wordt aangepast en je krijgt vermelding bij de wijziging. Ook een kromme zin, een idee voor een betere vraag of een vertaalfout is welkom. Je hoeft geen programmeur te zijn: een issue openen kan met een GitHub-account en verder niets.',
  'about.contributeCta': 'Iets melden of voorstellen',
  'about.trademarks': 'Handelsmerken',
  'about.trademarksBody':
    'ITIL® en PRINCE2® zijn geregistreerde handelsmerken van PeopleCert International Ltd. EXIN® is een geregistreerd handelsmerk van EXIN Holding B.V. ISO/IEC 27001 is een norm van ISO en IEC. IT Management Group is de uitgever van het Nederlandstalige cursusmateriaal. Deze app is een onafhankelijk oefenhulpmiddel en is niet gelieerd aan, goedgekeurd door of verbonden met een van deze organisaties.',
  'about.disclaimer':
    'Slagen voor de proefexamens in deze app is geen garantie voor slagen voor het echte examen.',
  'about.source': 'Broncode en updates',
  'about.sourceBody':
    'De nieuwste versie en de broncode staan op GitHub. Daar staat ook wat er per versie is veranderd.',
} as const;

type Key = keyof typeof nl;

const en: Record<Key, string> = {
  'app.name': 'Project115',
  'app.tagline': 'Study hub for ITIL and ISO 27001',
  'app.author': 'Developed by B. van Rooij',

  'nav.dashboard': 'Dashboard',
  'nav.exam': 'Mock exam',
  'nav.practice': 'Practice',
  'nav.review': 'Review',
  'nav.glossary': 'Glossary',
  'nav.stats': 'Progress',
  'nav.settings': 'Settings',
  'nav.logout': 'Log out',

  'lock.title': 'Locked',
  'lock.prompt': 'Enter your PIN.',
  'lock.wrong': 'That PIN is incorrect.',
  'lock.tooMany': 'Too many attempts. Wait a moment and try again.',
  'lock.unlock': 'Unlock',
  'lock.setTitle': 'Set a PIN',
  'lock.setIntro':
    'Choose a PIN of four to eight digits. It protects your study data if someone else gets hold of your phone.',
  'lock.newPin': 'New PIN',
  'lock.repeatPin': 'Repeat PIN',
  'lock.mismatch': 'The two PINs do not match.',
  'lock.tooShort': 'A PIN needs at least four digits.',
  'lock.currentPin': 'Current PIN',
  'lock.remove': 'Remove PIN',
  'lock.forgot':
    'Forgot your PIN? Clear the app data via Settings › Apps › Project115. Your study data is lost unless you have an export.',

  'exam.start': 'Start mock exam',
  'exam.startShort': 'Start',
  'exam.question': 'Question',
  'exam.of': 'of',
  'exam.next': 'Next',
  'exam.previous': 'Previous',
  'exam.flag': 'Flag for later',
  'exam.flagged': 'Flagged',
  'exam.submit': 'Submit',
  'exam.submitConfirm':
    'Are you sure you want to submit? You will not be able to change anything afterwards.',
  'exam.timeLeft': 'Time remaining',
  'exam.unanswered': 'unanswered',
  'exam.answered': 'answered',
  'exam.overview': 'Overview',
  'exam.timeUp': 'Time is up. The exam has been submitted automatically.',
  'exam.conditions': 'Exam conditions',
  'exam.extraTime': 'Extra time (25%) for non-native speakers',
  'exam.noFeedback': 'No feedback during the exam, just like the real thing.',
  'exam.inProgress': 'Exam in progress',
  'exam.resume': 'Resume',

  'result.title': 'Exam report',
  'result.passed': 'Passed',
  'result.failed': 'Not passed',
  'result.score': 'Score',
  'result.passMark': 'Pass mark',
  'result.timeUsed': 'Time used',
  'result.byDomain': 'Score per exam area',
  'result.review': 'Review answers',
  'result.correct': 'Correct',
  'result.incorrect': 'Incorrect',
  'result.yourAnswer': 'Your answer',
  'result.correctAnswer': 'Correct answer',
  'result.explanation': 'Explanation',
  'result.notAnswered': 'Not answered',
  'result.autoSubmitted': 'Automatically submitted when time ran out.',
  'result.extraTime': 'Extra time',

  'practice.title': 'Practice',
  'practice.subtitle': 'Immediate feedback and explanation for every question.',
  'practice.checkAnswer': 'Check answer',
  'practice.continue': 'Next question',
  'practice.finish': 'Finish session',
  'practice.weakSpots': 'Practice weak spots',
  'practice.weakSpotsDesc':
    'Questions from the learning objectives where you score below the pass mark.',

  'review.title': 'Review',
  'review.due': 'Due now',
  'review.noneDue': 'Nothing to review. Come back later or start a practice session.',
  'review.again': 'Again',
  'review.hard': 'Hard',
  'review.good': 'Good',
  'review.easy': 'Easy',
  'review.showAnswer': 'Show answer',
  'review.nextIn': 'Next review in',
  'review.dayShort': 'd',
  'review.minuteShort': 'min',

  'glossary.title': 'Glossary',
  'glossary.search': 'Search for a term...',
  'glossary.noResults': 'No terms found.',
  'glossary.flashcards': 'Flashcards',
  'glossary.terms': 'terms',

  'stats.title': 'Progress',
  'stats.readiness': 'Exam readiness',
  'stats.attempts': 'Attempts',
  'stats.avgScore': 'Average score',
  'stats.bestScore': 'Best score',
  'stats.lastAttempt': 'Last attempt',
  'stats.trend': 'Score trend',
  'stats.byObjective': 'Per learning objective',
  'stats.weakest': 'Weakest objectives',
  'stats.strongest': 'Strongest objectives',
  'stats.noData': 'No data yet. Start a mock exam or practice session.',
  'stats.mastery': 'Mastery',
  'stats.questionsSeen': 'questions seen',
  'stats.practiceThis': 'Practise this',

  'dashboard.welcome': 'Welcome back',
  'dashboard.daysUntilExam': 'days until your exam',
  'dashboard.setExamDate': 'Set exam date',
  'dashboard.dueToday': 'Due for review today',
  'dashboard.cards': 'cards',
  'dashboard.startStudying': 'Start studying',
  'dashboard.recentAttempts': 'Recent attempts',
  'dashboard.noAttempts': 'No attempts yet.',

  'settings.title': 'Settings',
  'settings.language': 'Language',
  'settings.languageDesc':
    'Interface language. You can switch individual questions while studying.',
  'settings.examDate': 'Exam date',
  'settings.dailyTarget': 'Daily review target',
  'settings.extraTime': 'Apply extra time to mock exams by default',
  'settings.security': 'Security',
  'settings.pin': 'PIN',
  'settings.pinOn': 'Set',
  'settings.pinOff': 'Not set',
  'settings.pinDesc':
    'Asks for a PIN when opening the app. It protects your study data, nothing more.',
  'settings.lockOnBackground': 'Lock as soon as the app goes to the background',
  'settings.theme': 'Appearance',
  'settings.themeSystem': 'Follow system',
  'settings.themeLight': 'Light',
  'settings.themeDark': 'Dark',
  'settings.name': 'Name',
  'settings.enable': 'Enable',
  'settings.disable': 'Disable',
  'settings.change': 'Change',
  'settings.save': 'Save',
  'settings.saved': 'Saved.',
  'settings.data': 'Data',
  'settings.exportData': 'Export',
  'settings.exportDesc':
    'Writes all your study data to a JSON file you can share or keep.',
  'settings.exported': 'Exported to',
  'settings.importData': 'Import',
  'settings.importDesc':
    'Reads an export from this app or from the web version. Whatever is on this device now will be replaced.',
  'settings.importConfirm':
    'Are you sure? Your current progress on this device will be overwritten.',
  'settings.imported': 'Imported:',
  'settings.importFailed': 'The file could not be read.',
  'settings.reset': 'Erase study data',
  'settings.resetDesc':
    'Removes attempts, answers and the review schedule. The question bank stays.',
  'settings.resetConfirm':
    'This removes all your progress on this device. It cannot be undone.',
  'settings.about': 'About',
  'settings.version': 'Version',
  'settings.contentStats': 'Question bank',

  'common.cancel': 'Cancel',
  'common.confirm': 'Confirm',
  'common.close': 'Close',
  'common.back': 'Back',
  'common.loading': 'Loading...',
  'common.error': 'Something went wrong.',
  'common.minutes': 'minutes',
  'common.questions': 'questions',
  'common.language.nl': 'Dutch',
  'common.language.en': 'English',
  'common.showInEnglish': 'Show in English',
  'common.showInDutch': 'Show in Dutch',
  'common.objective': 'Objective',
  'common.source': 'Source',
  'common.domain': 'Exam area',
  'common.weight': 'Weight',
  'common.done': 'Done',
  'common.yes': 'Yes',
  'common.no': 'No',
  'common.remove': 'Remove',
  'common.of': 'of',
  'common.offline': 'This app works entirely without an internet connection.',

  'exam.setupTitle': 'Set up mock exam',
  'exam.abandon': 'Abandon session',
  'exam.abandonConfirm':
    'The running session will be deleted. Your answers will be lost.',
  'exam.exitWarning':
    'You are in the middle of an exam. Are you sure you want to stop?',

  'practice.sessionLength': 'Number of questions',
  'practice.startPractice': 'Start practice session',

  'review.sessionDone': 'You are up to date.',
  'review.reviewedToday': 'reviewed today',
  'review.target': 'daily target',
  'review.addGlossary': 'Add glossary to review',
  'review.added': 'added to your review queue.',
  'review.allAdded': 'All terms are already in your review queue.',
  'review.suspend': 'Take out of rotation',
  'review.rate': 'How well did you know this?',
  'review.remaining': 'to go',

  'common.all': 'All',

  'exam.chooseCertification': 'Choose a certification',
  'exam.noTimeLimit': 'No time limit',
  'exam.aboutToStart':
    'The clock starts as soon as you begin. Make sure you have an undisturbed hour.',

  'practice.focus': 'What do you want to practise?',
  'practice.allObjectives': 'All objectives',
  'practice.noWeakSpots':
    'No weak spots known yet. Take a mock exam or practice session first.',

  'stats.coverage': 'Question bank coverage',
  'stats.objectivesUntouched': 'not practised yet',

  'settings.studyPlan': 'Study plan',
  'settings.notSet': 'Not set',
  'settings.chooseFile': 'Choose a file',
  'settings.dailyTargetDesc':
    'A target for the number of cards per day. The app decides what is actually due.',

  'dashboard.examToday': 'Your exam is today',
  'dashboard.examTomorrow': 'Your exam is tomorrow',
  'dashboard.examPast': 'The exam date you set has passed.',

  'about.privacy': 'Privacy',
  'about.privacyBody':
    'This app collects nothing, sends nothing and needs no internet connection. Your study data stays on this device and only leaves it when you export it yourself.',
  'about.content': 'Where the questions come from',
  'about.contentBody':
    'All questions, answers, explanations and glossary entries were written from scratch against the publicly published exam specifications. No official exam questions have been reproduced and no course text is included.',
  'about.contribute': 'Help make it better',
  'about.contributeBody':
    'This app got better through everyone who reported something back. Come across a question that is wrong, an explanation that teaches the material incorrectly, or a term that has fallen behind the syllabus? Report it on GitHub — it gets fixed and you are credited with the change. An awkward sentence, an idea for a better question or a translation error is just as welcome. You need not be a programmer: opening an issue takes a GitHub account and nothing else.',
  'about.contributeCta': 'Report or suggest something',
  'about.trademarks': 'Trade marks',
  'about.trademarksBody':
    'ITIL® and PRINCE2® are registered trade marks of PeopleCert International Ltd. EXIN® is a registered trade mark of EXIN Holding B.V. ISO/IEC 27001 is a standard published by ISO and IEC. IT Management Group publishes the Dutch-language course material. This app is an independent practice tool and is not affiliated with, endorsed by or connected to any of these organisations.',
  'about.disclaimer':
    'Passing the mock exams in this app is no guarantee of passing the real exam.',
  'about.source': 'Source code and updates',
  'about.sourceBody':
    'The latest version and the source code are on GitHub, together with what changed per version.',
};

const dictionaries: Record<Locale, Record<Key, string>> = { nl, en };

export type Translator = (key: Key) => string;

export function getTranslator(locale: Locale): Translator {
  const dictionary = dictionaries[locale];
  return (key) => dictionary[key];
}

export type TranslationKey = Key;
