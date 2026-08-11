# Testing

The harness launches a **real** NeoForge client, drives it through the menus,
joins a **real** server and asserts it reached the world. It is slow — about
eight minutes for a cold run at ~340 mods — and it is the only thing that
catches this pack's characteristic bug: configuration that parses, loads,
renders, and does nothing.

## Local run

```bash
node tools/jointest.js packs/tinker-and-create-<version>.mrpack
```

Installs a server and a client from the pack, starts both, joins, and reports
`JOIN TEST PASSED`.

Useful environment variables:

| Variable | Purpose |
|---|---|
| `CLIENT_MEM` | Client heap, default `5G`. Use `4G` to prove the pack still fits the supported floor. |
| `HOLD` | Seconds to keep the client in-world after joining, for manual poking. |
| `SHOTS` | Capture screenshots. |
| `SHOT_W` / `SHOT_H` | Screenshot size. |
| `XP_TEST` | Run the XP reward assertions. |

While `HOLD` is active the harness prints a server console pipe. Anything
written to it runs as a server command:

```bash
echo "give JoinTestBot minecraft:barrel 2" >> /tmp/tc-join-nf-XXXX/console.in
```

That pipe is the most useful part of the harness. Prefer it to clicking:
`boundless complete <id> <player>` and `boundless redeem <id> <player>` test the
whole quest reward path deterministically, with no UI driving at all.

## Against the live server

```bash
LIVE_HOST=<host> LIVE_PORT=<port> node tools/joinlive.js packs/<pack>.mrpack
```

Needs a real session token. `joinlive.js` reads one from a credentials file; it
is never printed.

**Never run `jcmd -l`** while a client is up. It prints full command lines, and
Minecraft's contains `--accessToken`. Use targeted `jcmd <pid> <command>` with a
PID found some other way.

## Driving the UI

Keyboard works through `xdotool key --window <id>`. **Mouse clicks do not** —
`--window` uses `XSendEvent`, which the game ignores for mouse input. Use XTEST
instead: `xdotool mousemove <absolute-screen-x> <y>` then `xdotool click 1`, and
derive the window origin empirically, because the reported geometry includes
frame decoration and is off by tens of pixels.

Given how fiddly that is, drive through the server console wherever possible and
use the UI only to confirm what something looks like.

## What to check after a change

- **Quests:** complete and redeem one from the console, then read `XpTotal`
  before and after. Do not use `/xp query points` — it reports points *within
  the current level*, not the total, so a correct +20 reward can read as `3`.
- **Keybinds:** read the client's **applied** `options.txt` after it boots, not
  the file the generator wrote. That is how the Squat Grow clash on `u` was
  found; the generated file looked perfect.
- **Memory:** run with `CLIENT_MEM=4G`. If the pack has grown past the floor, it
  fails during resource reload, not at the title screen.
- **Removals:** confirm the mod is gone from the server's `mods/` after a
  restart, not merely absent from the manifest.

## Reading a crash

An `OutOfMemoryError` on a `Worker-ResourceReload` thread with the heap sitting
low afterwards is an allocation spike, not a leak — almost always the texture
atlas. The give-away cascade is:

```
Caught error loading resourcepacks, removing all selected resourcepacks
Tried to lookup sprite, but atlas is not initialized
```

Every one of those sprite errors is a symptom. Do not debug them.
