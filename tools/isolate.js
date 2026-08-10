#!/usr/bin/env node
/**
 * Boot one mod in isolation, with only Create and its own required dependencies.
 *
 * Full-pack bisection is expensive: every failure costs a ~6 minute boot plus a
 * rebuild, and a pack this size can hide several independent faults behind the
 * first one. Isolating answers a sharper question — "is this mod broken, or is
 * it broken *here*?" — in about two minutes.
 *
 *   node tools/isolate.js create-radars
 *   node tools/isolate.js --jar /path/a.jar --jar /path/b.jar   # local builds
 *   node tools/isolate.js create-radars
 *   node tools/isolate.js --jar /path/a.jar --jar /path/b.jar   # local builds create-big-cannons   # with extras
 *   node tools/isolate.js --all-rejected                     # sweep the reject list
 *
 * A pass means the mod is fine alone and the pack failure was an interaction.
 * A fail means the mod is broken regardless of what else is installed.
 */

const fs = require('fs');
const os = require('os');
const path = require('path');
const { execSync, spawn } = require('child_process');
const { fetchCached, download } = require('./cache');

const ROOT = path.resolve(__dirname, '..');
const DATA = JSON.parse(fs.readFileSync(path.join(__dirname, 'mods.json'), 'utf8'));
const { pack } = DATA;
const UA = 'tinker-and-create/isolate';
const JAVA =
  [process.env.JAVA_BIN, path.join(os.homedir(), '.sdkman/candidates/java/current/bin/java')]
    .filter(Boolean).find(fs.existsSync) || 'java';

const FATAL = [
  /Missing or unsupported mandatory dependencies/,
  /Mixin apply for mod .* failed/, /Critical injection failure/, /InjectionError/,
  /Incompatibilities between mods/, /ModLoadingException|LoadingFailedException/,
  /Failed to start the minecraft server/,
];

async function api(p) {
  const r = await fetch('https://api.modrinth.com/v2' + p, { headers: { 'User-Agent': UA } });
  if (r.status === 404) return null;
  if (!r.ok) throw new Error(`HTTP ${r.status} ${p}`);
  return r.json();
}

async function pickVersion(idOrSlug) {
  const loaders = encodeURIComponent(JSON.stringify(pack.loaders || [pack.loader]));
  const games = encodeURIComponent(JSON.stringify([pack.minecraft]));
  const v = await api(`/project/${encodeURIComponent(idOrSlug)}/version?loaders=${loaders}&game_versions=${games}`);
  if (!v || !v.length) return null;
  v.sort((a, b) => new Date(b.date_published) - new Date(a.date_published));
  return v.find((x) => x.version_type === 'release') || v[0];
}

/** Resolve a mod plus everything it hard-requires, transitively. */
async function closure(slugs) {
  const out = new Map();
  const queue = [...slugs];
  while (queue.length) {
    const s = queue.shift();
    if (out.has(s)) continue;
    const ver = await pickVersion(s);
    if (!ver) { out.set(s, null); continue; }
    out.set(s, ver);
    for (const d of ver.dependencies || []) {
      if (d.dependency_type !== 'required' || !d.project_id) continue;
      if (!out.has(d.project_id)) queue.push(d.project_id);
    }
  }
  return out;
}

async function isolate(target, extras = [], localJars = []) {
  // Create is the substrate almost every addon needs; include it unconditionally.
  const roots = target === '--local' ? ['create', ...extras] : ['create', target, ...extras];
  const resolved = await closure(roots);

  const missing = [...resolved].filter(([, v]) => !v).map(([s]) => s);
  const jars = [...resolved.values()].filter(Boolean);

  // If the mod under test did not resolve, booting Create alone proves nothing.
  if (target !== '--local' && !resolved.get(target)) {
    return { target, ok: false, unavailable: true, jars: 0, missing,
             why: `no ${pack.loader} ${pack.minecraft} build` };
  }

  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'tc-iso-'));
  fs.mkdirSync(path.join(dir, 'mods'), { recursive: true });

  const nf = pack.loaderVersion;
  await fetchCached(
    `https://maven.neoforged.net/releases/net/neoforged/neoforge/${nf}/neoforge-${nf}-installer.jar`,
    path.join(dir, 'installer.jar'), `installer-${nf}`);

  const vm = JSON.parse((await download('https://launchermeta.mojang.com/mc/game/version_manifest_v2.json')).toString());
  const vanilla = JSON.parse((await download(vm.versions.find((v) => v.id === pack.minecraft).url)).toString());
  if (vanilla.downloads?.server) {
    await fetchCached(vanilla.downloads.server.url,
      path.join(dir, 'libraries', 'net', 'minecraft', 'server', pack.minecraft, `server-${pack.minecraft}.jar`),
      vanilla.downloads.server.sha1);
  }

  try {
    execSync(`"${JAVA}" -jar installer.jar --installServer`, { cwd: dir, stdio: 'ignore', maxBuffer: 1 << 26 });
  } catch {
    console.error('  installer failed'); fs.rmSync(dir, { recursive: true, force: true });
    return { target, ok: false, why: 'installer failed' };
  }

  for (const v of jars) {
    const f = v.files.find((x) => x.primary) || v.files[0];
    if (!f) continue;
    if (f.env === 'client') continue;
    await fetchCached(f.url, path.join(dir, 'mods', f.filename), f.hashes?.sha1);
  }
  // Locally built jars (e.g. a Tinkers port) are not on Modrinth, so copy them in.
  for (const lj of localJars) fs.copyFileSync(lj, path.join(dir, 'mods', path.basename(lj)));

  fs.writeFileSync(path.join(dir, 'eula.txt'), 'eula=true\n');
  fs.writeFileSync(path.join(dir, 'server.properties'),
    ['online-mode=false', 'level-type=minecraft:flat', 'max-players=1',
     'view-distance=4', 'simulation-distance=4'].join('\n') + '\n');

  const args = path.join(dir, 'libraries', 'net', 'neoforged', 'neoforge', nf, 'unix_args.txt');
  const proc = spawn(JAVA, ['-Xmx3G', `@${args}`, 'nogui'], { cwd: dir });

  let ready = false; const fails = []; let buf = '';
  const scan = (c) => {
    buf += c.toString();
    const lines = buf.split('\n'); buf = lines.pop();
    for (const l of lines) {
      if (/Done \([\d.]+s\)!/.test(l)) ready = true;
      if (FATAL.some((p) => p.test(l))) fails.push(l.replace(/\x1b\[[0-9;]*m/g, '').trim());
    }
  };
  proc.stdout.on('data', scan); proc.stderr.on('data', scan);

  const t0 = Date.now();
  while (!ready && !fails.length && Date.now() - t0 < 420000) {
    if (proc.exitCode !== null) break;
    await new Promise((r) => setTimeout(r, 1000));
  }
  try { proc.stdin.write('stop\n'); } catch {}
  setTimeout(() => proc.kill('SIGKILL'), 8000).unref();
  await new Promise((r) => setTimeout(r, 3000));

  const result = { target, ok: ready && !fails.length, jars: jars.length, missing,
                   why: fails[0] ? fails[0].slice(0, 170) : (ready ? '' : 'never reached Done') };
  if (result.ok) fs.rmSync(dir, { recursive: true, force: true });
  else result.dir = dir;
  return result;
}

