#!/usr/bin/env node
/**
 * SUPERSEDED -- do not run. Kept as the record of the advancement-based design.
 *
 * The pack's guided progression is now Questlog (tools/gen-quests.js). Running
 * this would recreate a second, competing walkthrough alongside the quests, so
 * it refuses to execute. The original implementation is left intact below --
 * it still documents the 1.21.1 advancement quirks (singular advancement/
 * directory, {"id":...} icons, pack_format 48) if that line is ever revived.
 */
console.error('gen-advancements.js is superseded by gen-quests.js; refusing to run.');
process.exit(1);

/**
 * Generate the guided-walkthrough advancement datapack.
 *
 *   node tools/gen-advancements.js
 *
 * Six tabs (one root each -- a root with a `background` is what creates a tab).
 * Progressive WITHIN a tab, independent BETWEEN tabs, so a player can start
 * Create without finishing Tinkers.
 *
 * "Getting Started" is a hub: its final advancement requires the entry item of
 * every other tab, so nothing can be skipped -- notably Time in a Bottle, which
 * is easy to never discover but is the main pre-automation quality-of-life item.
 *
 * 1.21.1 specifics that differ from older snippets found online:
 *   - directory is `advancement/` (singular), not `advancements/`
 *   - display icon is {"id": "..."}, not {"item": "..."}
 *   - inventory_changed takes a list of ItemPredicates: {"items":[{"items":[id]}]}
 */
const fs = require('fs');
const path = require('path');

const NS = 'tcguide';
const ROOT = path.resolve(__dirname, '..',
  'overrides/config/paxi/datapacks/tinker_create_guide/data', NS, 'advancement');

const has = (...ids) => ({
  trigger: 'minecraft:inventory_changed',
  conditions: { items: [{ items: ids }] },
});

/** One advancement file. `crit` maps name -> trigger object. */
function adv(file, { parent, icon, title, desc, frame = 'task', crit, background, hidden }) {
  const display = {
    icon: { id: icon },
    title: { text: title },
    description: { text: desc },
    frame,
    show_toast: true,
    announce_to_chat: true,
  };
  if (background) display.background = background;
  if (hidden) display.hidden = true;
  const body = { display, criteria: crit, requirements: [Object.keys(crit)] };
  if (parent) body.parent = `${NS}:${parent}`;
  const out = path.join(ROOT, `${file}.json`);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, JSON.stringify(body, null, 2) + '\n');
  return `${NS}:${file}`;
}

// ---------------------------------------------------------------- TINKERS ---
adv('tinkers/root', {
  icon: 'tconstruct:seared_brick', title: "Tinkers' Construct",
  desc: 'Smelt, cast, and build tools that grow with you',
  background: 'minecraft:textures/block/bricks.png',
  crit: { seared: has('tconstruct:seared_brick', 'tconstruct:pattern') },
});
adv('tinkers/station', {
  parent: 'tinkers/root', icon: 'tconstruct:tinker_station',
  title: 'A Place to Work', desc: 'Craft a Tinker Station and a Part Builder',
  crit: { station: has('tconstruct:tinker_station', 'tconstruct:part_builder') },
});
adv('tinkers/first_tool', {
  parent: 'tinkers/station', icon: 'tconstruct:pickaxe',
  title: 'Built, Not Bought', desc: 'Assemble your first Tinkers tool from parts',
  crit: { tool: has('tconstruct:pickaxe') },
});
adv('tinkers/melter', {
  parent: 'tinkers/station', icon: 'tconstruct:seared_melter',
  title: 'Getting Molten', desc: 'Build a Seared Melter to liquify metal',
  crit: { melter: has('tconstruct:seared_melter') },
});
adv('tinkers/smeltery', {
  parent: 'tinkers/melter', icon: 'tconstruct:smeltery_controller', frame: 'goal',
  title: 'The Smeltery', desc: 'Build a Smeltery Controller — alloys await',
  crit: { ctrl: has('tconstruct:smeltery_controller') },
});
adv('tinkers/heart', {
  parent: 'tinkers/first_tool', icon: 'bhc:red_heart_canister', frame: 'goal',
  title: 'More To Give', desc: 'Craft a Heart Canister for extra health',
  crit: { heart: has('bhc:red_heart_canister', 'bhc:red_heart') },
});

