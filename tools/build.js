#!/usr/bin/env node
/**
 * Tinker & Create — modpack resolver and .mrpack builder.
 *
 * Everything it knows about a mod beyond "I want this slug" comes from the
 * Modrinth API: side-ness, dependencies, incompatibilities, file hashes. That
 * keeps the hand-maintained data down to mods.json.
 *
 *   node tools/build.js            resolve + report + write .mrpack
 *   node tools/build.js --dry-run  resolve + report, no .mrpack
 *   node tools/build.js count      mod counts by category
 */

const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const PACKS_DIR = path.join(ROOT, 'packs');
const REPORTS_DIR = path.join(ROOT, 'reports');
const CACHE_DIR = path.join(ROOT, '.cache');

const DATA = JSON.parse(fs.readFileSync(path.join(__dirname, 'mods.json'), 'utf8'));
const { pack } = DATA;

const API = 'https://api.modrinth.com/v2';
const UA = 'tinker-and-create/1.0.3 (github.com/ryanc; modpack build tooling)';
const CONCURRENCY = 6;

// Category priority — used to decide which mod survives an incompatibility.
// Lower number wins.
const CATEGORY_RANK = {
  'Libraries': 0,
  'Core Tech': 1,
  'Performance': 2,
  'QoL': 3,
  'World Gen': 4,
  'Utility': 5,
  'Server Management': 6,
  'Exploration': 7,
  'Building': 8,
  'Combat': 9,
  'Pretty': 10,
  'Miscellaneous': 11,
  'Dependency': 1, // auto-pulled required deps are as important as what needs them
};

// ---------------------------------------------------------------------------
// HTTP with retry, backoff and an on-disk cache
// ---------------------------------------------------------------------------

let apiCalls = 0;

function cachePath(key) {
  return path.join(CACHE_DIR, key.replace(/[^a-z0-9._-]/gi, '_') + '.json');
}

async function api(endpoint, { cacheKey = null } = {}) {
  if (cacheKey && !process.env.NO_CACHE) {
    const p = cachePath(cacheKey);
    if (fs.existsSync(p)) {
      const age = (Date.now() - fs.statSync(p).mtimeMs) / 1000;
      if (age < 3600) return JSON.parse(fs.readFileSync(p, 'utf8'));
    }
  }

  let lastErr;
  let rateLimited = 0;
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      apiCalls++;
      const res = await fetch(API + endpoint, { headers: { 'User-Agent': UA } });

      if (res.status === 404) return null;

      if (res.status === 429) {
        // `continue` here used to skip past lastErr, so exhausting all five
        // attempts on rate limiting threw `undefined` -- surfacing as
        // "Build failed: undefined" with no clue that Modrinth was throttling
        // us. Record it so the final throw can say what actually happened.
        rateLimited++;
        lastErr = new Error(
          `rate limited by Modrinth (HTTP 429) on ${endpoint}; ${rateLimited} attempt(s)`);
        const wait = Number(res.headers.get('x-ratelimit-reset') || 10);
        await sleep(Math.min(wait, 60) * 1000);
        continue;
      }

      if (!res.ok) throw new Error(`HTTP ${res.status} for ${endpoint}`);

      const json = await res.json();
      if (cacheKey) {
        fs.mkdirSync(CACHE_DIR, { recursive: true });
        fs.writeFileSync(cachePath(cacheKey), JSON.stringify(json));
      }
      return json;
    } catch (err) {
      lastErr = err;
      await sleep(500 * 2 ** attempt);
    }
  }
  // Never throw a bare `undefined`: the top-level handler prints err.stack, so a
  // non-Error left the build reporting nothing usable.
  throw lastErr instanceof Error
    ? lastErr
    : new Error(`giving up on ${endpoint} after 5 attempts (last: ${lastErr})`);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function pool(items, worker, limit = CONCURRENCY) {
  const results = new Array(items.length);
  let cursor = 0;
  const runners = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (cursor < items.length) {
      const i = cursor++;
      results[i] = await worker(items[i], i);
    }
  });
  await Promise.all(runners);
  return results;
}

