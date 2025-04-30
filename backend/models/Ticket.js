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
      type: String,
    },
    product_image: {
      type: String, 
    },
    status: {
      type: String,
      enum: ['pending', 'resolved'], 
      default: 'pending', 
      required: true,
    },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

// Custom pre-save middleware to ensure updatedAt is set
ticketSchema.pre('save', function (next) {
  this.updatedAt = Date.now(); 
  next();
});

const Ticket = mongoose.model('Ticket', ticketSchema);
export default Ticket;