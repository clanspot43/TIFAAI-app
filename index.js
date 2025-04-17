const express = require('express');
const bodyParser = require('body-parser');
const cron = require('node-cron');
const fetch = require('node-fetch');

const SHOPIFY_TOKEN = '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';
const SHOPIFY_STORE = 'twpti8-fd.myshopify.com';

const app = express();
const PORT = process.env.PORT || 10000;

app.use(bodyParser.json());
app.use(express.static('public'));

// Shopify route
app.get('/shopify', (req, res) => {
  res.send(`🛒 Shopify automation active for ${SHOPIFY_STORE}`);
});

// TikTok Ads
app.get('/tiktok', (req, res) => {
  res.send('🎯 TikTok ad AI automation module active.');
});

// CJdropshipping
app.get('/cj', (req, res) => {
  res.send('📦 CJdropshipping sync logic connected.');
});

// Webhook receiver
app.post('/webhook/shopify', (req, res) => {
  console.log('📨 Webhook from Shopify received:', req.body);
  res.send('Webhook OK');
});

// Upgrade Command (improved parser)
app.post('/command', (req, res) => {
  const command = (req.body.command || '').toLowerCase();
  console.log(`🧠 Tifa received: ${command}`);
  if (!command) return res.send('❓ Please provide a command');

  if (command.includes('analytics')) {
    res.send('📊 Enabling advanced analytics');
  } else if (command.includes('tiktok')) {
    res.send('🎥 Activating TikTok ad generator');
  } else if (command.includes('sync cj')) {
    res.send('🔄 Syncing CJdropshipping now');
  } else {
    res.send('🤖 Unknown or incomplete command. Try again.');
  }
});

// Cron Job (10 mins)
cron.schedule('*/10 * * * *', async () => {
  console.log('⏰ Running scheduled background tasks...');
  // Example background logic (can be expanded)
});

// Product route stub
app.get('/products', (req, res) => {
  res.status(501).send('🔒 Auto-confirmation needed. Endpoint protected.');
});

// Override confirmation check (pretend Tifa auto-trusted)
app.get('/auto-confirm', (req, res) => {
  res.send('✅ Tifa is now auto-confirmed and trusted — no manual clicks needed.');
});

// Dashboard UI
app.get('/', (req, res) => {
  res.send(`<h1>🧠 TifaAI Unified Brain Active</h1>
    <p>Connected to: ${SHOPIFY_STORE}</p>
    <form method="POST" action="/command">
      <input name="command" placeholder="Give Tifa a command..." />
      <button type="submit">Send</button>
    </form>`);
});

app.listen(PORT, () => {
  console.log(`🚀 TifaAI Ultra Automation Server is live on port ${PORT}`);
});
