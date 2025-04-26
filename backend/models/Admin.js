// models/Admin.js
import mongoose from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  secretCode: { type: String, required: true }, // Required field, no default
  isVerified: { type: Boolean, default: false },
  otp: { type: String },
  otpExpires: { type: Date },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  isAdmin: { type: Boolean, default: true }
});

adminSchema.plugin(passportLocalMongoose, { usernameField: 'email' });

const Admin = mongoose.model('Admin', adminSchema);

export default Admin;