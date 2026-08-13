// Auth middleware: prefer real session-based auth, fall back to anonymous request
const users = require('../db/in-memory-users');

function parseCookie(header) {
  if (!header) return {};
  return header.split(';').map((c) => c.trim()).reduce((acc, cur) => {
    const parts = cur.split('=');
    acc[parts[0]] = parts.slice(1).join('=');
    return acc;
  }, {});
}

module.exports = (req, res, next) => {
  try {
    const cookies = parseCookie(req.headers && req.headers.cookie);
    const token = cookies && cookies.tm_token;
    const user = users.getUserByToken(token);
    if (user) {
      // attach safe user object
      req.user = {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        teamId: user.teamId
      };
    } else {
      // anonymous request - no user
      req.user = null;
    }
  } catch (err) {
    req.user = null;
  }

  next();
};