// ---------------------------------------------------------------------------
// Modrinth lookups
// ---------------------------------------------------------------------------

async function getProject(slugOrId) {
  return api(`/project/${encodeURIComponent(slugOrId)}`, { cacheKey: `project-${slugOrId}` });
}

const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

/**
 * Last-ditch slug recovery: search Modrinth by name.
 *
 * Deliberately strict. A loose match here is worse than no match — it silently
 * ships a *different mod* than the pack asked for, which is exactly how
 * "Create Encased" once resolved to "Create: Transmission!".
 */
async function searchProject(name) {
  const facets = JSON.stringify([
    (pack.loaders || [pack.loader]).map((l) => `categories:${l}`),
    [`versions:${pack.minecraft}`], ['project_type:mod']]);
  const q = `/search?query=${encodeURIComponent(name)}&facets=${encodeURIComponent(facets)}&limit=8`;
  const res = await api(q, { cacheKey: `search-${name}-${pack.minecraft}` });
  if (!res || !res.hits || res.hits.length === 0) return { hit: null, nearMiss: null };

  const target = norm(name);
  const accept = res.hits.find((h) => {
    const t = norm(h.title);
    // Accept identity, or one name fully containing the other (e.g.
    // "Create: Shuffle Filter" vs "Create: Shuffle Filter Fabric").
    return t === target || t.startsWith(target) || target.startsWith(t);
  });

  return { hit: accept || null, nearMiss: accept ? null : res.hits[0] };
}

async function listVersions(slugOrId) {
  // 1.20.1 NeoForge (47.x) is a Forge fork and loads Forge-tagged mods; production
  // NeoForge packs (e.g. Simply NeoForged) ship them. Modrinth's loader tags
  // therefore understate availability, so accept every loader in pack.loaders.
  const loaders = encodeURIComponent(JSON.stringify(pack.loaders || [pack.loader]));
  const games = encodeURIComponent(JSON.stringify([pack.minecraft]));
  const versions = await api(
    `/project/${encodeURIComponent(slugOrId)}/version?loaders=${loaders}&game_versions=${games}`,
    { cacheKey: `versions-${slugOrId}-${pack.minecraft}-${(pack.loaders||[pack.loader]).join('_')}` }
  );
  if (!versions) return [];
  return [...versions].sort(
    (a, b) => new Date(b.date_published) - new Date(a.date_published)
  );
}

async function getVersion(slugOrId, pin = null) {
  let versions = await listVersions(slugOrId);
  // A published version can carry zero files -- Sophisticated Storage's newest
  // release (1.21.1-1.5.85.2071) is an empty upload. Such a version is not a
  // candidate: selecting it silently DROPPED the mod from the pack while its
  // addon (storageinmotion) stayed in, leaving a dependent with no parent.
  // Filter them out here so channel policy falls through to a real build.
  versions = versions.filter((v) => Array.isArray(v.files) && v.files.length > 0);
  if (versions.length === 0) return null;

  // An explicit pin in mods.json overrides channel policy entirely. Used when
  // the newest build is broken in a way only a launch reveals — Vein Mining
  // 1.5.0 ships a FabricPlatform service class with no usable no-arg
  // constructor, which kills SpectreLib's preLaunch stage.
  if (pin) {
    const exact = versions.find((v) => v.version_number === pin);
    if (exact) return exact;
    console.warn(`  ! pinned version ${pin} not found for ${slugOrId}; using policy`);
  }

  // Channel policy, tuned by two real failures:
  //
  //  - "newest release" picked Slice & Dice 3.3.1 (2024, built against Create
  //    0.5.1) over 3.6.0 (2026, Create 6). 1.20.1 is legacy, so many mods now
  //    ship only beta builds there and the release channel goes stale.
  //  - "newest build" then picked Create: Dragons Plus 1.11.4-p.2, a same-day
  //    alpha whose Contraption mixin does not match Create 6.0.8.1.
  //
  // So: take the newest release, unless the release channel has gone stale by
  // more than STALE_DAYS, in which case trust the newer beta. Alphas are never
  // selected automatically — a mod with nothing but alphas is dropped and
  // reported, unless mods.json opts it in via allowAlpha.
  const STALE_DAYS = 180;
  const newestOf = (type) =>
    versions
      .filter((v) => v.version_type === type)
      .sort((a, b) => new Date(b.date_published) - new Date(a.date_published))[0];

  const release = newestOf('release');
  const beta = newestOf('beta');
  const alpha = newestOf('alpha');
  const daysBetween = (a, b) =>
    (new Date(a.date_published) - new Date(b.date_published)) / 86400000;

  if (release && beta && daysBetween(beta, release) > STALE_DAYS) return beta;
  if (release) return release;
  if (beta) return beta;

  if (alpha && (DATA.allowAlpha || []).includes(slugOrId)) return alpha;
  return null; // alpha-only: caller reports it as unavailable
}

