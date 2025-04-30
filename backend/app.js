// app.js
import express from 'express';
import mongoose from 'mongoose';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import cors from 'cors';
import passport from './config/passport.js';
import routes from './routes/auth.js';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import TicketRoutes from './routes/ticket.js';
import path from 'path';
import { fileURLToPath } from 'url';
import Add_new_ticketRoutes from './routes/add_new_ticket.js';
import ProfileRoutes from './routes/profile.js';
import feedbackRoutes from './routes/feedback.js';
import clientRoutes from './routes/client.js';
import AdminRoutes from './routes/admin.js';
dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// CORS setup
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Session setup with MongoDB store
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    collectionName: 'sessions',
    ttl: 15 * 60, // 15 minutes in seconds
    autoRemove: 'interval', // Use interval-based cleanup
    autoRemoveInterval: 1, // Check every 1 minute
  }),
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 15 * 60 * 1000, // 15 minutes in milliseconds (sync with ttl)
    sameSite: 'strict',
  },
}));

// Custom session middleware to track creation time and enforce timeout
app.use((req, res, next) => {
  // Set creation time for new sessions
  if (req.sessionID && !req.session.createdAt) {
    req.session.createdAt = new Date();
    console.log(`Session created: ${req.sessionID} at ${req.session.createdAt}`);
  }

  // Check session age and expire if older than 5 minutes
  if (req.sessionID && req.session.createdAt) {
    const sessionAge = (new Date() - new Date(req.session.createdAt)) / 1000;
    if (sessionAge > 300) { // 5 minutes
      console.log(`Expiring session: ${req.sessionID}, age: ${sessionAge}s`);
      return req.session.destroy((err) => {
        if (err) {
          console.error('Error destroying session:', err);
          return res.status(500).json({ error: 'Failed to destroy session' });
        }
        res.clearCookie('connect.sid', { path: '/', httpOnly: true, sameSite: 'strict' });
        console.log(`Session destroyed: ${req.sessionID}`);
        res.status(401).json({ error: 'Session expired, please log in' });
      });
    }
  }

  // Log session destruction
  const originalSessionDestroy = req.session.destroy;
  req.session.destroy = function (cb) {
    console.log(`Session destroyed: ${req.sessionID}`);
    return originalSessionDestroy.call(this, cb);
  };
  next();
});

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - SessionID: ${req.sessionID || 'none'}`);
  next();
});

// Log registered routes
if (app._router) {
  app._router.stack.forEach((middleware) => {
    if (middleware.route) {
      console.log(`Route registered: ${middleware.route.path} [${Object.keys(middleware.route.methods).join(', ').toUpperCase()}]`);
    } else if (middleware.name === 'router' && middleware.handle.stack) {
      middleware.handle.stack.forEach((handler) => {
        if (handler.route) {
          console.log(`Route registered: /api${handler.route.path} [${Object.keys(handler.route.methods).join(', ').toUpperCase()}]`);
        }
      });
    }
  });
} else {
  console.warn('Router not initialized, skipping route logging');
}
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Routes
app.use('/api/auth', routes);
app.use('/api/tickets',TicketRoutes);
app.use('/api/tickets', Add_new_ticketRoutes);
app.use('/api/users', ProfileRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/admin',AdminRoutes);
// Clear sessions on startup (for testing)
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB connected');
    const db = mongoose.connection.db;
    await db.collection('sessions').deleteMany({});
    console.log('Cleared all sessions on startup');
  })
  .catch((err) => console.error('MongoDB connection error:', err));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  if (!res.headersSent) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));