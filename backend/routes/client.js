import express from 'express';
import Client from '../models/Client.js';
import { ensureAuthenticated } from '../middleware/auth.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const router = express.Router();

// Ensure Uploads directory exists
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, '../Uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

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
    cb(new Error('Only JPEG, JPG, or PNG images are allowed'));
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// Add new client (Admin only)
router.post('/', ensureAuthenticated, upload.single('order_invoice'), async (req, res) => {
  try {
    const { name, address, mobileNumber, company, totalOrder, orderId } = req.body;
    console.log('Adding client:', { name, address, mobileNumber, company, totalOrder, orderId, order_invoice: req.file?.filename, user: req.user?._id });

    // Validate input
    if (!name || !address || !mobileNumber || !company || totalOrder === undefined || !orderId) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    if (mobileNumber.length < 10) {
      return res.status(400).json({ error: 'Mobile number must be at least 10 digits' });
    }
    if (totalOrder < 0) {
      return res.status(400).json({ error: 'Total order cannot be negative' });
    }

    // Check for duplicate orderId
    const existingClient = await Client.findOne({ orderId });
    if (existingClient) {
      return res.status(400).json({ error: 'Order ID already exists' });
    }

    const client = new Client({
      name,
      address,
      mobileNumber,
      company,
      totalOrder: Number(totalOrder),
      orderId: Number(orderId),
      order_invoice: req.file ? `/Uploads/${req.file.filename}` : '',
      createdBy: req.user._id,
    });
    await client.save();
    console.log('Client saved:', client);

    res.status(201).json({ message: 'Client added successfully', client });
  } catch (err) {
    console.error('Error adding client:', err);
    if (err.message.includes('Only JPEG, JPG, or PNG')) {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all clients (Admin only)
router.get('/', ensureAuthenticated, async (req, res) => {
  try {
    console.log('Fetching clients for user:', req.user?._id?.toString(), 'sessionID:', req.sessionID);
    const clients = await Client.find({ createdBy: req.user._id }).sort({ updatedAt: -1 });
    console.log('Clients found:', clients.length, 'data:', clients);
    res.json(clients);
  } catch (err) {
    console.error('Error fetching clients:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single client by ID (Admin only)
router.get('/:id', ensureAuthenticated, async (req, res) => {
  try {
    const client = await Client.findOne({ _id: req.params.id, createdBy: req.user._id });
    if (!client) {
      return res.status(404).json({ error: 'Client not found or unauthorized' });
    }
    console.log('Fetched client:', client);
    res.json(client);
  } catch (err) {
    console.error('Error fetching client:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update client (Admin only)
router.put('/:id', ensureAuthenticated, upload.single('order_invoice'), async (req, res) => {
  try {
    const { name, address, mobileNumber, company, totalOrder, orderId } = req.body;
    console.log('Updating client:', { id: req.params.id, name, address, mobileNumber, company, totalOrder, orderId, order_invoice: req.file?.filename });

    // Validate input
    if (!name || !address || !mobileNumber || !company || totalOrder === undefined || !orderId) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    if (mobileNumber.length < 10) {
      return res.status(400).json({ error: 'Mobile number must be at least 10 digits' });
    }
    if (totalOrder < 0) {
      return res.status(400).json({ error: 'Total order cannot be negative' });
    }

    // Check for duplicate orderId (excluding current client)
    const existingClient = await Client.findOne({ orderId, _id: { $ne: req.params.id } });
    if (existingClient) {
      return res.status(400).json({ error: 'Order ID already exists' });
    }

    const updateData = {
      name,
      address,
      mobileNumber,
      company,
      totalOrder: Number(totalOrder),
      orderId: Number(orderId),
      order_invoice: req.file ? `/Uploads/${req.file.filename}` : req.body.order_invoice || '',
    };

    const client = await Client.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user._id },
      updateData,
      { new: true }
    );
    if (!client) {
      return res.status(404).json({ error: 'Client not found or unauthorized' });
    }

    res.json({ message: 'Client updated successfully', client });
  } catch (err) {
    console.error('Error updating client:', err);
    if (err.message.includes('Only JPEG, JPG, or PNG')) {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete client (Admin only)
router.delete('/:id', ensureAuthenticated, async (req, res) => {
  try {
    const client = await Client.findOneAndDelete({ _id: req.params.id, createdBy: req.user._id });
    if (!client) {
      return res.status(404).json({ error: 'Client not found or unauthorized' });
    }
    console.log('Client deleted:', client);
    res.json({ message: 'Client deleted successfully' });
  } catch (err) {
    console.error('Error deleting client:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
