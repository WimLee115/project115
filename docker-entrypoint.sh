#!/bin/sh
set -e

# Project115 — opstartscript voor de container.
#
# Past openstaande migraties toe en laadt de content voordat de server start.
# Beide stappen zijn idempotent: bij een herstart verandert er niets aan je
# studiegegevens, alleen aan de content als die is bijgewerkt.

echo "[project115] database: ${DATABASE_PATH:-/data/project115.db}"

if [ -z "$APP_SECRET" ]; then
  echo "[project115] FOUT: APP_SECRET ontbreekt." >&2
  echo "[project115] Genereer er een met: openssl rand -base64 48" >&2
  exit 1
fi

if [ "${#APP_SECRET}" -lt 32 ]; then
  echo "[project115] FOUT: APP_SECRET moet minimaal 32 tekens lang zijn." >&2
  exit 1
fi

echo "[project115] migraties toepassen..."
node_modules/tsx/dist/cli.mjs scripts/migrate.ts

if [ "${SKIP_SEED:-0}" != "1" ]; then
  echo "[project115] content laden..."
  node_modules/tsx/dist/cli.mjs scripts/seed.ts
fi

echo "[project115] server starten op poort ${PORT:-3000}"
exec node server.js
