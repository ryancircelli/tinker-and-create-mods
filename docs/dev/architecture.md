# Architecture

The pack is a **program that produces a modpack**, not a folder of mods. A small
set of authored files is the input; everything else is generated and can be
deleted and rebuilt.

## Data flow

```
tools/mods.json ─────┐
overrides/ ──────────┼──> tools/build.js ──> packs/*.mrpack ──> CI ──> Modrinth
external-mods/ ──────┘                            │
                                                  └──> tools/gen-docs.js ──> docs/usage/
tools/gen-quests-boundless.js  ──> overrides/config/boundless/…
tools/gen-keybinds.js          ──> overrides/config/defaultoptions/keybindings.txt
```

Authored by hand: `tools/mods.json`, the generator scripts, the configs under
`overrides/` that are not themselves generated, and the prose docs.

Generated, never hand-edited: the `.mrpack`, everything in `docs/usage/`, the
Boundless questpack, and `keybindings.txt`.

## The build

`tools/build.js` resolves every declared slug against Modrinth, picks a version
compatible with the pack's Minecraft and loader, follows required dependencies,
and writes a `.mrpack`.

Things it has to handle, each learned the hard way:

- **Only whitelisted hosts.** A `.mrpack` may reference `cdn.modrinth.com`,
  `github.com`, `raw.githubusercontent.com` and `gitlab.com`. Not CurseForge.
  Anything else must ship another way.
- **Tinkers' Construct is not on Modrinth for 1.21.1.** It and Mantle are
  unofficial ports, served from a GitHub release. If the jar is missing locally
  the build fetches it from that release rather than silently shipping a pack
  without Tinkers, which is exactly what CI did once.
- **Rate limits.** Modrinth returns HTTP 429 under load. Responses are cached in
  `.cache/` (content-addressed, shared with the test harness) and project
  lookups are batched — a cold build makes ~380 requests, a warm one makes 5.
- **Version stamping.** The pack version is written into `bcc-common.toml` at
  build time so the server can tell clients which version they need.

## Generators

| Tool | Produces | From |
|---|---|---|
| `gen-quests-boundless.js` | the questpack | itself — quests are code |
| `gen-keybinds.js` | `keybindings.txt` | a capture of a real client's `options.txt` |
| `gen-docs.js` | `docs/usage/*` | `mods.json`, the `.mrpack`, the questpack, keybinds |

`gen-quests.js` and `gen-advancements.js` are **superseded**. They are kept, with
a guard that refuses to run them, as the record of two earlier designs — an
advancement tree, then Questlog — before the move to Boundless.

## Testing

`tools/jointest.js` installs a NeoForge server *and* client from a built pack,
starts the server, launches a real client, drives it through the menus, joins,
and asserts it reached the world. `joinlive.js` does the same against the live
server.

This is the only layer that catches the failure mode this pack keeps producing:
config that parses, loads, displays, and does nothing. See
[testing](testing.md).

## CI

`.github/workflows/publish.yml` runs on pushes to `master` that touch the pack,
including `overrides/**` — that path was missing once, and config changes were
committed for days without ever reaching players.

It builds, refuses to reuse an existing version number, publishes to Modrinth,
and cuts a GitHub release. `.cache` is restored between runs, which is why a
publish takes ~20 seconds warm and ~90 cold.

A green run means the workflow succeeded. It does not mean the pack is correct —
verify the published artifact, not the local build.

## Why so much tooling

The pack is ~340 mods. At that size every interesting failure is silent:

- a mod is missing and nothing says so until a client is rejected
- a config key is misspelled and the parser drops it without complaint
- two mods claim one key and the loser simply never fires
- a doc goes stale and confidently describes a mod that left weeks ago

None of these produce an error. They produce a pack that looks fine. The tools
exist to turn each of those into something that fails loudly, or is impossible
to express in the first place.
