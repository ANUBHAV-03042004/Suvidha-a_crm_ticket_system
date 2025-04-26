import express from 'express';
import multer from 'multer';
import path from 'path';
import Ticket from '../models/Ticket.js';
import { ensureAuthenticated } from '../middleware/auth.js';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Ensure Uploads directory exists
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, '../Uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const router = express.Router();

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only JPEG, JPG, or PNG images are allowed.'));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// GET: Fetch all tickets for the authenticated user
router.get('/', ensureAuthenticated, async (req, res) => {
  try {
    console.log('GET /api/tickets - User:', req.user?._id || 'No user');
    const tickets = await Ticket.find({ userId: req.user._id });
    console.log('Fetched tickets:', tickets);
    res.status(200).json(tickets);
  } catch (err) {
    console.error('Error fetching tickets:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST: Create a new ticket
router.post(
  '/',
  ensureAuthenticated,
  upload.fields([{ name: 'invoice' }, { name: 'product_image' }]),
  async (req, res) => {
    try {
      console.log('POST /api/tickets - User:', req.user?._id || 'No user', 'Body:', req.body, 'Files:', req.files);
      const { issue, description } = req.body;
      if (!issue || !description) {
        console.log('Missing required fields:', { issue, description });
        return res.status(400).json({ error: 'Issue and description are required.' });
      }

      const invoicePath = req.files['invoice'] ? req.files['invoice'][0].path : null;
      const productImagePath = req.files['product_image'] ? req.files['product_image'][0].path : null;

      const newTicket = new Ticket({
        userId: req.user._id,
        issue,
        description,
        invoice: invoicePath,
        product_image: productImagePath,
      });

      const savedTicket = await newTicket.save();
      console.log('Saved ticket:', savedTicket);
      res.status(201).json(savedTicket);
    } catch (err) {
      console.error('Error saving ticket:', err);
      if (err.message.includes('Only JPEG, JPG, or PNG')) {
        res.status(400).json({ error: err.message });
      } else if (err.name === 'ValidationError') {
        console.log('MongoDB validation error:', err.errors);
        res.status(400).json({ error: err.message });
      } else {
        res.status(500).json({ error: 'Server error' });
      }
    }
  }
);

// Export router
export default router;