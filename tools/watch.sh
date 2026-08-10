#!/bin/bash
# Poll a harness run and PRINT STATE EVERY TICK, exiting as soon as there is a
# verdict. The previous approach (`until grep -q ...; do sleep; done`) blocked
# silently for the whole timeout and reported nothing if it was killed -- so a
# stuck run looked identical to a slow one.
#
#   tools/watch.sh <logfile> [max_ticks] [tick_seconds]
LOG="${1:?usage: watch.sh <logfile> [ticks] [secs]}"
TICKS="${2:-20}"
SECS="${3:-20}"

for i in $(seq 1 "$TICKS"); do
  W=$(grep -oE "/tmp/tc-join-nf-[A-Za-z0-9]+" "$LOG" 2>/dev/null | head -1)
  STAGE=$(grep -oE "Server up|Server never reached|driving Multiplayer|JOIN TEST [A-Z]+|Error loading mods" "$LOG" 2>/dev/null | tail -1)
  SHOT=$(ls -t "$W"/shots/*.png 2>/dev/null | head -1 | xargs -r basename)
  JOINS=$(grep -cE "joined the game" "$W"/server/logs/latest.log 2>/dev/null || echo 0)
  ALIVE=$(pgrep -f "[j]ointest.js" >/dev/null && echo yes || echo no)
  printf "  [%02d] stage=%-22s shot=%-22s joins=%s alive=%s\n" \
    "$i" "${STAGE:-installing}" "${SHOT:-none}" "$JOINS" "$ALIVE"

  # Terminal states -> stop immediately
  if grep -qE "JOIN TEST" "$LOG" 2>/dev/null; then
    grep -E "JOIN TEST" "$LOG" | sed 's/^/  >> /'; exit 0
  fi
  if grep -qE "Server never reached|Error loading mods" "$LOG" 2>/dev/null; then
    echo "  >> FAILED early"; exit 1
  fi
  # Client died without a verdict
  if [ "$ALIVE" = "no" ] && [ "$i" -gt 2 ]; then
    echo "  >> harness exited with no verdict"; exit 2
  fi
  sleep "$SECS"
done
echo "  >> still running after $((TICKS*SECS))s"
