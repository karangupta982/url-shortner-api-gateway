# API Gateway

The API Gateway routes requests to the appropriate microservice:
- **Auth Service:** http://localhost:5001/api/v1/auth
- **URL Service:** http://localhost:5002/api/v1/url
- **Redirect Service:** http://localhost:5003/api/v1/redirect

## 🚀 Run Locally
```bash
npm install
npm run dev
```

## �� Example Routes
| Endpoint | Forwards To |
|-----------|-------------|
| /api/v1/auth | Auth Service |
| /api/v1/url | URL Service |
| /api/v1/redirect | Redirect Service |