(async () => {
  const argv = process.argv.slice(2);
  const localJars = [];
  for (let i = 0; i < argv.length; i++) if (argv[i] === '--jar') localJars.push(argv[++i]);
  if (localJars.length) {
    console.log(`\nIsolating ${localJars.length} local jar(s) with Create on ${pack.loader} ${pack.loaderVersion}\n`);
    for (const j of localJars) console.log('  + ' + path.basename(j));
    const r = await isolate('--local', argv.filter((a, i) => !a.startsWith('--') && argv[i-1] !== '--jar'), localJars);
    console.log('\n' + (r.ok ? 'PASS — server booted with these jars.' : 'FAIL — ' + r.why));
    if (!r.ok && r.dir) console.log('Log: ' + r.dir);
    process.exit(r.ok ? 0 : 1);
  }
  let targets;
  if (argv.includes('--all-rejected')) {
    // Only things plausibly revivable: skip taste calls and known-absent mods.
    // Reject history spans the current config AND the archived 1.20.1 lines —
    // most of what we ever rejected is recorded there, not here.
    const ARCHIVE = '/home/ryanc/dev/archive/tinker-and-create-fabric-1.20.1/tools/mods.json';
    const seen = new Set(); targets = [];
    for (const src of [DATA, (() => { try { return JSON.parse(fs.readFileSync(ARCHIVE, 'utf8')); } catch { return null; } })()]) {
      if (!src) continue;
      for (const list of [src.removed || [], src.banned || []])
        for (const r of list) if (r.slug && !seen.has(r.slug)) { seen.add(r.slug); targets.push(r.slug); }
    }
    const shipped = new Set(DATA.mods.map((m) => m.slug));
    targets = targets.filter((s) => !shipped.has(s) &&
      // taste calls and things deliberately excluded — not "broken", so nothing to test
      !/waystones|better-combat|chipped|createaddition|new-age|diesel|tfmg|power-grid|nuclear|cannon|aeronaut|hypertube|teleport|propulsion|radar|krypton|iceberg|item-borders|jer|ledger|tree-harvester|gravestone|carrier|embeddium|radium|dynamic-lights|corail/.test(s));
  } else targets = argv.filter((a) => !a.startsWith('--')).slice(0, 1);

  const extras = argv.filter((a) => !a.startsWith('--')).slice(1);
  if (!targets.length) { console.error('usage: isolate.js <slug> [extra…] | --all-rejected'); process.exit(1); }

  console.log(`\nIsolating ${targets.length} mod(s) on ${pack.loader} ${pack.loaderVersion} / MC ${pack.minecraft}\n`);
  const results = [];
  for (const t of targets) {
    process.stdout.write(`  ${t.padEnd(34)}`);
    let r;
    try { r = await isolate(t, extras); }
    catch (e) { r = { target: t, ok: false, why: e.message.slice(0, 120) }; }
    results.push(r);
    console.log(r.unavailable ? `SKIP  ${r.why}` : r.ok ? `PASS  (${r.jars} jars)` : `FAIL  ${r.why}`);
    if (r.missing?.length) console.log(`      unresolvable: ${r.missing.join(', ')}`);
  }

  const pass = results.filter((r) => r.ok);
  const skip = results.filter((r) => r.unavailable);
  const fail = results.filter((r) => !r.ok && !r.unavailable);
  console.log(`\n${pass.length} pass · ${fail.length} fail · ${skip.length} unavailable`);
  if (pass.length) console.log('Passing mods are candidates to re-add — their pack failure was an interaction, not the mod.');
})();
