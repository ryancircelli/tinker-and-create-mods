#!/usr/bin/env node
/**
 * Every mod encountered across the whole project, with a verdict for each.
 *
 * Sources, in order of authority:
 *   1. tools/mods.json               — what ships, and what was banned/removed here
 *   2. archived Fabric mods.json     — the 1.20.1-era rejections
 *   3. scan/candidates.json          — 1,216 projects seen across 34 reference packs
 *
 * Descriptions come from Modrinth; verdicts come from recorded failures, not memory.
 *
 *   node tools/catalogue.js > CATALOGUE.md
 */

const fs = require('fs');
const path = require('path');
require('dns').setDefaultResultOrder('ipv4first');

const UA = 'tinker-and-create/catalogue';
const HERE = path.join(__dirname, 'mods.json');
const FABRIC = '/home/ryanc/dev/archive/tinker-and-create-fabric-1.20.1/tools/mods.json';
const SCAN = '/tmp/claude-1000/-home-ryanc/98f9dd6e-1fc5-4e9d-9046-6f6c67016811/scratchpad/scan/candidates.json';

const load = (p) => { try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch { return null; } };
const cur = load(HERE), fab = load(FABRIC), scan = load(SCAN) || [];

const entries = new Map(); // slug -> {slug, name, verdict, reason, desc, packs}
const put = (slug, o) => {
  if (!slug) return;
  const e = entries.get(slug) || { slug };
  entries.set(slug, { ...e, ...o, slug });
};

// 0. Ground truth for what actually ships is the built manifest, not mods.json —
//    dependencies are auto-resolved and never appear in the hand-written list.
//    (Moonlight, for example, is banned in the Fabric archive but ships here via
//    Amendments; without this it would be catalogued as banned, which is wrong.)
let shippedIds = new Set();
try {
  const { execSync } = require('child_process');
  const pk = path.join(__dirname, '..', 'packs', `tinker-and-create-${cur.pack.version}.mrpack`);
  const man = JSON.parse(execSync(`unzip -p "${pk}" modrinth.index.json`, { encoding: 'utf8', maxBuffer: 1 << 26 }));
  shippedIds = new Set(man.files.map((f) => f.hashes.sha1));
  global.__manifest = man;
} catch {}

// 1. shipped
for (const m of cur.mods) {
  put(m.slug, { name: m.name, verdict: 'INCLUDED', category: m.category,
    reason: m['//revived'] || m['//known-issue'] || m['//version'] || '' });
}
// 2. rejections here and in the archive (first reason wins — this config is newer)
for (const src of [cur, fab]) {
  if (!src) continue;
  for (const [list, kind] of [[src.banned || [], 'BANNED'], [src.removed || [], 'REMOVED']]) {
    for (const r of list) {
      if (entries.get(r.slug)?.verdict === 'INCLUDED') continue;
      if (entries.has(r.slug) && entries.get(r.slug).reason) continue;
      put(r.slug, { name: r.name || r.slug, verdict: kind, reason: (r.reason || '').replace(/\s+/g, ' ') });
    }
  }
}
// 3. everything else seen while scanning reference packs
for (const c of scan) {
  if (entries.has(c.slug)) {
    const e = entries.get(c.slug);
    if (c.packs && !e.packs) put(c.slug, { packs: c.packs });
    continue;
  }
  put(c.slug, { name: c.title || c.slug, verdict: 'EVALUATED', packs: c.packs || 0,
    desc: c.desc || '', reason: 'Seen in reference packs; not selected — see the note at the end of this section.' });
}

