// const Joi = require('joi');
import Joi from 'joi'
const validateRegister = (req, res, next) => {
  const schema = Joi.object({
    username: Joi.string().min(3).max(30).required().messages({
      'string.base': 'Username must be a string',
      'string.min': 'Username must be at least 3 characters long',
      'string.max': 'Username must be at most 30 characters long',
      'any.required': 'Username is required'
    }),
    email: Joi.string().email().required().messages({
      'string.email': 'Please provide a valid email',
      'any.required': 'Email is required'
    }),
    password: Joi.string().min(6).required().messages({
      'string.min': 'Password must be at least 6 characters long',
      'any.required': 'Password is required'
    })
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

 const validateVerifyOtp = (req, res, next) => {
  const { email, otp, originalEmail } = req.body;
  if (!email || !otp || typeof otp !== 'string' || otp.length !== 6) {
    return res.status(400).json({ error: 'Invalid email or OTP' });
  }
  // originalEmail is optional but must be a valid email if provided
  if (originalEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(originalEmail)) {
    return res.status(400).json({ error: 'Invalid original email format' });
  }
  next();
};

 const validateResendOtp = (req, res, next) => {
  const { email, originalEmail } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }
  if (originalEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(originalEmail)) {
    return res.status(400).json({ error: 'Invalid original email format' });
  }
  next();
};
const validateAdminRegister = (req, res, next) => {
  const schema = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    secretCode: Joi.string().required(), // Required for admin registration
  });

  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({ error: error.details.map(detail => detail.message).join(', ') });
  }
  next();
};
// module.exports = { validateRegister, validateVerifyOtp, validateResendOtp };
export { validateRegister, validateVerifyOtp, validateResendOtp,validateAdminRegister };
