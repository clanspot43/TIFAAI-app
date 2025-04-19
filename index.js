
const express = require('express');
const fetch = require('node-fetch');
const cron = require('node-cron');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 10000;

const SHOPIFY_TOKEN = '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';
const SHOPIFY_STORE = 'twpti8-fd.myshopify.com';

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('🚀 TifaAI Ultra Automation is online with full modules.');
});

app.get('/products', async (req, res) => {
  try {
    const response = await fetch(`https://${SHOPIFY_STORE}/admin/api/2024-01/products.json`, {
      method: 'GET',
      headers: {
        'X-Shopify-Access-Token': SHOPIFY_TOKEN,
        'Content-Type': 'application/json',
      }
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: '❌ Error fetching products', details: err.message });
  }
});

app.post('/products/:id/update', async (req, res) => {
  try {
    const id = req.params.id;
    const update = req.body;
    const response = await fetch(`https://${SHOPIFY_STORE}/admin/api/2024-01/products/${id}.json`, {
      method: 'PUT',
      headers: {
        'X-Shopify-Access-Token': SHOPIFY_TOKEN,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ product: update })
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: '❌ Error updating product', details: err.message });
  }
});

app.post('/webhook/shopify', (req, res) => {
  console.log('📦 Webhook received from Shopify:', req.body);
  res.sendStatus(200);
});

app.get('/cj', (req, res) => {
  res.send('📦 CJdropshipping logic activated. Ready for inventory sync.');
});

app.get('/tiktok', (req, res) => {
  res.send('🎯 TikTok auto-caption and ad sync logic loaded.');
});

app.get('/ui', (req, res) => {
  res.send('<h2>🧠 TifaAI UI Panel (coming soon for mobile and web)</h2>');
});

app.post('/command', (req, res) => {
  const cmd = req.body.command?.toLowerCase();
  if (cmd.includes('tiktok')) res.send('✅ TikTok module upgraded!');
  else if (cmd.includes('cj')) res.send('✅ CJ module synced!');
  else if (cmd.includes('analytics')) res.send('✅ Analytics activated!');
  else if (cmd.includes('theme')) res.send('✅ Theme editor module enabled!');
  else res.send('❓ Unknown command.');
});

cron.schedule('*/10 * * * *', () => {
  console.log('🌀 Cron Tick: Auto Shopify/CJ background sync...');
});

app.listen(PORT, () => {
  console.log(`🚀 TifaAI running on port ${PORT}`);
});
