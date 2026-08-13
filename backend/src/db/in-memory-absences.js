const { randomUUID } = require('crypto');

class InMemoryAbsenceStore {
  constructor() {
    this.absences = new Map();
    this.seedSampleData();
  }

  seedSampleData() {
    const today = new Date();
    const isoDate = (offsetDays) => {
      const date = new Date(today);
      date.setDate(date.getDate() + offsetDays);
      return date.toISOString().slice(0, 10);
    };

    const sampleEntries = [
      {
        id: 'absence-demo-1',
        collaboratorId: 'dev-user-1',
        teamId: 'team-1',
        title: 'Personal time',
        date: isoDate(1),
        start: isoDate(1),
        end: isoDate(1),
        startTime: '09:00',
        endTime: '13:00',
        recurrence: 'none',
        reason: 'Personal appointment',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'absence-demo-2',
        collaboratorId: 'dev-user-2',
        teamId: 'team-1',
        title: 'Medical leave',
        date: isoDate(3),
        start: isoDate(3),
        end: isoDate(4),
        recurrence: 'none',
        reason: 'Doctor appointment',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    for (const entry of sampleEntries) {
      this.absences.set(entry.id, entry);
    }
  }

  list({ start, end, teamId } = {}) {
    let entries = [...this.absences.values()];

    if (teamId) {
      entries = entries.filter((entry) => entry.teamId === teamId);
    }

    if (start) {
      entries = entries.filter((entry) => {
        const entryStart = entry.start || entry.date;
        return entryStart >= start;
      });
    }

    if (end) {
      entries = entries.filter((entry) => {
        const entryEnd = entry.end || entry.date;
        return entryEnd <= end;
      });
    }

    return entries.sort((a, b) => new Date(a.start || a.date) - new Date(b.start || b.date));
  }

  getById(id) {
    return this.absences.get(id);
  }

  create(payload = {}) {
    const now = new Date().toISOString();
    const entry = {
      id: payload.id || randomUUID(),
      collaboratorId: payload.collaboratorId || 'dev-user-1',
      teamId: payload.teamId || 'team-1',
      title: payload.title || 'Absence',
      date: payload.date || payload.start || payload.end || new Date().toISOString().slice(0, 10),
      start: payload.start || payload.date || payload.end || null,
      end: payload.end || payload.date || payload.start || null,
      startTime: payload.startTime || null,
      endTime: payload.endTime || null,
      recurrence: payload.recurrence || 'none',
      reason: payload.reason || '',
      createdAt: now,
      updatedAt: now
    };

    this.absences.set(entry.id, entry);
    return entry;
  }

  update(id, payload = {}) {
    const existing = this.absences.get(id);
    if (!existing) {
      return null;
    }

    const updated = {
      ...existing,
      ...payload,
      updatedAt: new Date().toISOString(),
      date: payload.date || existing.date,
      start: payload.start || existing.start,
      end: payload.end || existing.end
    };

    this.absences.set(id, updated);
    return updated;
  }

  remove(id) {
    const existing = this.absences.get(id);
    if (!existing) {
      return false;
    }

    this.absences.delete(id);
    return true;
  }
}

module.exports = {
  InMemoryAbsenceStore,
  inMemoryAbsenceStore: new InMemoryAbsenceStore()
};
