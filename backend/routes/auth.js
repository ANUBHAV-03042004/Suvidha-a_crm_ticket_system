// routes/auth.js
import express from 'express';
import passport from 'passport';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import User from '../models/User.js';
import Admin from '../models/Admin.js';
import cors from 'cors';
import { validateRegister, validateVerifyOtp, validateResendOtp, validateAdminRegister } from '../middleware/validate.js';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

const isAuthenticated = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: 'Unauthorized: Please log in' });
  }
  next();
};

router.post('/register', validateRegister, async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const user = new User({ username, email, otp, otpExpires: Date.now() + 10 * 60 * 1000 });
    await User.register(user, password);
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
    });
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'OTP for Suvidha CRM Registration',
      html: `
        <div style="font-family: Arial, sans-serif; background-color: white; padding: 20px; display: flex; justify-content: center; align-items: center; height: 60vh; margin: 0;">
          <div style="width: 400px; background-color: rgb(19, 13, 13); padding: 20px; border-radius: 8px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1); margin: 0 auto; text-align: center;">
            <h2 style="color: white;">Your OTP Code</h2>
            <p style="color: white;">Use the following OTP to complete your verification:</p>
            <h1 style="background-color: #007bff; color: white; display: inline-block; padding: 10px 20px; border-radius: 5px;">${otp}</h1>
            <p style="color: white;">This OTP is valid for 10 minutes.</p>
            <p style="color: white;">If you did not request this, please ignore this email.</p>
            <p style="border-top: 1px solid white; font-size: 12px; color: white; margin: 20px 0 0; padding-top: 10px;">© 2025 Suvidha - All Rights Reserved</p>
          </div>
        </div>
      `
    });
    req.login(user, err => {
      if (err) {
        console.error('Login error after registration:', err);
        return res.status(500).json({ error: 'Failed to create session' });
      }
      res.status(200).json({ message: 'Registration successful, OTP sent to email' });
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// router.post('/login', (req, res, next) => {
//   const { email } = req.body;
//   console.log('Login attempt:', { email, sessionID: req.sessionID });
//   passport.authenticate('local-user', { session: true }, (err, user, info) => {
//     if (err) {
//       console.error('Passport authentication error:', err);
//       return res.status(500).json({ error: 'Server error' });
//     }
//     if (!user) {
//       console.log('Authentication failed:', info);
//       if (info.message === 'Missing credentials') {
//         return res.status(400).json({ error: 'Email and password are required' });
//       }
//       if (info.message === 'Incorrect username') {
//         return res.status(400).json({ error: 'User not found' });
//       }
//       if (info.message === 'Incorrect password') {
//         return res.status(400).json({ error: 'Incorrect password' });
//       }
//       if (info.message === 'User not verified') {
//         return res.status(400).json({ error: 'User not verified' });
//       }
//       return res.status(400).json({ error: 'Invalid credentials' });
//     }
//     if (!user.isVerified) {
//       console.log('User not verified:', { email });
//       return res.status(400).json({ error: 'User not verified' });
//     }
//     req.logIn(user, (loginErr) => {
//       if (loginErr) {
//         console.error('Login error:', loginErr);
//         return res.status(500).json({ error: 'Login failed' });
//       }
//       console.log('Login successful:', { userId: user._id, email: user.email, isAdmin: user.isAdmin });
//       return res.status(200).json({
//         message: 'Login successful',
//         user: { id: user._id, email: user.email, isAdmin: user.isAdmin || false },
//       });
//     });
//   })(req, res, next);
// });

router.post('/login', (req, res, next) => {
  console.log('Login attempt:', { email: req.body.email, sessionID: req.sessionID });

  passport.authenticate('local-user', { session: true }, (err, user, info) => {
    if (err) {
      console.error('Authentication error:', err);
      return res.status(500).json({ error: 'Server error' });
    }
    if (!user) {
      console.log('Auth failed:', info);
      return res.status(400).json({ error: info.message || 'Invalid credentials' });
    }

    req.logIn(user, { session: true }, (loginErr) => {
      if (loginErr) {
        console.error('Login error:', loginErr);
        return res.status(500).json({ error: 'Login failed' });
      }

      req.session.save((saveErr) => {
        if (saveErr) {
          console.error('Session save error:', saveErr);
          return res.status(500).json({ error: 'Failed to save session' });
        }
        console.log('Session after login:', JSON.stringify(req.session));
        res.setHeader('Set-Cookie', `connect.sid=${req.sessionID}; Path=/; HttpOnly; Secure; SameSite=None`);
        return res.status(200).json({
          message: 'Login successful',
          user: { id: user._id, email: user.email, isAdmin: user.isAdmin || false },
          redirect: '/user-dashboard',
        });
      });
    });
  })(req, res, next);
});

router.post('/logout', (req, res) => {
  req.logout(err => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ error: 'Failed to logout' });
    }
    req.session.destroy(err => {
      if (err) {
        console.error('Session destroy error:', err);
        return res.status(500).json({ error: 'Failed to destroy session' });
      }
      res.clearCookie('connect.sid', { path: '/', httpOnly: true, sameSite: 'strict' });
      res.status(200).json({ message: 'Logout successful' });
    });
  });
});

