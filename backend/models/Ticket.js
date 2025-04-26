// models/Ticket.js
import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    issue: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    invoice: {
      type: String, // Store the file path or URL after upload
    },
    product_image: {
      type: String, // Store the file path or URL after upload
    },
    status: {
      type: String,
      enum: ['pending', 'resolved'], // Define valid status values
      default: 'pending', // Default status
      required: true,
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  }
);

// Custom pre-save middleware to ensure updatedAt is set
ticketSchema.pre('save', function (next) {
  this.updatedAt = Date.now(); // Update updatedAt on every save
  next();
});

const Ticket = mongoose.model('Ticket', ticketSchema);
export default Ticket;