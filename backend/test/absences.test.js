const test = require('node:test');
const assert = require('node:assert/strict');
const { once } = require('node:events');

const { app } = require('../src/index.js');

async function withServer(testFn) {
  const server = app.listen(0);
  await once(server, 'listening');
  const { port } = server.address();

  try {
    await testFn(port);
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => {
        if (error) return reject(error);
        resolve();
      });
    });
  }
}

test('GET /api/v1/absences returns seeded entries', async () => {
  await withServer(async (port) => {
    const response = await fetch(`http://127.0.0.1:${port}/api/v1/absences`);
    const data = await response.json();

    assert.equal(response.status, 200);
    assert.ok(Array.isArray(data));
    assert.ok(data.length >= 1);
  });
});

test('POST /api/v1/absences creates an in-memory absence entry', async () => {
  await withServer(async (port) => {
    const response = await fetch(`http://127.0.0.1:${port}/api/v1/absences`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Team offsite',
        date: '2026-08-20',
        start: '2026-08-20',
        end: '2026-08-21',
        reason: 'Planning session',
        teamId: 'team-1'
      })
    });

    const data = await response.json();

    assert.equal(response.status, 201);
    assert.equal(data.title, 'Team offsite');
    assert.ok(data.id);
    assert.equal(data.teamId, 'team-1');
  });
});

test('PATCH /api/v1/absences/:id updates the entry', async () => {
  await withServer(async (port) => {
    const createResponse = await fetch(`http://127.0.0.1:${port}/api/v1/absences`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Original leave',
        date: '2026-09-01',
        start: '2026-09-01',
        end: '2026-09-02',
        reason: 'Initial',
        collaboratorId: 'dev-user-1',
        teamId: 'team-1'
      })
    });

    const created = await createResponse.json();
    const response = await fetch(`http://127.0.0.1:${port}/api/v1/absences/${created.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason: 'Updated reason' })
    });

    const data = await response.json();

    assert.equal(response.status, 200);
    assert.equal(data.reason, 'Updated reason');
  });
});
