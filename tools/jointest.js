#!/usr/bin/env node
/**
 * End-to-end harness: a real NeoForge client joins a real NeoForge server.
 *
 * This is the only check that exercises the login handshake. Registry sync and
 * packet-decode failures happen when the client decodes the server's login
 * packets — a server boot cannot see them. On the Fabric side this exact class
 * of bug bit twice (Moonlight chain, and Hephaestus's StationSlotLayout), both
 * invisible to smoketest.js.
 *
 * It is also the acceptance test for the Tinkers 1.21 port in TODO.md: Tinkers
 * syncs its station layout during login, so "it compiles" and even "the server
 * boots" prove nothing. This does.
 *
 * NeoForge has no equivalent of Fabric's profile JSON endpoint, so the client
 * is provisioned by running the installer with --installClient and reading the
 * version profile it writes, merging it with the vanilla manifest by hand.
 *
 *   node tools/jointest.js [path/to/pack.mrpack]
 *   NO_RENDER=1 node tools/jointest.js    # drop the render stack if GL misbehaves
 *
 * Needs a usable DISPLAY (WSLg provides one) and Java 21 for MC 1.21+.
 */

const fs = require('fs');
const os = require('os');
const path = require('path');
const { execSync, spawn } = require('child_process');
const { fetchCached, download, stats } = require('./cache');

const ROOT = path.resolve(__dirname, '..');
const DATA = JSON.parse(fs.readFileSync(path.join(__dirname, 'mods.json'), 'utf8'));
const UA = 'tinker-and-create/jointest';
const PORT = 25581;

const JAVA =
  [process.env.JAVA_BIN,
   path.join(os.homedir(), '.sdkman/candidates/java/current/bin/java'),
   '/usr/lib/jvm/openlogic-openjdk-17-hotspot-amd64/bin/java'].filter(Boolean).find(fs.existsSync) || 'java';

const packPath =
  process.argv[2] || path.join(ROOT, 'packs', `tinker-and-create-${DATA.pack.version}.mrpack`);

// These must not match mod *names* in the loaded-mods listing — an earlier
// version flagged "Forgified Fabric Registry Sync (v0)" as a registry desync.
// Every pattern here describes an error message, not a subsystem.
const JOIN_FAIL = [
  /larger than I expected/i,
  /Payload may not be larger/i,
  /\d+ unread bytes|extra bytes after/i,
  /Registry sync failed|failed to sync registry/i,
  /Connection closed:|Internal Exception:|Disconnected:/i,
  /Failed to connect to the server/i,
  /Attempted to load a modifier before/i,
  /DecoderException|EncoderException/,
];
const JOIN_OK = [/joined the game/i];   // server-side confirmation only

const get = (url, attempts = 6) => download(url, attempts);
const getJson = async (u) => JSON.parse((await get(u)).toString());

async function parallel(items, fn, limit = 6) {
  let i = 0;
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (i < items.length) await fn(items[i++]);
  }));
}

/** Resolve a maven coordinate to a jar path under libraries/. */
function mavenPath(name) {
  const [g, a, v, classifier] = name.split(':');
  const file = classifier ? `${a}-${v}-${classifier}.jar` : `${a}-${v}.jar`;
  return path.join(...g.split('.'), a, v, file);
}


// Previous runs that failed or were killed leave their workspace behind. Clear
// anything older than 6 hours so they cannot accumulate unbounded.
function sweepStale(prefix) {
  const tmp = os.tmpdir(), cutoff = Date.now() - 6 * 3600 * 1000;
  let n = 0;
  for (const d of fs.readdirSync(tmp)) {
    if (!d.startsWith(prefix)) continue;
    const p = path.join(tmp, d);
    try {
      if (fs.statSync(p).mtimeMs < cutoff) { fs.rmSync(p, { recursive: true, force: true }); n++; }
    } catch {}
  }
  if (n) console.log(`  swept ${n} stale workspace(s)`);
}


/** Extract any jars the pack ships in overrides/mods/ — they are not in the manifest. */
function installOverrides(packPath, destMods) {
  let names = [];
  try {
    names = execSync(`unzip -Z1 "${packPath}" 'overrides/mods/*.jar'`, { encoding: 'utf8' })
      .split('\n').filter(Boolean);
  } catch { return 0; }
  for (const n of names) {
    execSync(`unzip -o -j -q "${packPath}" "${n}" -d "${destMods}"`);
  }
  return names.length;
}

