import express from 'express';
import Ticket from '../models/Ticket.js';
import Chat from '../models/Chat.js';
import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';
// import { ensureAuthenticated } from '../middleware/auth.js';
dotenv.config();

const router = express.Router();

// Ticket Routes
router.get('/', async (req, res) => {
  try {
    const tickets = await Ticket.find();
    console.log('Fetched tickets:', tickets);
    if (!tickets.length) {
      return res.status(404).json({ message: 'No tickets found' });
    }
    res.json(tickets);
  } catch (error) {
    console.error('Error fetching tickets:', error);
    res.status(500).json({ error: 'Failed to fetch tickets' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndDelete(req.params.id);
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }
    await Chat.deleteMany({ ticketId: req.params.id });
    console.log('Deleted ticket and chats:', ticket);
    res.json({ message: 'Ticket deleted' });
  } catch (error) {
    console.error('Error deleting ticket:', error);
    res.status(500).json({ error: 'Failed to delete ticket' });
  }
});

// Telegram Bot Setup
const token = process.env.TELEGRAM_BOT_TOKEN;
const defaultChatId = process.env.TELEGRAM_CHAT_ID;

if (!token || !defaultChatId) {
  console.error('Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID in .env');
  process.exit(1);
}

const bot = new TelegramBot(token, { polling: false });

// Start polling with retry
const startPollingWithRetry = async (retries = 5, delay = 2000) => {
  console.log('Attempting to stop any existing polling sessions...');
  for (let i = 0; i < retries; i++) {
    try {
      await bot.stopPolling({ cancel: true });
      console.log('Existing polling stopped successfully');
      await bot.startPolling({ restart: true, timeout: 10 });
      console.log('Started new polling session');
      return;
    } catch (error) {
      console.error(`Polling attempt ${i + 1} failed:`, error);
      if (i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  console.error('Failed to start polling after retries.');
};

startPollingWithRetry();

// Verify bot
bot.getMe().then((botInfo) => {
  console.log('Bot info:', botInfo);
}).catch((error) => {
  console.error('Error fetching bot info:', error);
});

bot.on('polling_error', (error) => console.error('Polling error:', error));

// Chat configurations

const chatConfigs = {};
const initializeChatConfigs = async () => {
  try {
    const tickets = await Ticket.find();
    console.log('Initializing chat configs with tickets:', tickets);
    tickets.forEach((ticket) => {
      chatConfigs[ticket._id.toString()] = {
        chatId: defaultChatId,
        issueTitle: ticket.issue,
      };
    });
  } catch (error) {
    console.error('Error initializing chat configs:', error);
  }
};

initializeChatConfigs();

// Function to add or update chatConfig for a ticket
const updateChatConfig = async (ticketId) => {
  try {
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      console.error(`Ticket not found for ticketId: ${ticketId}`);
      return false;
    }
    chatConfigs[ticketId] = {
      chatId: defaultChatId,
      issueTitle: ticket.issue,
    };
    console.log(`Updated chatConfig for ticket ${ticketId}`);
    return true;
  } catch (error) {
    console.error(`Error updating chatConfig for ticket ${ticketId}:`, error);
    return false;
  }
};

// Handle incoming Telegram messages
bot.on('message', async (msg) => {
  console.log('Received Telegram message:', {
    chatId: msg.chat.id,
    text: msg.text,
    fromUserId: msg.from.id,
  });

  for (const ticketId in chatConfigs) {
    const config = chatConfigs[ticketId];
    const prefix = `[${config.issueTitle}]`;
    if (msg.chat.id == config.chatId && msg.text && msg.text.startsWith(prefix)) {
      const cleanText = msg.text.replace(`${prefix} `, '');
      try {
        await Chat.create({
          userId: msg.from.id.toString(),
          message: cleanText,
          ticketId,
          isAdmin: false,
        });
        console.log(`Saved Telegram message for ticket ${ticketId}`);
      } catch (error) {
        console.error(`Error saving Telegram message for ticket ${ticketId}:`, error);
      }
    }
  }
});
router.post('/send/:ticketId', async (req, res) => {
  const { ticketId } = req.params;
  const { text, isAdmin = false } = req.body;

  // Check and update chatConfigs if missing
  if (!chatConfigs[ticketId]) {
    const configUpdated = await updateChatConfig(ticketId);
    if (!configUpdated) {
      console.error(`Chat not found for ticketId: ${ticketId}`);
      return res.status(404).send('Chat not found');
    }
  }

  if (!text) {
    console.error('Missing text in request body');
    return res.status(400).send('Missing text');
  }

  const { chatId, issueTitle } = chatConfigs[ticketId];
  const prefixedText = `[${issueTitle}] ${text}`;

  try {
    const chat = await Chat.create({
      userId: isAdmin ? 'Admin' : 'User-aks',
      message: text,
      ticketId,
      isAdmin,
    });
    await bot.sendMessage(chatId, prefixedText);
    console.log(`Message sent for ticket ${ticketId}`);
    res.status(200).send('Message sent');
  } catch (error) {
    console.error(`Error sending message for ticket ${ticketId}:`, error);
    res.status(500).send(`Error sending message: ${error.message}`);
  }
});

router.get('/messages/:ticketId', async (req, res) => {
  const { ticketId } = req.params;
  console.log('Fetching messages for ticketId:', ticketId);

  // Check and update chatConfigs if missing
  if (!chatConfigs[ticketId]) {
    const configUpdated = await updateChatConfig(ticketId);
    if (!configUpdated) {
      console.error(`Chat not found for ticketId: ${ticketId}`);
      return res.status(404).send('Chat not found');
    }
  }

  try {
    const messages = await Chat.find({ ticketId }).sort({ createdAt: 1 });
    console.log('Fetched messages:', messages);
    res.json(messages.map(msg => ({
      userId: msg.userId,
      text: msg.message,
      isAdmin: msg.isAdmin,
    })));
  } catch (error) {
    console.error(`Error fetching messages for ticket ${ticketId}:`, error);
    res.status(500).send('Failed to fetch messages');
  }
});

router.delete('/delete/:ticketId', async (req, res) => {
  const { ticketId } = req.params;

  // Check and update chatConfigs if missing
  if (!chatConfigs[ticketId]) {
    const configUpdated = await updateChatConfig(ticketId);
    if (!configUpdated) {
      console.error(`Chat not found for ticketId: ${ticketId}`);
      return res.status(404).send('Chat not found');
    }
  }

  try {
    await Chat.deleteMany({ ticketId });
    console.log(`Cleared chats for ticket ${ticketId}`);
    res.status(200).send('Chat cleared');
  } catch (error) {
    console.error(`Error clearing chat for ticket ${ticketId}:`, error);
    res.status(500).send('Failed to clear chat');
  }
});

export default router;