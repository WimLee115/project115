/**
 * Opslag van studiegegevens op het toestel.
 *
 * IndexedDB, geen SQLite. De afweging: alleen jouw voortgang wordt opgeslagen
 * (pogingen, antwoorden, herhaalkaarten), en dat zijn na een jaar studeren
 * enkele duizenden kleine records. Daar is geen queryplanner voor nodig, wel
 * een opslag die een crash overleeft en die de WebView zonder native plugin
 * aankan. IndexedDB is beide, en zit al in Android.
 *
 * De recordvormen volgen het databaseschema van de webversie, zodat een export
 * uit de ene versie in de andere geïmporteerd kan worden zonder vertaalslag.
 * Tijdstempels zijn overal Unix-seconden in UTC, net als daar.
 */

import type { Locale } from './content';

const DB_NAME = 'project115';
const DB_VERSION = 1;

export const STORES = {
  attempts: 'attempts',
  attemptQuestions: 'attemptQuestions',
  cards: 'fsrsCards',
  reviews: 'fsrsReviews',
  plans: 'studyPlans',
  meta: 'meta',
} as const;

/* ---------------------------------------------------------------------------
 * Recordvormen
 * ------------------------------------------------------------------------- */

export type AttemptMode = 'exam' | 'practice' | 'weakspot' | 'review';

export interface AttemptRow {
  id: string;
  certificationId: string;
  mode: AttemptMode;
  locale: Locale;
  startedAt: number;
  finishedAt: number | null;
  timeLimitSeconds: number | null;
  extraTimeApplied: boolean;
  questionCount: number;
  score: number | null;
  passMark: number;
  passed: boolean | null;
  autoSubmitted: boolean;
}

export interface AttemptQuestionRow {
  id: string;
  attemptId: string;
  questionId: string;
  /** Kopie van het leerdoel, zodat statistiek blijft kloppen na contentwijziging. */
  objectiveId: string;
  position: number;
  /** Volgorde waarin de opties zijn getoond. */
  optionOrder: string[];
  selectedOptionId: string | null;
  isCorrect: boolean | null;
  flagged: boolean;
  timeSpentMs: number;
  answeredAt: number | null;
}

export interface FsrsCardRow {
  id: string;
  itemType: 'question' | 'term';
  itemId: string;
  certificationId: string;
  due: number;
  stability: number;
  difficulty: number;
  elapsedDays: number;
  scheduledDays: number;
  reps: number;
  lapses: number;
  /** 0 = New, 1 = Learning, 2 = Review, 3 = Relearning. */
  state: number;
  lastReview: number | null;
  suspended: boolean;
}

export interface FsrsReviewRow {
  id?: number;
  cardId: string;
  rating: 1 | 2 | 3 | 4;
  state: number;
  scheduledDays: number;
  elapsedDays: number;
  reviewedAt: number;
  durationMs: number;
}

export interface StudyPlanRow {
  id: string;
  certificationId: string;
  examDate: number | null;
  dailyReviewTarget: number;
  useExtraTime: boolean;
  preferredLocale: Locale;
  createdAt: number;
  updatedAt: number;
}

export interface AppSettings {
  displayName: string;
  locale: Locale;
  theme: 'system' | 'light' | 'dark';
  /** Argon2 is hier niet beschikbaar; zie `lock.ts` voor de afweging. */
  pin: { hash: string; salt: string; iterations: number } | null;
  /** Vergrendelen zodra de app naar de achtergrond gaat. */
  lockOnBackground: boolean;
  /** Tonen hoeveel kaarten er nog te herhalen zijn op het tabblad. */
  showDueBadge: boolean;
}

export const DEFAULT_SETTINGS: AppSettings = {
  // Leeg, niet de naam van de maker. De app wordt gedeeld met andere docenten,
  // en die worden op hun eigen toestel niet graag met iemand anders begroet.
  // Het auteurschap staat in het scherm 'Over' en verandert daar niet mee.
  displayName: '',
  locale: 'nl',
  theme: 'system',
  pin: null,
  lockOnBackground: false,
  showDueBadge: true,
};

/* ---------------------------------------------------------------------------
 * Verbinding
 * ------------------------------------------------------------------------- */

let connection: Promise<IDBDatabase> | null = null;

