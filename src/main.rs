use axum::{
    extract::{Query, State, Form},
    response::{Html, IntoResponse, Response},
    routing::get,
    Router,
};
use serde::Deserialize;
use std::net::SocketAddr;
use std::sync::Arc;
use tera::Tera;
use tower_http::services::ServeDir;


#[derive(Deserialize)]
struct BlogQuery {
    from: Option<String>,
}

#[derive(Deserialize, Debug)]
#[allow(dead_code)]
struct ContactForm {
    name: String,
    email: String,
    message: String,
}

#[derive(Clone)]
struct AppState {
    tera: Arc<Tera>,
}



#[tokio::main]
async fn main() {
    let templates_path = concat!(env!("CARGO_MANIFEST_DIR"), "/templates/**/*");
    let tera = Tera::new(templates_path).expect("Failed to load templates");
    let state = AppState {
        tera: Arc::new(tera),
    };

    let static_dir = concat!(env!("CARGO_MANIFEST_DIR"), "/static");
    let static_service = ServeDir::new(static_dir);

    let app = Router::new()
        .route("/", get(index))
        .route("/_health", get(health_check))
        .route("/projects", get(projects))
        .route("/about", get(about))
        .route("/thought-for-century", get(thought_century))
        .route("/contact", get(contact_page).post(contact_submit))
        .route("/literary", get(literary))
        .route("/literary/phone-poem", get(phone_poem))
        .route("/literary/homework-machine", get(homework_machine))
        .route("/literary/last-page", get(last_page_poem))
        .route("/literary/when-the-rain", get(rain_poem))
        .route("/blog/relativity", get(blog_relativity))
        .route("/blog/quantum", get(blog_quantum))
        .route("/blog/entropy", get(blog_entropy))
        .route("/blog/black-holes", get(blog_black_holes))
        .nest_service("/static", static_service)
        .with_state(state);

    let start_port: u16 = std::env::var("PORT")
        .ok()
        .and_then(|p| p.parse().ok())
        .unwrap_or(5000);
    const MAX_ATTEMPTS: u16 = 10;

    let (listener, port) = if std::env::var("PORT").is_ok() {
        // PORT was set: use it and fail if it's in use
        let addr = SocketAddr::from(([0, 0, 0, 0], start_port));
        let listener = tokio::net::TcpListener::bind(addr)
            .await
            .unwrap_or_else(|_| panic!("Failed to bind to port {} (PORT is set)", start_port));
        (listener, start_port)
    } else {
        // PORT not set: try start_port, then start_port+1, ... until bind succeeds
        let mut last_err = None;
        for i in 0..MAX_ATTEMPTS {
            let port = start_port + i;
            let addr = SocketAddr::from(([0, 0, 0, 0], port));
            match tokio::net::TcpListener::bind(addr).await {
                Ok(listener) => {
                    println!("Starting server on port {}", port);
                    println!("Open http://localhost:{} in your browser", port);
                    axum::serve(listener, app).await.expect("Server error");
                    return;
                }
                Err(e) => last_err = Some((port, e)),
            }
        }
        panic!(
            "Could not bind to any port from {} to {}: {:?}",
            start_port,
            start_port + MAX_ATTEMPTS - 1,
            last_err
        );
    };

    println!("Starting server on port {}", port);
    println!("Open http://localhost:{} in your browser", port);
    axum::serve(listener, app).await.expect("Server error");
}

fn render(state: &AppState, template: &str) -> Result<Response, tera::Error> {
    let ctx = tera::Context::new();
    let html = state.tera.render(template, &ctx)?;
    Ok(Html(html).into_response())
}

async fn health_check() -> &'static str {
    "OK"
}

async fn index(State(state): State<AppState>) -> Response {
    render(&state, "index.html").unwrap_or_else(|e| {
        (axum::http::StatusCode::INTERNAL_SERVER_ERROR, e.to_string()).into_response()
    })
}

async fn projects(State(state): State<AppState>) -> Response {
    render(&state, "projects.html").unwrap_or_else(|e| {
        (axum::http::StatusCode::INTERNAL_SERVER_ERROR, e.to_string()).into_response()
    })
}

async fn about(State(state): State<AppState>) -> Response {
    render(&state, "about.html").unwrap_or_else(|e| {
        (axum::http::StatusCode::INTERNAL_SERVER_ERROR, e.to_string()).into_response()
    })
}

async fn thought_century(State(state): State<AppState>) -> Response {
    render(&state, "thought_century.html").unwrap_or_else(|e| {
        (axum::http::StatusCode::INTERNAL_SERVER_ERROR, e.to_string()).into_response()
    })
}

