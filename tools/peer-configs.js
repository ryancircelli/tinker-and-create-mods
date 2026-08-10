#!/usr/bin/env node
/**
 * Download the closest peer packs and collect the CONFIG FILES they ship.
 *
 *   node tools/peer-configs.js
 *
 * A .mrpack's overrides/ folder is the only place a pack author can express
 * "the defaults are wrong for this pack". Mod choice tells you what they play;
 * overrides/config tells you what they had to fix. That second signal is the
 * one worth copying, and it is invisible to a manifest-only scan.
 *
 * Reads /tmp/similar.json, writes /tmp/peercfg/<pack>/ plus a summary.
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');

const UA = { 'User-Agent': `tinker-and-create/peercfg (${process.env.CONTACT || 'github.com/ryancircelli/tinker-and-create-mods'})` };
const OUT = '/tmp/peercfg';
const peers = JSON.parse(fs.readFileSync('/tmp/similar.json', 'utf8'));

const get = async (u) => (await fetch(u, { headers: UA })).json();

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const summary = [];
  for (const p of peers) {
    const dir = path.join(OUT, p.pack);
    try {
      const vs = await get(`https://api.modrinth.com/v2/project/${p.pack}/version?game_versions=["1.21.1"]`);
      const file = vs?.[0]?.files?.find((f) => f.filename.endsWith('.mrpack')) || vs?.[0]?.files?.[0];
      if (!file) { console.log(`  ${p.pack}: no file`); continue; }
      const mb = (file.size / 1e6).toFixed(1);
      const zip = path.join(OUT, p.pack + '.mrpack');
      if (!fs.existsSync(zip)) {
        const buf = Buffer.from(await (await fetch(file.url, { headers: UA })).arrayBuffer());
        fs.writeFileSync(zip, buf);
      }
      fs.mkdirSync(dir, { recursive: true });
      // Only the config tree -- overrides also carry resource packs and shaders,
      // which are tens of MB and say nothing about settings.
      try {
        execSync(`unzip -o -q "${zip}" 'overrides/config/*' -d "${dir}"`, { stdio: 'ignore' });
      } catch {}
      const files = [];
      const walk = (d) => { if (!fs.existsSync(d)) return;
        for (const e of fs.readdirSync(d, { withFileTypes: true })) {
          const q = path.join(d, e.name);
          if (e.isDirectory()) walk(q);
          else files.push(path.relative(path.join(dir, 'overrides/config'), q));
        } };
      walk(path.join(dir, 'overrides/config'));
      summary.push({ pack: p.pack, mb, configs: files });
      console.log(`  ${p.pack.padEnd(30)} ${mb.padStart(6)} MB  ${String(files.length).padStart(4)} config files`);
    } catch (e) {
      console.log(`  ${p.pack}: ${e.message.slice(0, 60)}`);
    }
  }
  fs.writeFileSync('/tmp/peercfg/summary.json', JSON.stringify(summary, null, 1));

  // Which config files do multiple peers feel the need to override?
  const freq = new Map();
  for (const s of summary) for (const f of new Set(s.configs)) freq.set(f, (freq.get(f) || 0) + 1);
  const top = [...freq.entries()].filter(([, n]) => n >= 2).sort((a, b) => b[1] - a[1]);
  console.log(`\nConfig files shipped by >=2 of ${summary.length} peers:`);
  for (const [f, n] of top.slice(0, 60)) console.log(`  ${String(n).padStart(2)}  ${f}`);
})();
