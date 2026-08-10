#!/usr/bin/env node
/**
 * Generate the Questlog quest tree for the pack.
 *
 *   node tools/gen-quests.js
 *
 * Replaces the hand-rolled advancement datapack. Advancements could only say
 * "you now hold X" -- they have no notion of ordering, no reward, and no place
 * to explain WHY a player should care. Questlog gives us requirement chains,
 * rewards, fail states and a readable description panel, which is what a
 * walkthrough actually needs.
 *
 * Schema notes verified against questlog-neoforge-1.21.1-3.3.2.jar, because the
 * published docs disagree with the code in two places:
 *   - the experience reward field is `levels` (plural); the docs say `level`
 *   - `prerequisites` is a legacy alias, `requirements` is the current key
 * Both were read out of Quest.create / ExperienceReward bytecode.
 *
 * Files land in config/questlog/{chapters,quests}. A quest's id comes from its
 * path under quests/, always in the `questlog` namespace -- so
 * quests/tinkers/smeltery.json is `questlog:tinkers/smeltery`, NOT our own
 * namespace. Every cross-reference below relies on that.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', 'overrides/config/questlog');
const NS = 'questlog';
const qid = (p) => `${NS}:${p}`;

const chapters = [];
const quests = [];

function chapter(id, { name, icon, order, main = false, hidden = false }) {
  chapters.push({ id, body: { name, translatable: false, icon: { item: icon }, order, default_chapter: main, hidden } });
}

// Questlog has no scale of its own -- there is no font or zoom setting anywhere
// in its config or its ~60 per-quest display keys -- so the only lever for
// fitting more text is panel size, measured in GUI-scale units.
//
// That makes WIDTH nearly untouchable: at GUI Scale 4 a 1080p screen is just
// 480 units across and the stock 275+170 already uses 445 of them. Widening
// would clip for anyone on scale 4, and the pack must not dictate a global
// GUI Scale to work around that -- it affects every screen in the game, not
// just this one.
//
// HEIGHT is where the room actually is: 166 of the ~270 available units, with
// only the button row below it. Raising it to 200 buys roughly 20% more visible
// description at every GUI scale, and clips at none.
const PANEL = { panel_height: 200 };

/**
 * One quest.
 *
 * `after` records the intended reading order but deliberately does NOT gate the
 * quest. Questlog hides any quest whose requirements are unmet -- there is no
 * greyed-out state -- so chaining requirements meant a chapter showed exactly
 * one quest at a time and the player could never see what was coming. Order is
 * carried by `sort_order` and by the forward links in each description instead.
 */
function quest(id, {
  chapter: ch, title, desc, descDone, icon, order = 0,
  after = [], requirements = [], objectives = [], failures = [], rewards = [],
  toastUnlock = false, toastComplete = true, popup = false, includeInMain = false,
}) {
  const reqs = [...requirements];
  const body = {
    title,
    description: desc,
    icon: typeof icon === 'string' ? { item: icon } : icon,
    chapter: qid(ch),
    sort_order: order,
    // Every quest is unlocked from the start now, so unlock toasts would fire
    // 27 times on first join. Only the welcome quest announces itself.
    toast_on_unlock: toastUnlock,
    toast_on_complete: toastComplete,
    ...PANEL,
  };
  if (descDone) body.description_completed = descDone;
  if (popup) body.show_popup_on_unlock = true;
  if (includeInMain) body.include_in_main = true;
  if (reqs.length) body.requirements = reqs;
  if (objectives.length) body.objectives = objectives;
  if (failures.length) body.failures = failures;
  if (rewards.length) body.rewards = rewards;
  quests.push({ id, body });
}

