/**
 * Content-addressed download cache shared by every harness stage.
 *
 * audit, boot and join each re-fetch the same ~150 mod jars, and join pulls
 * ~3,600 vanilla assets on every run. That was the single biggest cost in the
 * gate and the main source of network flakiness — every extra request is
 * another chance to hit the IPv6 problem below.
 *
 * Files are stored once under ~/.cache/tinker-and-create/<sha1[0:2]>/<sha1> and
 * hard-linked into each workspace, so N stages cost one download and ~zero disk.
 */

const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');

// This host has no IPv6 route. Node resolves AAAA first and intermittently
// throws ENETUNREACH mid-run; --dns-result-order does not reach undici's
// connect path, but the programmatic default does.
require('dns').setDefaultResultOrder('ipv4first');

const CACHE = process.env.TC_CACHE_DIR || path.join(os.homedir(), '.cache', 'tinker-and-create');
const UA = 'tinker-and-create/cache';

const sha1 = (buf) => crypto.createHash('sha1').update(buf).digest('hex');
const slot = (key) => path.join(CACHE, key.slice(0, 2), key);

let hits = 0, misses = 0, bytes = 0;

async function download(url, attempts = 6) {
  let last = '';
  for (let i = 0; i < attempts; i++) {
    try {
      const r = await fetch(url, { headers: { 'User-Agent': UA } });
      if (r.ok) return Buffer.from(await r.arrayBuffer());
      last = 'HTTP ' + r.status;
      if (r.status === 404) break; // not transient
    } catch (e) { last = e.message; }
    await new Promise((res) => setTimeout(res, 400 * 2 ** i));
  }
  throw new Error(`download failed (${last}): ${url}`);
}

/**
 * Fetch `url` into `dest`, going through the cache.
 * `key` should be the file's sha1 when the manifest provides one; otherwise a
 * stable identifier (asset hashes already are one).
 */
async function fetchCached(url, dest, key = null) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });

  if (key) {
    const cached = slot(key);
    if (fs.existsSync(cached)) {
      hits++;
      link(cached, dest);
      return;
    }
  }

  let buf = await download(url);

  // Verify before storing. A truncated response that still returns 200 would
  // otherwise be cached under the expected hash and reused forever.
  if (key && /^[0-9a-f]{40}$/i.test(key)) {
    let got = sha1(buf);
    if (got !== key.toLowerCase()) {
      buf = await download(url, 3);           // one clean retry
      got = sha1(buf);
      if (got !== key.toLowerCase()) {
        throw new Error(`checksum mismatch for ${url}\n  expected ${key}\n  got      ${got}`);
      }
    }
  }
  misses++; bytes += buf.length;

  const k = key || sha1(buf);
  const cached = slot(k);
  fs.mkdirSync(path.dirname(cached), { recursive: true });

  // Write to a temp name then rename, so concurrent stages never observe a
  // half-written cache entry.
  const tmp = cached + '.' + process.pid + '.tmp';
  fs.writeFileSync(tmp, buf);
  try { fs.renameSync(tmp, cached); } catch { fs.rmSync(tmp, { force: true }); }

  link(cached, dest);
}

function link(src, dest) {
  fs.rmSync(dest, { force: true });
  try { fs.linkSync(src, dest); }        // same filesystem: free
  catch { fs.copyFileSync(src, dest); }  // crossing devices: fall back
}

function stats() {
  const total = hits + misses;
  const pct = total ? ((hits / total) * 100).toFixed(0) : '0';
  return `cache ${hits}/${total} hits (${pct}%), ${(bytes / 1048576).toFixed(0)} MB fetched`;
}

module.exports = { fetchCached, download, stats, CACHE };
