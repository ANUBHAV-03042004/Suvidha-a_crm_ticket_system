import express from 'express';
import TelegramBot from 'node-telegram-bot-api';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
// import user_issue from '../frontend/src/assets/user_table.js';
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Bot token - Verify with @BotFather
const token = process.env.TELEGRAM_BOT_TOKEN;
const defaultChatId = process.env.TELEGRAM_CHAT_ID;

const bot = new TelegramBot(token, { polling: false }); // Start with polling off

// Forcefully stop polling with retry
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
        console.log(`Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  console.error('Failed to start polling after retries. Please ensure only one bot instance is running.');
};

// Initiate polling
startPollingWithRetry();

// Chat configurations and message storage
const chatConfigs = {};
const messagesByChat = {};

// user_issue.forEach((issue) => {
//   chatConfigs[issue.id] = {
//     chatId: defaultChatId, // Verify this
//     issueTitle: issue.issue,
//   };
//   messagesByChat[issue.id] = [];
// });

// Verify bot token
bot.getMe().then((botInfo) => {
  console.log('Bot info:', botInfo);
}).catch((error) => {
  console.error('Error fetching bot info:', error);
});

// Log polling errors
bot.on('polling_error', (error) => console.error('Polling error:', error));

// Handle incoming messages
bot.on('message', (msg) => {
  console.log('Received message:', {
    chatId: msg.chat.id,
    chatType: msg.chat.type,
    text: msg.text,
    fromUserId: msg.from.id,
    chatTitle: msg.chat.title || 'N/A',
  });
  Object.keys(chatConfigs).forEach((issueId) => {
    const config = chatConfigs[issueId];
    const prefix = `[${config.issueTitle}]`;
    if (msg.chat.id == config.chatId && msg.text && msg.text.startsWith(prefix)) {
      const cleanText = msg.text.replace(`${prefix} `, '');
      messagesByChat[issueId].push({
        userId: msg.from.id.toString(),
        text: cleanText,
      });
      if (messagesByChat[issueId].length > 50) messagesByChat[issueId].shift();
    }
  });
});

// Send message API (for users and admins)
app.post('/api/send/:issueId', async (req, res) => {
  const { issueId } = req.params;
  const { text, isAdmin } = req.body;

  if (!chatConfigs[issueId]) {
    console.error(`Chat not found for issueId: ${issueId}`);
    return res.status(404).send('Chat not found');
  }
  if (!text) {
    console.error('Missing text in request body');
    return res.status(400).send('Missing text');
  }

  const { chatId, issueTitle } = chatConfigs[issueId];
  const prefixedText = `[${issueTitle}] ${text}`;
  const userId = isAdmin ? 'Admin' : 'User-aks';

  try {
    console.log(`Sending message to chatId: ${chatId}, issueId: ${issueId}, text: ${prefixedText}, userId: ${userId}`);
    await bot.sendMessage(chatId, prefixedText);
    console.log(`Message sent successfully for issue ${issueId}`);
    messagesByChat[issueId].push({ userId, text });
    if (messagesByChat[issueId].length > 50) messagesByChat[issueId].shift();
    res.status(200).send('Message sent');
  } catch (error) {
    console.error(`Error sending message to issue ${issueId}:`, error);
    res.status(500).send(`Error sending message: ${error.message}`);
  }
});

// Get messages for a specific issue (for users and admins)
app.get('/api/messages/:issueId', (req, res) => {
  const { issueId } = req.params;
  if (!chatConfigs[issueId]) {
    console.error(`Chat not found for issueId: ${issueId}`);
    return res.status(404).send('Chat not found');
  }
  res.json(messagesByChat[issueId]);
});

// Get all messages across all issues (for admins)
app.get('/api/all-messages', (req, res) => {
  const allMessages = Object.keys(chatConfigs).map((issueId) => ({
    issueId,
    issueTitle: chatConfigs[issueId].issueTitle,
    messages: messagesByChat[issueId],
  }));
  res.json(allMessages);
});

// Get all issues with status (for admin table)
// app.get('/api/issues', (req, res) => {
//   const issues = user_issue.map((issue) => ({
//     id: issue.id,
//     issue: issue.issue,
//     status: issue.status || 'not resolved', // Default to 'not resolved' if missing
//   }));
//   res.json(issues);
// });

// Chat route (for users)
app.get('/chat/:issueId', async (req, res) => {
  const { issueId } = req.params;
  if (!chatConfigs[issueId]) {
    console.error(`Chat not found for issueId: ${issueId}`);
    return res.status(404).send('Chat not found');
  }
  res.redirect('/');
});

// Delete chat API (for users and admins)
app.delete('/api/delete/:issueId', (req, res) => {
  const { issueId } = req.params;
  if (!chatConfigs[issueId]) {
    console.error(`Chat not found for issueId: ${issueId}`);
    return res.status(404).send('Chat not found');
  }

  messagesByChat[issueId] = [];
  res.status(200).send('Chat cleared');
});


// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});



