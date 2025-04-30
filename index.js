// src/index.js

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cron = require('node-cron');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 10000;
const SHOPIFY_TOKEN = process.env.SHOPIFY_TOKEN;
const SHOPIFY_STORE = process.env.SHOPIFY_STORE;

// Env validation
if (!SHOPIFY_TOKEN || !SHOPIFY_STORE) {
  console.error('❌ Missing SHOPIFY_TOKEN or SHOPIFY_STORE in .env file');
  process.exit(1);
}

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Health
app.get('/health', (_, res) => {
  res.send({ status: 'ok', message: 'TifaAI backend alive' });
});

// Root
app.get('/', (_, res) => {
  res.send('🛠️ TifaAI Shopify Proxy is running babe!');
});

// GET products endpoint
app.get('/products', async (req, res) => {
  console.log('➡️ /products called by:', req.headers['user-agent'] || 'unknown');

  const url = `https://${SHOPIFY_STORE}/admin/api/2024-01/products.json`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-Shopify-Access-Token': SHOPIFY_TOKEN,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`❌ Shopify API Error: ${response.status}`);
      return res.status(response.status).json({
        error: `Shopify returned ${response.status}`,
        detail: await response.text(),
      });
    }

    const data = await response.json();
    res.status(200).json({
      status: 'success',
      source: req.headers['user-agent'] || 'unknown',
      products: data.products || [],
    });
  } catch (err) {
    console.error('❌ Internal Error:', err.message);
    res.status(500).json({
      error: 'Internal Server Error',
      detail: err.message,
    });
  }
});

// Webhook receiver
app.post('/webhook/shopify', (req, res) => {
  console.log('⚠️ Webhook received:', req.body);
  res.sendStatus(200);
});

// Mock endpoints
app.get('/cj', (_, res) => res.send('📦 CJdropshipping module online.'));
app.get('/tiktok', (_, res) => res.send('📲 TikTok ad manager online.'));
app.get('/ui', (_, res) => res.send('<h2>🧠 TifaAI UI Panel (coming soon)</h2>'));

// GPT command handler
app.post('/command', (req, res) => {
  const cmd = req.body.command?.toLowerCase() || '';
  if (cmd.includes('tiktok')) res.send('📲 TikTok module upgraded!');
  else if (cmd.includes('cj')) res.send('📦 CJ module synced!');
  else if (cmd.includes('analytics')) res.send('📊 Analytics module active!');
  else if (cmd.includes('theme')) res.send('🎨 Theme editor enabled!');
  else res.send('❓ Unknown command.');
});

// Cron task every 10 mins
cron.schedule('*/10 * * * *', () => {
  console.log('⏱️ Cron: Running auto-sync...');
});

app.listen(PORT, () => {
  console.log(`🟢 TifaAI running on port ${PORT}`);
});