(async () => {
  // Resolve every jar in the built manifest to its project, so auto-added
  // dependencies are marked INCLUDED rather than inheriting a stale rejection.
  const man = global.__manifest;
  if (man) {
    const hashes = man.files.map((f) => f.hashes.sha1);
    const ids = new Set();
    for (let i = 0; i < hashes.length; i += 60) {
      try {
        const r = await fetch('https://api.modrinth.com/v2/version_files', {
          method: 'POST', headers: { 'User-Agent': UA, 'Content-Type': 'application/json' },
          body: JSON.stringify({ hashes: hashes.slice(i, i + 60), algorithm: 'sha1' }) });
        if (r.ok) for (const v of Object.values(await r.json())) ids.add(v.project_id);
      } catch {}
    }
    for (let i = 0; i < [...ids].length; i += 40) {
      const q = encodeURIComponent(JSON.stringify([...ids].slice(i, i + 40)));
      try {
        const r = await fetch(`https://api.modrinth.com/v2/projects?ids=${q}`, { headers: { 'User-Agent': UA } });
        if (!r.ok) continue;
        for (const p of await r.json()) {
          const e = entries.get(p.slug);
          put(p.slug, { name: p.title, desc: (p.description || '').replace(/\s+/g, ' '), dl: p.downloads,
            verdict: 'INCLUDED',
            category: e?.category || 'Auto-resolved dependency',
            reason: e && e.verdict !== 'INCLUDED' && e.reason
              ? `Previously rejected — that reason no longer applies here: ${e.reason}` : (e?.reason || '') });
        }
      } catch {}
    }
  }

  // Fill in descriptions for anything we lack one for.
  const need = [...entries.values()].filter((e) => !e.desc).map((e) => e.slug);
  for (let i = 0; i < need.length; i += 40) {
    const q = encodeURIComponent(JSON.stringify(need.slice(i, i + 40)));
    try {
      const r = await fetch(`https://api.modrinth.com/v2/projects?ids=${q}`, { headers: { 'User-Agent': UA } });
      if (!r.ok) continue;
      for (const p of await r.json()) {
        if (!entries.has(p.slug)) continue;
        const e = entries.get(p.slug);
        put(p.slug, { desc: (p.description || '').replace(/\s+/g, ' '), dl: p.downloads,
          name: (!e.name || e.name === e.slug) ? p.title : e.name });
      }
    } catch {}
    process.stderr.write('.');
  }
  process.stderr.write('\n');

  const all = [...entries.values()];
  const by = (v) => all.filter((e) => e.verdict === v).sort((a, b) => (a.name || a.slug).localeCompare(b.name || b.slug));
  const inc = by('INCLUDED'), ban = by('BANNED'), rem = by('REMOVED'), ev = by('EVALUATED');

  const L = [];
  L.push('# Tinker & Create — complete mod catalogue\n');
  L.push('Every mod encountered across this project, with a verdict for each.');
  L.push('Target: **MC 1.21.1 / NeoForge 21.1.248**.\n');
  L.push(`| Verdict | Count |`);
  L.push(`| --- | --- |`);
  L.push(`| Included | **${inc.length}** |`);
  L.push(`| Banned (hard failure) | **${ban.length}** |`);
  L.push(`| Removed (unavailable, redundant, or a design call) | **${rem.length}** |`);
  L.push(`| Evaluated, not selected | **${ev.length}** |`);
  L.push(`| **Total seen** | **${all.length}** |`);

  const dl = (e) => (e.dl ? ` · ${(e.dl / 1e6).toFixed(1)}M dl` : '');
  const pk = (e) => (e.packs ? ` · in ${e.packs}/34 packs` : '');

  L.push('\n## Included\n');
  const cats = {};
  for (const e of inc) (cats[e.category || 'Uncategorised'] ||= []).push(e);
  for (const c of Object.keys(cats).sort()) {
    L.push(`\n### ${c} (${cats[c].length})\n`);
    for (const e of cats[c]) {
      L.push(`- **${e.name}** \`${e.slug}\`${dl(e)}${pk(e)}`);
      if (e.desc) L.push(`  ${e.desc}`);
      if (e.reason) L.push(`  *Note:* ${e.reason}`);
    }
  }

  L.push('\n## Banned — hard failures\n');
  L.push('Each of these broke something observable: a loader abort, a mixin with no target,');
  L.push('a declared incompatibility, or a crash. None are judgement calls.\n');
  for (const e of ban) {
    L.push(`- **${e.name}** \`${e.slug}\`${dl(e)}`);
    if (e.desc) L.push(`  ${e.desc}`);
    L.push(`  **Failure:** ${e.reason}`);
  }

  L.push('\n## Removed — unavailable, redundant, or a design decision\n');
  for (const e of rem) {
    L.push(`- **${e.name}** \`${e.slug}\`${dl(e)}`);
    if (e.desc) L.push(`  ${e.desc}`);
    L.push(`  **Reason:** ${e.reason}`);
  }

  L.push('\n## Evaluated, not selected\n');
  L.push('Seen while scanning 34 working 1.21.1 NeoForge modpacks. These were not rejected on');
  L.push('merit — most are libraries pulled in as dependencies elsewhere, exploration/adventure');
  L.push('content that does not fit a Create pack, or simply were not needed. The pack-count');
  L.push('column shows how many of the 34 reference packs used each, which is a decent proxy');
  L.push('for how battle-tested it is.\n');
  for (const e of ev.sort((a, b) => (b.packs || 0) - (a.packs || 0))) {
    L.push(`- **${e.name}** \`${e.slug}\`${dl(e)}${pk(e)}${e.desc ? ' — ' + e.desc : ''}`);
  }

  L.push('\n---\n');
  L.push('Verdicts in the Banned and Removed sections were recorded from actual observed');
  L.push('failures during build, boot, or client-join testing. Where a decision was taste');
  L.push('rather than a fault — electricity mods, Waystones versus rail, flying contraptions —');
  L.push('the reason says so plainly.\n');

  console.log(L.join('\n'));
})();
