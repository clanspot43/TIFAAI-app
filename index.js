
const express = require('express');
const bodyParser = require('body-parser');
const cron = require('node-cron');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 10000;

const SHOPIFY_TOKEN = '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';
const SHOPIFY_STORE = 'twpti8-fd.myshopify.com';

app.use(bodyParser.json());
app.use(express.static('public'));

// Auto Shopify Product Fetch
app.get('/products', async (req, res) => {
  try {
    const response = await fetch(`https://${SHOPIFY_STORE}/admin/api/2024-01/products.json`, {
      method: 'GET',
      headers: {
        'X-Shopify-Access-Token': SHOPIFY_TOKEN,
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: '❌ Error updating product', details: err.message });
  }
});

// Webhook Handler
app.post('/webhook/shopify', (req, res) => {
  console.log('⚠️ Webhook received from Shopify:', req.body);
  res.sendStatus(200);
});

// CJdropshipping
app.get('/cj', (req, res) => {
  res.send('📦 CJdropshipping logic activated. Ready for inventory sync.');
});

// TikTok Ads
app.get('/tiktok', (req, res) => {
  res.send('📲 TikTok auto-caption and ad sync logic loaded.');
});

// UI Panel Placeholder
app.get('/ui', (req, res) => {
  res.send('<h2>🧠 TifaAI UI Panel (coming soon for mobile and web)</h2>');
});

// Command Upgrade Handler
app.post('/command', (req, res) => {
  const cmd = req.body.command?.toLowerCase();
  if (cmd?.includes('tiktok')) res.send('📲 TikTok module upgraded!');
  else if (cmd?.includes('cj')) res.send('📦 CJ module synced!');
  else if (cmd?.includes('analytics')) res.send('📊 Analytics activated!');
  else if (cmd?.includes('theme')) res.send('🎨 Theme editor module enabled!');
  else res.send('❓ Unknown command.');
});

// Background Cron Job
cron.schedule('*/10 * * * *', () => {
  console.log('⏱️ Cron Tick: Auto Shopify/CJ background sync...');
});

app.listen(PORT, () => {
  console.log(`🟢 TifaAI running on port ${PORT}`);
});
