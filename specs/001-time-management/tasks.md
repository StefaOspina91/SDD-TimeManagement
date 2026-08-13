<!-- SDD Artifact | Version: 1.0 | Phase: Tasks | Updated: 2026-08-13 -->
<!-- Project: Time Management | Feature: 001-time-management -->

# Task Breakdown: Time Management — Presence & Absence

## Conventions
- [P] = Can run in parallel
- [Story: US-001] = User story this task belongs to
- [Dep: T-NNN] = Depends on task T-NNN
- File paths are relative to project root
- Tests included where required by constitution or spec

## Phase 0: Foundational Setup
- [ ] T-001: Initialize project structure [P]
  - Files: package.json, README stub, .gitignore, workspace/monorepo layout (backend/, frontend/)
  - Acceptance: repo scaffolding present and `npm install` runs in backend and frontend

- [ ] T-002: Configure development environment [P]
  - Files: .env.example, docker-compose.dev.yml (Postgres), dev README
  - Acceptance: dev DB starts and backend can connect to it locally

- [ ] T-003: Set up CI/CD skeleton (GitHub Actions) [P]
  - Files: .github/workflows/ci.yml, workflow for lint/test
  - Acceptance: CI runs on PRs and passes basic lint step

- [ ] T-004: Create database schema and migration [Dep: T-001]
  - Files: migrations/001_init.sql or migration tool config (knex/prisma)
  - Acceptance: Test DB can apply migrations and schema matches data-model.md

- [ ] T-005: Implement authentication stub for dev [Dep: T-001]
  - Files: backend/src/auth/mock-auth-middleware.js
  - Acceptance: endpoints receive an authenticated user object in requests

### Checkpoint: Foundational
- [ ] Project builds, DB accessible, auth stub works, CI runs

## Phase 1: Core (User Story US-001)
Priority: Must Have

- [ ] T-010: Service layer — Absence domain [Dep: T-004]
  - Files: backend/src/services/absenceService.js
  - Acceptance: CRUD functions exist with validation and audit logging

- [ ] T-011: API endpoints for Absence CRUD [Dep: T-010]
  - Files: backend/src/routes/absences.js, controllers
  - Acceptance: POST/PATCH/GET/DELETE implemented with owner-or-manager checks

- [ ] T-012: Manager flows & RBAC enforcement [Dep: T-011]
  - Files: backend/src/middleware/authorization.js
  - Acceptance: managers can create/edit entries for their team; others cannot

- [ ] T-013: Calendar data expansion & recurrence helper [Dep: T-010]
  - Files: backend/src/utils/recurrence.js
  - Acceptance: recurrence rules expand to occurrences for a date range

- [ ] T-014: Frontend skeleton & Calendar view [Dep: T-001]
  - Files: frontend/src/pages/Calendar.jsx, calendar component
  - Acceptance: calendar fetches absences and renders placeholders

- [ ] T-015: Absence editor UI (create/edit) [Dep: T-014, T-011]
  - Files: frontend/src/components/AbsenceEditor.jsx
  - Acceptance: user can create/edit an absence (date, time range, recurrence, reason)

- [ ] T-016: Team list & read-only views [Dep: T-014, T-011]
  - Files: frontend/src/pages/TeamView.jsx
  - Acceptance: team members visible with their absence indicators

### Checkpoint: US-001
- [ ] User completes the scenario: create absence → view in calendar → edit own absence

## Phase 2: Integration & Polish
- [ ] T-020: Integration tests for API and DB [Dep: T-011, T-004]
  - Files: backend/test/integration/absences.test.js
  - Acceptance: core API flows pass against test DB

- [ ] T-021: E2E tests for key workflows (Cypress/Playwright) [Dep: T-015, T-016]
  - Files: e2e/specs/absence-flow.spec.js
  - Acceptance: create/edit/view flows pass in CI

- [ ] T-022: Observability & Health checks [Dep: T-010]
  - Files: backend/src/health.js, logging config
  - Acceptance: /health returns DB status; logs include request_id

- [ ] T-023: Performance & caching for calendar queries [Dep: T-013]
  - Files: backend/src/cache.js (in-memory/cache layer)
  - Acceptance: typical calendar query <300ms in staging

- [ ] T-024: Accessibility and UX polish for calendar UI [Dep: T-014]
  - Files: frontend/accessibility-audit.md changes
  - Acceptance: basic a11y checks pass (contrast, keyboard nav)

## Phase 3: Release & Handoff
- [ ] T-030: Documentation and repo orientation files (README, HANDOFF, CONTRIBUTING) [Dep: T-001]
  - Files: README.md, HANDOFF.md, CONTRIBUTING.md, .editorconfig, .github/*
  - Acceptance: new developer can run project in <30 minutes per constitution

- [ ] T-031: Create migration cleanup and retention job (1 year archiving) [Dep: T-004]
  - Files: backend/src/jobs/retentionJob.js, migration script
  - Acceptance: records older than 1 year are archived per policy

- [ ] T-032: Create monitoring and alerting runbook [Dep: T-022]
  - Files: docs/monitoring.md
  - Acceptance: SRE/ops knows how to respond to common alerts

## Dependency Summary
T-001 ──┬── T-004 ── T-010 ── T-011 ── T-012
       └── T-005