// ---- objective/reward shorthands -------------------------------------------
const obtain = (item, n, name) => ({ type: 'questlog:item_obtain', item, required_amount: n, name });
const craft = (item, n, name) => ({ type: 'questlog:item_craft', item, required_amount: n, name });
const mine = (block, n, name) => ({ type: 'questlog:block_mine', block, required_amount: n, name });
const place = (block, n, name) => ({ type: 'questlog:block_place', block, required_amount: n, name });
const use = (item, n, name) => ({ type: 'questlog:item_use', item, required_amount: n, name });
const interact = (block, n, name) => ({ type: 'questlog:block_interact', block, required_amount: n, name });
const read = (name) => ({ type: 'questlog:read', name });
const anyOf = (name, ...objectives) => ({ type: 'questlog:or', name, objectives });

const item = (id, count = 1, auto = true) => ({ type: 'questlog:item', item: id, count, auto_claim: auto });
const xp = (amount, levels = false) => ({ type: 'questlog:experience', experience: amount, levels, auto_claim: true });
const pick = (n, ...choices) => ({ type: 'questlog:choice', pick_count: n, choices });

// A link the player can click straight to another quest, from the description.
const link = (text, id) => `[${text}](quest:${qid(id)})`;

// ---- chapters ---------------------------------------------------------------
chapter('main',    { name: 'Getting Started',    icon: 'minecraft:crafting_table',           order: 1, main: true });
chapter('tinkers', { name: "Tinkers' Construct", icon: 'tconstruct:seared_brick',            order: 2 });
chapter('create',  { name: 'Create',             icon: 'create:cogwheel',                    order: 3 });
chapter('carry',   { name: 'Carrying Capacity',  icon: 'sophisticatedbackpacks:backpack',    order: 4 });
chapter('time',    { name: 'Time & Growth',      icon: 'tiab:time_in_a_bottle',              order: 5 });
chapter('explore', { name: 'Exploration',        icon: 'minecraft:filled_map',               order: 6 });

// ---- main: the hub ----------------------------------------------------------
// The welcome quest completes simply by being read, so the very first thing a
// player does is open the log -- which is also the thing they must learn to do.
quest('main/welcome', {
  chapter: 'main', order: 0, popup: true, toastUnlock: true,
  title: 'Welcome to Tinker & Create',
  icon: 'minecraft:crafting_table',
  desc: "This pack is about two things: building tools that grow with you, and building machines that do your work for you.\n\n"
      + "There is no wrong order. Each chapter below is a short guided line -- follow whichever appeals to you.\n\n"
      + `${link('Tinkers: forge a tool that levels up', 'tinkers/first_tool')}\n`
      + `${link('Create: your first automated line', 'create/wheel')}\n`
      + `${link('Carrying Capacity: stop running out of space', 'carry/backpack')}\n`
      + `${link('Time & Growth: skip the waiting', 'time/tiab')}\n`
      + `${link('Exploration: find the good stuff', 'explore/compass')}\n\n`
      + "Press ` (grave) or the book button in your inventory to reopen this log at any time.",
  descDone: "You know where the log lives. Everything else is optional -- go build something.",
  objectives: [read('Read this entry')],
  rewards: [xp(20)],
});

quest('main/first_wood', {
  chapter: 'main', order: 1, after: ['main/welcome'],
  title: 'Punch Some Wood',
  icon: 'minecraft:oak_log',
  desc: 'Every line in this pack starts with wood. Grab a stack -- Tinkers needs it for a Crafting Station, Create needs it for shafts and casings.',
  objectives: [obtain('#minecraft:logs', 16, 'Gather 16 logs')],
  rewards: [item('minecraft:crafting_table', 1), xp(20)],
});

quest('main/see', {
  chapter: 'main', order: 2, after: ['main/first_wood'],
  title: 'Have a Look Around',
  icon: 'minecraft:spyglass',
  desc: 'The world generation in this pack is heavily expanded. Before you dig in, get your bearings.',
  objectives: [anyOf('Craft a spyglass, or just find some copper',
    craft('minecraft:spyglass', 1, 'Craft a Spyglass'),
    obtain('minecraft:raw_copper', 8, 'Obtain 8 Raw Copper'))],
  rewards: [item('minecraft:torch', 32), xp(30)],
});

