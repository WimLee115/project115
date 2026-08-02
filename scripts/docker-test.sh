#!/usr/bin/env bash
#
# Project115 — test van de containeropstelling.
#
# Bouwt de image, start app en Caddy, en controleert daarna of de hele keten
# werkt: HTTPS via Caddy, de securityheaders, de afscherming van routes, de
# geladen vragenbank, en of de database een herstart overleeft.
#
# Gebruik:
#   ./scripts/docker-test.sh
#
# Vereist een draaiende Docker-daemon (sudo systemctl start docker).

set -uo pipefail

cd "$(dirname "$0")/.." || exit 1

PASS=0
FAIL=0
FAILURES=()

check() {
  local ok=$1 desc=$2 detail=${3:-}
  if [ "$ok" = "0" ]; then
    PASS=$((PASS + 1))
    printf '  \033[32m✓\033[0m %s\n' "$desc"
  else
    FAIL=$((FAIL + 1))
    FAILURES+=("$desc")
    printf '  \033[31m✗\033[0m %s%s\n' "$desc" "${detail:+ — $detail}"
  fi
}

section() { printf '\n\033[1m%s\033[0m\n' "$1"; }

cleanup() {
  section "Opruimen"
  docker compose down -v >/dev/null 2>&1
  echo "  containers en volumes verwijderd"
}

printf '\033[1mProject115 — containertest\033[0m\n'

# --- 0. Voorwaarden --------------------------------------------------------

section "0. Voorwaarden"

if ! docker info >/dev/null 2>&1; then
  printf '\033[31mDe Docker-daemon draait niet.\033[0m\n'
  printf 'Start hem met:  sudo systemctl start docker\n'
  exit 1
fi
check 0 "Docker-daemon is bereikbaar"

if [ ! -f .env ]; then
  echo "  .env ontbreekt — er wordt een tijdelijke aangemaakt"
  {
    echo "APP_SECRET=$(openssl rand -base64 48)"
    echo "SITE_ADDRESS=https://localhost"
  } > .env
fi

