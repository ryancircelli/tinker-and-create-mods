#!/usr/bin/env node
/**
 * Install a PERSISTENT NeoForge server from the .mrpack, for actually playing on.
 *
 * This is the sibling of smoketest.js: same install path (same manifest, same
 * cache, same installer, same overrides), but into a fixed directory that keeps
 * its world between restarts instead of a temp dir that is swept afterwards.
 *
 *   node tools/server.js [path/to/pack.mrpack] [--dir <path>] [--op <name>]
 *
 * It only installs. Starting is ./server/run.sh, so a crashed or stopped server
 * can be restarted without re-downloading 185 mods.
 */

const fs = require('fs');
const os = require('os');
const path = require('path');
const { execSync } = require('child_process');
const { fetchCached, stats } = require('./cache');

const ROOT = path.resolve(__dirname, '..');
const DATA = JSON.parse(fs.readFileSync(path.join(__dirname, 'mods.json'), 'utf8'));

const JAVA =
  [process.env.JAVA_BIN,
   path.join(os.homedir(), '.sdkman/candidates/java/current/bin/java'),
   '/usr/lib/jvm/java-21-openjdk-amd64/bin/java'].filter(Boolean).find(fs.existsSync) || 'java';

const argv = process.argv.slice(2);
const flag = (name, dflt) => {
  const i = argv.indexOf(name);
  return i >= 0 ? argv[i + 1] : dflt;
};
const packPath = argv.find((a) => a.endsWith('.mrpack'))
  || path.join(ROOT, 'packs', `tinker-and-create-${DATA.pack.version}.mrpack`);
const dir = path.resolve(flag('--dir', path.join(ROOT, 'server')));
const opName = flag('--op', null);

// Copy overrides/mods/* out of the pack. Overrides are not in files[], so they
// have no download URL -- they ship inside the zip and must be unpacked.
function installOverrides(pack, destMods) {
  const names = execSync(`unzip -Z1 "${pack}" 'overrides/mods/*.jar'`, { encoding: 'utf8' })
    .split('\n').map((s) => s.trim()).filter(Boolean);
  for (const n of names) {
    const out = path.join(destMods, path.basename(n));
    fs.writeFileSync(out, execSync(`unzip -p "${pack}" "${n}"`, { maxBuffer: 1 << 28 }));
  }
  return names.length;
}

(async () => {
  if (!fs.existsSync(packPath)) { console.error(`No pack at ${packPath}`); process.exit(1); }

  const manifest = JSON.parse(
    execSync(`unzip -p "${packPath}" modrinth.index.json`, { encoding: 'utf8', maxBuffer: 1 << 26 })
  );
  const mc = manifest.dependencies.minecraft;
  const nfVersion = manifest.dependencies.neoforge;
  const serverMods = manifest.files.filter((f) => f.env?.server !== 'unsupported');

  console.log(`NeoForge ${nfVersion} on MC ${mc}`);
  console.log(`Server dir: ${dir}`);
  console.log(`Server-side mods: ${serverMods.length} of ${manifest.files.length}\n`);

  const modsDir = path.join(dir, 'mods');
  // Wipe only mods/, never the world: re-running this must be safe on a live install.
  fs.rmSync(modsDir, { recursive: true, force: true });
  fs.mkdirSync(modsDir, { recursive: true });

  if (!fs.existsSync(path.join(dir, 'libraries'))) {
    const url = `https://maven.neoforged.net/releases/net/neoforged/neoforge/${nfVersion}/neoforge-${nfVersion}-installer.jar`;
    console.log('Downloading NeoForge installer...');
    await fetchCached(url, path.join(dir, 'installer.jar'), `installer-${nfVersion}`);
    console.log('Running --installServer (downloads vanilla + patches)...');
    execSync(`"${JAVA}" -jar installer.jar --installServer`, { cwd: dir, stdio: 'inherit' });
    fs.rmSync(path.join(dir, 'installer.jar'), { force: true });
  } else {
    console.log('NeoForge already installed — reusing (delete server/libraries to force).');
  }

  console.log(`\nDownloading ${serverMods.length} mods...`);
  let done = 0, cursor = 0;
  await Promise.all(Array.from({ length: 8 }, async () => {
    while (cursor < serverMods.length) {
      const f = serverMods[cursor++];
      await fetchCached(f.downloads[0], path.join(modsDir, path.basename(f.path)), f.hashes?.sha1);
      if (++done % 40 === 0) process.stdout.write(`  ${done}/${serverMods.length}\n`);
    }
  }));
  const ov = installOverrides(packPath, modsDir);
  console.log(`  ${done}/${serverMods.length} + ${ov} from overrides/`);
  console.log('  ' + stats());

  fs.writeFileSync(path.join(dir, 'eula.txt'), 'eula=true\n');

  // Written once. Editing it by hand must survive a re-install of the mods.
  const props = path.join(dir, 'server.properties');
  if (!fs.existsSync(props)) {
    fs.writeFileSync(props, [
      'motd=Tinker & Create',
      'online-mode=true',        // real accounts; the tunnel is public
      'server-port=25565',
      'max-players=8',
      'difficulty=normal',
      'view-distance=8',         // Create contraptions are chunk-hungry
      'simulation-distance=6',
      'spawn-protection=0',
      'allow-flight=true',       // elytra/jetpack mods trip vanilla's kick otherwise
      'enable-command-block=true',
    ].join('\n') + '\n');
    console.log('  wrote server.properties');
  } else {
    console.log('  kept existing server.properties');
  }

  if (opName) {
    // An online-mode server matches ops by UUID, not by name -- a name-only
    // entry is silently ignored, so resolve it against Mojang first.
    const r = await fetch(`https://api.mojang.com/users/profiles/minecraft/${opName}`);
    if (!r.ok) {
      console.error(`  could not resolve "${opName}" (HTTP ${r.status}) — not opped`);
    } else {
      const { id, name } = await r.json();
      const uuid = id.replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/, '$1-$2-$3-$4-$5');
      fs.writeFileSync(path.join(dir, 'ops.json'), JSON.stringify(
        [{ uuid, name, level: 4, bypassesPlayerLimit: true }], null, 2) + '\n');
      console.log(`  opped ${name} (${uuid})`);
    }
  }

  const argsFile = path.join('libraries', 'net', 'neoforged', 'neoforge', nfVersion, 'unix_args.txt');
  if (!fs.existsSync(path.join(dir, argsFile))) {
    console.error(`Expected arg file missing: ${argsFile}`); process.exit(1);
  }
  const run = path.join(dir, 'run.sh');
  fs.writeFileSync(run,
    `#!/usr/bin/env bash\n`
    + `# Start the server. Runs in the foreground; type "stop" to shut down cleanly.\n`
    + `cd "$(dirname "$0")"\n`
    + `exec "${JAVA}" -Xmx6G -Xms2G @${argsFile} nogui "$@"\n`);
  fs.chmodSync(run, 0o755);

  console.log(`\nInstalled. Start it with:\n  ${run}\n`);
})();
