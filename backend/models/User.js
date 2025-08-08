import mongoose from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  pendingEmail: { type: String },
  isVerified: { type: Boolean, default: false },
  otp: { type: String },
  otpExpires: { type: Date },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  isAdmin: { type: Boolean, default: false },
  fcmToken: { type: String }
}, { timestamps: true });

userSchema.plugin(passportLocalMongoose, {
  usernameField: 'email',
});

export default mongoose.model('User', userSchema);