#!/usr/bin/env bash
#
# Project115 — stoppen
#
# Sluit de studiehub af als die op de achtergrond is blijven draaien.
# Normaal gesproken stop je met Ctrl+C in het venster waarin je start.sh draaide;
# dit script is voor als dat venster per ongeluk is gesloten.

set -uo pipefail
cd "$(dirname "$(readlink -f "$0")")" || exit 1

if [ -t 1 ]; then
  GREEN=$'\033[32m'; DIM=$'\033[2m'; R=$'\033[0m'
else
  GREEN=''; DIM=''; R=''
fi

GEVONDEN=0

# Zoek processen die op een poort in het gebruikelijke bereik luisteren en van
# deze installatie afkomstig zijn.
for POORT in $(seq 3000 3020); do
  PIDS=$(ss -ltnp 2>/dev/null | grep ":$POORT " | grep -oE 'pid=[0-9]+' | cut -d= -f2 | sort -u)
  for PID in $PIDS; do
    CWD=$(readlink "/proc/$PID/cwd" 2>/dev/null)
    # Alleen stoppen wat echt van deze map komt; nooit andermans server.
    if [ "$CWD" = "$(pwd)" ]; then
      kill "$PID" 2>/dev/null && GEVONDEN=1
      printf '  %s✓%s Studiehub op poort %s gestopt\n' "$GREEN" "$R" "$POORT"
    fi
  done
done

if [ "$GEVONDEN" -eq 0 ]; then
  printf '  %sDe studiehub draaide niet.%s\n' "$DIM" "$R"
fi
