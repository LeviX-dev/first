# API Reference

## Endpoints

### 1. Health Status
- **Route**: `GET /health`
- **Rate Limited**: Yes (`100 req / 15m`)
- **Description**: Health check endpoint utilized by Docker, VPS monitoring, and CI/CD pipelines.
- **Success Response** (`200 OK`):
  ```json
  {
    "status": "UP",
    "environment": "production",
    "timestamp": "2026-10-28T17:00:00.000Z",
    "uptime": 124.5
  }
  ```

### 2. Test Endpoint
- **Route**: `GET /api/test`
- **Rate Limited**: Yes (`/api/*`)
- **Success Response** (`200 OK`):
  ```json
  {
    "msg": "millgaya response 2"
  }
  ```

### 3. V1 Resource Gateway
- **Route**: `GET /api/v1/resource`
- **Rate Limited**: Yes (`/api/*`)
- **Success Response** (`200 OK`):
  ```json
  {
    "success": true,
    "message": "Welcome to the production API gateway."
  }
  ```

### 4. Error Responses
- **404 Not Found**:
  ```json
  {
    "status": 404,
    "error": "Resource Not Found"
  }
  ```
- **429 Rate Limited**:
  ```json
  {
    "status": 429,
    "message": "Too many requests from this IP, please try again later."
  }
  ```
- **500 Server Error**:
  ```json
  {
    "status": 500,
    "error": "Internal Server Error"
  }
  ```
