const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cron = require('node-cron');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 10000;

const SHOPIFY_TOKEN = 'shpat_3cb48f5d896da1b0df899ff';
const SHOPIFY_STORE = 'twpti8-fd.myshopify.com';

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Home route
app.get('/', (req, res) => {
  res.send('🛠️ TifaAI Shopify Proxy is running babe!');
});

// Fetch Shopify Products
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
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Webhook, CJ, TikTok, UI routes...
app.post('/webhook/shopify', (req, res) => {
  console.log('⚠️ Webhook received:', req.body);
  res.sendStatus(200);
});

app.get('/cj', (req, res) => {
  res.send('📦 CJdropshipping ready.');
});

app.get('/tiktok', (req, res) => {
  res.send('📲 TikTok auto-caption module loaded.');
});

app.get('/ui', (req, res) => {
  res.send('<h2>🧠 TifaAI UI Panel (coming soon)</h2>');
});

// Command Upgrade Handler
app.post('/command', (req, res) => {
  const cmd = req.body.command?.toLowerCase();
  if (cmd?.includes('tiktok')) res.send('📲 TikTok module upgraded!');
  else if (cmd?.includes('cj')) res.send('📦 CJ module synced!');
  else if (cmd?.includes('analytics')) res.send('📊 Analytics module ready!');
  else res.send('❓ Unknown command.');
});

// Background cron task
cron.schedule('*/10 * * * *', () => {
  console.log('⏱️ Background sync running...');
});

// Listen
app.listen(PORT, function () {
  console.log('🟢 TifaAI running on port ' + PORT);
});
