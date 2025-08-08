import mongoose from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  pendingEmail: { type: String },
  secretCode: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  otp: { type: String },
  otpExpires: { type: Date },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  isAdmin: { type: Boolean, default: true },
  fcmToken: { type: String }
});

// Remove any pre-save hooks that might interfere
adminSchema.pre('save', function (next) {
  console.log('Saving admin document:', this);
  next();
});

adminSchema.plugin(passportLocalMongoose, { usernameField: 'email' });

const Admin = mongoose.model('Admin', adminSchema);

export default Admin;