quest('main/sleep', {
  chapter: 'main', order: 3,
  title: 'Skip the Night, Keep Your Spawn',
  icon: 'comforts:sleeping_bag_red',
  desc: "A sleeping bag passes the night without moving your spawn point -- so you can sleep out on a mining trip and still respawn at base.\n\n"
      + 'Any of the sixteen colours works. Cheap, and it removes the usual reason to carry a bed.',
  objectives: [obtain('#comforts:sleeping_bags', 1, 'Craft a Sleeping Bag')],
  rewards: [item('minecraft:white_wool', 6), xp(20)],
});

// The finale gates on the ENTRY quest of every chapter, so nothing can be
// skipped -- including Time & Growth, which players otherwise never notice.
quest('main/ready', {
  chapter: 'main', order: 99,
  title: 'Properly Equipped',
  icon: 'create:mechanical_press',
  desc: 'Complete the opening quest of all five chapters. Once you have touched every system, the pack is yours to play.',
  descDone: 'That is the whole tour. Everything from here is your own project.',
  // These are OBJECTIVES, not requirements, on purpose. As requirements the
  // quest would stay invisible until it was already earned, so the player would
  // never know the capstone existed. As objectives it is visible from the start
  // with a five-item checklist -- and the reward still cannot be claimed early.
  objectives: [
    { type: 'questlog:quest_complete', quest: qid('tinkers/first_tool'), name: 'Tinkers: Your First Tool' },
    { type: 'questlog:quest_complete', quest: qid('create/wheel'), name: 'Create: First Rotation' },
    { type: 'questlog:quest_complete', quest: qid('carry/backpack'), name: 'Carrying Capacity: Pockets' },
    { type: 'questlog:quest_complete', quest: qid('time/tiab'), name: 'Time & Growth: Time in a Bottle' },
    { type: 'questlog:quest_complete', quest: qid('explore/compass'), name: "Exploration: Point Me at It" },
  ],
  rewards: [pick(1,
    { type: 'questlog:item', item: 'minecraft:diamond', count: 8, name: '8 Diamonds' },
    { type: 'questlog:item', item: 'create:brass_ingot', count: 16, name: '16 Brass Ingots' },
    { type: 'questlog:item', item: 'tconstruct:seared_brick', count: 32, name: '32 Seared Bricks' }),
    xp(10, true)],
});

// ---- Tinkers ----------------------------------------------------------------
quest('tinkers/station', {
  chapter: 'tinkers', order: 1,
  title: 'A Place to Work',
  icon: 'tconstruct:tinker_station',
  desc: "Tinkers' tools are assembled, not crafted. Build a Tinker Station -- it is where every tool in this line gets made and repaired.\n\n"
      + 'Pattern: a Crafting Station plus four Blank Patterns.',
  objectives: [obtain('tconstruct:tinker_station', 1, 'Obtain a Tinker Station')],
  rewards: [item('tconstruct:pattern', 4), xp(30)],
});

quest('tinkers/first_tool', {
  chapter: 'tinkers', order: 2, after: ['tinkers/station'], includeInMain: true,
  title: 'Your First Tool',
  icon: 'tconstruct:pickaxe',
  desc: "Assemble a pickaxe at the station. Unlike a vanilla pickaxe, this one keeps its identity -- it can be repaired forever and upgraded as you go.\n\n"
      + `Next: ${link('melt something down', 'tinkers/melter')}.`,
  objectives: [obtain('tconstruct:pickaxe', 1, 'Assemble a Pickaxe')],
  rewards: [xp(50), item('minecraft:iron_ingot', 4)],
});

quest('tinkers/melter', {
  chapter: 'tinkers', order: 3, after: ['tinkers/first_tool'],
  title: 'Getting Molten',
  icon: 'tconstruct:seared_melter',
  desc: 'A Seared Melter turns ore and scrap into molten metal. It is the small version of the Smeltery, and it only needs a few Seared Bricks.',
  objectives: [obtain('tconstruct:seared_melter', 1, 'Obtain a Seared Melter')],
  rewards: [item('tconstruct:seared_brick', 16), xp(40)],
});

