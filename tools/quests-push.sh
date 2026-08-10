#!/bin/bash
# Push quest JSON into a running server and hot-reload it -- no restart.
#
#   tools/quests-push.sh <harness-workdir>      # e.g. /tmp/tc-join-nf-TNBzDT
#
# Questlog reads config/questlog/{quests,chapters} on the SERVER and syncs the
# result to every connected client, so a content change never needs a client
# restart -- only `/questlog reload`. That makes the edit loop seconds instead of
# the ~8 minutes a full harness boot costs.
#
# For the live Modrinth server the same idea applies: SFTP the two folders into
# the server's config/questlog/, then run `questlog reload` in the panel console.
set -euo pipefail

W="${1:?usage: quests-push.sh <harness workdir>}"
SRC="$(cd "$(dirname "$0")/.." && pwd)/overrides/config/questlog"
[ -d "$SRC" ] || { echo "no quests at $SRC (run tools/gen-quests.js)"; exit 1; }

for side in server client; do
  dst="$W/$side/config/questlog"
  [ -d "$W/$side" ] || continue
  mkdir -p "$dst"
  rm -rf "$dst/quests" "$dst/chapters"
  cp -r "$SRC/quests" "$SRC/chapters" "$dst/"
  echo "  -> $dst"
done

# The harness's HOLD loop tails console.in and feeds each line to server stdin.
if [ -f "$W/console.in" ]; then
  echo 'questlog reload' >> "$W/console.in"
  echo "  issued: questlog reload"
else
  echo "  ! no console.in -- run the harness with HOLD=<seconds> to enable reloads"
fi
