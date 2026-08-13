<!-- SDD Artifact | Version: 1.0 | Phase: Backlog & Repo Handoff | Updated: 2026-08-13 -->
<!-- Project: Time Management | Feature: 001-time-management -->

# HANDOFF

This handoff describes how to pick up active work for 001-time-management.

What’s included:
- In-memory dev scaffold (backend + frontend)
- Auth endpoints and UI for register/login/profile
- Absence domain with in-memory store for fast iteration

To run locally:
1. Start backend: cd backend && npm install && npm run dev
2. Start frontend: cd frontend && node simple-static-server.js

Notes:
- In-memory storage: data is ephemeral. Use provided scripts to switch to DB if needed.
- Passwords currently stored in plain text for dev; do NOT use real credentials.
