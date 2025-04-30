import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  address: { type: String, required: true, trim: true },
  mobileNumber: { type: String, required: true, trim: true },
  company: { type: String, required: true, trim: true },
  totalOrder: { type: Number, required: true, min: 0 },
  orderId: { type: Number, required: true, unique: true },
  order_invoice:{type:String},
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true }, // Admin who added the client
}, { timestamps: true });

export default mongoose.model('Client', clientSchema);