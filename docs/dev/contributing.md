# Contributing

Everything about the pack is derived from a small number of source files. Edit
those, run the generator, commit. Do not hand-edit anything generated.

## The one rule

`tools/mods.json` is the source of truth for what ships. The `.mrpack` is a
build artifact. If you find yourself editing a manifest, stop.

## Adding a mod

1. Confirm it exists for NeoForge 1.21.1 before adding it:

   ```bash
   curl -s -H "User-Agent: your-name/check" \
     'https://api.modrinth.com/v2/project/<slug>/version?loaders=["neoforge"]&game_versions=["1.21.1"]' \
     | head -c 400
   ```

   An empty array means no build exists. Roughly half of "just add X" requests
   die here — check first rather than discovering it in CI.

2. Add an entry to the `mods` array in `tools/mods.json`:

   ```json
   { "name": "Squat Grow", "slug": "squat-grow", "category": "QoL" }
   ```

   The slug is the Modrinth slug, not the display name.

3. Bump `pack.version`.
4. Build, regenerate docs, commit, push. CI publishes.

Dependencies resolve automatically — do not list them.

## Removing a mod

Delete it from `mods`, and add it to `removed` **with a real reason**:

```json
{ "name": "Dramatic Doors", "slug": "dramatic-doors",
  "reason": "5,917 atlas textures — second largest in the pack. It generates
             3-tall variants for every door from every mod." }
```

The reason is not ceremony. Without it the same mod gets re-proposed six weeks
later by someone who does not know why it went.

Two things to be aware of when removing a content mod:

- **Blocks already placed in a world disappear.** NeoForge logs
  `mod (version -> MISSING)` on the next load. That is expected, not a fault,
  but it is worth warning players about.
- **Check nothing depends on it** before you cut it:

  ```bash
  for j in <mods-dir>/*.jar; do
    unzip -p "$j" META-INF/neoforge.mods.toml 2>/dev/null \
      | grep -q 'modId *= *"<the-mod>"' && echo "$j"
  done
  ```

## Keybinds

Never hand-edit `overrides/config/defaultoptions/keybindings.txt`. It is
generated from a capture of a real client's `options.txt`:

```bash
node tools/gen-keybinds.js tools/keybind-src/options-<version>.txt
```

Two traps, both of which have bitten this pack:

- **A capture only knows the mods that existed when it was taken.** Adding a mod
  introduces binds the generator has never seen, so a fresh clash can appear
  silently. After adding a mod, launch it once and re-capture.
- **Default Options only applies keys listed in the file.** A mod whose bind is
  absent keeps its own default. If you need a mod to have *no* key, it must be
  written out explicitly as `unknown` — see `ALWAYS_UNBIND` in the generator,
  which exists because TrashSlot would otherwise silently reclaim `T` from chat.

Contested keys are resolved by the `WINNER` map: name the bind that should keep
the key, and every other claimant is unbound.

## Quests

Quests are generated too:

```bash
node tools/gen-quests-boundless.js
```

Edit `tools/gen-quests-boundless.js`, never the JSON under
`overrides/config/boundless/`.

Boundless's schema is unforgiving and fails **silently** — it drops keys it does
not recognise rather than erroring, so a wrong field name produces a quest that
loads, displays, and does nothing. Verified against `QuestData.java`:

| Correct | Not |
|---|---|
| `reward` (singular) | `rewards` |
| `exp` + `count` | `expType` + `expAmount` |
| `completion.complete[]` | `completion.targets[]` with `{kind,id}` |
| `{ "collect": "id", "count": n }` | `{ "kind": "item", "id": "..." }` |

Targets are keyed by **verb** — `collect`, `submit`, `kill`, `achieve`,
`effect`, `stat`, `xp`. There is no `kind`/`id` form. Any-of is not supported:
`collect` takes a single string, and the array form makes every entry
separately required.

Ponder rewards are `/ponder <scene>` — there is no `scene` literal, and adding
one makes the scene id trailing data. Boundless runs reward commands with output
suppressed, so mistakes here leave no trace at all.

**Test quest changes in game.** Every one of the above shipped broken because
the JSON looked plausible.

## Docs

```bash
node tools/gen-docs.js
```

Regenerates the mod list, quest book and keybind reference from the pack. Run it
whenever mods or quests change; CI checks it, so a stale doc fails the build
rather than misleading a reader.

## Publishing

```bash
node tools/build.js          # writes packs/tinker-and-create-<version>.mrpack
git commit && git push       # CI builds, publishes to Modrinth, tags a release
```

CI refuses to publish a version number that already exists, and will claim the
next free one rather than silently creating a duplicate.

After publishing, verify the **published artifact** rather than your local
build — download it and check the thing players receive:

```bash
unzip -p <downloaded>.mrpack modrinth.index.json | grep -c '"path"'
unzip -p <downloaded>.mrpack overrides/config/<file>
```

A green CI run means the workflow succeeded, not that the content is correct.
