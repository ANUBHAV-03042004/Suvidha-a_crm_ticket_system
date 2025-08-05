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

app.set('trust proxy', 1);
app.use('/Uploads', express.static(path.join(__dirname, 'Uploads')));
// CORS setup
app.use(
  cors({
    origin: [
      process.env.CLIENT_URL || 'https://suvidha-36fa1.web.app',
      'http://localhost:5173',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200,
  })
);
// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Session setup with MongoDB store
app.use(
  session({
    secret: process.env.SESSION_SECRET || '98563fd9ccffee949bd9827cc640cf57a605f69381a2aa09cbf30724923f821b',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: 'sessions',
      ttl: 24 * 60 * 60, // 24 hours
      autoRemove: 'interval',
      autoRemoveInterval: 10, // Check every 10 minutes
    }),
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production' ? true : false,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      path: '/',
    },
  })
);

// Debug session middleware
app.use((req, res, next) => {
  console.log(
    `[${new Date().toISOString()}] ${req.method} ${req.url} - SessionID: ${
      req.sessionID || 'none'
    }, User: ${req.user ? req.user.email : 'none'}, Cookies: ${
      req.headers.cookie || 'none'
    }, Session: ${JSON.stringify(req.session)}`
  );
  next();
});

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/uploads', express.static(path.join(__dirname, 'Uploads')));
app.use('/api/auth', routes);
app.use('/api/tickets', TicketRoutes);
app.use('/api/tickets', Add_new_ticketRoutes);
app.use('/api/users', ProfileRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/admin', AdminRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  if (!res.headersSent) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));