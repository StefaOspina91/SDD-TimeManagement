-- Initial schema for Time Management

CREATE TABLE IF NOT EXISTS teams (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS collaborators (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  team_id TEXT REFERENCES teams(id),
  role TEXT
);

CREATE TABLE IF NOT EXISTS absence_records (
  id TEXT PRIMARY KEY,
  collaborator_id TEXT REFERENCES collaborators(id) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  start_time TIME,
  end_time TIME,
  recurrence_rule TEXT,
  reason TEXT,
  created_by TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  archived_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS audit_log (
  id TEXT PRIMARY KEY,
  entity_type TEXT,
  entity_id TEXT,
  action TEXT,
  actor_id TEXT,
  timestamp TIMESTAMP DEFAULT now(),
  metadata JSONB
);
