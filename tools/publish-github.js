#!/usr/bin/env node
/**
 * Cut a GitHub release containing the current .mrpack, so servers can fetch the
 * newest build without Modrinth.
 *
 *   node tools/publish-github.js [--repo owner/name]
 *
 * The jars and the pack live in the same repo, so releases are mixed. The tag is
 * prefixed `pack-v` and the server script selects the newest release that
 * actually carries a .mrpack asset -- otherwise a jar-only release would look
 * like the latest pack and the server would never update.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const DATA = JSON.parse(fs.readFileSync(path.join(__dirname, 'mods.json'), 'utf8'));
const version = DATA.pack.version;

const repoArg = process.argv.indexOf('--repo');
const REPO = repoArg >= 0 ? process.argv[repoArg + 1] : 'ryancircelli/tinker-and-create-mods';

const pack = path.join(ROOT, 'packs', `tinker-and-create-${version}.mrpack`);
if (!fs.existsSync(pack)) {
  console.error(`No pack at ${pack} — run: node tools/build.js`);
  process.exit(1);
}

const tag = `pack-v${version}`;
const sh = (cmd) => execSync(cmd, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();

// Releases are immutable by policy: the manifest pins hashes, and a replaced
// asset breaks installs that already resolved it. Refuse rather than clobber.
let exists = true;
try { sh(`gh release view ${tag} --repo ${REPO}`); } catch { exists = false; }
if (exists) {
  console.error(`Release ${tag} already exists on ${REPO}.`);
  console.error('Bump pack.version in tools/mods.json and rebuild — do not replace a published asset.');
  process.exit(1);
}

const notes = `Tinker & Create ${version} — Minecraft ${DATA.pack.minecraft} / ${DATA.pack.loader}\n\n`
  + `Modpack manifest only (~${(fs.statSync(pack).size / 1024).toFixed(0)} KB); all mods download from CDNs.\n`;

console.log(`Publishing ${path.basename(pack)} as ${tag} on ${REPO}...`);
execSync(
  `gh release create ${tag} "${pack}" --repo ${REPO} --title "Pack ${version}" --notes ${JSON.stringify(notes)}`,
  { stdio: 'inherit' }
);
console.log(`\nDone. Servers will pick it up on next restart.`);
