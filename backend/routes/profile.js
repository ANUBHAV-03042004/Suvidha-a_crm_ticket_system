import express from 'express';
import User from '../models/User.js';
import Ticket from '../models/Ticket.js';
import Chat from '../models/Chat.js';
import {  ensureAuthenticated } from '../middleware/auth.js';
import nodemailer from 'nodemailer';

const router = express.Router();

// Get current user
router.get('/me',  ensureAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('username email');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update profile
router.put('/me',  ensureAuthenticated, async (req, res) => {
  try {
    const { username, email, pendingEmail } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update username
    if (username && username !== user.username) {
      const existingUser = await User.findOne({ username });
      if (existingUser && existingUser._id.toString() !== user._id.toString()) {
        return res.status(400).json({ error: 'Username already taken' });
      }
      user.username = username;
    }

    // Handle email change
    if (pendingEmail && pendingEmail !== user.email) {
      const existingUser = await User.findOne({ email: pendingEmail });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already in use' });
      }
      user.pendingEmail = pendingEmail;
      user.isVerified = false;
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      user.otp = otp;
      user.otpExpires = Date.now() + 10 * 60 * 1000;
      await sendOtpEmail(pendingEmail, otp);
    } else if (email && email === user.email) {
      user.email = email;
    }

    await user.save();
    res.json({ message: 'Profile updated' });
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(400).json({ error: err.message || 'Failed to update profile' });
  }
});

// Update password
router.put('/password',  ensureAuthenticated, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify current password using passport-local-mongoose
    const authenticated = await new Promise((resolve) => {
      user.authenticate(currentPassword, (err, model, passwordError) => {
        if (err || passwordError) {
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });

    if (!authenticated) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    await user.setPassword(newPassword);
    await user.save();
    res.json({ message: 'Password updated' });
  } catch (err) {
    console.error('Error updating password:', err);
    res.status(400).json({ error: err.message || 'Failed to update password' });
  }
});

// Delete account
router.delete('/me',  ensureAuthenticated, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user._id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    await Ticket.deleteMany({ userId: req.user._id });
    await Chat.deleteMany({ userId: req.user._id });
    res.json({ message: 'Account deleted' });
  } catch (err) {
    console.error('Error deleting account:', err);
    res.status(500).json({ error: 'Failed to delete account' });
  }
});

// Send OTP email
const sendOtpEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'OTP for Suvidha CRM Email Verification',
    html: `
      <div style="font-family: Arial, sans-serif; background-color: white; padding: 20px; display: flex; justify-content: center; align-items: center; height: 60vh; margin: 0;">
        <div style="width: 400px; background-color: rgb(19, 13, 13); padding: 20px; border-radius: 8px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1); margin: 0 auto; text-align: center;">
          <h2 style="color: white;">Your OTP Code</h2>
          <p style="color: white;">Use the following OTP to verify your new email:</p>
          <h1 style="background-color: #007bff; color: white; display: inline-block; padding: 10px 20px; border-radius: 5px;">${otp}</h1>
          <p style="color: white;">This OTP is valid for 10 minutes.</p>
          <p style="color: white;">If you did not request this, please ignore this email.</p>
          <p style="border-top: 1px solid white; font-size: 12px; color: white; margin: 20px 0 0; padding-top: 10px;">© 2025 Suvidha - All Rights Reserved</p>
        </div>
      </div>
    `,
  });
};

export default router;