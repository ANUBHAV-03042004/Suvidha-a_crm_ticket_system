// models/User.js
// const mongoose = require('mongoose');
// const passportLocalMongoose = require('passport-local-mongoose');
import mongoose from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  isVerified: { type: Boolean, default: false },
  otp: { type: String },
  otpExpires: { type: Date },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  isAdmin: { type: Boolean, default: false }
});

// Integrate passport-local-mongoose
userSchema.plugin(passportLocalMongoose, {
  usernameField: 'email', // Use email instead of username for login
});

// module.exports = mongoose.model('User', userSchema);
const User = mongoose.model('User', userSchema);
export default User;