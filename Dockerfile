# Multi-stage Dockerfile for Rust portfolio website
FROM rust:1.75-slim as builder
WORKDIR /app

# Copy manifest files
COPY Cargo.toml Cargo.lock ./

# Build dependencies only (creates a cached layer)
RUN mkdir src && \
    echo "fn main() {}" > src/main.rs && \
    cargo build --release && \
    rm -rf src

# Copy actual source code
COPY src ./src

# Build the application
RUN touch src/main.rs && \
    cargo build --release

# Runtime stage
FROM debian:bookworm-slim
WORKDIR /app

# Install runtime dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends ca-certificates && \
    rm -rf /var/lib/apt/lists/*

# Copy binary and assets from builder
COPY --from=builder /app/target/release/website /app/website
COPY templates ./templates
COPY static ./static

# Set environment variables
ENV PORT=8080
ENV RUST_LOG=info

# Expose port
EXPOSE 8080

# Run the application
CMD ["/app/website"]