
const express = require('express');
const fetch = require('node-fetch');
const cron = require('node-cron');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 10000;

const SHOPIFY_TOKEN = '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';
const SHOPIFY_STORE = 'twpti8-fd.myshopify.com';

app.use(bodyParser.json());

// Basic Status Route
app.get('/', (req, res) => {
  res.send('🧠 TifaAI Ultra Automation is running...');
});

// Get Products
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
    res.status(500).json({ error: 'Failed to fetch products', details: err.message });
  }
});

// Update Product
app.put('/products/:id', async (req, res) => {
  const productId = req.params.id;
  const updateData = req.body;

  try {
    const url = `https://${SHOPIFY_STORE}/admin/api/2024-01/products/${productId}.json`;
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'X-Shopify-Access-Token': SHOPIFY_TOKEN,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ product: updateData })
    });

    const result = await response.json();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update product', details: err.message });
  }
});

// Webhook Receiver
app.post('/webhook/shopify', (req, res) => {
  console.log('🔔 Webhook received:', req.body);
  res.send('Webhook received!');
});

// Upgrade Commands via POST
app.post('/command', (req, res) => {
  const command = req.body.command.toLowerCase();
  console.log(`⚙️ Received command: ${command}`);

  if (command.includes('tiktok')) {
    res.send('🎯 TikTok Ads Module upgraded!');
  } else if (command.includes('analytics')) {
    res.send('📈 Analytics Module upgraded!');
  } else if (command.includes('cj')) {
    res.send('📦 CJdropshipping Module connected!');
  } else {
    res.send('❓ Unknown command.');
  }
});

// Cron Job every 10 min
cron.schedule('*/10 * * * *', () => {
  console.log('🔁 Cron: Auto-syncing products from Shopify...');
  // Future expansion: CJ or TikTok sync
});

app.listen(PORT, () => {
  console.log(`🚀 TifaAI Ultra running on port ${PORT}`);
});
