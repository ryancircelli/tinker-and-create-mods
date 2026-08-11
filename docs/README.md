# Documentation

Split by who you are: playing the pack, or changing it.

## Playing

| Doc | What it covers |
|---|---|
| [Getting started](usage/getting-started.md) | Installing, how much RAM to give it, joining a server |
| [Quest book](usage/quest-book.md) | Every quest, its objective and its reward |
| [Mod list](usage/mods.md) | Everything that ships, by category, plus exact jar versions |
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

`usage/mods.md`, `usage/quest-book.md` and `usage/keybinds.md` are produced by
`tools/gen-docs.js` from the pack itself — `tools/mods.json`, the built
`.mrpack`, the Boundless questpack and the shipped `keybindings.txt`. Do not
edit them; run the generator:

```bash
node tools/gen-docs.js
```

They carry a `GENERATED` comment at the top as a reminder. The reason they are
derived is not tidiness: the hand-written mod list they replaced still
advertised Dramatic Doors weeks after it was removed, and had never heard of
half the pack.

Server deployment is deliberately **not** documented here — this repository is
public, and the server's addresses and credentials live outside it.
