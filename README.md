# Portfolio Website

A minimalist, high-performance portfolio website built with Rust (Axum + Tera), featuring monospace typography and a clean, distraction-free design.

## Tech Stack

- **Backend**: Rust with [Axum](https://github.com/tokio-rs/axum) web framework
- **Templating**: [Tera](https://tera.rs/) (Jinja2-like templating engine)
- **Static Files**: Tower HTTP for serving assets

## Features

- Clean, monospace typography
- Minimalist design with focus on content
- Fully responsive layout
- Portfolio project showcase
- Literary works section
- SEO-friendly static pages

## Getting Started

### Prerequisites

- [Rust](https://rustup.rs/) (1.70+)

### Development

```bash
# Run the development server
cargo run
```

The server will start at `http://localhost:5000`. Use a custom port:

```bash
PORT=8080 cargo run
```

### Production Build

```bash
# Build optimized release
cargo build --release

# Run the production binary
./target/release/website
```

## Deployment

### Vercel

Deploys automatically via `vercel.json` configuration.

## Project Structure

```
website/
├── Cargo.toml          # Rust dependencies
├── Dockerfile          # Docker configuration
├── vercel.json         # Vercel deployment config
├── src/
│   └── main.rs         # Axum server & routes
├── templates/          # Tera HTML templates
│   ├── base.html       # Base layout
│   ├── index.html      # Home page
│   ├── about.html      # About page
│   ├── projects.html   # Projects showcase
│   └── literary.html   # Literary works
└── static/
    ├── css/
    │   └── style.css   # Stylesheet
    ├── images/
    └── fonts/
```

## Customization

| Section | File |
|---------|------|
| Page content | Edit templates in `templates/` |
| Styling | Modify `static/css/style.css` |
| Routes | Add new routes in `src/main.rs` |

## License

MIT License - see [LICENSE](LICENSE) for details.
