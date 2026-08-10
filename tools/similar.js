#!/usr/bin/env node
/**
 * Rank reference packs by how much their MOD SET overlaps ours.
 *
 *   node tools/similar.js [topN]
 *
 * Raw Jaccard punishes us for size (we ship ~300 mods; most packs ship 80-150),
 * so a 120-mod pack that is a perfect subset of ours would score ~0.4 and rank
 * below a bloated pack that merely happens to be large. What we actually want is
 * "whose curation decisions are closest to ours", so the primary key is
 * containment -- what fraction of THEIR set we also ship -- with Jaccard kept as
 * a tie-breaker and reported so the size effect stays visible.
 *
 * Reads /tmp/packsets.json from scan-sets.js. Writes /tmp/similar.json.
 */
const fs = require('fs');
const path = require('path');

const DATA = JSON.parse(fs.readFileSync(path.join(__dirname, 'mods.json'), 'utf8'));
const sets = JSON.parse(fs.readFileSync('/tmp/packsets.json', 'utf8'));
const meta = JSON.parse(fs.readFileSync('/tmp/slugmeta.json', 'utf8'));
const bySlug = {};
for (const v of Object.values(meta)) bySlug[v.slug] = v;

const ours = new Set(DATA.mods.map((m) => (m.slug || '').toLowerCase()).filter(Boolean));
const TOP = Number(process.argv[2] || 10);

const rows = sets.map((p) => {
  const theirs = new Set(p.slugs.map((s) => s.toLowerCase()));
  let shared = 0;
  for (const s of theirs) if (ours.has(s)) shared++;
  const union = ours.size + theirs.size - shared;
  const containment = theirs.size ? shared / theirs.size : 0;   // precision
  const coverage = ours.size ? shared / ours.size : 0;          // recall
  return {
    pack: p.pack,
    dl: p.dl,
    size: theirs.size,
    shared,
    containment,
    coverage,
    // Harmonic mean. Containment alone crowns any small pack that happens to be
    // a subset of ours -- a 41-mod Create pack scored 76% while sharing 31 mods.
    // F1 only rewards a pack that is both mostly-ours AND covers much of ours,
    // which is what "a pack like this one" actually means.
    f1: containment + coverage ? (2 * containment * coverage) / (containment + coverage) : 0,
    jaccard: union ? shared / union : 0,
    missing: [...theirs].filter((s) => !ours.has(s)),
  };
}).filter((r) => r.size >= 40);      // tiny packs overlap trivially

rows.sort((a, b) => b.f1 - a.f1 || b.shared - a.shared);

console.log(`ours: ${ours.size} mods | ${rows.length} comparable packs\n`);
console.log('  rank  pack                          mods  shared  contain  cover     F1');
rows.slice(0, TOP).forEach((r, i) => {
  console.log(`  ${String(i + 1).padStart(4)}  ${r.pack.padEnd(28)}  ${String(r.size).padStart(4)}`
    + `  ${String(r.shared).padStart(6)}  ${(r.containment * 100).toFixed(0).padStart(6)}%`
    + `  ${(r.coverage * 100).toFixed(0).padStart(5)}%  ${r.f1.toFixed(3).padStart(5)}`);
});

fs.writeFileSync('/tmp/similar.json', JSON.stringify(rows.slice(0, TOP), null, 1));

// What do the closest packs ship that we do not? Frequency across the top N is
// the signal -- one pack's pick is taste, six packs' pick is a convention.
const freq = new Map();
for (const r of rows.slice(0, TOP)) {
  for (const s of r.missing) freq.set(s, (freq.get(s) || 0) + 1);
}
const common = [...freq.entries()].filter(([, n]) => n >= Math.ceil(TOP / 3))
  .sort((a, b) => b[1] - a[1]);
console.log(`\nShipped by >=${Math.ceil(TOP / 3)} of the top ${TOP}, absent from ours:`);
for (const [slug, n] of common.slice(0, 40)) {
  console.log(`  ${String(n).padStart(2)}/${TOP}  ${slug.padEnd(34)} ${(bySlug[slug]?.cats || []).join(',')}`);
}
