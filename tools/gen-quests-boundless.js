#!/usr/bin/env node
/**
 * Generate the Boundless quest pack.
 *
 *   node tools/gen-quests-boundless.js
 *
 * Replaces Questlog. Boundless does two things Questlog cannot, both of which
 * were asked for directly: `submit` objectives that consume handed-in items, and
 * a JEI integration so quest items link to their recipe.
 *
 * Schema was read out of boundless-1.21.1-neo-11.jar, because the wiki documents
 * objective *types* but not field names. Gson maps record fields 1:1 to JSON keys:
 *
 *   Quest     id name icon description dependencies lockAfterDependency optional
 *             repeatable autoComplete hiddenUnderDependency rewards type
 *             completion category subCategory
 *   Target    kind id acceptedIds count hint
 *   Rewards   items[] commands[] functions[] lootTables[] advancements[] toasts[]
 *             expType expAmount
 *   Category  id icon name order excludeFromAll dependency autoComplete
 *
 * Layout, per the wiki's Quest-Packs page:
 *   config/boundless/questpacks/<pack>/pack.mcmeta
 *   config/boundless/questpacks/<pack>/data/<ns>/quests/categories/*.json
 *   config/boundless/questpacks/<pack>/data/<ns>/quests/*.json
 */
const fs = require('fs');
const path = require('path');

const NS = 'tinkercreate';
const ROOT = path.resolve(__dirname, '..',
  'overrides/config/boundless/questpacks/tinker_and_create');
const DATA = path.join(ROOT, 'data', NS, 'quests');

const categories = [];
const quests = [];

function category(id, { name, icon, order }) {
  categories.push({ id, body: { id, name, icon, order, excludeFromAll: false, autoComplete: false } });
}

/**
 * One quest. `after` becomes Boundless dependencies -- unlike Questlog, an
 * unmet dependency still shows the quest (greyed), so chaining here does not
 * hide the roadmap the way it did before. hiddenUnderDependency stays false for
 * exactly that reason.
 */
function quest(id, {
  category: cat, name, icon, desc, after = [], targets = [], rewards = {},
  optional = false, autoComplete = false,
}) {
  const body = {
    id, name, icon, description: desc,
    category: cat,
    dependencies: after,
    lockAfterDependency: false,
    hiddenUnderDependency: false,
    optional, repeatable: false, autoComplete,
    completion: { targets },
    rewards: {
      items: rewards.items || [],
      commands: rewards.commands || [],
      expType: rewards.expType || 'points',
      expAmount: rewards.exp || 0,
    },
  };
  quests.push({ id, body });
}

// ---- target + reward shorthands ---------------------------------------------
const collect = (id, count = 1, hint) => ({ kind: 'item', id, count, ...(hint ? { hint } : {}) });
const submit  = (id, count = 1, hint) => ({ kind: 'submit', id, count, ...(hint ? { hint } : {}) });
const anyOf   = (ids, count = 1, hint) => ({ kind: 'item', id: ids[0], acceptedIds: ids, count, ...(hint ? { hint } : {}) });
const kill    = (id, count = 1) => ({ kind: 'entity', id, count });
const advance = (id) => ({ kind: 'advancement', id, count: 1 });

const give = (item, count = 1) => ({ item, count });

/**
 * A "watch how it works" button on a quest.
 *
 * Ponder is Create's animated in-game guide, and `/ponder scene <id>` opens a
 * specific scene. It is a server command that pushes the scene to the player, so
 * a Boundless CommandReward can trigger it -- verified against the live server:
 * the console rejects it with "A player is required to run this command here",
 * which is precisely the context a reward runs in.
 *
 * Scene ids are not item ids. These were taken from create.ponder.<id>.header
 * in Create's lang file -- 167 scenes exist, and goggles and item_vault are not
 * among them, so those quests get no button rather than a broken one.
 */