(async () => {
  sweepStale('tc-join-nf-');
  const _d = Number(process.env.START_DELAY_MS) || 0;
  if (_d) await new Promise((r) => setTimeout(r, _d));
  const manifest = JSON.parse(
    execSync(`unzip -p "${packPath}" modrinth.index.json`, { encoding: 'utf8', maxBuffer: 1 << 26 })
  );
  const mc = manifest.dependencies.minecraft;
  const nfVersion = manifest.dependencies.neoforge || manifest.dependencies.forge;
  const isNeo = !!manifest.dependencies.neoforge;
  const modernNeo = isNeo && !nfVersion.startsWith('47.');

  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'tc-join-nf-'));
  const cdir = path.join(dir, 'client');
  const sdir = path.join(dir, 'server');
  for (const d of [cdir, sdir]) fs.mkdirSync(path.join(d, 'mods'), { recursive: true });
  console.log(`Workspace: ${dir}`);
  console.log(`${isNeo ? 'NeoForge' : 'Forge'} ${nfVersion} on MC ${mc}\nJava: ${JAVA}\n`);

  const installerUrl = modernNeo
    ? `https://maven.neoforged.net/releases/net/neoforged/neoforge/${nfVersion}/neoforge-${nfVersion}-installer.jar`
    : isNeo
      ? `https://maven.neoforged.net/releases/net/neoforged/forge/${mc}-${nfVersion}/forge-${mc}-${nfVersion}-installer.jar`
      : `https://maven.minecraftforge.net/net/minecraftforge/forge/${mc}-${nfVersion}/forge-${mc}-${nfVersion}-installer.jar`;

  // ---- vanilla manifest first: the installer needs the client jar ----------
  const vmPre = await getJson('https://launchermeta.mojang.com/mc/game/version_manifest_v2.json');
  const vanillaPre = await getJson(vmPre.versions.find((v) => v.id === mc).url);
  const seeded = path.join(cdir, 'versions', mc, `${mc}.jar`);
  await fetchCached(vanillaPre.downloads.client.url, seeded, vanillaPre.downloads.client.sha1);
  fs.writeFileSync(path.join(cdir, 'versions', mc, `${mc}.json`), JSON.stringify(vanillaPre));
  console.log(`  seeded vanilla client ${mc} from cache`);

  // ---- client: installer needs a launcher profile to exist first -----------
  console.log('Installing client (NeoForge installer)...');
  fs.writeFileSync(path.join(cdir, 'launcher_profiles.json'), JSON.stringify({ profiles: {}, version: 3 }));
  fs.writeFileSync(path.join(cdir, 'installer.jar'), await get(installerUrl));
  try {
    execSync(`"${JAVA}" -jar installer.jar --installClient "${cdir}"`, {
      cwd: cdir, stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 1 << 26,
    });
  } catch (err) {
    console.error('Client install failed:\n' + (err.stdout || err.stderr || '').toString().slice(-1200));
    process.exit(1);
  }

  // The installer writes versions/<id>/<id>.json describing the modded launch.
  const versionsDir = path.join(cdir, 'versions');
  const profileId = fs.readdirSync(versionsDir).find((d) => /neoforge|forge/i.test(d));
  if (!profileId) { console.error('No modded version profile written'); process.exit(1); }
  const profile = JSON.parse(fs.readFileSync(path.join(versionsDir, profileId, `${profileId}.json`), 'utf8'));
  console.log(`  profile: ${profileId} (inherits ${profile.inheritsFrom || mc})`);

  // ---- vanilla side --------------------------------------------------------
  const vanilla = (profile.inheritsFrom || mc) === mc
    ? vanillaPre
    : await getJson(vmPre.versions.find((v) => v.id === profile.inheritsFrom).url);

  const libDir = path.join(cdir, 'libraries');
  fs.mkdirSync(libDir, { recursive: true });
  // Deliberately NOT added to the classpath: the installer already placed a
  // patched client among the profile libraries.
  const clientJar = seeded;

  const allowed = (lib) => {
    if (/natives-(windows|macos|osx)/.test(lib.name)) return false;
    if (!lib.rules) return true;
    let ok = false;
    for (const r of lib.rules) {
      const applies = !r.os || r.os.name === 'linux';
      if (applies) ok = r.action === 'allow';
    }
    return ok;
  };

  const cp = [];
  const libRetry = [];
  await parallel(vanilla.libraries.filter(allowed), async (lib) => {
    const a = lib.downloads?.artifact;
    if (!a?.url) return;
    const dest = path.join(libDir, a.path);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    cp.push(dest);
    if (fs.existsSync(dest)) return;
    try { await fetchCached(a.url, dest, a.sha1); }
    catch { libRetry.push([a.url, dest]); }
  }, 4);
  // Libraries are mandatory — unlike individual assets, a miss here is fatal.
  for (const [url, dest] of libRetry) {
    process.stdout.write(`  retrying ${path.basename(dest)}\n`);
    fs.writeFileSync(dest, await get(url, 8));
  }

  // NeoForge libraries: the installer places most of them, but any it lists
  // with a download URL and did not fetch must be pulled from maven.
  await parallel(profile.libraries || [], async (lib) => {
    const rel = mavenPath(lib.name);
    const dest = path.join(libDir, rel);
    if (!fs.existsSync(dest)) {
      const url = lib.downloads?.artifact?.url ||
        `${(lib.url || 'https://maven.neoforged.net/releases/').replace(/\/$/, '')}/${rel.split(path.sep).join('/')}`;
      try {
        fs.mkdirSync(path.dirname(dest), { recursive: true });
        fs.writeFileSync(dest, await get(url));
      } catch { return; }
    }
    cp.push(dest);
  });

  // ---- assets --------------------------------------------------------------
  const idx = await getJson(vanilla.assetIndex.url);
  const aDir = path.join(cdir, 'assets');
  fs.mkdirSync(path.join(aDir, 'indexes'), { recursive: true });
  fs.writeFileSync(path.join(aDir, 'indexes', vanilla.assetIndex.id + '.json'), JSON.stringify(idx));
  const objs = Object.values(idx.objects);
  let done = 0; const assetFails = [];
  await parallel(objs, async (o) => {
    const sub = o.hash.slice(0, 2);
    const dest = path.join(aDir, 'objects', sub, o.hash);
    if (!fs.existsSync(dest)) {
      try {
        await fetchCached(`https://resources.download.minecraft.net/${sub}/${o.hash}`, dest, o.hash);
      } catch (e) { assetFails.push(o.hash); }
    }
    if (++done % 500 === 0) process.stdout.write(`  assets ${done}/${objs.length}\r`);
  }, 8);
  console.log(`  assets ${objs.length - assetFails.length}/${objs.length}` +
    (assetFails.length ? `  (${assetFails.length} failed — tolerated)` : '   '));
  if (assetFails.length > 40) {
    console.error('Too many asset failures; the client will not start reliably.');
    process.exit(1);
  }

  // ---- mods ----------------------------------------------------------------
  fs.writeFileSync(path.join(cdir, 'options.txt'),
    ['onboardAccessibility:false', 'skipMultiplayerWarning:true',
     'tutorialStep:none', 'pauseOnLostFocus:false', 'maxFps:60',
     // Pinned rather than auto: the UI-capture pass resizes the window, and
     // auto would silently change scale mid-run. Minecraft clamps this down on
     // its own while the window is still 854x480, so menu coordinates hold.
     'guiScale:4'].join('\n') + '\n');

  const noRender = !!process.env.NO_RENDER;
  const RENDER = /embeddium|oculus|iris|sodium|entityculling|immediatelyfast|distanthorizons/i;
  const clientMods = manifest.files.filter(
    (f) => f.env?.client !== 'unsupported' && !(noRender && RENDER.test(f.path)));
  const serverMods = manifest.files.filter((f) => f.env?.server !== 'unsupported');
  console.log(`\nClient mods: ${clientMods.length}${noRender ? ' (render stack excluded)' : ''}`);
  console.log(`Server mods: ${serverMods.length}\n`);
  const fetchMods = (list, into) => parallel(list, async (f) => {
    await fetchCached(f.downloads[0], path.join(into, 'mods', path.basename(f.path)), f.hashes?.sha1);
  }, 10);
  await Promise.all([fetchMods(clientMods, cdir), fetchMods(serverMods, sdir)]);
  const ovc = installOverrides(packPath, path.join(cdir, 'mods'));
  const ovs = installOverrides(packPath, path.join(sdir, 'mods'));
  // Non-mod overrides (configs, datapacks) apply to BOTH sides per the .mrpack
  // spec, and the harness was only ever copying mod jars -- so config-driven
  // pack content (Quark button, minimap position, the advancement datapack)
  // was never actually exercised by a test run.
  for (const [label, dest] of [['client', cdir], ['server', sdir]]) {
    try {
      const stage = path.join(dest, '_ovtmp');
      execSync(`unzip -o -q "${packPath}" 'overrides/*' -x 'overrides/mods/*' -d "${stage}"`);
      const src = path.join(stage, 'overrides');
      if (fs.existsSync(src)) {
        fs.cpSync(src, dest, { recursive: true });
        console.log(`  applied non-mod overrides -> ${label}`);
      }
      fs.rmSync(stage, { recursive: true, force: true });
    } catch {}
  }
  if (ovc || ovs) console.log(`  overrides: ${ovc} client / ${ovs} server jar(s)`);
  console.log('  ' + stats());

  // ---- server --------------------------------------------------------------
  console.log('Installing and starting server...');
  await fetchCached(installerUrl, path.join(sdir, 'installer.jar'), `installer-${nfVersion}`);
  if (vanilla.downloads?.server) {
    const sj = path.join(sdir, 'libraries', 'net', 'minecraft', 'server', mc, `server-${mc}.jar`);
    await fetchCached(vanilla.downloads.server.url, sj, vanilla.downloads.server.sha1);
    console.log('  seeded vanilla server jar from cache');
  }
  try {
    execSync(`"${JAVA}" -jar installer.jar --installServer`, {
      cwd: sdir, stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 1 << 26 });
  } catch (err) {
    const out = ((err.stdout || '') + (err.stderr || '')).toString();
    console.error('Server install failed:\n' + out.split('\n').slice(-12).join('\n'));
    process.exit(1);
  }
  fs.writeFileSync(path.join(sdir, 'eula.txt'), 'eula=true\n');
  fs.writeFileSync(path.join(sdir, 'server.properties'),
    ['online-mode=false', `server-port=${PORT}`, 'level-type=minecraft:flat',
     'spawn-protection=0', 'view-distance=4', 'simulation-distance=4',
     // A slime killed the bot mid-run once, and every screenshot after that was
     // taken through the death screen's red overlay -- which tints the whole
     // frame and makes UI colours unreadable. Peaceful removes the variable.
     'difficulty=peaceful'].join('\n') + '\n');

  // Simple Voice Chat binds a FIXED UDP port from its config (default 24454),
  // not one derived from server-port -- so a harness run collided with a real
  // server running on this machine, voicechat failed to bind, and the client's
  // connect timed out mid-shutdown. Derive it from PORT so runs are isolated.
  const vcDir = path.join(sdir, 'config', 'voicechat');
  fs.mkdirSync(vcDir, { recursive: true });
  // NB: .properties, not .toml -- Simple Voice Chat ignores a .toml entirely and
  // generates its own .properties with the default 24454, which is what collided.
  fs.writeFileSync(path.join(vcDir, 'voicechat-server.properties'), `port=${PORT + 100}\n`);

  // AutoModpack enforces its sync at login: it offers the modpack, and declining
  // DISCONNECTS the client. The harness builds client and server from the same
  // .mrpack, so there is nothing to sync -- it would only ever block the join.
  // Disable the host side for tests. This means the harness validates that
  // AutoModpack LOADS, not that its sync works; verifying the sync needs a
  // genuinely out-of-date second machine.
  const amDir = path.join(sdir, 'automodpack');
  fs.mkdirSync(amDir, { recursive: true });
  fs.writeFileSync(path.join(amDir, 'automodpack-server.json'), JSON.stringify({
    DO_NOT_CHANGE_IT: 2,
    modpackHost: false,
    generateModpackOnStart: false,
    requireAutoModpackOnClient: false,
    nagUnModdedClients: false,
  }, null, 2) + '\n');

  const sArgs = modernNeo
    ? path.join(sdir, 'libraries', 'net', 'neoforged', 'neoforge', nfVersion, 'unix_args.txt')
    : path.join(sdir, 'libraries', 'net', isNeo ? 'neoforged' : 'minecraftforge', 'forge', `${mc}-${nfVersion}`, 'unix_args.txt');

  let xpVerdict = null;
  const server = spawn(JAVA, ['-Xmx3G', `@${sArgs}`, 'nogui'], { cwd: sdir });
  let up = false, sFail = null; const sLog = [];
  const watchS = (b) => {
    const s = b.toString(); sLog.push(s);
    if (/Done \([\d.]+s\)!/.test(s)) up = true;
    if (/ModLoadingException|Failed to start the minecraft server/.test(s)) sFail = s.trim();
  };
  server.stdout.on('data', watchS); server.stderr.on('data', watchS);
  const t0 = Date.now();
  while (!up && !sFail && Date.now() - t0 < 600000) await new Promise((r) => setTimeout(r, 1000));
  if (!up) {
    console.log('\nServer never reached Done:\n' + (sFail || sLog.slice(-3).join('')));
    server.kill('SIGKILL'); process.exitCode = 1; return;
  }
  console.log('Server up. Launching client...\n');

  // ---- client launch -------------------------------------------------------
  // NeoForge's profile carries JVM args with placeholders the launcher expands.
  const subst = (s) => s
    .replace(/\$\{library_directory\}/g, libDir)
    .replace(/\$\{classpath_separator\}/g, ':')
    .replace(/\$\{version_name\}/g, profile.inheritsFrom || mc);
  const jvmArgs = (profile.arguments?.jvm || []).filter((a) => typeof a === 'string').map(subst);
  const gameArgs = (profile.arguments?.game || []).filter((a) => typeof a === 'string');

  const args = [
    // 3G was enough at ~220 mods; at 276 the client OOMs on world entry.
    '-Xmx5G', ...jvmArgs,
    '-cp', [...new Set(cp)].join(':'),
    profile.mainClass,
    ...gameArgs,
    '--username', 'JoinTestBot', '--version', profileId,
    '--gameDir', cdir, '--assetsDir', aDir, '--assetIndex', vanilla.assetIndex.id,
    '--uuid', '0123456789abcdef0123456789abcdef', '--accessToken', '0',
    '--userType', 'legacy', '--versionType', 'release',
  ];

  const client = spawn(JAVA, args, {
    cwd: cdir, env: { ...process.env, DISPLAY: process.env.DISPLAY || ':0' },
  });

  const cLog = []; let joined = false; const failures = []; let lastProgress = Date.now();
  // The authoritative signal lives in the SERVER log, not the client's.
  const SP = !!process.env.SP_TEST;   // singleplayer first-boot instead of a join
  const sawJoin = () => /joined the game/i.test((SP ? cLog : sLog).join(''));
  const watchC = (b) => {
    const s = b.toString(); cLog.push(s);
    for (const line of s.split('\n')) {
      if (!line.trim()) continue;
      if (/Unable to load model|ResourceReload|Reloading ResourceManager/.test(line)) lastProgress = Date.now();
      if (JOIN_FAIL.some((r) => r.test(line))) failures.push(line.trim());
    }
  };
  client.stdout.on('data', watchC); client.stderr.on('data', watchC);

  // Wait for the client to finish loading, then connect via the UI.
  const shots = path.join(dir, 'shots');
  fs.mkdirSync(shots, { recursive: true });
  const sh = (cmd) => { try { return execSync(cmd, { encoding: 'utf8' }).trim(); } catch { return ''; } };
  const DISP = process.env.DISPLAY || ':0';
  const started = Date.now();
  while (!/Game took [\d.]+ seconds to start/.test(cLog.join('')) && Date.now() - started < 900000) {
    if (client.exitCode !== null) break;
    await new Promise((r) => setTimeout(r, 3000));
  }
  await new Promise((r) => setTimeout(r, 12000)); // let the menu settle

  const wid = sh(`DISPLAY=${DISP} xdotool search --name Minecraft | head -1`);
  if (wid) {
    console.log(`  client window ${wid} — driving Multiplayer > Direct Connection`);
    // Screenshot BEFORE each click so a mis-aimed click is visible in the shot
    // that preceded it. Coordinates are real pixels in an 854x480 window; at GUI
    // scale 2 the menu rows are 48px apart, which is how these were derived.
    const shot = (label) => sh(`DISPLAY=${DISP} import -window ${wid} ${path.join(shots, label + '.png')}`);
    const click = (x, y, label) => {
      shot(label);                       // state the click is about to act on
      sh(`DISPLAY=${DISP} xdotool windowactivate --sync ${wid}`);
      sh(`DISPLAY=${DISP} xdotool mousemove --window ${wid} ${x} ${y} click 1`);
    };
    const UI = JSON.parse(process.env.UI_COORDS || '{}');
    if (SP) {
      // Singleplayer > Create New World > Create. Screenshots are taken before
      // each click so a mis-aimed click is visible in the preceding frame.
      click(UI.sp?.[0] ?? 427, UI.sp?.[1] ?? 196, '1-main-menu');
      await new Promise((r) => setTimeout(r, 5000));
      click(UI.create?.[0] ?? 340, UI.create?.[1] ?? 442, '2-world-list');
      await new Promise((r) => setTimeout(r, 6000));
      shot('3-create-screen');
      sh(`DISPLAY=${DISP} xdotool type --window ${wid} --delay 40 "FirstBoot"`);
      await new Promise((r) => setTimeout(r, 1500));
      click(UI.go?.[0] ?? 427, UI.go?.[1] ?? 440, '4-named');
      await new Promise((r) => setTimeout(r, 10000));
      shot('5-creating');
    } else {
    click(UI.mp?.[0] ?? 427, UI.mp?.[1] ?? 244, '1-main-menu');
    await new Promise((r) => setTimeout(r, 4000));
    click(UI.direct?.[0] ?? 427, UI.direct?.[1] ?? 396, '2-multiplayer');
    await new Promise((r) => setTimeout(r, 3000));
    shot('3-direct-screen');
    sh(`DISPLAY=${DISP} xdotool type --window ${wid} --delay 40 "127.0.0.1:${PORT}"`);
    shot('4-typed');
    // The address field joins on Enter, which is resolution-independent and does
    // not depend on hitting a 32px-tall button; the click is only a fallback.
    sh(`DISPLAY=${DISP} xdotool key --window ${wid} Return`);
    await new Promise((r) => setTimeout(r, 8000));
    if (!sawJoin()) {
      shot('5-enter-fallback');
      click(UI.join?.[0] ?? 427, UI.join?.[1] ?? 355, '5-clicking-join');
    }
    }
  } else {
    console.log('  no client window found — cannot drive UI');
  }

  const t1 = Date.now();
  while (!joined && !failures.length && Date.now() - t1 < 900000) {
    if (sawJoin()) joined = true;
    if (client.exitCode !== null) break;
    await new Promise((r) => setTimeout(r, 1000));
  }
  if (joined) {
    // Let terrain finish, then open the inventory: item rendering is what the
    // Continuity crash broke, so a clean inventory is the real proof.
    // 30s was tuned for a ~220-mod pack; at 277 the client was still on
    // "Loading terrain" when screenshots fired, so the visual check proved
    // nothing. Wait long enough for the loading overlay to clear.
    await new Promise((r) => setTimeout(r, 75000));
    const w2 = sh(`DISPLAY=${DISP} xdotool search --name Minecraft | head -1`);
    if (w2) {
      sh(`DISPLAY=${DISP} xdotool windowactivate --sync ${w2}`);
      sh(`DISPLAY=${DISP} import -window ${w2} ${path.join(shots, '5-in-world.png')}`);
      sh(`DISPLAY=${DISP} xdotool key --window ${w2} e`);
      await new Promise((r) => setTimeout(r, 4000));
      sh(`DISPLAY=${DISP} import -window ${w2} ${path.join(shots, '6-inventory.png')}`);
      // Type into EMI's search box to confirm Tinkers content is registered
      // and renders — the pack's namesake, and the reason for the whole port.
      sh(`DISPLAY=${DISP} xdotool mousemove --window ${w2} 400 456 click 1`);
      await new Promise((r) => setTimeout(r, 1000));
      sh(`DISPLAY=${DISP} xdotool type --window ${w2} --delay 60 "tinker"`);
      await new Promise((r) => setTimeout(r, 4000));
      sh(`DISPLAY=${DISP} import -window ${w2} ${path.join(shots, '7-emi-tinkers.png')}`);

      // ---- UI capture ---------------------------------------------------
      // Produces the screenshots used to review GUI regressions (slot overlays,
      // overlapping widgets, the advancement tree). Everything here is about
      // making the frame READABLE: 854x480 at GUI scale 2 is too coarse to tell
      // a deliberate sprite from a missing-texture artefact.
      if (process.env.SHOTS) {
        const con = async (cmd, ms = 2500) => {
          try { server.stdin.write(cmd + '\n'); } catch {}
          await new Promise((r) => setTimeout(r, ms));
        };
        const snap = async (label, ms = 1500) => {
          await new Promise((r) => setTimeout(r, ms));
          sh(`DISPLAY=${DISP} import -window ${w2} ${path.join(shots, label + '.png')}`);
        };
        const key = (k) => sh(`DISPLAY=${DISP} xdotool key --window ${w2} ${k}`);

        await con('gamerule sendCommandFeedback false');
        await con('gamerule doDaylightCycle false');
        await con('difficulty peaceful');
        await con('time set noon');
        await con('weather clear');
        // Survival, not creative: the slot overlays worth reviewing (armor,
        // offhand, hotbar) only exist on the survival inventory screen. A
        // creative capture shows the item browser and proves nothing about them.
        await con('gamemode survival JoinTestBot');
        await con('effect give JoinTestBot minecraft:resistance 999999 4 true');
        await con('item replace entity JoinTestBot armor.head with minecraft:iron_helmet');
        await con('item replace entity JoinTestBot armor.chest with minecraft:iron_chestplate');
        await con('item replace entity JoinTestBot weapon.offhand with minecraft:shield');
        await con('give JoinTestBot tconstruct:pickaxe');
        await con('give JoinTestBot create:cogwheel 32');

        // Resize before capturing: the GUI is laid out in scaled units, so a
        // bigger window is genuinely more pixels per sprite, not an upscale.
        sh(`DISPLAY=${DISP} xdotool windowsize ${w2} ${process.env.SHOT_W || 1920} ${process.env.SHOT_H || 1080}`);
        await new Promise((r) => setTimeout(r, 8000));

        key('Escape'); await snap('ui-0-hud', 3000);      // clean HUD + hotbar
        key('e');      await snap('ui-1-inventory', 3000); // slot overlays live here
        key('Escape');

        // Grant the whole guide so every node renders with its real icon and
        // title. Ungranted children draw greyed out and half of them are not
        // visible at all, which would make the capture prove very little.
        for (const tab of ['start', 'tinkers', 'create', 'carry', 'time', 'explore']) {
          await con(`advancement grant JoinTestBot from tcguide:${tab}/root`, 1200);
        }
        // Advancement Plaques queues a popup per grant; capturing during that
        // gets a screenful of toast instead of the tree.
        await new Promise((r) => setTimeout(r, Number(process.env.TOAST_WAIT || 60000)));
        key('l'); await snap('ui-2-advancements', 4000);
      }

      // ---- interactive hold ---------------------------------------------
      // Keeps the client, server and world alive so the UI can be driven by
      // hand from another shell. Coordinates for things like the advancement
      // tab strip depend on the mod's own layout; guessing them blind costs a
      // full 15-minute reinstall per attempt, whereas this costs one run.
      //   echo 'say hi' >> <dir>/console.in     -> runs on the server
      //   DISPLAY=:0 xdotool key --window <wid> l
      const holdFor = Number(process.env.HOLD || 0);
      if (holdFor > 0) {
        const inbox = path.join(dir, 'console.in');
        fs.writeFileSync(inbox, '');
        fs.writeFileSync(path.join(dir, 'HOLD'),
          `wid=${w2}\ndisplay=${DISP}\nshots=${shots}\nconsole=${inbox}\n`);
        console.log(`\nHOLD ${holdFor}s — window ${w2} on ${DISP}`);
        console.log(`  server console: echo 'CMD' >> ${inbox}`);
        console.log(`  shots dir:      ${shots}`);
        let sent = 0;
        const until = Date.now() + holdFor * 1000;
        while (Date.now() < until && client.exitCode === null) {
          const lines = fs.readFileSync(inbox, 'utf8').split('\n').filter((l) => l.trim());
          while (sent < lines.length) {
            try { server.stdin.write(lines[sent] + '\n'); } catch {}
            sent++;
          }
          await new Promise((r) => setTimeout(r, 1000));
        }
      }

      // ---- XP probe -----------------------------------------------------
      // Driven from the SERVER CONSOLE, not the client UI: console commands run
      // as an op with no menu state to get wrong, and every reply lands in sLog
      // where it can be asserted on. This proves the levelling FEATURE works,
      // not merely that the mod class-loaded.
      // Datapack probe: `datapack list` plus granting a known id is the only
      // definitive check -- Minecraft logs an advancement COUNT, never the
      // namespaces, so absence from the log proves nothing either way.
      if (process.env.DATAPACK_TEST) {
        const mark = sLog.length;
        const con = async (cmd) => {
          try { server.stdin.write(cmd + '\n'); } catch {}
          await new Promise((r) => setTimeout(r, 3000));
        };
        await con('datapack list');
        await con('advancement grant @a only tcguide:start/root');
        const out = sLog.slice(mark).join('');
        fs.writeFileSync(path.join(shots, 'datapack-probe.log'), out);
        const listed = /tinker_create_guide|tcguide/i.test(out);
        const unknown = /Unknown advancement|No advancement was found/i.test(out);
        const granted = /Granted the advancement|criteri/i.test(out);
        console.log(`DATAPACK PROBE: listed=${listed ? 'YES' : 'no'} grant=${unknown ? 'UNKNOWN-ID' : (granted ? 'OK' : '?')}`);
      }

      if (process.env.XP_TEST && !SP) {
        const mark = sLog.length;
        const con = async (cmd) => {
          try { server.stdin.write(cmd + '\n'); } catch {}
          await new Promise((r) => setTimeout(r, 3000));
        };
        // A bare `give` pickaxe is modifiable but carries no modifiers, and the
        // addon's xp command only acts on tools that already have `improvable`
        // -- normally applied at a Tinker Station with a nether star. Apply it
        // directly instead so the XP path itself is what gets exercised.
        await con('gamemode creative JoinTestBot');
        await con('item replace entity JoinTestBot weapon.mainhand with tconstruct:pickaxe');
        // Build the stack with `improvable` already on it. Note tic_UPGRADES,
        // not tic_modifiers: the latter is derived (material traits recompute
        // into it), so a modifier written there is silently discarded.
        const TOOL = 'tconstruct:pickaxe[minecraft:custom_data={'
          + 'tic_materials:["tconstruct:bone","tconstruct:flint","tconstruct:chorus"],'
          + 'tic_upgrades:[{level:1,name:"tinkerslevellingaddon:improvable"}],'
          + 'tic_volatile_data:{abilities:1,upgrades:3}}]';
        await con(`item replace entity JoinTestBot weapon.mainhand with ${TOOL}`);
        await con('tinkerslevellingaddon xp JoinTestBot add 5000');
        await con('tinkerslevellingaddon levels JoinTestBot add 1');
        // Objective proof the level actually persisted onto the itemstack.
        await con('data get entity JoinTestBot SelectedItem');
        sh(`DISPLAY=${DISP} import -window ${w2} ${path.join(shots, 'x1-after-xp.png')}`);

        const out = sLog.slice(mark).join('');
        fs.writeFileSync(path.join(shots, 'xp-console.log'), out);
        // Assert on the addon's own success strings, not on absence of errors.
        const gotXp     = /Added 5000 XP to/.test(out);
        const gotLevel  = /Added 1 levels? to/.test(out);
        // Read the level straight out of the itemstack the server dumped: the
        // command's own success text could in principle lie, the stored data cannot.
        const lvl = out.match(/"tinkerslevellingaddon:level":\s*(\d+)/);
        const persisted = !!lvl && Number(lvl[1]) > 1;
        xpVerdict = { ok: gotXp && gotLevel && persisted, gotXp, gotLevel, persisted,
                      level: lvl ? Number(lvl[1]) : null };
        console.log(`XP PROBE: xp=${gotXp ? 'OK' : 'FAIL'} level=${gotLevel ? 'OK' : 'FAIL'} `
                  + `persisted=${persisted ? `OK (level ${lvl[1]})` : 'no'}`);
      }
    }
  }

  try { client.kill('SIGKILL'); } catch {}
  try { server.stdin.write('stop\n'); } catch {}
  setTimeout(() => server.kill('SIGKILL'), 10000).unref();

  try { const w = sh(`DISPLAY=${DISP} xdotool search --name Minecraft | head -1`);
    if (w) sh(`DISPLAY=${DISP} import -window ${w} ${path.join(shots, '9-final.png')}`); } catch {}
  fs.writeFileSync(path.join(dir, 'client.log'), cLog.join(''));
  fs.writeFileSync(path.join(dir, 'server.log'), sLog.join(''));

  console.log('\n' + '='.repeat(62));
  if (failures.length) {
    console.log(`JOIN TEST FAILED — ${failures.length} line(s):\n`);
    for (const f of failures.slice(0, 8)) console.log('  ' + f.slice(0, 200));
  } else if (joined) {
    console.log('JOIN TEST PASSED — client connected and loaded the world.');
  } else {
    console.log('JOIN TEST INCONCLUSIVE — client never reached the world.');
    const tail = cLog.join('').split('\n').filter((l) => /ERROR|Exception|GLFW|OpenGL|FATAL/i.test(l)).slice(-6);
    if (tail.length) console.log('\nLast relevant lines:\n  ' + tail.join('\n  ').slice(0, 900));
    process.exitCode = 2;
  }
  console.log(`\nLogs: ${dir}`);
})();
