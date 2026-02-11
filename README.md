# Portfolio Website

A minimalist portfolio website with a Rust backend (Axum + Tera), monospace fonts, and clean design.

## Features

- Clean, monospace typography
- Minimalist design principles
- Simple HTML structure
- Responsive layout
- Portfolio-focused content
- Easy to customize

## Setup

1. Install [Rust](https://rustup.rs/) if you haven't already.

2. Run the application:
```bash
cargo run
```

3. Open your browser and navigate to `http:/DOthedotlocalhost:5000`

To use a different port:
```bash
PORT=8080 cargo run
```

## Project Structure

```
website/
├── Cargo.toml          # Rust dependencies
├── src/
│   └── main.rs         # Axum server & routes
├── templates/          # HTML templates (Tera/Jinja2-like)
│   ├── base.html       # Base template
│   ├── index.html      # Home page
│   ├── about.html      # About page
│   ├── projects.html   # Projects page
│   └── literary.html   # Literary works
└── static/
    └── css/
        └── style.css   # Stylesheet
```

## Customization

- Edit templates in `templates/` directory
- Modify styles in `static/css/style.css`
- Add new routes in `src/main.rs`

## License

MIT