router.post('/verify-otp', validateVerifyOtp, async (req, res) => {
  try {
    const { email, otp, originalEmail } = req.body;
    console.log('Verify OTP request:', { email, otp, originalEmail, sessionID: req.sessionID });
    let admin = await Admin.findOne({ pendingEmail: email });
    let user = null;
    if (!admin && originalEmail) {
      admin = await Admin.findOne({ email: originalEmail });
    }
    if (!admin) {
      admin = await Admin.findOne({ email });
      if (!admin) {
        user = await User.findOne({ $or: [{ email }, { pendingEmail: email }, { email: originalEmail }] });
        if (!user) {
          console.log('No user or admin found for email, pendingEmail, or originalEmail:', { email, originalEmail });
          return res.status(400).json({ error: 'User or admin not found' });
        }
      }
    }
    const entity = user || admin;
    console.log('Selected entity:', {
      _id: entity._id,
      email: entity.email,
      pendingEmail: entity.pendingEmail,
      otp: entity.otp,
      otpExpires: entity.otpExpires,
      isAdmin: entity.isAdmin
    });
    if (!entity.otp || entity.otp !== otp) {
      console.log('OTP mismatch:', { storedOtp: entity.otp, providedOtp: otp });
      return res.status(400).json({ error: 'Invalid OTP' });
    }
    if (!entity.otpExpires || entity.otpExpires < Date.now()) {
      console.log('OTP expired:', { otpExpires: entity.otpExpires, now: Date.now() });
      return res.status(400).json({ error: 'Expired OTP' });
    }
    entity.isVerified = true;
    entity.otp = null;
    entity.otpExpires = null;
    if (entity.pendingEmail) {
      console.log('Updating email from pendingEmail:', entity.pendingEmail);
      entity.email = entity.pendingEmail;
      entity.pendingEmail = null;
    }
    await entity.save();
    const isAdmin = entity.isAdmin || false;
    console.log('Entity after verification:', {
      _id: entity._id,
      email: entity.email,
      pendingEmail: entity.pendingEmail,
      isVerified: entity.isVerified,
      isAdmin
    });
    res.status(200).json({
      message: 'Email verified successfully',
      isAdmin
    });
  } catch (err) {
    console.error('OTP verification error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/resend-otp', validateResendOtp, async (req, res) => {
  try {
    const { email, originalEmail } = req.body;
    console.log('Resend OTP request:', { email, originalEmail, sessionID: req.sessionID });
    const user = await User.findOne({
      $or: [{ email: originalEmail || email }, { pendingEmail: email }],
    });
    let admin = null;
    if (!user) {
      admin = await Admin.findOne({
        $or: [{ email: originalEmail || email }, { pendingEmail: email }],
      });
      if (!admin) {
        console.log('No user or admin found for:', { email, originalEmail });
        return res.status(400).json({ error: 'User or admin not found' });
      }
    }
    const entity = user || admin;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    entity.otp = otp;
    entity.otpExpires = Date.now() + 10 * 60 * 1000;
    const targetEmail = entity.pendingEmail || entity.email;
    await sendOtpEmail(targetEmail, otp, entity.isAdmin || false);
    await entity.save();
    console.log('OTP resent:', { targetEmail, otp, otpExpires: entity.otpExpires });
    res.status(200).json({ message: 'OTP resent successfully' });
  } catch (err) {
    console.error('Resend OTP error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/forgot', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    let admin = null;
    if (!user) {
      admin = await Admin.findOne({ email });
      if (!admin) {
        return res.status(400).json({ error: 'User or admin not found' });
      }
    }
    const entity = user || admin;
    const resetToken = crypto.randomBytes(32).toString('hex');
    entity.resetPasswordToken = resetToken;
    entity.resetPasswordExpires = Date.now() + 60 * 60 * 1000;
    await entity.save();
    const FRONTEND_URL= process.env.CLIENT_URL || `https://suvidha-36fa1.web.app`;
    const resetUrl = `${FRONTEND_URL}/reset/${entity._id}/${resetToken}`;
    // const resetUrl = `http://localhost:5173/reset/${entity._id}/${resetToken}`;
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
    });
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset for Suvidha CRM',
      html: `
        <div style="font-family: Arial, sans-serif; background-color: white; padding: 20px; display: flex; justify-content: center; align-items: center; height: 60vh; margin: 0;">
          <div style="width: 400px; background-color: rgb(19, 13, 13); padding: 20px; border-radius: 8px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1); margin: 0 auto; text-align: center;">
            <h2 style="color: white;">Password Reset</h2>
            <p style="color: white;">Click the link below to reset your password:</p>
            <a href="${resetUrl}" style="background-color: ${entity.isAdmin ? '#b782d8' : '#007bff'}; color: white; display: inline-block; padding: 10px 20px; border-radius: 5px; text-decoration: none;">Reset Password</a>
            <p style="color: white;">This link is valid for 1 hour.</p>
            <p style="color: white;">If you did not request this, please ignore this email.</p>
            <p style="border-top: 1px solid white; font-size: 12px; color: white; margin: 20px 0 0; padding-top: 10px;">© 2025 Suvidha - All Rights Reserved</p>
          </div>
        </div>
      `
    });
    res.status(200).json({ message: 'Password reset email sent' });
  } catch (err) {
    console.error('Forgot password error:', err);
    if (err.name === 'MongoServerError' || err.name === 'MongooseError') {
      return res.status(500).json({ error: 'Database error: Unable to process request' });
    }
    if (err.code === 'EAUTH') {
      return res.status(500).json({ error: 'Failed to send email: Invalid email credentials' });
    }
    if (err.code === 'ESOCKET' || err.code === 'ETIMEDOUT') {
      return res.status(500).json({ error: 'Failed to send email: Network error' });
    }
    res.status(500).json({ error: 'Server error: Failed to process request' });
  }
});

