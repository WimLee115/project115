/**
 * Voert openstaande databasemigraties uit.
 *
 * Draait bij het opstarten van de container en handmatig via `npm run db:migrate`.
 * Idempotent: al toegepaste migraties worden overgeslagen.
 */
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const path = resolve(process.env.DATABASE_PATH ?? './data/project115.db');
mkdirSync(dirname(path), { recursive: true });

const sqlite = new Database(path);
sqlite.pragma('journal_mode = WAL');
sqlite.pragma('foreign_keys = ON');

const db = drizzle(sqlite);

console.log(`[migrate] database: ${path}`);
migrate(db, { migrationsFolder: './drizzle' });
console.log('[migrate] klaar');

sqlite.close();
