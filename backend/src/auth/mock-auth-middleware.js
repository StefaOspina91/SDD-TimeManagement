module.exports = (req, res, next) => {
  // Mock authenticated user for local development and tests
  req.user = {
    id: 'dev-user-1',
    name: 'Dev User',
    email: 'dev@example.com',
    role: 'collaborator',
    teamId: 'team-1'
  };
  next();
};
