#!/usr/bin/env node
/**
 * Boot the pack on a throwaway NeoForge server and fail on any load error.
 *
 * NeoForge 1.20.1 still ships under the legacy net.neoforged:forge coordinates
 * (it forked from Forge 47), and the installer generates a JVM arg file rather
 * than a runnable jar — so this differs from the Fabric harness in setup, not
 * in intent.
 *
 *   node tools/smoketest.js [path/to/pack.mrpack]
 */

const fs = require('fs');
const os = require('os');
const path = require('path');
const { execSync, spawn } = require('child_process');
const { fetchCached, download, stats } = require('./cache');

const ROOT = path.resolve(__dirname, '..');
const DATA = JSON.parse(fs.readFileSync(path.join(__dirname, 'mods.json'), 'utf8'));
const UA = 'tinker-and-create-neoforge/smoketest';

// MC 1.21+ needs Java 21; 1.20.1 runs on either. Prefer SDKMAN's current JDK.
const JAVA =
  [process.env.JAVA_BIN,
   path.join(os.homedir(), '.sdkman/candidates/java/current/bin/java'),
   '/usr/lib/jvm/openlogic-openjdk-17-hotspot-amd64/bin/java',
   '/usr/lib/jvm/java-17-openjdk-amd64/bin/java'].filter(Boolean).find(fs.existsSync) || 'java';

const packPath =
  process.argv[2] || path.join(ROOT, 'packs', `tinker-and-create-${DATA.pack.version}.mrpack`);