quest('tinkers/smeltery', {
  chapter: 'tinkers', order: 4, after: ['tinkers/melter'],
  title: 'The Smeltery',
  icon: 'tconstruct:smeltery_controller',
  desc: 'The real thing: a multiblock that doubles your ore output and alloys metals you cannot craft any other way. Build the controller and a tank, then wall it in with Seared Bricks.',
  objectives: [
    obtain('tconstruct:smeltery_controller', 1, 'Obtain a Smeltery Controller'),
    obtain('tconstruct:seared_bricks', 16, 'Gather 16 Seared Bricks blocks'),
  ],
  rewards: [xp(80), item('minecraft:iron_ingot', 8)],
});

quest('tinkers/upgrade', {
  chapter: 'tinkers', order: 5, after: ['tinkers/first_tool'],
  title: 'Room to Grow',
  icon: 'minecraft:nether_star',
  desc: "Tools in this pack gain XP as you use them and level up on their own -- each level grants a modifier slot. To start that clock, apply the Improvable modifier at a Tinker Station.\n\n"
      + 'It is worth doing early: the sooner a tool is Improvable, the sooner it starts banking levels.',
  objectives: [anyOf('Get hold of a Nether Star, or trade for the upgrade',
    obtain('minecraft:nether_star', 1, 'Obtain a Nether Star'),
    obtain('tconstruct:silky_cloth', 1, 'Obtain Silky Cloth'))],
  rewards: [xp(100), item('tconstruct:pattern', 8)],
});

quest('tinkers/heart', {
  chapter: 'tinkers', order: 6, after: ['tinkers/smeltery'],
  title: 'More To Give',
  icon: 'bhc:red_heart_canister',
  desc: 'Heart Canisters raise your maximum health permanently. With a Smeltery running you can afford the metal.',
  objectives: [obtain('bhc:red_heart_canister', 1, 'Craft a Red Heart Canister')],
  rewards: [xp(5, true)],
});

// ---- Create -----------------------------------------------------------------
quest('create/goggles', {
  chapter: 'create', order: 1,
  title: 'Read the Machine',
  icon: 'create:goggles',
  desc: "Engineer's Goggles show stress, speed and fluid contents when you look at a machine. Almost every Create problem is diagnosed by putting these on.",
  objectives: [obtain('create:goggles', 1, 'Obtain Engineer’s Goggles')],
  rewards: [item('create:andesite_alloy', 8), xp(30)],
});

quest('create/wheel', {
  chapter: 'create', order: 2, after: ['create/goggles'], includeInMain: true,
  title: 'First Rotation',
  icon: 'create:water_wheel',
  desc: "Every Create machine runs on rotational force. A Water Wheel in a stream is the cheapest source and needs no fuel.\n\n"
      + `Then: ${link('put that rotation to work', 'create/press')}.`,
  objectives: [obtain('create:water_wheel', 1, 'Obtain a Water Wheel')],
  rewards: [item('create:shaft', 16), item('create:cogwheel', 8), xp(40)],
});

quest('create/press', {
  chapter: 'create', order: 3, after: ['create/wheel'],
  title: 'Pressing Matters',
  icon: 'create:mechanical_press',
  desc: 'A Mechanical Press over a Depot turns ingots into sheets -- the gateway component for most of Create. Feed it with a belt and it never stops.',
  objectives: [
    obtain('create:mechanical_press', 1, 'Obtain a Mechanical Press'),
    obtain('create:belt_connector', 1, 'Obtain a Belt Connector'),
  ],
  rewards: [item('create:andesite_alloy', 16), xp(60)],
});

