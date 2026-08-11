# Documentation

Split by who you are: playing the pack, or changing it.

## Playing

| Doc | What it covers |
|---|---|
| [Getting started](usage/getting-started.md) | Installing, how much RAM to give it, joining a server |
| [Quest book](usage/quest-book.md) | Every quest, its objective and its reward |
| [Mod list](usage/mods.md) | Everything that ships, by category, and why things were dropped |
| [Shipped jars](usage/shipped-jars.md) | Exact jar versions in the current release |
| [Keybinds](usage/keybinds.md) | The defaults the pack sets, and why some keys are unbound |

## Changing the pack

| Doc | What it covers |
|---|---|
| [Contributing](dev/contributing.md) | Adding or removing a mod, editing quests, publishing |
| [Architecture](dev/architecture.md) | How the build, the generators and CI fit together |
| [Testing](dev/testing.md) | The join-test harness — it launches a real client and plays the game |
| [Mod decisions](dev/mod-decisions.md) | Every mod considered, and the reason it was kept or dropped |
| [Catalogue](dev/catalogue.md) | Candidates seen across reference packs, with adoption data |
| [Migration](dev/migration.md) | What changed moving from the Fabric pack to NeoForge |
| [Design notes](dev/todo.md) | Rejected approaches, with reasons |

## Generated docs

Everything in `usage/` is produced by `tools/gen-docs.js` from the pack itself —
`tools/mods.json`, the built `.mrpack`, the Boundless questpack and the shipped
`keybindings.txt`. Do not edit them; run the generator:

```bash
node tools/gen-docs.js
```

They carry a `GENERATED` comment at the top as a reminder. The reason they are
derived is not tidiness: the hand-written mod list they replaced still
advertised Dramatic Doors weeks after it was removed, and had never heard of
half the pack.

**CI is the source of truth.** `publish.yml` regenerates these after building
and commits the result, so they describe the artifact that was actually
published rather than whatever a developer had built locally. Running the
generator yourself is a convenience; on a pull request `docs.yml` checks your
output matches, and names the source file if it does not.

`shipped-jars.md` is the one file **not** equality-checked. It records the
versions the resolver chose, and the resolver takes the newest compatible build
of each mod — so it changes whenever any of ~340 mods publishes upstream, with
nothing here having changed. Checking it would mean a red build for reasons
outside this repository.

Server deployment is deliberately **not** documented here — this repository is
public, and the server's addresses and credentials live outside it.
