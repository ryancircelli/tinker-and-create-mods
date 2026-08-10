#!/usr/bin/env node
/**
 * Bundle the server's AutoModpack certificate fingerprint into the pack, so
 * players never see the "Certificate Verification / paste the full fingerprint"
 * prompt on first join.
 *
 *   node tools/pin-fingerprint.js <hostname> [<hostname>...]
 *
 * AutoModpack trusts a server by writing automodpack/.private/automodpack-known-hosts.json
 * as { "hosts": { "<hostname>": "<sha256>" } }, keyed by the address the PLAYER
 * TYPED -- so every address players might use needs its own entry (the playit
 * hostname and a custom domain are different keys even for the same server).
 *
 * Shipping this in overrides/ is the "ask your server operator" step done ahead
 * of time. It is only as trustworthy as the channel you ship the pack over: a
 * pinned fingerprint in a tampered pack pins the attacker instead. Fine for
 * handing a pack to friends; do not treat it as a substitute for verification
 * if the pack is distributed publicly.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const LOG = path.join(ROOT, 'server', 'logs', 'latest.log');
const OUT = path.join(ROOT, 'overrides', 'automodpack', '.private', 'automodpack-known-hosts.json');

const hosts = process.argv.slice(2);
if (!hosts.length) {
  console.error('Usage: node tools/pin-fingerprint.js <hostname> [<hostname>...]');
  console.error('  e.g. node tools/pin-fingerprint.js mc.example.com play.example.net');
  process.exit(1);
}

if (!fs.existsSync(LOG)) {
  console.error(`No server log at ${LOG}\nStart the server once so AutoModpack generates its certificate.`);
  process.exit(1);
}

// The fingerprint is logged on every boot; take the most recent in case the
// certificate was regenerated (which invalidates any previously pinned value).
const m = fs.readFileSync(LOG, 'utf8').match(/Certificate fingerprint: ([0-9a-f]{64})/g);
if (!m) {
  console.error('No AutoModpack fingerprint in the server log.');
  console.error('Is AutoModpack installed server-side? Re-run: node tools/server.js');
  process.exit(1);
}
const fp = m[m.length - 1].split(' ').pop();

const known = { hosts: Object.fromEntries(hosts.map((h) => [h, fp])) };
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(known, null, 2) + '\n');

console.log(`fingerprint: ${fp}`);
for (const h of hosts) console.log(`  pinned for ${h}`);
console.log(`\nWrote ${path.relative(ROOT, OUT)}`);
console.log('Rebuild to bundle it:  node tools/build.js');
