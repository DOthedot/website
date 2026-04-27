const nunjucks = require('nunjucks');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'out');
const TEMPLATES_DIR = path.join(ROOT, 'templates');
const STATIC_DIR = path.join(ROOT, 'static');

// Configure nunjucks with the templates directory
nunjucks.configure(TEMPLATES_DIR, { autoescape: false });

// Blog data with epoch timestamps (seconds since Dec 10, 1999 11:11)
const EPOCH_BASE = new Date('1999-12-10T11:11:11').getTime();

const blogs = [
  { epoch: 826001492, slug: 'relativity', title: 'Why Time Slows Down When You Move Fast' },
  { epoch: 826001492, slug: 'quantum', title: 'The Weird World of Quantum Superposition' },
  { epoch: 826001492, slug: 'entropy', title: 'Entropy: Why the Arrow of Time Points Forward' },
  { epoch: 826001492, slug: 'black-holes', title: 'What Happens at the Edge of a Black Hole' },
  { epoch: 826450432, slug: 'consciousness', title: 'Why It Feels Like We Are Conscious' },
  { epoch: 827216051, slug: 'control', title: 'Control Is the Source of Freedom' },
  { epoch: 829442940, slug: 'participation', title: 'The Paradox of Participation' },
  { epoch: 832550400, slug: 'hunting-shadows', title: 'Hunting Shadows' },
].map(b => {
  const d = new Date(EPOCH_BASE + b.epoch * 1000);
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  b.date = `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
  return b;
});

// Sort descending by epoch
const blogsByEpoch = [...blogs].sort((a, b) => b.epoch - a.epoch);
const top5Blogs = blogsByEpoch.slice(0, 5);

// Map of template file → output path (relative to out/)
const pages = [
  { template: 'index.html', output: 'index.html' },
  { template: 'projects.html', output: 'projects.html' },
  { template: 'about.html', output: 'about.html' },
  { template: 'contact.html', output: 'contact.html' },
  { template: 'thought_century.html', output: 'thought-for-century.html' },
  { template: 'literary.html', output: 'literary.html' },
  { template: 'phone_poem.html', output: 'literary/phone-poem.html' },
  { template: 'homework_machine.html', output: 'literary/homework-machine.html' },
  { template: 'rain_poem.html', output: 'literary/when-the-rain.html' },
  { template: 'blog_relativity.html', output: 'blog/relativity.html' },
  { template: 'blog_quantum.html', output: 'blog/quantum.html' },
  { template: 'blog_entropy.html', output: 'blog/entropy.html' },
  { template: 'blog_blackholes.html', output: 'blog/black-holes.html' },
  { template: 'blog_consciousness.html', output: 'blog/consciousness.html' },
  { template: 'blog_control.html', output: 'blog/control.html' },
  { template: 'blog_participation.html', output: 'blog/participation.html' },
  { template: 'blog_hunting_shadows.html', output: 'blog/hunting-shadows.html' },
];

// Clean and recreate output directory
if (fs.existsSync(OUT_DIR)) {
  fs.rmSync(OUT_DIR, { recursive: true });
}
fs.mkdirSync(OUT_DIR, { recursive: true });

// Template data
const templateData = {
  'index.html': { blogs: top5Blogs },
  'literary.html': { blogs: blogsByEpoch },
};

// Render all pages
for (const page of pages) {
  const data = templateData[page.template] || {};
  const html = nunjucks.render(page.template, data);
  const outputPath = path.join(OUT_DIR, page.output);
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, html);
  console.log(`  ${page.template} → out/${page.output}`);
}

// Recursively copy a directory
function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Copy static assets
copyDir(STATIC_DIR, path.join(OUT_DIR, 'static'));
console.log('  Copied static/ → out/static/');

console.log('Build complete!');
