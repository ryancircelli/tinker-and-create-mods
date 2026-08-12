#!/usr/bin/env node
/**
 * Give every Tinkers tool the Levelling Addon's Improvable modifier from the
 * moment it is built, at no cost to the player.
 *
 *   node tools/gen-improvable.js
 *
 * Improvable is what makes a tool gain modifier slots as it is used, so it is
 * the modifier a Tinkers player wants on everything. Out of the box it is an
 * ABILITY modifier -- the addon registers it into
 * data/tconstruct/tinkering/tags/modifiers/abilities/general.json -- so applying
 * it burns an ability slot, the scarcest slot on a tool. The usual outcome is
 * paying that tax on every tool, or forgetting and never levelling at all.
 *
 * A tool definition's `tconstruct:traits` module lists modifiers a tool is born
 * with. Traits are innate: they occupy no slot and cannot be removed, which is
 * exactly "applied, with no impact". So this rewrites the traits module of each
 * tool definition to include Improvable and ships the result as a Paxi
 * datapack.
 *
 * No jar is modified or redistributed. The output is JSON that overrides data
 * files at load time, which also means it respects the mod's licence.
 *
 * It is GENERATED from the exact jar the pack ships -- external-mods/, pinned to
 * a GitHub release -- rather than hand-copied, so it cannot silently drift from
 * the Tinkers version in use. A datapack that overrides a data file freezes that
 * file, so if Tinkers is ever bumped, re-run this and the overrides move with
 * it.
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const MODIFIER = 'tinkerslevellingaddon:improvable';
const OUT = path.join(
  ROOT,
  'overrides/config/paxi/datapacks/tinker_create_tweaks/data/tconstruct/tinkering/tool_definitions'
);

const jar = fs.readdirSync(path.join(ROOT, 'external-mods'))
  .filter((f) => /^TinkersConstruct-.*\.jar$/.test(f)).sort().pop();
if (!jar) {
  console.error('  no TinkersConstruct jar in external-mods/ -- run tools/build.js first');
  process.exit(1);
}
const jarPath = path.join(ROOT, 'external-mods', jar);
console.log('  source: ' + jar);

const list = execSync(`unzip -Z1 ${JSON.stringify(jarPath)} 'data/tconstruct/tinkering/tool_definitions/*.json'`)
  .toString().split('\n').filter(Boolean);

fs.mkdirSync(OUT, { recursive: true });
// Clear stale output first, so a tool removed upstream cannot linger as an
// override of a file that no longer exists.
for (const f of fs.readdirSync(OUT)) if (f.endsWith('.json')) fs.rmSync(path.join(OUT, f));

let written = 0, added = 0, already = 0;
for (const entry of list) {
  const def = JSON.parse(execSync(`unzip -p ${JSON.stringify(jarPath)} ${JSON.stringify(entry)}`).toString());
  if (!Array.isArray(def.modules)) continue;

  const mod = def.modules.find((m) => m && m.type === 'tconstruct:traits');
  if (mod) {
    if (!Array.isArray(mod.traits)) mod.traits = [];
    if (mod.traits.some((t) => t && t.name === MODIFIER)) { already++; continue; }
    mod.traits.push({ level: 1, name: MODIFIER });
  } else {
    // Some definitions carry no innate traits at all; give them the module.
    def.modules.push({ type: 'tconstruct:traits', traits: [{ level: 1, name: MODIFIER }] });
  }
  added++;
  fs.writeFileSync(path.join(OUT, path.basename(entry)), JSON.stringify(def, null, 2) + '\n');
  written++;
}

console.log(`  definitions ${list.length}  written ${written}  trait added ${added}  already had it ${already}`);
console.log('  -> ' + path.relative(ROOT, OUT));