quest('create/contraption', {
  chapter: 'create', order: 4, after: ['create/press'],
  title: 'It Moves',
  icon: 'create:mechanical_piston',
  desc: 'Contraptions are the point of Create: a block assembly that moves as one. Build a Mechanical Piston or a Windmill Bearing and watch it go.',
  objectives: [anyOf('Build something that moves',
    obtain('create:mechanical_piston', 1, 'Obtain a Mechanical Piston'),
    obtain('create:windmill_bearing', 1, 'Obtain a Windmill Bearing'),
    obtain('create:mechanical_bearing', 1, 'Obtain a Mechanical Bearing'))],
  rewards: [xp(80), item('create:brass_ingot', 8)],
});

quest('create/chain', {
  chapter: 'create', order: 5, after: ['create/contraption'],
  title: 'Across the Base',
  icon: 'create:chain_conveyor',
  desc: 'Chain Conveyors move items between distant machines without a belt run. This pack extends their reach to 128 blocks, so they can genuinely span a base.',
  objectives: [obtain('create:chain_conveyor', 2, 'Obtain 2 Chain Conveyors')],
  rewards: [item('create:brass_ingot', 16), xp(80)],
});

quest('create/collect', {
  chapter: 'create', order: 6,
  title: 'Picking Up After Yourself',
  icon: 'create:chute',
  desc: "Create has no vacuum block, and does not need one: a Chute pulls in items that drop into the space above it, which is exactly what a mob or crop farm produces.\n\n"
      + 'Put one under the drop, belt it away, and nothing is left on the floor. A Smart Chute filters what it accepts.',
  objectives: [obtain('create:chute', 1, 'Obtain a Chute')],
  rewards: [item('create:andesite_alloy', 8), xp(40)],
});

quest('create/xp', {
  chapter: 'create', order: 7,
  title: 'Experience, Bottled',
  icon: 'create_enchantment_industry:experience_hatch',
  desc: "Create can treat experience as a fluid. An Experience Hatch moves XP between you and a tank, so levels can be stored, piped and spent by machines instead of sitting in your bar.\n\n"
      + `Pair it with a ${link('Grindstone Drain', 'create/disenchant')} and enchanting stops being something you save up for.`,
  objectives: [obtain('create_enchantment_industry:experience_hatch', 1, 'Obtain an Experience Hatch')],
  rewards: [xp(200), item('minecraft:bucket', 1)],
});

quest('create/disenchant', {
  chapter: 'create', order: 8,
  title: 'Nothing Wasted',
  icon: 'create_enchantment_industry:grindstone_drain',
  desc: "A normal grindstone throws away most of the experience it strips off an item. A Grindstone Drain captures it as Liquid Experience instead.\n\n"
      + 'Feed that back into a Blaze Enchanter and unwanted loot enchantments become the fuel for the ones you want.',
  objectives: [anyOf('Capture or spend liquid experience',
    obtain('create_enchantment_industry:grindstone_drain', 1, 'Obtain a Grindstone Drain'),
    obtain('create_enchantment_industry:blaze_enchanter', 1, 'Obtain a Blaze Enchanter'))],
  rewards: [xp(5, true), item('minecraft:lapis_lazuli', 32)],
});

// ---- Carrying Capacity ------------------------------------------------------
quest('carry/backpack', {
  chapter: 'carry', order: 1, includeInMain: true,
  title: 'Pockets',
  icon: 'sophisticatedbackpacks:backpack',
  desc: "A backpack is the single biggest early quality-of-life win in this pack. Craft one and wear it -- it upgrades all the way to Netherite and takes filter and magnet upgrades.\n\n"
      + `Then: ${link('upgrade it', 'carry/upgrade')}.`,
  objectives: [obtain('sophisticatedbackpacks:backpack', 1, 'Craft a Backpack')],
  rewards: [item('minecraft:leather', 8), xp(30)],
});

quest('carry/upgrade', {
  chapter: 'carry', order: 2, after: ['carry/backpack'],
  title: 'Bigger Pockets',
  icon: 'sophisticatedbackpacks:copper_backpack',
  desc: 'Copper is the first tier. Each tier adds rows and upgrade slots, and upgrading keeps the contents.',
  objectives: [obtain('sophisticatedbackpacks:copper_backpack', 1, 'Craft a Copper Backpack')],
  rewards: [item('minecraft:copper_ingot', 16), xp(40)],
});

