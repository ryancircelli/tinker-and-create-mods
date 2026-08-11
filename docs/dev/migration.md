# Tinker & Create — Fabric 1.1.5 to NeoForge 2.0.0

**Minecraft 1.20.1 / NeoForge 47.1.106** — the only target where Tinkers Construct exists.
It has no 1.21.x build on any loader, so 1.20.1 is forced.

Resolution accepts `neoforge` **and** `forge` tags. NeoForge 47.x on 1.20.1 is a Forge fork
and loads Forge mods — Simply NeoForged, a production NeoForge pack, ships Forge-tagged mods.
Modrinth's loader tags therefore understate what is actually available.

| | count |
| --- | --- |
| Ported unchanged | **116** |
| Swapped for an equivalent | **24** |
| Genuinely lost | **13** |
| Not applicable on NeoForge | 5 |
| Gained | **5** |

## Swaps

| Fabric | NeoForge |
| --- | --- |
| Trinkets | Curios API |
| Sophisticated Core (Fabric) | Sophisticated Core (official) |
| Create (Fabric) | Create |
| Hephaestus (Tinkers for Fabric) | Tinkers Construct (the point of the migration) |
| Create: Enchantment Industry (Create 6) | Create: Enchantment Industry |
| Sophisticated Backpacks | Sophisticated Backpacks (official) |
| Sophisticated Storage | Sophisticated Storage (official) |
| Sophisticated Storage in Motion | Sophisticated Storage in Motion (official) |
| Sodium | Embeddium |
| Lithium | Radium |
| Sodium Extra | Embeddium (Rubidium) Extra |
| Reese's Sodium Options | Embeddium built-in options |
| More Culling | Entity Culling |
| Iris Shaders | Oculus |
| Zoomify | Just Zoom |
| Loot Beams | Loot Beams |
| Charm Forked | Quark |
| Farmer's Delight Refabricated | Farmer's Delight (original) |
| LambDynamicLights | Dynamic Lights |
| Forgotten Graves | Corail Tombstone |
| Charmonium | AmbientSounds |
| Presence Footsteps | Presence Footsteps (Forge) |
| Visuality | Visuality (Forge) |
| Starlight | Starlight (Forge) |

## Losses

- **Building** — Expanded Delight, Connectible Chains
- **Performance** — Language Reload, Enhanced Block Entities, Debugify
- **Pretty** — Animatica, OptiGUI, Puzzle, Fabrishot
- **QoL** — Extra Mod Integrations, Gamma Utils
- **Server Management** — Carpet, Carpet Extra

## Not applicable (loader plumbing, not a functional loss)

- Fabric API — NeoForge provides its own API
- Forge Config API Port — native on NeoForge
- Mod Menu — NeoForge has a built-in mod list
- Fabric Language Kotlin — replaced by Kotlin for Forge
- Indium — Sodium-only rendering shim

## Gains

- **BadOptimizations** (`badoptimizations`) — Performance
- **Smooth Boot (Reloaded)** (`smooth-boot-reloaded`) — Performance
- **Very Many Players** (`vmp-forge`) — Performance
- **Tinkers Levelling Addon** (`tinkers-levelling-addon`) — Core Tech
- **Create Encased** (`create-encased`) — Core Tech