router.post('/reset/:id/:token', async (req, res) => {
  try {
    const { id, token } = req.params;
    const { password } = req.body;
    const user = await User.findOne({
      _id: id,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });
    let admin = null;
    if (!user) {
      admin = await Admin.findOne({
        _id: id,
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() }
      });
      if (!admin) {
        return res.status(400).json({ error: 'Invalid or expired reset token' });
      }
    }
    const entity = user || admin;
    await entity.setPassword(password);
    entity.resetPasswordToken = null;
    entity.resetPasswordExpires = null;
    await entity.save();
    res.status(200).json({ message: 'Password reset successful' });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// router.get('/check', (req, res) => {
//   if (req.isAuthenticated()) {
//     const isAdmin = req.user instanceof Admin;
//     res.status(200).json({
//       user: {
//         id: req.user._id,
//         email: req.user.email,
//         isAdmin,
//       },
//     });
//   } else {
//     res.status(401).json({ error: 'Not authenticated' });
//   }
// });

router.get('/check', (req, res) => {
  console.log('Auth check:', {
    sessionID: req.sessionID,
    user: req.user ? req.user.email : 'none',
    session: JSON.stringify(req.session),
  });
  if (req.isAuthenticated()) {
    return res.status(200).json({
      user: {
        id: req.user._id,
        email: req.user.email,
        isAdmin: req.user.isAdmin || false,
      },
    });
  }
  return res.status(401).json({ error: 'Not authenticated' });
});

router.get('/admin/check', (req, res) => {
  res.json({ isAdminAuthenticated: req.isAuthenticated() && req.user?.isAdmin });
});

router.post('/register/admin', validateAdminRegister, async (req, res) => {
  try {
    const { username, email, password, secretCode } = req.body;
    if (!secretCode || secretCode !== '03042004') {
      return res.status(400).json({ error: 'Invalid secret code. Must be Known to you' });
    }
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const admin = new Admin({ secretCode, username, email, otp, isAdmin: true, otpExpires: Date.now() + 10 * 60 * 1000 });
    await Admin.register(admin, password);
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
    });
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'OTP for Suvidha CRM Admin Registration',
      html: `
        <div style="font-family: Arial, sans-serif; background-color: white; padding: 20px; display: flex; justify-content: center; align-items: center; height: 60vh; margin: 0;">
          <div style="width: 400px; background-color: rgb(19, 13, 13); padding: 20px; border-radius: 8px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1); margin: 0 auto; text-align: center;">
            <h2 style="color: white;">Your OTP Code</h2>
            <p style="color: white;">Use the following OTP to complete your admin verification:</p>
            <h1 style="background-color: #b782d8; color: white; display: inline-block; padding: 10px 20px; border-radius: 5px;">${otp}</h1>
            <p style="color: white;">This OTP is valid for 10 minutes.</p>
            <p style="color: white;">If you did not request this, please ignore this email.</p>
            <p style="border-top: 1px solid white; font-size: 12px; color: white; margin: 20px 0 0; padding-top: 10px;">© 2025 Suvidha - All Rights Reserved</p>
          </div>
        </div>
      `
    });
    req.login(admin, err => {
      if (err) {
        console.error('Login error after admin registration:', err);
        return res.status(500).json({ error: 'Failed to create session' });
      }
      res.status(200).json({ message: 'Admin registration successful, OTP sent to email' });
    });
  } catch (err) {
    console.error('Admin registration error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// router.post('/login/admin', (req, res, next) => {
//   passport.authenticate('local-admin', (err, admin, info) => {
//     if (err) {
//       console.error('Authentication error:', err);
//       return next(err);
//     }
//     if (!admin) {
//       console.log('Admin authentication failed - Info:', info);
//       return res.status(400).json({ error: info?.message || 'Admin not found' });
//     }
//     if (!admin.isVerified) {
//       console.log('Admin not verified:', admin.email);
//       return res.status(400).json({ error: 'Admin not verified' });
//     }
//     req.logIn(admin, (err) => {
//       if (err) {
//         console.error('Login session error:', err);
//         return res.status(500).json({ error: 'Login failed' });
//       }
//       res.status(200).json({
//         message: 'Admin login successful',
//         user: { id: admin._id, email: admin.email, isAdmin: true },
//       });
//     });
//   })(req, res, next);
// });

router.post('/login/admin', (req, res, next) => {
  const { email, password, secretCode } = req.body;
  console.log('Admin login attempt:', { email, sessionID: req.sessionID });
  if (secretCode !== process.env.SECRET_CODE) {
    console.log('Invalid secret code');
    return res.status(400).json({ error: 'Invalid secret code' });
  }
  passport.authenticate('local-admin', { session: true }, (err, admin, info) => {
    if (err) {
      console.error('Admin auth error:', err);
      return res.status(500).json({ error: 'Server error' });
    }
    if (!admin) {
      console.log('Admin auth failed:', info);
      return res.status(400).json({ error: info.message || 'Invalid credentials' });
    }
    req.logIn(admin, { session: true }, (loginErr) => {
      if (loginErr) {
        console.error('Admin login error:', loginErr);
        return res.status(500).json({ error: 'Login failed' });
      }
      req.session.save((saveErr) => {
        if (saveErr) {
          console.error('Session save error:', saveErr);
          return res.status(500).json({ error: 'Failed to save session' });
        }
        console.log('Session after admin login:', JSON.stringify(req.session));
        res.setHeader('Set-Cookie', `connect.sid=${req.sessionID}; Path=/; HttpOnly; Secure; SameSite=None`);
        return res.status(200).json({
          message: 'Admin login successful',
          user: { id: admin._id, email: admin.email, isAdmin: true },
          redirect: '/admin-dashboard',
        });
      });
    });
  })(req, res, next);
});


const sendOtpEmail = async (email, otp, isAdmin = false) => {
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
          <p style="color: white;">Use the following OTP to verify your ${isAdmin ? 'admin' : 'user'} email:</p>
          <h1 style="background-color: ${isAdmin ? '#b782d8' : '#007bff'}; color: white; display: inline-block; padding: 10px 20px; border-radius: 5px;">${otp}</h1>
          <p style="color: white;">This OTP is valid for 10 minutes.</p>
          <p style="color: white;">If you did not request this, please ignore this email.</p>
          <p style="border-top: 1px solid white; font-size: 12px; color: white; margin: 20px 0 0; padding-top: 10px;">© 2025 Suvidha - All Rights Reserved</p>
        </div>
      </div>
    `,
  });
};

export default router;