/**
 * Read modrinth.index.json out of a remote .mrpack without downloading it.
 *
 * Scanning reference packs was costing ~60 MB each because .mrpack bundles an
 * overrides/ tree (configs, resource packs) that we do not care about. A zip's
 * central directory sits at the end of the file, so three range requests get
 * the manifest in ~50 KB regardless of pack size.
 *
 *   const manifest = await peek(url)
 */

const zlib = require('zlib');

// No IPv6 route on this host; without this, connects intermittently throw
// ENETUNREACH. Same reason as cache.js — kept local so peek stays standalone.
require('dns').setDefaultResultOrder('ipv4first');

const UA = 'tinker-and-create/peek';

async function range(url, from, to) {
  const headers = { 'User-Agent': UA, Range: `bytes=${from}-${to}` };
  const r = await fetch(url, { headers });
  if (!r.ok && r.status !== 206) throw new Error(`range ${from}-${to}: HTTP ${r.status}`);
  return Buffer.from(await r.arrayBuffer());
}

async function size(url) {
  const r = await fetch(url, { method: 'HEAD', headers: { 'User-Agent': UA } });
  const n = Number(r.headers.get('content-length'));
  if (!n) throw new Error('no content-length');
  return n;
}

async function peek(url) {
  const total = await size(url);

  // 1. End-of-central-directory lives in the last 64 KB (no zip64 handling —
  //    modpacks never approach 4 GB).
  const tailLen = Math.min(65536, total);
  const tail = await range(url, total - tailLen, total - 1);
  const eocd = tail.lastIndexOf(Buffer.from([0x50, 0x4b, 0x05, 0x06]));
  if (eocd < 0) throw new Error('no EOCD found');
  const cdSize = tail.readUInt32LE(eocd + 12);
  const cdOff = tail.readUInt32LE(eocd + 16);

  // 2. Walk the central directory for our entry.
  const cd = await range(url, cdOff, cdOff + cdSize - 1);
  let p = 0, found = null;
  while (p < cd.length - 46) {
    if (cd.readUInt32LE(p) !== 0x02014b50) break;
    const method = cd.readUInt16LE(p + 10);
    const compSize = cd.readUInt32LE(p + 20);
    const nameLen = cd.readUInt16LE(p + 28);
    const extraLen = cd.readUInt16LE(p + 30);
    const cmtLen = cd.readUInt16LE(p + 32);
    const localOff = cd.readUInt32LE(p + 42);
    const name = cd.toString('utf8', p + 46, p + 46 + nameLen);
    if (name === 'modrinth.index.json') { found = { method, compSize, localOff }; break; }
    p += 46 + nameLen + extraLen + cmtLen;
  }
  if (!found) throw new Error('modrinth.index.json not in central directory');

  // 3. Local header is 30 bytes + name + extra, then the data.
  const head = await range(url, found.localOff, found.localOff + 29);
  const nameLen = head.readUInt16LE(26);
  const extraLen = head.readUInt16LE(28);
  const start = found.localOff + 30 + nameLen + extraLen;
  const raw = await range(url, start, start + found.compSize - 1);

  const buf = found.method === 0 ? raw : zlib.inflateRawSync(raw);
  return JSON.parse(buf.toString('utf8'));
}

module.exports = { peek };
