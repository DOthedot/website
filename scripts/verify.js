// Verifies the built site in out/: every internal link and asset reference
// must resolve to a file that exists. Run via `npm run verify` (which builds
// first). Exits non-zero on the first broken reference so CI and pre-push
// checks fail loudly.

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'out');

if (!fs.existsSync(OUT_DIR)) {
  console.error('verify: out/ does not exist — run `npm run build` first.');
  process.exit(1);
}

// Collect every file under a directory, as paths relative to it.
function walk(dir, base = dir) {
  const found = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      found.push(...walk(full, base));
    } else {
      found.push(path.relative(base, full));
    }
  }
  return found;
}

const allFiles = new Set(walk(OUT_DIR).map(f => f.split(path.sep).join('/')));
const htmlFiles = [...allFiles].filter(f => f.endsWith('.html'));

// vercel.json sets cleanUrls, so "/about" is served by out/about.html and a
// bare directory path is served by its index.html. Mirror both here.
function resolveTarget(href) {
  const clean = href.split('#')[0].split('?')[0];
  if (clean === '' || clean === '/') return 'index.html';
  const rel = clean.replace(/^\//, '').replace(/\/$/, '');
  if (allFiles.has(rel)) return rel;
  if (allFiles.has(rel + '.html')) return rel + '.html';
  if (allFiles.has(rel + '/index.html')) return rel + '/index.html';
  return null;
}

const REF = /(?:href|src)="([^"]+)"/g;
const problems = [];
let checked = 0;

for (const file of htmlFiles) {
  const html = fs.readFileSync(path.join(OUT_DIR, file), 'utf8');
  let m;
  while ((m = REF.exec(html)) !== null) {
    const ref = m[1];
    // Only internal, root-relative references are ours to verify.
    if (!ref.startsWith('/')) continue;
    checked++;
    if (resolveTarget(ref) === null) {
      problems.push(`${file} → ${ref}`);
    }
  }
}

// A script from an origin the CSP's script-src doesn't list is silently
// blocked by the browser, so every external <script src> must be allowed.
const vercel = JSON.parse(fs.readFileSync(path.join(ROOT, 'vercel.json'), 'utf8'));
const csp = vercel.headers
  .flatMap(h => h.headers)
  .find(h => h.key === 'Content-Security-Policy').value;
const scriptSrc = csp.split(';').map(d => d.trim().split(/\s+/))
  .find(([name]) => name === 'script-src').slice(1);

// A whole <script …> opening tag; quoted values may themselves contain ">".
const SCRIPT_TAG = /<script\b(?:[^>"']|"[^"]*"|'[^']*')*>/gi;
// One attribute: a name, then optionally = and a double-, single- or unquoted
// value. Matching attributes in sequence consumes each value whole, so text
// inside a value (a stray `src=` or `async`) can never pass for an attribute.
const ATTR = /\s([^\s"'=<>/]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+)))?/g;

function externalScript(tag) {
  const attrs = new Map();
  for (const [, name, dq, sq, bare] of tag.matchAll(ATTR)) {
    const key = name.toLowerCase();
    // Browsers keep the first of a duplicated attribute.
    if (!attrs.has(key)) attrs.set(key, dq ?? sq ?? bare ?? '');
  }
  const src = attrs.get('src');
  if (!src || !/^https?:\/\//i.test(src)) return null;
  return { src, isAsync: attrs.has('async') };
}

const blocked = new Set();
// Deferred scripts run in document order, so an external script marked defer
// makes the site's own deferred scripts wait for a third-party download.
// External scripts must be async so they never hold up first-party JS.
const notAsync = new Set();
for (const file of htmlFiles) {
  const html = fs.readFileSync(path.join(OUT_DIR, file), 'utf8');
  for (const [tag] of html.matchAll(SCRIPT_TAG)) {
    const script = externalScript(tag);
    if (!script) continue;
    const origin = new URL(script.src).origin;
    if (!scriptSrc.includes(origin)) blocked.add(`${file} → ${origin}`);
    // Deduped by src: every page shares base.html, so per-page lines are noise.
    if (!script.isAsync) notAsync.add(script.src);
  }
}

// Files that should never reach production.
const junk = [...allFiles].filter(f => /(^|\/)\.DS_Store$|\.md$/.test(f));

console.log(`verify: ${htmlFiles.length} pages, ${checked} internal references checked`);

if (problems.length) {
  console.error(`\nverify: ${problems.length} broken reference(s):`);
  for (const p of problems) console.error(`  ${p}`);
}
if (junk.length) {
  console.error(`\nverify: ${junk.length} file(s) that should not ship:`);
  for (const j of junk) console.error(`  out/${j}`);
}

if (blocked.size) {
  console.error(`\nverify: ${blocked.size} script origin(s) missing from CSP script-src:`);
  for (const b of blocked) console.error(`  ${b}`);
}

if (notAsync.size) {
  console.error(`\nverify: ${notAsync.size} external script(s) not loaded async:`);
  for (const s of notAsync) console.error(`  ${s}`);
}

if (problems.length || junk.length || blocked.size || notAsync.size) process.exit(1);
console.log('verify: OK');
