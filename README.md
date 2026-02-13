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

### Docker (Local Testing)

Test the production Docker image locally:

```bash
# Build the image
docker build -t website .

# Run the container
docker run -p 5000:5000 website

# Or with custom port
docker run -p 8080:8080 -e PORT=8080 website
```

Visit `http://localhost:5000` (or your custom port).

## Deployment

### Recommended Platforms for Rust/Axum

**Important**: Vercel has deprecated Docker support and is optimized for serverless/static sites. For Rust applications, use these platforms instead:

#### Fly.io (Recommended)

Best for Rust applications with automatic scaling and global deployment:

```bash
# Install Fly CLI
curl -L https://fly.io/install.sh | sh

# Login and launch
flyctl auth login
flyctl launch  # Follow prompts (it will detect fly.toml)
flyctl deploy  # Deploy your app

# Open your app
flyctl open
```

**Cost**: Free tier includes 3 shared-cpu VMs with 256MB RAM each.

#### Railway

Simple deployment with GitHub integration:

```bash
# Install Railway CLI (optional - can also use web UI)
npm i -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

Or use the [Railway web dashboard](https://railway.app) to deploy directly from GitHub.

**Cost**: $5 free credit/month, then pay-as-you-go.

#### Render

Deploy with one click from GitHub:

1. Push your code to GitHub
2. Go to [render.com](https://render.com) and create a new Web Service
3. Connect your repository
4. Render will auto-detect the `render.yaml` configuration
5. Click "Create Web Service"

**Cost**: Free tier available with automatic sleep after inactivity.

### ~~Vercel~~ (Not Recommended)

Vercel no longer supports Docker deployments in the free tier and is not suitable for long-running server applications like Rust/Axum. Use the platforms above instead.

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