/**
 * Boundless descriptions render no click events -- verified against every screen
 * and text class in the jar -- so a literal hyperlink is not available. Ponder's
 * own shortcut is better anyway: hovering an item and pressing W opens its scene,
 * from the inventory or EMI, as many times as you like. The command reward below
 * stays as a one-shot bonus on completion; this line is the repeatable route.
 *
 * W is also walk-forward, but Ponder's binding only applies while hovering an
 * item in a GUI, so the two never actually collide.
 */
const PONDER_HINT = '\n\nHover this item in your inventory or EMI and press W to watch it animated.';

const ponder = (scene, title) => ({
  command: `/ponder scene ${scene}`,
  title: title || 'Watch how it works',
  icon: scene,
});

const cmd  = (command, title, icon) => ({ command, title, icon });

// ---- categories --------------------------------------------------------------
category('getting_started', { name: 'Getting Started',      icon: 'minecraft:crafting_table',        order: 1 });
category('tinkers',         { name: "Tinkers' Construct",   icon: 'tconstruct:seared_brick',         order: 2 });
category('create',          { name: 'Create',               icon: 'create:cogwheel',                 order: 3 });
category('storage',         { name: 'Storage & Logistics',  icon: 'create:item_vault',               order: 4 });
category('carry',           { name: 'Carrying Capacity',    icon: 'sophisticatedbackpacks:backpack', order: 5 });
category('time',            { name: 'Time & Growth',        icon: 'tiab:time_in_a_bottle',           order: 6 });
category('explore',         { name: 'Exploration',          icon: 'minecraft:filled_map',            order: 7 });

// ---- Getting Started ---------------------------------------------------------
const BOOK_CMD = '/give @s written_book[written_book_content={title:"Tinker & Create",author:"Pack Guide",pages:['
  + [
      'Tinker & Create\\\\n\\\\nPress [ to open your quest book, or use the button in your inventory.',
      'Seven categories. Nothing is locked behind another category -- follow whichever appeals to you.',
      'Handy keys\\\\n\\\\nZ - zoom\\\\nM - map\\\\nB - backpack\\\\nJ - Tinkers helmet\\\\n[ - quest book',
      'Two things worth doing early:\\\\n\\\\nApply Improvable to a Tinkers tool.\\\\n\\\\nCraft a sleeping bag: it skips the night without moving your spawn.',
    ].map((t) => `'{"text":"${t}"}'`).join(',') + ']}] 1';

quest('welcome', {
  category: 'getting_started', name: 'Welcome to Tinker & Create',
  icon: 'minecraft:crafting_table', autoComplete: true,
  desc: 'Build tools that grow with you, and machines that do your work for you.\n\n'
      + 'Press [ to reopen this book at any time. Take the guide below and start wherever you like.',
  targets: [collect('#minecraft:logs', 1, 'Pick up any log to begin')],
  rewards: { exp: 20, commands: [cmd(BOOK_CMD, 'Quick Reference Book', 'minecraft:written_book')] },
});

quest('first_wood', {
  category: 'getting_started', name: 'Punch Some Wood', icon: 'minecraft:oak_log', after: ['welcome'],
  desc: 'Every line in this pack starts with wood. Tinkers needs it for a Crafting Station, Create for shafts and casings.',
  targets: [collect('#minecraft:logs', 16)],
  rewards: { items: [give('minecraft:crafting_table')], exp: 20 },
});

quest('see', {
  category: 'getting_started', name: 'Have a Look Around', icon: 'minecraft:spyglass', after: ['first_wood'],
  desc: 'The world generation here is heavily expanded. Get your bearings before you dig in.',
  targets: [anyOf(['minecraft:spyglass', 'minecraft:raw_copper'], 1, 'A spyglass, or some copper')],
  rewards: { items: [give('minecraft:torch', 32)], exp: 30 },
});

quest('sleep', {
  category: 'getting_started', name: 'Skip the Night, Keep Your Spawn',
  icon: 'comforts:sleeping_bag_red', after: ['first_wood'],
  desc: 'A sleeping bag passes the night without moving your spawn point, so you can sleep on a mining trip and still respawn at base.',
  targets: [collect('#comforts:sleeping_bags', 1)],
  rewards: { items: [give('minecraft:white_wool', 6)], exp: 20 },
});

