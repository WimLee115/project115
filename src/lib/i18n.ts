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

  'auth.login': 'Inloggen',
  'auth.email': 'E-mailadres',
  'auth.password': 'Wachtwoord',
  'auth.name': 'Naam',
  'auth.createAccount': 'Account aanmaken',
  'auth.setupTitle': 'Eerste installatie',
  'auth.setupIntro':
    'Maak je account aan. Dit is de enige keer dat je dit doet — de hub is voor één gebruiker.',
  'auth.invalidCredentials': 'E-mailadres of wachtwoord is onjuist.',
  'auth.rateLimited': 'Te veel pogingen. Probeer het later opnieuw.',
  'auth.totpCode': 'Verificatiecode',
  'auth.totpPrompt': 'Voer de zescijferige code uit je authenticator-app in.',
  'auth.totpInvalid': 'De code klopt niet of is verlopen.',
  'auth.verify': 'Verifiëren',

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
  'settings.profile': 'Profiel',
  'settings.name': 'Naam',
  'settings.language': 'Taal',
  'settings.languageDesc':
    'Taal van de interface. Vragen kun je tijdens het studeren per stuk omschakelen.',
  'settings.examDate': 'Examendatum',
  'settings.dailyTarget': 'Dagelijks herhaaldoel',
  'settings.extraTime': 'Standaard extra tijd bij proefexamens',
  'settings.security': 'Beveiliging',
  'settings.changePassword': 'Wachtwoord wijzigen',
  'settings.currentPassword': 'Huidig wachtwoord',
  'settings.newPassword': 'Nieuw wachtwoord',
  'settings.twoFactor': 'Tweestapsverificatie',
  'settings.twoFactorOn': 'Ingeschakeld',
  'settings.twoFactorOff': 'Uitgeschakeld',
  'settings.enable': 'Inschakelen',
  'settings.disable': 'Uitschakelen',
  'settings.save': 'Opslaan',
  'settings.saved': 'Opgeslagen.',
  'settings.exportData': 'Gegevens exporteren',
  'settings.exportDesc': 'Download al je studiegegevens als JSON-bestand.',
  'settings.sessions': 'Actieve sessies',
  'settings.logoutAll': 'Overal uitloggen',

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

  'auth.login': 'Log in',
  'auth.email': 'Email address',
  'auth.password': 'Password',
  'auth.name': 'Name',
  'auth.createAccount': 'Create account',
  'auth.setupTitle': 'First-time setup',
  'auth.setupIntro':
    'Create your account. You only do this once — the hub is for a single user.',
  'auth.invalidCredentials': 'Email address or password is incorrect.',
  'auth.rateLimited': 'Too many attempts. Please try again later.',
  'auth.totpCode': 'Verification code',
  'auth.totpPrompt': 'Enter the six-digit code from your authenticator app.',
  'auth.totpInvalid': 'The code is incorrect or has expired.',
  'auth.verify': 'Verify',

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
  'settings.profile': 'Profile',
  'settings.name': 'Name',
  'settings.language': 'Language',
  'settings.languageDesc':
    'Interface language. You can switch individual questions while studying.',
  'settings.examDate': 'Exam date',
  'settings.dailyTarget': 'Daily review target',
  'settings.extraTime': 'Apply extra time to mock exams by default',
  'settings.security': 'Security',
  'settings.changePassword': 'Change password',
  'settings.currentPassword': 'Current password',
  'settings.newPassword': 'New password',
  'settings.twoFactor': 'Two-factor authentication',
  'settings.twoFactorOn': 'Enabled',
  'settings.twoFactorOff': 'Disabled',
  'settings.enable': 'Enable',
  'settings.disable': 'Disable',
  'settings.save': 'Save',
  'settings.saved': 'Saved.',
  'settings.exportData': 'Export data',
  'settings.exportDesc': 'Download all your study data as a JSON file.',
  'settings.sessions': 'Active sessions',
  'settings.logoutAll': 'Log out everywhere',

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
};

const dictionaries: Record<Locale, Record<Key, string>> = { nl, en };

export type Translator = (key: Key) => string;

export function getTranslator(locale: Locale): Translator {
  const dictionary = dictionaries[locale];
  return (key) => dictionary[key];
}

export type TranslationKey = Key;
