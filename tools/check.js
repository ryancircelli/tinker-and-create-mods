#!/usr/bin/env node
/**
 * Staged gate — cheapest checks first, stop at the first failure.
 *
 * Each stage catches a strictly different class of problem, and they get
 * dramatically more expensive as you go down. Running them in order means a
 * broken slug costs seconds instead of twenty minutes.
 *
 *   node tools/check.js              run every stage until one fails
 *   node tools/check.js --parallel   run stages concurrently; kill the rest on
 *                                    the first failure (resolve is a barrier —
 *                                    it writes the .mrpack the others read)
 *   node tools/check.js --to=audit   stop after a named stage
 *   node tools/check.js --from=boot  skip ahead (assumes earlier stages passed)
 *   node tools/check.js --list       show the stages
 *
 * Stage        ~cost    catches
 * resolve       10s     bad slugs, alpha-only mods, unavailable versions
 * verify         30s    malformed manifest, dead download URLs, duplicate paths
 * audit          3m     duplicate mod ids, unsatisfiable declared version ranges
 * boot           6m     mixin failures, missing deps, declared incompatibilities
 * join          20m     login-time packet/registry desync — the only client check
 */

const { execSync, spawnSync } = require('child_process');

// No IPv6 route on this host — Node's default AAAA-first resolution produces
// intermittent ENETUNREACH under load. Force IPv4 for all stages.
process.env.NODE_OPTIONS = [process.env.NODE_OPTIONS, '--dns-result-order=ipv4first']
  .filter(Boolean).join(' ');
const path = require('path');

const STAGES = [
  { name: 'resolve', cost: '~10s', script: 'build.js', args: ['--dry-run'],
    catches: 'bad slugs, alpha-only mods, unavailable versions' },
  { name: 'verify', cost: '~30s', script: 'verify.js', args: [],
    catches: 'malformed manifest, dead URLs, duplicate paths' },
  { name: 'audit', cost: '~3m', script: 'audit.js', args: ['--deep'],
    catches: 'duplicate mod ids, unsatisfiable version ranges' },
  { name: 'boot', cost: '~6m', script: 'smoketest.js', args: [],
    catches: 'mixin failures, missing deps, incompatibilities' },
  { name: 'join', cost: '~20m', script: 'jointest.js', args: [],
    catches: 'login-time desync (client-side, nothing else sees it)' },
];

const argv = process.argv.slice(2);
const PARALLEL = argv.includes('--parallel') || argv.includes('-p');
const arg = (k) => (argv.find((a) => a.startsWith(`--${k}=`)) || '').split('=')[1];

if (argv.includes('--list')) {
  console.log('\nStages:\n');
  for (const s of STAGES) console.log(`  ${s.name.padEnd(9)}${s.cost.padEnd(7)}${s.catches}`);
  console.log();
  process.exit(0);
}

const from = arg('from');
const to = arg('to');
let started = !from;

// `resolve` writes the .mrpack every stage after it consumes, so it must run
// first unless explicitly skipped.
const buildFirst = !from || from === 'resolve';

console.log('');
const t0 = Date.now();
const results = [];

if (PARALLEL) { runParallel(); }
else {

for (const stage of STAGES) {
  if (!started) {
    if (stage.name === from) started = true;
    else { results.push([stage.name, 'skipped', 0]); continue; }
  }

  // The real build (not --dry-run) has to happen once so later stages have a pack.
  const args = stage.name === 'resolve' && buildFirst ? [] : stage.args;

  const label = `${stage.name} (${stage.cost})`;
  process.stdout.write(`▶ ${label.padEnd(20)} ${stage.catches}\n`);
  const started_at = Date.now();

  const r = spawnSync('node', [path.join(__dirname, stage.script), ...args], {
    stdio: ['ignore', 'pipe', 'pipe'], encoding: 'utf8', maxBuffer: 1 << 26,
  });
  const secs = ((Date.now() - started_at) / 1000).toFixed(0);
  const out = (r.stdout || '') + (r.stderr || '');

  if (r.status !== 0) {
    console.log(`\n  ✗ FAILED after ${secs}s\n`);
    const lines = out.split('\n').filter((l) => l.trim());
    console.log(lines.slice(-18).map((l) => '    ' + l).join('\n'));
    results.push([stage.name, 'FAILED', secs]);
    summarise(results, t0);
    console.log(`\nFix the above, then re-run from this stage:`);
    console.log(`  node tools/check.js --from=${stage.name}\n`);
    process.exit(1);
  }

  // Surface the one-line verdict rather than the whole log.
  const verdict = out.split('\n').reverse()
    .find((l) => /PASSED|Wrote \d+ mods|no BREAKING|Audited|Shipped/.test(l));
  console.log(`  ✓ ${secs}s${verdict ? '  — ' + verdict.trim().slice(0, 90) : ''}\n`);
  results.push([stage.name, 'passed', secs]);

  if (to && stage.name === to) break;
}

summarise(results, t0);
console.log('\nAll requested stages passed.\n');
}

