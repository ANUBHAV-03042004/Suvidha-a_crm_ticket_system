import express from 'express';
import Feedback from '../models/feedback.js';
import { ensureAuthenticated } from '../middleware/auth.js';
import axios from 'axios';

const router = express.Router();

// Submit feedback
router.post('/submit', ensureAuthenticated, async (req, res) => {
  try {
    const { username, email, rating, comments } = req.body;
    console.log('Feedback submission:', { username, email, rating, comments, userId: req.user._id });

    // Validate input
    if (!username || !email || !rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Username, email, and valid rating (1-5) are required' });
    }
    if (comments && comments.length > 500) {
      return res.status(400).json({ error: 'Comments cannot exceed 500 characters' });
    }

    // Save to MongoDB
    const feedback = new Feedback({
      username,
      email,
      rating,
      comments: comments || '',
      userId: req.user._id,
    });
    await feedback.save();
    console.log('Feedback saved:', feedback);

    // Send to Telegram
    const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
    const telegramChatId = process.env.TELEGRAM_CHAT_ID;
    const message = `
*New Feedback Received*
*Username*: ${username}
*Email*: ${email}
*Rating*: ${rating} ⭐
*Comments*: ${comments || 'None'}
*User ID*: ${req.user._id}
*Timestamp*: ${new Date().toISOString()}
    `.trim();

    try {
      await axios.post(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
        chat_id: telegramChatId,
        text: message,
        parse_mode: 'Markdown',
      });
      console.log('Feedback sent to Telegram');
    } catch (telegramError) {
      console.error('Error sending to Telegram:', telegramError.response?.data || telegramError.message);
      // Don't fail the request if Telegram fails
    }

    res.status(200).json({ message: 'Feedback submitted successfully' });
  } catch (err) {
    console.error('Error submitting feedback:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;