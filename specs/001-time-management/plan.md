<!-- SDD Artifact | Version: 1.0 | Phase: Plan | Updated: 2026-08-13 -->
<!-- Project: Time Management | Feature: 001-time-management -->

# Implementation Plan: Time Management — Presence & Absence

## Pre-Implementation Gates (Constitution Compliance)
- [x] Modularity boundary defined
- [x] Interfaces defined before implementation
- [x] Test strategy defined
- [x] Config externalized
- [x] Error handling strategy defined
- [x] Logging/observability planned
- [x] Security requirements addressed
- [x] Performance targets achievable
- [x] Documentation approach defined

## Architecture Overview
### System Context
Usuarios autenticados (SSO) acceden a una API Backend que persiste ausencias en PostgreSQL. Frontend (SPA) consume API para vistas de calendario y listados por equipo. Managers tienen endpoints/roles para crear/editar registros de su equipo.

### Component Diagram (high-level)
- Frontend: React SPA (page: Calendar, TeamList, AbsenceEditor)
- Backend: Node.js + Express API
- DB: PostgreSQL (AbsenceRecord, Collaborator, Team, AuditLog)
- Auth: SSO / OAuth connector (reverse-proxied or middleware)
- CI/CD: GitHub Actions (build, test, lint, deploy)
- Hosting: Cloud provider (App Service / Container / Serverless) — deploy via GH Actions

## Technology Decisions
| Layer | Choice | Rationale |
|-------|--------|-----------|
| Backend | Node.js (Express) | Lighweight, fast to iterate, large ecosystem for APIs and auth middleware. |
| Frontend | React | SPA interactivity for calendar UI; many calendar components available. |
| Database | PostgreSQL | ACID, temporal queries, recurrence support via normalized model. |
| Hosting | Container (Cloud) / Heroku/Azure/GCP | Containerizable and portable; pick provider per company policy. |
| Auth | SSO / OAuth | Integrates with corporate identity; reduces password surface. |
| CI/CD | GitHub Actions | Native to repo, simple to run tests and deploy. |

## API Contracts (surface)
- GET /api/v1/teams/{teamId}/absences?start=YYYY-MM-DD&end=YYYY-MM-DD
- POST /api/v1/absences  { collaboratorId*, start, end, startTime?, endTime?, recurrence?, reason? }
- PATCH /api/v1/absences/{id}  (owner or manager of team)
- DELETE /api/v1/absences/{id}
- GET /api/v1/collaborators/{id}

(*) collaboratorId inferred from auth for regular users; managers may pass target collaboratorId when authorized.

## Data Model (summary)
- Collaborator (id, name, email, team_id, role)
- Team (id, name, manager_id)
- AbsenceRecord (id, collaborator_id, start_date, end_date, start_time, end_time, recurrence_rule, reason, created_by, created_at, updated_at, archived_at)
- AuditLog (id, entity_type, entity_id, action, actor_id, timestamp, metadata)

Recurrence: RFC 5545-like rrule text stored in recurrence_rule for flexibility; expansion done at query time for calendar rendering (cache for performance).

## Implementation Phases
- Phase 0: Research & Validation — spike on calendar UX & recurrence model (2w)
- Phase 1: Foundation — scaffolding, DB schema, auth middleware, basic API, CI (3w)
- Phase 2: Core — Absence CRUD, calendar view, team list, manager flows (4w)
- Phase 3: Integration & Polish — performance tuning, E2E tests, docs, accessibility (2w)

## Testing Strategy
- Unit tests: services and utilities (Jest)
- Integration tests: API endpoints (Supertest) against test DB
- E2E: key workflows (Cypress/Playwright) — report creation, edit, calendar view
- CI: run lint → unit → integration → build → deploy to staging

## Observability
- Logging: structured JSON via pino/winston with request_id
- Metrics: Prometheus-compatible endpoints or provider-managed metrics (request latencies, error rates, absences per day)
- Health: /health endpoint validating DB connectivity and auth connector

## Security
- Auth: validate JWT from SSO/OAuth; role-based checks (manager vs collaborator)
- Authorization: owner-or-manager checks on write operations
- Secrets: use environment-managed secret store (Key Vault / Secrets Manager)
- Transport: TLS required

## Deploy & Release
- Environments: dev → staging → prod
- Release steps: PR → GH Actions CI → merge → automatic deploy to staging; manual promotion to prod
- Migrations: use a migration tool (knex, prisma, or liquibase) with deterministic scripts

## Risk Assessment
| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Recurrence complexity | Medium | Medium | Spike early; limit recurrence features MVP to common patterns weekly/monthly |
| Auth integration delays | High | Medium | Implement mock auth for dev; parallel SSO integration track |
| Calendar UX confusion | Medium | Medium | User testing in Phase 0; iterate on visual overlap rendering |

## Complexity Tracking
| Component | Estimate (days) | Confidence | Notes |
|-----------|-----------------|-----------|-------|
| Auth & RBAC | 5 | Medium | Depends on SSO integration complexity |
| DB & Migrations | 3 | High | Schema straightforward |
| Absence CRUD API | 4 | High | Includes validation + audit logging |
| Calendar UI | 6 | Medium | Recurrence expansion + overlap rendering |


## Next Actions (short term)
1. Approve plan.md (this file).
2. Create tasks.md from plan (Phase 4) — generate T-001..T-xxx.
3. Scaffold repo: package.json, basic server, React app skeleton, DB migrations.
4. Implement authentication stub for local dev.


---

*This plan follows the project constitution saved at specs/001-time-management/constitution.md.*