/**
 * Speculative execution: resolve first (it produces the artifact), then every
 * remaining stage at once. The cheap stages usually fail within seconds, so the
 * expensive ones get killed long before they would have finished serially.
 */
function runParallel() {
  const { spawn } = require('child_process');
  const build = spawnSync('node', [path.join(__dirname, 'build.js')],
    { stdio: ['ignore', 'pipe', 'pipe'], encoding: 'utf8', maxBuffer: 1 << 26 });
  if (build.status !== 0) {
    console.log('✗ resolve FAILED\n' + (build.stdout || '').split('\n').slice(-12).join('\n'));
    process.exit(1);
  }
  // verify is cheap (~20s) and purely network-bound. Running it concurrently with
  // the heavy stages saturated the CDN and produced spurious "network error"
  // failures — verified by re-running it alone, where it passes. So: cheap checks
  // serially first, then overlap only the genuinely expensive stages.
  const vr = spawnSync('node', [path.join(__dirname, 'verify.js')],
    { stdio: ['ignore', 'pipe', 'pipe'], encoding: 'utf8', maxBuffer: 1 << 26 });
  if (vr.status !== 0) {
    console.log('✗ verify FAILED\n' + (vr.stdout || '').split('\n').slice(-14).join('\n'));
    process.exit(1);
  }
  console.log('✓ verify   — manifest and downloads OK');
  results.push(['verify', 'passed', 0]);

  const HEAVY = STAGES.filter((s) => ['audit', 'boot', 'join'].includes(s.name));
  console.log(`✓ resolve  — artifact written, launching ${HEAVY.length} heavy stages in parallel\n`);

  const running = new Map();
  let failed = false;

  // Every stage is network-bound against the same CDN. Running them flat out
  // exhausts connections and produces spurious "network error" failures that
  // look like real ones. Share a concurrency budget and stagger the starts.
  const perStage = Math.max(2, Math.floor(8 / HEAVY.length));
  let delay = 0;

  for (const stage of HEAVY) {
    const start = Date.now();
    const child = spawn('node', [path.join(__dirname, stage.script), ...stage.args],
      { stdio: ['ignore', 'pipe', 'pipe'],
        env: { ...process.env, NET_CONCURRENCY: String(perStage), START_DELAY_MS: String(delay) } });
    delay += 15000;
    let out = '';
    child.stdout.on('data', (d) => { out += d; });
    child.stderr.on('data', (d) => { out += d; });
    running.set(stage.name, child);

    child.on('exit', (code) => {
      running.delete(stage.name);
      const secs = ((Date.now() - start) / 1000).toFixed(0);
      if (code === 0) {
        const v = out.split('\n').reverse().find((l) => /PASSED|Audited|no BREAKING/.test(l));
        console.log(`  ✓ ${stage.name.padEnd(9)} ${secs}s${v ? '  — ' + v.trim().slice(0, 80) : ''}`);
        results.push([stage.name, 'passed', secs]);
      } else if (!failed) {
        failed = true;
        console.log(`\n  ✗ ${stage.name} FAILED after ${secs}s\n`);
        console.log(out.split('\n').filter((l) => l.trim()).slice(-16).map((l) => '    ' + l).join('\n'));
        results.push([stage.name, 'FAILED', secs]);
        for (const [n, c] of running) {
          console.log(`\n  killing ${n} (no longer useful)`);
          try { c.kill('SIGKILL'); } catch {}
        }
      } else {
        results.push([stage.name, 'killed', secs]);
      }
      if (running.size === 0) {
        summarise(results, t0);
        console.log(failed ? '\nFix the failure above and re-run.\n' : '\nAll stages passed.\n');
        process.exit(failed ? 1 : 0);
      }
    });
  }
}

function summarise(rows, start) {
  const total = ((Date.now() - start) / 1000).toFixed(0);
  console.log('─'.repeat(52));
  for (const [name, status, secs] of rows) {
    const mark = status === 'passed' ? '✓' : status === 'FAILED' ? '✗' : '–';
    console.log(`  ${mark} ${name.padEnd(10)}${status.padEnd(9)}${secs ? secs + 's' : ''}`);
  }
  console.log(`  total ${total}s`);
}
