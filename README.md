# Tinker & Create

[![build](https://img.shields.io/github/actions/workflow/status/ryancircelli/tinker-and-create-mods/publish.yml?branch=master&label=build)](https://github.com/ryancircelli/tinker-and-create-mods/actions/workflows/publish.yml)
[![release](https://img.shields.io/github/v/release/ryancircelli/tinker-and-create-mods?label=pack)](https://github.com/ryancircelli/tinker-and-create-mods/releases/latest)
[![Minecraft](https://img.shields.io/badge/Minecraft-1.21.1-brightgreen)](https://modrinth.com/modpack/tinker-create)
[![NeoForge](https://img.shields.io/badge/NeoForge-21.1.248-orange)](https://neoforged.net/)
[![mods](https://img.shields.io/badge/mods-333-blue)](MODS.md)
[![Modrinth](https://img.shields.io/modrinth/dt/LmXb0Vdc?label=modrinth%20downloads)](https://modrinth.com/modpack/tinker-create)
[![Modrinth version](https://img.shields.io/modrinth/v/LmXb0Vdc?label=modrinth)](https://modrinth.com/modpack/tinker-create/versions)

Build tools that grow with you, and machines that do your work for you.

A Minecraft 1.21.1 / NeoForge modpack built around two mods that deserve each
other: **Tinkers' Construct** for tools you keep and upgrade instead of
replacing, and **Create** for contraptions that automate the boring parts. Around
that core sits storage, logistics, exploration and food — chosen to support those
two, not to pad a mod count.

> **Note:** the Modrinth badges above read *not found* until the project clears
> moderation review. The pack itself is published and installable today via the
> GitHub release below.

## Install

**Modrinth App** (once the project is approved) — search *Tinker & Create* and hit install.

**Any launcher, today** — download the `.mrpack` from
[the latest release](https://github.com/ryancircelli/tinker-and-create-mods/releases/latest)
and import it. Modrinth App, Prism and ATLauncher all accept `.mrpack` directly.

The download is ~120 KB. It contains no mod jars — only a manifest of URLs and
hashes — so your launcher fetches each mod from its own CDN.

## Progression

The pack ships a guided walkthrough as **27 quests across 6 chapters**, built on
[Questlog](https://modrinth.com/mod/questlog). Open it with `` ` `` or the book
button in your inventory.

Every quest is visible from the start. Questlog hides quests whose requirements
are unmet and has no greyed-out state, so gating them into chains would have
shown one quest at a time and hidden the roadmap — the opposite of a walkthrough.
Chapters are a suggested order, not a lock.

| Chapter | Where it takes you |
| --- | --- |
| Getting Started | The hub, with links into each line below |
| Tinkers' Construct | Tinker Station → first tool → melter → Smeltery |
| Create | Goggles → water wheel → press → contraptions → chain conveyors |
| Carrying Capacity | Backpacks → upgrades → drawers → Ender storage |
| Time & Growth | Time in a Bottle → accelerated farming → cooking |
| Exploration | Nature's Compass → structures → the Nether |

## How the pack is built

`tools/mods.json` is the single source of truth. `tools/build.js` resolves every
mod against the Modrinth API and writes a manifest-only `.mrpack` in which each
file carries a download URL plus `sha1` and `sha512`.

Publishing is automatic: bump `pack.version` in `tools/mods.json`, push to
`master`, and CI builds, verifies, uploads to Modrinth and cuts a GitHub release.

```
node tools/build.js          # resolve + write packs/tinker-and-create-<version>.mrpack
node tools/gen-quests.js     # regenerate the Questlog quest tree
node tools/jointest.js       # acceptance gate: real client joins a real server
```

`jointest.js` is the check that matters. Registry-sync and packet-decode failures
only appear during login, so neither a server boot nor a client boot can catch
them — it found nine crashes that static checks missed.

Quest editing does not need a restart. Questlog loads server-side and syncs to
connected clients, so `tools/quests-push.sh <workdir>` copies the JSON in and
issues `questlog reload`.

## Third-party content and licences

Three mods are not on Modrinth and are referenced by URL from this repository's
releases. All are redistributed under permissive licences, unmodified:

| Mod | Upstream source | Licence |
| --- | --- | --- |
| Tinkers' Construct (1.21.1 port) | [zhuchuovo/TinkersConstruct-1.21.1](https://github.com/zhuchuovo/TinkersConstruct-1.21.1) — a port of [SlimeKnights/TinkersConstruct](https://github.com/SlimeKnights/TinkersConstruct) (MIT) | GPL-3.0 |
| Mantle (1.21.1 port) | [zhuchuovo/Mantle-1.21.1](https://github.com/zhuchuovo/Mantle-1.21.1) — a port of [SlimeKnights/Mantle](https://github.com/SlimeKnights/Mantle) (MIT) | MIT |
| Tinkers' Levelling Addon | original mod by **Pyre540**; 1.21.1 / NeoForge port | MIT |

**Nothing is modified.** The forks used to host these jars carry zero commits of
their own — `ryancircelli/TinkersConstruct-1.21.1` is `ahead_by=0` against its
parent and `ryancircelli/Mantle-1.21.1` is byte-identical. The jars themselves
are the upstream authors' own builds:

| Jar | sha1 | Matches |
| --- | --- | --- |
| `TinkersConstruct-1.21.1-3.12.2.jar` | `4138e16a32443c8cf2c46c8ac006737d264cc4ff` | upstream release `v3.12.2` |
| `Mantle-1.21.1-1.12.1.jar` | `f6acb51a65c2e1f4dc9a36d40f8914c6fadc256e` | upstream release `1.12.2` |

Anyone can verify by downloading from the upstream links above and comparing
hashes. Source for the GPL-3.0 component is public at the fork and at its parent,
satisfying GPL-3.0 §6(d).

Note that the Tinkers' Construct jar's own metadata declares `license="MIT"`,
inherited from SlimeKnights' original, while the port's repository is GPL-3.0.
The stricter of the two is assumed here.

Everything else in the pack is fetched from Modrinth's CDN by the launcher and is
governed by each mod's own licence. The tooling and configuration in this
repository are the author's own work.

## Repository layout

```
tools/          build, generators, and the client-joins-server test harness
overrides/      configs shipped with the pack (quests, keybinds, mod fixes)
external-mods/  the three non-Modrinth jars (gitignored; fetched on build)
archive/        superseded pack builds
MODS.md         the full mod list
CATALOGUE.md    candidates considered, with adoption data from reference packs
TODO.md         design notes and rejected approaches, with reasons
```
