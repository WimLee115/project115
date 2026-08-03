# Project115 — productie-image
#
# Deze image wordt zónder netwerktoegang gebouwd. Dat is een bewuste keuze voor
# deze omgeving: er draait een VPN met DNS-lekbescherming, die UDP-poort 53
# vanaf Docker-bridges blokkeert. Daardoor faalt elke `apt-get` of `npm ci` in
# een buildstage, ook met LAN-sharing toegestaan.
#
# In plaats daarvan gebruiken we de node_modules die al op de host staan. Dat
# werkt omdat de base-image dezelfde Node-hoofdversie en dezelfde libc gebruikt
# als de host:
#   - Debian bookworm (glibc), net als Kali — @node-rs/argon2 levert hier de
#     linux-x64-*gnu* binary, niet de musl-variant die Alpine nodig zou hebben;
#   - Node 24, gelijk aan de host, zodat de gecompileerde better-sqlite3 dezelfde
#     ABI-versie heeft. Onder een andere hoofdversie weigert die binary te laden.
#     Werk de host en deze twee FROM-regels dus altijd samen bij.
#
# Werkt je omgeving wél met netwerk in de build, dan is `npm ci --omit=dev` in
# een eigen deps-stage de nettere route. Zie DOCKER.md.

# --- Stage 1: build --------------------------------------------------------
FROM node:24-bookworm-slim AS builder

WORKDIR /app

# node_modules komt mee uit de build-context (zie .dockerignore).
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# APP_SECRET is tijdens de build nodig omdat modules hem inlezen; de waarde doet
# er niet toe en belandt niet in de uiteindelijke image, want alleen de
# standalone output wordt gekopieerd.
RUN APP_SECRET="build-time-placeholder-not-used-at-runtime-000" npm run build

# --- Stage 2: runtime ------------------------------------------------------
FROM node:24-bookworm-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV DATABASE_PATH=/data/project115.db

# Draaien als niet-root. De node-images leveren de gebruiker `node` (uid 1000)
# standaard mee.
RUN mkdir -p /data && chown -R node:node /data

# De standalone output bevat de server plus precies de node_modules die hij
# nodig heeft — aanzienlijk minder dan de volledige installatie.
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
COPY --from=builder --chown=node:node /app/public ./public

# Migraties, seed en content, zodat de container zichzelf kan initialiseren.
COPY --from=builder --chown=node:node /app/drizzle ./drizzle
COPY --from=builder --chown=node:node /app/scripts ./scripts
COPY --from=builder --chown=node:node /app/content ./content
COPY --from=builder --chown=node:node /app/src/db ./src/db
COPY --from=builder --chown=node:node /app/tsconfig.json ./

# tsx draait de migratie- en seedscripts bij het opstarten. Deze pakketten zitten
# niet in de standalone output omdat Next ze niet in de serverbundel nodig heeft.
COPY --from=builder --chown=node:node /app/node_modules/tsx ./node_modules/tsx
COPY --from=builder --chown=node:node /app/node_modules/esbuild ./node_modules/esbuild
COPY --from=builder --chown=node:node /app/node_modules/@esbuild ./node_modules/@esbuild
COPY --from=builder --chown=node:node /app/node_modules/get-tsconfig ./node_modules/get-tsconfig
COPY --from=builder --chown=node:node /app/node_modules/resolve-pkg-maps ./node_modules/resolve-pkg-maps
COPY --from=builder --chown=node:node /app/node_modules/drizzle-orm ./node_modules/drizzle-orm

COPY --chown=node:node docker-entrypoint.sh ./
RUN chmod +x ./docker-entrypoint.sh

USER node

EXPOSE 3000

# Geen tini: Docker's eigen init (`init: true` in compose) doet hetzelfde werk
# en scheelt een pakket dat we zonder netwerk niet kunnen installeren.
ENTRYPOINT ["./docker-entrypoint.sh"]

HEALTHCHECK --interval=30s --timeout=5s --start-period=25s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
