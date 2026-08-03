#!/usr/bin/env bash
#
# Project115 — startprogramma
#
# Dubbelklik dit bestand of draai het met ./start.sh
#
# Het script regelt alles zelf: het controleert of alles geïnstalleerd is,
# maakt de eerste keer een beveiligingssleutel en de database aan, laadt de
# vragenbank, start de studiehub en opent je browser.
#
# Ontwikkeld en gemaakt door B. van Rooij.

set -uo pipefail
cd "$(dirname "$(readlink -f "$0")")" || exit 1

# --- Opmaak ----------------------------------------------------------------

if [ -t 1 ]; then
  B=$'\033[1m'; DIM=$'\033[2m'; R=$'\033[0m'
  GREEN=$'\033[32m'; RED=$'\033[31m'; YELLOW=$'\033[33m'; BLUE=$'\033[34m'
else
  B=''; DIM=''; R=''; GREEN=''; RED=''; YELLOW=''; BLUE=''
fi

PORT="${PORT:-3000}"
LOGFILE="$(pwd)/start.log"

# Geen kaders met vaste breedte: de kleurcodes en accenttekens tellen niet mee
# in de tekenbreedte, waardoor de rechterrand scheef zou lopen.
kop() {
  printf '\n  %sProject115%s\n' "$B" "$R"
  printf '  %sStudiehub voor ITIL Foundation (Version 5) en ISO/IEC 27001%s\n' "$DIM" "$R"
  printf '  %s────────────────────────────────────────────────────────────%s\n\n' "$BLUE" "$R"
}

stap()  { printf '  %s▸%s %s\n' "$BLUE" "$R" "$1"; }
ok()    { printf '  %s✓%s %s\n' "$GREEN" "$R" "$1"; }
waarschuw() { printf '  %s!%s %s\n' "$YELLOW" "$R" "$1"; }

# Toont een begrijpelijke foutmelding en houdt het venster open, zodat je bij
# dubbelklikken kunt lezen wat er misging.
fout() {
  printf '\n  %s✗ %s%s\n' "$RED" "$1" "$R"
  [ -n "${2:-}" ] && printf '\n  %s\n' "$2"
  printf '\n  %sMeer details staan in: %s%s\n' "$DIM" "$LOGFILE" "$R"
  printf '\n  Druk op Enter om te sluiten.\n'
  read -r _ 2>/dev/null || sleep 30
  exit 1
}

kop
: > "$LOGFILE"

# --- 1. Is Node.js aanwezig? -----------------------------------------------

stap "Controleren of alles geïnstalleerd is..."

if ! command -v node >/dev/null 2>&1; then
  fout "Node.js is niet geïnstalleerd." \
"Project115 heeft Node.js nodig om te draaien.

  Installeren op Debian, Ubuntu of Kali:
      sudo apt update && sudo apt install nodejs npm

  Of download het van:
      https://nodejs.org"
fi

NODE_MAJOR=$(node -v | sed 's/^v//' | cut -d. -f1)

# Node 20 kreeg zijn laatste beveiligingspatch op 30 april 2026. Project115
# draait daarom op 24, de reeks die tot april 2028 onderhouden wordt.
if [ "$NODE_MAJOR" -lt 24 ]; then
  fout "Je Node.js-versie ($(node -v)) is te oud." \
"Project115 heeft versie 24 of nieuwer nodig.

  Bijwerken op Debian, Ubuntu of Kali:
      sudo apt update && sudo apt install nodejs"
fi

ok "Node.js $(node -v) gevonden"

# --- 2. Pakketten installeren ----------------------------------------------

# node_modules/.package-lock.json is de betrouwbaarste indicator dat npm de
# installatie heeft afgerond; alleen de map controleren kan een half afgebroken
# installatie missen.
if [ ! -f node_modules/.package-lock.json ]; then
  stap "Benodigde onderdelen installeren (dit duurt de eerste keer een paar minuten)..."
  if ! npm install --no-audit --no-fund >>"$LOGFILE" 2>&1; then
    fout "Het installeren van de onderdelen is mislukt." \
"Meestal komt dit doordat er geen internetverbinding is.
  Controleer je verbinding en probeer het opnieuw."
  fi
  ok "Onderdelen geïnstalleerd"
else
  ok "Onderdelen al geïnstalleerd"
fi

# --- 3. Beveiligingssleutel ------------------------------------------------

if [ ! -f .env ] || ! grep -qE '^APP_SECRET=.{32,}' .env 2>/dev/null; then
  stap "Beveiligingssleutel aanmaken..."

  if command -v openssl >/dev/null 2>&1; then
    SECRET=$(openssl rand -base64 48 | tr -d '\n')
  else
    # Terugval zonder openssl: node's crypto levert dezelfde kwaliteit.
    SECRET=$(node -e "console.log(require('crypto').randomBytes(48).toString('base64'))")
  fi

  # Bestaande regels behouden, alleen APP_SECRET vervangen of toevoegen.
  if [ -f .env ]; then
    grep -v '^APP_SECRET=' .env > .env.tmp 2>/dev/null || true
    mv .env.tmp .env
  fi
  {
    echo "APP_SECRET=$SECRET"
    grep -qE '^DATABASE_PATH=' .env 2>/dev/null || echo "DATABASE_PATH=./data/project115.db"
  } >> .env
  chmod 600 .env

  ok "Beveiligingssleutel aangemaakt en opgeslagen"
else
  ok "Beveiligingssleutel aanwezig"
fi

set -a
# shellcheck disable=SC1091
. ./.env
set +a
export DATABASE_PATH="${DATABASE_PATH:-./data/project115.db}"

# --- 4. Database en vragenbank ---------------------------------------------