quest('carry/curios', {
  chapter: 'carry', order: 3, after: ['carry/backpack'],
  title: 'Somewhere to Put It',
  icon: 'minecraft:amethyst_shard',
  desc: 'This pack adds accessory slots -- belts, rings, charms. Open your inventory and look for the extra slots on the left.',
  objectives: [anyOf('Get any accessory',
    obtain('travelertoolbelt:belt', 1, 'A Tool Belt'),
    obtain('bhc:red_heart_canister', 1, 'A Heart Canister'),
    obtain('minecraft:elytra', 1, 'An Elytra'))],
  rewards: [xp(50)],
});

quest('carry/drawers', {
  chapter: 'carry', order: 4, after: ['carry/upgrade'],
  title: 'A Wall of Storage',
  icon: 'minecraft:barrel',
  desc: 'Storage Drawers hold enormous stacks of one item and show you what is inside at a glance. Build a wall of them next to your Create machines.',
  objectives: [obtain('storagedrawers:acacia_full_drawers_1', 1, 'Craft a Drawer')],
  rewards: [item('minecraft:oak_planks', 32), xp(40)],
});

quest('carry/ender', {
  chapter: 'carry', order: 5, after: ['carry/drawers'],
  title: 'Storage That Follows You',
  icon: 'minecraft:ender_chest',
  desc: 'An Ender Chest is the same inventory everywhere in the world. Pair it with a backpack and you never carry ore home again.',
  objectives: [obtain('minecraft:ender_chest', 1, 'Craft an Ender Chest')],
  rewards: [item('minecraft:ender_pearl', 4), xp(60)],
});

// ---- Time & Growth ----------------------------------------------------------
quest('time/tiab', {
  chapter: 'time', order: 1, includeInMain: true,
  title: 'Time in a Bottle',
  icon: 'tiab:time_in_a_bottle',
  desc: "Point it at a sapling, a crop, a furnace or a Create machine and it fast-forwards that block. This pack removes the storage cap, so a bottle can bank as much time as you can give it.\n\n"
      + 'It is the fastest way past the early-game waiting.',
  objectives: [obtain('tiab:time_in_a_bottle', 1, 'Craft a Time in a Bottle')],
  rewards: [item('minecraft:oak_sapling', 8), xp(50)],
});

quest('time/accelerate', {
  chapter: 'time', order: 2, after: ['time/tiab'],
  title: 'Fast Forward',
  icon: 'minecraft:oak_sapling',
  desc: 'Use the bottle on something that grows. Trees are the obvious first target -- a sapling to full tree in seconds.',
  objectives: [use('tiab:time_in_a_bottle', 3, 'Use Time in a Bottle 3 times')],
  rewards: [item('minecraft:bone_meal', 32), xp(40)],
});

quest('time/harvest', {
  chapter: 'time', order: 3, after: ['time/accelerate'],
  title: 'Bring in the Crop',
  icon: 'minecraft:wheat',
  desc: 'With growth accelerated, farming stops being a waiting game. Bank a real harvest.',
  objectives: [obtain('minecraft:wheat', 64, 'Harvest 64 Wheat')],
  rewards: [item('minecraft:hay_block', 8), xp(40)],
});

quest('time/cooking', {
  chapter: 'time', order: 4, after: ['time/harvest'],
  title: 'Something Cooking',
  icon: 'farmersdelight:cooking_pot',
  desc: "Farmer's Delight turns that harvest into food worth eating. A Cooking Pot over a campfire is all you need to start.",
  objectives: [obtain('farmersdelight:cooking_pot', 1, 'Craft a Cooking Pot')],
  rewards: [item('farmersdelight:iron_knife', 1), xp(50)],
});

