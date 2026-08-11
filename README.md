# Tinker & Create

[![build](https://img.shields.io/github/actions/workflow/status/ryancircelli/tinker-and-create-mods/publish.yml?branch=master&label=build)](https://github.com/ryancircelli/tinker-and-create-mods/actions/workflows/publish.yml)
[![release](https://img.shields.io/github/v/release/ryancircelli/tinker-and-create-mods?label=pack)](https://github.com/ryancircelli/tinker-and-create-mods/releases/latest)
[![Minecraft](https://img.shields.io/badge/Minecraft-1.21.1-brightgreen)](https://modrinth.com/modpack/tinker-create)
[![NeoForge](https://img.shields.io/badge/NeoForge-21.1.248-orange)](https://neoforged.net/)
[![mods](https://img.shields.io/badge/mods-339-blue)](docs/usage/mods.md)
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

## Playing the pack

New here? Start with these.

| | |
|---|---|
| 🚀 **[Getting started](docs/usage/getting-started.md)** | Install it, how much RAM to give it, and what to do first |
| 📖 **[Quest book](docs/usage/quest-book.md)** | All 44 quests, what each asks for and what it pays out |
| 🧱 **[Mod list](docs/usage/mods.md)** | Everything in the pack, by category, and why things were left out |
| ⌨️ **[Keybinds](docs/usage/keybinds.md)** | The keys the pack sets, and which are deliberately unbound |
| 📦 **[Shipped jars](docs/usage/shipped-jars.md)** | Exact version of every jar in the current release |

On this page: [Install](#install) · [Requirements](#requirements) ·
[Progression](#progression) · [How the pack is built](#how-the-pack-is-built) ·
[Licences](#third-party-content-and-licences) ·
[Repository layout](#repository-layout)

Changing the pack rather than playing it?
[Contributing](docs/dev/contributing.md) ·
[Architecture](docs/dev/architecture.md) ·
[Testing](docs/dev/testing.md)

## Install

**Modrinth App** (once the project is approved) — search *Tinker & Create* and hit install.

**Any launcher, today** — download the `.mrpack` from
[the latest release](https://github.com/ryancircelli/tinker-and-create-mods/releases/latest)
and import it. Modrinth App, Prism and ATLauncher all accept `.mrpack` directly.

The download is ~120 KB. It contains no mod jars — only a manifest of URLs and
hashes — so your launcher fetches each mod from its own CDN.

## Requirements

**Give it 4 GB of RAM.** Less will not finish loading.

That is measured, not guessed. At a 3 GB heap the client dies part-way through
startup with `OutOfMemoryError: Java heap space` on a resource-reload thread,
then a cascade of `Tried to lookup sprite, but atlas is not initialized`. It is
not a leak — the heap sits at 40% *after* the crash. It is one large allocation
while stitching the texture atlas for ~340 mods, so a slightly larger heap fixes
it outright.

4 GB is the **heap** (`-Xmx4G`). The whole process wants roughly 6 GB of system
memory once the JVM's own overhead and your graphics driver are counted, so 8 GB
total is the realistic floor. 6 GB of heap is more comfortable but not required.

Java 21 is required, which every modern launcher installs for you.

## Progression

The pack ships a guided walkthrough as **44 quests across 8 categories**, built on
[Boundless](https://modrinth.com/mod/boundless-quests). Open it from the button in
your inventory, above the offhand slot, or press `]`.

Nothing is locked behind another category, so follow whichever appeals to you.
Rewards are never auto-claimed: a quest completes, you get a toast, and you claim
it when you want to.

| Category | Where it takes you |
| --- | --- |
| Getting Started | First wood, first night, and the lay of the land |
| Tinkers' Construct | Tinker Station → first tool → melter → Smeltery |
| Create | Goggles → water wheel → press → contraptions → chain conveyors |
| Storage | Barrels → drawers → vaults → networked and Ender storage |
| Carrying Capacity | Backpacks → upgrades → Curios slots |
| Time & Growth | Time in a Bottle → accelerated farming → cooking |
| Exploration | Nature's Compass → structures → the Nether |
| Ponder Guides | Repeatable buttons that play Create's animated explanations |

The full list, with every objective and reward, is in
[docs/usage/quest-book.md](docs/usage/quest-book.md) — generated from the
questpack, so it cannot drift from what you actually see in game.

## How the pack is built

`tools/mods.json` is the single source of truth. `tools/build.js` resolves every
mod against the Modrinth API and writes a manifest-only `.mrpack` in which each
file carries a download URL plus `sha1` and `sha512`.

Publishing is automatic: bump `pack.version` in `tools/mods.json`, push to
`master`, and CI builds, verifies, uploads to Modrinth and cuts a GitHub release.

```
node tools/build.js                  # write packs/tinker-and-create-<version>.mrpack
node tools/gen-quests-boundless.js   # regenerate the Boundless questpack
node tools/gen-docs.js               # regenerate the generated docs and badges
node tools/jointest.js <pack>        # acceptance gate: real client joins a real server
```

`jointest.js` is the check that matters. Registry-sync and packet-decode failures
only appear during login, so neither a server boot nor a client boot can catch
them — it found nine crashes that static checks missed. It is also the only layer
that catches this pack's real failure mode: config that parses, loads, renders,
and silently does nothing.

Quest editing does not need a restart. Boundless loads server-side and syncs to
connected clients, so copying the JSON in and running `boundless reload` is
enough.

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
docs/usage/     playing the pack — generated from the pack itself
docs/dev/       changing the pack — contributing, architecture, testing
```

## Documentation

Start at [docs/](docs/README.md).

Playing: [getting started](docs/usage/getting-started.md) ·
[quest book](docs/usage/quest-book.md) ·
[mod list](docs/usage/mods.md) ·
[keybinds](docs/usage/keybinds.md)

Changing it: [contributing](docs/dev/contributing.md) ·
[architecture](docs/dev/architecture.md) ·
[testing](docs/dev/testing.md)

The three player-facing references are generated by `tools/gen-docs.js` from
`tools/mods.json`, the built `.mrpack`, the questpack and the shipped keybinds,
so they cannot drift from what actually ships.