function openDatabase(): Promise<IDBDatabase> {
  if (connection) return connection;

  connection = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;

      if (!db.objectStoreNames.contains(STORES.attempts)) {
        const store = db.createObjectStore(STORES.attempts, { keyPath: 'id' });
        store.createIndex('certificationId', 'certificationId');
        store.createIndex('startedAt', 'startedAt');
      }

      if (!db.objectStoreNames.contains(STORES.attemptQuestions)) {
        const store = db.createObjectStore(STORES.attemptQuestions, { keyPath: 'id' });
        store.createIndex('attemptId', 'attemptId');
        store.createIndex('questionId', 'questionId');
      }

      if (!db.objectStoreNames.contains(STORES.cards)) {
        const store = db.createObjectStore(STORES.cards, { keyPath: 'id' });
        // Eén kaart per item; deze index bewaakt dat en dient als opzoeksleutel.
        store.createIndex('item', ['itemType', 'itemId'], { unique: true });
        store.createIndex('due', 'due');
        store.createIndex('certificationId', 'certificationId');
      }

      if (!db.objectStoreNames.contains(STORES.reviews)) {
        const store = db.createObjectStore(STORES.reviews, {
          keyPath: 'id',
          autoIncrement: true,
        });
        store.createIndex('cardId', 'cardId');
        store.createIndex('reviewedAt', 'reviewedAt');
      }

      if (!db.objectStoreNames.contains(STORES.plans)) {
        const store = db.createObjectStore(STORES.plans, { keyPath: 'id' });
        store.createIndex('certificationId', 'certificationId', { unique: true });
      }

      if (!db.objectStoreNames.contains(STORES.meta)) {
        db.createObjectStore(STORES.meta, { keyPath: 'key' });
      }
    };

    request.onsuccess = () => {
      const db = request.result;
      // Een tweede tabblad dat een nieuwere versie wil openen mag deze
      // verbinding sluiten; anders blijft de upgrade hangen.
      db.onversionchange = () => {
        db.close();
        connection = null;
      };
      resolve(db);
    };

    request.onerror = () => reject(request.error ?? new Error('IndexedDB niet beschikbaar'));
    request.onblocked = () =>
      reject(new Error('De database is nog open in een ander venster.'));
  });

  return connection;
}

/* ---------------------------------------------------------------------------
 * Transactiehulp
 *
 * IndexedDB sluit een transactie zodra de microtask-wachtrij leeg is. Await
 * tussen twee requests in dezelfde transactie is daarom onveilig: de tweede
 * request landt dan op een gesloten transactie. Alle helpers hieronder zetten
 * hun requests daarom in één keer klaar en wachten pas daarna.
 * ------------------------------------------------------------------------- */

type StoreName = (typeof STORES)[keyof typeof STORES];

function run<T>(
  stores: StoreName[],
  mode: IDBTransactionMode,
  work: (tx: IDBTransaction) => T | Promise<T>,
): Promise<T> {
  return openDatabase().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        const tx = db.transaction(stores, mode);
        let result: T;
        let failed = false;

        tx.oncomplete = () => {
          if (!failed) resolve(result);
        };
        tx.onerror = () => {
          failed = true;
          reject(tx.error ?? new Error('Transactie mislukt'));
        };
        tx.onabort = () => {
          failed = true;
          reject(tx.error ?? new Error('Transactie afgebroken'));
        };

        try {
          const value = work(tx);
          if (value instanceof Promise) {
            value.then(
              (resolved) => {
                result = resolved;
              },
              (error: unknown) => {
                failed = true;
                reject(error);
                tx.abort();
              },
            );
          } else {
            result = value;
          }
        } catch (error) {
          failed = true;
          reject(error);
          tx.abort();
        }
      }),
  );
}

function wrap<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('Verzoek mislukt'));
  });
}

/* ---------------------------------------------------------------------------
 * Pogingen
 * ------------------------------------------------------------------------- */

export async function putAttempt(attempt: AttemptRow): Promise<void> {
  await run([STORES.attempts], 'readwrite', (tx) => {
    tx.objectStore(STORES.attempts).put(attempt);
  });
}

export async function getAttempt(id: string): Promise<AttemptRow | undefined> {
  return run([STORES.attempts], 'readonly', (tx) =>
    wrap<AttemptRow | undefined>(tx.objectStore(STORES.attempts).get(id)),
  );
}

export async function allAttempts(): Promise<AttemptRow[]> {
  const rows = await run([STORES.attempts], 'readonly', (tx) =>
    wrap<AttemptRow[]>(tx.objectStore(STORES.attempts).getAll()),
  );
  return rows.sort((a, b) => b.startedAt - a.startedAt);
}

