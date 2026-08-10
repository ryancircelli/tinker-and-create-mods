#!/usr/bin/env node
/**
 * Per-pack mod SETS from reference packs, for conflict-aware comparison.
 *
 *   node tools/scan-sets.js [count]
 *
 * scan-packs.js only tallied per-mod frequency, which cannot answer "is the
 * combination we rejected actually viable elsewhere?". A mod we dropped for
 * conflicting with an incumbent may be the better half of that pair -- the only
 * way to tell is to look at whole sets: who ships Lithium, and what do they
 * NOT ship alongside it?
 *
 * Writes /tmp/packsets.json: [{pack, slugs:[...]}] plus a slug cache.
 */
const fs = require('fs');
const path = require('path');
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
const { peek } = require('./peek-mrpack');

const UA = { 'User-Agent': `tinker-and-create/1.1 (${process.env.CONTACT || 'github.com/ryancircelli/tinker-and-create-mods'})` };
const WANT = Number(process.argv[2] || 100);
const get = async (u) => (await fetch(u, { headers: UA })).json();

(async () => {
  const facets = encodeURIComponent(JSON.stringify([
    ['project_type:modpack'], ['versions:1.21.1'], ['categories:neoforge'],
  ]));
  const packs = [];
  for (let off = 0; packs.length < WANT && off < 300; off += 50) {
    const r = await get(`https://api.modrinth.com/v2/search?facets=${facets}&index=downloads&limit=50&offset=${off}`);
    if (!r.hits?.length) break;
    packs.push(...r.hits);
  }

  const sets = [];
  const allIds = new Set();
  let done = 0;
  for (const p of packs.slice(0, WANT)) {
    try {
      const vs = await get(`https://api.modrinth.com/v2/project/${p.project_id}/version?game_versions=["1.21.1"]&loaders=["neoforge"]`);
      const file = vs?.[0]?.files?.find((f) => f.filename.endsWith('.mrpack')) || vs?.[0]?.files?.[0];
      if (!file) continue;
      const manifest = await peek(file.url);
      const ids = [...new Set((manifest.files || [])
        .map((f) => (f.downloads?.[0] || '').match(/\/data\/([A-Za-z0-9]{8})\//)?.[1])
        .filter(Boolean))];
      ids.forEach((i) => allIds.add(i));
      sets.push({ pack: p.slug, title: p.title, dl: p.downloads, ids });
      if (++done % 20 === 0) console.log(`  scanned ${done}`);
    } catch {}
  }

  // Resolve every id we saw to a slug once.
  const idList = [...allIds];
  const byId = {};
  for (let i = 0; i < idList.length; i += 60) {
    const chunk = idList.slice(i, i + 60);
    for (const pr of await get(`https://api.modrinth.com/v2/projects?ids=${encodeURIComponent(JSON.stringify(chunk))}`)) {
      byId[pr.id] = { slug: pr.slug, cats: pr.categories, title: pr.title };
    }
  }
  const out = sets.map((s) => ({
    pack: s.pack, dl: s.dl,
    slugs: s.ids.map((i) => byId[i]?.slug).filter(Boolean),
  }));
  fs.writeFileSync('/tmp/packsets.json', JSON.stringify(out));
  fs.writeFileSync('/tmp/slugmeta.json', JSON.stringify(byId));
  console.log(`  wrote ${out.length} pack sets, ${idList.length} distinct mods`);
})();
