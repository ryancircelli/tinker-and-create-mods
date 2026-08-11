# Tinker & Create — complete mod catalogue

Every mod encountered across this project, with a verdict for each.
Target: **MC 1.21.1 / NeoForge 21.1.248**.

| Verdict | Count |
| --- | --- |
| Included | **221** |
| Banned (hard failure) | **11** |
| Removed (unavailable, redundant, or a design call) | **28** |
| Evaluated, not selected | **985** |
| **Total seen** | **1245** |

## Included


### Auto-resolved dependency (21)

- **Almanac** `almanac` · 18.0M dl · in 3/34 packs
  Almanac is a library used by my mods with mostly loader independent shared code between multiple mods to avoid duplication of code.
  *Note:* Previously rejected — that reason no longer applies here: Seen in reference packs; not selected — see the note at the end of this section.
- **Bookshelf** `bookshelf-lib` · 42.0M dl · in 7/34 packs
  An open source library for other mods!
  *Note:* Previously rejected — that reason no longer applies here: Seen in reference packs; not selected — see the note at the end of this section.
- **Caelus API** `caelus` · 6.8M dl · in 3/34 packs
  A coremod and API to provide developers access to elytra flight mechanics through an entity attribute.
  *Note:* Previously rejected — that reason no longer applies here: Seen in reference packs; not selected — see the note at the end of this section.
- **Collective** `collective` · 59.4M dl · in 5/34 packs
  🎓 Collective is a shared library with common code for all of Serilum's mods.
  *Note:* Previously rejected — that reason no longer applies here: Seen in reference packs; not selected — see the note at the end of this section.
- **CoroUtil** `coroutil` · 27.7M dl · in 6/34 packs
  Shared library mod for Corosus's mods
  *Note:* Previously rejected — that reason no longer applies here: Seen in reference packs; not selected — see the note at the end of this section.
- **Create: Deployer API** `deployer` · 0.1M dl · in 2/34 packs
  Deployer is a Create library addon that extends logistics, gauges, and fluid systems while prioritizing stability over compatibility.
  *Note:* Previously rejected — that reason no longer applies here: Seen in reference packs; not selected — see the note at the end of this section.
- **CreativeCore** `creativecore` · 46.2M dl · in 5/34 packs
  A core mod
  *Note:* Previously rejected — that reason no longer applies here: Seen in reference packs; not selected — see the note at the end of this section.
- **DragonLib** `dragonlib` · 0.8M dl · in 4/34 packs
  DragonLib is a small and simple library mod which contains code that is used by most of my mods.
  *Note:* Previously rejected — that reason no longer applies here: Seen in reference packs; not selected — see the note at the end of this section.
- **Iceberg** `iceberg` · 32.8M dl · in 7/34 packs
  A modding library that contains new events, helpers, and utilities to make modder's lives easier.
  *Note:* Previously rejected — that reason no longer applies here: Pulled in only by Item Borders; source of the duplicate event invoker mixin conflict.
- **JamLib** `jamlib` · 13.0M dl · in 4/34 packs
  The platform-agnostic, Architectury based library used in all of JamCoreModding's mods
  *Note:* Previously rejected — that reason no longer applies here: Seen in reference packs; not selected — see the note at the end of this section.
- **Konkrete** `konkrete` · 55.6M dl · in 11/34 packs
  Just another boring library mod.
  *Note:* Previously rejected — that reason no longer applies here: Seen in reference packs; not selected — see the note at the end of this section.
- **Kotlin for Forge** `kotlin-for-forge` · 43.5M dl · in 10/34 packs
  Adds a Kotlin language loader and provides some optional utilities.
  *Note:* Previously rejected — that reason no longer applies here: Seen in reference packs; not selected — see the note at the end of this section.
- **KotlinLangForge** `kotlin-lang-forge` · 0.7M dl · in 1/34 packs
  Provides a Kotlin language adapter for Forge and Neoforge
  *Note:* Previously rejected — that reason no longer applies here: Seen in reference packs; not selected — see the note at the end of this section.
- **Lithostitched** `lithostitched` · 20.2M dl · in 5/34 packs
  Library mod with new configurability and compatibility enhancements for worldgen
  *Note:* Previously rejected — that reason no longer applies here: Seen in reference packs; not selected — see the note at the end of this section.
- **Mechanicals Lib** `mechanicals-lib` · 0.5M dl · in 3/34 packs
  Modding library
  *Note:* Previously rejected — that reason no longer applies here: Seen in reference packs; not selected — see the note at the end of this section.
- **MidnightLib** `midnightlib` · 24.8M dl · in 3/34 packs
  Common library providing a lightweight configuration system
  *Note:* Previously rejected — that reason no longer applies here: Seen in reference packs; not selected — see the note at the end of this section.
- **Moonlight Lib** `moonlight` · 36.6M dl · in 3/34 packs
  dynamic data pack and registration, villager activities, custom map marker and a lot more
  *Note:* Previously rejected — that reason no longer applies here: Empirically re-confirmed by tools/jointest.js on 2026-08-07. Adding the Moonlight chain makes the client fail to decode Hephaestus's station-layout packet during login: DecoderException -> IllegalStateException 'Attempted to load a modifier before dynamic modifiers are loaded' (LazyModifier.get -> StationSlotLayout.read), and the client disconnects. 1.1.3 (no Moonlight) joins cleanly; 1.1.4 (with it) does not — same client, same server, same everything else. The 1.0.2 'moonlight:add_item loot modifier' explanation was wrong (that code no longer exists upstream), but the CONFLICT IS REAL: the Moonlight chain adds dynamic registry content that changes load ordering so Tinkers modifiers resolve too early.
- **Platform** `platform` · 7.3M dl · in 4/34 packs
  Cross-platform library mod based on Architectury to access both Forge and Fabric APIs
  *Note:* Previously rejected — that reason no longer applies here: Seen in reference packs; not selected — see the note at the end of this section.
- **Prickle** `prickle` · 11.3M dl · in 8/34 packs
  Prickle is a JSON based configuration file format brought to Minecraft.
  *Note:* Previously rejected — that reason no longer applies here: Seen in reference packs; not selected — see the note at the end of this section.
- **Resourceful Lib** `resourceful-lib` · 31.9M dl · in 8/34 packs
  Resourceful Lib
  *Note:* Previously rejected — that reason no longer applies here: Seen in reference packs; not selected — see the note at the end of this section.
- **Zeta** `zeta` · 13.8M dl · in 6/34 packs
  Comprehensive Load-Bearing Library for Modular Mods
  *Note:* Previously rejected — that reason no longer applies here: Seen in reference packs; not selected — see the note at the end of this section.

### Building (21)

- **AmbientSounds** `ambientsounds` · 34.9M dl · in 2/34 packs
  #listentonature
- **Amendments** `amendments` · 17.0M dl · in 4/34 packs
  Many changes to vanilla blocks
- **Armor Poser** `armor-poser` · 0.7M dl · in 1/34 packs
  Adds a GUI for armor stands in which you can configure it's pose and other properties
- **Comforts** `comforts` · 20.5M dl · in 4/34 packs
  Adds sleeping bags and hammocks for, respectively, portability and turning day to night, without setting new spawns. Comes in 16 different colors!
- **Crate Delight** `crate-delight` · 3.4M dl · in 1/34 packs
  Useful crates and bags that will save you storage and look great.
- **Diagonal Fences** `diagonal-fences` · 9.9M dl · in 5/34 packs
  Fences connecting diagonally? Wait. That's illegal.
- **Diagonal Walls** `diagonal-walls` · 3.5M dl · in 4/34 packs
  The missing diagonal blocks are here! After all these years. Finally, you have them all.
- **Diagonal Windows** `diagonal-windows` · 3.8M dl · in 4/34 packs
  Now windows are connecting diagonally, too?! This is getting out of hand!
- **Dramatic Doors** `dramatic-doors` · 5.2M dl · in 2/34 packs
  Adds 3-block tall doors! End Endermen Discrimination!
- **Farmer's Delight** `farmers-delight` · 21.2M dl · in 8/34 packs
  A cozy expansion to farming and cooking!
- **Handcrafted** `handcrafted` · 23.4M dl · in 3/34 packs
  Make your house a home!
- **Immersive Paintings** `immersive-paintings` · 4.6M dl · in 3/34 packs
  Drag and drop, pixelate and hang up beautiful art. On servers too.
- **Macaw's Roofs** `macaws-roofs` · 7.0M dl · in 5/34 packs
  Build roofs with actual roofs instead of stairs!
- **Macaw's Trapdoors** `macaws-trapdoors` · 4.0M dl · in 4/34 packs
  Adds vanila trapdoors in every plank variation, and some new trapdoors too!
- **Macaw's Windows** `macaws-windows` · 10.0M dl · in 3/34 packs
  Adds lots of Windows, Mosaic Glass, Blinds, Shutters, Curtains and more...!
- **Overweight Farming** `overweight-farming` · 1.3M dl · in 1/34 packs
  Overweight Farming is a small mod that aims to improve and expand Minecraft's farming and tries to make farming more fun. The prime feature of this mod is the overweight crop which has a very small chance for a vanilla crop to grow into one of these.
- **Quark** `quark` · 21.7M dl · in 2/34 packs
  A Quark is a very small thing. This mod is a collection of small things...
- **Rechiseled** `rechiseled` · 7.1M dl · in 2/34 packs
  Rechiseled allows you to chisel blocks into various decorative blocks with connected textures!
- **Sound Physics Remastered** `sound-physics-remastered` · 48.4M dl · in 5/34 packs
  A Minecraft mod that provides realistic sound attenuation, reverberation, and absorption through blocks.
- **Straw Statues** `straw-statues` · 0.7M dl · in 1/34 packs
  Bring some life to your builds with player statues of your favorite Minecrafters!
- **Supplementaries** `supplementaries` · 24.5M dl · in 2/34 packs
  Vanilla+ additions: Jars, signposts, faucets, weather vanes spring launchers, sconces, planters, lights, decoration and automation
  *Note:* Revived on 1.21. The Fabric ban was Moonlight-chain-vs-Hephaestus load ordering; there is no Tinkers on 1.21, so that interaction cannot occur. Moonlight is already present via Amendments.

### Core Tech (71)

- **Create** `create` · 23.1M dl · in 17/34 packs
  Aesthetic Technology that empowers the Player
- **Create Cobblestone** `create-cobblestone` · 0.6M dl · in 1/34 packs
  Adds a block generating cobblestone using SU, stopping cobblestone generators from eating your frames.
- **Create Compressed** `create-compressed` · 0.6M dl · in 5/34 packs
  Adds full blocks for raw materials. Have less micro-management & more storage space!
- **Create Contraption Terminals** `create-contraption-terminals` · 2.3M dl · in 5/34 packs
  Allows Tom's Simple Storage Terminals to work on Create contraptions.
- **Create Deco** `create-deco` · 6.7M dl · in 9/34 packs
  Industrial decoration themed around the aesthetics of the Create mod.
- **Create Encased** `create-encased` · 2.1M dl · in 4/34 packs
  Allow to use all casing on shafts/cogwheels/pipes
- **Create Goggles** `create-goggles` · 3.0M dl · in 4/34 packs
  Adds Goggle Helmets and Armored Backtanks for Create Mod
- **Create Jetpack** `create-jetpack` · 3.7M dl · in 4/34 packs
  Upgrade your backtank and utilize the pressurized air to fly
- **Create Mechanical Extruder** `create-mechanical-extruder` · 0.7M dl · in 2/34 packs
  A mechanical extruder block. Can be used to generate any block or item from adjacent blocks/fluids.
- **Create Mechanical Spawner** `create-mechanical-spawner` · 0.8M dl · in 2/34 packs
  A mechanical spawner block. Generates Mobs with rotation power. This mod it's meant to be used in modpacks.
- **Create Ore Excavation** `create-ore-excavation` · 3.1M dl · in 5/34 packs
  Extract resources using machines powered by Rotational Force
- **Create Railways Navigator** `create-railways-navigator` · 1.8M dl · in 4/34 packs
  A Minecraft Create Mod addon that adds several new features related to train navigation, such as improved display boards, a navigator for searching routes, new schedule entries, and more.
- **Create Sifting** `create-sifting` · 0.8M dl · in 1/34 packs
  A sifter block for the amazing Create mod
- **Create Slice & Dice** `slice-and-dice` · 6.6M dl · in 5/34 packs
  Making automation for Farmers Delight more sensible
- **Create Stuff 'N Additions** `create-stuff-additions` · 2.4M dl · in 4/34 packs
  🧲 Dominate your environment with Create technology
- **Create Train Lights** `create-train-lights` · 0.0M dl · in 1/34 packs
  Create addon that adds custom interior and head tail lights for trains that automatically switch between headlight and tail light depending on the direction of travel.
- **Create Train Utilities** `create-trainutilities` · 0.3M dl · in 2/34 packs
  Create Addon that adds custom sliding doors with realistic opening & closing sounds, platform blocks and building blocks for stations and trains.
  *Note:* 3.0.3 (newest) references create:conducter as an advancement parent, but Create 6.0.10 renamed it to create:conductor — fixing their old typo. Three advancements fail to load: door_ingrediants, doors, incomplete_prototype_door. Cosmetic only (the advancements just do not appear); the sliding-door content works. No newer build exists. Kept deliberately.
- **Create: Bells & Whistles** `bellsandwhistles` · 4.2M dl · in 12/34 packs
  Additions and adornments for the modern Create engineer. Available for both Fabric & Forge!
- **Create: Big Contraptions** `big-contraptions` · 0.9M dl · in 2/34 packs
  Lets you carry and render contraptions with lots of data
- **Create: Bits 'n' Bobs** `create-bits-n-bobs` · 1.3M dl · in 7/34 packs
  Decorative and mechanical additions to create!
- **Create: Bitterballen** `create-bitterballen` · 0.9M dl · in 3/34 packs
  Create: Bitterballen Is an addon for Create which adds Dutch snacks.
- **Create: Blocks & Bogies** `blocks-bogies` · 0.8M dl · in 5/34 packs
  Adds larger train bogies with (and without) valve gear, and more
- **Create: Central Kitchen** `create-central-kitchen` · 4.7M dl · in 5/34 packs
  Offering more tools and methods to automate food processing of other mod in Create.
- **Create: Compatible Storage** `create-compatible-storage` · 1.1M dl · in 2/34 packs
  Having issues with Quark's chests on Create contraptions? This mod fixes them and much more.
- **Create: Connected** `create-connected` · 5.6M dl · in 6/34 packs
  QoL blocks that you wish existed in Create - Highly configurable, disable what you don't need
- **Create: Copper & Zinc** `create-copper-zinc` · 1.1M dl · in 5/34 packs
  An addon for the Create mod providing recipes for Veridium and Asurine, to give the player renewable sources of Copper and Zinc.
- **Create: Copycats+** `copycats` · 9.0M dl · in 13/34 packs
  All the copycats you've ever wanted, combined into a single mod!
- **Create: Curios Jetpack & Backtank** `create-curios-jetpack` · 0.5M dl · in 2/34 packs
  Use Create jetpack and backtanks in Curios/Trinkets back slot.
- **Create: Design n' Decor** `create-design-n-decor` · 3.9M dl · in 4/34 packs
  a create addon that adds decor blocks to spice up your factory!
  *Note:* Revived on 1.21. The 1.20.1 build pinned create=0.5.1-f exactly and hard-failed; 2.2b declares [6.0.4,).
- **Create: Dragons Plus** `create-dragons-plus` · 2.3M dl · in 6/34 packs
  Provide convenient features to players and dev utilities for Create addon developers.
- **Create: Dreams & Desires** `create-dreams-and-desires` · 3.1M dl · in 5/34 packs
  A mod that adds random stuff & that may try to fit within creates theme!
- **Create: Easy Stone Generators** `create-stone-generators` · 0.2M dl · in 4/34 packs
  Easier, lag-free stone generators using Create. Includes Cobblestone, Smooth Stone, Obsidian, Basalt, Limestone and Scoria generators.
- **Create: Easy Structures** `create-easy-structures` · 0.6M dl · in 6/34 packs
  A mod that adds some structures to Minecraft which have Create mod blocks included.
- **Create: Enchantable Machinery** `create-enchantable-machinery` · 0.4M dl · in 3/34 packs
  This mod allows you to apply some vanilla enchantment to Create blocks.
- **Create: Enchantment Industry** `create-enchantment-industry` · 4.9M dl · in 7/34 packs
  Automatic Enchanting, with Create
- **Create: Ender Transmission** `create-ender-transmission` · 0.7M dl · in 4/34 packs
  Undimensional Machines
- **Create: Escalated** `escalated` · 0.7M dl · in 5/34 packs
  A mod to add functional, aesthetic, and rotation-powered escalators to Create.
- **Create: Extended Wrenches** `extended-wrenches` · 0.6M dl · in 4/34 packs
  Modify your Create wrench to fit your aesthetic
- **Create: Extra Gauges** `extra-gauges` · 0.4M dl · in 4/34 packs
  Adds new gauges to handle complex logics!
- **Create: Factory** `create-factory` · 1.0M dl · in 3/34 packs
  🍬 A lot of new foods added to Create!
- **Create: Food** `create-food` · 0.9M dl · in 3/34 packs
  Create: Food is an add-on based on expanding food content found in Minecraft.
- **Create: Framed** `create-framed` · 2.2M dl · in 5/34 packs
  A Create mod addon that adds more Framed Glass variants.
- **Create: Interiors** `interiors` · 4.1M dl · in 8/34 packs
  A complement to the Create mod that adds new furniture.
- **Create: Let The Adventure Begin** `create-let-the-adventure-begin` · 1.1M dl · in 4/34 packs
  A addon that implements many unique and balanced, create themed structures
- **Create: Liquid Fuel** `create-liquid-fuel` · 1.5M dl · in 6/34 packs
  Pump in liquid fuel to blaze burners
- **Create: Misc and Things** `create-misc-and-things` · 1.6M dl · in 3/34 packs
  🔧 Add useful and fun things to Create
- **Create: Molten Vents** `create-molten-vents` · 0.7M dl · in 4/34 packs
  Adds a renewable source of the orestones found in the Create mod, and by extension, many resources.
- **Create: More Drill Heads** `create-more-drill-heads` · 0.2M dl · in 1/34 packs
  More drill heads for faster mining machines!
- **Create: Numismatics** `numismatics` · 1.2M dl · in 7/34 packs
  Aesthetic & Functional Create styled currency mod
- **Create: Oxidized** `create_oxidized` · 1.9M dl · in 10/34 packs
  QoL addon for Create, which adds oxidizing recipes to all copper blocks
- **Create: Pattern Schematics** `create-pattern-schematics` · 1.6M dl · in 9/34 packs
  Build with repeating schematics!
- **Create: Power Loader** `create-power-loader` · 2.3M dl · in 5/34 packs
  A Create mod add-on adding immersive chunk loaders.
- **Create: Sound of Steam** `create-sound-of-steam` · 0.5M dl · in 8/34 packs
  A Create addon that adds pipe organs!
- **Create: Stam1o Tweaks** `create-stam1o-tweaks` · 0.2M dl · in 2/34 packs
  Tweaks to Create and Minecraft for Stam1o, Developed and Published by - LieOn Studios
  *Note:* Revived on 1.21. Rejected on 1.20.1 as a 2024 build with no create dependency; 1.0.8 declares [6.0.0,).
- **Create: Structures Arise** `create-structures-arise` · 1.2M dl · in 5/34 packs
  This mod added 28 new create structures to your minecraft world.
- **Create: Trading floor** `create-trading-floor` · 1.5M dl · in 6/34 packs
  Automate trading with villagers using create!
- **Create: Trimmed** `create-trimmed` · 0.8M dl · in 4/34 packs
  A mod that allows Create's materials to be used as armour trim materials.
- **Create: Tweaked Controllers** `create-tweaked-controllers` · 1.1M dl · in 3/34 packs
  An addon for the Create Minecraft mod that adds a way of controlling contraptions using an advanced controller
- **Create: Ultimate Factory** `create-ultimate-factory` · 1.0M dl · in 6/34 packs
  An addon for the Create mod developed to increase automation possibilities, adding 30 (reasonably) balanced recipes to the game.
- **Create: Vibrant Vaults** `create-vibrant-vaults` · 0.7M dl · in 7/34 packs
  A Create mod addon that adds more item vaults.
- **Delightful Creators** `delightful-creators` · 1.2M dl · in 1/34 packs
  Making automation between Farmer's Delight and Create
- **EnderChests** `enderchests` · 0.8M dl
  Adds linked Chests and Bags that share inventory. Can be Public, Personal, or Team, each with their own set of storage available. Works across dimensions.
- **EnderTanks** `endertanks` · 0.7M dl
  Adds linked Tanks and Buckets that share inventory. Can be Public, Personal, or Team, each with their own set of storage available. Works across dimensions.
- **Hopper Gadgetry** `hopper-gadgetry` · 0.6M dl
  Ready to build smarter, and cheaper contraptions? New hoppers are here to complement your lineup.
- **Rechiseled: Create** `rechiseled-create` · 2.7M dl · in 2/34 packs
  Rechiseled: Create adds new decorative variants of blocks in Create!
- **Sophisticated Backpacks** `sophisticated-backpacks` · 16.3M dl · in 3/34 packs
  Yet another backpack mod this time with backpack you can place in world, color in different color combinations, upgrade with more inventory and enhance with many functional upgrades
- **Sophisticated Storage** `sophisticated-storage` · 4.1M dl · in 1/34 packs
  Storage mod with multiple tiers and functional upgrades
- **Sophisticated Storage in Motion** `sophisticated-storage-in-motion` · 0.2M dl
  A Sophisticated Storage add on which allows using storage blocks with minecarts and in the future with other entities
- **Storage Drawers** `storagedrawers` · 3.4M dl · in 5/34 packs
  Interactive bulk storage solution
- **Tom's Simple Storage Mod** `toms-storage` · 17.9M dl · in 2/34 packs
  Simple vanilla style storage mod
- **Wider Ender Chests** `wider-ender-chests` · 0.5M dl · in 1/34 packs
  Craft new ender chests and unlock additional inventory slots!

### Exploration (4)