const FATAL = [
  /Mixin apply for mod .* failed/,
  /Critical injection failure/,
  /InjectionError/,
  /Incompatible mods found/,
  /Missing or unsupported mandatory dependencies/,
  /Failed to load mod/,
  /---- Minecraft Crash Report ----/,
  /Failed to start the minecraft server/,
  /ModLoadingException|LoadingFailedException/,
];
const READY = /Done \([\d.]+s\)!|For help, type "help"/;


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
  sweepStale('tc-nf-smoke-');
  const _d = Number(process.env.START_DELAY_MS) || 0;
  if (_d) await new Promise((r) => setTimeout(r, _d));
  if (!fs.existsSync(packPath)) { console.error(`No pack at ${packPath}`); process.exit(1); }

  const manifest = JSON.parse(
    execSync(`unzip -p "${packPath}" modrinth.index.json`, { encoding: 'utf8', maxBuffer: 1 << 26 })
  );
  const serverMods = manifest.files.filter((f) => f.env?.server !== 'unsupported');
  const nfVersion = manifest.dependencies.neoforge || manifest.dependencies.forge;

  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'tc-nf-smoke-'));
  fs.mkdirSync(path.join(dir, 'mods'), { recursive: true });
  console.log(`Workspace: ${dir}`);
  console.log(`${manifest.dependencies.neoforge ? 'NeoForge' : 'Forge'} ${nfVersion} on MC ${manifest.dependencies.minecraft}`);
  console.log(`Server-side mods: ${serverMods.length} of ${manifest.files.length}\n`);

  // --- installer -----------------------------------------------------------
  const mc = manifest.dependencies.minecraft;
  const coord = `${mc}-${nfVersion}`;
  // NeoForge 1.20.1 and Forge 1.20.1 live in different mavens under different groups.
  const isNeo = !!manifest.dependencies.neoforge;
  // NeoForge 1.20.1 kept the legacy net.neoforged:forge:<mc>-<ver> coords; from 1.20.2
  // on it moved to net.neoforged:neoforge:<ver> with no MC version in the path.
  const modernNeo = isNeo && !nfVersion.startsWith('47.');
  const url = modernNeo
    ? `https://maven.neoforged.net/releases/net/neoforged/neoforge/${nfVersion}/neoforge-${nfVersion}-installer.jar`
    : isNeo
      ? `https://maven.neoforged.net/releases/net/neoforged/forge/${coord}/forge-${coord}-installer.jar`
      : `https://maven.minecraftforge.net/net/minecraftforge/forge/${coord}/forge-${coord}-installer.jar`;
  console.log('Downloading NeoForge installer...');
  await fetchCached(url, path.join(dir, 'installer.jar'), `installer-${nfVersion}`);

  console.log('Running --installServer (downloads vanilla + patches)...');
  try {
    execSync(`"${JAVA}" -jar installer.jar --installServer`, {
      cwd: dir, stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 1 << 26,
    });
  } catch (err) {
    console.error('Installer failed:\n' + (err.stdout || '').toString().slice(-1500));
    process.exit(1);
  }

  // --- mods ----------------------------------------------------------------
  process.stdout.write('Downloading mods ');
  let cursor = 0;
  await Promise.all(Array.from({ length: 8 }, async () => {
    while (cursor < serverMods.length) {
      const f = serverMods[cursor++];
      await fetchCached(f.downloads[0], path.join(dir, 'mods', path.basename(f.path)), f.hashes?.sha1);
      process.stdout.write('.');
    }
  }));
  const ov = installOverrides(packPath, path.join(dir, 'mods'));
  if (ov) console.log(`\n  installed ${ov} jar(s) from overrides/mods/`);
  process.stdout.write('  ' + stats() + '\n\n');

  fs.writeFileSync(path.join(dir, 'eula.txt'), 'eula=true\n');
  fs.writeFileSync(path.join(dir, 'server.properties'),
    ['online-mode=false', 'level-type=minecraft:flat', 'spawn-protection=0',
     'max-players=1', 'view-distance=4', 'simulation-distance=4'].join('\n') + '\n');

  // The installer writes JVM/classpath args here instead of a runnable jar.
  const argsFile = modernNeo
    ? path.join(dir, 'libraries', 'net', 'neoforged', 'neoforge', nfVersion, 'unix_args.txt')
    : path.join(dir, 'libraries', 'net', isNeo ? 'neoforged' : 'minecraftforge', 'forge', coord, 'unix_args.txt');
  if (!fs.existsSync(argsFile)) {
    console.error('Expected arg file missing: ' + argsFile);
    console.error('Contents: ' + fs.readdirSync(dir).join(', '));
    process.exit(1);
  }

  console.log('Booting server (this takes a few minutes)...\n');
  const proc = spawn(JAVA, ['-Xmx4G', '-Xms1G', `@${argsFile}`, 'nogui'], { cwd: dir });

  const failures = [];
  let ready = false, buffer = '';
  const scan = (chunk) => {
    buffer += chunk.toString();
    const lines = buffer.split('\n');
    buffer = lines.pop();
    for (const line of lines) {
      if (READY.test(line)) ready = true;
      if (FATAL.some((p) => p.test(line))) failures.push(line.trim());
    }
  };
  proc.stdout.on('data', scan);
  proc.stderr.on('data', scan);

  const finished = await new Promise((resolve) => {
    const timer = setTimeout(() => resolve('timeout'), 12 * 60 * 1000);
    const poll = setInterval(() => {
      if (ready || failures.length) { clearInterval(poll); clearTimeout(timer); resolve(ready ? 'ready' : 'failed'); }
    }, 1000);
    proc.on('exit', (code) => { clearInterval(poll); clearTimeout(timer); resolve(code === 0 ? 'exited-clean' : 'exited-error'); });
  });

  try { proc.stdin.write('stop\n'); } catch {}
  setTimeout(() => proc.kill('SIGKILL'), 15000).unref();

  console.log('\n' + '='.repeat(60));
  if (failures.length) {
    console.log(`SMOKE TEST FAILED — ${failures.length} fatal line(s):\n`);
    for (const f of failures.slice(0, 12)) console.log('  ' + f.slice(0, 220));
    console.log(`\nLog kept at: ${dir}`);
    process.exitCode = 1;
    return;
  }
  if (finished === 'ready') {
    console.log('SMOKE TEST PASSED — server reached "Done", all mods loaded.');
    await new Promise((r) => { if (proc.exitCode !== null) return r(); proc.on('exit', r); setTimeout(r, 20000); });
    for (let i = 0; i < 5; i++) {
      try { fs.rmSync(dir, { recursive: true, force: true }); break; }
      catch { await new Promise((r) => setTimeout(r, 1000)); }
    }
    return;
  }
  console.log(`SMOKE TEST INCONCLUSIVE (${finished}). Log kept at: ${dir}`);
  process.exitCode = 2;
})();
