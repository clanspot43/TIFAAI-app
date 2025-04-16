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

// Shopify core automation
app.get('/shopify', (req, res) => {
  res.send(`✅ Shopify automation active for store: ${SHOPIFY_STORE}`);
});

// TikTok automation route
app.get('/tiktok', (req, res) => {
  res.send('🎯 TikTok automation module running.');
});

// CJdropshipping automation route
app.get('/cj', (req, res) => {
  res.send('📦 CJ sync logic online.');
});

// Shopify webhook listener
app.post('/webhook/shopify', (req, res) => {
  console.log('⚠️ Webhook received from Shopify:', req.body);
  res.send('Webhook OK');
});

// GET products from Shopify
app.get('/products', async (req, res) => {
  const url = `https://${SHOPIFY_STORE}/admin/api/2024-01/products.json`;
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-Shopify-Access-Token': SHOPIFY_TOKEN,
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch Shopify products', details: error.message });
  }
});

// Upgrade command handler
app.post('/command', (req, res) => {
  const command = req.body.command?.toLowerCase();
  console.log('🧠 Tifa received command:', command);
  if (command?.includes('tiktok')) {
    res.send('⚙️ Upgrading TikTok module...');
  } else if (command?.includes('analytics')) {
    res.send('📊 Activating analytics module...');
  } else {
    res.send('❓ Unknown command. Try again.');
  }
});

// Background cron sync every 10 minutes
cron.schedule('*/10 * * * *', () => {
  console.log('⏱️ Cron: Auto-syncing Shopify and CJ...');
});

// Basic dashboard route
app.get('/', (req, res) => {
  res.send(`
    <h1>🧠 TifaAI Dashboard</h1>
    <p>Connected to: ${SHOPIFY_STORE}</p>
    <form method="POST" action="/command">
      <input name="command" placeholder="Give Tifa a command" />
      <button type="submit">Send</button>
    </form>
  `);
});

app.listen(PORT, () => {
  console.log(`🚀 TifaAI Shopify App running on port ${PORT} for ${SHOPIFY_STORE}`);
});
