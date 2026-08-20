#!/usr/bin/env node
/**
 * Thin out modded structures, and delete a few outright.
 *
 * Reads every structure_set the pack's mods ship and writes overrides into the
 * Paxi datapack. Two things happen:
 *
 *   - spacing and separation are multiplied by FACTOR. Density falls with the
 *     SQUARE of spacing, so the default 2 leaves about a quarter as many
 *     structures. Both fields scale together so the ratio, and hence the
 *     minimum gap the generator enforces, is preserved.
 *
 *   - sets in DROP_SETS are emitted with an empty structures list, which is how
 *     a datapack disables a set; structures in DROP_STRUCTURES are filtered out
 *     of sets that carry other structures too, so the rest survive.
 *
 * Vanilla (minecraft:) sets are deliberately untouched. The density problem is
 * the 200-odd sets the mods add; halving villages and temples as well would
 * change the base game rather than the pack.
 *
 * Worldgen only applies to chunks generated AFTER it loads. Existing terrain
 * keeps whatever it already has.
 *
 *   node tools/gen-structures.js [--factor 2] [--mods <dir>]
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'overrides/config/paxi/datapacks/tinker_create_tweaks/data');

const argv = process.argv.slice(2);
const arg = (name, dflt) => {
  const i = argv.indexOf(`--${name}`);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : dflt;
};
const FACTOR = Number(arg('factor', 2));
const MODS = arg('mods', '/mnt/c/Users/ryanr/AppData/Roaming/ModrinthApp/profiles/Tinker & Create/mods');

// Airborne decoration. Tinkers' sky islands are NOT here: they are the only
// source of sky slime, so removing them would cut off slimesteel and the whole
// sky-slime branch of the questline.
const DROP_SETS = new Set([
  'create_structures_arise:createairdrop',
  'create_structures_arise:createminiskyvillage',
  'create_structures_arise:pillagersteampunkairship',
  // the giant stone spires
  'create_structures_arise:crimsite_tower',
  'create_structures_arise:towerofochrum',
]);

// Left at their stock density. These carry the only sky/ender/ichor slime in the
// game, so thinning them out would work against the decision to keep the sky
// islands: the point of keeping them is that the progression stays findable.
const KEEP_DENSITY = new Set([
  'tconstruct:overworld_sky_island',
  'tconstruct:overworld_ocean_island',
  'tconstruct:end_sky_island',
  'tconstruct:nether_ocean_island',
]);

// Structures that share a set with others, so the set is rewritten without them.
const DROP_STRUCTURES = new Set(['dungeons_arise:small_blimp']);

const jars = fs.readdirSync(MODS).filter((f) => f.endsWith('.jar'));
let written = 0, dropped = 0, filtered = 0, scaled = 0;

for (const jar of jars) {
  const full = path.join(MODS, jar);
  let listing;
  try {
    listing = execSync(`unzip -Z1 ${JSON.stringify(full)} 'data/*/worldgen/structure_set/*.json' 2>/dev/null`)
      .toString().split('\n').filter(Boolean);
  } catch { continue; }

  for (const entry of listing) {
    const m = entry.match(/^data\/([^/]+)\/worldgen\/structure_set\/(.+)\.json$/);
    if (!m) continue;
    const [, ns, name] = m;
    if (ns === 'minecraft') continue;
    const id = `${ns}:${name}`;

    let data;
    try { data = JSON.parse(execSync(`unzip -p ${JSON.stringify(full)} ${JSON.stringify(entry)}`).toString()); }
    catch { continue; }

    let changed = false;
    if (DROP_SETS.has(id)) {
      data.structures = [];
      dropped++; changed = true;
    } else {
      const before = (data.structures || []).length;
      data.structures = (data.structures || []).filter((s) => !DROP_STRUCTURES.has(s.structure));
      if (data.structures.length !== before) { filtered++; changed = true; }

      const p = data.placement || {};
      if (!KEEP_DENSITY.has(id) && typeof p.spacing === 'number' && typeof p.separation === 'number') {
        p.spacing = Math.round(p.spacing * FACTOR);
        // separation must stay below spacing or the generator rejects the set
        p.separation = Math.min(Math.round(p.separation * FACTOR), p.spacing - 1);
        scaled++; changed = true;
      }
    }
    if (!changed) continue;

    const dest = path.join(OUT, ns, 'worldgen/structure_set', `${name}.json`);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, JSON.stringify(data, null, 2) + '\n');
    written++;
  }
}

console.log(`  factor ${FACTOR}x  |  ${written} sets written`);
console.log(`  ${scaled} rescaled, ${dropped} emptied, ${filtered} had a structure removed`);
console.log(`  -> ${path.relative(ROOT, OUT)}/<namespace>/worldgen/structure_set/`);
