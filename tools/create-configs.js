#!/usr/bin/env node
/**
 * Compare Create's own settings across reference packs.
 *
 *   node tools/create-configs.js <path/to/harness/config/create-server.toml> [extra-slugs...]
 *
 * Create keeps its gameplay knobs (chain conveyor reach, contraption limits,
 * kinetic stress) in create-server.toml. On NeoForge a server config is
 * per-world, so a pack cannot ship it under overrides/config -- it ships under
 * overrides/defaultconfigs, which seeds every new world. An earlier scan that
 * only read overrides/config saw none of this and wrongly concluded these packs
 * ship stock Create.
 *
 * Prints every key where a pack differs from our value.
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');

const UA = { 'User-Agent': `tinker-and-create/createcfg (${process.env.CONTACT || 'github.com/ryancircelli/tinker-and-create-mods'})` };
const OUT = '/tmp/createcfg';
const MINE = process.argv[2];
const extra = process.argv.slice(3);

const peers = JSON.parse(fs.readFileSync('/tmp/similar.json', 'utf8')).map((p) => p.pack);
const slugs = [...new Set([...peers, ...extra])];

const get = async (u) => (await fetch(u, { headers: UA })).json();

/** section-aware key=value for Create's toml. */
function parse(file) {
  let t;
  try { t = fs.readFileSync(file, 'utf8'); } catch { return null; }
  const out = {};
  let section = '';
  for (const raw of t.split('\n')) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const sec = line.match(/^\[([^\]]+)\]$/);
    if (sec) { section = sec[1]; continue; }
    const kv = line.match(/^"?([A-Za-z0-9_.\-]+)"?\s*=\s*(.*)$/);
    if (!kv) continue;
    out[(section ? section + '.' : '') + kv[1]] = kv[2].trim();
  }
  return out;
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const mine = parse(MINE);
  if (!mine) { console.error('cannot read our create-server.toml'); process.exit(1); }
  console.log(`ours: ${Object.keys(mine).length} Create settings\n`);

  const found = [];
  for (const slug of slugs) {
    const zip = path.join(OUT, slug + '.mrpack');
    const dir = path.join(OUT, slug);
    try {
      if (!fs.existsSync(zip)) {
        const vs = await get(`https://api.modrinth.com/v2/project/${slug}/version?game_versions=["1.21.1"]`);
        const file = vs?.[0]?.files?.find((f) => f.filename.endsWith('.mrpack')) || vs?.[0]?.files?.[0];
        if (!file) { console.log(`  ${slug}: no 1.21.1 file`); continue; }
        fs.writeFileSync(zip, Buffer.from(await (await fetch(file.url, { headers: UA })).arrayBuffer()));
      }
      fs.mkdirSync(dir, { recursive: true });
      for (const pat of ['overrides/config/create*', 'overrides/defaultconfigs/create*']) {
        try { execSync(`unzip -o -q "${zip}" '${pat}' -d "${dir}"`, { stdio: 'ignore' }); } catch {}
      }
      try { execSync(`chmod -R u+rwX "${dir}"`, { stdio: 'ignore' }); } catch {}
      const cands = [
        path.join(dir, 'overrides/defaultconfigs/create-server.toml'),
        path.join(dir, 'overrides/config/create-server.toml'),
      ].filter(fs.existsSync);
      if (!cands.length) { console.log(`  ${slug.padEnd(30)} -- no create-server.toml`); continue; }
      const theirs = parse(cands[0]);
      const diffs = Object.entries(theirs)
        .filter(([k, v]) => k in mine && mine[k] !== v)
        .map(([k, v]) => ({ key: k, ours: mine[k], theirs: v }));
      console.log(`  ${slug.padEnd(30)} ${String(Object.keys(theirs).length).padStart(4)} keys, ${String(diffs.length).padStart(3)} differ  (${path.basename(path.dirname(cands[0]))})`);
      found.push({ slug, diffs });
    } catch (e) {
      console.log(`  ${slug}: ${e.message.slice(0, 60)}`);
    }
  }

  // Aggregate: which Create settings do multiple packs move, and to what?
  const agg = new Map();
  for (const f of found) {
    for (const d of f.diffs) {
      if (!agg.has(d.key)) agg.set(d.key, { ours: d.ours, votes: new Map() });
      const m = agg.get(d.key).votes;
      if (!m.has(d.theirs)) m.set(d.theirs, []);
      m.get(d.theirs).push(f.slug);
    }
  }
  const rows = [...agg.entries()].sort((a, b) => {
    const n = (x) => Math.max(...[...x[1].votes.values()].map((v) => v.length));
    return n(b) - n(a);
  });
  console.log(`\nCreate settings changed by at least one pack (${rows.length}):\n`);
  for (const [key, info] of rows) {
    const parts = [...info.votes.entries()].sort((a, b) => b[1].length - a[1].length);
    console.log(`  ${key}`);
    console.log(`      ours: ${info.ours}`);
    for (const [v, who] of parts) console.log(`      ${String(who.length).padStart(2)}x ${String(v).padEnd(12)} ${who.join(', ')}`);
  }
  fs.writeFileSync('/tmp/createcfg-summary.json', JSON.stringify(rows.map(([k, v]) => ({ key: k, ours: v.ours, votes: [...v.votes] })), null, 1));
})();
