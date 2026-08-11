#!/usr/bin/env node
/**
 * Validate a built .mrpack: manifest shape, then confirm every download URL is
 * actually live. A manifest that parses but 404s halfway through installation
 * is the failure mode worth catching before upload.
 *
 *   node tools/verify.js [path/to/pack.mrpack]
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const DATA = JSON.parse(fs.readFileSync(path.join(__dirname, 'mods.json'), 'utf8'));

const packPath =
  process.argv[2] ||
  path.join(ROOT, 'packs', `tinker-and-create-${DATA.pack.version}.mrpack`);

if (!fs.existsSync(packPath)) {
  console.error(`No pack at ${packPath} — run: node tools/build.js`);
  process.exit(1);
}

const manifest = JSON.parse(
  execSync(`unzip -p "${packPath}" modrinth.index.json`, { encoding: 'utf8', maxBuffer: 1 << 26 })
);

const errors = [];
const warnings = [];

// --- Manifest shape --------------------------------------------------------
if (manifest.formatVersion !== 1) errors.push(`formatVersion is ${manifest.formatVersion}, expected 1`);
if (manifest.game !== 'minecraft') errors.push(`game is "${manifest.game}"`);
if (!manifest.name) errors.push('missing pack name');
if (!manifest.dependencies?.minecraft) errors.push('missing minecraft dependency');
if (!manifest.dependencies?.neoforge && !manifest.dependencies?.forge)
  errors.push('missing neoforge/forge dependency');

const VALID_ENV = new Set(['required', 'optional', 'unsupported']);
const seenPaths = new Set();

for (const f of manifest.files) {
  const where = f.path || '(no path)';
  if (!f.path?.startsWith('mods/')) errors.push(`${where}: path must live under mods/`);
  if (seenPaths.has(f.path)) errors.push(`${where}: duplicate file path`);
  seenPaths.add(f.path);

  if (!f.hashes?.sha1) errors.push(`${where}: missing sha1`);
  if (!f.hashes?.sha512) errors.push(`${where}: missing sha512`);
  if (!Array.isArray(f.downloads) || f.downloads.length === 0) errors.push(`${where}: no download URL`);
  if (!(f.fileSize > 0)) errors.push(`${where}: fileSize not positive`);

  if (!VALID_ENV.has(f.env?.client)) errors.push(`${where}: bad env.client "${f.env?.client}"`);
  if (!VALID_ENV.has(f.env?.server)) errors.push(`${where}: bad env.server "${f.env?.server}"`);
  if (f.env?.client === 'unsupported' && f.env?.server === 'unsupported') {
    errors.push(`${where}: unsupported on both sides — would never install`);
  }

  for (const url of f.downloads || []) {
    // Modrinth's whitelist for .mrpack downloads is broader than its own CDN:
    // cdn.modrinth.com, github.com, raw.githubusercontent.com and gitlab.com
    // are all accepted at upload. Insisting on the CDN alone rejected every
    // pack this project has ever built -- Tinkers' Construct, Mantle and the
    // Levelling Addon have no Modrinth release for 1.21.1 and are served from
    // this repository's own GitHub releases by design. It went unnoticed
    // because publish.yml verifies inline and never called this tool; the
    // first pull request to run it failed on all three.
    //
    // Note what is absent: CurseForge. A pack referencing it is rejected at
    // upload, which is the failure this check exists to catch early.
    if (!/^https:\/\/(cdn\.modrinth\.com|github\.com|raw\.githubusercontent\.com|gitlab\.com)\//.test(url)) {
      errors.push(`${where}: download host not on Modrinth's whitelist (${url})`);
    }
  }
}

// Two jars of the same mod at different versions is a classic pack breaker.
// Strip a trailing version token only — a dotted number run after a separator.
// Matching bare digits would fold "supermartijn642corelib" and
// "supermartijn642configlib" into one stem.
const stem = (p) =>
  path.basename(p)
    .replace(/\.jar$/i, '')
    .replace(/[-_+]v?\d+(\.\d+)+.*$/i, '')
    .toLowerCase();
const byStem = new Map();
for (const f of manifest.files) {
  const k = stem(f.path);
  if (!byStem.has(k)) byStem.set(k, []);
  byStem.get(k).push(path.basename(f.path));
}
for (const [k, list] of byStem) {
  if (list.length > 1) warnings.push(`possible duplicate mod "${k}": ${list.join(', ')}`);
}

// --- Live URL check --------------------------------------------------------
async function head(url) {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(url, {
        method: 'HEAD',
        headers: { 'User-Agent': 'tinker-and-create/1.0.3 (pack verification)' },
      });
      if (res.ok) return { ok: true, size: Number(res.headers.get('content-length')) || null };
      if (res.status >= 500) { await new Promise((r) => setTimeout(r, 500 * 2 ** attempt)); continue; }
      return { ok: false, status: res.status };
    } catch (err) {
      await new Promise((r) => setTimeout(r, 500 * 2 ** attempt));
    }
  }
  return { ok: false, status: 'network error' };
}

(async () => {
  const _d = Number(process.env.START_DELAY_MS) || 0;
  if (_d) await new Promise((r) => setTimeout(r, _d));
  console.log(`\nVerifying ${path.basename(packPath)} — ${manifest.files.length} files\n`);

  let cursor = 0;
  let live = 0;
  const NET = Number(process.env.NET_CONCURRENCY) || 8;
  const workers = Array.from({ length: NET }, async () => {
    while (cursor < manifest.files.length) {
      const f = manifest.files[cursor++];
      let res = await head(f.downloads[0]);
      if (!res.ok) {
        // Transient CDN drops are common under load and hit different files each
        // run; only a miss that survives a quiet serial retry is a real failure.
        await new Promise((r) => setTimeout(r, 1500));
        res = await head(f.downloads[0]);
      }
      if (!res.ok) {
        errors.push(`${f.path}: download unreachable (${res.status})`);
        process.stdout.write('x');
      } else {
        live++;
        if (res.size && res.size !== f.fileSize) {
          warnings.push(`${f.path}: fileSize ${f.fileSize} but server reports ${res.size}`);
        }
        process.stdout.write('.');
      }
    }
  });
  await Promise.all(workers);
  process.stdout.write('\n\n');

  const clientOnly = manifest.files.filter((f) => f.env.server === 'unsupported').length;
  const serverOnly = manifest.files.filter((f) => f.env.client === 'unsupported').length;

  console.log(`Files:        ${manifest.files.length}`);
  console.log(`Downloads OK: ${live}/${manifest.files.length}`);
  console.log(`Server-side:  ${manifest.files.length - clientOnly}`);
  console.log(`Client-only:  ${clientOnly}   Server-only: ${serverOnly}`);
  const ldr = manifest.dependencies.neoforge ? 'neoforge' : 'forge';
  console.log(`Loader:       ${ldr} ${manifest.dependencies[ldr]} on MC ${manifest.dependencies.minecraft}`);

  if (warnings.length) {
    console.log(`\nWarnings (${warnings.length}):`);
    for (const w of warnings) console.log(`  ! ${w}`);
  }

  if (errors.length) {
    console.log(`\nERRORS (${errors.length}):`);
    for (const e of errors) console.log(`  ✗ ${e}`);
    process.exit(1);
  }

  console.log('\nPASS — manifest valid, every download reachable.');
})();