// ---- Tinkers -----------------------------------------------------------------
quest('tinkers_station', {
  category: 'tinkers', name: 'A Place to Work', icon: 'tconstruct:tinker_station',
  desc: "Tinkers' tools are assembled, not crafted. The Tinker Station is where every tool in this line is made, repaired and upgraded.",
  targets: [collect('tconstruct:tinker_station')],
  rewards: { items: [give('tconstruct:pattern', 4)], exp: 30 },
});
quest('tinkers_first_tool', {
  category: 'tinkers', name: 'Your First Tool', icon: 'tconstruct:pickaxe', after: ['tinkers_station'],
  desc: 'Assemble a pickaxe. Unlike a vanilla one it keeps its identity -- repairable forever, and upgradeable as you go.',
  targets: [collect('tconstruct:pickaxe')],
  rewards: { items: [give('minecraft:iron_ingot', 4)], exp: 50 },
});
quest('tinkers_melter', {
  category: 'tinkers', name: 'Getting Molten', icon: 'tconstruct:seared_melter', after: ['tinkers_first_tool'],
  desc: 'A Seared Melter turns ore and scrap into molten metal -- the small version of the Smeltery.',
  targets: [collect('tconstruct:seared_melter')],
  rewards: { items: [give('tconstruct:seared_brick', 16)], exp: 40 },
});
quest('tinkers_smeltery', {
  category: 'tinkers', name: 'The Smeltery', icon: 'tconstruct:smeltery_controller', after: ['tinkers_melter'],
  desc: 'The real thing: doubles ore output and alloys metals you cannot make any other way.',
  targets: [collect('tconstruct:smeltery_controller'), collect('tconstruct:seared_bricks', 16)],
  rewards: { items: [give('minecraft:iron_ingot', 8)], exp: 80 },
});
quest('tinkers_upgrade', {
  category: 'tinkers', name: 'Room to Grow', icon: 'minecraft:nether_star', after: ['tinkers_first_tool'],
  desc: 'Tools here gain XP as you use them and level up on their own, each level granting a modifier slot. Apply Improvable to start that clock.',
  targets: [anyOf(['minecraft:nether_star', 'tconstruct:silky_cloth'], 1, 'Nether Star or Silky Cloth')],
  rewards: { items: [give('tconstruct:pattern', 8)], exp: 100 },
});
quest('tinkers_heart', {
  category: 'tinkers', name: 'More To Give', icon: 'bhc:red_heart_canister', after: ['tinkers_smeltery'],
  desc: 'Heart Canisters raise your maximum health permanently. With a Smeltery running you can afford the metal.',
  targets: [collect('bhc:red_heart_canister')],
  rewards: { expType: 'levels', exp: 5 },
});

