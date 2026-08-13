const { randomUUID } = require('crypto');

class InMemoryUserStore {
  constructor() {
    this.users = new Map(); // email -> user
    this.sessions = new Map(); // token -> userId
    this.allowedDomains = ['@Software-ps.com', '@ghtcorp.com', '@globostudio.net'];

    // seed a dev user matching prior mock user
    const dev = this.createUser({
      email: 'dev@example.com',
      password: 'devpass',
      fullName: 'Dev User',
      teamId: 'team-1',
      role: 'collaborator'
    });

    this.createSession(dev.id); // create one session for convenience (not used automatically)
  }

  normalizeEmail(email) {
    return String(email || '').trim().toLowerCase();
  }

  isDomainAllowed(email) {
    const lower = this.normalizeEmail(email);
    return this.allowedDomains.some((d) => lower.endsWith(d.toLowerCase()));
  }

  createUser({ email, password, fullName, teamId = 'team-1', role = 'collaborator' }) {
    const e = this.normalizeEmail(email);
    if (this.users.has(e)) {
      throw new Error('User already exists');
    }

    const id = `user-${randomUUID()}`;
    const user = {
      id,
      email: e,
      password: String(password || ''),
      fullName: String(fullName || ''),
      teamId,
      role,
      createdAt: new Date().toISOString()
    };

    this.users.set(e, user);
    return { ...user, password: undefined };
  }

  getByEmail(email) {
    return this.users.get(this.normalizeEmail(email));
  }

  getById(id) {
    for (const user of this.users.values()) {
      if (user.id === id) return user;
    }
    return null;
  }

  authenticate(email, password) {
    const user = this.getByEmail(email);
    if (!user) return null;
    if (user.password !== String(password || '')) return null;
    return user;
  }

  createSession(userId) {
    const token = randomUUID();
    this.sessions.set(token, userId);
    return token;
  }

  getUserByToken(token) {
    if (!token) return null;
    const userId = this.sessions.get(token);
    if (!userId) return null;
    return this.getById(userId);
  }

  deleteSession(token) {
    return this.sessions.delete(token);
  }
}

module.exports = new InMemoryUserStore();
