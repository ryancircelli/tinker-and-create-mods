# Getting started

Tinker & Create is a Minecraft **1.21.1 / NeoForge** modpack built around
Tinkers' Construct and Create: tools that grow with you, and machines that do
your work for you.

## Install

The pack is published on Modrinth. In the **Modrinth App**, search for
*Tinker & Create* and install it, or import a `.mrpack` file directly.

Any launcher that understands `.mrpack` works — Prism and ATLauncher both do.
Everything downloads from Modrinth's CDN and GitHub releases, so there is
nothing to fetch by hand.

## How much RAM

**Give it 4 GB.** Less will not survive loading.

This is measured, not guessed. At a 3 GB heap the client dies part-way through
startup:

```
OutOfMemoryError: Java heap space        (thread Worker-ResourceReload-N)
-> Caught error loading resourcepacks, removing all selected resourcepacks
-> Tried to lookup sprite, but atlas is not initialized
```

That is not a memory leak — the heap sits at only 40% *after* the crash. It is a
single large allocation while stitching the texture atlas for ~340 mods. More
RAM fixes it because the spike is momentary.

At 4 GB the same load peaks around 3 GB and plays fine. Note that 4 GB is the
**heap** (`-Xmx4G`); the whole process needs roughly 6 GB of system RAM once you
add the JVM's own overhead and your graphics driver, so a machine with 8 GB
total is the realistic floor.

If you have memory to spare, 6 GB gives more headroom, but it is not required.

## Playing

Open the **quest book** from the button in your inventory, just above the
offhand slot, or press `]`. It is the intended way in: eight categories, and
nothing is locked behind another category, so follow whichever appeals to you.

Rewards are not claimed automatically. A quest completes, you get a toast, and
then you claim it when you want to — the same way FTB Quests behaves.

Some quests reward a **Ponder scene**: claiming them plays Create's animated
explanation of the machine you just built. You can also watch any Create item's
scene at any time by hovering it in your inventory or EMI and pressing `W`.

See the [quest book](quest-book.md) for the full list, and
[keybinds](keybinds.md) for the keys the pack sets.

## Multiplayer

The pack runs unmodified on a dedicated server; the server side is a subset of
the client mods and the build works that out automatically.

If a server rejects you with a message about a channel failing to connect, your
client and the server are on different pack versions — update to the same one.

## Distant Horizons

Distant Horizons ships enabled, including distant generation. It renders a
low-detail version of terrain far past your render distance, which is what
lets a modest machine see a long way without paying for full chunks. If your
frame rate suffers, lower the render distance before turning it off — the two
are separate settings.