- **Explorer's Compass** `explorers-compass` · 10.4M dl · in 3/34 packs
  Allows you to locate structures anywhere in the world.
- **Nature's Compass** `natures-compass` · 23.5M dl · in 6/34 packs
  Allows you to locate biomes anywhere in the world.
- **Xaero's Minimap** `xaeros-minimap` · 100.0M dl · in 5/34 packs
  Displays a map of the nearby world terrain, players, mobs, entities in the corner of your screen. Lets you create waypoints which help you find the locations you've marked.
- **Xaero's World Map** `xaeros-world-map` · 87.6M dl · in 5/34 packs
  Adds a full screen world map which shows you what you have explored in the world. Works great together with Xaero's Minimap.

### Libraries (15)

- **Architectury API** `architectury-api` · 90.9M dl · in 18/34 packs
  An intermediary api aimed to ease developing multiplatform mods.
- **Balm** `balm` · 53.7M dl · in 3/34 packs
  Abstraction Layer for Multi-Loader Mods
- **Cloth Config API** `cloth-config` · 151.5M dl · in 20/34 packs
  Configuration Library for Minecraft Mods
- **Curios API** `curios` · 28.3M dl · in 16/34 packs
  A flexible and expandable accessory/equipment API for users and developers.
- **Fusion (Connected Textures)** `fusion-connected-textures` · 13.1M dl · in 4/34 packs
  Fusion allows resource packs to use additional texture and model types such as connected textures!
- **Fzzy Config** `fzzy-config` · 33.8M dl · in 9/34 packs
  Config API with automatic GUIs, powerful validation options, server-client sync, and more!
- **Geckolib** `geckolib` · 62.1M dl · in 7/34 packs
  A 3D animation library for entities, blocks, items, armor, and more!
- **playerAnimator** `playeranimator` · 24.6M dl · in 6/34 packs
  animate the player
- **Puzzles Lib** `puzzles-lib` · 55.8M dl · in 8/34 packs
  Why is it called Puzzles? That's the puzzle.
- **Searchables** `searchables` · 34.9M dl · in 13/34 packs
  Searchables is a library mod that adds helper methods that allow for searching and filtering elements based on components, as well as offering built in auto-complete functionality.
- **ShetiPhianCore** `shetiphiancore` · 1.2M dl
  Required for ShetiPhians Mods
- **Sophisticated Core** `sophisticated-core` · 16.1M dl · in 2/34 packs
  Library mod for Sophisticated mods
- **SuperMartijn642's Config Lib** `supermartijn642s-config-lib` · 29.0M dl · in 7/34 packs
  Config Lib makes dealing with config files just a bit easier.
- **SuperMartijn642's Core Lib** `supermartijn642s-core-lib` · 15.8M dl · in 5/34 packs
  SuperMartijn642's Core Lib adds lots of basic implementations that allow for similar code between different Minecraft versions!
- **YetAnotherConfigLib (YACL)** `yacl` · 110.1M dl · in 17/34 packs
  A builder-based configuration library for Minecraft!

### Miscellaneous (3)

- **Carry On** `carry-on` · 23.2M dl · in 4/34 packs
  Carry On allows you to pick up Tile Entities and Mobs and carry them around!
- **Corpse** `corpse` · 4.0M dl · in 5/34 packs
  Never lose your items again!
- **Packet Fixer** `packet-fixer` · 25.7M dl · in 4/34 packs
  A simple mod to fix various problems with packets, nbt and timeouts.

### Performance (18)

- **AI Improvements** `ai-improvements` · 12.3M dl · in 3/34 packs
  Performance improvements for vanilla AI, with the ability to turn off certain AI behaviors
- **Alternate Current** `alternate-current` · 10.2M dl · in 4/34 packs
  An efficient and non-locational redstone dust implementation
- **BadOptimizations** `badoptimizations` · 37.6M dl · in 9/34 packs
  Optimization mod that focuses on things other than rendering
- **Clumps** `clumps` · 34.4M dl · in 9/34 packs
  Clumps XP orbs together to reduce lag
- **Create: Threaded Trains** `create-threaded-trains` · 0.8M dl · in 3/34 packs
  A mod that runs all calculations of the railway network on a separate thread parallel to the server tick, which greatly improves performance, especially in large networks.
- **Cull Leaves** `cull-leaves` · 8.8M dl · in 1/34 packs
  Adds culling to leaf blocks, providing a huge performance boost over vanilla.
- **Distant Horizons** `distanthorizons` · 31.4M dl · in 3/34 packs
  Massively increase render distance without harming performance.
- **Dynamic FPS** `dynamic-fps` · 59.7M dl · in 9/34 packs
  Reduce resource usage while Minecraft is in the background, idle, or on battery.
- **Entity Culling** `entityculling` · 147.9M dl · in 7/34 packs
  Using async path-tracing to hide Block-/Entities that are not visible
- **FerriteCore** `ferrite-core` · 136.9M dl · in 18/34 packs
  Memory usage optimizations
- **ImmediatelyFast** `immediatelyfast` · 111.9M dl · in 5/34 packs
  Speed up immediate mode rendering in Minecraft
- **Let Me Despawn** `lmd` · 21.3M dl · in 3/34 packs
  Improves performance by tweaking mob despawn rules. Say bye to pesky unintentional persistent mobs.
- **ModernFix** `modernfix` · 71.4M dl · in 3/34 packs
  All-in-one mod that improves performance, reduces memory usage, and fixes many bugs. Compatible with all your favorite performance mods!
- **More Culling** `moreculling` · 59.1M dl · in 3/34 packs
  A mod that changes how multiple types of culling are handled in order to improve performance
- **Noisium** `noisium` · 23.2M dl · in 5/34 packs
  Optimises worldgen performance for a better gameplay experience.
- **Remove Reloading Screen** `rrls` · 23.4M dl · in 1/34 packs
  Makes resource packs load in the background, allowing you to do other things while waiting!
- **ServerCore** `servercore` · 13.7M dl · in 1/34 packs
  A mod that aims to optimize the minecraft server.
- **Sodium** `sodium` · 202.3M dl · in 9/34 packs
  A high-performance rendering engine replacement for Minecraft, which greatly improves frame rates and reduces micro-stutter.
  *Note:* Veil requires Sodium >=0.8.12; the newest release channel build is older.

### Pretty (12)

- **[EMF] Entity Model Features** `entity-model-features` · 87.0M dl · in 5/34 packs
  EMF is an, OptiFine format, Custom Entity Model replacement mod available for Fabric and Forge.
- **[ETF] Entity Texture Features** `entitytexturefeatures` · 91.9M dl · in 11/34 packs
  Emissive, Random & Custom texture support for entities in resourcepacks just like Optifine but for Fabric
- **Cool Rain Reforged** `cool-rain-reforged` · 0.2M dl · in 7/34 packs
  Creates ambient sounds for certain blocks during rain
- **Embeddium Extra (Sodium Extra equiv)** `rubidium-extra` · 7.7M dl
  Port of Sodium Extra to work with Embeddium/Rubidium on (Neo)Forge
- **Falling Leaves (NeoForge/Forge)** `fallingleavesforge` · 5.0M dl · in 5/34 packs
  Adds a neat little particle effect to leaf blocks 
- **Iris Shaders** `iris` · 157.7M dl · in 11/34 packs
  A modern shader pack loader for Minecraft intended to be compatible with existing OptiFine shader packs
- **Just Zoom** `just-zoom` · 8.4M dl · in 4/34 packs
  Zoom by pressing a hotkey and adjust the zoom factor with your mouse wheel!
- **LambDynamicLights - Dynamic Lights** `lambdynamiclights` · 51.2M dl · in 4/34 packs
  Adds dynamic lights to Minecraft as the most feature-complete and optimized dynamic lighting mod.
- **Model Gap Fix** `modelfix` · 30.7M dl · in 6/34 packs
  Fixes gaps in Block Models and Item Models
- **Not Enough Animations** `not-enough-animations` · 78.2M dl · in 5/34 packs
  Bringing first-person animations to the third-person
- **Reese's Sodium Options** `reeses-sodium-options` · 73.4M dl · in 6/34 packs
  Alternative Options Menu for Sodium
- **Sodium Extra** `sodium-extra` · 87.5M dl · in 5/34 packs
  A Sodium addon that adds features that shouldn't be in Sodium.

### QoL (44)

- **3D Skin Layers** `3dskinlayers` · 68.4M dl · in 4/34 packs
  Render the player skin layer in 3d!
- **Advancement Plaques** `advancement-plaques` · 15.7M dl · in 5/34 packs
  Replace those boring advancement popups with something flashier.
- **AppleSkin** `appleskin` · 80.8M dl · in 13/34 packs
  Food/hunger-related HUD improvements
- **Better Advancements** `better-advancements` · 23.5M dl · in 7/34 packs
  Better Advancements tries to improve the UI and UX for the advancements system in minecraft 1.12+ in a modded environment
- **BetterF3** `betterf3` · 31.2M dl · in 5/34 packs
  BetterF3 is a mod that replaces Minecraft's original debug HUD with a highly customizable, more human-readable HUD.
- **Charm of Undying** `charm-of-undying` · 8.2M dl · in 2/34 packs
  Adds accessory support for the Totem of Undying so you can place it in a slot and don't have to be holding it. Formerly known as Curio of Undying and Trinket of Undying.
- **Chat Heads** `chat-heads` · 44.4M dl · in 5/34 packs
  See who you're chatting with!
- **Controlling** `controlling` · 34.8M dl · in 11/34 packs
  Adds a search bar to the Key-Bindings menu
- **Create: Quality of Life** `create-qol` · 0.1M dl · in 2/34 packs
  Adds quality of life things for Create Mod
- **Create: SchematicChecker** `createschematicchecker` · 0.3M dl · in 1/34 packs
  A mod for fix all schematic problem from Create and all addon!
  *Note:* Revived on 1.21. The 1.20.1 build's interceptSlot1 redirector found no target in Create 6.0.8; 2.27.37 declares [6.0.1,).
- **Cubes Without Borders** `cubes-without-borders` · 24.5M dl · in 6/34 packs
  Allows you to play Minecraft in a borderless fullscreen window.
- **Cut Through** `cut-through` · 15.8M dl · in 5/34 packs
  Cleanly swing through transparent blocks like tall grass to hit mobs without breaking said block.
- **Dynamic Crosshair** `dynamiccrosshair` · 19.4M dl · in 3/34 packs
  A mod that hides or changes the crosshair dependent on context
- **Easy Anvils** `easy-anvils` · 14.9M dl · in 5/34 packs
  Overhauled anvils with stored items, fairer costs, and no more frustrating repair penalties.
- **Easy Magic** `easy-magic` · 12.5M dl · in 4/34 packs
  Enchanting tables as they always should have been! Items stay after closing, and easy re-rolls.
- **Elytra Slot** `elytra-slot` · 12.7M dl · in 3/34 packs
  Adds accessory support to the elytra so you can fly and wear chest armor at the same time. Formerly known as Curious Elytra and Elytra Trinket.
- **EMI** `emi` · 25.8M dl · in 9/34 packs
  A featureful and accessible item and recipe viewer
- **EMI Addon: Extra Mod Integrations** `extra-mod-integrations` · 4.0M dl · in 5/34 packs
  EMI addon adding support for as many mods as possible
- **EMI Enchanting** `emi-enchanting` · 7.6M dl · in 4/34 packs
  EMI Plugin that gives basic enchantment information; valid items, exlcusions, etc.
- **EMI Loot** `emi-loot` · 8.1M dl · in 6/34 packs
  A loot drop (chest, block, entity) plugin for the EMI Recipe and Item viewer.
- **EMI Ores** `emi-ores` · 6.5M dl · in 3/34 packs
  Easily view ore generation information from inside EMI.
- **EMI professions (EMIP)** `emi-professions-(emip)` · 4.5M dl · in 3/34 packs
  An EMI addon that adds profession workstations
- **EMI: Create Schematics** `emi-create-schematics` · 0.4M dl · in 6/34 packs
  Add schematic items to EMI Favourites list
- **Enchantment Descriptions** `enchantment-descriptions` · 34.1M dl · in 4/34 packs
  Provides a way to get enchantment descriptions from enchanted books.
- **Fog Overrides** `fogoverrides` · 7.7M dl · in 1/34 packs
  Fog control for Minecraft made easy
- **Inventory Essentials** `inventory-essentials` · 1.9M dl · in 1/34 packs
  The most essential inventory tweaks. Now with sorting!
- **InvMove** `invmove` · 15.3M dl · in 1/34 packs
  Adds the ability to walk around while in inventories
- **Jade 🔍** `jade` · 61.7M dl · in 15/34 packs
  Shows information about what you are looking at. (Hwyla/Waila fork for Minecraft 1.16+)
- **Jade Addons (Neo/Forge)** `jade-addons-forge` · 4.8M dl · in 10/34 packs
  Jade 🔍's additional mod supports for Neo/Forge
- **Lootr** `lootr` · 20.3M dl · in 3/34 packs
  A mod that makes it so nobody misses out on Loot! All loot chests are instanced per player and visually unique.
- **Mouse Tweaks** `mouse-tweaks` · 52.4M dl · in 16/34 packs
  Enhances inventory management by adding various functions to the mouse buttons. 
- **Not Enough Crashes** `notenoughcrashes` · 13.5M dl · in 5/34 packs
  When crashing, you can go back to the title screen and keep playing, without needing to restart, alongside other things to make crashes more pleasant.
- **Particle Core** `particle-core` · 13.7M dl · in 1/34 packs
  Particle optimizations: Culling, rendering optimizations, configurable particle-type-specific spawn reduction, and potion particle disabling. Compatible with Sodium, improves performance over Sodium alone.
- **Ping Wheel** `ping-wheel` · 12.0M dl · in 2/34 packs
  Allows players to temporarily mark locations and entities
- **Polymorph** `polymorph` · 22.8M dl · in 6/34 packs
  No more recipe conflicts! Adds an option to choose the crafting result if more than one is available.
- **Quick Right-Click** `quick-right-click` · 0.2M dl
  ✋ Adds a portable functionality to certain items, which allows for quick access without placement. Works with beds, crafting tables, ender chests and shulker boxes among others.
- **RightClickHarvest** `rightclickharvest` · 11.1M dl · in 4/34 packs
  Allows you to harvest crops with right click
- **Shulker Box Tooltip** `shulkerboxtooltip` · 33.6M dl · in 5/34 packs
  View the contents of shulker boxes from your inventory
- **Smarter Farmers (farmers replant)** `smarter-farmers-farmers-replant` · 11.3M dl · in 4/34 packs
  Allows villagers to replant the correct seed & allows them to use modded ones
- **TrashSlot** `trashslot` · 5.0M dl · in 2/34 packs
  Adds a trash slot to the inventory screen that allows deletion of unwanted items.
- **VeinMiner** `veinminer` · 69.9M dl · in 1/34 packs
  Mine the whole vein on mining a single ore/block. Make the tedious mining experience to something satisfying and fun!
- **Visual Workbench** `visual-workbench` · 23.7M dl · in 4/34 packs
  Items stay inside of crafting tables and are also rendered on top. It's really fancy!
- **What Are They Up To (Watut)** `what-are-they-up-to` · 13.7M dl · in 3/34 packs
  Lets you see if players are typing, in a GUI, idle, with cool ingame visuals
- **Yeetus Experimentus** `yeetus-experimentus` · 16.8M dl · in 4/34 packs
  Disable's the Experimental Settings popup, which appears when you create or load world.

### Server Management (4)

- **Chunky** `chunky` · 16.0M dl · in 6/34 packs
  Pre-generates chunks, quickly and efficiently
- **e4mc** `e4mc` · 21.1M dl · in 4/34 packs
  Open a LAN server to anyone, anywhere, anytime.
- **No Chat Reports** `no-chat-reports` · 52.6M dl · in 7/34 packs
  Makes chat unreportable (where possible)
- **Open Parties and Claims** `open-parties-and-claims` · 20.1M dl · in 1/34 packs
  Adds the ability to claim chunks and make player parties, integrates with Xaero's Minimap and World Map

### Utility (6)

- **AttributeFix** `attributefix` · 20.0M dl · in 3/34 packs
  Removes arbitrary limits on Minecraft's attribute system. Fixes MANY mods!
- **Easy Villagers** `easy-villagers` · 1.5M dl · in 1/34 packs
  Never get annoyed by villagers again!
  *Note:* Revived on 1.21. Rejected only because no Fabric 1.20.1 build existed; NeoForge 1.21.1 has one.
- **Simple Voice Chat** `simple-voice-chat` · 61.6M dl · in 2/34 packs
  A working voice chat in Minecraft!
- **spark** `spark` · 19.8M dl · in 7/34 packs
  spark is a performance profiler for Minecraft clients, servers and proxies.
- **Traveler Tool Belt** `traveler-tool-belt` · 0.1M dl
  Upgradeable Tool Belt with intuitive quick-swap, Curios API/Trinkets integration and more!
- **Vanilla Backport** `vanillabackport` · 7.7M dl · in 3/34 packs
  Backports modern minecraft features to previous versions, trying to keep it as accurate as vanilla Minecraft

### World Gen (2)

- **Geophilic** `geophilic` · 9.5M dl · in 2/34 packs
  A subtle-ish overhaul of vanilla Overworld biomes! Reworked!
- **Terralith** `terralith` · 20.9M dl · in 5/34 packs
  Explore almost 100 new biomes consisting of both realism and light fantasy, using just Vanilla blocks. Complete with several immersive structures to compliment the overhauled terrain.

## Banned — hard failures

Each of these broke something observable: a loader abort, a mixin with no target,
a declared incompatibility, or a crash. None are judgement calls.

- **Continuity** `continuity` · 66.5M dl
  A Minecraft mod that allows for efficient connected textures
  **Failure:** Fabric-only; runs via Sinytra Connector on NeoForge and crashes on EVERY item render. EmissiveItemQuadTransform.transform throws NPE (SpriteFinder.find null) inside Sodium's FRAPI item path — caught rendering Create's menu button icon. Redundant anyway: Fusion provides connected textures natively on NeoForge with 39 builds. Found by jointest.js screenshot, not by any log check.
- **Create Fabric Sodium Fix** `create-fabric-sodium-fix` · 1.3M dl
  A fork of Create Fabric that supports Sodium 0.5+
  **Failure:** Not a patch — it is a FORK of Create Fabric 0.5.1-d that declares the same Fabric mod id `create`. Shipping it next to Create 6.0.8.1 gives the loader two `create` mods and it aborts at startup. Obsolete anyway: Create 6 supports Sodium 0.5+ natively.
- **Create Nuclear** `createnuclear` · 0.8M dl
  A Create addon that adds nuclear reactors to Create, along with all the dangers associated with radiation!
  **Failure:** Nuclear power generation (energy/electricity) — excluded.
- **Create Ultimine** `create-ultimine` · 1.2M dl
  A Create mod addon that supports FTB Ultimine functionality
  **Failure:** Bridge mod requiring FTB Ultimine (ftbultimine >=2101.1.14), which the pack does not ship — VeinMiner already covers vein mining. The FTB dependency is not declared on Modrinth, so only a boot catches it.
- **Create: Power Grid** `power-grid` · 0.8M dl
  Providing electricity to a world near you
  **Failure:** Electricity distribution for Create — excluded.
- **Create: Shuffle Filter Fabric** `create-shuffle-filter-fabric` · 0.0M dl
  An unofficial Fabric 1.20.1 fork of agent772's Create: Shuffle Filter
  **Failure:** Mixin MixinFilterItem @Injects into FilterItem.getFilterItems with a Porting Lib ItemStackHandler return type. That signature no longer exists in Create 6.0.8.1, so the mixin fails to apply, Create's AllItems/AllBlocks clinit dies, and every Create addon cascades with NoClassDefFoundError. Declares no create dependency, so no static check catches it — confirmed only by launching.
- **Create: The Factory Must Grow** `create-tfmg` · 1.6M dl
  Heavy Engineering & Oil For The Create Mod
  **Failure:** Heavy industry addon with an electricity layer — excluded with the other electricity mods.
- **Embeddium** `embeddium` · 31.4M dl
  A powerful, mod-friendly, FOSS client performance mod for NeoForge
  **Failure:** Legacy Forge rendering fork. On 1.21.1 NeoForge both Sodium and Iris ship native builds, and Veil requires Sodium >=0.8.12 explicitly ('Veil supports Sodium 0.8.12-alpha.2+mc1.21.1 and above'). Embeddium conflicts with both Veil and Iris. Replaced by Sodium + Iris.
- **Item Borders** `item-borders` · 7.9M dl
  Add colored borders to inventory slots to make your rare items stand out!
  **Failure:** Mixin conflict: duplicate event invoker crash with Iceberg/Prism.
- **Krypton** `krypton` · 38.1M dl
  A mod to optimize the Minecraft networking stack
  **Failure:** Packet optimization now handled by Fabric Loader 0.18.4; previously conflicted with ThreadTweak.
- **Radium** `radium` · 5.9M dl
  Radium is an Unofficial Fork of CaffeineMC's "Lithium", made to work with Forge Mod Loader.
  **Failure:** Create declares a hard incompatibility with Radium on 1.21.1 ('Mod create is incompatible with radium any'). Declared in mods.toml, not Modrinth metadata, so only a boot catches it.

## Removed — unavailable, redundant, or a design decision

- **Better Combat** `better-combat` · 15.3M dl
  ⚔️ Easy, spectacular and fun melee combat system from Minecraft Dungeons.
  **Reason:** Only Combat-category mod in a pack with no dungeon/mob/adventure content, and its attack handling overlaps Hephaestus weapon mechanics.
- **Carrier** `carrier` · 0.0M dl
  Carrier allows you to easily transport chests, mobs and spawners at the expense of slowness and increased hunger.
  **Reason:** Duplicates Carry On, which is already in the pack.
- **Chipped** `chipped` · 20.5M dl
  Every block deserves a friend.
  **Reason:** Overlaps Rechiseled (both add block variants). Kept Rechiseled because the pack also ships Rechiseled: Create, which bridges it to Create's palettes — Chipped has more raw downloads but no Create integration.
