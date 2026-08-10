#!/usr/bin/env node
/**
 * Find settings the peer packs deliberately changed, that we still leave alone.
 *
 *   node tools/peer-diff.js <path/to/a/harness/client/config>
 *
 * "Config file shipped by N packs" is worthless as a signal: most packs commit
 * their entire config/ folder, so the file's presence says nothing about whether
 * any value in it was touched. What identifies a deliberate change is agreement
 * on a value that differs from the default.
 *
 * The defaults come from a harness client, which generated them from the exact
 * mod versions we ship -- so a mismatch is a real difference for OUR build, not
 * an artefact of comparing against some other version's defaults.
 *
 * Reports keys where >= MIN peers agree on one value and we have another.
 */
const fs = require('fs');
const path = require('path');

const MINE = process.argv[2];
const MIN = Number(process.env.MIN || 4);
if (!MINE || !fs.existsSync(MINE)) {
  console.error('usage: peer-diff.js <client/config dir from a harness run>');
  process.exit(1);
}
const PEERS = '/tmp/peercfg';

/** Flatten a config file to key -> value. Returns null for formats we skip. */
function parse(file) {
  let text;
  try { text = fs.readFileSync(file, 'utf8'); } catch { return null; }
  if (text.length > 400000) return null;
  const ext = path.extname(file).toLowerCase();
  const out = {};
  if (ext === '.json' || ext === '.json5') {
    let j;
    try { j = JSON.parse(text.replace(/^\s*\/\/.*$/gm, '')); } catch { return null; }
    const walk = (o, pre) => {
      if (o === null || typeof o !== 'object') { out[pre] = JSON.stringify(o); return; }
      if (Array.isArray(o)) { out[pre] = JSON.stringify(o); return; }
      for (const [k, v] of Object.entries(o)) walk(v, pre ? `${pre}.${k}` : k);
    };
    walk(j, '');
    return out;
  }
  // toml / properties / txt: last-seen section prefix + key = value
  let section = '';
  for (const raw of text.split('\n')) {
    const line = raw.trim();
    if (!line || line.startsWith('#') || line.startsWith('//')) continue;
    const sec = line.match(/^\[([^\]]+)\]$/);
    if (sec) { section = sec[1]; continue; }
    const kv = line.match(/^"?([A-Za-z0-9_.\- ']+)"?\s*[=:]\s*(.*)$/);
    if (!kv) continue;
    const key = (section ? section + '.' : '') + kv[1].trim();
    out[key] = kv[2].trim().replace(/,$/, '');
  }
  return out;
}

const packs = fs.readdirSync(PEERS, { withFileTypes: true })
  .filter((e) => e.isDirectory()).map((e) => e.name);

// Every config file any peer ships, relative to config/
const rel = new Set();
for (const p of packs) {
  const base = path.join(PEERS, p, 'overrides/config');
  const walk = (d) => { if (!fs.existsSync(d)) return;
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const q = path.join(d, e.name);
      if (e.isDirectory()) walk(q);
      else rel.add(path.relative(base, q));
    } };
  walk(base);
}

/**
 * Two configs listing the same blacklist in a different order are not a
 * difference, and neither is a longer list that merely contains theirs -- a
 * pack whose Carry On blacklist is a subset of ours has nothing to teach us.
 * Without this, list churn drowned every real setting in the output.
 */
function normalize(v) {
  const s = String(v).trim();
  if (!/^\[.*\]$/s.test(s)) return s;
  const inner = s.slice(1, -1).trim();
  if (!inner) return '[]';
  const parts = inner.split(/,(?![^{]*\})/).map((x) => x.trim().replace(/^["']|["']$/g, ''))
    .filter(Boolean).sort();
  return '[' + parts.join(',') + ']';
}
const isSubsetOfOurs = (theirs, ours) => {
  if (!/^\[.*\]$/s.test(String(ours).trim())) return false;
  const set = new Set(normalize(ours).slice(1, -1).split(',').filter(Boolean));
  return normalize(theirs).slice(1, -1).split(',').filter(Boolean).every((x) => set.has(x));
};
// Values the harness itself sets, so a "difference" is our test rig, not a choice.
const HARNESS = /^voicechat\/|^server\.properties$/;

const findings = [];
for (const f of rel) {
  if (HARNESS.test(f)) continue;
  const mineFile = path.join(MINE, f);
  if (!fs.existsSync(mineFile)) continue;         // we don't run that mod
  const mine = parse(mineFile);
  if (!mine) continue;
  const votes = new Map();                        // key -> value -> [packs]
  for (const p of packs) {
    const theirs = parse(path.join(PEERS, p, 'overrides/config', f));
    if (!theirs) continue;
    for (const [k, v] of Object.entries(theirs)) {
      if (!(k in mine)) continue;                 // key absent for our version
      if (!votes.has(k)) votes.set(k, new Map());
      const m = votes.get(k);
      if (!m.has(v)) m.set(v, []);
      m.get(v).push(p);
    }
  }
  for (const [k, m] of votes) {
    for (const [v, who] of m) {
      if (v === mine[k]) continue;
      if (normalize(v) === normalize(mine[k])) continue;   // same list, different order
      if (isSubsetOfOurs(v, mine[k])) continue;            // their list is contained in ours
      if (who.length < MIN) continue;
      findings.push({ file: f, key: k, ours: mine[k], theirs: v, n: who.length, who });
    }
  }
}

findings.sort((a, b) => b.n - a.n || a.file.localeCompare(b.file));
fs.writeFileSync('/tmp/peerdiff.json', JSON.stringify(findings, null, 1));
console.log(`${packs.length} peers | ${rel.size} config files | ${findings.length} settings where >=${MIN} peers agree against our default\n`);
for (const f of findings.slice(0, 80)) {
  console.log(`  ${String(f.n).padStart(2)}/${packs.length}  ${f.file}`);
  console.log(`        ${f.key}`);
  console.log(`        ours: ${String(f.ours).slice(0, 70)}   ->  peers: ${String(f.theirs).slice(0, 70)}`);
}