# APP_SECRET moet aanwezig en lang genoeg zijn; het entrypoint weigert anders.
SECRET=$(grep -E '^APP_SECRET=' .env | cut -d= -f2-)
if [ ${#SECRET} -ge 32 ]; then
  check 0 "APP_SECRET is aanwezig en lang genoeg (${#SECRET} tekens)"
else
  check 1 "APP_SECRET is aanwezig en lang genoeg" "${#SECRET} tekens"
  exit 1
fi

grep -qE '^SITE_ADDRESS=' .env || echo "SITE_ADDRESS=https://localhost" >> .env

# --- 1. Bouwen -------------------------------------------------------------

section "1. Image bouwen"

if docker compose build >/tmp/p115-build.log 2>&1; then
  check 0 "image gebouwd"
  SIZE=$(docker images --format '{{.Size}}' project115* 2>/dev/null | head -1)
  [ -n "$SIZE" ] && echo "    grootte: $SIZE"
else
  check 1 "image gebouwd" "zie /tmp/p115-build.log"
  tail -25 /tmp/p115-build.log
  exit 1
fi

# --- 2. Starten ------------------------------------------------------------

section "2. Containers starten"

if docker compose up -d >/tmp/p115-up.log 2>&1; then
  check 0 "containers gestart"
else
  check 1 "containers gestart" "zie /tmp/p115-up.log"
  tail -20 /tmp/p115-up.log
  exit 1
fi

trap cleanup EXIT

echo "  wachten tot de app gereed is..."
READY=1
for _ in $(seq 1 45); do
  if docker compose logs app 2>/dev/null | grep -q "server starten op poort"; then
    READY=0
    break
  fi
  sleep 2
done
check $READY "app is opgestart"

if [ $READY -ne 0 ]; then
  echo "  --- laatste logregels ---"
  docker compose logs --tail 30 app
  exit 1
fi

sleep 5

# --- 3. Initialisatie ------------------------------------------------------

section "3. Initialisatie in de container"

LOGS=$(docker compose logs app 2>/dev/null)

echo "$LOGS" | grep -q "migraties toepassen" && check 0 "migraties uitgevoerd" || check 1 "migraties uitgevoerd"
echo "$LOGS" | grep -q "content laden" && check 0 "vragenbank geladen" || check 1 "vragenbank geladen"

# Controleer dat beide certificeringen daadwerkelijk in de database staan.
COUNT=$(docker compose exec -T app node -e "
try {
  const D = require('better-sqlite3');
  const db = new D(process.env.DATABASE_PATH, {readonly:true});
  const q = s => db.prepare(s).get().c;
  console.log(q('SELECT count(*) c FROM questions') + ',' + q('SELECT count(*) c FROM glossary_terms') + ',' + q('SELECT count(*) c FROM certifications'));
} catch (e) { console.log('0,0,0'); }
" 2>/dev/null | tr -d '\r')

QUESTIONS=$(echo "$COUNT" | cut -d, -f1)
TERMS=$(echo "$COUNT" | cut -d, -f2)
CERTS=$(echo "$COUNT" | cut -d, -f3)

[ "${QUESTIONS:-0}" -ge 160 ] && check 0 "160 vragen in de database" || check 1 "160 vragen in de database" "gevonden: ${QUESTIONS:-0}"
[ "${TERMS:-0}" -ge 120 ] && check 0 "120 begrippen in de database" || check 1 "120 begrippen in de database" "gevonden: ${TERMS:-0}"
[ "${CERTS:-0}" -eq 2 ] && check 0 "beide certificeringen geladen" || check 1 "beide certificeringen geladen" "gevonden: ${CERTS:-0}"

# --- 4. Netwerkisolatie ----------------------------------------------------

section "4. Netwerkisolatie"

# De app mag niet rechtstreeks vanaf de host bereikbaar zijn; alleen via Caddy.
if curl -s -m 3 -o /dev/null http://localhost:3000/ 2>/dev/null; then
  check 1 "app is niet rechtstreeks bereikbaar op poort 3000"
else
  check 0 "app is niet rechtstreeks bereikbaar op poort 3000"
fi

# `docker compose port` geeft exit 0 met ':0' wanneer er geen mapping bestaat,
# dus de exitcode zegt niets — alleen de output telt.
MAPPING=$(docker compose port app 3000 2>/dev/null | tr -d '[:space:]')
if [ -z "$MAPPING" ] || [ "$MAPPING" = ":0" ]; then
  check 0 "app publiceert geen poort naar de host"
else
  check 1 "app publiceert geen poort naar de host" "gevonden: $MAPPING"
fi

# --- 5. HTTPS via Caddy ----------------------------------------------------

section "5. HTTPS via Caddy"

# Caddy's active health check heeft even nodig voordat de upstream als gezond
# geldt; zonder deze wachtlus meet je de opstartfase in plaats van de app.
for _ in $(seq 1 20); do
  H=$(curl -sk -m 5 -o /dev/null -w '%{http_code}' https://localhost/api/health 2>/dev/null)
  [ "$H" = "200" ] && break
  sleep 2
done
[ "${H:-}" = "200" ] && check 0 "upstream is gezond volgens Caddy" \
  || check 1 "upstream is gezond volgens Caddy" "health gaf ${H:-geen antwoord}"

# -k omdat Caddy een eigen interne CA gebruikt die het systeem nog niet kent.
STATUS=$(curl -sk -m 10 -o /dev/null -w '%{http_code}' https://localhost/ 2>/dev/null)
[ "$STATUS" = "307" ] || [ "$STATUS" = "302" ] || [ "$STATUS" = "200" ] \
  && check 0 "HTTPS reageert (status $STATUS)" \
  || check 1 "HTTPS reageert" "status ${STATUS:-geen}"

TLS=$(curl -sk -m 10 -o /dev/null -w '%{ssl_verify_result}' https://localhost/ 2>/dev/null)
[ -n "$TLS" ] && check 0 "TLS-handshake voltooid" || check 1 "TLS-handshake voltooid"

HEADERS=$(curl -sk -m 10 -D - -o /dev/null https://localhost/setup 2>/dev/null)

echo "$HEADERS" | grep -qi 'strict-transport-security' \
  && check 0 "HSTS-header aanwezig" || check 1 "HSTS-header aanwezig"
echo "$HEADERS" | grep -qi 'content-security-policy' \
  && check 0 "CSP-header aanwezig" || check 1 "CSP-header aanwezig"
echo "$HEADERS" | grep -qi "nonce-" \
  && check 0 "CSP gebruikt een nonce" || check 1 "CSP gebruikt een nonce"
echo "$HEADERS" | grep -qi 'x-frame-options: DENY' \
  && check 0 "X-Frame-Options: DENY" || check 1 "X-Frame-Options: DENY"
echo "$HEADERS" | grep -qi 'x-content-type-options: nosniff' \
  && check 0 "X-Content-Type-Options: nosniff" || check 1 "X-Content-Type-Options: nosniff"
echo "$HEADERS" | grep -qi '^server:' \
  && check 1 "Server-header is verwijderd" || check 0 "Server-header is verwijderd"
echo "$HEADERS" | grep -qi 'x-powered-by' \
  && check 1 "X-Powered-By is verborgen" || check 0 "X-Powered-By is verborgen"

# --- 6. Routes -------------------------------------------------------------

section "6. Routes achter de proxy"

SETUP=$(curl -sk -m 10 -o /dev/null -w '%{http_code}' https://localhost/setup 2>/dev/null)
[ "$SETUP" = "200" ] && check 0 "installatiescherm is bereikbaar" \
  || check 1 "installatiescherm is bereikbaar" "status $SETUP"

BODY=$(curl -sk -m 10 https://localhost/setup 2>/dev/null)
echo "$BODY" | grep -q "Project115" && check 0 "pagina rendert" || check 1 "pagina rendert"
echo "$BODY" | grep -q "B. van Rooij" && check 0 "auteursvermelding aanwezig" || check 1 "auteursvermelding aanwezig"

for route in dashboard exam practice review stats settings glossary; do
  CODE=$(curl -sk -m 10 -o /dev/null -w '%{http_code}' "https://localhost/$route" 2>/dev/null)
  [ "$CODE" = "307" ] || [ "$CODE" = "302" ] \
    && check 0 "/$route is afgeschermd" \
    || check 1 "/$route is afgeschermd" "status $CODE"
done

API=$(curl -sk -m 10 -o /dev/null -w '%{http_code}' https://localhost/api/export 2>/dev/null)
[ "$API" = "401" ] || [ "$API" = "307" ] \
  && check 0 "/api/export vereist authenticatie" \
  || check 1 "/api/export vereist authenticatie" "status $API"

# --- 7. Containerbeveiliging ----------------------------------------------

section "7. Containerbeveiliging"

USER_ID=$(docker compose exec -T app id -u 2>/dev/null | tr -d '\r')
[ "$USER_ID" != "0" ] && check 0 "app draait als niet-root (uid $USER_ID)" \
  || check 1 "app draait als niet-root" "uid $USER_ID"

# Read-only rootfs: schrijven buiten /data en /tmp moet falen.
if docker compose exec -T app sh -c 'touch /app/schrijftest 2>/dev/null'; then
  check 1 "bestandssysteem is read-only"
  docker compose exec -T app rm -f /app/schrijftest >/dev/null 2>&1
else
  check 0 "bestandssysteem is read-only"
fi

docker compose exec -T app sh -c 'touch /data/schrijftest && rm /data/schrijftest' >/dev/null 2>&1 \
  && check 0 "/data is wel schrijfbaar" || check 1 "/data is wel schrijfbaar"

CAPS=$(docker inspect --format '{{.HostConfig.CapDrop}}' "$(docker compose ps -q app)" 2>/dev/null)
echo "$CAPS" | grep -q "ALL" && check 0 "alle capabilities gedropt" || check 1 "alle capabilities gedropt"

OPTS=$(docker inspect --format '{{.HostConfig.SecurityOpt}}' "$(docker compose ps -q app)" 2>/dev/null)
echo "$OPTS" | grep -q "no-new-privileges" \
  && check 0 "no-new-privileges is actief" || check 1 "no-new-privileges is actief"

# --- 8. Persistentie -------------------------------------------------------

section "8. Persistentie over een herstart"

docker compose exec -T app sh -c 'echo persistentietest > /data/marker.txt' >/dev/null 2>&1
docker compose restart app >/dev/null 2>&1

for _ in $(seq 1 30); do
  docker compose logs app 2>/dev/null | tail -20 | grep -q "server starten op poort" && break
  sleep 2
done
sleep 4

docker compose exec -T app sh -c 'cat /data/marker.txt' 2>/dev/null | grep -q persistentietest \
  && check 0 "volume overleeft een herstart" || check 1 "volume overleeft een herstart"
docker compose exec -T app rm -f /data/marker.txt >/dev/null 2>&1

AFTER=$(curl -sk -m 15 -o /dev/null -w '%{http_code}' https://localhost/setup 2>/dev/null)
[ "$AFTER" = "200" ] && check 0 "app werkt na herstart" || check 1 "app werkt na herstart" "status $AFTER"

# --- 9. Ontbrekend geheim --------------------------------------------------

section "9. Weigert te starten zonder APP_SECRET"

OUT=$(docker run --rm -e APP_SECRET= -e DATABASE_PATH=/tmp/t.db \
  "$(docker compose images -q app 2>/dev/null | head -1)" 2>&1 | head -5)
echo "$OUT" | grep -q "APP_SECRET ontbreekt" \
  && check 0 "container weigert te starten zonder APP_SECRET" \
  || check 1 "container weigert te starten zonder APP_SECRET"

# --- Samenvatting ----------------------------------------------------------

printf '\n\033[1mResultaat\033[0m\n'
printf '  geslaagd: \033[32m%s\033[0m\n' "$PASS"
if [ "$FAIL" -gt 0 ]; then
  printf '  gefaald:  \033[31m%s\033[0m\n\n' "$FAIL"
  echo "Gefaalde controles:"
  for f in "${FAILURES[@]}"; do echo "  - $f"; done
  exit 1
fi
printf '  gefaald:  0\n\n\033[32mAlle controles geslaagd.\033[0m\n'
