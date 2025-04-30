import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comments: { type: String, default: '' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

export default mongoose.model('Feedback', feedbackSchema);