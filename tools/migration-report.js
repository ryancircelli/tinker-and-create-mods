#!/usr/bin/env node
/** Diff the Fabric pack against this NeoForge pack and write MIGRATION.md. */
const fs = require('fs');
const F = require('/home/ryanc/dev/tinker-and-create/tools/mods.json');
const N = require('./mods.json');

// Loader plumbing with no meaning on NeoForge — absence is not a functional loss.
const NA = {
  'fabric-api': 'NeoForge provides its own API',
  'forge-config-api-port': 'native on NeoForge',
  'modmenu': 'NeoForge has a built-in mod list',
  'indium': 'Sodium-only rendering shim',
  'fabric-language-kotlin': 'replaced by Kotlin for Forge',
};

const SWAP = {
  'create-fabric': 'Create', 'hephaestus': 'Tinkers Construct (the point of the migration)',
  'create-enchantment-industry-fabric-(create-6)': 'Create: Enchantment Industry',
  'sophisticated-core-(unofficial-fabric-port)': 'Sophisticated Core (official)',
  'sophisticated-backpacks-(unoffical-fabric-port)': 'Sophisticated Backpacks (official)',
  'sophisticated-storage-(unofficial-fabric-port)': 'Sophisticated Storage (official)',
  'sophisticated-storage-in-motion-(unofficial-fabric-port)': 'Sophisticated Storage in Motion (official)',
  'trinkets': 'Curios API', 'farmers-delight-refabricated': "Farmer's Delight (original)",
  'lambdynamiclights': 'Dynamic Lights', 'charmonium': 'AmbientSounds',
  'forgotten-graves': 'Corail Tombstone', 'sodium': 'Embeddium', 'lithium': 'Radium',
  'iris': 'Oculus', 'sodium-extra': 'Embeddium (Rubidium) Extra',
  'moreculling': 'Entity Culling', 'zoomify': 'Just Zoom',
  'presence-footsteps': 'Presence Footsteps (Forge)', 'visuality': 'Visuality (Forge)',
  'lootbeams': 'Loot Beams', 'charm-forked': 'Quark', 'starlight': 'Starlight (Forge)',
  "reeses-sodium-options": 'Embeddium built-in options',
};
const SWAP_SLUGS = new Set(['create', 'tinkers-construct', 'create-enchantment-industry',
  'sophisticated-core', 'sophisticated-backpacks', 'sophisticated-storage',
  'sophisticated-storage-in-motion', 'curios', 'farmers-delight', 'dynamic-lights',
  'ambientsounds', 'corail-tombstone', 'embeddium', 'radium', 'oculus', 'rubidium-extra',
  'entityculling', 'just-zoom', 'presence-footsteps-forge', 'visuality-forge', 'loot-beams',
  'quark', 'starlight-forge']);

const nSlugs = new Set(N.mods.map((m) => m.slug));
const fSlugs = new Set(F.mods.map((m) => m.slug));
const kept = [], swapped = [], lost = [], na = [], gained = [];

for (const m of F.mods) {
  if (nSlugs.has(m.slug)) { kept.push(m); continue; }
  if (NA[m.slug]) { na.push({ ...m, why: NA[m.slug] }); continue; }
  if (SWAP[m.slug]) { swapped.push({ from: m.name, to: SWAP[m.slug] }); continue; }
  lost.push(m);
}
for (const m of N.mods) if (!fSlugs.has(m.slug) && !SWAP_SLUGS.has(m.slug)) gained.push(m);

const L = [];
L.push('# Tinker & Create — Fabric 1.1.5 to NeoForge 2.0.0');
L.push('');
L.push('**Minecraft 1.20.1 / NeoForge 47.1.106** — the only target where Tinkers Construct exists.');
L.push('It has no 1.21.x build on any loader, so 1.20.1 is forced.');
L.push('');
L.push('Resolution accepts `neoforge` **and** `forge` tags. NeoForge 47.x on 1.20.1 is a Forge fork');
L.push('and loads Forge mods — Simply NeoForged, a production NeoForge pack, ships Forge-tagged mods.');
L.push("Modrinth's loader tags therefore understate what is actually available.");
L.push('');
L.push('| | count |');
L.push('| --- | --- |');
L.push(`| Ported unchanged | **${kept.length}** |`);
L.push(`| Swapped for an equivalent | **${swapped.length}** |`);
L.push(`| Genuinely lost | **${lost.length}** |`);
L.push(`| Not applicable on NeoForge | ${na.length} |`);
L.push(`| Gained | **${gained.length}** |`);
L.push('');
L.push('## Swaps');
L.push('');
L.push('| Fabric | NeoForge |');
L.push('| --- | --- |');
for (const s of swapped) L.push(`| ${s.from} | ${s.to} |`);
L.push('');
L.push('## Losses');
L.push('');
const byCat = {};
for (const m of lost) (byCat[m.category] ||= []).push(m.name);
for (const c of Object.keys(byCat).sort()) L.push(`- **${c}** — ${byCat[c].join(', ')}`);
L.push('');
L.push('## Not applicable (loader plumbing, not a functional loss)');
L.push('');
for (const m of na) L.push(`- ${m.name} — ${m.why}`);
L.push('');
L.push('## Gains');
L.push('');
for (const g of gained) L.push(`- **${g.name}** (\`${g.slug}\`) — ${g.category}`);
L.push('');

fs.writeFileSync(require('path').join(__dirname, '..', 'MIGRATION.md'), L.join('\n'));
console.log(`kept ${kept.length} | swapped ${swapped.length} | lost ${lost.length} | na ${na.length} | gained ${gained.length}`);
console.log('\nLOSSES:');
for (const m of lost) console.log('  ' + m.category.padEnd(20) + m.name);
console.log('\nGAINS:');
for (const g of gained) console.log('  ' + g.category.padEnd(20) + g.name);
