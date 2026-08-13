# HANDOFF: Time Management — 001-time-management

Owner: TBD

Overview:
This repo contains the SDD artifacts in /specs/001-time-management and the initial scaffolding for a Node/React implementation.

How to run locally:
- Start dev DB: `docker-compose -f docker-compose.dev.yml up`
- Run backend: `cd backend && npm install && npm run dev`
- Run frontend: `cd frontend && npm install && npm start`

Important files:
- specs/001-time-management/spec.md — feature spec
- specs/001-time-management/plan.md — implementation plan
- specs/001-time-management/tasks.md — tasks

Next steps for assignee:
1. Implement auth stub and DB migrations (T-005, T-004)
2. Implement Absence CRUD and calendar UI (T-010..T-016)
3. Add CI workflows and tests