// ---------------------------------------------------------------------------
// Resolution
// ---------------------------------------------------------------------------

const report = {
  slugFixes: [],
  unavailable: [],
  autoAdded: [],
  bannedDrops: [],
  incompatibilities: [],
  exclusiveDrops: [],
  sideOverrides: [],
  prerelease: [],
  serverSide: [],
  clientSide: [],
};

const bannedBySlug = new Map(DATA.banned.map((b) => [b.slug, b]));

/** Fetch project + best version for one mod entry, healing a bad slug if needed. */
async function resolve(entry) {
  let project = await getProject(entry.slug);
  let slug = entry.slug;

  let nearMiss = null;
  if (!project) {
    const found = await searchProject(entry.name);
    nearMiss = found.nearMiss;
    if (found.hit) {
      slug = found.hit.slug;
      project = await getProject(slug);
      if (project) {
        report.slugFixes.push({ name: entry.name, from: entry.slug, to: slug });
      }
    }
  }

  if (!project) {
    report.unavailable.push({
      ...entry,
      reason: nearMiss
        ? `no project matching this name (closest unrelated hit: "${nearMiss.title}" — not substituted)`
        : 'no such project on Modrinth',
    });
    return null;
  }

  const version = await getVersion(project.slug, entry.version || null);
  if (!version) {
    const all = await listVersions(project.slug);
    const alphaOnly = all.length > 0 && all.every((v) => v.version_type === 'alpha');
    report.unavailable.push({
      ...entry,
      slug: project.slug,
      reason: alphaOnly
        ? `only alpha builds exist for ${pack.loader} ${pack.minecraft} ` +
          `(newest ${all[0].version_number}) — not shipped automatically; ` +
          `add the slug to "allowAlpha" in mods.json to override`
        : `no ${pack.loader} ${pack.minecraft} build published`,
    });
    return null;
  }

  if (version.version_type !== 'release') {
    report.prerelease.push({
      name: project.title,
      slug: project.slug,
      version: version.version_number,
      type: version.version_type,
    });
  }

  return { entry: { ...entry, slug: project.slug }, project, version };
}