// ---- Exploration ------------------------------------------------------------
quest('explore/compass', {
  chapter: 'explore', order: 1, includeInMain: true,
  title: 'Point Me at It',
  icon: 'naturescompass:naturescompass',
  desc: "Nature's Compass finds any biome by name. In a pack with this much added worldgen, it turns 'wander until you find it' into 'walk there'.",
  objectives: [obtain('naturescompass:naturescompass', 1, 'Craft a Nature’s Compass')],
  rewards: [item('minecraft:map', 1), xp(50)],
});

quest('explore/travel', {
  chapter: 'explore', order: 2, includeInMain: true,
  title: 'Getting Around Early',
  icon: 'hangglider:hang_glider',
  desc: "Three cheap items make travel bearable long before an elytra, and they stack:\n\n"
      + "A Hang Glider turns any drop into distance -- jump off a hill and steer.\n"
      + "Slimeboots cancel fall damage entirely, so height stops being a risk.\n"
      + "A Slime Sling flings you where you point it, which is also how you gain the height.\n\n"
      + 'Sling up, glide out, land in the boots. That loop covers a lot of ground for the cost of some slime and cloth.',
  objectives: [
    obtain('#hangglider:hang_gliders', 1, 'Craft a Hang Glider'),
    obtain('tconstruct:slime_boots', 1, 'Craft Slimeboots'),
    obtain('slime_time:slime_sling', 1, 'Craft a Slime Sling'),
  ],
  rewards: [item('minecraft:slime_ball', 16), xp(80)],
});

quest('explore/structure', {
  chapter: 'explore', order: 3, after: ['explore/compass'],
  title: 'Somebody Was Here First',
  icon: 'minecraft:iron_pickaxe',
  desc: 'This pack layers several structure mods over the world. Go find one and loot it -- the gear inside is well ahead of what you can craft.',
  objectives: [anyOf('Loot a structure',
    obtain('minecraft:diamond', 3, 'Come back with 3 Diamonds'),
    obtain('minecraft:golden_apple', 1, 'Come back with a Golden Apple'))],
  rewards: [xp(80), item('minecraft:iron_ingot', 8)],
});

quest('explore/nether', {
  chapter: 'explore', order: 4, after: ['explore/structure'],
  title: 'Somewhere Warmer',
  icon: 'minecraft:flint_and_steel',
  desc: 'Blaze rods, quartz and netherite all live through the portal. Tinkers alloys in particular want nether resources.',
  objectives: [{ type: 'questlog:visit_dimension', dimension: 'minecraft:the_nether', required_amount: 1, name: 'Enter the Nether' }],
  rewards: [item('minecraft:obsidian', 10), xp(5, true)],
});

// ---- write ------------------------------------------------------------------
const written = [];
function emit(sub, id, body) {
  const file = path.join(ROOT, sub, id + '.json');
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(body, null, 2) + '\n');
  written.push(path.relative(path.resolve(__dirname, '..'), file));
}
fs.rmSync(ROOT, { recursive: true, force: true });
for (const c of chapters) emit('chapters', c.id, c.body);
for (const q of quests) emit('quests', q.id, q.body);

console.log(`  ${chapters.length} chapters, ${quests.length} quests`);
console.log(`  wrote ${path.relative(process.cwd(), ROOT)}`);

// Dump every item id referenced, so it can be checked against a live registry.
const ids = new Set();
const scan = (o) => {
  if (Array.isArray(o)) return o.forEach(scan);
  if (!o || typeof o !== 'object') return;
  for (const [k, v] of Object.entries(o)) {
    if ((k === 'item' || k === 'block') && typeof v === 'string') ids.add(v);
    else if (k === 'item' && v && typeof v === 'object' && v.id) ids.add(v.id);
    else scan(v);
  }
};
for (const c of chapters) scan(c.body);
for (const q of quests) scan(q.body);
fs.writeFileSync('/tmp/questids.txt', [...ids].sort().join('\n'));
console.log(`  ${ids.size} distinct item/block ids -> /tmp/questids.txt`);
