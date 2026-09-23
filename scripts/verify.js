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

if (problems.length || junk.length) process.exit(1);
console.log('verify: OK');