async function main() {
  const args = process.argv.slice(2);

  if (args[0] === 'count') {
    const byCat = {};
    for (const m of DATA.mods) byCat[m.category] = (byCat[m.category] || 0) + 1;
    console.log(`\nTotal mods requested: ${DATA.mods.length}\n`);
    for (const [cat, n] of Object.entries(byCat).sort()) {
      console.log(`  ${cat.padEnd(20)} ${String(n).padStart(3)}`);
    }
    return;
  }

  const dryRun = args.includes('--dry-run');

  // Was hardcoded "Fabric" -- a leftover from the 1.20.1 Fabric line that kept
  // printing on every NeoForge build. The manifest was always right; only this
  // banner lied, which is exactly the kind of thing that misleads a later reader.
  console.log(`\nTinker & Create ${pack.version} — Minecraft ${pack.minecraft} / ${pack.loader}`);
  console.log(`Resolving ${DATA.mods.length} mods against Modrinth...\n`);

  // --- Pass 1: resolve everything the pack explicitly asks for --------------
  const resolved = new Map(); // project id -> {entry, project, version}
  const initial = await pool(DATA.mods, async (entry) => {
    const r = await resolve(entry);
    process.stdout.write(r ? '.' : 'x');
    return r;
  });
  process.stdout.write('\n');

  for (const r of initial) {
    if (r) resolved.set(r.project.id, r);
  }

  // --- Pass 2: pull in required dependencies, transitively ------------------
  // Modrinth marks bundled libs as "embedded", so only "required" needs adding.
  const ALIASES = DATA.aliases || {};
  // A few Fabric addons declare their required dep against the Forge Create
  // project id; create-fabric is what actually satisfies them.
  const deref = (id) => ALIASES[id] || id;

  for (let depth = 0; depth < 6; depth++) {
    const missing = new Set();
    for (const { version } of resolved.values()) {
      for (const dep of version.dependencies || []) {
        if (dep.dependency_type !== 'required') continue;
        const id = deref(dep.project_id);
        if (!id || resolved.has(id)) continue;
        missing.add(id);
      }
    }
    if (missing.size === 0) break;

    const added = await pool([...missing], async (id) => {
      const project = await getProject(id);
      if (!project) return null;
      const version = await getVersion(id);
      if (!version) {
        report.unavailable.push({
          name: project.title,
          slug: project.slug,
          category: 'Dependency',
          reason: `required dependency with no Fabric ${pack.minecraft} build`,
        });
        return null;
      }
      return {
        entry: { name: project.title, slug: project.slug, category: 'Dependency' },
        project,
        version,
      };
    });

    for (const r of added) {
      if (!r) continue;
      resolved.set(r.project.id, r);
      report.autoAdded.push({ name: r.project.title, slug: r.project.slug });
    }
  }

  // Who requires whom — needed to decide conflicts and banned-mod fallout.
  const requiredBy = new Map(); // project id -> Set<project id>
  for (const { project, version } of resolved.values()) {
    for (const dep of version.dependencies || []) {
      if (dep.dependency_type !== 'required' || !dep.project_id) continue;
      const id = deref(dep.project_id);
      if (!requiredBy.has(id)) requiredBy.set(id, new Set());
      requiredBy.get(id).add(project.id);
    }
  }

  // --- Pass 3: enforce the ban list ----------------------------------------
  // A banned mod is banned including anything that hard-requires it, or the
  // dependency resolver would quietly drag it back in.
  const bannedIds = new Set();
  for (const { project } of resolved.values()) {
    if (bannedBySlug.has(project.slug)) bannedIds.add(project.id);
  }

  let grew = true;
  while (grew) {
    grew = false;
    for (const { project, version } of resolved.values()) {
      if (bannedIds.has(project.id)) continue;
      for (const dep of version.dependencies || []) {
        if (dep.dependency_type !== 'required' || !dep.project_id) continue;
        if (!bannedIds.has(deref(dep.project_id))) continue;
        bannedIds.add(project.id);
        grew = true;
        break;
      }
    }
  }

  // Name the culprits before anything is deleted, or the "via" trail is empty.
  const bannedDrops = [...bannedIds]
    .map((id) => resolved.get(id))
    .filter(Boolean)
    .map((r) => {
      const direct = bannedBySlug.get(r.project.slug);
      const via = (r.version.dependencies || [])
        .filter((d) => d.dependency_type === 'required' && bannedIds.has(deref(d.project_id)))
        .map((d) => resolved.get(deref(d.project_id))?.project.title)
        .filter(Boolean);
      return {
        id: r.project.id,
        name: r.project.title,
        slug: r.project.slug,
        reason: direct ? direct.reason : `hard-requires banned mod: ${via.join(', ')}`,
      };
    });

  for (const d of bannedDrops) {
    report.bannedDrops.push({ name: d.name, slug: d.slug, reason: d.reason });
    resolved.delete(d.id);
  }

  // --- Pass 4: incompatibilities Modrinth declares --------------------------
  const rankOf = (r) => CATEGORY_RANK[r.entry.category] ?? 99;
  const dependentCount = (id) => (requiredBy.get(id)?.size ?? 0);

  for (const r of [...resolved.values()]) {
    if (!resolved.has(r.project.id)) continue;
    for (const dep of r.version.dependencies || []) {
      if (dep.dependency_type !== 'incompatible' || !dep.project_id) continue;
      const other = resolved.get(dep.project_id);
      if (!other) continue;

      // Keep whatever more of the pack leans on; fall back to category rank,
      // then slug order so the outcome is deterministic.
      const candidates = [r, other].sort((a, b) => {
        const d = dependentCount(b.project.id) - dependentCount(a.project.id);
        if (d !== 0) return d;
        const c = rankOf(a) - rankOf(b);
        if (c !== 0) return c;
        return a.project.slug.localeCompare(b.project.slug);
      });
      const [keep, drop] = candidates;

      report.incompatibilities.push({
        between: [r.project.title, other.project.title],
        kept: keep.project.title,
        dropped: drop.project.title,
        droppedSlug: drop.project.slug,
        declaredBy: r.project.title,
      });
      resolved.delete(drop.project.id);
    }
  }

  // --- Pass 5: exclusive groups Modrinth does NOT declare -------------------
  // Modrinth has no metadata for "these two mods both work, but you must not
  // ship both" (two recipe viewers, two grave handlers). Those come from
  // mods.json, and anything that hard-requires a loser goes with it.
  const bySlug = new Map([...resolved.values()].map((r) => [r.project.slug, r]));

  for (const group of DATA.exclusiveGroups || []) {
    const present = group.members.map((s) => bySlug.get(s)).filter(Boolean);
    if (present.length < 2) continue;

    const keep = present.find((r) => r.project.slug === group.keep) || present[0];
    for (const loser of present) {
      if (loser === keep) continue;

      // Drop the loser plus its hard dependents, else the resolver re-adds it.
      const casualties = new Set([loser.project.id]);
      let expanded = true;
      while (expanded) {
        expanded = false;
        for (const r of resolved.values()) {
          if (casualties.has(r.project.id)) continue;
          const needs = (r.version.dependencies || []).some(
            (d) => d.dependency_type === 'required' && casualties.has(deref(d.project_id))
          );
          if (needs) { casualties.add(r.project.id); expanded = true; }
        }
      }

      for (const id of casualties) {
        const r = resolved.get(id);
        if (!r) continue;
        report.exclusiveDrops.push({
          group: group.label,
          name: r.project.title,
          slug: r.project.slug,
          kept: keep.project.title,
          reason: id === loser.project.id
            ? group.reason
            : `hard-requires ${loser.project.title}, dropped with it`,
        });
        resolved.delete(id);
      }
    }
  }

  // --- Side-ness, with dependency propagation ------------------------------
  //
  // Modrinth's client_side/server_side describes a mod in isolation, which is
  // not enough. Fusion is a client-side texture library, so it was excluded
  // from the server — but Rechiseled runs server-side and *hard-requires* it,
  // so the server refused to boot. A required dependency has to exist wherever
  // its dependent does, whatever Modrinth says about it alone.
  // Some projects declare side-ness that is simply wrong -- a library flagged
  // client-unsupported that nonetheless registers a both-sides payload will pass
  // every static check and then reject every login. envOverrides corrects those.
  const envOverrides = DATA.envOverrides || {};
  const env = new Map();
  for (const { project } of resolved.values()) {
    const ov = envOverrides[project.slug] || envOverrides[project.id];
    env.set(project.id, ov ? { ...ov } : {
      client: project.client_side === 'unsupported' ? 'unsupported' : 'required',
      server: project.server_side === 'unsupported' ? 'unsupported' : 'required',
    });
  }

  // The client set must be a SUPERSET of the server set. Anything the server has
  // but the client lacks makes the server send registries/payloads the client
  // cannot resolve, and the login is rejected outright -- that is how BaguetteLib
  // (baguettelib:example) and Corpse-Curios (corpsecurioscompat:curio_slot_data)
  // each broke every join. The reverse is harmless: a server-side mod loaded on a
  // client simply has nothing to do. So never drop a mod from the client; only
  // client-only mods (Fusion, shaders, minimaps) are withheld from the server.
  for (const e of env.values()) if (e.client === 'unsupported') e.client = 'required';

  for (const side of ['client', 'server']) {
    let changed = true;
    while (changed) {
      changed = false;
      for (const { project, version } of resolved.values()) {
        if (env.get(project.id)[side] === 'unsupported') continue;
        for (const dep of version.dependencies || []) {
          if (dep.dependency_type !== 'required' || !dep.project_id) continue;
          const id = deref(dep.project_id);
          const depEnv = env.get(id);
          if (!depEnv || depEnv[side] !== 'unsupported') continue;
          depEnv[side] = 'required';
          changed = true;
          report.sideOverrides.push({
            name: resolved.get(id)?.project.title || id,
            side,
            requiredBy: project.title,
          });
        }
      }
    }
  }

  // --- Build the manifest ---------------------------------------------------
  const files = [];
  for (const { project, version } of [...resolved.values()].sort((a, b) =>
    a.project.slug.localeCompare(b.project.slug)
  )) {
    const file = version.files.find((f) => f.primary) || version.files[0];
    if (!file) {
      report.unavailable.push({
        name: project.title,
        slug: project.slug,
        reason: 'version has no downloadable file',
      });
      continue;
    }

    const fileEnv = env.get(project.id);
    if (fileEnv.server === 'unsupported') report.clientSide.push(project.slug);
    if (fileEnv.client === 'unsupported') report.serverSide.push(project.slug);

    files.push({
      path: `mods/${file.filename}`,
      hashes: file.hashes,
      env: fileEnv,
      downloads: [file.url],
      fileSize: file.size,
    });
  }

  // --- externally hosted mods -------------------------------------------
  // Mods that cannot live on Modrinth (community ports, private builds) do not
  // have to be embedded in overrides/. The .mrpack spec allows download URLs on
  // an allowlist that includes github.com, so these ship as ordinary files[]
  // entries and reach players over a CDN like everything else -- no overrides,
  // and nothing served through the server's own uplink.
  for (const ext of DATA.external || []) {
    const local = path.join(ROOT, 'external-mods', ext.file);
    // external-mods/ is gitignored (22 MB of jars), so a fresh clone or a CI
    // checkout has none of these. Previously the build just warned and dropped
    // them, which produced a "Tinker & Create" containing no Tinkers, no Mantle
    // and no levelling addon -- 330 mods instead of 333. Fetch from the same URL
    // the manifest will hand to clients instead: that makes the build work from
    // a clean checkout AND guarantees the recorded hash matches the bytes players
    // actually download, which hashing a local copy never did.
    if (!fs.existsSync(local)) {
      process.stdout.write(`  external: fetching ${ext.file}...`);
      const res = await fetch(ext.url, { headers: { 'User-Agent': UA }, redirect: 'follow' });
      if (!res.ok) {
        console.error(`\n  external mod unavailable: ${ext.url} -> HTTP ${res.status}`);
        process.exitCode = 1;
        continue;
      }
      fs.mkdirSync(path.dirname(local), { recursive: true });
      fs.writeFileSync(local, Buffer.from(await res.arrayBuffer()));
      console.log(` ${(fs.statSync(local).size / 1e6).toFixed(1)} MB`);
    }
    const buf = fs.readFileSync(local);
    files.push({
      path: `mods/${ext.file}`,
      // Modrinth requires BOTH hashes; the launcher verifies them on download,
      // so a re-uploaded jar with different bytes must be re-hashed here.
      hashes: {
        sha1: crypto.createHash('sha1').update(buf).digest('hex'),
        sha512: crypto.createHash('sha512').update(buf).digest('hex'),
      },
      env: ext.env || { client: 'required', server: 'required' },
      downloads: [ext.url],
      fileSize: buf.length,
    });
    console.log(`  external: ${ext.file} -> ${ext.url.replace(/^https:\/\//, '')}`);
  }

  const manifest = {
    formatVersion: 1,
    game: 'minecraft',
    versionId: pack.version,
    name: pack.name,
    summary: pack.summary,
    files,
    dependencies: {
      minecraft: pack.minecraft,
      [pack.loader]: pack.loaderVersion,
    },
  };

  writeReport(manifest, resolved);

  if (dryRun) {
    console.log('\n--dry-run: no .mrpack written.');
    return;
  }

  const out = writeMrpack(manifest);
  console.log(`\n.mrpack: ${out}`);
}

