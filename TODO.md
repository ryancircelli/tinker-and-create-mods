# TODO

## 1. Tinkers' Construct on 1.21 — DONE

**Resolved 2026-08-08 by adoption, not by porting.** Before writing any migration code
I checked for prior art (as this file suggested) and found an actively maintained port:

- `zhuchuovo/TinkersConstruct-1.21.1` — release v3.12.2 (2026-08-03)
- `zhuchuovo/Mantle-1.21.1` — release 1.12.1

Both forked to `ryancircelli/`. Someone had already done the Data Components migration,
which was the hard part of the plan that used to live here.

**Shipping:** via `overrides/mods/`, because neither is on Modrinth for 1.21.1 and a
.mrpack may only reference cdn.modrinth.com URLs. `smoketest.js` and `jointest.js` were
taught to install override jars — before that they read only the manifest and would
silently test a pack *without* Tinkers, and pass.

**Verified end to end:**
- boots with Create in isolation (`isolate.js --jar`)
- boots in the full pack
- **client joins and loads the world**
- **inventory opens, EMI lists 366 pages of items, all rendering**
- **EMI search "tinker" returns Tinker Stations, tool tables, material variants**

Advancements went 7,735 -> 9,692, which is Tinkers registering its content.

## 2. Open issues — resolved in 3.0.2

**`tfmg:` recipe errors — FIXED.** My earlier diagnosis was wrong: TFMG was never
installed and the ban was holding fine. The 8 errors came from
`createaddoncompatibility`, which ships `data/tfmg/` recipes unconditionally. Dropped —
its only other content was 3 Copycats tags nothing in the pack consumes, and its purpose
is bridging addons we deliberately excluded.

**Sinytra Connector — GONE, as a side effect.** Connector and Forgified Fabric API were
present only as Continuity's dependencies. Dropping Continuity (the item-render crash)
removed the entire Fabric-on-NeoForge compatibility layer. 3.0.0 had connector +
forgified + continuity; 3.0.1 has none. That whole fragility class is closed.

**`trainutilities` advancements — WON'T FIX, documented.** 3.0.3 (newest) references
`create:conducter` as an advancement parent, but Create 6.0.10 renamed it to
`create:conductor`, fixing their old typo. Three advancements fail to load. Cosmetic
only — the sliding-door content works. No newer build exists. Kept deliberately; the
note lives on the mod entry in mods.json.

**~700 model warnings** remain (missing propeller models in Dreams & Desires and
similar). Cosmetic, upstream, and not worth dropping content mods over.

## 3. Archived lines

Both 1.20.1 lines are retired under `dev/archive/`. The Fabric build (1.1.5) was
join-verified and is the fallback if the 1.21 line ever regresses.

## 4. Quest-based walkthrough (planned)

**Goal:** a guided progression walking a new player through the pack —
Tinkers tooling -> Create automation -> storage/logistics -> exploration.

### Approach: custom ADVANCEMENTS, not a questing mod

Scanning 100 NeoForge 1.21.1 Modrinth packs found **zero** using a questing mod.
FTB Quests and Heracles are CurseForge-only, and a Modrinth-hosted pack cannot
reference CurseForge (not a whitelisted download domain). The only quest-named
mods on Modrinth for this loader are <15k downloads and used by 0/100 packs.

What Modrinth packs actually use for progression is the advancement system, and
the whole stack is already installed:

| Mod | Adoption | Role |
|---|---|---|
| Better Advancements | 25/100 | replaces the advancement screen with a readable tree |
| Advancement Plaques | 16/100 | popup on completion |
| GuideME             | 15/100 | reference documentation |
| Paxi                | 13/100 | loads global datapacks from config/paxi/datapacks/ |

Advancements are pure datapack JSON, so the walkthrough ships in overrides/ with
**no new mod, no licensing question, and no CurseForge dependency**.

### Steps
1. Author `data/tinkercreate/advancement/**.json` (1.21.1 uses the singular
   `advancement/` directory, not `advancements/`)
2. Drop the datapack into `overrides/config/paxi/datapacks/` so Paxi applies it
   to every world automatically -- no per-world install
3. Rebuild; verify the tree renders in Better Advancements via tools/jointest.js
   (the harness already applies overrides/config to its test client)

### Content sketch
- **Chapter 1 - Tinkers:** smeltery -> tool station -> first Improvable tool
- **Chapter 2 - Create:** water wheel -> mechanical press -> first automated line
- **Chapter 3 - Logistics:** drawers + Sophisticated Storage on contraptions
- **Chapter 4 - Exploration:** Structory / YUNG's / Cataclysm structures

### Why not FTB Quests (investigated, rejected)

FTB Quests has NeoForge 1.21.1 builds and its GitHub *source* is LGPL-2.1, so it
looked redistributable via our GitHub-release pattern. It is not:

- Not on Modrinth, and CurseForge is not a whitelisted .mrpack download domain
  (CurseForge also 403s both its CDN and API without a key)
- FTBTeam GitHub releases tag the 1.21.1 line but attach **no jars**
- The jars ARE fetchable from FTB's public maven (maven.ftb.dev), BUT every
  shipped jar declares `license = "All Rights Reserved"` in neoforge.mods.toml
  -- the source repo licence does not govern the binaries. Mirroring them to our
  release would be republishing ARR binaries. Do not.

If a true quest *book* is ever wanted, `simple-quests` (13k dl, serverside) is
the only Modrinth-native candidate -- but adoption is near zero, so advancements
are the safer bet.
