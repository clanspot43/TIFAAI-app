const express = require('express');
const bodyParser = require('body-parser');
const cron = require('node-cron');
const fetch = require('node-fetch');

const SHOPIFY_TOKEN = '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';
const SHOPIFY_STORE = 'twpti8-fd.myshopify.com';

const PORT = process.env.PORT || 10000;
const app = express();

app.use(bodyParser.json());
app.use(express.static('public'));

// Shopify Core Automation
app.get('/shopify', (req, res) => {
  res.send(`🛒 Shopify automation active for store: ${SHOPIFY_STORE}`);
});

// TikTok Automation Endpoint (placeholder)
app.get('/tiktok', (req, res) => {
  res.send('🎵 TikTok automation module running.');
});

// CJdropshipping Sync Endpoint (placeholder)
app.get('/cj', (req, res) => {
  res.send('📦 CJ sync logic online.');
});

// Webhook handler
app.post('/webhook/shopify', (req, res) => {
  console.log('📡 Webhook received from Shopify:', req.body);
  res.send('Webhook OK');
});

// Upgrade module via command
app.post('/command', (req, res) => {
  const command = req.body.command?.toLowerCase();
  console.log('🧠 Tifa received command:', command);

  if (command.includes('tiktok')) {
    res.send('🎯 Upgrading TikTok module...');
  } else if (command.includes('analytics')) {
    res.send('📊 Activating analytics module...');
  } else {
    res.send('⚠️ Unknown command. Try again.');
  }
});

// Cron job (every 10 min)
cron.schedule('*/10 * * * *', () => {
  console.log('🔁 Cron: Auto-syncing Shopify and CJ...');
});

// Dashboard route
app.get('/', (req, res) => {
  res.send(`
    <h1>🧠 TifaAI Dashboard</h1>
    <p>📍Connected to: ${SHOPIFY_STORE}</p>
    <form method="POST" action="/command">
      <input name="command" placeholder="Give Tifa a command" />
      <button type="submit">Send</button>
    </form>
  `);
});

app.listen(PORT, () => {
  console.log(`✅ TifaAI Shopify App running on port ${PORT} for ${SHOPIFY_STORE}`);
});
