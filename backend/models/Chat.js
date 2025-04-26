import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
  userId: {
    type: String, // Allow string for Telegram user IDs or 'Admin'
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  ticketId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ticket',
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Chat = mongoose.model('Chat', chatSchema);
export default Chat;