// ------------------------------------------------------------ TIME/GROWTH ---
adv('time/root', {
  icon: 'tiab:time_in_a_bottle', title: 'Time & Growth',
  desc: 'Skip the waiting — grow, smelt and process faster',
  background: 'minecraft:textures/block/amethyst_block.png',
  crit: { bottle: has('tiab:time_in_a_bottle') },
});
adv('time/accelerate', {
  parent: 'time/root', icon: 'minecraft:oak_sapling',
  title: 'Fast Forward', desc: 'Use Time in a Bottle on a sapling, crop or furnace',
  crit: { bottle: has('tiab:time_in_a_bottle') },
});
adv('time/harvest', {
  parent: 'time/root', icon: 'minecraft:wheat',
  title: 'Right-Click Farming', desc: 'Harvest a mature crop by hand — it replants itself',
  crit: { crop: has('minecraft:wheat', 'minecraft:carrot', 'minecraft:potato') },
});
adv('time/cooking', {
  parent: 'time/harvest', icon: 'farmersdelight:cooking_pot', frame: 'goal',
  title: 'Something Cooking', desc: "Craft a Cooking Pot and start real meals",
  crit: { pot: has('farmersdelight:cooking_pot', 'farmersdelight:skillet') },
});

// --------------------------------------------------------------- CARRYING ---
adv('carry/root', {
  icon: 'sophisticatedbackpacks:backpack', title: 'Carrying Capacity',
  desc: 'Storage, backpacks and trinket slots',
  background: 'minecraft:textures/block/barrel_side.png',
  crit: { pack: has('sophisticatedbackpacks:backpack') },
});
adv('carry/upgrade', {
  parent: 'carry/root', icon: 'sophisticatedbackpacks:copper_backpack',
  title: 'Room to Grow', desc: 'Upgrade your backpack to a larger tier',
  crit: { up: has('sophisticatedbackpacks:copper_backpack', 'sophisticatedbackpacks:iron_backpack', 'sophisticatedbackpacks:gold_backpack') },
});
adv('carry/curios', {
  parent: 'carry/root', icon: 'minecraft:amethyst_shard',
  title: 'Pockets Beyond Pockets', desc: 'Equip something in a Curios slot',
  crit: { slot: has('bhc:red_heart_canister', 'minecraft:elytra') },
});
adv('carry/drawers', {
  parent: 'carry/root', icon: 'minecraft:barrel',
  title: 'Sorted', desc: 'Place a drawer or Sophisticated Storage barrel',
  crit: { store: has('storagedrawers:acacia_full_drawers_1', 'storagedrawers:spruce_full_drawers_1', 'sophisticatedstorage:barrel', 'minecraft:barrel') },
});
adv('carry/ender', {
  parent: 'carry/drawers', icon: 'minecraft:ender_chest', frame: 'goal',
  title: 'Somewhere Else', desc: 'Craft an Ender Chest — storage at a distance',
  crit: { ender: has('minecraft:ender_chest', 'enderchests:ender_bag') },
});

// ----------------------------------------------------------------- CREATE ---
adv('create/root', {
  icon: 'create:cogwheel', title: 'Create',
  desc: 'Rotational power, contraptions and automation',
  background: 'minecraft:textures/block/andesite.png',
  crit: { cog: has('create:cogwheel', 'create:shaft') },
});
adv('create/goggles', {
  parent: 'create/root', icon: 'create:goggles',
  title: 'Seeing Stress', desc: 'Craft Engineer’s Goggles to read your network',
  crit: { goggles: has('create:goggles') },
});
adv('create/wheel', {
  parent: 'create/root', icon: 'create:water_wheel',
  title: 'First Power', desc: 'Place a Water Wheel and generate rotation',
  crit: { wheel: has('create:water_wheel', 'create:large_water_wheel') },
});
adv('create/press', {
  parent: 'create/wheel', icon: 'create:mechanical_press', frame: 'goal',
  title: 'Automated At Last', desc: 'Run a Mechanical Press from your power source',
  crit: { press: has('create:mechanical_press') },
});
adv('create/contraption', {
  parent: 'create/press', icon: 'create:mechanical_piston', frame: 'challenge',
  title: 'It Moves', desc: 'Assemble a moving contraption',
  crit: { piston: has('create:mechanical_piston', 'create:rope_pulley', 'create:mechanical_bearing') },
});