// ---- Create ------------------------------------------------------------------
quest('create_goggles', {
  category: 'create', name: 'Read the Machine', icon: 'create:goggles',
  desc: "Engineer's Goggles show stress, speed and contents. Almost every Create problem is diagnosed by putting these on.",
  targets: [collect('create:goggles')],
  rewards: { items: [give('create:andesite_alloy', 8)], exp: 30 },
});
quest('create_wheel', {
  category: 'create', name: 'First Rotation', icon: 'create:water_wheel', after: ['create_goggles'],
  desc: 'Every Create machine runs on rotational force. A Water Wheel is the cheapest source and needs no fuel.' + PONDER_HINT,
  targets: [collect('create:water_wheel')],
  rewards: { items: [give('create:shaft', 16), give('create:cogwheel', 8)], exp: 40 , commands: [ponder('create:water_wheel', 'Watch: Water Wheel')]},
});
quest('create_press', {
  category: 'create', name: 'Pressing Matters', icon: 'create:mechanical_press', after: ['create_wheel'],
  desc: 'A Mechanical Press over a Depot turns ingots into sheets -- the gateway component for most of Create.' + PONDER_HINT,
  targets: [collect('create:mechanical_press'), collect('create:belt_connector')],
  rewards: { items: [give('create:andesite_alloy', 16)], exp: 60 , commands: [ponder('create:mechanical_press', 'Watch: Mechanical Press')]},
});
quest('create_contraption', {
  category: 'create', name: 'It Moves', icon: 'create:mechanical_piston', after: ['create_press'],
  desc: 'Contraptions are the point of Create: a block assembly that moves as one.' + PONDER_HINT,
  targets: [anyOf(['create:mechanical_piston', 'create:windmill_bearing', 'create:mechanical_bearing'], 1, 'Any bearing or piston')],
  rewards: { items: [give('create:brass_ingot', 8)], exp: 80 , commands: [ponder('create:mechanical_piston', 'Watch: Mechanical Piston')]},
});
quest('create_chain', {
  category: 'create', name: 'Across the Base', icon: 'create:chain_conveyor', after: ['create_contraption'],
  desc: 'Chain Conveyors move items between distant machines. This pack extends their reach to 128 blocks, so they can span a base.' + PONDER_HINT,
  targets: [collect('create:chain_conveyor', 2)],
  rewards: { items: [give('create:brass_ingot', 16)], exp: 80 , commands: [ponder('create:chain_conveyor', 'Watch: Chain Conveyor')]},
});
quest('create_collect', {
  category: 'create', name: 'Picking Up After Yourself', icon: 'create:chute', after: ['create_wheel'],
  desc: 'Create has no vacuum block and does not need one: a Chute pulls in items dropped above it, which is what a mob or crop farm produces.' + PONDER_HINT,
  targets: [collect('create:chute')],
  rewards: { items: [give('create:andesite_alloy', 8)], exp: 40 , commands: [ponder('create:chute', 'Watch: Chute')]},
});
quest('create_xp', {
  category: 'create', name: 'Experience, Bottled', icon: 'create_enchantment_industry:experience_hatch', after: ['create_press'],
  desc: 'Create can treat experience as a fluid. An Experience Hatch moves XP between you and a tank, so levels can be piped and spent by machines.',
  targets: [collect('create_enchantment_industry:experience_hatch')],
  rewards: { items: [give('minecraft:bucket')], exp: 200 },
});
quest('create_disenchant', {
  category: 'create', name: 'Nothing Wasted', icon: 'create_enchantment_industry:grindstone_drain', after: ['create_xp'],
  desc: 'A normal grindstone throws away the experience it strips off. A Grindstone Drain captures it as Liquid Experience for the Blaze Enchanter.',
  targets: [anyOf(['create_enchantment_industry:grindstone_drain', 'create_enchantment_industry:blaze_enchanter'], 1)],
  rewards: { items: [give('minecraft:lapis_lazuli', 32)], expType: 'levels', exp: 5 },
});

