import express from 'express';
import Admin from '../models/Admin.js';
import { isAdminAuthenticated } from '../middleware/auth.js';
import nodemailer from 'nodemailer';

const router = express.Router();

// Middleware to check admin authentication

// Get current admin
router.get('/me', isAdminAuthenticated, async (req, res) => {
  try {
    const admin = await Admin.findById(req.user._id).select('username email pendingEmail');
    if (!admin) {
      console.log('Admin not found for ID:', req.user._id);
      return res.status(404).json({ error: 'Admin not found' });
    }
    res.json(admin);
  } catch (err) {
    console.error('Error fetching admin:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update admin profile
router.put('/me', isAdminAuthenticated, async (req, res) => {
  try {
    const { username, email, pendingEmail } = req.body;
    console.log('Received update payload:', { username, email, pendingEmail });
    const admin = await Admin.findById(req.user._id);
    if (!admin) {
      console.log('Admin not found for ID:', req.user._id);
      return res.status(404).json({ error: 'Admin not found' });
    }

    // Update username
    if (username && username !== admin.username) {
      const existingAdmin = await Admin.findOne({ username });
      if (existingAdmin && existingAdmin._id.toString() !== admin._id.toString()) {
        return res.status(400).json({ error: 'Username already taken' });
      }
      admin.username = username;
    }

    // Handle email change
    if (pendingEmail && pendingEmail !== admin.email) {
      const existingAdmin = await Admin.findOne({ email: pendingEmail });
      if (existingAdmin) {
        return res.status(400).json({ error: 'Email already in use' });
      }
      admin.pendingEmail = pendingEmail;
      admin.isVerified = false;
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      admin.otp = otp;
      admin.otpExpires = Date.now() + 10 * 60 * 1000;
      admin.markModified('pendingEmail'); 
      console.log('Updating admin with:', { pendingEmail, otp, otpExpires: admin.otpExpires });
      await sendOtpEmail(pendingEmail, otp);
    } else if (email && email === admin.email) {
      admin.email = email;
    }

    try {
      await admin.save();
      console.log('Admin saved successfully:', { pendingEmail: admin.pendingEmail });
    } catch (saveErr) {
      console.error('Error saving admin:', saveErr);
      return res.status(500).json({ error: 'Failed to save profile changes' });
    }

    res.json({ message: 'Profile updated', emailChanged: !!pendingEmail });
  } catch (err) {
    console.error('Error updating admin profile:', err);
    res.status(400).json({ error: err.message || 'Failed to update profile' });
  }
});

// Update admin password
router.put('/password', isAdminAuthenticated, async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const admin = await Admin.findById(req.user._id);
    if (!admin) {
      console.log('Admin not found for ID:', req.user._id);
      return res.status(404).json({ error: 'Admin not found' });
    }

    // Verify current password
    const authenticated = await new Promise((resolve) => {
      admin.authenticate(currentPassword, (err, model, passwordError) => {
        if (err || passwordError) {
          console.log('Password auth failed:', { err, passwordError });
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });

    if (!authenticated) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: 'New passwords do not match' });
    }

    await admin.setPassword(newPassword);
    await admin.save();
    res.json({ message: 'Password updated' });
  } catch (err) {
    console.error('Error updating admin password:', err);
    res.status(400).json({ error: err.message || 'Failed to update password' });
  }
});

// Delete admin account
router.delete('/me', isAdminAuthenticated, async (req, res) => {
  try {
    const admin = await Admin.findByIdAndDelete(req.user._id);
    if (!admin) {
      console.log('Admin not found for ID:', req.user._id);
      return res.status(404).json({ error: 'Admin not found' });
    }
    req.logout((err) => {
      if (err) console.error('Logout error:', err);
    });
    res.json({ message: 'Account deleted' });
  } catch (err) {
    console.error('Error deleting admin account:', err);
    res.status(500).json({ error: 'Failed to delete account' });
  }
});

// Send OTP email
const sendOtpEmail = async (email, otp) => {
  try {
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
    console.log('OTP email sent to:', email);
  } catch (err) {
    console.error('Error sending OTP email:', err);
    throw new Error('Failed to send OTP email');
  }
};

export default router;