// -------------------------------------------------------------- EXPLORING ---
adv('explore/root', {
  icon: 'minecraft:filled_map', title: 'Exploration',
  desc: 'Find biomes, structures and trouble',
  background: 'minecraft:textures/block/mossy_cobblestone.png',
  crit: { map: has('minecraft:filled_map', 'minecraft:compass') },
});
adv('explore/compass', {
  parent: 'explore/root', icon: 'naturescompass:naturescompass',
  title: 'Which Way?', desc: "Craft Nature's or Explorer's Compass",
  crit: { c: has('naturescompass:naturescompass', 'explorerscompass:explorerscompass') },
});
adv('explore/structure', {
  parent: 'explore/compass', icon: 'minecraft:iron_pickaxe', frame: 'goal',
  title: 'Somebody Was Here', desc: 'Find a generated structure worth looting',
  crit: { loot: has('minecraft:gold_ingot', 'minecraft:emerald', 'minecraft:diamond') },
});

// --------------------------------------------------------- GETTING STARTED --
// Hub tab. Each child mirrors another tab's ENTRY item, so finishing this tab
// is impossible without at least touching every system in the pack.
adv('start/root', {
  icon: 'minecraft:crafting_table', title: 'Getting Started',
  desc: 'A guided tour of the pack — visit every system',
  background: 'minecraft:textures/block/dirt.png',
  crit: { log: has('minecraft:oak_log', 'minecraft:birch_log', 'minecraft:spruce_log') },
});
adv('start/see', {
  parent: 'start/root', icon: 'minecraft:spyglass',
  title: 'Know What You Look At', desc: 'Jade names blocks; EMI shows recipes. Open EMI and search',
  crit: { book: has('minecraft:book', 'minecraft:crafting_table') },
});
adv('start/carry_on', {
  parent: 'start/root', icon: 'minecraft:chest',
  title: 'Pick It Up', desc: 'Carry On lets you move a full chest without emptying it',
  crit: { chest: has('minecraft:chest') },
});
// --- gates into each tab (entry items) ---
adv('start/gate_tinkers', {
  parent: 'start/see', icon: 'tconstruct:seared_brick',
  title: 'Tour: Tinkers', desc: 'Obtain a Seared Brick — see the Tinkers tab',
  crit: { e: has('tconstruct:seared_brick', 'tconstruct:pattern') },
});
adv('start/gate_time', {
  parent: 'start/see', icon: 'tiab:time_in_a_bottle',
  title: 'Tour: Time in a Bottle', desc: 'Craft Time in a Bottle — it stores time as you play, then fast-forwards a block',
  crit: { e: has('tiab:time_in_a_bottle') },
});
adv('start/gate_carry', {
  parent: 'start/carry_on', icon: 'sophisticatedbackpacks:backpack',
  title: 'Tour: Backpacks', desc: 'Craft a Backpack — see the Carrying Capacity tab',
  crit: { e: has('sophisticatedbackpacks:backpack') },
});
adv('start/gate_create', {
  parent: 'start/carry_on', icon: 'create:cogwheel',
  title: 'Tour: Create', desc: 'Craft a Cogwheel — see the Create tab',
  crit: { e: has('create:cogwheel', 'create:shaft') },
});
adv('start/gate_explore', {
  parent: 'start/see', icon: 'minecraft:compass',
  title: 'Tour: Exploration', desc: 'Craft a Compass — see the Exploration tab',
  crit: { e: has('minecraft:compass', 'minecraft:filled_map') },
});
// Final: requires ALL five gates. Multiple requirement groups = AND.
{
  const crit = {
    tinkers: has('tconstruct:seared_brick', 'tconstruct:pattern'),
    time: has('tiab:time_in_a_bottle'),
    carry: has('sophisticatedbackpacks:backpack'),
    create: has('create:cogwheel', 'create:shaft'),
    explore: has('minecraft:compass', 'minecraft:filled_map'),
  };
  const body = {
    parent: `${NS}:start/gate_time`,
    display: {
      icon: { id: 'create:mechanical_press' },
      title: { text: 'Ready to Automate' },
      description: { text: 'You have touched every system — now go build something' },
      frame: 'challenge', show_toast: true, announce_to_chat: true,
    },
    criteria: crit,
    // one group per criterion => ALL must be met
    requirements: Object.keys(crit).map((k) => [k]),
  };
  fs.writeFileSync(path.join(ROOT, 'start/ready.json'), JSON.stringify(body, null, 2) + '\n');
}

const files = fs.readdirSync(ROOT, { recursive: true }).filter((f) => String(f).endsWith('.json'));
console.log(`  wrote ${files.length} advancements under ${path.relative(process.cwd(), ROOT)}`);
