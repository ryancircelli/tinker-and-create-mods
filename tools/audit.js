#!/usr/bin/env node
/**
 * Post-build audit. verify.js proves the pack is well-formed and downloadable;
 * this asks whether it will actually *run*:
 *
 *  - does any shipped mod declare a required dep that isn't in the pack?
 *  - does any pin a specific version_id we didn't ship?
 *  - do two jars provide the same Fabric mod id? (forks are the usual culprit)
 *
 *   node tools/audit.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { fetchCached, stats } = require('./cache');

const ROOT = path.resolve(__dirname, '..');
const DATA = JSON.parse(fs.readFileSync(path.join(__dirname, 'mods.json'), 'utf8'));
const CACHE = path.join(ROOT, '.cache');
const UA = 'tinker-and-create/1.0.3 (pack audit)';
const ALIASES = DATA.aliases || {};
const deref = (id) => ALIASES[id] || id;

const packPath = path.join(ROOT, 'packs', `tinker-and-create-${DATA.pack.version}.mrpack`);
const manifest = JSON.parse(
  execSync(`unzip -p "${packPath}" modrinth.index.json`, { encoding: 'utf8', maxBuffer: 1 << 26 })
);

async function api(endpoint, key) {
  const p = path.join(CACHE, key.replace(/[^a-z0-9._-]/gi, '_') + '.json');
  if (fs.existsSync(p)) return JSON.parse(fs.readFileSync(p, 'utf8'));
  const res = await fetch('https://api.modrinth.com/v2' + endpoint, { headers: { 'User-Agent': UA } });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`HTTP ${res.status} ${endpoint}`);
  const json = await res.json();
  fs.mkdirSync(CACHE, { recursive: true });
  fs.writeFileSync(p, JSON.stringify(json));
  return json;
}

/**
 * Minimal Fabric version-range check. Handles the forms that actually appear in
 * fabric.mod.json: "*", exact, and comma/space separated >=, >, <=, <, ~, ^.
 * Anything it cannot parse is treated as satisfied — this exists to catch hard
 * failures, not to be a complete semver implementation.
 */
function satisfies(have, range) {
  if (!range || range === '*') return true;

  const parts = (n) =>
    String(n).split('+')[0].split('-')[0].split('.').map((x) => parseInt(x, 10) || 0);

  const cmp = (a, b) => {
    const A = parts(a), B = parts(b);
    for (let i = 0; i < Math.max(A.length, B.length); i++) {
      const d = (A[i] || 0) - (B[i] || 0);
      if (d !== 0) return d > 0 ? 1 : -1;
    }
    return 0;
  };

  // Clauses may be comma- OR space-separated (">=6.0.8.1 <6.1.0"). Glue any
  // operator to its version first so splitting on whitespace is safe.
  const clauses = range
    .replace(/(>=|<=|>|<|\^|~|=)\s+/g, '$1')
    .split(/[\s,]+/)
    .filter(Boolean);

  for (const clause of clauses) {
    const m = clause.trim().match(/^(>=|<=|>|<|\^|~|=)?\s*(.+)$/);
    if (!m) continue;
    const [, op, want] = m;

    // Wildcard segments: "0.5.x" accepts any 0.5.*, "1.x" any 1.*.
    if (/[xX*]/.test(want)) {
      const W = String(want).split('+')[0].split('-')[0].split('.');
      const H = parts(have);
      const ok = W.every((seg, i) =>
        /^[xX*]$/.test(seg) ? true : (parseInt(seg, 10) || 0) === (H[i] || 0)
      );
      if (!ok) return false;
      continue;
    }

    const c = cmp(have, want);

    switch (op) {
      case '>=': if (c < 0) return false; break;
      case '>':  if (c <= 0) return false; break;
      case '<=': if (c > 0) return false; break;
      case '<':  if (c >= 0) return false; break;
      case '~': { // same major.minor
        const H = parts(have), W = parts(want);
        if (H[0] !== W[0] || H[1] !== W[1] || c < 0) return false;
        break;
      }
      case '^': { // same major
        if (parts(have)[0] !== parts(want)[0] || c < 0) return false;
        break;
      }
      default: // bare version means exact
        if (c !== 0) return false;
    }
  }
  return true;
}

