#!/usr/bin/env node
/**
 * Scan the top N NeoForge 1.21.1 modpacks and tally which mods they ship.
 *
 *   node tools/scan-packs.js [count]
 *
 * Frequency across independently-curated packs is a far better signal than raw
 * download count: it says "pack authors solving this problem reached for this
 * mod", which is what we actually want when filling gaps.
 *
 * Uses peek() so each pack costs ~50 KB of range requests instead of a full
 * multi-hundred-MB download.
 */
const fs = require('fs');
const path = require('path');
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
const { peek } = require('./peek-mrpack');

const UA = { 'User-Agent': `tinker-and-create/1.1 (${process.env.CONTACT || 'github.com/ryancircelli/tinker-and-create-mods'})` };
const WANT = Number(process.argv[2] || 100);
const DATA = JSON.parse(fs.readFileSync(path.join(__dirname, 'mods.json'), 'utf8'));

const own = new Set([
  ...DATA.mods.map((m) => (m.slug || '').toLowerCase()),
  ...(DATA.banned || []).map((b) => (b.slug || '').toLowerCase()),
  ...(DATA.removed || []).map((r) => (r.slug || '').toLowerCase()),
]);

const get = async (url) => (await fetch(url, { headers: UA })).json();

(async () => {
  // 1. Collect modpack projects
  const facets = encodeURIComponent(JSON.stringify([
    ['project_type:modpack'], ['versions:1.21.1'], ['categories:neoforge'],
  ]));
  const packs = [];
  for (let off = 0; packs.length < WANT && off < 300; off += 50) {
    const r = await get(`https://api.modrinth.com/v2/search?facets=${facets}&index=downloads&limit=50&offset=${off}`);
    if (!r.hits?.length) break;
    packs.push(...r.hits);
  }
  console.log(`  found ${packs.length} NeoForge 1.21.1 modpacks`);

  // 2. For each pack, peek its newest 1.21.1 manifest and tally project ids
  const freq = new Map();       // projectId -> count of packs shipping it
  const packNames = new Map();
  let scanned = 0, failed = 0;

  for (const p of packs.slice(0, WANT)) {
    try {
      const vs = await get(`https://api.modrinth.com/v2/project/${p.project_id}/version?game_versions=["1.21.1"]&loaders=["neoforge"]`);
      const file = vs?.[0]?.files?.find((f) => f.filename.endsWith('.mrpack')) || vs?.[0]?.files?.[0];
      if (!file) { failed++; continue; }
      const manifest = await peek(file.url);
      const ids = new Set();
      for (const f of manifest.files || []) {
        // Modrinth CDN paths embed the project id: /data/<projectId>/versions/...
        const m = (f.downloads?.[0] || '').match(/\/data\/([A-Za-z0-9]{8})\//);
        if (m) ids.add(m[1]);
      }
      for (const id of ids) freq.set(id, (freq.get(id) || 0) + 1);
      scanned++;
      if (scanned % 10 === 0) process.stdout.write(`  scanned ${scanned}...\n`);
    } catch (e) { failed++; }
  }
  console.log(`  scanned ${scanned} packs (${failed} unreadable)`);

  // 3. Resolve the most common project ids to slugs, drop what we already know
  const top = [...freq.entries()].sort((a, b) => b[1] - a[1]).slice(0, 300);
  const ids = top.map(([id]) => id);
  const projects = [];
  for (let i = 0; i < ids.length; i += 60) {
    const chunk = ids.slice(i, i + 60);
    projects.push(...await get(`https://api.modrinth.com/v2/projects?ids=${encodeURIComponent(JSON.stringify(chunk))}`));
  }
  const byId = new Map(projects.map((p) => [p.id, p]));
  const rows = top
    .map(([id, n]) => ({ n, p: byId.get(id) }))
    .filter((r) => r.p && !own.has(r.p.slug.toLowerCase()))
    .filter((r) => r.p.project_type === 'mod');

  fs.writeFileSync('/tmp/packscan.json', JSON.stringify(rows.map((r) => ({
    slug: r.p.slug, title: r.p.title, packs: r.n, dl: r.p.downloads,
    cats: r.p.categories, desc: (r.p.description || '').slice(0, 100),
  })), null, 1));
  console.log(`  ${rows.length} mods used by these packs that we do NOT have -> /tmp/packscan.json`);
})();