/** Poging plus vragen in één transactie; die twee horen altijd bij elkaar. */
export async function createAttempt(
  attempt: AttemptRow,
  items: AttemptQuestionRow[],
): Promise<void> {
  await run([STORES.attempts, STORES.attemptQuestions], 'readwrite', (tx) => {
    tx.objectStore(STORES.attempts).put(attempt);
    const store = tx.objectStore(STORES.attemptQuestions);
    for (const item of items) store.put(item);
  });
}

export async function deleteAttempt(id: string): Promise<void> {
  await run([STORES.attempts, STORES.attemptQuestions], 'readwrite', (tx) => {
    tx.objectStore(STORES.attempts).delete(id);
    const index = tx.objectStore(STORES.attemptQuestions).index('attemptId');
    const cursorRequest = index.openCursor(IDBKeyRange.only(id));
    cursorRequest.onsuccess = () => {
      const cursor = cursorRequest.result;
      if (!cursor) return;
      cursor.delete();
      cursor.continue();
    };
  });
}

export async function itemsOfAttempt(attemptId: string): Promise<AttemptQuestionRow[]> {
  const rows = await run([STORES.attemptQuestions], 'readonly', (tx) =>
    wrap<AttemptQuestionRow[]>(
      tx.objectStore(STORES.attemptQuestions).index('attemptId').getAll(attemptId),
    ),
  );
  return rows.sort((a, b) => a.position - b.position);
}

export async function allAttemptQuestions(): Promise<AttemptQuestionRow[]> {
  return run([STORES.attemptQuestions], 'readonly', (tx) =>
    wrap<AttemptQuestionRow[]>(tx.objectStore(STORES.attemptQuestions).getAll()),
  );
}

export async function putAttemptQuestion(item: AttemptQuestionRow): Promise<void> {
  await run([STORES.attemptQuestions], 'readwrite', (tx) => {
    tx.objectStore(STORES.attemptQuestions).put(item);
  });
}

/** Poging afronden: score en de bijbehorende items in één transactie. */
export async function finishAttempt(
  attempt: AttemptRow,
  items: AttemptQuestionRow[],
): Promise<void> {
  await run([STORES.attempts, STORES.attemptQuestions], 'readwrite', (tx) => {
    tx.objectStore(STORES.attempts).put(attempt);
    const store = tx.objectStore(STORES.attemptQuestions);
    for (const item of items) store.put(item);
  });
}

/* ---------------------------------------------------------------------------
 * Herhaalkaarten
 * ------------------------------------------------------------------------- */

export async function getCard(id: string): Promise<FsrsCardRow | undefined> {
  return run([STORES.cards], 'readonly', (tx) =>
    wrap<FsrsCardRow | undefined>(tx.objectStore(STORES.cards).get(id)),
  );
}

export async function getCardByItem(
  itemType: 'question' | 'term',
  itemId: string,
): Promise<FsrsCardRow | undefined> {
  return run([STORES.cards], 'readonly', (tx) =>
    wrap<FsrsCardRow | undefined>(
      tx.objectStore(STORES.cards).index('item').get([itemType, itemId]),
    ),
  );
}

export async function allCards(): Promise<FsrsCardRow[]> {
  return run([STORES.cards], 'readonly', (tx) =>
    wrap<FsrsCardRow[]>(tx.objectStore(STORES.cards).getAll()),
  );
}

export async function putCard(card: FsrsCardRow): Promise<void> {
  await run([STORES.cards], 'readwrite', (tx) => {
    tx.objectStore(STORES.cards).put(card);
  });
}

export async function putCards(cards: FsrsCardRow[]): Promise<void> {
  if (cards.length === 0) return;
  await run([STORES.cards], 'readwrite', (tx) => {
    const store = tx.objectStore(STORES.cards);
    for (const card of cards) store.put(card);
  });
}

/** Kaart bijwerken en de bijbehorende reviewregel wegschrijven, samen of niet. */
export async function saveReview(
  card: FsrsCardRow,
  review: FsrsReviewRow,
): Promise<void> {
  await run([STORES.cards, STORES.reviews], 'readwrite', (tx) => {
    tx.objectStore(STORES.cards).put(card);
    tx.objectStore(STORES.reviews).add(review);
  });
}

export async function allReviews(): Promise<FsrsReviewRow[]> {
  return run([STORES.reviews], 'readonly', (tx) =>
    wrap<FsrsReviewRow[]>(tx.objectStore(STORES.reviews).getAll()),
  );
}

