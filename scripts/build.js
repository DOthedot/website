const nunjucks = require('nunjucks');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'out');
const TEMPLATES_DIR = path.join(ROOT, 'templates');
const STATIC_DIR = path.join(ROOT, 'static');

// Configure nunjucks with the templates directory
nunjucks.configure(TEMPLATES_DIR, { autoescape: false });

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
  { template: 'last_page_poem.html', output: 'literary/last-page.html' },
  { template: 'rain_poem.html', output: 'literary/when-the-rain.html' },
  { template: 'blog_relativity.html', output: 'blog/relativity.html' },
  { template: 'blog_quantum.html', output: 'blog/quantum.html' },
  { template: 'blog_entropy.html', output: 'blog/entropy.html' },
  { template: 'blog_blackholes.html', output: 'blog/black-holes.html' },
  { template: 'blog_consciousness.html', output: 'blog/consciousness.html' },
  { template: 'blog_control.html', output: 'blog/control.html' },
];

// Clean and recreate output directory
if (fs.existsSync(OUT_DIR)) {
  fs.rmSync(OUT_DIR, { recursive: true });
}
fs.mkdirSync(OUT_DIR, { recursive: true });

// Render all pages
for (const page of pages) {
  const html = nunjucks.render(page.template, {});
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