- **Chunk Loaders** `chunk-loaders` · 1.5M dl
  Chunk Loaders allows you keep chunks loaded with different tiers of chunk loaders!
  **Reason:** Redundant with Create: Power Loader, which does the same job Create-natively (loaders driven by rotational power) and has higher adoption. Same reasoning as keeping Rechiseled over Chipped: in a Create pack, the mod that plugs into Create's progression wins. Chunky stays — it pre-generates terrain, which is a different job from runtime chunk loading.
- **Clockwork / Create: Interactive** `create-clockwork` · 2.1M dl
  The power of mechanical contraptions meets the wackiness of physics — with a magical twist!
  **Reason:** Both require Valkyrien Skies. VS2 is a large physics framework with a big performance and stability surface; not worth the risk in this pack. Revisit if you want buildable vehicles badly enough to test it in isolation.
- **Corail Tombstone** `corail-tombstone` · 0.0M dl
  Keeps safe your inventory items in graves on death, with many features for better survivability and exploration, in a medieval fantasy atmosphere related to the decorative grave & the haunting souls.
  **Reason:** Swapped for Corpse (8/34 reference packs). Tombstone is a large magic-flavoured death system; Corpse just leaves a body holding your items, which fits a Create pack better.
- **Create Aeronautics** `create-aeronautics` · 6.1M dl
  Build anything from airships to planes and cars!
  **Reason:** Flying contraptions — not wanted.
- **Create Big Cannons** `create-big-cannons` · 6.6M dl
  A Minecraft mod for building large cannons with the Create mod.
  **Reason:** Cannons/artillery — not wanted.
- **Create Encased** `createencased`
  **Reason:** No Fabric 1.20.1 build on Modrinth (SuperMartijn642 stopped at Forge). Nearest Fabric equivalent is 'Create: Transmission!' — different mod, not a drop-in.
- **Create Propulsion: Simulated** `create-propulsion-simulated` · 0.5M dl
  Port of Create: Propulsion mod to NeoForge 1.21.1 with support of Sable and Create: Aeronautics
  **Reason:** Propellers/thrusters for contraptions — same flying-contraption family as Aeronautics.
- **Create Stuff 'N Additions** `create-stuff-n-additions`
  **Reason:** No Modrinth project with a Fabric 1.20.1 build.
- **Create Track Map** `create-track-map` · 0.4M dl
  A web-based track map of your world's Create train system, complete with signals, stations, and trains moving in real time.
  **Reason:** Only 1.20.1 build is 2023-10-19, pre-Create-6.
- **Create Utilities** `create-utilities` · 2.1M dl
  A Create Addon that primarily adds ender-like blocks. Experience the power of the void motor, void chest, and void tank as you effortlessly transport rotation, items and fluids.
  **Reason:** Re-checked on request: still has no NeoForge 1.21.1 build. Its newest builds stop at 1.20.1.
- **Create: Addon Compatibility** `createaddoncompatibility` · 0.3M dl
  Adds compatibility for and between different create addons.
  **Reason:** Ships 8 data/tfmg/ recipes that fail to parse because TFMG is excluded as an electricity mod (8 RecipeManager errors every startup). Its only other content is 3 Copycats item tags that nothing in this pack consumes. Its purpose is bridging addons we deliberately do not have, so it is net negative.
- **Create: Deployer API** `create-deployer-api`
  **Reason:** Not on Modrinth at all.
- **Create: Extra Gauges** `create-extra-gauges`
  **Reason:** Not on Modrinth at all.
- **Create: Hypertubes** `hypertube` · 0.9M dl
  Travel arround the world with tubes!
  **Reason:** Hypertube transport — not wanted.
- **Create: Radars** `create-radars` · 1.2M dl
  Adding Radars (& more) to Create!
  **Reason:** Hard-requires createbigcannons >=5.11.2, which was dropped on request. Radars is a targeting addon for the cannons, so it goes with them.
- **Create: Recycling** `create-recycling` · 0.0M dl
  Recycle: effortlessly auto-generate Create crushing wheel recycling recipes for any mod via a datapack.
  **Reason:** Pins create to exactly 0.5.1-j-build.1631+mc1.20.1 — the same unsatisfiable-pin signature as Design n' Decor and Create: Storage.
- **Create: Sophisticated Backpacks** `create-sophisticated-backpacks` · 1.6M dl
  Sophisticated Backpacks but Creatified!
  **Reason:** No NeoForge 1.21.1 build — the Create/Sophisticated Backpacks bridge stops earlier.
- **Create: Storage** `fxnt-create-storage` · 0.1M dl
  A lightweight storage addon for the Create Mod featuring Storage Boxes and Backpacks
  **Reason:** fabric.mod.json pins create to exactly 0.5.1-f-build.1417 — the same unsatisfiable pin that made Design n' Decor hard-fail at startup.
- **Create: Teleporters** `create-teleporters` · 0.1M dl
  Create Teleporters Remastered is a complete rebuild of the original Create Teleporters mod. Redesigned to fit in more with the new aesthetics of the Create Mod and to be simpler to use. This remastered version fixes old bugs and refines the mechanics.
  **Reason:** Teleportation — not wanted, and it undercuts the rail investment the same way Waystones did.
- **Dynamic Lights** `dynamic-lights` · 6.9M dl
  Supported entities and items such as torches, lanterns, or enchanted gear emit light! Server-side!
  **Reason:** Swapped for LambDynamicLights (51M downloads, in 6/34 reference packs, native NeoForge 1.21.1). Same feature, far better maintained — this was a 1.20.1-era mapping choice.
- **Gravestone Mod** `gravestone`
  **Reason:** Slug does not exist; and Forgotten Graves already fills this role. Two grave mods conflict on the death-drop event.
- **Just Enough Resources** `just-enough-resources-jer` · 6.2M dl
  JEI integration that adds info on mobs, world gen, villagers and many more!
  **Reason:** Hard-requires JEI, which would ship a second recipe viewer alongside EMI. EMI Ores + EMI Loot cover the same ground.
- **Ledger** `ledger` · 0.3M dl
  A serverside logging mod
  **Reason:** Breaks Vein Mining: with Ledger present, SpectreLib's preLaunch stage fails with ServiceConfigurationError on veinmining's FabricPlatform (no usable no-arg constructor), aborting startup. Bisected in the smoketest workspace — the other four additions boot fine together. Downgrading Vein Mining to 1.4.1 did not help. Not worth it for a private server anyway; Ledger is griefing forensics.
- **Tree Harvester** `tree-harvester` · 6.3M dl
  🌲 Harvest full trees and huge mushrooms instantly with an axe. Includes fast leaf decay and sapling placement.
  **Reason:** Vein Mining already covers tree felling; overlapping intent.
- **Waystones** `waystones` · 22.7M dl
  Teleport back to activated waystones. For Survival, Adventure or Servers.
  **Reason:** Design conflict, not a technical one. The pack invests in five rail mods (Steam 'n' Rails, Railways Navigator, Train Utilities, Train Lights, Threaded Trains); player teleportation makes a rail network decorative.

## Evaluated, not selected

Seen while scanning 34 working 1.21.1 NeoForge modpacks. These were not rejected on
merit — most are libraries pulled in as dependencies elsewhere, exploration/adventure
content that does not fit a Create pack, or simply were not needed. The pack-count
column shows how many of the 34 reference packs used each, which is a decent proxy
for how battle-tested it is.

