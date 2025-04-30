import express from 'express';
import mongoose from 'mongoose';
import Ticket from '../models/Ticket.js';
import multer from 'multer';
import path from 'path';
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

// Multer setup for file uploads
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
    }
    cb(new Error('Only JPEG, JPG, or PNG images are allowed.'));
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// GET: Fetch a single ticket by ID
router.get('/:ticketId', ensureAuthenticated, async (req, res) => {
  try {
    console.log('GET /api/tickets/:ticketId - User:', req.user?._id || 'No user', 'TicketId:', req.params.ticketId);
    if (!mongoose.Types.ObjectId.isValid(req.params.ticketId)) {
      console.log('Invalid ticket ID:', req.params.ticketId);
      return res.status(400).json({ error: 'Invalid ticket ID' });
    }
    const ticket = await Ticket.findById(req.params.ticketId);
    if (!ticket) {
      console.log('Ticket not found:', req.params.ticketId);
      return res.status(404).json({ error: 'Ticket not found' });
    }
    if (ticket.userId.toString() !== req.user._id.toString() && req.user.isAdmin !== true) {
      console.log('Unauthorized access:', { ticketUserId: ticket.userId.toString(), userId: req.user._id.toString() });
      return res.status(403).json({ error: 'Unauthorized: You can only view your own tickets' });
    }
    console.log('Fetched ticket:', ticket);
    res.status(200).json(ticket);
  } catch (error) {
    console.error('Error fetching ticket:', { name: error.name, message: error.message, stack: error.stack });
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// PUT: Update a ticket
router.put(
  '/:ticketId',
  ensureAuthenticated,
  upload.fields([{ name: 'invoice' }, { name: 'product_image' }]),
  async (req, res) => {
    try {
      console.log('PUT /api/tickets/:ticketId - User:', req.user?._id || 'No user', 'TicketId:', req.params.ticketId, 'Body:', req.body, 'Files:', req.files);

      // Validate ticketId
      if (!mongoose.Types.ObjectId.isValid(req.params.ticketId)) {
        console.log('Invalid ticket ID:', req.params.ticketId);
        return res.status(400).json({ error: 'Invalid ticket ID' });
      }

      // Validate req.user
      if (!req.user || !req.user._id) {
        console.log('Invalid user session');
        return res.status(401).json({ error: 'Invalid user session' });
      }

      const ticket = await Ticket.findById(req.params.ticketId);
      if (!ticket) {
        console.log('Ticket not found:', req.params.ticketId);
        return res.status(404).json({ error: 'Ticket not found' });
      }

      // Check authorization
      if (ticket.userId.toString() !== req.user._id.toString() && req.user.isAdmin !== true) {
        console.log('Unauthorized access:', { ticketUserId: ticket.userId.toString(), userId: req.user._id.toString() });
        return res.status(403).json({ error: 'Unauthorized: You can only edit your own tickets' });
      }

      const { issue, description, status } = req.body;

      // Update fields based on user type
      if (req.user.isAdmin === true) {
        // Admins can update status without issue/description
        if (status) {
          const validStatuses = ['pending', 'resolved'];
          if (!validStatuses.includes(status)) {
            console.log('Invalid status:', status);
            return res.status(400).json({ error: 'Invalid status. Must be "pending" or "resolved".' });
          }
          ticket.status = status;
        }
        // Update issue/description if provided
        if (issue) ticket.issue = issue;
        if (description) ticket.description = description;
      } else {
        // Non-admins must provide issue and description
        if (!issue || !description) {
          console.log('Missing required fields:', { issue, description });
          return res.status(400).json({ error: 'Issue and description are required' });
        }
        ticket.issue = issue;
        ticket.description = description;
      }

      // Update images if provided
      ticket.invoice = req.files && req.files['invoice'] ? `/Uploads/${req.files['invoice'][0].filename}` : ticket.invoice;
      ticket.product_image = req.files && req.files['product_image'] ? `/Uploads/${req.files['product_image'][0].filename}` : ticket.product_image;
      ticket.updatedAt = Date.now();

      const updatedTicket = await ticket.save();
      console.log('Updated ticket:', updatedTicket);
      res.status(200).json({ message: 'Ticket updated successfully', ticket: updatedTicket });
    } catch (error) {
      console.error('Error updating ticket:', { name: error.name, message: error.message, stack: error.stack });
      if (error.name === 'CastError') {
        return res.status(400).json({ error: 'Invalid ticket ID' });
      }
      if (error.message.includes('Only JPEG, JPG, or PNG')) {
        return res.status(400).json({ error: error.message });
      }
      if (error.name === 'ValidationError') {
        return res.status(400).json({ error: 'Validation error', details: error.message });
      }
      res.status(500).json({ error: 'Server error', details: error.message });
    }
  }
);

export default router;