// ---------------------------------------------------------------------------
// Output
// ---------------------------------------------------------------------------

function writeMrpack(manifest) {
  fs.mkdirSync(PACKS_DIR, { recursive: true });
  const outputPath = path.join(PACKS_DIR, `tinker-and-create-${pack.version}.mrpack`);

  // zip appends to an existing archive, so clear any previous build first.
  if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);

  const tmp = fs.mkdtempSync(path.join(require('os').tmpdir(), 'mrpack-'));
  fs.writeFileSync(
    path.join(tmp, 'modrinth.index.json'),
    JSON.stringify(manifest, null, 2)
  );
  fs.mkdirSync(path.join(tmp, 'overrides'), { recursive: true });

  // Copy anything in overrides/ into the pack (configs, resource packs, ...).
  const overridesSrc = path.join(ROOT, 'overrides');
  const hasOverrides =
    fs.existsSync(overridesSrc) && fs.readdirSync(overridesSrc).length > 0;
  if (hasOverrides) {
    fs.cpSync(overridesSrc, path.join(tmp, 'overrides'), { recursive: true });
  }

  execSync(`zip -r -q "${outputPath}" modrinth.index.json overrides`, { cwd: tmp });
  fs.rmSync(tmp, { recursive: true, force: true });

  const kb = (fs.statSync(outputPath).size / 1024).toFixed(1);
  console.log(`\nWrote ${manifest.files.length} mods (${kb} KB manifest archive)`);
  return outputPath;
}

