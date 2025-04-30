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
  if (req.isAuthenticated() && req.user.isAdmin) {
    return next();
  }
  console.log('Admin auth failed:', { isAuthenticated: req.isAuthenticated(), isAdmin: req.user?.isAdmin });
  res.status(401).json({ error: 'Unauthorized' });
};



