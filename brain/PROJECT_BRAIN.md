# PROJECT BRAIN: Express VPS Deployment & API Gateway

## 1. Project Overview & Objectives
- **Repository**: `LeviX-dev/first` (Local: `d:\git action testing`)
- **Primary Purpose**: Production-ready Express API gateway with security hardening (Helmet, CORS, Rate Limiting, Compression), graceful shutdown handlers, and automated Zero-Downtime CI/CD deployment to a remote VPS using GitHub Actions and PM2.

## 2. Business Domain & Requirements
- Secure, high-throughput REST API service.
- Automated deployment from GitHub `main` branch to remote VPS hosting.
- Zero-downtime rolling process reload.
- Post-deployment automated health check verification.

## 3. Technology Stack & Versions
- **Runtime**: Node.js (>=18.x / 20.x, ES Modules `"type": "module"`)
- **Framework**: Express (`^5.3.0`)
- **Middlewares**:
  - `helmet` (`^8.3.0`): HTTP security headers
  - `cors` (`^2.8.6`): Cross-Origin Resource Sharing control
  - `compression` (`^1.8.2`): Gzip/Deflate response payload compression
  - `express-rate-limit` (`^8.7.1`): IP-based DDoS and brute-force throttling
  - `morgan` (`^1.12.1`): HTTP access logging
  - `dotenv` (`^18.0.9`): Environment variable injection
- **Process Manager**: PM2 (Cluster mode via `ecosystem.config.cjs`)
- **CI/CD**: GitHub Actions (`.github/workflows/Deploy.yaml`)
- **Remote Host**: VPS over SSH (`appleboy/ssh-action@v1.0.3`)

## 4. Repository & Module Map
- `.github/workflows/Deploy.yaml`: Multi-stage GitHub Actions pipeline (CI syntax/test validation + CD SSH zero-downtime deploy & health check).
- `ecosystem.config.cjs`: PM2 cluster mode configuration for zero-downtime reloads and memory ceiling management.
- `server.js`: Main HTTP server, middleware chain, route definitions, and graceful shutdown signal traps.
- `test.js`: High-concurrency load testing script against API endpoints.
- `package.json`: NPM package manifest, scripts, and module dependencies.
- `brain/`: Project persistent memory and architectural knowledge base.

## 5. Supporting Documentation
- [Architecture](file:///d:/git%20action%20testing/brain/ARCHITECTURE.md)
- [Database](file:///d:/git%20action%20testing/brain/DATABASE.md)
- [API Reference](file:///d:/git%20action%20testing/brain/API_REFERENCE.md)
- [Configuration](file:///d:/git%20action%20testing/brain/CONFIGURATION.md)
- [Current State](file:///d:/git%20action%20testing/brain/CURRENT_STATE.md)
- [Architecture Decisions](file:///d:/git%20action%20testing/brain/decisions/ARCHITECTURE_DECISIONS.md)
- [Daily Log (2026-10-28)](file:///d:/git%20action%20testing/brain/daily/2026-10-28.md)
