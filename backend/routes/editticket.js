// import express from 'express';
// import mongoose from 'mongoose';
// import Ticket from '../models/Ticket.js';
// import multer from 'multer';
// import path from 'path';
// import { ensureAuthenticated } from '../middleware/auth.js';
// import { fileURLToPath } from 'url';
// import fs from 'fs';

// // Ensure Uploads directory exists
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// const uploadDir = path.join(__dirname, '../Uploads');
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }

// const router = express.Router();

// // Multer setup for file uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, uploadDir);
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}${path.extname(file.originalname)}`);
//   },
// });
// const upload = multer({
//   storage,
//   fileFilter: (req, file, cb) => {
//     const filetypes = /jpeg|jpg|png/;
//     const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//     const mimetype = filetypes.test(file.mimetype);
//     if (extname && mimetype) {
//       return cb(null, true);
//     }
//     cb(new Error('Only JPEG, JPG, or PNG images are allowed.'));
//   },
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
// });

// // GET: Fetch all tickets for the authenticated user
// router.get('/', ensureAuthenticated, async (req, res) => {
//   try {
//     console.log('GET /api/tickets - User:', req.user?._id || 'No user');
//     const tickets = await Ticket.find({ userId: req.user._id });
//     console.log('Fetched tickets:', tickets.length);
//     res.status(200).json(tickets);
//   } catch (err) {
//     console.error('Error fetching tickets:', { name: err.name, message: err.message });
//     res.status(500).json({ error: 'Server error', details: err.message });
//   }
// });

// // GET: Fetch a single ticket by ID
// router.get('/:ticketId', ensureAuthenticated, async (req, res) => {
//   try {
//     console.log('GET /api/tickets/:ticketId - User:', req.user?._id || 'No user', 'TicketId:', req.params.ticketId);
//     if (!mongoose.Types.ObjectId.isValid(req.params.ticketId)) {
//       console.log('Invalid ticket ID:', req.params.ticketId);
//       return res.status(400).json({ error: 'Invalid ticket ID' });
//     }
//     const ticket = await Ticket.findById(req.params.ticketId);
//     if (!ticket) {
//       console.log('Ticket not found:', req.params.ticketId);
//       return res.status(404).json({ error: 'Ticket not found' });
//     }
//     if (ticket.userId.toString() !== req.user._id.toString() && req.user.isAdmin !== true) {
//       console.log('Unauthorized access:', { ticketUserId: ticket.userId.toString(), userId: req.user._id.toString() });
//       return res.status(403).json({ error: 'Unauthorized: You can only view your own tickets' });
//     }
//     console.log('Fetched ticket:', ticket);
//     res.status(200).json(ticket);
//   } catch (error) {
//     console.error('Error fetching ticket:', { name: error.name, message: error.message, stack: error.stack });
//     res.status(500).json({ error: 'Server error', details: error.message });
//   }
// });

// // POST: Create a new ticket
// router.post(
//   '/',
//   ensureAuthenticated,
//   upload.fields([{ name: 'invoice' }, { name: 'product_image' }]),
//   async (req, res) => {
//     try {
//       console.log('POST /api/tickets - User:', req.user?._id || 'No user', 'Body:', req.body, 'Files:', req.files);
//       const { issue, description } = req.body;
//       if (!issue || !description) {
//         console.log('Missing required fields:', { issue, description });
//         return res.status(400).json({ error: 'Issue and description are required.' });
//       }

//       const invoicePath = req.files['invoice']
//         ? `/Uploads/${req.files['invoice'][0].filename}`
//         : null;
//       const productImagePath = req.files['product_image']
//         ? `/Uploads/${req.files['product_image'][0].filename}`
//         : null;

//       const newTicket = new Ticket({
//         userId: req.user._id,
//         issue,
//         description,
//         invoice: invoicePath,
//         product_image: productImagePath,
//       });

//       const savedTicket = await newTicket.save();
//       console.log('Saved ticket:', savedTicket);
//       res.status(201).json(savedTicket);
//     } catch (err) {
//       console.error('Error saving ticket:', { name: err.name, message: err.message });
//       if (err.message.includes('Only JPEG, JPG, or PNG')) {
//         res.status(400).json({ error: err.message });
//       } else if (err.name === 'ValidationError') {
//         console.log('MongoDB validation error:', err.errors);
//         res.status(400).json({ error: err.message });
//       } else {
//         res.status(500).json({ error: 'Server error', details: err.message });
//       }
//     }
//   }
// );

// // PUT: Update a ticket
// router.put(
//   '/:ticketId',
//   ensureAuthenticated,
//   upload.fields([{ name: 'invoice' }, { name: 'product_image' }]),
//   async (req, res) => {
//     try {
//       console.log('PUT /api/tickets/:ticketId - User:', req.user?._id || 'No user', 'TicketId:', req.params.ticketId, 'Body:', req.body, 'Files:', req.files);

//       // Validate ticketId
//       if (!mongoose.Types.ObjectId.isValid(req.params.ticketId)) {
//         console.log('Invalid ticket ID:', req.params.ticketId);
//         return res.status(400).json({ error: 'Invalid ticket ID' });
//       }

//       // Validate req.user
//       if (!req.user || !req.user._id) {
//         console.log('Invalid user session');
//         return res.status(401).json({ error: 'Invalid user session' });
//       }

//       const ticket = await Ticket.findById(req.params.ticketId);
//       if (!ticket) {
//         console.log('Ticket not found:', req.params.ticketId);
//         return res.status(404).json({ error: 'Ticket not found' });
//       }

//       // Check authorization
//       if (ticket.userId.toString() !== req.user._id.toString() && req.user.isAdmin !== true) {
//         console.log('Unauthorized access:', { ticketUserId: ticket.userId.toString(), userId: req.user._id.toString() });
//         return res.status(403).json({ error: 'Unauthorized: You can only edit your own tickets' });
//       }

//       const { issue, description, status } = req.body;

//       // Update fields based on user type
//       if (req.user.isAdmin === true) {
//         // Admins can update status without issue/description
//         if (status) {
//           const validStatuses = ['pending', 'resolved'];
//           if (!validStatuses.includes(status)) {
//             console.log('Invalid status:', status);
//             return res.status(400).json({ error: 'Invalid status. Must be "pending" or "resolved".' });
//           }
//           ticket.status = status;
//         }
//         // Update issue/description if provided
//         if (issue) ticket.issue = issue;
//         if (description) ticket.description = description;
//       } else {
//         // Non-admins must provide issue and description
//         if (!issue || !description) {
//           console.log('Missing required fields:', { issue, description });
//           return res.status(400).json({ error: 'Issue and description are required' });
//         }
//         ticket.issue = issue;
//         ticket.description = description;
//       }

//       // Update images and delete old files if new ones are uploaded
//       if (req.files && req.files['invoice']) {
//         if (ticket.invoice) {
//           fs.unlink(path.join(__dirname, '..', ticket.invoice), (err) => {
//             if (err) console.error('Error deleting old invoice:', err);
//           });
//         }
//         ticket.invoice = `/Uploads/${req.files['invoice'][0].filename}`;
//       }
//       if (req.files && req.files['product_image']) {
//         if (ticket.product_image) {
//           fs.unlink(path.join(__dirname, '..', ticket.product_image), (err) => {
//             if (err) console.error('Error deleting old product image:', err);
//           });
//         }
//         ticket.product_image = `/Uploads/${req.files['product_image'][0].filename}`;
//       }
//       ticket.updatedAt = Date.now();

//       const updatedTicket = await ticket.save();
//       console.log('Updated ticket:', updatedTicket);
//       res.status(200).json({ message: 'Ticket updated successfully', ticket: updatedTicket });
//     } catch (error) {
//       console.error('Error updating ticket:', { name: error.name, message: error.message, stack: error.stack });
//       if (error.name === 'CastError') {
//         return res.status(400).json({ error: 'Invalid ticket ID' });
//       }
//       if (error.message.includes('Only JPEG, JPG, or PNG')) {
//         return res.status(400).json({ error: error.message });
//       }
//       if (error.name === 'ValidationError') {
//         return res.status(400).json({ error: 'Validation error', details: error.message });
//       }
//       res.status(500).json({ error: 'Server error', details: error.message });
//     }
//   }
// );

// // DELETE: Delete a ticket
// router.delete('/:ticketId', ensureAuthenticated, async (req, res) => {
//   try {
//     console.log('DELETE /api/tickets/:ticketId - User:', req.user?._id || 'No user', 'TicketId:', req.params.ticketId);
//     if (!mongoose.Types.ObjectId.isValid(req.params.ticketId)) {
//       console.log('Invalid ticket ID:', req.params.ticketId);
//       return res.status(400).json({ error: 'Invalid ticket ID' });
//     }
//     const ticket = await Ticket.findById(req.params.ticketId);
//     if (!ticket) {
//       console.log('Ticket not found:', req.params.ticketId);
//       return res.status(404).json({ error: 'Ticket not found' });
//     }
//     if (ticket.userId.toString() !== req.user._id.toString() && req.user.isAdmin !== true) {
//       console.log('Unauthorized access:', { ticketUserId: ticket.userId.toString(), userId: req.user._id.toString() });
//       return res.status(403).json({ error: 'Unauthorized: You can only delete your own tickets' });
//     }
//     // Delete associated files
//     if (ticket.invoice) {
//       fs.unlink(path.join(__dirname, '..', ticket.invoice), (err) => {
//         if (err) console.error('Error deleting invoice:', err);
//       });
//     }
//     if (ticket.product_image) {
//       fs.unlink(path.join(__dirname, '..', ticket.product_image), (err) => {
//         if (err) console.error('Error deleting product image:', err);
//       });
//     }
//     await ticket.deleteOne();
//     console.log('Deleted ticket:', req.params.ticketId);
//     res.status(200).json({ message: 'Ticket deleted successfully' });
//   } catch (error) {
//     console.error('Error deleting ticket:', { name: error.name, message: error.message });
//     res.status(500).json({ error: 'Server error', details: error.message });
//   }
// });

// export default router;






import express from 'express';
import mongoose from 'mongoose';
import Ticket from '../models/Ticket.js';
import { ensureAuthenticated } from '../middleware/auth.js';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

const router = express.Router();

// Cloudinary storage setup
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'tickets',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    public_id: (req, file) => `${Date.now()}-${file.originalname}`,
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(file.originalname.toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only JPEG, JPG, or PNG images are allowed.'));
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// GET: Fetch all tickets for the authenticated user
router.get('/', ensureAuthenticated, async (req, res) => {
  try {
    console.log('GET /api/tickets - User:', req.user?._id || 'No user');
    const tickets = await Ticket.find({ userId: req.user._id });
    console.log('Fetched tickets:', tickets.length);
    res.status(200).json(tickets);
  } catch (err) {
    console.error('Error fetching tickets:', { name: err.name, message: err.message, stack: err.stack });
    res.status(500).json({ error: 'Server error', details: err.message });
  }
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
      if (!req.user?._id) {
        console.log('No user ID in session');
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const invoiceUrl = req.files['invoice'] ? req.files['invoice'][0].path : null;
      const productImageUrl = req.files['product_image'] ? req.files['product_image'][0].path : null;

      const newTicket = new Ticket({
        userId: req.user._id,
        issue,
        description,
        invoice: invoiceUrl,
        product_image: productImageUrl,
      });

      const savedTicket = await newTicket.save();
      console.log('Saved ticket:', savedTicket);
      res.status(201).json(savedTicket);
    } catch (err) {
      console.error('Error saving ticket:', { name: err.name, message: err.message, stack: err.stack });
      if (err.message.includes('Only JPEG, JPG, or PNG')) {
        res.status(400).json({ error: err.message });
      } else if (err.name === 'ValidationError') {
        console.log('MongoDB validation error:', err.errors);
        res.status(400).json({ error: err.message });
      } else {
        res.status(500).json({ error: 'Server error', details: err.message });
      }
    }
  }
);

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

      // Update images if new ones are uploaded
      if (req.files && req.files['invoice']) {
        if (ticket.invoice) {
          const publicId = ticket.invoice.split('/').pop().split('.')[0];
          await cloudinary.uploader.destroy(`tickets/${publicId}`).catch(err => console.error('Error deleting old invoice from Cloudinary:', err));
        }
        ticket.invoice = req.files['invoice'][0].path;
      }
      if (req.files && req.files['product_image']) {
        if (ticket.product_image) {
          const publicId = ticket.product_image.split('/').pop().split('.')[0];
          await cloudinary.uploader.destroy(`tickets/${publicId}`).catch(err => console.error('Error deleting old product image from Cloudinary:', err));
        }
        ticket.product_image = req.files['product_image'][0].path;
      }
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

// DELETE: Delete a ticket
router.delete('/:ticketId', ensureAuthenticated, async (req, res) => {
  try {
    console.log('DELETE /api/tickets/:ticketId - User:', req.user?._id || 'No user', 'TicketId:', req.params.ticketId);
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
      return res.status(403).json({ error: 'Unauthorized: You can only delete your own tickets' });
    }
    // Delete associated images from Cloudinary
    if (ticket.invoice) {
      const publicId = ticket.invoice.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`tickets/${publicId}`).catch(err => console.error('Error deleting invoice from Cloudinary:', err));
    }
    if (ticket.product_image) {
      const publicId = ticket.product_image.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`tickets/${publicId}`).catch(err => console.error('Error deleting product image from Cloudinary:', err));
    }
    await ticket.deleteOne();
    console.log('Deleted ticket:', req.params.ticketId);
    res.status(200).json({ message: 'Ticket deleted successfully' });
  } catch (error) {
    console.error('Error deleting ticket:', { name: error.name, message: error.message, stack: error.stack });
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

export default router;