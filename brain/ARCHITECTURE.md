# Architecture Overview

## 1. System Components
```
[ GitHub Actions Runner ]
        │  (1) CI Verification: syntax check & test execution
        │  (2) SSH Dispatch via appleboy/ssh-action
        ▼
   [ Remote VPS ]
        │
        ├── Git Repository (Origin sync & reset to origin/main)
        ├── Production NPM Install (npm ci --omit=dev)
        ├── PM2 Process Manager (Zero-downtime reload / cluster mode)
        │     └── Node.js Workers (Express HTTP Server on PORT 3000)
        └── Automated Post-Deployment Health Check (curl /health -> HTTP 200)
```

## 2. Server Architecture (`server.js`)
- **Pipeline Order**:
  1. Security headers (`helmet`)
  2. Response payload compression (`compression`)
  3. Body parsing (`express.json`, `express.urlencoded` with 10MB limit)
  4. CORS header validation
  5. Structured logging (`morgan`)
  6. Rate Limiting (`express-rate-limit`: 100 requests per 15 min per IP)
  7. API Handlers (`/health`, `/api/test`, `/api/v1/resource`)
  8. 404 Catch-all and 500 Global Error Handling
- **Graceful Shutdown**:
  - Catches `SIGTERM` and `SIGINT`.
  - Stops receiving new requests (`server.close()`), finishes in-flight requests, and initiates forced exit after a 10s ceiling timeout.
