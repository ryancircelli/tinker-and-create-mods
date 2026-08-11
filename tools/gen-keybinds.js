#!/usr/bin/env node
/**
 * Resolve conflicting keybinds and emit a Default Options keybindings file.
 *
 *   node tools/gen-keybinds.js <path/to/client/options.txt>
 *
 * With ~217 registered keybinds and essentially only `j` free, there is no way
 * to give every action a unique key. Real packs resolve this by keeping the
 * conventional binding for each key and UNBINDING the losers, leaving players to
 * rebind what they personally use. That is what this does.
 *
 * Modifier-style clashes are deliberately left alone: Create's alt/ctrl "keyinfo"
 * entries and things like ponder-on-W are contextual (menus, held items), so they
 * do not actually fight the movement/sprint binds they share a key with.
 */
const fs = require('fs');
const path = require('path');

const src = process.argv[2];
if (!src || !fs.existsSync(src)) {
  console.error('usage: gen-keybinds.js <options.txt>');
  process.exit(1);
}

// Keys whose sharing is contextual, not a real conflict -- do not touch.
const IGNORE_KEYS = new Set([
  'key.keyboard.left.alt', 'key.keyboard.left.control', 'key.keyboard.left.shift',
  'key.keyboard.right.shift', 'key.keyboard.tab', 'key.keyboard.space',
  'key.keyboard.w', 'key.mouse.left', 'key.mouse.right',
]);

// For each contested key, the ONE binding that keeps it. Everything else on that
// key gets unbound. Choices follow each mod's own convention where one exists.
const WINNER = {
  'key.keyboard.b': 'key_key.sophisticatedbackpacks.open_backpack', // B = backpack, near-universal
  // z is the worst offender in practice: Quark's hotbar switcher, JustZoom,
  // Tinkers' helmet action and Xaero's enlarge-map all claim it out of the box.
  // Zoom wins because it is used constantly and has no alternative gesture.
  'key.keyboard.z': 'key_justzoom.keybinds.keybind.zoom',
  'key.keyboard.c': 'key_key.sophisticatedbackpacks.inventory_interaction',
  'key.keyboard.g': 'key_key.guideme.guide',                        // G = the pack's guidebook
  'key.keyboard.h': 'key_key.hide_icons',
  'key.keyboard.i': 'key_key.tconstruct.leggings_interact',         // Tinkers convention
  'key.keyboard.k': 'key_iris.keybind.toggleShaders',
  'key.keyboard.m': 'key_gui.xaero_open_map',                       // M = map, universal
  'key.keyboard.r': 'key_key.travelertoolbelt.open_toolbelt',
  'key.keyboard.u': 'key_gui.xaero_waypoints_key',
  'key.keyboard.v': 'key_key.voice_chat',                           // V = voice chat convention
  // VeinMiner's hold-to-vein-mine is used mid-swing and has no alternative;
  // Xaero's minimap settings are reachable from the map screen itself.
  'key.keyboard.y': 'key_key.veinminer_client.hold',
  // Iris keeps o for shader selection (its upstream default); VeinMiner's
  // config screen loses -- it is a settings menu, not a play action.
  'key.keyboard.o': 'key_iris.keybind.shaderPackSelection',
  'key.mouse.middle': 'key_key.pickItem',                           // vanilla pick-block wins
  // The quest book must win ]. Xaero also defaults its world-map settings here
  // and was silently taking it, which left the ENTIRE questline unreachable by
  // keyboard -- confirmed in game, ] opened "Xaero's World Map Settings".
  // Xaero's settings remain available from inside the map screen.
  'key.keyboard.right.bracket': 'key_key.boundless.open_quest_book',
};

// A few high-value actions get moved to genuinely free keys instead of unbound.
const REASSIGN = {
  // Displaced from z by zoom; j is the only free letter on a full keyboard.
  'key_key.tconstruct.helmet_interact': 'key.keyboard.j',
  'key_key.curios.open.desc': 'key.keyboard.keypad.6',
  'key_key.corpse.death_history': 'key.keyboard.keypad.7',
  'key_key.toms_storage.open_terminal': 'key.keyboard.keypad.8',
  'key_key.easy_villagers.cycle_trades': 'key.keyboard.keypad.9',
};

const lines = fs.readFileSync(src, 'utf8').split('\n');
const binds = [];
for (const l of lines) {
  if (!l.startsWith('key_')) continue;
  const i = l.indexOf(':');
  binds.push({ name: l.slice(0, i), value: l.slice(i + 1).trim() });
}

// group by key (ignoring modifier suffixes like ":SHIFT")
const byKey = new Map();
for (const b of binds) {
  if (b.value.startsWith('key.keyboard.unknown')) continue;
  const base = b.value.split(':')[0];
  if (!byKey.has(base)) byKey.set(base, []);
  byKey.get(base).push(b);
}

let unbound = 0, moved = 0;
const DEAD = /zume|exposure|dramaticdoors/i;   // mods removed from the pack

// In the pack, but deliberately given NO key at all. TrashSlot is wanted only
// for its inventory slot -- it ships four binds (toggle, toggle_lock, delete,
// delete_all) and its toggle defaults to T, which is chat. Rather than let the
// clash resolver fight over T every time the capture is refreshed, pin all four
// to unknown. The slot itself works by dragging items into it, no key needed.
const FORCE_UNBIND = /^key_key\.trashslot\./i;

// Emitted as unknown even when absent from the capture. Default Options only
// applies the keys listed in keybindings.txt; anything missing keeps the mod's
// own default. TrashSlot was added after this capture was taken, so without
// these four explicit lines its toggle would silently default back to T and
// steal chat again -- the exact reason it was dropped the first time.
const ALWAYS_UNBIND = [
  'key_key.trashslot.toggle',
  'key_key.trashslot.toggle_lock',
  'key_key.trashslot.delete',
  'key_key.trashslot.delete_all',
];
const out = [];
for (const b of binds) {
  let value = b.value;
  if (REASSIGN[b.name]) {
    value = REASSIGN[b.name]; moved++;
  } else {
    const base = b.value.split(':')[0];
    const group = byKey.get(base) || [];
    if (group.length > 1 && !IGNORE_KEYS.has(base) && WINNER[base] && WINNER[base] !== b.name) {
      value = 'key.keyboard.unknown'; unbound++;
    }
  }
  if (DEAD.test(b.name)) continue;
  if (FORCE_UNBIND.test(b.name)) { value = 'key.keyboard.unknown'; unbound++; }
  out.push(`${b.name}:${value}`);
}

for (const name of ALWAYS_UNBIND) {
  if (!out.some((l) => l.startsWith(name + ':'))) {
    out.push(`${name}:key.keyboard.unknown`);
    unbound++;
  }
}

const dest = path.resolve(__dirname, '..', 'overrides/config/defaultoptions/keybindings.txt');
fs.mkdirSync(path.dirname(dest), { recursive: true });
fs.writeFileSync(dest, out.join('\n') + '\n');
console.log(`  ${binds.length} binds | ${unbound} unbound to resolve clashes | ${moved} moved to free keys`);
console.log(`  wrote ${path.relative(process.cwd(), dest)}`);
