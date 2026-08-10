<!--
  The Modrinth project description. Edited here, not in the web UI, so it is
  version-controlled and reviewable; `.github/workflows/modrinth-description.yml`
  PATCHes it onto the project on demand.
-->

<div align="center">

# Tinker & Create

[![Minecraft](https://img.shields.io/badge/Minecraft-1.21.1-brightgreen)](https://modrinth.com/modpack/tinker-create)
[![NeoForge](https://img.shields.io/badge/NeoForge-21.1.248-orange)](https://neoforged.net/)
[![mods](https://img.shields.io/badge/mods-333-blue)](https://github.com/ryancircelli/tinker-and-create-mods/blob/master/MODS.md)
[![quests](https://img.shields.io/badge/quests-27-purple)](https://modrinth.com/mod/questlog)
[![downloads](https://img.shields.io/modrinth/dt/LmXb0Vdc?label=downloads)](https://modrinth.com/modpack/tinker-create)
[![source](https://img.shields.io/badge/source-GitHub-181717?logo=github)](https://github.com/ryancircelli/tinker-and-create-mods)

**Build tools that grow with you, and machines that do your work for you.**

</div>

---

Two mods deserve each other. **Tinkers' Construct** gives you tools you keep and
upgrade instead of replacing. **Create** gives you contraptions that do the boring
parts for you. Everything else here — storage, logistics, exploration, food — was
picked to support those two, not to pad a mod count.

## Where you start

The pack opens with a guided walkthrough: **27 quests across 6 chapters**, in a
readable book rather than a spreadsheet. Press `` ` `` or the button in your
inventory.

Every quest is visible from the beginning. Chapters are a suggested order, not a
lock — start with whichever appeals to you and skip what doesn't.

- **Tinkers' Construct** — Tinker Station, your first tool, a melter, then the Smeltery
- **Create** — goggles, a water wheel, a press, contraptions, chain conveyors across the base
- **Carrying Capacity** — backpacks, upgrades, drawer walls, Ender storage
- **Time & Growth** — Time in a Bottle, accelerated farming, real cooking
- **Exploration** — Nature's Compass, structures worth looting, the Nether

## What playing it feels like

**Your tools level up.** Tinkers tools earn XP as you use them and gain a modifier
slot each level. Apply *Improvable* early and it starts banking progress
immediately.

**Reach across your whole base.** Chain conveyors run to 128 blocks here instead
of the default 32, so logistics can actually span a base rather than a room.

**Less waiting.** Time in a Bottle has no storage cap in this pack — point it at a
sapling, a furnace or a Create machine and fast-forward it.

**Stacks handled in one pass.** Bulk pressing and cutting are on, so the press and
the saw process a whole stack at a time.

**Spawners are movable.** Contraptions can relocate spawners and budding
amethyst, which opens up farm designs the defaults forbid.

## Notes

Recommended: **6 GB** allocated. For a smoother experience add
`-XX:+UseZGC -XX:+ZGenerational` to your Java arguments — the pack cannot set
these for you, as the `.mrpack` format has no field for JVM options.

Every mod downloads from its own CDN; the pack file itself is about 120 KB.

Three mods are not on Modrinth and are fetched from GitHub, unmodified and under
permissive licences (Tinkers' Construct and Mantle 1.21.1 ports, and Tinkers'
Levelling Addon). Full attribution, upstream links and jar checksums are in the
[repository README](https://github.com/ryancircelli/tinker-and-create-mods#third-party-content-and-licences).