function writeReport(manifest, resolved) {
  const L = [];
  const section = (title, rows, render) => {
    L.push(`\n## ${title} (${rows.length})\n`);
    if (rows.length === 0) {
      L.push('_none_\n');
      return;
    }
    for (const row of rows) L.push(render(row));
    L.push('');
  };

  L.push(`# Tinker & Create ${pack.version} — build report\n`);
  L.push(`- Minecraft ${pack.minecraft}, Fabric Loader ${pack.loaderVersion}`);
  L.push(`- Requested: ${DATA.mods.length} mods`);
  L.push(`- Shipped: **${manifest.files.length} mods**`);
  L.push(`- Client-only: ${report.clientSide.length}  |  Server-only: ${report.serverSide.length}`);
  L.push(`- Modrinth API calls: ${apiCalls}`);

  section('Corrected slugs', report.slugFixes, (r) =>
    `- **${r.name}**: \`${r.from}\` → \`${r.to}\``);

  const uniqUnavailable = [...new Map(report.unavailable.map((r) => [r.slug, r])).values()];
  section('Dropped — unavailable', uniqUnavailable, (r) =>
    `- **${r.name}** (\`${r.slug}\`, ${r.category}) — ${r.reason}`);

  section('Dropped — mutually exclusive', report.exclusiveDrops, (r) =>
    `- **${r.name}** (\`${r.slug}\`) — ${r.group}: kept ${r.kept}. ${r.reason}`);

  section('Excluded up front (see mods.json "removed")', DATA.removed || [], (r) =>
    `- **${r.name}** (\`${r.slug}\`) — ${r.reason}`);

  section('Dropped — ban list', report.bannedDrops, (r) =>
    `- **${r.name}** (\`${r.slug}\`) — ${r.reason}`);

  section('Dropped — declared incompatibility', report.incompatibilities, (r) =>
    `- **${r.between[0]}** ↔ **${r.between[1]}** — kept ${r.kept}, dropped ${r.dropped} ` +
    `(incompatibility declared by ${r.declaredBy})`);

  section('Side-ness overridden (dependency propagation)', report.sideOverrides, (r) =>
    `- **${r.name}** forced to ${r.side}-side — hard-required by ${r.requiredBy}`);

  section('Auto-added required dependencies', report.autoAdded, (r) =>
    `- **${r.name}** (\`${r.slug}\`)`);

  section('Non-release builds in use', report.prerelease, (r) =>
    `- **${r.name}** \`${r.version}\` (${r.type})`);

  L.push('\n## Shipped mods\n');
  const byCat = {};
  for (const r of resolved.values()) {
    (byCat[r.entry.category] ||= []).push(r);
  }
  for (const cat of Object.keys(byCat).sort((a, b) =>
    (CATEGORY_RANK[a] ?? 99) - (CATEGORY_RANK[b] ?? 99))) {
    const rows = byCat[cat].sort((a, b) => a.project.title.localeCompare(b.project.title));
    L.push(`\n### ${cat} (${rows.length})\n`);
    for (const r of rows) {
      const side =
        r.project.server_side === 'unsupported' ? ' _(client-only)_'
        : r.project.client_side === 'unsupported' ? ' _(server-only)_'
        : '';
      L.push(`- ${r.project.title} \`${r.version.version_number}\`${side}`);
    }
  }

  fs.mkdirSync(REPORTS_DIR, { recursive: true });
  const md = path.join(REPORTS_DIR, `build-${pack.version}.md`);
  fs.writeFileSync(md, L.join('\n') + '\n');
  fs.writeFileSync(
    path.join(REPORTS_DIR, `build-${pack.version}.json`),
    JSON.stringify({ summary: { shipped: manifest.files.length }, ...report }, null, 2)
  );

  // Console summary
  // Raw total is misleading: a third of the pack is libraries and performance
  // mods the player never sees. Report the CONTENT count too -- that is what
  // actually changes how the pack plays.
  {
    const INFRA = /library|optimization/;
    let infra = 0;
    for (const { project } of resolved.values()) {
      if ((project.categories || []).some((c) => INFRA.test(c))) infra++;
    }
    const total = manifest.files.length;
    console.log(`Shipped:   ${total} mods  (${total - infra} content, ${infra} library/performance)`);
  }
  console.log(`Slug fixes: ${report.slugFixes.length}`);
  console.log(`Dropped:    ${report.unavailable.length} unavailable, ` +
              `${report.bannedDrops.length} banned, ` +
              `${report.incompatibilities.length + report.exclusiveDrops.length} conflicting`);
  console.log(`Auto-added: ${report.autoAdded.length} required dependencies`);
  console.log(`Report:     ${md}`);
}

main().catch((err) => {
  console.error('\nBuild failed:', err && err.stack || err, '\ntypeof:', typeof err);
  process.exit(1);
});
