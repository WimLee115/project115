# Project115 in Docker

Twee containers: de Next.js-app (alleen intern bereikbaar) en Caddy als
TLS-terminerende reverse proxy. Alle verkeer loopt over HTTPS; er bestaat geen
onversleutelde route naar de applicatie.

---

## Starten

```bash
# Daemon (indien nog niet actief)
sudo systemctl start docker

# Geheim en adres
cp .env.example .env
echo "APP_SECRET=$(openssl rand -base64 48)" >> .env
# Pas SITE_ADDRESS aan, bijvoorbeeld https://192.168.2.5

docker compose up -d --build
```

Daarna bereikbaar op het adres uit `SITE_ADDRESS`, ook vanaf je telefoon in
hetzelfde netwerk.

```bash
docker compose logs -f app     # meekijken
docker compose down            # stoppen, data behouden
docker compose down -v         # stoppen én alle data wissen
```

---

## Certificaatwaarschuwing wegwerken

Caddy maakt een eigen certificaatautoriteit die je browser niet kent. Eenmalig
vertrouwen:

```bash
docker compose cp caddy:/data/caddy/pki/authorities/local/root.crt ./caddy-root.crt
sudo cp caddy-root.crt /usr/local/share/ca-certificates/project115-caddy.crt
sudo update-ca-certificates
```

Firefox gebruikt een eigen certificaatopslag: *Instellingen → Privacy &
Beveiliging → Certificaten weergeven → Autoriteiten → Importeren*.

---

## Testen

```bash
./scripts/docker-test.sh
```

41 controles in negen fasen: image bouwen, containers starten, initialisatie
(migraties, 160 vragen, 120 begrippen), netwerkisolatie, HTTPS met
securityheaders, routes achter de proxy, containerhardening, persistentie over
een herstart, en of de container weigert te starten zonder `APP_SECRET`. Het
script ruimt zichzelf op.

De volledige gebruikersreis testen tegen de draaiende containers:

```bash
docker compose up -d
NODE_TLS_REJECT_UNAUTHORIZED=0 BASE_URL=https://localhost npx tsx scripts/e2e.ts
```

`NODE_TLS_REJECT_UNAUTHORIZED=0` is alleen voor deze test nodig, omdat de
interne CA nog niet vertrouwd is. Gebruik die variabele nergens anders.

---

## Beveiliging van de opstelling

| Maatregel | Uitwerking | Getest |
|---|---|---|
| Geen directe toegang | app gebruikt `expose`, geen `ports` — alleen Caddy praat ermee | ✓ |
| Niet-root | draait als uid 1000 (`node`) | ✓ |
| Read-only rootfs | schrijven op `/app` faalt; alleen `/data` en `/tmp` schrijfbaar | ✓ |
| Capabilities | `cap_drop: ALL` | ✓ |
| Privilege-escalatie | `no-new-privileges: true` | ✓ |
| Geheim verplicht | container weigert te starten zonder `APP_SECRET` van 32+ tekens | ✓ |
| TLS | Caddy met interne CA, HSTS 2 jaar | ✓ |
| Headers | CSP met nonce, X-Frame-Options DENY, nosniff, geen `Server` | ✓ |
| Persistentie | named volume overleeft herstart en herbouw | ✓ |
| Logrotatie | max 10 MB per bestand, 3 bestanden per container | — |

---

## Waarom de image netwerkloos wordt gebouwd

Op deze machine draait Mullvad VPN met DNS-lekbescherming. Die blokkeert UDP
poort 53 vanaf Docker-bridges — ook met *Local network sharing* op `allow`. TCP
naar buiten werkt wel, maar zonder DNS faalt elke `apt-get` of `npm ci` in een
buildstage. Getest en bevestigd met Alpine én Debian, met `--network=host`, met
`--dns=1.1.1.1` en met DNS-over-TCP (`use-vc`): geen enkele variant kan namen
resolven.

De Dockerfile gebruikt daarom de `node_modules` die al op de host staan. Dat
werkt betrouwbaar omdat de base-image daarop is afgestemd:

- **Debian bookworm** (glibc), net als Kali. `@node-rs/argon2` levert hier de
  `linux-x64-gnu`-binary; op Alpine zou de musl-variant nodig zijn.
- **Node 24**, gelijk aan de host, zodat de gecompileerde `better-sqlite3`
  dezelfde ABI-versie heeft. Onder een andere hoofdversie weigert die binary te
  laden, dus host en base-image horen samen bijgewerkt te worden.

Resultaat: 302 MB, geen build-tools in de image, en een build die in seconden
klaar is in plaats van minuten.

**Draait jouw omgeving wél met netwerk?** Dan is een eigen deps-stage netter:

```dockerfile
FROM node:24-bookworm-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
```

Vervang de builder-stage door een die `--from=deps /app/node_modules` kopieert,
en haal `node_modules` weer uit `.dockerignore`. De rest van het bestand kan
blijven zoals het is.

---

## Problemen oplossen

**503 van Caddy.** De upstream geldt als ongezond. Caddy controleert
`/api/health`, een endpoint dat altijd 200 geeft — de gewone pagina's redirecten
afhankelijk van de sessie, en alles buiten 2xx ziet Caddy als down. Controleer
met `docker compose logs app` of de app is opgestart; direct na `up` duurt het
enkele seconden voor de eerste healthcheck slaagt.

**`APP_SECRET ontbreekt`.** Het entrypoint weigert bewust te starten zonder
geheim van minimaal 32 tekens. Genereer er een met `openssl rand -base64 48`.

**Build faalt op DNS.** Zie hierboven: dit is de VPN. Controleer met
`mullvad lan get`, of pauzeer de verbinding tijdelijk.

**Wijzigingen in de vragenbank komen niet door.** Het seeden draait bij elke
start, maar `SKIP_SEED=1` schakelt dat uit. Herbouw na een contentwijziging:
`docker compose up -d --build`.
