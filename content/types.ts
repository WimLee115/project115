/**
 * Contentmodel voor Project115.
 *
 * De vragenbank staat als TypeScript in de repository, niet als losse JSON.
 * Daardoor vangt de compiler fouten die anders pas tijdens een proefexamen
 * zouden opvallen: een verwijzing naar een niet-bestaand leerdoel, een vraag
 * zonder juist antwoord, of een 'list'-vraag zonder statements.
 */

export type Locale = 'nl' | 'en';

/** Tweetalige tekst. Beide talen zijn verplicht — half vertaalde content is erger dan geen. */
export interface Bilingual {
  nl: string;
  en: string;
}

export interface CertificationSeed {
  id: string;
  provider: string;
  title: Bilingual;
  description: Bilingual;
  questionCount: number;
  passMark: number;
  durationMinutes: number;
  /** Extra tijd voor niet-moedertaalsprekers; 0 als de aanbieder dat niet biedt. */
  extraTimeMinutes: number;
  examLanguage: Locale;
  /** Tailwind-compatibele kleurwaarde die deze certificering herkenbaar maakt. */
  accentColor: string;
  sortOrder: number;
}

export interface DomainSeed {
  /** Officiële nummering binnen de syllabus, bijv. '4'. */
  code: string;
  title: Bilingual;
  /** Officiële weging in procenten. Alle domeinen samen zijn 100. */
  weight: number;
}

export interface ObjectiveSeed {
  /** Assessment-criterium, bijv. '4.2.2'. */
  code: string;
  /** Domein waar dit criterium onder valt, bijv. '4'. */
  domain: string;
  /** Onderwerp, bijv. '4.2 The ITIL Guiding Principles'. */
  topic: Bilingual;
  description: Bilingual;
  /** 1 = onthouden/herkennen, 2 = begrijpen/toepassen. */
  bloom: 1 | 2;
}

export type QuestionType = 'standard' | 'negative' | 'missing_word' | 'list';

export interface OptionSeed {
  /** Optietekst in beide talen. */
  text: Bilingual;
  correct?: boolean;
  /**
   * Waarom deze optie juist of onjuist is. Bij afleiders is dit het
   * waardevolste veld van de hele vraag: het legt de denkfout bloot.
   */
  rationale?: Bilingual;
}

export interface QuestionSeed {
  /** Stabiele identifier, bijv. 'itil5-q001'. Nooit hergebruiken. */
  id: string;
  /** Assessment-criterium waar deze vraag op toetst. */
  objective: string;
  type?: QuestionType;
  bloom?: 1 | 2;
  /** 1 = makkelijk, 2 = gemiddeld, 3 = lastig. */
  difficulty?: 1 | 2 | 3;
  stem: Bilingual;
  /** Verplicht bij type 'list': precies vier genummerde statements. */
  listItems?: Bilingual[];
  /** Vier opties; precies één is correct. */
  options: OptionSeed[];
  /** Toelichting op het juiste antwoord, getoond na beantwoorden. */
  explanation: Bilingual;
  /** Herkomst in het bronmateriaal, bijv. 'Syllabus 4.2.2'. */
  source?: string;
}

export interface GlossarySeed {
  termEn: string;
  termNl: string;
  definition: Bilingual;
  /** Veelgemaakte verwarring of ezelsbruggetje. */
  note?: Bilingual;
  /** Optionele koppeling aan een assessment-criterium. */
  objective?: string;
}

export interface ContentPack {
  certification: CertificationSeed;
  domains: DomainSeed[];
  objectives: ObjectiveSeed[];
  questions: QuestionSeed[];
  glossary: GlossarySeed[];
}