/** Reviews sinds een tijdstip, voor de dagteller op het dashboard. */
export async function reviewsSince(timestamp: number): Promise<FsrsReviewRow[]> {
  return run([STORES.reviews], 'readonly', (tx) =>
    wrap<FsrsReviewRow[]>(
      tx
        .objectStore(STORES.reviews)
        .index('reviewedAt')
        .getAll(IDBKeyRange.lowerBound(timestamp)),
    ),
  );
}

/* ---------------------------------------------------------------------------
 * Studieplannen
 * ------------------------------------------------------------------------- */

export async function allPlans(): Promise<StudyPlanRow[]> {
  return run([STORES.plans], 'readonly', (tx) =>
    wrap<StudyPlanRow[]>(tx.objectStore(STORES.plans).getAll()),
  );
}

export async function putPlan(plan: StudyPlanRow): Promise<void> {
  await run([STORES.plans], 'readwrite', (tx) => {
    tx.objectStore(STORES.plans).put(plan);
  });
}

/* ---------------------------------------------------------------------------
 * Instellingen
 * ------------------------------------------------------------------------- */

interface MetaRow {
  key: string;
  value: unknown;
}

export async function getSettings(): Promise<AppSettings> {
  const row = await run([STORES.meta], 'readonly', (tx) =>
    wrap<MetaRow | undefined>(tx.objectStore(STORES.meta).get('settings')),
  );
  // Samenvoegen met de standaardwaarden, zodat een instelling die later is
  // toegevoegd niet undefined is bij iemand die al eerder opsloeg.
  return { ...DEFAULT_SETTINGS, ...((row?.value as Partial<AppSettings>) ?? {}) };
}

export async function saveSettings(settings: AppSettings): Promise<void> {
  await run([STORES.meta], 'readwrite', (tx) => {
    tx.objectStore(STORES.meta).put({ key: 'settings', value: settings });
  });
}

export async function getMeta<T>(key: string): Promise<T | undefined> {
  const row = await run([STORES.meta], 'readonly', (tx) =>
    wrap<MetaRow | undefined>(tx.objectStore(STORES.meta).get(key)),
  );
  return row?.value as T | undefined;
}

export async function setMeta(key: string, value: unknown): Promise<void> {
  await run([STORES.meta], 'readwrite', (tx) => {
    tx.objectStore(STORES.meta).put({ key, value });
  });
}

/* ---------------------------------------------------------------------------
 * Beheer
 * ------------------------------------------------------------------------- */

/** Alles in één keer terugzetten, gebruikt door de import. */
export async function replaceAll(data: {
  attempts: AttemptRow[];
  attemptQuestions: AttemptQuestionRow[];
  cards: FsrsCardRow[];
  reviews: FsrsReviewRow[];
  plans: StudyPlanRow[];
}): Promise<void> {
  await run(
    [
      STORES.attempts,
      STORES.attemptQuestions,
      STORES.cards,
      STORES.reviews,
      STORES.plans,
    ],
    'readwrite',
    (tx) => {
      tx.objectStore(STORES.attempts).clear();
      tx.objectStore(STORES.attemptQuestions).clear();
      tx.objectStore(STORES.cards).clear();
      tx.objectStore(STORES.reviews).clear();
      tx.objectStore(STORES.plans).clear();

      for (const row of data.attempts) tx.objectStore(STORES.attempts).put(row);
      for (const row of data.attemptQuestions) {
        tx.objectStore(STORES.attemptQuestions).put(row);
      }
      for (const row of data.cards) tx.objectStore(STORES.cards).put(row);
      for (const row of data.reviews) {
        // Het autoIncrement-id opnieuw laten toekennen; de oude waarde zegt
        // niets en zou bij samenvoegen kunnen botsen.
        const { id: _ignored, ...rest } = row;
        tx.objectStore(STORES.reviews).add(rest as FsrsReviewRow);
      }
      for (const row of data.plans) tx.objectStore(STORES.plans).put(row);
    },
  );
}

/** Wist alle studiegegevens, maar laat instellingen staan. */
export async function clearStudyData(): Promise<void> {
  await run(
    [
      STORES.attempts,
      STORES.attemptQuestions,
      STORES.cards,
      STORES.reviews,
      STORES.plans,
    ],
    'readwrite',
    (tx) => {
      tx.objectStore(STORES.attempts).clear();
      tx.objectStore(STORES.attemptQuestions).clear();
      tx.objectStore(STORES.cards).clear();
      tx.objectStore(STORES.reviews).clear();
      tx.objectStore(STORES.plans).clear();
    },
  );
}