// ---- Storage & Logistics (new) -----------------------------------------------
quest('storage_barrel', {
  category: 'storage', name: 'Somewhere to Put It', icon: 'minecraft:barrel',
  desc: 'Chests fill up faster than you expect in this pack. A barrel is the cheap first step -- and the rest of this line is about never sorting by hand again.',
  targets: [collect('minecraft:barrel', 2)],
  rewards: { items: [give('minecraft:oak_planks', 32)], exp: 20 },
});
quest('storage_drawers', {
  category: 'storage', name: 'A Wall of Drawers', icon: 'storagedrawers:acacia_full_drawers_1', after: ['storage_barrel'],
  desc: 'Drawers hold enormous stacks of a single item and show you what is inside at a glance. Build a wall of them beside your machines.',
  targets: [collect('storagedrawers:acacia_full_drawers_1', 4)],
  rewards: { items: [give('minecraft:oak_planks', 32)], exp: 40 },
});
quest('storage_sophisticated', {
  category: 'storage', name: 'Chests That Grow', icon: 'sophisticatedstorage:barrel', after: ['storage_barrel'],
  desc: 'Sophisticated Storage barrels and chests take upgrades: filters, magnets, auto-smelting, compacting. One block that keeps improving.',
  targets: [anyOf(['sophisticatedstorage:barrel', 'sophisticatedstorage:chest'], 1, 'A Sophisticated barrel or chest')],
  rewards: { items: [give('minecraft:iron_ingot', 8)], exp: 50 },
});
quest('storage_vault', {
  category: 'storage', name: 'Bulk, the Create Way', icon: 'create:item_vault', after: ['storage_drawers'],
  desc: 'An Item Vault is a multiblock bin that speaks Create natively -- belts, chutes and funnels all feed it directly, so it is the buffer your machines fill.',
  targets: [collect('create:item_vault', 4)],
  rewards: { items: [give('create:andesite_alloy', 16)], exp: 60 },
});
quest('storage_network', {
  category: 'storage', name: 'One Screen for Everything', icon: 'toms_storage:storage_terminal', after: ['storage_vault', 'storage_sophisticated'],
  desc: "Tom's Simple Storage links every attached container into one searchable terminal. Put an Inventory Connector against your storage wall, hang a terminal on it, and stop opening chests.",
  targets: [collect('toms_storage:inventory_connector'), collect('toms_storage:storage_terminal')],
  rewards: { items: [give('minecraft:ender_pearl', 4)], exp: 100 },
});
quest('storage_ender', {
  category: 'storage', name: 'Storage That Follows You', icon: 'minecraft:ender_chest', after: ['storage_network'],
  desc: 'An Ender Chest is the same inventory everywhere in the world. Pair it with a backpack and you never carry ore home again.',
  targets: [collect('minecraft:ender_chest')],
  rewards: { items: [give('minecraft:ender_pearl', 4)], exp: 60 },
});

// ---- Carrying Capacity -------------------------------------------------------
quest('carry_backpack', {
  category: 'carry', name: 'Pockets', icon: 'sophisticatedbackpacks:backpack',
  desc: 'The single biggest early quality-of-life win here. Upgrades all the way to Netherite, and takes filter and magnet upgrades.',
  targets: [collect('sophisticatedbackpacks:backpack')],
  rewards: { items: [give('minecraft:leather', 8)], exp: 30 },
});
quest('carry_upgrade', {
  category: 'carry', name: 'Bigger Pockets', icon: 'sophisticatedbackpacks:copper_backpack', after: ['carry_backpack'],
  desc: 'Copper is the first tier. Each tier adds rows and upgrade slots, and upgrading keeps the contents.',
  targets: [collect('sophisticatedbackpacks:copper_backpack')],
  rewards: { items: [give('minecraft:copper_ingot', 16)], exp: 40 },
});
quest('carry_curios', {
  category: 'carry', name: 'Accessory Slots', icon: 'minecraft:amethyst_shard', after: ['carry_backpack'],
  desc: 'This pack adds accessory slots -- belts, rings, charms. Open your inventory and look for the extra slots on the left.',
  targets: [anyOf(['travelertoolbelt:belt', 'bhc:red_heart_canister', 'minecraft:elytra'], 1, 'Any accessory')],
  rewards: { exp: 50 },
});

// ---- Time & Growth -----------------------------------------------------------
quest('time_tiab', {
  category: 'time', name: 'Time in a Bottle', icon: 'tiab:time_in_a_bottle',
  desc: 'Point it at a sapling, a crop, a furnace or a Create machine and it fast-forwards that block. This pack removes the storage cap.',
  targets: [collect('tiab:time_in_a_bottle')],
  rewards: { items: [give('minecraft:oak_sapling', 8)], exp: 50 },
});
quest('time_harvest', {
  category: 'time', name: 'Bring in the Crop', icon: 'minecraft:wheat', after: ['time_tiab'],
  desc: 'With growth accelerated, farming stops being a waiting game.',
  targets: [collect('minecraft:wheat', 64)],
  rewards: { items: [give('minecraft:hay_block', 8)], exp: 40 },
});
quest('time_cooking', {
  category: 'time', name: 'Something Cooking', icon: 'farmersdelight:cooking_pot', after: ['time_harvest'],
  desc: "Farmer's Delight turns that harvest into food worth eating. A Cooking Pot over a campfire is all you need.",
  targets: [collect('farmersdelight:cooking_pot')],
  rewards: { items: [give('farmersdelight:iron_knife')], exp: 50 },
});

