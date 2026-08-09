# Tinker & Create — externally hosted mods

CDN hosting for the few mods in the **Tinker & Create** modpack that are not
published on Modrinth for Minecraft 1.21.1 / NeoForge. The modpack references
these release assets directly in `modrinth.index.json`, so players download them
over a CDN like every other mod — nothing is embedded in the pack and nothing is
served from the game server's uplink.

This repository hosts **build artifacts only**. No source is published here.

## Contents & attribution

All three are distributed under the MIT licence, which permits redistribution.

| Jar | Project | Author(s) |
|---|---|---|
| `TinkersConstruct-1.21.1-*.jar` | Tinkers' Construct (community 1.21.1 port) | SlimeKnights and port contributors |
| `Mantle-1.21.1-*.jar` | Mantle (community 1.21.1 port) | SlimeKnights and port contributors |
| `TinkersLevellingAddon-1.21.1-*.jar` | Tinkers' Levelling Addon (1.21.1 / NeoForge port) | Pyre540 |

Upstream projects belong to their respective authors; this repository claims no
ownership over them and exists purely to make the modpack installable.

## Versioning

Release assets are **immutable**. The modpack manifest pins SHA1 and SHA512 for
every file, so replacing an asset in place would break every existing install.
Each new jar build gets a new release tag instead.
