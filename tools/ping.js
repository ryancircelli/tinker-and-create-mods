#!/usr/bin/env node
/**
 * Minecraft server-list ping. Proves a route actually carries the MC protocol,
 * not merely that a TCP port accepts connections -- which is the difference
 * between "the tunnel is up" and "a player can join through it".
 *
 *   node tools/ping.js [host] [port]
 */
const net = require('net');
// WSL2 here advertises IPv6 routes but has no IPv6 connectivity, so a dual-stack
// name resolves to AAAA and the connect dies with ENETUNREACH. cache.js pins
// IPv4 for the same reason.
require('dns').setDefaultResultOrder('ipv4first');

const host = process.argv[2] || '127.0.0.1';
const port = Number(process.argv[3] || 25565);
// Optional 4th arg: hostname to send INSIDE the MC handshake. playit tunnels with
// hostname_verify_level=NoRawIp reject handshakes carrying a raw IP, so the
// connect target and the advertised name must be settable independently.
const sni = process.argv[4] || host;

const varint = (n) => {
  const out = [];
  do { let b = n & 0x7f; n >>>= 7; if (n) b |= 0x80; out.push(b); } while (n);
  return Buffer.from(out);
};
const packet = (...parts) => {
  const body = Buffer.concat(parts);
  return Buffer.concat([varint(body.length), body]);
};
const str = (s) => Buffer.concat([varint(Buffer.byteLength(s)), Buffer.from(s)]);

// Resolve A explicitly rather than letting the stack pick: this box has broken
// IPv6, and dual-stack names would otherwise be tried over AAAA and die. The
// handshake still advertises the original NAME, which is what playit's
// hostname_verify_level=NoRawIp requires.
// Resolve via a public resolver: WSL's forwarder (10.255.255.254) negative-caches
// NODATA for freshly-created tunnel hostnames and keeps serving it long after the
// record exists, which looks exactly like an outage that isn't there.
const { Resolver } = require('dns').promises;
const dnsp = new Resolver(); dnsp.setServers(['1.1.1.1']);
const isIp = /^[0-9.]+$/.test(host);
(async () => {
const target = isIp ? host : (await dnsp.resolve4(host).catch(() => [host]))[0];
const sock = net.createConnection({ host: target, port }, () => {
  const portBuf = Buffer.alloc(2); portBuf.writeUInt16BE(port);
  // 767 = protocol version for 1.21.1; the server echoes its own regardless.
  sock.write(packet(varint(0x00), varint(767), str(sni), portBuf, varint(1)));
  sock.write(packet(varint(0x00)));
});

let buf = Buffer.alloc(0);
sock.on('data', (d) => {
  buf = Buffer.concat([buf, d]);
  const brace = buf.indexOf(0x7b); // '{' -- start of the status JSON
  if (brace < 0) return;
  try {
    const json = JSON.parse(buf.slice(brace).toString('utf8'));
    const players = json.players || {};
    console.log(`  MOTD:    ${(json.description?.text ?? json.description) || '(none)'}`);
    console.log(`  Version: ${json.version?.name}  (protocol ${json.version?.protocol})`);
    console.log(`  Players: ${players.online}/${players.max}`);
    console.log('\nPING OK — the MC protocol survives this route.');
    sock.destroy(); process.exit(0);
  } catch { /* JSON still arriving */ }
});
sock.on('error', (e) => { console.error(`PING FAILED: ${e.message}`); process.exit(1); });
setTimeout(() => { console.error('PING FAILED: timed out'); process.exit(1); }, 20000);
})();
