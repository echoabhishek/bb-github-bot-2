require('dotenv').config();
const express = require('express');
const webhookHandler = require('./github/webhook');
const { validateWebhook } = require('./utils/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// Parse JSON bodies
app.use(express.json());

// GitHub webhook endpoint
app.post('/webhook', validateWebhook, webhookHandler);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
