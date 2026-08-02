import 'server-only';

import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

import * as schema from './schema';

/**
 * Databaseverbinding.
 *
 * De verbinding wordt pas geopend bij het eerste daadwerkelijke gebruik, niet
 * bij het importeren van deze module. Dat is niet alleen zuiniger, het is
 * noodzakelijk: tijdens `next build` analyseert Next.js elke route met meerdere
 * parallelle workers. Openden die allemaal meteen een verbinding naar een nog
 * niet bestaande database, dan racen ze op het instellen van de WAL-modus en
 * faalt de build met SQLITE_BUSY.
 *
 * In development herlaadt Next.js modules bij elke wijziging; de globalThis-cache
 * voorkomt dat dat een nieuwe SQLite-handle per herlaad oplevert.
 */

const DEFAULT_PATH = './data/project115.db';

type DrizzleDb = ReturnType<typeof createConnection>;

declare global {
  // `var` is hier geen slordigheid maar een vereiste: alleen var-declaraties
  // landen op globalThis. Met let of const werkt de cache hierboven niet.
  var __project115_db: DrizzleDb | undefined;
}

function createConnection() {
  const path = resolve(process.env.DATABASE_PATH ?? DEFAULT_PATH);
  mkdirSync(dirname(path), { recursive: true });

  const sqlite = new Database(path);

  // WAL laat lezen en schrijven naast elkaar bestaan. Zonder dit blokkeert een
  // lopend proefexamen op elke achtergrondschrijfactie.
  sqlite.pragma('journal_mode = WAL');
  // SQLite handhaaft foreign keys alleen als je er expliciet om vraagt.
  sqlite.pragma('foreign_keys = ON');
  // NORMAL is met WAL veilig tegen crashes en fors sneller dan FULL.
  sqlite.pragma('synchronous = NORMAL');
  // Wacht in plaats van meteen 'database is locked' te gooien.
  sqlite.pragma('busy_timeout = 5000');
  sqlite.pragma('temp_store = MEMORY');

  return drizzle(sqlite, { schema });
}

function getConnection(): DrizzleDb {
  if (globalThis.__project115_db) return globalThis.__project115_db;

  const connection = createConnection();
  // Ook in productie cachen: binnen één proces is er maar één verbinding nodig.
  globalThis.__project115_db = connection;
  return connection;
}

/**
 * De gedeelde databaseverbinding.
 *
 * Een Proxy in plaats van de verbinding zelf, zodat `import { db }` geen
 * bestand aanraakt. Pas wanneer er echt een property wordt opgevraagd —
 * `db.select()`, `db.query`, … — komt de verbinding tot stand.
 */
export const db = new Proxy({} as DrizzleDb, {
  get(_target, property, receiver) {
    return Reflect.get(getConnection(), property, receiver);
  },
  has(_target, property) {
    return Reflect.has(getConnection(), property);
  },
  ownKeys() {
    return Reflect.ownKeys(getConnection());
  },
  getOwnPropertyDescriptor(_target, property) {
    return Reflect.getOwnPropertyDescriptor(getConnection(), property);
  },
});

export { schema };
export * from './schema';
