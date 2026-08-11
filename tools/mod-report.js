#!/usr/bin/env node
/**
 * Full account of every mod touched across the project: shipped, swapped, or
 * rejected — with the actual reason in each case.
 *
 * Libraries and performance mods are excluded: they are plumbing, mostly
 * auto-resolved as dependencies, and not decisions the pack owner makes.
 *
 *   node tools/mod-report.js > docs/dev/mod-decisions.md
 */

const fs = require('fs');
const path = require('path');

const HERE = path.join(__dirname, 'mods.json');
const FABRIC = '/home/ryanc/dev/archive/tinker-and-create-fabric-1.20.1/tools/mods.json';

const load = (p) => { try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch { return null; } };
const cur = load(HERE);
const fab = load(FABRIC);

const EXCLUDE_CAT = /^(Libraries|Performance|Dependency)$/i;
// Library/perf slugs that appear in reject lists without a category attached.
const EXCLUDE_SLUG = /lib$|^lib|library|api$|kotlin|konkrete|melody|prickle|bookshelf|resourceful|iceberg|owo|mru|txni|coroutil|architectury|balm|puzzles|cloth|geckolib|azurelib|searchables|fzzy|supermartijn|shetiphian|midnight|platform|collective|creativecore|connector|forgified|terrablender|baguette|rpl|jamlib|moonlight|sodium|lithium|radium|embeddium|starlight|canary|ferrite|modernfix|immediatelyfast|entityculling|noisium|servercore|vmp|smooth-boot|badoptimizations|faster-random|memoryleakfix|krypton|debugify|language-reload|ebe|indium|fabric-api|forge-config|modmenu|qsl|fabric-language/i;

const skip = (slug, cat) => (cat && EXCLUDE_CAT.test(cat)) || EXCLUDE_SLUG.test(slug || '');

const out = [];
out.push('# Tinker & Create — every mod, and what happened to it\n');
out.push('Target: **MC 1.21.1 / NeoForge 21.1.248**. Libraries and performance mods are omitted —');
out.push('they are dependency plumbing rather than content decisions.\n');

// ---- shipped -------------------------------------------------------------
const byCat = {};
for (const m of cur.mods) {
  if (skip(m.slug, m.category)) continue;
  (byCat[m.category] ||= []).push(m);
}
const total = Object.values(byCat).reduce((n, a) => n + a.length, 0);
out.push(`\n## Included (${total})\n`);
for (const cat of Object.keys(byCat).sort()) {
  out.push(`\n### ${cat} (${byCat[cat].length})\n`);
  for (const m of byCat[cat].sort((a, b) => a.name.localeCompare(b.name))) {
    const note = m['//revived'] ? `  — *revived:* ${m['//revived']}`
      : m['//version'] ? `  — *pinned ${m.version}:* ${m['//version']}` : '';
    out.push(`- **${m.name}** \`${m.slug}\`${note}`);
  }
}

// ---- swaps ---------------------------------------------------------------
const swaps = [];
for (const r of cur.removed || []) {
  const m = /Swapped for ([A-Za-z0-9'&: .-]+?)[.(]/.exec(r.reason || '');
  if (m) swaps.push({ from: r.name, to: m[1].trim(), why: r.reason });
}
// Loader-migration swaps are recorded in MIGRATION.md rather than mods.json.
const MIGRATION_SWAPS = [
  ['Hephaestus', 'Tinkers Construct', 'Fabric port replaced by the official mod on Forge/NeoForge (then lost entirely on 1.21 — see TODO.md)'],
  ['Trinkets', 'Curios API', 'Fabric accessory API has no Forge equivalent; Curios is the standard'],
  ["Farmer's Delight Refabricated", "Farmer's Delight", 'unofficial Fabric port replaced by the original'],
  ['Sophisticated Backpacks/Storage (Fabric ports)', 'official Sophisticated mods', 'unofficial ports replaced by upstream'],
  ['Charm Forked', 'Quark', 'Fabric kitchen-sink replaced by the Forge equivalent'],
  ['Charmonium', 'AmbientSounds', 'Fabric-only ambience replaced'],
  ['Forgotten Graves', 'Corail Tombstone → Corpse', 'two hops: loader swap, then simplified again on 1.21'],
  ['Embeddium', 'Sodium + Iris', 'Embeddium conflicts with Veil and Iris on 1.21.1; Sodium is native there'],
];
out.push(`\n## Swapped (${swaps.length + MIGRATION_SWAPS.length})\n`);
out.push('| Replaced | With | Why |');
out.push('| --- | --- | --- |');
for (const [f, t, w] of MIGRATION_SWAPS) out.push(`| ${f} | ${t} | ${w} |`);
for (const s of swaps) out.push(`| ${s.from} | ${s.to} | ${s.why.replace(/\|/g, '/')} |`);

// ---- rejected ------------------------------------------------------------
const seen = new Set(swaps.map((s) => s.from));
const rej = [];
for (const src of [cur, fab]) {
  if (!src) continue;
  for (const list of [src.banned || [], src.removed || []]) {
    for (const r of list) {
      const name = r.name || r.slug;
      if (seen.has(name) || seen.has(r.slug)) continue;
      if (skip(r.slug, null)) continue;
      if (rej.some((x) => x.slug === r.slug)) continue;
      rej.push({ name, slug: r.slug, reason: (r.reason || '').replace(/\s+/g, ' ') });
    }
  }
}
out.push(`\n## Rejected (${rej.length})\n`);
for (const r of rej.sort((a, b) => a.name.localeCompare(b.name))) {
  out.push(`- **${r.name}** \`${r.slug}\`\n  ${r.reason}`);
}

out.push('\n---\n');
out.push(`Included ${total} · swapped ${swaps.length + MIGRATION_SWAPS.length} · rejected ${rej.length}`);
out.push('\nEvery rejection above was recorded from an actual failure — a loader error, a mixin');
out.push('that found no target, a declared incompatibility, or an unsatisfiable version range —');
out.push('not from guesswork.\n');

console.log(out.join('\n'));
