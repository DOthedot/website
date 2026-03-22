# DOthedot — Personal Website

A minimalist personal portfolio and writing space. Built with a focus on content over complexity — clean monospace typography, zero JavaScript frameworks, and a static build pipeline that deploys in seconds.

**Live site**: [dothedot.vercel.app](https://dothedot.vercel.app)

---

## Overview

The site is a collection of three things:

- **Projects** — engineering work across data pipelines, AI systems, and tooling
- **Blog** — long-form writing on physics, philosophy, and ideas
- **Literary works** — poems and short pieces

Pages are authored as HTML templates, rendered at build time into static files, and served via Vercel's CDN. No server, no database, no runtime dependencies.

---

## Tech Stack

| Layer | Technology |
| --- | --- |
| Templating | [Nunjucks](https://mozilla.github.io/nunjucks/) |
| Build | Node.js (`scripts/build.js`) |
| Hosting | [Vercel](https://vercel.com) (static) |
| Styling | Vanilla CSS, monospace typography |

---

## Project Structure

```text
website/
├── templates/              # Nunjucks HTML templates
│   ├── base.html           # Base layout (nav, footer, head)
│   ├── index.html          # Home page
│   ├── about.html          # About page
│   ├── projects.html       # Projects showcase
│   ├── contact.html        # Contact form
│   ├── literary.html       # Literary works index
│   ├── blog_*.html         # Blog articles
│   └── *_poem.html         # Poems
├── static/
│   ├── css/style.css       # Stylesheet
│   ├── images/             # Article and page images
│   └── fonts/              # Local font files
├── scripts/
│   └── build.js            # Build script — renders templates → out/
├── out/                    # Generated static site (Vercel serves this)
├── package.json
└── vercel.json             # Vercel config
```

---

## Getting Started

### Prerequisites

- Node.js 18+

### Install dependencies

```bash
npm install
```

### Run locally

```bash
npm run dev
```

Builds the site and starts a local server at `http://localhost:3000`.

### Build only

```bash
npm run build
```

Renders all templates into `out/`. The `out/` directory is what Vercel deploys.

---

## Adding Content

### New blog post

1. Create `templates/blog_<slug>.html` extending `base.html`
2. Add an entry to the `pages` array in `scripts/build.js`
3. Add a route to `src/main.rs` *(if running the server locally)*
4. Link it from `templates/index.html` and/or `templates/literary.html`

### New poem

Same steps as a blog post — use an existing poem template as reference.

### New project

Edit `templates/projects.html` directly.

---

## Deployment

The site deploys automatically on every push to `main` via Vercel.

**Manual deploy:**

```bash
npm run build
vercel --prod
```

Vercel config (`vercel.json`):

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "out",
  "cleanUrls": true
}
```

`cleanUrls: true` strips `.html` extensions so `/about` works instead of `/about.html`.

---

## Customization

| What | Where |
| --- | --- |
| Layout, nav, footer | `templates/base.html` |
| Styles | `static/css/style.css` |
| Adding a page | Create template → add to `scripts/build.js` |
| Images | `static/images/` |

---

## License

MIT
