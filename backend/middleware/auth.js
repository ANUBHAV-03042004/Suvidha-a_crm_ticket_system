export const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  if (req.originalUrl.startsWith('/api/')) {
    return res.status(401).json({ error: 'Not authenticated. Please log in.' });
  }
  res.redirect('/login');
};


export const isAdminAuthenticated = (req, res, next) => {
  console.log('Checking admin auth:', {
    sessionID: req.sessionID,
    user: req.user ? req.user.email : 'none',
    isAdmin: req.user?.isAdmin,
  });
  if (req.isAuthenticated() && req.user.isAdmin) {
    return next();
  }
  return res.status(401).json({ error: 'Not authenticated as admin' });
};