async fn contact_page(State(state): State<AppState>) -> Response {
    render(&state, "contact.html").unwrap_or_else(|e| {
        (axum::http::StatusCode::INTERNAL_SERVER_ERROR, e.to_string()).into_response()
    })
}

async fn contact_submit(
    State(state): State<AppState>,
    Form(form): Form<ContactForm>,
) -> Response {
    println!("Received contact form: {:?}", form);
    
    // Google Form submission
    let client = reqwest::Client::new();
    let google_form_url = "https://docs.google.com/forms/d/e/1FAIpQLSfjjd0slqYgPp5lssr1wdYn0_Ryr-ZRS07vaGvV621HSJg0_g/formResponse";
    let params = [
        ("entry.1042344079", &form.name),
        ("entry.979343976", &form.email),
        ("entry.1793433401", &form.message),
    ];

    match client.post(google_form_url).form(&params).send().await {
        Ok(res) => println!("Google Form submission status: {}", res.status()),
        Err(e) => println!("Failed to submit to Google Form: {}", e),
    }
    
    let mut ctx = tera::Context::new();
    ctx.insert("success", &true);
    
    let html = state.tera.render("contact.html", &ctx)
        .unwrap_or_else(|e| e.to_string());
    Html(html).into_response()
}

async fn literary(State(state): State<AppState>) -> Response {
    render(&state, "literary.html").unwrap_or_else(|e| {
        (axum::http::StatusCode::INTERNAL_SERVER_ERROR, e.to_string()).into_response()
    })
}

async fn phone_poem(State(state): State<AppState>) -> Response {
    render(&state, "phone_poem.html").unwrap_or_else(|e| {
        (axum::http::StatusCode::INTERNAL_SERVER_ERROR, e.to_string()).into_response()
    })
}

async fn homework_machine(State(state): State<AppState>) -> Response {
    render(&state, "homework_machine.html").unwrap_or_else(|e| {
        (axum::http::StatusCode::INTERNAL_SERVER_ERROR, e.to_string()).into_response()
    })
}

async fn last_page_poem(State(state): State<AppState>) -> Response {
    render(&state, "last_page_poem.html").unwrap_or_else(|e| {
        (axum::http::StatusCode::INTERNAL_SERVER_ERROR, e.to_string()).into_response()
    })
}

async fn rain_poem(State(state): State<AppState>) -> Response {
    render(&state, "rain_poem.html").unwrap_or_else(|e| {
        (axum::http::StatusCode::INTERNAL_SERVER_ERROR, e.to_string()).into_response()
    })
}

async fn blog_relativity(State(state): State<AppState>, Query(params): Query<BlogQuery>) -> Response {
    let mut ctx = tera::Context::new();
    let (back_link, back_text) = match params.from.as_deref() {
        Some("literary") => ("/literary", "literary works"),
        _ => ("/", "home"),
    };
    ctx.insert("back_link", back_link);
    ctx.insert("back_text", back_text);
    
    let html = state.tera.render("blog_relativity.html", &ctx)
        .unwrap_or_else(|e| e.to_string());
    Html(html).into_response()
}

async fn blog_quantum(State(state): State<AppState>, Query(params): Query<BlogQuery>) -> Response {
    let mut ctx = tera::Context::new();
    let (back_link, back_text) = match params.from.as_deref() {
        Some("literary") => ("/literary", "literary works"),
        _ => ("/", "home"),
    };
    ctx.insert("back_link", back_link);
    ctx.insert("back_text", back_text);
    
    let html = state.tera.render("blog_quantum.html", &ctx)
        .unwrap_or_else(|e| e.to_string());
    Html(html).into_response()
}

async fn blog_entropy(State(state): State<AppState>, Query(params): Query<BlogQuery>) -> Response {
    let mut ctx = tera::Context::new();
    let (back_link, back_text) = match params.from.as_deref() {
        Some("literary") => ("/literary", "literary works"),
        _ => ("/", "home"),
    };
    ctx.insert("back_link", back_link);
    ctx.insert("back_text", back_text);
    
    let html = state.tera.render("blog_entropy.html", &ctx)
        .unwrap_or_else(|e| e.to_string());
    Html(html).into_response()
}

async fn blog_black_holes(State(state): State<AppState>, Query(params): Query<BlogQuery>) -> Response {
    let mut ctx = tera::Context::new();
    let (back_link, back_text) = match params.from.as_deref() {
        Some("literary") => ("/literary", "literary works"),
        _ => ("/", "home"),
    };
    ctx.insert("back_link", back_link);
    ctx.insert("back_text", back_text);
    
    let html = state.tera.render("blog_blackholes.html", &ctx)
        .unwrap_or_else(|e| e.to_string());
    Html(html).into_response()
}
