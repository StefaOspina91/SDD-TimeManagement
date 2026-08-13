Backend scaffold

Run locally:
1. Install dependencies: `cd backend && npm install`
2. Start app: `npm run dev`

The backend now uses an in-memory store by default, so it works without Docker or Postgres for local development.

Available endpoints:
- `GET /health`
- `GET /api/v1/absences`
- `POST /api/v1/absences`
- `PATCH /api/v1/absences/:id`
- `DELETE /api/v1/absences/:id`

Note: mock auth middleware is installed at src/auth/mock-auth-middleware.js for local development.