NIEUWE_INSTALLATIE=0
if [ ! -f "$DATABASE_PATH" ]; then
  NIEUWE_INSTALLATIE=1
  stap "Database aanmaken..."
else
  stap "Database bijwerken..."
fi

if ! npm run db:migrate >>"$LOGFILE" 2>&1; then
  fout "De database kon niet worden aangemaakt." \
"Controleer of je schrijfrechten hebt in deze map."
fi

if ! npm run db:seed >>"$LOGFILE" 2>&1; then
  fout "De vragenbank kon niet worden geladen." \
"Er zit mogelijk een fout in de vragen. Kijk in het logbestand voor details."
fi

VRAGEN=$(node -e "
try {
  const D=require('better-sqlite3');
  const db=new D(process.env.DATABASE_PATH,{readonly:true});
  console.log(db.prepare('SELECT count(*) c FROM questions').get().c);
} catch(e){ console.log('?'); }
" 2>/dev/null)

ok "Vragenbank geladen ($VRAGEN vragen)"

# --- 5. Programma klaarmaken -----------------------------------------------

# De build wordt opnieuw gemaakt als hij ontbreekt of ouder is dan de broncode.
BUILD_NODIG=0
if [ ! -d .next/standalone ] && [ ! -f .next/BUILD_ID ]; then
  BUILD_NODIG=1
elif [ -n "$(find src content -newer .next/BUILD_ID -name '*.ts' -o -newer .next/BUILD_ID -name '*.tsx' 2>/dev/null | head -1)" ]; then
  BUILD_NODIG=1
fi

if [ "$BUILD_NODIG" -eq 1 ]; then
  stap "Programma klaarmaken (dit duurt even)..."
  if ! npm run build >>"$LOGFILE" 2>&1; then
    fout "Het programma kon niet worden klaargemaakt." \
"Kijk in het logbestand voor de technische details."
  fi
  ok "Programma klaar"
else
  ok "Programma al klaar"
fi

# --- 6. Vrije poort zoeken -------------------------------------------------

poort_bezet() {
  if command -v ss >/dev/null 2>&1; then
    ss -ltn 2>/dev/null | grep -q ":$1 "
  else
    node -e "
      const net=require('net'); const s=net.createServer();
      s.once('error',()=>process.exit(0)); s.once('listening',()=>{s.close();process.exit(1);});
      s.listen($1,'127.0.0.1');
    " 2>/dev/null
  fi
}

OORSPRONKELIJKE_POORT=$PORT
while poort_bezet "$PORT"; do
  PORT=$((PORT + 1))
  if [ "$PORT" -gt $((OORSPRONKELIJKE_POORT + 20)) ]; then
    fout "Er is geen vrije poort gevonden." \
"Sluit andere programma's af en probeer het opnieuw."
  fi
done

[ "$PORT" != "$OORSPRONKELIJKE_POORT" ] && \
  waarschuw "Poort $OORSPRONKELIJKE_POORT was bezet, poort $PORT wordt gebruikt"

export PORT

# --- 7. Starten ------------------------------------------------------------

stap "Studiehub starten..."

npm start >>"$LOGFILE" 2>&1 &
SERVER_PID=$!

afsluiten() {
  printf '\n\n  %sStudiehub wordt afgesloten...%s\n' "$DIM" "$R"
  kill "$SERVER_PID" 2>/dev/null
  wait "$SERVER_PID" 2>/dev/null
  printf '  %sTot ziens.%s\n\n' "$GREEN" "$R"
  exit 0
}
trap afsluiten INT TERM

URL="http://localhost:$PORT"

GEREED=1
for _ in $(seq 1 40); do
  if ! kill -0 "$SERVER_PID" 2>/dev/null; then
    printf '\n'
    tail -15 "$LOGFILE"
    fout "De studiehub kon niet starten." "Zie de melding hierboven."
  fi
  CODE=$(curl -s -m 2 -o /dev/null -w '%{http_code}' "$URL/api/health" 2>/dev/null)
  if [ "$CODE" = "200" ]; then GEREED=0; break; fi
  sleep 1
done

[ "$GEREED" -ne 0 ] && fout "De studiehub reageert niet op tijd." \
"Probeer het opnieuw, of kijk in het logbestand."

ok "Studiehub draait"

# --- 8. Browser openen -----------------------------------------------------

if command -v xdg-open >/dev/null 2>&1; then
  (xdg-open "$URL" >/dev/null 2>&1 &)
elif command -v open >/dev/null 2>&1; then
  (open "$URL" >/dev/null 2>&1 &)
fi

# --- 9. Klaar --------------------------------------------------------------

printf '\n  %s────────────────────────────────────────────────────────────%s\n' "$GREEN" "$R"
printf '  %s%sDe studiehub is klaar voor gebruik%s\n' "$GREEN" "$B" "$R"
printf '  %s────────────────────────────────────────────────────────────%s\n\n' "$GREEN" "$R"

printf '  Open in je browser:  %s%s%s\n\n' "$B" "$URL" "$R"

if [ "$NIEUWE_INSTALLATIE" -eq 1 ]; then
  printf '  %sEerste keer?%s Maak op die pagina je account aan.\n' "$B" "$R"
  printf '  %sKies een wachtwoord van minimaal 12 tekens — een zin die je\n' "$DIM"
  printf '  onthoudt is sterker dan een kort, ingewikkeld wachtwoord.%s\n\n' "$R"
fi

printf '  %sJe gegevens blijven op deze computer en gaan nergens heen.%s\n\n' "$DIM" "$R"
printf '  %sLaat dit venster openstaan zolang je studeert.%s\n' "$DIM" "$R"
printf '  %sAfsluiten: druk op Ctrl+C%s\n\n' "$DIM" "$R"

wait "$SERVER_PID"