(async () => {
  const _d = Number(process.env.START_DELAY_MS) || 0;
  if (_d) await new Promise((r) => setTimeout(r, _d));
  // Map every shipped jar back to the Modrinth version that produced it.
  const sha1s = manifest.files.map((f) => f.hashes.sha1);
  const shipped = new Map(); // project_id -> {version, file}

  for (let i = 0; i < sha1s.length; i += 50) {
    const batch = sha1s.slice(i, i + 50);
    const res = await fetch('https://api.modrinth.com/v2/version_files', {
      method: 'POST',
      headers: { 'User-Agent': UA, 'Content-Type': 'application/json' },
      body: JSON.stringify({ hashes: batch, algorithm: 'sha1' }),
    });
    const found = await res.json();
    for (const [sha, version] of Object.entries(found)) {
      shipped.set(version.project_id, {
        version,
        file: manifest.files.find((f) => f.hashes.sha1 === sha),
      });
    }
  }

  const titles = new Map();
  for (const id of shipped.keys()) {
    const p = await api(`/project/${id}`, `project-${id}`);
    titles.set(id, p ? p.title : id);
  }
  const nameOf = (id) => titles.get(id) || id;

  const problems = [];

  // --- Required dependencies that aren't in the pack ------------------------
  for (const [pid, { version }] of shipped) {
    for (const dep of version.dependencies || []) {
      if (dep.dependency_type !== 'required') continue;
      const target = deref(dep.project_id);
      if (!target) continue;

      if (!shipped.has(target)) {
        const p = await api(`/project/${target}`, `project-${target}`);
        problems.push({
          severity: 'BREAKING',
          what: `${nameOf(pid)} requires ${p ? p.title : target}, which is not in the pack`,
        });
        continue;
      }

      // A dep pinned to an exact version_id we didn't ship.
      if (dep.version_id && dep.version_id !== shipped.get(target).version.id) {
        problems.push({
          severity: 'CHECK',
          what: `${nameOf(pid)} pins a specific ${nameOf(target)} build; pack ships ` +
                `${shipped.get(target).version.version_number}`,
        });
      }
    }
  }

  // --- Jar-level check: real mod ids and real version ranges ---------------
  //
  // Modrinth metadata is not trustworthy here. Two independent failures it hid:
  //   - Create Fabric Sodium Fix is a *fork* of Create that reuses the mod id
  //     `create`, so the loader aborts on a duplicate mod.
  //   - Design n' Decor pins create=0.5.1-f in fabric.mod.json while Modrinth
  //     showed only a loose project-level dependency.
  // Only the jar's own fabric.mod.json shows either. Opt in with --deep.
  if (process.argv.includes('--deep')) {
    const jarDir = fs.mkdtempSync(path.join(require('os').tmpdir(), 'tc-jars-'));
    const modIds = new Map(); // fabric mod id -> [{file, version}]
    const declared = [];

    let cursor = 0;
    const workers = Array.from({ length: 6 }, async () => {
      while (cursor < manifest.files.length) {
        const f = manifest.files[cursor++];
        const dest = path.join(jarDir, path.basename(f.path));
        try {
          await fetchCached(f.downloads[0], dest, f.hashes?.sha1);
          const raw = execSync(`unzip -p "${dest}" fabric.mod.json`, {
            encoding: 'utf8', maxBuffer: 1 << 24, stdio: ['pipe', 'pipe', 'ignore'],
          });
          // Some mods ship fabric.mod.json with trailing commas.
          const meta = JSON.parse(raw.replace(/,(\s*[}\]])/g, '$1'));
          if (!modIds.has(meta.id)) modIds.set(meta.id, []);
          modIds.get(meta.id).push({ file: path.basename(f.path), version: meta.version });
          declared.push({ id: meta.id, file: path.basename(f.path), depends: meta.depends || {} });
        } catch {
          /* no fabric.mod.json, or download failed — verify.js covers the latter */
        } finally {
          fs.rmSync(dest, { force: true });
        }
        process.stdout.write('.');
      }
    });
    await Promise.all(workers);
    process.stdout.write('\n');
    fs.rmSync(jarDir, { recursive: true, force: true });

    for (const [id, list] of modIds) {
      if (list.length > 1) {
        problems.push({
          severity: 'BREAKING',
          what: `duplicate Fabric mod id "${id}" — the loader will refuse to start: ` +
                list.map((l) => `${l.file} (${l.version})`).join(' AND '),
        });
      }
    }

    // Every declared dependency range, checked against what the pack ships.
    const provided = new Map([...modIds].map(([id, l]) => [id, l[0].version]));
    for (const d of declared) {
      for (const [depId, range] of Object.entries(d.depends)) {
        if (['minecraft', 'java', 'fabricloader', 'fabric', 'fabric-api'].includes(depId)) continue;
        const have = provided.get(depId);
        if (have === undefined) continue; // not in pack; may be an optional/embedded lib
        if (!satisfies(have, String(range))) {
          problems.push({
            severity: 'BREAKING',
            what: `${d.file} requires ${depId} "${range}" but the pack ships ${have}`,
          });
        }
      }
    }
  }

  console.log(`\nAudited ${shipped.size} resolved mods from ${path.basename(packPath)}\n`);
  if (problems.length === 0) {
    console.log('No dependency or duplicate-mod problems found.');
  } else {
    for (const p of problems.sort((a, b) => a.severity.localeCompare(b.severity))) {
      console.log(`  [${p.severity}] ${p.what}`);
    }
  }
  console.log();
})();