- **Forgified Fabric API** `forgified-fabric-api` · in 11/34 packs — Fabric API implemented on top of NeoForge
- **Ritchie's Projectile Library** `rpl` · in 10/34 packs — A Minecraft modding library for better projectiles.
- **Sinytra Connector** `connector` · in 10/34 packs — Lets you play Fabric mods on NeoForge
- **Just Enough Items (JEI)** `jei` · in 9/34 packs — View Items and Recipes
- **TerraBlender** `terrablender` · in 9/34 packs — A library mod for adding biomes in a simple and compatible m
- **BaguetteLib** `baguettelib` · in 8/34 packs — Ever tried to make a mod that needs proper death handling or
- **Melody** `melody` · in 8/34 packs — OpenAL-based library mod for playing background music.
- **Lithium** `lithium` · in 7/34 packs — No-compromises game logic optimization mod, useful for both 
- **Resourceful Config** `resourceful-config` · in 7/34 packs — Resourceful Config is a mod that allows for developers to ma
- **TxniLib** `txnilib` · in 7/34 packs — Multiversion library mod for Txni projects
- **WorldEdit** `worldedit` · in 7/34 packs — A Minecraft Map Editor... that runs in-game!
With selections
- **YUNG's API** `yungs-api` · in 7/34 packs — Library mod for YUNG's mods.
- **YUNG's Better Nether Fortresses** `yungs-better-nether-fortresses` · in 7/34 packs — A complete redesign of Minecraft's Nether fortresses!
- **Better Third Person** `better-third-person` · in 6/34 packs — Improves third person camera view.
- **Cherished Worlds** `cherished-worlds` · in 6/34 packs — Favorite/pin/bookmark certain worlds, which will always be a
- **Connector Extras** `connector-extras` · in 6/34 packs — Integrating Connector with third-party APIs
- **Create Crafts & Additions** `createaddition` · in 6/34 packs — Create Crafts & Additions extends Create and acts as a bridg
- **Dungeons and Taverns** `dungeons-and-taverns` · in 6/34 packs — A Structure Datapack adding dungeons, taverns and other stru
- **Freecam** `freecam` · in 6/34 packs — A highly customizable freecam mod.
- **MRU** `mru` · in 6/34 packs — A library mod used by Cassian and IMB11's mods to function.
- **oωo (owo-lib)** `owo-lib` · in 6/34 packs — A general utility, GUI and config library for modding on Fab
- **Sable** `sable` · in 6/34 packs — A library mod for interactive moving block structures, or "s
- **YUNG's Better Strongholds** `yungs-better-strongholds` · in 6/34 packs — A complete redesign of Minecraft's strongholds!
- **Colorwheel Patcher** `colorwheel-patcher` · in 5/34 packs — Autopatch supported shaderpacks for Colorwheel
- **Complementary Shaders - Reimagined** `complementary-reimagined` · in 5/34 packs — Preserving the elements of Minecraft with exceptional qualit
- **Create: Rustic Structures** `create-rustic-structures` · in 5/34 packs — This mod adds functional and decorative structures using Cre
- **Explosive Enhancement: Reforged** `explosive-enhancement-forge` · in 5/34 packs — Makes the explosion animation look cooler. Now for forge.
- **Fast Paintings** `fast-paintings` · in 5/34 packs — Fixes painting rendering, increasing their performance and a
- **Fresh Animations** `fresh-animations` · in 5/34 packs — Make your game like the trailers! Dynamic animated entities 
- **GlitchCore** `glitchcore` · in 5/34 packs — A library mod aimed at abstracting mod loaders and providing
- **libIPN** `libipn` · in 5/34 packs — Inventory Profiles Next GUI/Config library
- **McQoy** `mcqoy` · in 5/34 packs — Dependencyless* config screens! An in-game editor for Kaleid
- **Sounds** `sound` · in 5/34 packs — It's what it says on the tin. A complete upgrade to Minecraf
- **YUNG's Better Mineshafts** `yungs-better-mineshafts` · in 5/34 packs — A long-awaited and much-needed abandoned mineshaft overhaul!
- **Alex's Mobs (Unofficial Port)** `alexs-mobs(1.21.1)` · in 4/34 packs — 85+ New mobs with stylistic quality above the default game.
- **Applied Energistics 2** `ae2` · in 4/34 packs — AE2: A popular automation and storage mod
- **Athena** `athena-ctm` · in 4/34 packs — A crossplatform (Forge/Fabric) solution to connected block t
- **Carry On + Create Aeronautics Compat** `carryon-aeronautics-compat` · in 4/34 packs — Patches Carry On so you can pick up blocks from Create Aeron
- **Create: Diesel Generators** `create-diesel-generators` · in 4/34 packs — A Create addon that adds compact diesel generators (engines)
- **Create: Sophisticated Backpacks Compat** `create-sophisticated-backpacks-compat` · in 4/34 packs — A compatibility mod that integrates Sophisticated Backpacks 
- **Drippy Loading Screen** `drippy-loading-screen` · in 4/34 packs — Addon for FancyMenu to customize the loading screen.
- **Euphoria Patches** `euphoria-patches` · in 4/34 packs — Euphoria Patches is an add-on for Complementary Shaders, ext
- **Forge Config API Port** `forge-config-api-port` · in 4/34 packs — NeoForge's & Forge's config systems provided to other moddin
- **GPUBooster** `gputape` · in 4/34 packs — Provides DSA & fastest math formulas to game render system f
- **Gravestone x Curios API Compat** `gravestone-x-curios-api-compat` · in 4/34 packs — This little mod allows you to directly equip your Curios ite
- **KubeJS** `kubejs` · in 4/34 packs — Edit recipes, add new custom items, script world events, all
- **MaFgLib** `mafglib` · in 4/34 packs — MaLiLib unofficial forge port. Library mod for the (Neo)Forg
- **Nature's Spirit** `natures-spirit` · in 4/34 packs — A minecraft mod which enhances world generation with new bio
- **NetherPortalFix** `netherportalfix` · in 4/34 packs — Ensures correct destinations when travelling back and forth 
- **Particular ✨ Reforged** `particular-reforged` · in 4/34 packs — Particular is a mod that enhances Minecraft's ambience with 
- **Patchouli** `patchouli` · in 4/34 packs — Accessible, Data-Driven, Dependency-Free Documentation for M
- **ShatterLib | OctoLib** `shatterbyte-lib` · in 4/34 packs — Collection of shared code for OctoStudios' mods
- **Visuality: Reforged** `visuality-forge` · in 4/34 packs — Little visual improvements by adding a bunch of new particle
- **YUNG's Better Desert Temples** `yungs-better-desert-temples` · in 4/34 packs — A complete redesign of Minecraft's desert temples!
- **YUNG's Better Ocean Monuments** `yungs-better-ocean-monuments` · in 4/34 packs — A complete redesign of Minecraft's ocean monuments!
- **Zume** `zume` · in 4/34 packs — An over-engineered Zoom mod by Nolij
- **Another Furniture** `another-furniture` · in 3/34 packs — Vanilla-styled Minecraft furniture mod.
- **Ash API** `ash-api` · in 3/34 packs — An abstraction layer between Fabric and NeoForge
- **bad packets** `badpackets` · in 3/34 packs — Bad Packets allows packet messaging between different moddin
- **Better Clouds** `better-clouds` · in 3/34 packs — Beautiful clouds in touch with the vanilla style
- **Biomes O' Plenty** `biomes-o-plenty` · in 3/34 packs — Adds 50+ unique biomes to enhance your world, with new trees
- **Citadel (Unofficial Port)** `citadel-(1.21.1-port)` · in 3/34 packs — A Lightweight Library
- **Colorwheel** `colorwheel` · in 3/34 packs — Allows you to use Iris Shaders with Flywheel
- **Complementary Shaders - Unbound** `complementary-unbound` · in 3/34 packs — Transforming the visuals of Minecraft with exceptional quali
- **Copper Age Backport** `backport-copper-age` · in 3/34 packs — A Minecraft mod that brings the complete Copper Age experien
- **Corpse x Curios API Compat** `corpse-x-curios-api-compat` · in 3/34 packs — This little mod allows you to directly equip your Curios ite
- **Create Aeronautics: Encased Fluid Pipes** `create-aeronautics-encased-fluid-pipes` · in 3/34 packs — Encase Create Fluid Pipes with the Create Aeronautics Hot Ai
- **Create Confectionery** `create-confectionery` · in 3/34 packs — 🍫 Create your own Chocolate Factory !
- **Create More: Package Couriers** `create-more-package-couriers` · in 3/34 packs — Adds more ways to transport packages.
- **Create More: Parallel Pipes** `create-more-parallel-pipes` · in 3/34 packs — Allows you to have pipes that don't automatically connect wi
- **Create Smart Bounds** `create-smart-bounds` · in 3/34 packs — Improves create mod's block entity renderbounds
- **Create Waystones Recipes** `create-waystones-recipes` · in 3/34 packs — This mod changes the recipes of Waystones to fit with and us
- **Create: Aquatic Ambitions** `create-aquatic-ambitions` · in 3/34 packs — Introduces new bulk process which allows for more options fo
- **Create: Better Villagers** `create-better-villagers` · in 3/34 packs — Create: Better Villager that adds a host of Create-mod villa
- **Create: Broken Bad ReBroken** `create-broken-bad-fabric` · in 3/34 packs — This mod is an addon to Create which enables the player to p
- **Create: Cardboarded Conveynience** `create-cardboarded-conveynience` · in 3/34 packs — A small tweak allowing players to be disguised as packages e
- **Create: Garnished** `create-garnished` · in 3/34 packs — A Create Mod Addon that adds different food items, mainly nu
- **Create: Ironworks** `create-ironworks` · in 3/34 packs — An addon for the Create mod bringing new materials (Tin, Bro
- **Create: Renewable Netherite** `create-renewable-netherite` · in 3/34 packs — Adds a recipe to make netherite renewable in the create mod.
- **Create: Stones** `create-stones` · in 3/34 packs — Adds a lot of recipes to make more stones renewable or craft
- **Create: Storage Drawers compat** `storage-drawers-create-compat` · in 3/34 packs — Storage Drawers "smart" items recipes with Create materials.
- **Create: Synthetic Pressure** `create-synthetic-pressure` · in 3/34 packs — An updated remake of Create: High Pressure by Aweeri.
- **Create: Winery** `create-winery` · in 3/34 packs — Build your own winery with Create.
- **CreateBetterFps** `createbetterfps` · in 3/34 packs — Improve your Create FPS when shaderpack is on, up to 50%
- **Creeper Overhaul** `creeper-overhaul` · in 3/34 packs — A mod which overhauls the vanilla creepers!
- **Cristel Lib** `cristel-lib` · in 3/34 packs — A Library mod for easy structure config and runtime datapack
- **Curios API Continuation** `curios-continuation` · in 3/34 packs — A flexible and expandable accessory/equipment API for users 
- **Double Doors** `double-doors` · in 3/34 packs — 🚪 Multiple identical double doors, trapdoors and fence gate
- **Drip Sounds** `dripsounds` · in 3/34 packs — Adds sounds for drip particles landing & settings for block 
- **Easy Shulker Boxes** `easy-shulker-boxes` · in 3/34 packs — Supercharge shulker boxes with browsing, inserting and extra
- **Exposure** `exposure` · in 3/34 packs — Camera mod with focus on process and aesthetics
- **Extreme sound muffler** `extreme_sound_muffler` · in 3/34 packs — Extreme sound muffler is a client side mod that allows you t
- **FastQuit-Forge** `fastquit-forge` · in 3/34 packs — This mod allows you to instantly return to the title screen 
- **Fresh Animations: Player Extension** `fa-player-extension` · in 3/34 packs — Animates players in Fresh Animations' style. An official FA 
- **Global Packs** `globalpacks` · in 3/34 packs — Ship default Data- & Resourcepacks with Modpacks!
- **Immersive Aircraft** `immersive-aircraft` · in 3/34 packs — A bunch of rustic aircraft to travel, transport, and explore
- **Iris & Oculus Flywheel Compat** `iris-flw-compat` · in 3/34 packs — Enable Flywheel's optimizations when using shaderpacks.
- **KubeJS Create** `kubejs-create` · in 3/34 packs — KubeJS Create integration
- **Library Ferret** `library-ferret` · in 3/34 packs — Shared code for the mod of jtorleon studios
- **Macaw's Bridges** `macaws-bridges` · in 3/34 packs — A simple mod that adds a lot of bridges!
- **Macaw's Doors** `macaws-doors` · in 3/34 packs — Adds vanilla doors with every wood color and new unique door
- **Macaw's Fences and Walls** `macaws-fences-and-walls` · in 3/34 packs — Adds new vanilla styled fences, walls and gates!
- **Macaw's Furniture** `macaws-furniture` · in 3/34 packs — Decorate your world with wardrobes, drawers, chairs, desks, 
- **Macaw's Paths and Pavings** `macaws-paths-and-pavings` · in 3/34 packs — Adds vanila styled paths and pavings!
- **Medieval Buildings** `medieval-buildings` · in 3/34 packs — Add exciting medieval buildings with hidden enemies and trea
- **My Nether's Delight** `my-nethers-delight` · in 3/34 packs — New Nether addon for Farmer's Delight
- **Particle Rain** `particle-rain` · in 3/34 packs — Replaces weather with prettier particle effects
- **Presence Footsteps (NeoForge)** `pf-neoforge` · in 3/34 packs — An Overly complicated Sound Mod,and unofficial port of Prese
- **Prism** `prism-lib` · in 3/34 packs — A library all about color! Provides lots of color-related fu
- **Resourcify** `resourcify` · in 3/34 packs — In-game resource pack, data pack and shader browser and upda
- **Sable: Physics Compat** `sablecompat` · in 3/34 packs — A Compat mod for Sable/Aeronautics providing tags for severa
- **Seamless Loading Screen ** `seamless-loading-screen` · in 3/34 packs — Takes a screenshot of the game when you leave a world or ser
- **Serene Seasons** `serene-seasons` · in 3/34 packs — Seasons with changing colors, shifting temperatures, and mor
- **Sodium Options API** `sodium-options-api` · in 3/34 packs — Config API for adding Sodium options with a better categorie
- **Sophisticated Backpacks Create Integration** `sophisticated-backpacks-create-integration` · in 3/34 packs — Sophisticated Backpacks on create contraptions
- **Spyglass Improvements** `spyglass-improvements` · in 3/34 packs — Spyglass Improvements is a mod that add various functionalit
- **Steam 'n' Rails Neoforge** `create-steam-n-rails-1.21.1` · in 3/34 packs — An unofficial port of Create: Steam 'n' Rails to 1.21.1.
- **Tectonic** `tectonic` · in 3/34 packs — Terrain shaping brought to new heights, grander and more var
- **The Aether** `aether` · in 3/34 packs — The Aether Team presents the original Aether mod! Maintained
- **Trade Cycling** `trade-cycling` · in 3/34 packs — Refresh villager trades without needing to break workstation
- **YUNG's Better Dungeons** `yungs-better-dungeons` · in 3/34 packs — A complete redesign of Minecraft's dungeons!
- **YUNG's Better End Island** `yungs-better-end-island` · in 3/34 packs — An overhaul of the main End Island where the dragon fight ta
- **YUNG's Better Jungle Temples** `yungs-better-jungle-temples` · in 3/34 packs — A complete redesign of Minecraft's jungle temples!
- **YUNG's Better Witch Huts** `yungs-better-witch-huts` · in 3/34 packs — Adds overhauled witch huts to swamps!
- **YUNG's Bridges** `yungs-bridges` · in 3/34 packs — Adds beautiful naturally generated bridges throughout the wo
- **YUNG's Extras** `yungs-extras` · in 3/34 packs — Extra structures, features, and vanilla+ content suitable fo
- **[Let's Do] Vinery** `lets-do-vinery` · in 2/34 packs — Vinery expands Minecraft with deep wine-making mechanics, fr
- **Accessories** `accessories` · in 2/34 packs — An extendable and data-driven Accessory Mod for Minecraft
- **Aether Villages** `aether-villages` · in 2/34 packs — Adds grandiose temples and villages to the Aether dimension!
- **Aileron** `aileron` · in 2/34 packs — An expansive overhaul to Minecraft's Elytra.
- **Alex's Caves (Unofficial Port)** `alexs-caves-(unofficial-port)` · in 2/34 packs — Explore five new rare cave biomes hidden under the surface o
- **Armor Statues** `armor-statues` · in 2/34 packs — Unlock the full potential of armor stands! Works on vanilla 
- **Ars Additions** `ars-additions` · in 2/34 packs — An Ars Nouveau addon focused on small tweaks and quality of 
- **Ars Creo** `ars-creo` · in 2/34 packs — An addon for Ars Nouveau and Create
- **Aures - Farmers Structures** `aures-farmers-structures` · in 2/34 packs — New structures for Farmers Delight that teach the player how
- **Auth Me** `auth-me` · in 2/34 packs — Authenticate yourself and re-validate your session
- **Better Biome Reblend** `bbrb` · in 2/34 packs — Updated version of Better Biome Blend, a mod that improves B
- **Better Days** `betterdays` · in 2/34 packs — Gives you control over the passage of time by allowing you t
- **Better Library** `better-library` · in 2/34 packs — this is just a simple lib for config, 1st join message and l
- **Better Villages** `better-village` · in 2/34 packs — This mod enhances the villages in Minecraft by improving exi
- **Biolith** `biolith` · in 2/34 packs — A biome placement mod focusing on configurability and consis
- **Blueprint** `blueprint` · in 2/34 packs — Library that implements the framework of all Abnormals mods!
- **Boat Item View** `boat-item-view` · in 2/34 packs — See your held items when in a moving boat!
- **Bridging Mod** `bridging-mod` · in 2/34 packs — Reacharound Placement / Bedrock Bridging for Fabric, Forge &
- **Cardboard Chalk Box** `cardboard-chalk-box` · in 2/34 packs — Integration mod that allows crafting Chalk mod's chalk boxes
- **CC: Tweaked** `cc-tweaked` · in 2/34 packs — ComputerCraft fork adding programmable computers, turtles an
- **Cerulean** `cerulean-advancements` · in 2/34 packs — Advancements optimization mod, updated fork of Icterine with
- **Chat Animation [Smooth Chat]** `chatanimation` · in 2/34 packs — Makes chat messages appear with a smooth animation.
- **Chef's Delight - Farmer's Delight Villagers** `chefs-delight` · in 2/34 packs — Add-on for the Farmer's Delight mod. Adds 2 new professions 
- **Chisel Reborn** `chisel-reborn` · in 2/34 packs — Adds lots of blocks that are variations of vanilla blocks
- **ChoiceTheorem's Overhauled Village** `ct-overhaul-village` · in 2/34 packs — Enhances and creates new villages and pillager outposts, tha
- **Climate Rivers** `climate-rivers` · in 2/34 packs — Make your rivers stop looking like mistakes – and start flow
- **Colourful containers GUI** `colourful-containers-gui` · in 2/34 packs — A container GUI replacement mod that hopes to match the menu
- **Configured Defaults** `configured-defaults` · in 2/34 packs — Allows for providing defaults for files absent in .minecraft
- **Connected Glass** `connected-glass` · in 2/34 packs — Connected Glass adds new types of glass with connecting text
- **Crash Assistant** `crash-assistant` · in 2/34 packs — Shows a GUI after Minecraft crashes, immediately showing and
- **Create Aeronautics: Compatibility** `create-aeronautics-compatability` · in 2/34 packs — Adds compatibility for mods that don't work with Aeronautics
- **Create Aeronautics: Gyro Stabilizers** `create-aeronautics-gyroscope-stabilizers` · in 2/34 packs — This mod adds an Gyroscope Stabilizer for the mod Create Aer
- **Create Aeronautics: Portable Engine Liquid Fuel** `create-aeronautics-portable-engine-liquid-fuel` · in 2/34 packs — Liquid fuel support for Portable Engine from Create Aeronaut
- **Create Aeronautics: Throwable Rope Connector** `create-aeronautics-throwable-rope-connector` · in 2/34 packs — Create Aeronautics: Throwable Rope Connector is a small qual
- **Create Aeronautics: Toolgun** `create-aeronautics-toolgun` · in 2/34 packs — A toolgun mod featuring a gravity gun with towing functional
- **Create Aeronautics: Transmission & Linkage** `create-aeronautics-transmission-linkage` · in 2/34 packs — An Aeronautics expansion mod that adds items useful for desi
- **Create Big Cannons: Advanced Technologies** `create-big-cannons-advanced-technologies` · in 2/34 packs — An Addon for the Create Big Cannons Mod, adding new Cannons 
- **Create Deep Seas** `create-deep-seas` · in 2/34 packs — Submarine in Create Aeronautics!
- **Create Mechanical Chicken** `create-mechanical-chicken` · in 2/34 packs — Egg generator addon for create
- **Create More Automation** `create-more-automation` · in 2/34 packs — A simple Create addon adding more methods for automation
- **Create Optical** `create-optical` · in 2/34 packs — Create addon all about a creative way to transport rotationa
- **Create Ratatouille** `create-ratatouille` · in 2/34 packs — Adds machine and items about  agricultural and food processi
- **Create Stock Bridge** `create-stock-bridge` · in 2/34 packs — Links the Create Stock network with Applied Energistics
- **Create Train Parts** `create-train-parts` · in 2/34 packs — Adds functional blocks as decoration
- **Create: Aeroworks** `create-aeroworks` · in 2/34 packs — A collection of addons for Create Aeronautics with blocks su
- **Create: Components and Additions** `create-ca` · in 2/34 packs — A small Create addon that most importantly adds the Brass Ge
- **Create: Deep Dark** `create-deep-dark` · in 2/34 packs — A Create mod addon featuring new end-game items based on the
- **Create: Deepfried** `create-deepfried` · in 2/34 packs — adds deepfried food to Minecraft
- **Create: Dynamic Lights** `create-dynamic-lights` · in 2/34 packs — Add dynamic lights to the Create mod.
- **Create: Metalwork** `create-metalwork` · in 2/34 packs — Create: Metalwork is an add-on for Create that introduces ne
- **Create: Mobile Packages** `create-mobile-packages` · in 2/34 packs — Make your Create Packages Mobile
- **Create: New Age** `create-new-age` · in 2/34 packs — Create: New Age is an addon for the Create mod that adds int
- **Create: Pantographs & Wires** `create-pantographs-and-wires` · in 2/34 packs — A mod with catenary wires, pantographs and more for electric
- **Create: Renewable Brass** `create-renewable-brass` · in 2/34 packs — This datapack adds recipes to make brass renewable.
- **Create: Renewable Diamonds** `create-renewable-diamonds` · in 2/34 packs — Adds a recipe to make diamonds renewable in the create mod.
- **Create: Renewable Notch Apples** `create-renewable-egapples` · in 2/34 packs — Adds a new recipe to make enchanted golden apples renewable 
- **Create: Simple Ore Doubling** `create-simple-ore-doubling` · in 2/34 packs — Increase your ore yield with Create. Up to 3x return.
- **Create: Some Assembly Required** `some-assembly-required` · in 2/34 packs — Design your own sandwiches
- **Create: The Air War** `create-the-air-war` · in 2/34 packs — This mod was created for aerial vehicles. The main function 
- **Create: Track Map (UNOFFICIAL FORK)** `create-track-map-(unofficial-fork)` · in 2/34 packs — UNOFFICIAL FORK OF "github.com/jenchanws/create-track-map". 
- **Crops Love Rain** `crops-love-rain` · in 2/34 packs — Makes crops grow faster when it's raining
- **Cryonic Config** `cryonicconfig` · in 2/34 packs — Chill Minimal Config API
- **Deep Aether** `deep-aether` · in 2/34 packs — Deep Aether is an addon for the original version of The Aeth
- **Deeper and Darker** `deeperdarker` · in 2/34 packs — A Minecraft mod which features more blocks, items, armors, a
- **Distraction Free Recipes (EMI / REI / JEI)** `distraction-free-recipes` · in 2/34 packs — Automatically hides the recipe viewer when not searching.
- **Do a Barrel Roll** `do-a-barrel-roll` · in 2/34 packs — Microsoft flight simulator for Minecraft elytras.
- **Drippy Early Loading Module** `drippy-early-loading-module` · in 2/34 packs — This is a module for Drippy Loading Screen to add support fo
- **Dungeons and Taverns Stronghold Overhaul** `dungeons-and-taverns-stronghold-overhaul` · in 2/34 packs — This Datapack, the Standalone version of Dungeons and Tavern
- **Eating Animations** `eating-animations` · in 2/34 packs — A Forge port of the Eating Animation mod
- **Effortless Structure** `effortless` · in 2/34 packs — Increase your build speed by batch placing/breaking/using bl
- **End's Delight** `ends-delight` · in 2/34 packs — End's Delight is an addon mod for Farmer's Delight based aro
- **Expanded Delight** `expanded-delight` · in 2/34 packs — An addon mod for Farmer's Delight
that adds many more crops 
- **Explorify** `explorify` · in 2/34 packs — A simplistic, vanilla-friendly collection of new structures.
- **FancyMenu** `fancymenu` · in 2/34 packs — Customize Minecraft's menus with ease!
- **Farmer's Cutting: Nature's Spirit** `farmers-cutting-natures-spirit` · in 2/34 packs — Adds Farmer's Delight cutting recipes for Nature's Spirit
- **Fast IP Ping** `fast-ip-ping` · in 2/34 packs — Yeet the laggy reversed DNS lookup for literal IP server add
- **Fast Item Frames** `fast-item-frames` · in 2/34 packs — Supercharged item frames! Less lag, better performance, and 
- **Flerovium** `flerovium` · in 2/34 packs — Greatly improve your fps with virtually no side-effects on g
- **FPS Reducer** `fps-reducer` · in 2/34 packs — Reduce GPU and CPU usage automatically when no user operatio
- **FramedBlocks** `framedblocks` · in 2/34 packs — Fancy building blocks
- **Full Brightness Toggle** `full-brightness-toggle` · in 2/34 packs — 🔆 Press G to toggle the brightness/gamma in-game to maximum
- **Functional Storage** `functional-storage` · in 2/34 packs — Functional Storage is an alternative take on the drawer stor
- **GraveStone Mod** `gravestone-mod` · in 2/34 packs — Places a gravestone with your inventory items inside when yo
- **GroovyModLoader (GML)** `gml` · in 2/34 packs — NeoForge language provider for Groovy mods.
- **GuideME** `guideme` · in 2/34 packs — A guidebook toolkit for mods and modpack makers alike with c
- **Immersive Melodies** `immersive-melodies` · in 2/34 packs — Play custom melodies on various instruments and annoy your f
- **Immersive UI** `immersive-ui` · in 2/34 packs — Enhance your gameplay experience with animated UI components
- **Inventory Profiles Next** `inventory-profiles-next` · in 2/34 packs — Take control over your inventory. Sort. Move matching Items.
- **Item Descriptions** `item-descriptions` · in 2/34 packs — This mod adds unique descriptions for all blocks, items, enc
- **L_Ender's Cataclysm** `l_enders-cataclysm` · in 2/34 packs — Cataclysm is a mod that adds difficult dungeons, challenging
- **Leaves Be Gone** `leaves-be-gone` · in 2/34 packs — Quick leaf decay from cutting down trees. Built for fast per
- **LibJF** `libjf` · in 2/34 packs — A library for my mods
- **Lionfish-API** `lionfish-api` · in 2/34 packs — Very Light Animation Api
- **Lodestone** `lodestonelib` · in 2/34 packs — A collection of code used throughout projects under the Lode
- **Luki's Grand Capitals** `lukis-grand-capitals` · in 2/34 packs — Rebuilt vanilla villages and illager structures to breathe n
- **Macaw's Lights and Lamps** `macaws-lights-and-lamps` · in 2/34 packs — Adds vanilla styled lamps, torches, street lamps, paper lamp
- **Macaw's Stairs** `macaws-stairs` · in 2/34 packs — Adds new Vanilla styled Stairs, Handrails for Stairs and Bal
- **Man of Many Planes** `man-of-many-planes` · in 2/34 packs — A set of additional aircraft for Immersive Aircraft with Cre
- **Medieval Buildings [End Edition]** `medieval-buildings-end-edition` · in 2/34 packs — New incredible medieval-style structures for the End!
- **Medieval Buildings [Nether Edition]** `medieval-buildings-nether-edition` · in 2/34 packs — New incredible medieval-style structures for the Nether!
- **Miner's Delight** `miners-delight` · in 2/34 packs — Farmer's Delight add-on for miners
- **Mod Menu (NeoForge Edition)** `mod-menu-(neoforge-edition)` · in 2/34 packs — NeoForge Port of Mod Menu
- **Motschen's Better Leaves** `better-leaves` · in 2/34 packs — Improves the appearance of leaves with high mod compatibilit
- **Naturalist** `naturalist` · in 2/34 packs — Adds 47 animals *(and 66 variants)* to your world with immer
- **Nature's Delight** `natures-delight` · in 2/34 packs — A mod which integrates Nature's Spirit and Farmer's Delight 
- **Not Enough Recipe Book [NERB]** `notenoughrecipebook` · in 2/34 packs — Completely removes recipe book from the game, optimizing pla
- **Nyf's Spiders** `nyfs-spiders` · in 2/34 packs — Modifes spiders to be more realistic
- **Ocean's Delight** `oceans-delight` · in 2/34 packs — Ocean's Delight is an addon mod for Farmer's Delight based a
- **Oh The Trees You'll Grow** `oh-the-trees-youll-grow` · in 2/34 packs — Tree library used by popular mods such as Oh The Biomes You'
- **ParCool!** `parcool` · in 2/34 packs — A Minecraft Forge Mod for Cool actions like Parkour
- **Particle Effects** `particle-effects` · in 2/34 packs — Visual Mod which adds unique textured particles for every ef
- **Particle Interactions** `particle-interactions` · in 2/34 packs — Adds particles to more interactions in the game, such as pla
- **Passable Foliage 🌳** `passable-foliage` · in 2/34 packs — Remove collision from leaves
- **Paxi** `paxi` · in 2/34 packs — Automatic data & resource pack loading made easy.
- **Pehkui** `pehkui` · in 2/34 packs — Lets you change the size of most entities, shrinking their s
- **Philips Ruins** `philips-ruins` · in 2/34 packs — This mod adds ancient ruins to your Minecraft world
- **Polytone** `polytone` · in 2/34 packs — Customize Map Color, Block Colors, Colormaps and Block Sound
- **Potentials** `potentials` · in 2/34 packs — Library to allow mod developers to use cross platform capabi
- **Potion Stacks** `potion-stacks` · in 2/34 packs — Allows potions to stack to 16
- **Raised** `raised` · in 2/34 packs — Take control of the position of your GUI and fix the broken 
- **Rapid Leaf Decay** `rapid-leaf-decay` · in 2/34 packs — Makes leaf decay rapidly fast.
- **Repurposed Structures - Farmer's Delight Compat** `repurposed-structures-farmers-delight-compat` · in 2/34 packs — Add Farmer's Delight to Repurposed Structures Villages
- **Rhino** `rhino` · in 2/34 packs — A fork of Mozilla's Rhino library, modified for use in mods
- **Saplanting** `saplanting` · in 2/34 packs — Auto-plant all kinds of sapling-item drops, support 2x2 tree
- **Saturn** `saturn` · in 2/34 packs — A performance mod designed to optimize Minecraft's memory us
- **Sawmill** `universal-sawmill` · in 2/34 packs — Ultimate Woodcutter. As it was intented, compatible with any
- **Seamless Sleep** `seamless-sleep` · in 2/34 packs — Adds a smooth, cinematic transition between night and day wh
- **SeasonHud** `seasonhud` · in 2/34 packs — Display the current season on the Hud or under the minimap
- **Smooth Boot** `smooth-boot` · in 2/34 packs — This mod enhances CPU scheduling in Minecraft. As an unoffic
- **Smooth Skies** `smooth-skies` · in 2/34 packs — Smooths out the skybox colors on far render distances and fi
- **Smooth Swapping** `smooth-swapping` · in 2/34 packs — Moves items smoothly in inventories
- **Sodium Dynamic Lights** `sodium-dynamic-lights` · in 2/34 packs — Multiloader port of LambDynLights that adds Sodium options i
- **Sound Physics Perfected** `sound-physics-perfected` · in 2/34 packs — A Ray tracing implementation to have Sound Physics in Minecr
- **Status Effect Bars Reforged** `status-effect-bars-reforged` · in 2/34 packs — A client-side mod that adds small customizable bars to the s
- **Structure Layout Optimizer** `structure-layout-optimizer` · in 2/34 packs — Attempts to optimize the generation of Jigsaw Structures and
- **Subtle Effects** `subtle-effects` · in 2/34 packs — Adding many new subtle details through particles and a few s
- **Titanium** `titanium` · in 2/34 packs — A shared library mod for Innovative Online Industries's mods
- **TorchMaster** `torchmaster` · in 2/34 packs — Control Mob Spawning with simple to use Blocks like the Mega
- **Towns and Towers** `towns-and-towers` · in 2/34 packs — Spice up your world with new villages, pillager outposts, an
- **Trash Cans** `trash-cans` · in 2/34 packs — Trash Cans adds trash cans which can be used to void items, 
- **Traveler's Backpack** `travelersbackpack` · in 2/34 packs — Unique and upgradeable backpacks with customisation, Curios 
- **Updating World Icon** `updating-world-icon` · in 2/34 packs — Makes the singleplayer world icon update each time the world
- **Variants&Ventures** `variants-and-ventures` · in 2/34 packs — Adds multiple new mob variants seamlessly integrated into yo
- ** Integrated Dungeons and Structures** `idas` · in 1/34 packs — Integrated Dungeons and Structures (aka IDAS) is a mod that 
- **(Sodium) Chloride** `chloride` · in 1/34 packs — Gives Sodium additional Performance and Quality features for
- **[Let's Do] Bakery - Farm&Charm Compat** `lets-do-bakery-farmcharm-compat` · in 1/34 packs — Bake many variations of Bread, Cupcakes and Cakes! Eatable, 
- **[Let's Do] BloomingNature** `lets-do-bloomingnature` · in 1/34 packs — Transform your overworld with enhanced terrain, expanded pla
- **[Let's Do] Brewery - Farm&Charm Compat** `lets-do-brewery-farmcharm-compat` · in 1/34 packs — Welcome to the Brewfest!

This version was made for improved
- **[Let's Do] Farm & Charm** `lets-do-farm-charm` · in 1/34 packs — The farm calls: Experience the art of advanced agriculture a
- **[Let's Do] Furniture** `lets-do-furniture` · in 1/34 packs — Let's expand your world with a whole set of new and exciting
- **[Let's Do] WilderNature** `lets-do-wildernature` · in 1/34 packs — Wilder Nature introduces immersive wildlife, hunting systems
- **[NTGL] NukaTeam's Gun Lib** `ntgl` · in 1/34 packs — Allows you to add animated weapons to the game
- **[Reforged] Accurate Block Placement** `reforged-accurate-block-placement` · in 1/34 packs — makes placing blocks a smooth and reliable process when hold
- **[UNOFFICIAL] [TACZ] Fallout Gunpack** `unofficial-tacz-fallout-gunpack` · in 1/34 packs — [Unofficial] NeoForge Port  of LesRaisins Studio's Fallout-t
- **[UNOFFICIAL] LesRaisins Tactical Equipements 1.21.1 NeoForge** `lr-tactical-1.21.1` · in 1/34 packs — LesRaisins Tactical Equipements (NeoForge 1.21.1) is a porte
- **[UNOFFICIAL] TaCZ 1.21.1 NeoForge Port** `tacz-1.21.1` · in 1/34 packs — Unofficial port of Timeless and Classics Zero, a Minecraft g
- **3D Armor** `armor-3d` · in 1/34 packs — Renders the player and entity equipped armor in 3D and is co
- **AA4 Atlas** `aa4-atlas` · in 1/34 packs — Antique Atlas 4 addon which adds the atlas item back.
- **Abandoned Structures (by berezka)** `abandoned-structures-(by-berezka)` · in 1/34 packs — This mod adds 4 abandoned structures to the world
- **Abandoned Watchtowers** `abandoned-watchtowers` · in 1/34 packs — Adds abandoned watchtowers to forest biomes. Perfect for a h
- **Ability Upgrade - Cobblemon** `ability-upgrade-cobblemon` · in 1/34 packs — Ability Capsule and Patch recipe for Cobblemon
- **Accessories Compatibility Layer** `accessories-compat-layer` · in 1/34 packs — Modifies commonly used Accessory API's to work with Accessor
- **Ace's Spell Utils** `aces-spell-utils` · in 1/34 packs — A util API for making Iron's Spells and Spellbooks addons
- **Ad Astra: Per Spatium Et Tempus** `per-spatium` · in 1/34 packs — An Addon for Ad Astra and Stellaris improving space explorat
- **Additional Attributes** `additional-attributes` · in 1/34 packs — Adds additional attributes to the game
- **Additional Entity Attributes** `additionalentityattributes` · in 1/34 packs — Adds additional attributes for players and other entities, m
- **Additional Lanterns** `additional-lanterns` · in 1/34 packs — Additional Lanterns adds many new lanterns with different co
- **Additional Structures** `additional-structures` · in 1/34 packs — Adds >200 new structures that integrate perfectly into your 
- **AddonsLib** `addonslib` · in 1/34 packs — A library to facilitate registration between mods, in partic
- **Adorable Hamster Pets** `adorable-hamster-pets` · in 1/34 packs — 3,000+ Wild Variants, Procedural Genetics, Shoulder Launchin
- **AdoraBuild: Structures** `adorabuild-structures` · in 1/34 packs — Adds over 100 new structures to enhance the world exploratio
- **Advanced Netherite** `advanced-netherite` · in 1/34 packs — A vanilla and add-on friendly, open-source mod that adds in 
- **Advancement Disable** `advancementdisable` · in 1/34 packs — A simple mod which can remove all advancements in a namespac
- **Advancements Reloaded (AdvancementInfo)** `advancements-reloaded` · in 1/34 packs — Enhance your Minecraft advancements experience with a revamp
- **Aero Islands [for Create Aeronautics]** `aeroscapes-islands` · in 1/34 packs — Sky island world generation from Isabel's Aeroscapes.
- **AeroEngine** `aeroengine` · in 1/34 packs — AeroEngine is a Create addon that adds modular aircraft engi
- **Aeronautics Camera Sync** `aero_cam_sync` · in 1/34 packs — Adds a dynamic camera tilt for the contraption from the Crea
- **Aether: Basic Ores** `aether-basic-ores` · in 1/34 packs — Adds vanilla ores to the Aether! Compatible with Create & ot
- **Aether's Delight** `the-aethers-delight` · in 1/34 packs — Adds Compatibility between The Aether and Farmer's Delight
- **Air Hop** `air-hop` · in 1/34 packs — A new enchantment for jumping while in midair. Not once, not
- **Alloyed** `create-alloyed` · in 1/34 packs — A mod adding Bronze and Steel, crafted in a Forge and used f
- **AllTheMons x Mega Showdown** `allthemons-x-mega-showdown-legacy` · in 1/34 packs — Always wanted to play Mega Showdown with AllTheMons? Well th
- **Allurement** `allurement!` · in 1/34 packs — Adds and tweaks enchantments, most of which break up the bas
- **Almost Unified** `almostunified` · in 1/34 packs — Unify all resources.
- **Amber** `amber` · in 1/34 packs — A library of commonly used functionality for iamkaf mods.
- **Amplified Nether** `amplified-nether` · in 1/34 packs — The nether explorer's simple dream: doubled height and ampli
- **Analog Audio** `analog-audio` · in 1/34 packs — Bring the warm comfort of analog audio mediums to your world
- **Animal Armor Trims - Horse & Wolf** `animal-armor-trims` · in 1/34 packs — Now you can add trims to horse and wolf armor!
- **Animal Feeding Trough** `animal_feeding_trough` · in 1/34 packs — Mobs self feed with feeding trough
- **Animal Hats** `animal-hats-yeah` · in 1/34 packs — A bunch of hats based on the mobs from Minecraft. Inspired b
- **Animatica Foxified** `animatica-foxified` · in 1/34 packs — Animatica unofficial NeoForge port. A mod for the NeoForge i
- **Antique Atlas 4** `antique-atlas-4` · in 1/34 packs — A hand-drawn clientside world map, with map sharing, structu
- **Apocalypse structures: Abandoned city buildings** `abandoned-city-buildings` · in 1/34 packs — Adds abandoned city buildings in your world.
- **Apothic Attributes** `apothic-attributes` · in 1/34 packs — A library that adds the Attributes GUI, alongside a suite of
- **Applied Energistics 2 Wireless Terminals** `applied-energistics-2-wireless-terminals` · in 1/34 packs — Ae2wtlib is an addon for ae2 that adds wireless versions of 
- **Applied Mekanistics** `applied-mekanistics` · in 1/34 packs — The official Mekanism support addon for AE2
- **Aquaculture 2** `aquaculture` · in 1/34 packs — Spices up fishing with a number of new biome-specific fish, 
- **Aquaculture Delight** `aquaculture-delight` · in 1/34 packs — Adds Farmer's Delight and Aquaculture compatibility. Vanilla
- **Arcadia Auction House** `arcadia-ah` · in 1/34 packs — Arcadia Auction House adds a cross-player marketplace with i
- **Arcadia Lib** `arcadia-lib` · in 1/34 packs — Arcadia Lib is the shared foundation required by all Arcadia
- **Arcane Armor Trims** `arcane-armor-trims` · in 1/34 packs — A micro addon for Iron's Spells 'n Spellbooks that bridges t
- **Armor Visibility** `armor-visibility` · in 1/34 packs — Let that skin show!
- **Ars Controle** `ars-controle` · in 1/34 packs — Addon for Ars Nouveau focused on increasing control.
- **Ars Expanded Combat Compat** `ec-ars-compat` · in 1/34 packs — adds Compatability between Expanded Combat and Ars Nouveau
- **Ars Nouveau** `ars-nouveau` · in 1/34 packs — Craft spells and construct magical automations
- **Ars NumericHUD** `ars-numerichud` · in 1/34 packs — Shows how much mana you have in numbers!
- **Ars Polymorphia** `ars-polymorphia` · in 1/34 packs — Adds Polymorph support for Ars Nouveau's Storage Lecterns.
- **Artifacts** `artifacts` · in 1/34 packs — Adds various treasure items that can be found through explor
- **AshVehicle** `ashvehicle` · in 1/34 packs — Add-on to add vehicles to Superb Warfare
- **Async Logger** `asynclogger` · in 1/34 packs — Asynchronous logging and efficient filtering - performance i
- **AsyncParticles** `asyncparticles` · in 1/34 packs — Async particle tick, GPU accelerated particle rendering.
- **Auroras** `auroras` · in 1/34 packs — Adding magnificent auroras to the world!
- **AutoMessage** `auto-message` · in 1/34 packs — Basically, AutoMessage is responsible for adding an option t
- **Axes Are Weapons** `axes-are-weapons` · in 1/34 packs — Disables the increased durability loss in combat and enables
- **Axiom** `axiom` · in 1/34 packs — The all-in-one tool for editing Minecraft Worlds.
- **Azimuth API** `azimuth-api` · in 1/34 packs — Create addon API focused on extending capabilities and impro
- **AzureLib** `azurelib` · in 1/34 packs — Java Minecraft mod using Bedrock models to create custom mod
- **Ballistix** `ballistix` · in 1/34 packs — Ballistix is a Minecraft Mod that introduces intercontinenta
- **Banner Flags** `banner-flags` · in 1/34 packs — Place banners horizontally as flags on fences, walls and oth
- **Basic Weapons** `basicweapons` · in 1/34 packs — 6 new vanilla+ tiered weapons with an extensible materialpac
- **BCLib: New Dawn** `bclib-neoforge` · in 1/34 packs — An unofficially maintained continuation of BCLib for Fabric 
- **Beautiful Campfires** `beautiful-campfires` · in 1/34 packs — Now the appearance of the campfire will depend on the wood u
- **Beautiful Enchanted Books [MOD EDITION]** `beautiful-enchanted-books-mod-edition` · in 1/34 packs — Forget about the boring aspects of enchanted books! Now they
- **Beautiful Potions [MOD EDITION]** `beautiful-potions-mod-edition` · in 1/34 packs — This mod transforms the visual experience of potions, enhanc
- **Better Archeology** `better-archeology` · in 1/34 packs — Discover artifacts & fossils by encountering new structures 
- **Better Compatibility Checker** `better-compatibility-checker` · in 1/34 packs — Changes the default server compatibility check to compare mo
- **Better Dark Gui** `better-dark-gui` · in 1/34 packs — Makes UI dark, which is more pleasant to the eyes + Red Them
- **Better ModList** `better-modlist` · in 1/34 packs — enhances neoforge modlist by adding options to hide mods, li
- **Better Ping Display [Forge/NeoForge]** `better-ping-display` · in 1/34 packs — Adds a configurable numerical ping display to the player lis
- **Better Vinurl Recipe** `better-vinurl-recipe` · in 1/34 packs — Improves the vinurl custom disc recipe to be more straightfo
- **BetterEnd: New Dawn** `betterend-neoforge` · in 1/34 packs — An unofficially maintained continuation of BetterEnd for Fab
- **BetterGrassify** `bettergrassify` · in 1/34 packs — Gamers can finally touch grass!?

OptiFine's Fancy and Fast 
- **BetterNether: New Dawn** `betternether-neoforge` · in 1/34 packs — An unofficially maintained continuation of BetterNether for 
- **BetterTab** `better-tab` · in 1/34 packs — You can show mobcaps, TPS, MSPT and Custom line in tab list
- **Big Lost City** `big-lost-city` · in 1/34 packs — A new abandoned cities mod! Discover many abandoned structur
- **Big Shot Rendering Library** `big-shot-lib` · in 1/34 packs — Multiversion rendering library
- **Bigshot** `bigshot` · in 1/34 packs — Allows you to take big, high quality screenshots.
- **Biome Replacer** `biome-replacer` · in 1/34 packs — A quick way to get rid of a biome. Useful for tweaking datap
- **BisectHosting Server Integration Menu** `bisect-mod` · in 1/34 packs — BisectHosting Server Ordering Menu
- **BjornLib** `bjornlib` · in 1/34 packs — A library of generic code for my mods
- **Blocks You Need** `blocks-you-need` · in 1/34 packs — Adding blocks to your palette that are integrated into the m
- **Blur Perfected** `blur-perfected` · in 1/34 packs — Adds blur to GUIs, a fork of Blur+ that fixes blur animation
- **Blur+** `blur-plus` · in 1/34 packs — Spices up the boring vanilla blur effect – featuring animati
- **Bobby** `bobby` · in 1/34 packs — Allows for render distances greater than the server's view-d
- **Bookshelf Inspector** `bookshelf-inspector` · in 1/34 packs — Inspect any book in a chiseled bookshelf.
- **Borderless Window** `borderless-window` · in 1/34 packs — Enables the fullscreen mode 'Borderless Window', which repla
- **Boss Refreshed** `boss-refreshed` · in 1/34 packs — Minecraft's Bosses with a Refreshed Take!
- **Bosses'Rise** `bossesrise` · in 1/34 packs — 🐉 Bring Souls-like Bosses into your world
- **Botany Pots** `botany-pots` · in 1/34 packs — Adds pots that you can use to grow crops!
- **Bountiful** `bountiful` · in 1/34 packs — Adds bounty boards, giving rewards for collecting different 
- **Brewin' And Chewin'** `brewin-and-chewin` · in 1/34 packs — Fermenting addon for Farmer's Delight.
- **Brick & Mortar** `brick-and-mortar` · in 1/34 packs — A specialized furnace for building blocks and clay with bric
- **BSL Shaders** `bsl-shaders` · in 1/34 packs — Shaderpack for Minecraft: Java Edition. It's bright, colorfu
- **Butchery** `butchery` · in 1/34 packs — An immersive way of harvesting mobs
- **Camera Overhaul** `cameraoverhaul` · in 1/34 packs — A mod that makes gameplay & movement more satisfying through
- **Cataclysm & BetterCombat - Compatibility** `cataclysm-x-bettercombat-compat` · in 1/34 packs — This is a datapack/mod for compatibility between Cataclysm a
- **Cataclysm: Spellbooks** `cataclysm-spellbooks` · in 1/34 packs — An addon for Iron's Spells and Spellbooks and L_Ender's Cata
- **CC Ballistix Reborn** `cc-ballistix-reborn` · in 1/34 packs — Integrates ComputerCraft: Tweaked with Ballistix 0.9.2 for m
- **CC: BallistiX Updated** `cc-ballistix-updated` · in 1/34 packs — Adds support for BallistiX silos to CC: Tweaked
- **CC: Sable** `cc-sable` · in 1/34 packs — CC: Tweaked addon for the Sable backend of Create: Simulated
- **CC:C Bridge** `cccbridge` · in 1/34 packs — Adds compatibility between CC: Tweaked and Create through mo
- **Chalk** `chalk-mod` · in 1/34 packs — You'll never lose your way again!
- **Change Items Durability** `change-items-durability` · in 1/34 packs — Changes the durability of any item. Works server-side only b
- **Cheaper Maps** `cheaper-maps` · in 1/34 packs — Craft cheap maps with black dye or an ink sac instead of a c
- **Chipped Express** `chipped-express` · in 1/34 packs — Mod addon for Chipped to allow to craft ANY recipe with ston
- **Chiseled Bookshelves Add Enchantment Power [PurpurPack]** `purpurpacks-chiseled-bookshelves-add-enchantment-power` · in 1/34 packs — Use chiseled bookshelves as a bookshelf for your enchanting 
- **Choccy's Craftable Saddles & Horse Armor** `craftable-saddles-and-horse-armor` · in 1/34 packs — This mod adds a crafting recipe for leather, iron, golden, a
- **Clay Overhaul** `clay-overhaul` · in 1/34 packs — Add new uses to Minecraft clay!
- **Clay Soldiers Remake** `clay-soldiers-remake` · in 1/34 packs — A data driven remake of the Clay Soldiers Mod
- **Clear Void** `clear-void` · in 1/34 packs — Remove the pitch black bottom half of the skybox at low Y le
- **Clear Water** `clear-water` · in 1/34 packs — Have Clarity! No more fog underwater!
Extremely configurable
- **Client Sort** `clientsort` · in 1/34 packs — Versatile and easy inventory sorting.
- **Climbable Ropes for Create Aeronautics** `create-aeronautics-climbable-rope` · in 1/34 packs — Adds an empty-hand climb mode for vertical ropes in Create A
- **Coastal Waves** `coastal-waves` · in 1/34 packs — Adding breaking waves to the beaches!
- **Cobbled Armor & Tool Trims - Cobblemon** `cobbled-armour-trims` · in 1/34 packs — Use the power of Cobblemon and use the Type Gems to customis
- **CobbleFurnies** `cobblefurnies` · in 1/34 packs — CobbleFurnies is here to bring your creations to life with b
- **Cobblemon** `cobblemon` · in 1/34 packs — A Pokémon mod for Fabric and NeoForge
- **Cobblemon Capture XP** `cobblemon-capture-xp` · in 1/34 packs — Grants EXP for your team when you capture a wild Pokemon.
- **Cobblemon Counter** `cobblemon-counter` · in 1/34 packs — A utility mod that keeps track of Cobblemon wild KO/capture 
- **Cobblemon Fight or Flight Reborn** `cobblemon-fight-or-flight-reborn` · in 1/34 packs — New version of an addon for Cobblemon that makes pokemon run
- **Cobblemon Integrations** `cobblemon-integrations` · in 1/34 packs — Various mod integrations for Cobblemon.
- **Cobblemon Pokemon Badges** `cobblemon-pokemon-badges` · in 1/34 packs — This mod adds all main-line Pokemon badges into Minecraft!
- **Cobblemon Pokenav** `cobblemon-pokenav` · in 1/34 packs — The Cobblenav mod is inspired by the item and related mechan
- **Cobblemon Spawn Chaining** `cobblemon-spawn-chaining` · in 1/34 packs — What if you could chain spawns... in Cobblemon?
- **Cobblemon Tim Core** `cobblemon-tim-core` · in 1/34 packs — What if my Cobblemon mods worked without a bunch of copy/pas
- **Cobblemon Unchained** `cobblemon-unchained` · in 1/34 packs — Naturally spawning Hidden Abilities. KOs and/or captures inc
- **Cobblemon: Better Campfire Pot** `cobblemon-better-campfire-pot` · in 1/34 packs — A Cobblemon addon to make cooking pot faster and easier auto
- **Cobblemon: Create Industries (3D Production Models)** `cobblemon-create-industries` · in 1/34 packs — Create + Cobblemon : 3D Production of Balls, Candy, Mochi's.
- **Cobblemon: Mega Showdown** `cobblemon-mega-showdown` · in 1/34 packs — Adding mega evolutions, z-moves, teralization, dynamax, ultr
- **Cobblemon: Parting Gifts** `cobblemon-release-rewards` · in 1/34 packs — This Cobblemon sidemod adds a highly configurable Reward sys
- **Cobblemore Lib** `cobblemore-library` · in 1/34 packs — System that stores all the items/assets/recipes/codes in com
- **Cobbreeding** `cobbreeding` · in 1/34 packs — A side-mod for Cobblemon to add Pokémon breeding early.
- **Cold Sweat** `cold-sweat` · in 1/34 packs — Adds a fitting and difficult temperature system to Minecraft
- **Colorful Hearts** `colorful-hearts` · in 1/34 packs — A client side mod that replaces multiple vanilla heart rows 
- **Colourful containers Dark Mode GUI** `colourful-containers-dark-mode-gui` · in 1/34 packs — A container GUI replacement mod that hopes to match the menu
- **Combat Roll** `combat-roll` · in 1/34 packs — 🧶 Adds combat roll ability, with related attributes and enc
- **Comfortable Campfires** `comfortable-campfires` · in 1/34 packs — Sitting by the campfire is now just a little more comfortabl
- **Companion 🐕** `companion` · in 1/34 packs — Mechanics to avoid losing your pets, but do not break the va
- **Concurrent Chunk Management Engine (NeoForge)** `c2me-neoforge` · in 1/34 packs — A mod designed to improve the chunk performance of Minecraft
- **Configuration** `configuration` · in 1/34 packs — Configuration library for easy config management
- **Connected Core** `connected-core` · in 1/34 packs — A utility mod for modpacks, adds helpful features like the a
- **Connected Paths** `connected-paths` · in 1/34 packs — Connect path-like blocks with support for mods like Cobblemo
- **Connectible Chains [Fabric]** `connectiblechains` · in 1/34 packs — Connect your fences with a decorative chain! 
- **Construction Sticks** `construction-sticks` · in 1/34 packs — Sticks that make building easier
- **Contagion - A Zombie Infection / Infectious Mod** `contagion` · in 1/34 packs — Zombie Infection Mod - This Mod adds the functionality that 
- **Continents** `continents` · in 1/34 packs — Reshapes the world to consist of continents, separated by la
- **Controlify (Controller support)** `controlify` · in 1/34 packs — Adds the best controller support to Minecraft Java edition!
- **Copycats+ aeronautics weight** `copycats+-aeronautics-weight` · in 1/34 packs — This mods is a compat between create aeronautics and copycat
- **CorgiLib** `corgilib` · in 1/34 packs — A library mod containing code used across Corgi Taco's mods.
- **Corpse x Cosmetic Armor Reworked Compat** `corpse-x-cosmetic-armor-reworked-compat` · in 1/34 packs — This little mod allows you to directly equip your Cosmetic A
- **Countered's Terrain Slabs** `countereds-terrain-slabs` · in 1/34 packs — A world generation mod that improves the terrain by adding s
- **CraftedCore** `crafted-core` · in 1/34 packs — Another API mod
- **Crafting Tweaks** `crafting-tweaks` · in 1/34 packs — Allows you to rotate, balance or clear the crafting matrix b
- **CraftTweaker** `crafttweaker` · in 1/34 packs — CraftTweaker allows modpacks and servers to customize the ga
- **Crate Delight: Croptopia** `crate-delight-croptopia` · in 1/34 packs — Useful crates and bags for Croptopia that will save you stor
- **Crawl** `crawl` · in 1/34 packs — Allows you to crawl
- **Create : Numismatic Bounties** `create-numismatic-bounties` · in 1/34 packs — Replace Bountiful trades with Create : Numismatic Coins
- **Create Aeronautics Lift Patch** `create-aeronautics-lift-patch` · in 1/34 packs — Attempts to fix the Sable lift calculation to be the proper 
- **Create Aeronautics: Automated Logistics** `create-aeronautics-automated-logistics` · in 1/34 packs — Put your airships to work! Build station networks, automate 
- **Create Aeronautics: Gadgets & Gizmos** `create-aeronautics-gadgets-and-gizmos` · in 1/34 packs — A create aeronautics addon that adds new ways to control and
- **Create Horse Power** `create-horse-power` · in 1/34 packs — Integration between animals and Create contraptions.
Power y
- **Create Man of Many Planes** `create-man-of-many-planes` · in 1/34 packs — A simple datapack that adds Create recipes for Man of Many P
- **Create Numismatics: Villager Currency** `numismatics-villager-currency` · in 1/34 packs — Replaces emeralds in villager trades with Create: Numismatic
- **Create Sable Dynamic Lights** `create-sable-dynamic-lights` · in 1/34 packs — A bridge between Sodium Dynamic Lights and the Create mod as
- **Create Simulated Additions** `create-simulated-additions` · in 1/34 packs — A few additions and tweaks for the Create Simulated/Aeronaut
- **Create Stuff 'N Additions x Sable & Aeronautics Compat** `create-stuff-n-additions-x-sable-aeronautics-compat` · in 1/34 packs — Makes Create: Stuff and additions fully compatible with sabl
- **Create Unlimited** `create-unlimited` · in 1/34 packs — Remove all the limits!
- **Create: Access Denied** `create-access-denied` · in 1/34 packs — Simple access management for stock keepers in your logistics
- **Create: Additional Logistics** `create-additional-logistics` · in 1/34 packs — Adds a few new logistics-oriented blocks to Create, and twea
- **Create: Applied Kinetics** `create-applied-kinetics` · in 1/34 packs — Applied Kinetics's integration with Create
- **Create: Ballast** `create-ballast` · in 1/34 packs — Adds a new layerable block that has more mass with each adde
- **Create: Better Motors** `create-better-motors` · in 1/34 packs — Create: Better Motors introduces 7 powerful, fully configura
- **Create: Bionics** `create-bionics` · in 1/34 packs — A mod that adds robot animals to Create
- **Create: Blockchain** `create-blockchain` · in 1/34 packs — Simulates "block chain" currency generation for Create: Numi
- **Create: Brassworks Missions** `create-brassworks-missions` · in 1/34 packs — A Create addon adding missions with a clean, Create-style UI
- **Create: Buzzy Bees** `create-buzzy-bees` · in 1/34 packs — Factorio style robots for your create world!
- **Create: Cardboard Things** `create-cardboard-things` · in 1/34 packs — Addon that adds 9 cardboard-based items with unique mechanic
- **Create: CC Better Recipes** `create-ccbr` · in 1/34 packs — Balances ComputerCraft by making its recipes require Create 
- **Create: Chicken Nuggets** `create-chicken-nuggets` · in 1/34 packs — An extension of create that allows you to make chicken nugge
- **Create: Cold Sweat** `create-cold-sweat` · in 1/34 packs — Create X Cold Sweat
- **Create: Compat Core** `create-compat-core` · in 1/34 packs — The Core Mod with new Items and Recipes used for all Create:
- **Create: Configurable Machine Outputs** `create-configurable-crushing-wheel` · in 1/34 packs — Take control of your create machinery automation! This mod l
- **Create: Crafts & (More) Additions** `create-more-additions` · in 1/34 packs — Silver Ore, proper Electrum recipe, and more content for Cre
- **Create: Cyber Goggles** `create-cyber-goggles` · in 1/34 packs — A client-side mod for Create that provides modular assistanc
- **Create: Delivery Director [Discontinued]** `delivery-director` · in 1/34 packs — Adds a bunch of new features for Create Packages
- **Create: Design n' Decor - Aeronautics Compat** `create-design-n-decor-aeronautics-compat` · in 1/34 packs — A lightweight compatibility mod that connects Create: Design
- **Create: Dynamic Village** `dynamic-village` · in 1/34 packs — Adds a host of Create-mod villagers and structures to bring 
- **Create: FastSchematicCannon** `create-fast-schematic-cannon` · in 1/34 packs — A mod for make schematic cannon more fast and fix cannon del
- **Create: Fishing Bobber Detector** `create-fishing-bobber-detector` · in 1/34 packs — Automatic fishing with create
- **Create: Fully Automated** `create-fully-automated` · in 1/34 packs — More Create Recipes For Even More Automation!
- **Create: Gears n' Kinetics** `gears-n-kinetics` · in 1/34 packs — Custom Cogs, Gears, & Kinetics!
- **Create: Guardian-shooter** `create-guardian-shooter` · in 1/34 packs — Auto-targeting for CBC the with Aeronautics support And the 
- **Create: Gunsmithing** `cgs` · in 1/34 packs — Adds steampunk guns to the Create mod
- **Create: Haven Qualities** `create-haven-qualities` · in 1/34 packs — Adds more blocks, items and recipes, an addon for Create.
- **Create: Integrated Farming** `create-integrated-farming` · in 1/34 packs — Integrated farming automation for Create
- **Create: Lazy Engines** `lazy-engines` · in 1/34 packs — Configurable Steam Engines
- **Create: LazyTick** `createlazytick` · in 1/34 packs — A commitment to optimizing Create lag in large quantities!
- **Create: Marketplace** `create-marketplace` · in 1/34 packs — A global market board for Create: Numismatics. Register your
- **Create: Meta Logistics** `create-meta-logistics` · in 1/34 packs — Manage remote & unloaded storage networks in Create, access 
- **Create: Metallurgy** `create-metallurgy` · in 1/34 packs — Create Metallurgy is a Create Mod Addon adding new metallurg
- **Create: Mixed Casing** `create-mixed-casing` · in 1/34 packs — Adds new casings and allows to mix the metals and the planks
- **Create: More Features** `create-more-features` · in 1/34 packs — This addon adds new professions for villagers, new mechanism
- **Create: New Beginnings** `create-new-beginnings` · in 1/34 packs — Unique, vanilla+ structures added to villages and the world,
- **Create: Numismatics Advancement Seeker** `create-numismatics-advancement-seeker` · in 1/34 packs — Gain Create: Numismatics currencies from completing advancem
- **Create: Numismatics Utils** `create-numismatics-utils` · in 1/34 packs — Utilities for Create: Numismatics! Display Account Balance o
- **Create: Packagers PSI Compat** `packagerspsic` · in 1/34 packs — Allows Create packagers to interact with PSI (Portable stora
- **Create: Peaceful** `create-peaceful` · in 1/34 packs — A lightweight Create addon that lets you farm all monster dr
- **Create: Perfect Processing** `create-perfect-processing` · in 1/34 packs — An additional recipe mod for Create on 1.21.1; for use in a 
- **Create: Prismatic Shine** `create-prismatic-shine` · in 1/34 packs — A remake version of Create: Crystal Clear, adds glass casing
- **Create: Rainbow Compound** `rainbowcompound` · in 1/34 packs — This mod re-added the new recipe of Chromatic in Create and 
- **Create: Rocked and Decadent** `create-rocked-and-decadent` · in 1/34 packs — An addon for Create that adds a bunch of recipes that allow 
- **Create: Shuffle Filter** `create-shuffle-filter` · in 1/34 packs — This mod provides a new "Shuffle Filter" item which, when us
- **Create: Sound of Steam: Tuning Wrench** `create-sound-of-steam-tuning-wrench` · in 1/34 packs — Adds a wrench for automatically setting the channels of reds
- **Create: Sound of Steam: Ultimine Tuning** `create-sound-of-steam-ultimine-tuning` · in 1/34 packs — An automation addon that integrates Tuning Wrench with the F
- **Create: SpawnerBoxer** `create-spawnerboxer` · in 1/34 packs — Deployers from Create mod can now activate spawners!
- **Create: TFMG - Stellaris Compat** `tfmg-stellaris-compat` · in 1/34 packs — Integrates Stellaris into the TFMG mod
- **Create: Tracks+** `create-tracks+` · in 1/34 packs — This mod is a fork of qwxon's Create:Tracks.
Add Create:Trac
- **Create: Train Track Rail Grinding** `create-rail-grinding` · in 1/34 packs — Adds Rail-Grinding from the Sonic the Hedgehog Series and ea
- **Create: Transmission!** `create-transmission!` · in 1/34 packs — Minecraft Create addon that adds a single block: Transmissio
- **Create: Wizardry** `create-wizardry` · in 1/34 packs — This is an addon mod for Create adding enhanced compatibilit
- **Created Simple Storage Network** `created-simple-storage-network` · in 1/34 packs — Created Storage Network is an Resource Pack that updates the
- **Creating Space** `creating-space` · in 1/34 packs — Creating Space is a mod that allow you to create rocket usin
- **Critters and Companions** `critters-and-companions` · in 1/34 packs — Adds a few new friends to your world!
- **Croakma-keys** `croakma-keys` · in 1/34 packs — Croakma-keys replaces Froglights with different types of Chr
- **Crystalix** `crystalix` · in 1/34 packs — Adds a bunch of colored glass blocks with many different fun
- **Ctrl Q** `ctrl-q` · in 1/34 packs — This mod forces "CTRL+Q" to be used to drop a stack of item
- **Cucumber Library** `cucumber` · in 1/34 packs — A library of shared code and functionality used by my mods.
- **Cumulus** `cumulus` · in 1/34 packs — An API for custom and compatible main menu registration.
- **Custom Biome Saplings** `terralith-biome-saplings` · in 1/34 packs — Allows Terralith and Blooming Biosphere trees to be regrown 
- **Custom Discs** `customdiscs-mod` · in 1/34 packs — Play your own music in Minecraft jukeboxes
- **Custom Window Title** `custom-window-title` · in 1/34 packs — Client-side mod to change window title (including special to
- **CustomNPCs-Unofficial** `customnpcs-unofficial` · in 1/34 packs — Unofficial version of CustomNPCs mod ported to the newer ver
- **CustomSkinLoader** `customskinloader` · in 1/34 packs — Custom Skin Loader mod for Minecraft.
- **Dark Mode Everywhere** `dark-mode-everywhere` · in 1/34 packs — Have dark GUIs everywhere with the power of shaders
- **Dark Window Bar** `dark-window-bar` · in 1/34 packs — Makes the Minecraft window title bar dark on Windows.
- **Decorative Blocks Reborn** `decorative-blocks-reborn` · in 1/34 packs — Some new blocks to build with. Updated to 1.21.1+
- **Decorative Lamps** `decorative-lamps` · in 1/34 packs — This mod adds new lamps, which are dimmable and can be used 
- **Deeper and Darker: Spellbooks** `deeper-and-darker-spellbooks` · in 1/34 packs — An Addon for Iron's Spells 'n Spellbooks and Deeper and Dark
- **Deeper Oceans** `deeper-oceans` · in 1/34 packs — Oceans, but deeper!
- **Default Dark Mode** `default-dark-mode` · in 1/34 packs — 🌙 The Dark Mode Resource Pack for Minecraft: Java Edition
- **Default Options** `default-options` · in 1/34 packs — A way for modpacks to ship a default (key) configuration wit
- **Detail Armor Bar Reconstructed** `detail-armor-bar-reconstructed` · in 1/34 packs — More details about armor in the armor bar!
- **Ding** `ding` · in 1/34 packs — Plays a configurable sound when Minecraft loads and reaches 
- **Dis-Enchanting Table** `dis-enchanting-table` · in 1/34 packs — Recover enchantments from enchanted weapons or books!
- **Display Delight** `display-delight` · in 1/34 packs — Allows to place every food item in Farmer's Delight in 3D
- **Distracting Trims** `distracting-trims` · in 1/34 packs — Armor with golden trims can now distract piglins from attack
- **Dragon Mounts Remastered** `dmr` · in 1/34 packs — Dragon mounts Remastered is the latest take in bringing back
- **Drive-By-Wire with Sable** `drive-by-wire-sable` · in 1/34 packs — Port Drive-By-Wire Mod to Sable. Control your Sable vehicles
- **Dungeons and Taverns Ancient City Overhaul** `dungeons-and-taverns-ancient-city-overhaul` · in 1/34 packs — Standalone Splinter version of Dungeons and Taverns Ancient 
- **Dungeons and Taverns Nether Fortress Overhaul** `dungeons-and-taverns-nether-fortress-overhaul` · in 1/34 packs — This Mod Overhauls the Nether Fortress with 1 guaranteed spa
- **Dungeons and Taverns Pillager Outpost Overhaul** `dungeons-and-taverns-pillager-outpost-overhaul` · in 1/34 packs — Standalone split version of the Pillager Outpost Overhaul fr
- **Dungeons and Taverns Swamp Hut Overhaul** `dungeons-and-taverns-swamp-hut-overhaul` · in 1/34 packs — This Splinter Standalone version of Dungeons and Tavern adds
- **Durability Tooltip** `durability-tooltip` · in 1/34 packs — Durability Tooltip shows you the durability of an item!
- **Dynamic Lights** `dynamic-torches` · in 1/34 packs — Adds dynamic lights for players, items, mobs, etc.
- **Dynamic Trees** `dynamictrees` · in 1/34 packs — Trees that grow, forests that spread
- **Dynamic Trees - Oh The Biomes We've Gone** `dynamic-trees-bwg` · in 1/34 packs — Compatibility mod between Dynamic Trees and Oh The Biomes We
- **Dynamic Trees - Terralith** `dynamic-trees-terralith` · in 1/34 packs — Compatibility Mod between Dynamic trees and Terralith
- **Dynamic Trees for Nature's Spirit** `dynamic-trees-for-natures-spirit` · in 1/34 packs — Dynamic trees grow in nature.
- **Dynamic Trees Plus** `dynamictreesplus` · in 1/34 packs — More than just trees!
- **Ears (+ Snouts/Muzzles, Tails, Horns, Wings, and More)** `ears` · in 1/34 packs — More skin customization options for just about every version
- **Easel Does It!** `easel-does-it` · in 1/34 packs — Adds the Easel and more, making interacting with paintings m
- **Easy Craft Saddles** `easy-craft-saddles` · in 1/34 packs — An easy way to craft Saddles
- **Easy Mob Farm** `easy-mob-farm` · in 1/34 packs — The easy mob farm is a server friendly way to capture differ
- **Eat an Omelette** `eat-an-omelette` · in 1/34 packs — Simple and easy, you can now cook eggs to obtain omelets!
- **Ecologics** `ecologics` · in 1/34 packs — Simple vanilla biome updates, with fun mobs, blocks, and mor
- **Effect Timer Plus** `effecttimerplus` · in 1/34 packs — Adds a potency and time indicator overlay to status effect i
- **Effectual** `effectual` · in 1/34 packs — Atmospheric effects and decorative particles.
- **Electrodynamics** `electrodynamics` · in 1/34 packs — Electrodynamics is a Minecraft Mod focused around science an
- **ElevatorMod** `elevatormod` · in 1/34 packs — Simple port of the elevator from OpenBlocks to 1.8+
- **Elite X Quality Guns (TACZ)** `elite-x-quality-guns` · in 1/34 packs — Tac Z addon mod that Adds weapons from Elite X Warfare but e
- **Elytra Physics** `elytra-physics` · in 1/34 packs — A simple mod that adds cape-like physics to the elytra when 
- **Elytra Trims** `elytra-trims` · in 1/34 packs — Customizable elytra mod with trims, banner patterns and more
- **Elytra Vaults** `elytra-vaults-atlasplays` · in 1/34 packs — This Datapack/Plugin changes End City Ships to spawn with Va
- **EMF Compat: Carry On** `emf-compat-carry-on` · in 1/34 packs — Makes Carry On work correctly with animated EMF player model
- **EMF Compat: Core** `emf-compat-core` · in 1/34 packs — Shared framework for the EMF Compat family.
- **EMF Compat: Create** `create-emf-compat-skyhook` · in 1/34 packs — Makes Create animations work correctly with animated EMF pla
- **EMF Compat: Immersive Melodies** `emf-compat-immersive-melodies` · in 1/34 packs — Makes Immersive Melodies work correctly with animated EMF pl
- **EMF Compat: Not Enough Animations** `not-enough-animations-emf-compat` · in 1/34 packs — Makes Not Enough Animations work correctly with animated EMF
- **EMF Compat: Quark** `emf-compat-quark` · in 1/34 packs — Makes Quark emotes work correctly with animated EMF player m
- **EMF Compat: Supplementaries** `emf-compat-supplementaries` · in 1/34 packs — Makes Supplementaries items work correctly with animated EMF
- **EMI Recipe Pin** `emi-recipe-pin` · in 1/34 packs — Now you can pin a recipe preview for easier repeated craftin
- **EMI++** `emixx` · in 1/34 packs — A mod that added many features to EMI!
- **EMIffect** `emiffect` · in 1/34 packs — EMI addon that appends status effects in EMI and provides in
- **Emoji Type** `emoji-type` · in 1/34 packs — Type Minecraft emojis and symbols with simple shortcodes.
- **Emote Tweaks (Emotecraft Team Continuation)** `emote-tweaks` · in 1/34 packs — Allows you to play sounds with emotes with the help of simpl
- **Emotecraft** `emotecraft` · in 1/34 packs — Create your own emotes in Minecraft.
- **Emotecraft: Borrow Their Emote (EBTE)** `emotecraft-borrow-their-emote` · in 1/34 packs — Client-side addon for Emotecraft, that lets you borrow anoth
- **Enchantment Outlines** `glowing-glints` · in 1/34 packs — Adds an outline to all enchantable tools.
- **End Remastered** `endrem` · in 1/34 packs — Make your journey to the End more Challenging and Engaging w
- **Ender's Delight** `enders-delight` · in 1/34 packs — An addon for Farmer's Delight based around adding culinary c
- **Enderman Overhaul** `enderman-overhaul` · in 1/34 packs — Enderman Overhaul adds over 20 new enderman variants, each w
- **EnderPack** `enderpack` · in 1/34 packs — An incredible ender backpack!
- **EnhancedVisuals** `enhancedvisuals` · in 1/34 packs — Feel the pain!
- **Epic Knights: Addon** `epic-knights-addon` · in 1/34 packs — Adds additional medieval stuff to the Epic Knights mod
- **Epic Knights: Shields Armor and Weapons** `epic-knights-shields-armor-and-weapons` · in 1/34 packs — Adds medieval armor and weapons
- **Epic Power Bracelets** `epic-power-bracelets` · in 1/34 packs — You can use epic bracelets to get more powers!
- **Essential Mod** `essential` · in 1/34 packs — Enhance your Minecraft with one simple mod. Host worlds for 
- **Etched** `etched` · in 1/34 packs — A new form of entertainment. Create and play your very own r
- **Every Compat (Wood Good)** `every-compat` · in 1/34 packs — Universal Wood Compat: Quark, Twilight Forest, Twigs, Anothe
- **Exclusive Weapons, Armor and Tools** `exclusive-weapons-armor-and-tools` · in 1/34 packs — This mod adds a set of upgraded weapons, tools, and armor us
- **Expanded Combat** `expanded-combat` · in 1/34 packs — This Mod Adds A few things to expand the resources you have 
- **Explore Ruins: The Aether - Dungeons & Structures** `explore-ruins-aether` · in 1/34 packs — New dungeons and structures in the Aether dimension.
- **Exposure: Polaroid** `exposure-polaroid` · in 1/34 packs — Addon for Exposure that adds Instant Camera
- **Extra Bounties** `extra-bounties` · in 1/34 packs — Add Bountiful compatibility to other mods
- **ExtraLib** `extralib` · in 1/34 packs — Library for mods.
- **ExtraQuests [FTB Quests]** `extraquests` · in 1/34 packs — Addon adds new tasks, rewards and functions.
- **ExtraSounds Next** `extrasoundsforge` · in 1/34 packs — UI sounds & more.
- **Fabric Language Kotlin** `fabric-language-kotlin` · in 1/34 packs — This is a mod that enables usage of the Kotlin programming l
- **Factory Blocks** `factory-blocks` · in 1/34 packs — Adds Factory Blocks to Minecraft
- **FallingTree** `fallingtree` · in 1/34 packs — Break down your trees by only cutting one piece of it
- **Fancy Toasts | Better Advancements** `fancy-toasts` · in 1/34 packs — Overhauls the old advancement toast system
- **Fancy World Animations** `fwa` · in 1/34 packs — This mod adds animations to a bunch of interactable blocks l
- **Farmer's (Delight) Croptopia** `farmers-croptopia` · in 1/34 packs — Compatibility between Farmer's Delight and Croptopia
- **Farmer's Cutting: Biomes O' Plenty** `farmers-cutting-biomes-o-plenty` · in 1/34 packs — Adds Farmer's Delight cutting recipes for Biomes O' Plenty
- **Farmer's Cutting: Oh The Biomes We've Gone** `farmers-cutting-oh-the-biomes-weve-gone` · in 1/34 packs — Adds Farmer's Delight cutting recipes for Oh The Biomes We'v
- **Farmer's Cutting: Quark** `farmers-cutting-quark` · in 1/34 packs — Adds Farmer's Delight cutting recipes for Quark
- **Farmer's Cutting: The Aether** `farmers-cutting-the-aether` · in 1/34 packs — Adds Farmer's Delight cutting recipes for The Aether
- **Fast Better Grass** `fast-better-grass` · in 1/34 packs — Makes grass and related blocks use the top texture on the si
- **Fast Noise** `zfastnoise` · in 1/34 packs — Vanilla Worldgen optimization mod
- **Faster Iris Shadow Mapper** `fism` · in 1/34 packs — Slightly improves the speed of Iris' shadow mapper. Built-in
- **Female Gender Mod** `female-gender` · in 1/34 packs — The Female Gender Mod introduces extra player model customiz
- **First-person Model** `first-person-model` · in 1/34 packs — Enables the third-person Model in first-person
- **Flashback** `flashback` · in 1/34 packs — Record your Minecraft gameplay, play it back and create stun
- **Flat Bedrock** `flat-bedrock` · in 1/34 packs — Make the world have flat bedrock
- **Fog** `fog` · in 1/34 packs — Enhances fog rendering with dynamic, customizable effects—im
- **Foolproof** `foolproof` · in 1/34 packs — Utility for modpack devs that fixes commonly reported areas 
- **Forest Ruins** `forest-ruins` · in 1/34 packs — Adds many different ruins to all forest biomes
- **Forgematica** `forgematica` · in 1/34 packs — Litematica unofficial (Neo)Forge port. A modern client-side 
- **Forgotten Church** `forgotten-church` · in 1/34 packs — Adds a creepy abandoned church with zombies and hidden loot
- **Fresh Animations: Extensions** `fresh-animations-extensions` · in 1/34 packs — A combination of offical extension packs for Fresh Animation
- **Fresh Animations: Objects** `fresh-animations-objects` · in 1/34 packs — Animates non-mob entities in Fresh Animations' style. An off
- **Fresh Animations: Quivers** `fresh-animations-quivers` · in 1/34 packs — Gives skeletons quivers, compatible with Fresh Animations. A
- **Fresh Waystones Texture** `fresh-waystones-texture` · in 1/34 packs — Resource pack that will improve textures from the waystones 
- **Friends&Foes (Forge/NeoForge)** `friends-and-foes-forge` · in 1/34 packs — Adds outvoted and forgotten mobs from the mob vote, expandin
- **Fruits Delight** `fruits-delight` · in 1/34 packs — Adds fruits, jelly, juice, and fruit-based food in Farmer's 
- **Fuel Goes Here** `fuelgoeshere` · in 1/34 packs — Fuel should go to the fuel slot even when there's a smelting
- **Fullbright** `fullbright-forge` · in 1/34 packs — This Mod will lighten up your Minecraft Experience by toggli
- **Fungi Delight (A Farmer's Delight Add-on)** `fungi-delight` · in 1/34 packs — An addon mod for Farmer's Delight that expand it with a vari
- **Gabou's Libs - New logo LIZZARRDD** `gabous-libs` · in 1/34 packs — A shared library that provides core functionality for my mod
- **Galosphere** `galosphere` · in 1/34 packs — An expansion for caves, including new biomes, mobs, and more
- **Gentler Weather Sounds** `gentler-weather-sounds` · in 1/34 packs — Weather sounds you won't mind listening to // Complete repla
- **Ghost** `ghost` · in 1/34 packs — Adds little ghosts to Minecraft :D
- **Gliders** `gliders` · in 1/34 packs — Gliders: essential for traversing terrain and preventing fal
- **Golden Foods!** `golden-foods` · in 1/34 packs — In the style of Golden Apples and Enchanted Golden Apples, t
- **Grappling Hook Mod: Skybound** `grapplemod-skybound` · in 1/34 packs — Grapple onto Create contraptions, Sable airships, and everyt
- **Guard Villagers** `guard-villagers` · in 1/34 packs — Village Pest Control
- **GuidedMod** `guidedmod` · in 1/34 packs — A mod for modpack creators to guide players through mode sel
- **Hide Experimental Warning** `hide-experimental-warning` · in 1/34 packs — ❌ Hides the Experimental Settings Warning when trying to cre
- **Hide Item Frame** `hide-item-frame` · in 1/34 packs — Hide the frame if it contains an item
- **Homesteads - Villager Expansion & New Professions** `homesteads` · in 1/34 packs — Homesteads is for the villagers who would prefer to forge th
- **Hopo Better Mineshaft** `hopo-better-mineshaft` · in 1/34 packs — More and better mineshafts to explore
- **Hopo Better Ruined Portals** `hopo-better-ruined-portals` · in 1/34 packs — Improve how the portals look in your world
- **Horseman** `horseman` · in 1/34 packs — Improved horses: faster hitching, smooth riding, QOL feature
- **I'm Fast** `im-fast` · in 1/34 packs — A mod to remove minecraft moved too quickly! and moved wrong
- **I18nUpdateMod** `i18nupdatemod` · in 1/34 packs — Brand new update mod for "Minecraft Mod Language Package".
全
- **iChunUtil** `ichunutil` · in 1/34 packs — Shared library used by iChun's mods
- **IMBlocker** `imblocker-original` · in 1/34 packs — A mod for Minecraft helping control input method
- **Immersive Armors** `immersive-armors` · in 1/34 packs — A lot of unique and vanilla-faithful armor sets.
- **Immersive Engineering** `immersiveengineering` · in 1/34 packs — Retrofuturism, industry and multiblocks!
- **Immersive Optimization** `immersive-optimization` · in 1/34 packs — A lightweight entity-tick-scheduler for doubling your TPS.
- **Immersive Overlays** `immersive-overlays` · in 1/34 packs — Overlays useful info like coordinates and the time onto your
- **Immersive Snow** `immersive-snow` · in 1/34 packs — Small tweaks that add to Minecraft's Winter theme. Intended 
- **Immersive Sounds** `immersive-sound` · in 1/34 packs — This mod adds ambiental sounds to make you feel more IN the 
- **Immersive Winds** `immersive-winds` · in 1/34 packs — Overhauls weather in your Minecraft world for a windy qualit
- **Improved Mobs** `improved-mobs` · in 1/34 packs — Harder mobs for increased difficulty
- **Incendium Legacy** `incendium` · in 1/34 packs — A nether biome overhaul combined with challenging structures
- **Incubation** `incubation` · in 1/34 packs — Lays down a dozen of egg-related features!
- **Insanity Shader** `insanity-shader` · in 1/34 packs — A stylized, horror themed Iris shaderpack with high customiz
- **Integrated Villages** `integrated-villages` · in 1/34 packs — Overhauling vanilla villages with heavily detailed and integ
- **Inventory Blur** `inventory-blur` · in 1/34 packs — Applies the new 1.20.5 menu background blur to Inventories s
- **Inventory Interactions** `inventory-interactions` · in 1/34 packs — Inventory Particles Add-on which adds a lot of new item inte
- **Inventory Particles** `inventory-particles` · in 1/34 packs — Beautiful particles for your inventory items! Make your inve
- **InvMoveCompats** `invmovecompats` · in 1/34 packs — Addon for InvMove that adds additional mod compatibilities
- **Invocore (Code Library)** `invocore-utility-mod` · in 1/34 packs — Code library for Invoker54 mods
- **Iris & Oculus Search** `irissearch` · in 1/34 packs — A mod that adds a search bar to Iris and Oculus to quickly f
- **Iron Furnaces** `iron-furnaces` · in 1/34 packs — Inspired by cpw's Iron Chests mod, adds a few different tier
- **Iron's Lib** `irons-lib` · in 1/34 packs — Provides common functionality and content for Iron's mods
- **Iron's Spells 'n Spellbooks** `irons-spells-n-spellbooks` · in 1/34 packs — A magic mod bringing back the classic RPG spellcasting fanta
- **Item Highlighter** `item-highlighter` · in 1/34 packs — Highlights newly picked-up items. Simple and convenient.
- **Item interactions mod** `item-interactions-mod` · in 1/34 packs — Small animations tweak and particles for the inventory
- **Item Obliterator** `item-obliterator` · in 1/34 packs — Modpack utility mod that allows to disable items and/or its 
- **ItemPhysic** `itemphysic` · in 1/34 packs — Items lay on the ground, wood swims in water, stone does not
- **ItemPhysic Lite** `itemphysic-lite` · in 1/34 packs — items fall to the ground and do not float
- **Ixeris** `ixeris` · in 1/34 packs — Buffered raw input and threaded event polling
- **Jade Sable Compat** `jade-sable-compat` · in 1/34 packs — Jade Sable Compat (Create Aeronautics) is a NeoForge client 
- **Jauml** `jauml` · in 1/34 packs — Jauml is a lightweight configuration library for Minecraft m
- **JeremySeq's Damage Indicator** `jeremyseqs-damage-indicator` · in 1/34 packs — Adds a directional damage indicator.
- **JourneyMap** `journeymap` · in 1/34 packs — Real-time map used for mapping in-game or your browser as yo
- **JourneyMap Integration** `journeymap-integration` · in 1/34 packs — Adds some mod integrations for our favorite map mod
- **Just Better Recipes** `just-better-recipes` · in 1/34 packs — A Datapack/Mod which adds TONS (over 3.000) of new and usefu
- **Just Hammers** `just-hammers` · in 1/34 packs — Adds hammers to the game that are able to mine in a 3x3, 3x3
- **JustEnoughCharacters** `justenoughcharacters` · in 1/34 packs — A tweak to many mods to search in Chinese Pinyin。
- **Kambrik** `kambrik` · in 1/34 packs — A Kotlin Library Mod
- **Katters Structures** `katters-structures` · in 1/34 packs — Adds 30+ brand new vanilla like structures to the game
- **Katters Structures - Dungeon** `katters-structures-only-dungeon` · in 1/34 packs — Sub-project of "Katters Structures" with only the Dungeons
- **Kerria** `kerria-opt` · in 1/34 packs — Faster texture animation
- **KeyBind Bundles** `keybind-bundles` · in 1/34 packs — Do you have too many keybinds but not enough physical keys f
- **KeybindsPurger** `keybindspurger` · in 1/34 packs — Unset all keybinds for a clean slate
- **Kitchen Projectiles** `kitchen-projectiles` · in 1/34 packs — Make Farmer's Delight knives throwable
- **Kiwi 🥝** `kiwi` · in 1/34 packs — Minecraft modding library
- **Kleiders Custom Renderer API** `kleiders-custom-renderer-api` · in 1/34 packs — API for adding textures and models over players with MCreato
- **Krypton Reno** `krypton-fnp` · in 1/34 packs — Provides powerful network optimization capabilities for all 
- **Ksyxis** `ksyxis` · in 1/34 packs — Speed up your world loading by removing unneeded chunks.
- **KubeJS Delight** `kubejs-delight` · in 1/34 packs — Farmer's Delight integration with KubeJS
- **LAN World Plug-n-Play (mcwifipnp)** `mcwifipnp` · in 1/34 packs — LAN World Plug-n-Play (mcwifipnp)
- **LDLib** `ldlib` · in 1/34 packs — LDLib is a libarary mod for custom rendering, modular gui.
- **Legendary Tooltips** `legendary-tooltips` · in 1/34 packs — Give your rare items a fancier tooltip! Also adds additional
- **Lighty** `lighty` · in 1/34 packs — The Light Overlay Mod with a twist!
- **Litematica** `litematica` · in 1/34 packs — A client-side schematic mod with extra features for creative
- **Liteminer** `liteminer` · in 1/34 packs — Mine an entire vein of ore, chop an entire tree or break any
- **Little Structures** `little-structures` · in 1/34 packs — Adds atmosphere with 30+ subtle, vanilla-friendly ruins and 
- **Living Things** `living-things` · in 1/34 packs — adds various new mobs to Minecraft
- **Load My F***ing Tags** `lmft` · in 1/34 packs — Prevents Incorrect Tag Entries from breaking an entire Tag
- **Load Support** `loadsupport` · in 1/34 packs — Shows when the user has too less Java memory allocated, and 
- **Log Begone** `log-begone` · in 1/34 packs — Fork of Shut Up Console - Tell those those annoy logs lines 
- **Longer Following Time** `longer-following-time` · in 1/34 packs — Animals will follow you even after switching the item in you
- **LootJS: KubeJS Addon** `lootjs` · in 1/34 packs — A Minecraft mod for packdevs to easily modify the loot syste
- **Lost Cities Modern Tweaks** `lost-cities-modern-tweaks` · in 1/34 packs — A datapack that applies various tweaks to the default Lost C
- **Lost Souls** `lost-souls` · in 1/34 packs — The Lost Cities addon to add more danger to the buildings.
- **Luki's Ancient Cities** `lukis-ancient-cities` · in 1/34 packs — New Ancient Cities to be lost in.
- **Luki's Crazy Chambers** `lukis-crazy-chambers` · in 1/34 packs — New and Improved Trial Chambers
- **Luki's Strongholds** `lukis-strongholds` · in 1/34 packs — New Strongholds to uncover and conquer.
- **Luki's Woodland Mansions** `lukis-woodland-mansions` · in 1/34 packs — New Mansions to explore and traverse.
- **Macaw's Biomes O' Plenty** `macaws-biomes-o-plenty` · in 1/34 packs — A compatibility between Macaw's Mods and the different woods
- **Macaw's Holidays** `macaws-holidays` · in 1/34 packs — Adds Christmas & Halloween decorations, Christmas Tree, Ligh
- **Macaw's Oh The Biomes You'll Go / We've Gone** `macaws-byg-bwg` · in 1/34 packs — A compatibility between Macaw's Mods and the different woods
- **Macaw's Paintings** `macaws-paintings` · in 1/34 packs — Adds custom drawn paintings to fit in your world!
- **Macaw's Quark** `macaws-quark` · in 1/34 packs — A multiple compability for Quark with Macaw's Mods like Brid
- **MaidUseHandCrank** `maidusehandcrank` · in 1/34 packs — Allows Touhou Little Maid to use Create's Hand Crank
- **Main Menu Credits** `main-menu-credits` · in 1/34 packs — Adds a way of adding information to the user's title screen.
- **MakeUp - Ultra Fast** `makeup-ultra-fast-shaders` · in 1/34 packs — MakeUp aims to provide the best quality / performance ratio,
- **MaLiLib** `malilib` · in 1/34 packs — A library mod for client-side mods. Contains most of the com
- **Mandala's GUI - Dark mode** `mandalas-gui-dark-mode` · in 1/34 packs — Mandala GUI is an elegant theme, in the style of Mandala Cre
- **Map Atlases [Forge]** `map-atlases-forge` · in 1/34 packs — A world map/mini map mod based on vanilla Maps!
- **Map Distance Fix** `map-distance-fix` · in 1/34 packs — A simple mod that shows a player indicator instead of a whit
- **Map Link  (formerly Remote Player Waypoints for Xaero's Map)** `maplink` · in 1/34 packs — Downloads and converts tiles and synchronizes players, marke
- **McMouser** `mcmouser` · in 1/34 packs — A mod that fixes various mouse bugs on macOS
- **Measurements** `measurements` · in 1/34 packs — Allows measuring distance using a tape measure.
- **Mebahel's Zombie Horde** `mebahels-zombie-horde` · in 1/34 packs — No zombie is alone — prepare for group hunts, AI ambushes, a
- **Medical System** `med-system` · in 1/34 packs — Reworked health system for entities, split hitboxes for head
- **Mekanism** `mekanism` · in 1/34 packs — High-tech machinery, powerful energy generation, fancy gadge
- **Mekanism Generators** `mekanism-generators` · in 1/34 packs — Advanced energy generation for Mekanism.
- **Mekanism Tools** `mekanism-tools` · in 1/34 packs — Powerful tools and armor for Mekanism.
- **Mini Items** `mini-items-pack` · in 1/34 packs — Free up your screen space with half sized items
- **Mini's Cobblemon Icons** `minis-cobblemon-icons` · in 1/34 packs — Shuffle Style Cobblemon Icons for xearo's minimap that combi
- **MixinTrace Reforged** `mixintrace-reforged` · in 1/34 packs — Adds Mixin information to stack traces in crash reports for 
- **MmmMmmMmmMmm** `mmmmmmmmmmmm` · in 1/34 packs — Target Dummy that show damage dealt and can be equipped with
- **MNS - Moog's Nether Structures** `mns-moogs-nether-structures` · in 1/34 packs — loads of structures made with vanilla blocks and entities br
- **Mod Menu** `modmenu` · in 1/34 packs — Adds a mod menu to view the list of mods you have installed.
- **Modern World Creation** `modern-world-creation` · in 1/34 packs — Gives the Create World screen a makeover!
- **Mogrul Lib** `mogrul-lib` · in 1/34 packs — A small library mod intended to be used as an integration-to
- **Mogrul Playtime** `mogrul-play-time` · in 1/34 packs — A simple time-tracking server-side mod to create a scoreboar
- **MonoLib** `monolib` · in 1/34 packs — A non-invasive library mod for Fabric, Forge, and NeoForge.
- **Moog's Structure Lib (moogs_structures)** `moogs-structure-lib` · in 1/34 packs — This is a library mod for the Moogs Structure series
- **More Armor Trims** `more-armor-trims` · in 1/34 packs — Adds 13 new armor trims to discover and collect
- **More Beautiful Torches** `more-beautiful-torches` · in 1/34 packs — The goal of More Beautiful Torches is to increase the decora
- **More Bows and Arrows** `more-bows-and-arrows` · in 1/34 packs — The objective of More Bows and Arrows is to improve the rang
- **More Mobs** `more-mobs` · in 1/34 packs — Humanoid mobs get new variants through over 85 custom player
- **More Mouse Tweaks** `moremousetweaks` · in 1/34 packs — Complements MouseTweaks by adding more mouse functionality f
- **More Sounds** `more-sounds` · in 1/34 packs — A Sounds mod addon that adds custom sounds and modded compat
- **MoreCobblemonTweaks** `more-cobblemon-tweaks` · in 1/34 packs — A qol cobblemon client mod introducing various qol improveme
- **MossyLib** `mossylib` · in 1/34 packs — Library with basic utilities for Mossy projects.
- **Multi Arrow Effects** `multi-arrow-effects` · in 1/34 packs — Combine arrows with potion effects and carry multiple effect
- **Musket Mod** `musket-mod` · in 1/34 packs — Adds craftable flintlock weapons
- **MVS - Moog's Voyager Structures** `moogs-voyager-structures` · in 1/34 packs — adds 130+ vanilla style structures to your world to bring it
- **Mystical Agradditions** `mystical-agradditions` · in 1/34 packs — Adds tier 6 crops, Tinkers' support, Paxels and more to Myst
- **Mystical Agriculture** `mystical-agriculture` · in 1/34 packs — Adds resource crops for more than 150+ vanilla & modded mate
- **Navas ZA Megas** `navas-zamega` · in 1/34 packs — Adds All Megas from Pokemon Legends ZA into Cobblemon! (MSD 
- **Necronomicon API** `necronomicon` · in 1/34 packs — A personal utility library for my mods.
- **Nemo's Inventory Sorting** `nemos-inventory-sorting` · in 1/34 packs — Automatically sort your inventory with just a button!
- **Neo Bee Fix** `neo-bee-fix` · in 1/34 packs — Fix the Bees!
- **Neo Language Reload** `neo-language-reload` · in 1/34 packs — Neoforge Port of Language Reload
- **Neo Origins** `neo-origins` · in 1/34 packs — A modern port of the classic fabric Origins mod. Backwards c
- **Net Music** `net-music` · in 1/34 packs — A CD player that can directly play NetEase Cloud network str
- **Netherracked** `netherracked` · in 1/34 packs — a Mod/Datapack that Adds Recipe for Netherrack in Minecraft 
- **New Shield Variants** `new-shield-variants` · in 1/34 packs — This mod adds new variants to shields, created from a wide r
- **New Slab Variants** `new-slab-variants` · in 1/34 packs — Shouldn't every block have a slab? From now on, players will
- **Night Lights** `nightlights` · in 1/34 packs — A mod that adds a variety of new light sources to Minecraft!
- **No Animal Tempt Delay** `no-animal-tempt-delay` · in 1/34 packs — 😍 Removes the cooldown in between trying to attract animals
- **No Man's Land** `no-mans-land` · in 1/34 packs — An uncompromising Overworld Overhaul, Enhancing world genera
- **No Void Structures** `no-void-structures` · in 1/34 packs — Utility datapack powered by Lithostitched to support floatin
- **NoisiumForked** `noisiumforked` · in 1/34 packs — Optimises worldgen performance for a better gameplay experie
- **Not Enough Glyphs** `not-enough-glyphs` · in 1/34 packs — Repack of famous utility glyphs plus inedit ones and the bra
- **Not Enough Pots** `not-enough-pots` · in 1/34 packs — Put all plants into flower pots
- **Notes** `notes` · in 1/34 packs — Fully functional, clientside, in-game notepad.
- **Nuclear Science** `nuclear-science` · in 1/34 packs — Nuclear Science is a Minecraft Mod for version 1.20 focused 
- **Nullscape** `nullscape` · in 1/34 packs — Transforms the boring Vanilla end into an alien dimension wi
- **Observable** `observable` · in 1/34 packs — See what's lagging your server.
- **ObsidianUI** `obsidianui` · in 1/34 packs — SpruceUI unofficial architectury port. A Minecraft library m
- **Oh The Biomes We've Gone** `oh-the-biomes-weve-gone` · in 1/34 packs — An astounding sequel to the original BYG mod for 1.20.1+ wit
- **Ok Zoomer - It's Zoom!** `ok-zoomer` · in 1/34 packs — Ok Zoomer is a zoom mod that is powerful, lean, and pretty c
- **One Click Join** `one-click-join` · in 1/34 packs — Instantly join your last Minecraft server from the main menu
- **Origins (NeoForge)** `origins-neoforge` · in 1/34 packs — Fully rewrite and neoforged Origins Mod
- **OrthoCamera (Unofficial NeoForge Port)** `orthocamera-(unofficial-neoforge-port)` · in 1/34 packs — Unofficial NeoForge port of DimasKama's OrthoCamera Fabric m
- **Overflowing Bars** `overflowing-bars` · in 1/34 packs — Expand health, armor and armor toughness bars beyond vanilla
- **Packed Packs** `packed-packs` · in 1/34 packs — Pack resource and data packs into profiles with multiple sel
- **Paladin's Furniture Mod** `paladins-furniture` · in 1/34 packs — A Modern Furniture mod for Minecraft where things are functi
- **Patchouli's Library** `patchouli-library` · in 1/34 packs — Quickly access & pin all GuideMe and Patchouli guides via bu
- **Petrol's Parts** `petrols-parts` · in 1/34 packs — Unique kinetic components for Create
- **Petrolpark's Library** `petrolpark` · in 1/34 packs — A library of shared features and utilities for my mods
- **Picture Mode** `picture-mode` · in 1/34 packs — This mod adds an isometric view of the world dedicated for t
- **Placebo** `placebo` · in 1/34 packs — Placebo is a library used by most of my mods.
It does not pr
- **Player Drops Head** `player-drops-head` · in 1/34 packs — Players drop their head when killed! Configurable
- **Polymorphic Energistics** `polymorphic-energistics` · in 1/34 packs — Polymorph support for Applied Energistics 2.
- **Portable Spawners** `portable-spawners` · in 1/34 packs — Now you can break mobs spawners with an iron pickaxe or high
- **Portfolio** `portfolio` · in 1/34 packs — Adds in a large catalogue of 100+ paintings to the game!
- **Potted Delight** `potted-delight` · in 1/34 packs — Adds compatability between Farmer's Delight and NotEnoughPot
- **Presence Footsteps x Sable (Aeronautics Compat)** `presence-footsteps-x-sable` · in 1/34 packs — Presence Footsteps compatability for Sable / Create Aeronaut
- **Pretty In Pink** `pretty-in-pink` · in 1/34 packs — Pretty In Pink is a Create addon that adds a huge variety of
- **Progress Peek** `progresspeek` · in 1/34 packs — Display game loading progress on the taskbar
- **Punchy!** `punchy-fpa` · in 1/34 packs — A mod that adds various first person animations and visible 
- **Quality of Queso** `quality-of-queso` · in 1/34 packs — A Fabric/(Neo)Forge mod that adds various different QoL feat
- **quick pack** `quick-pack` · in 1/34 packs — Optimize datapack / resourcepack zip file loading times
- **Radical Cobblemon Trainer Textures Plus** `rct-trainer-textures-plus` · in 1/34 packs — A resource pack for the latest version of the Radical Cobble
- **Radical Cobblemon Trainers** `rctmod` · in 1/34 packs — Over 1500 unique and challenging trainers, from the Pokemon 
- **Radical Cobblemon Trainers API** `rctapi` · in 1/34 packs — Trainer management and battle API for Cobblemon.
- **Ragdoll Reactions** `ragdoll-reactions` · in 1/34 packs — Players ragdoll in reaction to the world around them! Crashe
- **RCT Brilliant Diamond and Shining Pearl Skins** `rct-shining-diamond-and-pearl-skins` · in 1/34 packs — skins for the main progession for RCT brilliant diamond and 
- **Real Camera** `real-camera` · in 1/34 packs — Make the camera more realistic in the first-person view.
- **Realistic Bees** `realistic-bees` · in 1/34 packs — 🐝 Tiny bees, or big! Bigger group spawns, increased hive sp
- **Reconnectible Chains** `reconnectible-chains` · in 1/34 packs — A multiloader fork of Connectible Chains: Connect your fence
- **Redirected** `redirected` · in 1/34 packs — Memory optimization mod that prevents duplication of Enum va
- **Refined Storage** `refined-storage` · in 1/34 packs — An elegant solution to your hoarding problem.
- **Refined Storage - EMI Integration** `refined-storage-emi-integration` · in 1/34 packs — Refined Storage has an optional integration mod for EMI, enh
- **Reliable Advancements** `reliable-advancements` · in 1/34 packs — In-game advancement editing and improvements to the advancem
- **Reliable EMI (REMI)** `emi-plus-backport` · in 1/34 packs — A mod adding many configurable features to EMI!
- **Reliable Gliders** `reliable-gliders` · in 1/34 packs — A mod that adds a simple, immersive, and balanced Glider to 
- **Reliable Remover** `reliable-remover` · in 1/34 packs — A lightweight utility for completely removing items via simp
- **Remove Stardust Labs Intro Message** `remove-terralith-intro-message` · in 1/34 packs — A datapack/mod to remove the intro message that appears with
- **Repurposed Structures - Neoforge/Forge** `repurposed-structures-forge` · in 1/34 packs — Adds more variations of vanilla structures and features such
- **Resource Gamma Util / Fullbright** `resource-gamma-utils` · in 1/34 packs — Gamma / Fullbright, making it easy to see in the dark.
- **Respackopts** `respackopts` · in 1/34 packs — Config menus for resource packs
- **Respawning Animals** `respawning-animals` · in 1/34 packs — Animals no longer stay in the world forever, instead they sp
- **Rethinking Voxels** `rethinking-voxels` · in 1/34 packs — [WIP] A gameplay shaderpack based on complementary reimagine
- **Revive Me! - Player Revival Mod** `revive-me` · in 1/34 packs — Allows you to revive yourself and others at a cost... or not
- **Ribbits** `ribbits` · in 1/34 packs — Swamp villages and musical frogs!
- **RoadArchitect** `roadarchitect` · in 1/34 packs — Travel around the world without barriers: RoadArchitect auto
- **RollingGate** `rolling-gate` · in 1/34 packs — A NeoForge mod that controls Minecraft technology options
- **Rotten Flesh Leather** `rotten-flesh-leather` · in 1/34 packs — Smoke rotten flesh into leather
- **Roughly Enough Items (REI)** `rei` · in 1/34 packs — Clean and Customizable. Alternative to Just Enough Items/JEI
- **RPG Attribute System** `rpg-attribute-system` · in 1/34 packs — A lightweight RPG-style system that scales player attributes
- **RPG Potions - New Potions** `rpg-potions-new-potions` · in 1/34 packs — More Potions! New potions designed for PvP combat, adding ta
- **Sable Beyond** `sable_beyond` · in 1/34 packs — Sable Beyond expands the Sable mod with additional features,
- **Sable CleanUp** `sable-cleanup` · in 1/34 packs — Find every Sable sub-level on your server — loaded or not — 
- **Sable Photomancy** `sable-schematic-tool` · in 1/34 packs — Capture form. Preserve memory. Project reality.
- **Sable Touys** `touys` · in 1/34 packs — A collection of creative utilities for working with Sable's 
- **Sable: Ragdoll Corpse** `sable-ragdoll-corpse` · in 1/34 packs — Leave a physical ragdoll corpse behind on death!
- **Sable: Ragdolls** `sable-ragdolls` · in 1/34 packs — Ragdolls powered by Sable's physics system
- **Sable: Weighted - Create: Deco** `sable-weighted-create-deco` · in 1/34 packs — Create Deco × Sable Physics Compatibility
- **Sauce Lib** `sauce-lib` · in 1/34 packs — Better with Nuggets! Library mod for Ars Addons, with few st
- **SBW Aeronautics compat** `sbw-aeronautics-compat` · in 1/34 packs — Mod aims to improve compatability through Superb Warfare and
- **ScalableLux** `scalablelux` · in 1/34 packs — A Fabric mod based on Starlight that improves the performanc
- **Scholar** `scholar` · in 1/34 packs — Two-page book editing/viewing, easy formatting, colored book
- **Scribble** `scribble` · in 1/34 packs — Expertly edit your books with rich formatting options, page 
- **Seamless** `seamless` · in 1/34 packs — Connected outlines for Double Blocks like Beds and Doors!
- **SecurityCraft** `security-craft` · in 1/34 packs — Adds plenty of blocks and items to defend and secure your ba
- **SeeU** `seeu` · in 1/34 packs — Makes distant players visible far beyond vanilla entity trac
- **Separate Sable Render Distance (Create Aeronautics Addon)** `ssrd` · in 1/34 packs — SSRD rewrites Sable to allow for physics objects to render f
- **Separated Leaves** `separatedleaves` · in 1/34 packs — Makes Leaves stick only to their own Log type!
- **Serene Seasons Plus** `serene-seasons-plus` · in 1/34 packs — SereneSeason Plus (formerly Extended Fix) enhances seasonal 
- **Server Sleep** `serversleep` · in 1/34 packs — The simplest multiplayer sleep mod/datapack. - Changes playe
- **Shoulder Surfing Reloaded** `shoulder-surfing-reloaded` · in 1/34 packs — Highly configurable third person camera mod
- **Shuffle** `shuffle` · in 1/34 packs — Randomly place blocks from your hotbar
- **SiliconeDolls** `silicone-dolls` · in 1/34 packs — A Minecraft Neoforge mod about Fake Player
- **Simple Backups** `simple-backups` · in 1/34 packs — A simple mod to create scheduled backups
- **Simple Custom Early Loading** `simple-custom-early-loading` · in 1/34 packs — Mod that allows to customize the Neoforge early loading
- **Simple Fog Control** `simplefog` · in 1/34 packs — Allows simple control over water, nether and terrain fog.
- **Simple Hats** `simple-hats` · in 1/34 packs — Simple Hats is an expandable cosmetic hat mod that allows us
- **Simple Magnets** `simple-magnets` · in 1/34 packs — Simple Magnets adds Magnets that pickup items around the pla
- **Simple Music Control** `simple-music-control` · in 1/34 packs — Reduced delay between music tracks, next track keybind, now 
- **Simple Netherite Horse Armor** `simple-netherite-horse-armor` · in 1/34 packs — Yet another simple, netherite armor looking netherite horse 
- **Simple Rich Discord Presence** `srdp` · in 1/34 packs — Simple Discord Rich Presence
- **Simple Voice Chat Group Player Names** `voicechat-names` · in 1/34 packs — A mod that displays player names next to their heads in voic
- **SimpleTMs: TMs and TRs for Cobblemon** `simpletms-tms-and-trs-for-cobblemon` · in 1/34 packs — This Minecraft mod is an expansion to the Cobblemon mod, int
- **Simply Bows** `simply-bows` · in 1/34 packs — Adds unique bows with powerful abilities
- **Simply Swords** `simply-swords` · in 1/34 packs — Adds Spears, Glaives, Chakrams, Katanas, Greathammer/axes, R
- **Simply Swords: Cataclysm** `simplycataclysm` · in 1/34 packs — Addon for Simply Swords that adds compatibility with L_Ender
- **Simply Tooltips** `simply-tooltips` · in 1/34 packs — Modern data driven tooltip rendering
- **Skin Restorer** `skinrestorer` · in 1/34 packs — A server-side mod for managing and restoring player skins.
- **Sky Villages** `sky-villages` · in 1/34 packs — Explore massive and beautiful villages in the sky!
- **SmartBlockPlacement** `smartblockplacement` · in 1/34 packs — Fast and smart block placement.
- **SmartBrainLib** `smartbrainlib` · in 1/34 packs — A brain library for Minecraft, making the brain system easie
- **Smooth Gui** `smooth-gui` · in 1/34 packs — Smooth animation when opening GUI for Minecraft.
GUI fades u
- **Snow Under Trees** `snow-under-trees` · in 1/34 packs — Adds snow under trees in snowy biomes
- **Snow! Real Magic! ⛄** `snow-real-magic` · in 1/34 packs — Not a magic mod. · Snow Gravity & Accumulation · Snow-covere
- **Sodium Extras** `sodium-extras` · in 1/34 packs — An add-on mod for Sodium that adds new features and customiz
- **Sodium Leaf Culling** `sodiumleafculling` · in 1/34 packs — Smart leaf culling algorithm for Sodium on 1.21+
- **Some More Blocks** `some-more-blocks` · in 1/34 packs — A Minecraft Mod with 500+ new blocks.
- **Sophisticated JEI Index** `sophisticated-jei-index` · in 1/34 packs — JEI recipe transfer integration for Sophisticated Backpack
- **Sophisticated Storage Create Integration** `sophisticated-storage-create-integration` · in 1/34 packs — Full Featured Sophisticated Storage on Create Contraptions
- **Sounds Be Gone!** `soundsbegone` · in 1/34 packs — Allows you to disable specific sounds you don't like. Perfec
- **Sparse Structures** `sparsestructures` · in 1/34 packs — A simple and configurable mod that makes all (even datapacks
- **Spawn** `spawn-mod` · in 1/34 packs — An overworld wilderness overhaul that adds tons of animals, 
- **Spawn Animations** `spawn-animations` · in 1/34 packs — Hostile mobs dig out of the ground or poof into existence wh
- **SPBR** `spbr` · in 1/34 packs — A PBR textures pack based on VNR,which in order to provide P
- **Spring to Life Backport** `spring-to-life-backport` · in 1/34 packs — A mod that adds some features from the 1.21.5 "Spring to Lif
- **Stellaris** `stellaris` · in 1/34 packs — Discover the next gen space mod!
- **Stony Cliffs Are Cool** `stony-cliffs-are-cool` · in 1/34 packs — Turns unsightly dirt hills into pretty stone cliffs
- **Structory** `structory` · in 1/34 packs — A seasonally updated and atmospheric structure mod with ligh
- **Structory: Towers** `structory-towers` · in 1/34 packs — Adds immersive biome-themed towers to the world, as a standa
- **Structurify - Structure Control** `structurify` · in 1/34 packs — A structure configuration mod that eliminates the need for d
- **Strut Your Stuff** `strut-your-stuff` · in 1/34 packs — Minecraft mod library for "strut" blocks, that span between 
- **Stylish Effects** `stylish-effects` · in 1/34 packs — Status effect display overhaul: Display them in any menu! An
- **Super Secret Doors** `super-secret-doors` · in 1/34 packs — Secret doors!  Doors that look like other blocks and therefo
- **Superb Warfare** `superb-warfare` · in 1/34 packs — A warfare themed mod with various guns, huge cannons and pow
- **SuperOreBlock** `superoreblock` · in 1/34 packs — SuperOreBlocks introduces a new way to store and manage your
- **Supplementaries Squared** `supplementaries-squared` · in 1/34 packs — The extra content of Supplementaries that doesn't necessaril
- **Surveyor Map Framework** `surveyor` · in 1/34 packs — Maps with friends! A world map backend with multiplayer shar
- **Swzo's Font!** `swzos-font!` · in 1/34 packs — A Nice Font For Minecraft by swzo!
- **Synaxis** `synaxis` · in 1/34 packs — Add circuit / luascript infrastructure that runs at full pre
- **TAB** `tab-was-taken` · in 1/34 packs — An all-in-one solution that works
- **TACZ Aeronautics compat** `tacz-aeronautics-compat` · in 1/34 packs — Mod provides compatability between TACZ and Create Aeronauti
- **TaCZ Pack Upgrader** `tacz-pack-upgrader` · in 1/34 packs — Only required on unofficial TaCZ 1.21.1
- **TarkovCraft: Core** `tarkovcraft-core` · in 1/34 packs — Core library for TarkovCraft project providing common functi
- **TenshiLib** `tenshilib` · in 1/34 packs — Core and Library mod for my other projects
- **Terralith: ReStoned** `terralith-restoned` · in 1/34 packs — An official add-on to Terralith that re-adds normal Andesite
- **Terraphilic** `terraphilic` · in 1/34 packs — Geophilic-Terralith compatibility pack
- **Text Placeholder API** `placeholder-api` · in 1/34 packs — Placeholder and Text manipulation library for your Minecraft
- **The Immersive Music Mod** `immersivemusicmod` · in 1/34 packs — 147 new songs. Played based on biome and structure!
- **The Lost Cities** `the-lost-cities` · in 1/34 packs — Allows the player to play in an old abandoned city instead o
- **Third Person Shooting: Zero** `third-person-shooting-zero` · in 1/34 packs — Makes TAC: Zero gunplay compatible with ShoulderSurfing mod.
- **Thirst Was Taken** `thirst-was-taken` · in 1/34 packs — A modern take on thirst, compatible with Create, Farmer's De
- **Tidal Towns** `tidal-towns` · in 1/34 packs — Several pieces of driftwood have been gathered to form a vil
- **Tide 2** `tide` · in 1/34 packs — Expands the fishing system and adds 100+ new fish
- **Tim's Ultimately Comprehensive Cobblemon Edits of Destiny** `tims-ultimately-comprehensive-cobblemon-edits-of-destiny` · in 1/34 packs — Fixes some stuff in the Cobblemon mod that can be fixed with
- **Tiny Item Animations** `tiny-item-animations` · in 1/34 packs — Adds little animations when you pick up or insert items with
- **TLib** `tlib` · in 1/34 packs — Library for Take's Mods.
- **ToastBegone** `toastbegone` · in 1/34 packs — A simple and configurable toast disabler
- **Tom's Peripherals** `toms-peripherals` · in 1/34 packs — CC: Tweaked Addon with High resolution monitors, 3D grahpics
- **ToolTipFix** `tooltipfix` · in 1/34 packs — Fixes Tooltips from runnning off the screen.
- **TooManyRecipeViewers** `tmrv` · in 1/34 packs — A compatibility layer for running JEI plugins with EMI writt
- **Tough As Nails** `tough-as-nails` · in 1/34 packs — A difficult, survival-based mod that adds body temperature a
- **Touhou Little Maid** `touhou-little-maid` · in 1/34 packs — A mod featuring maids and Touhou Project, adding Touhou Proj
- **Towers of the Wild Modded** `totw-modded` · in 1/34 packs — Towers of the Wild - added to multiple dimensions and planet
- **Trading Post** `trading-post` · in 1/34 packs — Rule the village! Trade with every villager at once!
- **Traveler's Titles** `travelers-titles` · in 1/34 packs — Epic, RPG-like titles when entering biomes & dimensions!
- **Tree Physics** `tree-physics` · in 1/34 packs — Cutting down Trees causes them to fall realistically, thanks
- **Treeplacer** `treeplacer` · in 1/34 packs — Saplings can dynamically generate different trees, based on 
- **TrimsEffects** `trimseffects` · in 1/34 packs — The objective of this mod is none other than to expand the w
- **Tungsten Equipment** `tungsten-equipment` · in 1/34 packs — A late-game upgrade path that gives you more options then ju
- **Tweakerge** `tweakerge` · in 1/34 packs — Tweakeroo unofficial forge port. A client-side Minecraft mod
- **Tweakeroo** `tweakeroo` · in 1/34 packs — Various client-side tweaks, such as hand restock, hotbar swa
- **Two Players One Horse** `two-players-one-horse` · in 1/34 packs — This mod allows two players to mount together on the same ho
- **UnChipped** `unchipped` · in 1/34 packs — Craft Chipped‘s blocks back to their origin using a stonecut
- **Underground Bunkers** `underground-bunkers` · in 1/34 packs — Randomly generated bunkers hidden within your worlds
- **Underground Village, Stoneholm** `underground-village,-stoneholm` · in 1/34 packs — Adding in sprawling mazes of underground halls and floors St
- **Underwater Village** `underwater-village` · in 1/34 packs — Discover a lot of new oceanic structures!
- **UniLib** `unilib` · in 1/34 packs — A common set of Utilities, designed for over 50 versions of 
- **Unique Dark** `unique-dark` · in 1/34 packs — Dark GUI with unique textures for functional blocks. Dark mo
- **Unlocked Typing** `unlocked-typing` · in 1/34 packs — This mod allows you to use Minecraft’s classic color and for
- **Unusual End** `unusual_end` · in 1/34 packs — An Improved Vanilla+ End !
- **Useful Spyglass** `useful-spyglass` · in 1/34 packs — Viewing a mob or player with a spyglass displays some inform
- **Utility Belt** `utility-belt` · in 1/34 packs — Adds a wearable secondary hotbar to help manage your tools a
- **Vampires Need Umbrellas** `vampires-need-umbrellas` · in 1/34 packs — An addon for Vampirism! 🧛‍♂️🌂
- **Vanilla Backport X Incubation Compat** `vanillabackportxincubationcompat` · in 1/34 packs — Full compatibility between Vanilla Backport and Incubation
- **VanillaBackport: Mob Variants Compat** `vb-mob-variants-compat` · in 1/34 packs — Compatibility for Biome We've Gone, Terralith, Nature's Spir
- **Vectorientation Reforged** `vectorientation-reforged` · in 1/34 packs — The official rewrite of Vectorientation. Add some more life 
- **Veil** `veil` · in 1/34 packs — Upgrade your modding potential with cutting-edge rendering a
- **Vein Vantage** `vein-vantage` · in 1/34 packs — Better Mining
- **Veinminer** `sgtveinminer` · in 1/34 packs — Veinminer is a configurable mining mod that lets you break e
- **VeinMiner Enchantment** `veinminer-enchantment` · in 1/34 packs — Veinminer Addon - Adds vineminer enchantment to enchanting t
- **Villager Names** `villager-names-serilum` · in 1/34 packs — 🧑‍🌾 Gives all villager entities a default or custom name t
- **Visible Traders** `visible-traders` · in 1/34 packs — A mod that allows the player to view locked villager trades
- **vista** `vista_tv` · in 1/34 packs — Cameras, Tv, Live feed, cassette, security, gifs, television
- **Visual Health** `visualhealth` · in 1/34 packs — Add visible damage to hurt mobs and players!
- **Voice Messages** `voicemessages` · in 1/34 packs — Voice messages in minecraft chat
- **Voltaic** `voltaic` · in 1/34 packs — API for Electrodynamics, Nuclear Science and others of the A
- **VS / Sable Hose Connectors** `vs-hose-connectors` · in 1/34 packs — Better transport between Valkyrien Skies ships & Aeronautics
- **Waddles** `waddles` · in 1/34 packs — Waddles adds cute Adélie penguins that waddle
- **Wakes Reforged** `wakes-reforged` · in 1/34 packs — Wakes aims to add simple wakes that fit the spirit of vanill
- **Wall-Jump TXF** `wall-jump-txf` · in 1/34 packs — Wall jump, double jump, fence jump & more
- **Waystone Towers** `waystone-towers` · in 1/34 packs — Adds towers into the game which have waystones if you have t
- **Waystones Teleport Pets** `waystones-teleport-pets` · in 1/34 packs — Addon for Waystones to make Pets teleport with you when usin
- **Waystones: Sable (Create Aeronautics Addon)** `waystones-sable` · in 1/34 packs — A compatibility mod that allows Waystones to work properly w
- **What's That Slot?** `whats-that-slot` · in 1/34 packs — Utility that highlights which items can be placed in an item
- **When Dungeons Arise** `when-dungeons-arise` · in 1/34 packs — Adds various elegant -and likely hostile- roguelike dungeons
- **When Dungeons Arise: Seven Seas** `when-dungeons-arise-seven-seas` · in 1/34 packs — Elegant - and likely hostile - vessels lost in the seven sea
- **WI Zoom** `wi-zoom` · in 1/34 packs — WI Zoom is a Minecraft mod offering up to 50x zoom with smoo
- **William Wythers' Overhauled Overworld** `wwoo` · in 1/34 packs — This mod overhauls all vanilla biomes, with different sub bi
- **Winter Overhaul** `winter-overhaul` · in 1/34 packs — A mod which overhauls snowy biomes :)
- **WITS (What Is This Structure?)** `wits` · in 1/34 packs — Use \wits to see the name of structures at where you are!
- **Woodworks** `woodworks` · in 1/34 packs — Adds wood variants for many decoration blocks and introduces
- **WorldEdit CUI (Unofficial Forge Port)** `worldeditcui-forge` · in 1/34 packs — A graphical user interface for WorldEdit, designed to assist
- **Worldgen Patches** `worldgen-patches` · in 1/34 packs — Fixes a few small issues in worldgen.
- **WorldWeaver: New Dawn** `worldweaver-neoforge` · in 1/34 packs — An unofficially maintained continuation of the BetterX Team'
- **WunderLib: New Dawn** `wunderlib-neoforge` · in 1/34 packs — An unofficially maintained continuation of WunderLib for Fab
- **Xaero Maps Chinese Pack** `xaero-map-chinese` · in 1/34 packs — 一个xaero-map的汉化资源包，包括Xaero's Minimap Xaero's World Map模组的汉化
- **Xaero Train Map** `xaero-train-map` · in 1/34 packs — Adds create train map to xaero's world map just like in jour
- **Xaero's Maps x Waystones** `xaeros-maps-x-waystones` · in 1/34 packs — Lets you see Waystone locations on Xaero’s Minimap/World Map
- **Xaero's Maps: Multiplayer+** `xaeros-maps-multiplayer-plus` · in 1/34 packs — Adds multiplayer features to Xaero's Minimap and World Map, 
- **Xaero's Minimap & World Map - Waystones Compatibility** `xaeros-minimap-world-map-waystones-compatibility-forge` · in 1/34 packs — Creates a Waypoint in Xaero's Minimap & World Map when activ
- **Xp from Crops** `xp-from-crops` · in 1/34 packs — Other living things give experience, why not crops? (∩ ･ｏ･)⊃
- **XP Tome** `xp-tome` · in 1/34 packs — Adds a book that can store a configurable amount of XP.
- **YDM's Weapon Master** `weaponmaster` · in 1/34 packs — With this Mod your Hotbar items will be visible on your Char
- **Yes Steve Model** `yes-steve-model` · in 1/34 packs — A mod that modifies the vanilla player model
- **YUNG's Menu Tweaks** `yungs-menu-tweaks` · in 1/34 packs — A small, lightweight mod that makes browsing menus a lot eas
- **Zombie Variants** `zombie-variants` · in 1/34 packs — Add 15 variants of zombies that can appear in different biom
- **Zoomify (Zoom)** `zoomify` · in 1/34 packs — A zoom mod with infinite customizability.
- **红石辅助RedstoneAuxiliary** `redstoneauxiliary` · in 1/34 packs — This is a redstone auxiliary material package that assists i

---

Verdicts in the Banned and Removed sections were recorded from actual observed
failures during build, boot, or client-join testing. Where a decision was taste
rather than a fault — electricity mods, Waystones versus rail, flying contraptions —
the reason says so plainly.