// ---- Exploration -------------------------------------------------------------
quest('explore_compass', {
  category: 'explore', name: 'Point Me at It', icon: 'naturescompass:naturescompass',
  desc: "Nature's Compass finds any biome by name. With this much added worldgen it turns wandering into walking.",
  targets: [collect('naturescompass:naturescompass')],
  rewards: { items: [give('minecraft:map')], exp: 50 },
});
quest('explore_travel', {
  category: 'explore', name: 'Getting Around Early', icon: 'hangglider:hang_glider', after: ['explore_compass'],
  desc: 'Three cheap items make travel bearable long before an elytra, and they stack.\n\n'
      + 'Sling up, glide out, land in the boots. The gliders here are unbreakable.',
  targets: [
    collect('#hangglider:hang_gliders', 1, 'Any hang glider'),
    anyOf(['tconstruct:slime_boots', 'slime_time:slime_boots'], 1, 'Either mod’s slime boots'),
    collect('slime_time:slime_sling', 1),
  ],
  rewards: { items: [give('minecraft:slime_ball', 16)], exp: 80 },
});
quest('explore_structure', {
  category: 'explore', name: 'Somebody Was Here First', icon: 'minecraft:iron_pickaxe', after: ['explore_compass'],
  desc: 'Several structure mods layer over this world. Loot one -- the gear inside is well ahead of what you can craft.',
  targets: [anyOf(['minecraft:diamond', 'minecraft:golden_apple'], 3, 'Loot worth bringing home')],
  rewards: { items: [give('minecraft:iron_ingot', 8)], exp: 80 },
});
quest('explore_nether', {
  category: 'explore', name: 'Somewhere Warmer', icon: 'minecraft:flint_and_steel', after: ['explore_structure'],
  desc: 'Blaze rods, quartz and netherite all live through the portal. Tinkers alloys in particular want nether resources.',
  targets: [advance('minecraft:nether/root')],
  rewards: { items: [give('minecraft:obsidian', 10)], expType: 'levels', exp: 5 },
});

// ---- write --------------------------------------------------------------------
fs.rmSync(ROOT, { recursive: true, force: true });
fs.mkdirSync(path.join(DATA, 'categories'), { recursive: true });

fs.writeFileSync(path.join(ROOT, 'pack.mcmeta'), JSON.stringify({
  pack: { pack_format: 48, description: 'Tinker & Create — guided progression' },
  boundless: { enabled: true, icon: 'minecraft:crafting_table' },
}, null, 2) + '\n');

for (const c of categories) {
  fs.writeFileSync(path.join(DATA, 'categories', c.id + '.json'), JSON.stringify(c.body, null, 2) + '\n');
}
for (const q of quests) {
  fs.writeFileSync(path.join(DATA, q.id + '.json'), JSON.stringify(q.body, null, 2) + '\n');
}

console.log(`  ${categories.length} categories, ${quests.length} quests`);
console.log(`  wrote ${path.relative(process.cwd(), ROOT)}`);

const ids = new Set();
const scan = (o) => {
  if (Array.isArray(o)) return o.forEach(scan);
  if (!o || typeof o !== 'object') return;
  for (const [k, v] of Object.entries(o)) {
    if ((k === 'id' || k === 'item' || k === 'icon') && typeof v === 'string' && v.includes(':')) ids.add(v);
    else if ((k === 'acceptedIds' || k === 'acceptedItems') && Array.isArray(v)) v.forEach((x) => ids.add(x));
    else scan(v);
  }
};
quests.forEach((q) => scan(q.body));
categories.forEach((c) => ids.add(c.body.icon));
fs.writeFileSync('/tmp/bq-ids.txt', [...ids].sort().join('\n') + '\n');
console.log(`  ${ids.size} distinct ids -> /tmp/bq-ids.txt`);
