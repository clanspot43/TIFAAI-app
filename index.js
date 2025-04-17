
const express = require('express');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');
const cron = require('node-cron');

const SHOPIFY_TOKEN = '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';
const SHOPIFY_STORE = 'twpti8-fd.myshopify.com';

const app = express();
const PORT = process.env.PORT || 10000;

app.use(bodyParser.json());
app.use(express.static('public'));

// Shopify API base
const shopifyApi = `https://${SHOPIFY_STORE}/admin/api/2024-01`;

// Shopify Product Sync (GET)
app.get('/products', async (req, res) => {
  try {
    const response = await fetch(`${shopifyApi}/products.json`, {
      method: 'GET',
      headers: {
        'X-Shopify-Access-Token': SHOPIFY_TOKEN,
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products', details: err.message });
  }
});

// Shopify Product Update (PUT)
app.put('/products/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const updateBody = { product: req.body };
    const response = await fetch(`${shopifyApi}/products/${productId}.json`, {
      method: 'PUT',
      headers: {
        'X-Shopify-Access-Token': SHOPIFY_TOKEN,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateBody)
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update product', details: err.message });
  }
});

// Shopify Command Upgrade (Auto-Upgrade AI Logic)
app.post('/command', (req, res) => {
  const command = req.body.command?.toLowerCase();
  if (command?.includes('tiktok')) {
    res.send('🧠 Upgrading TikTok AI Ads module...');
  } else if (command?.includes('analytics')) {
    res.send('📊 Activating analytics system...');
  } else if (command?.includes('cj')) {
    res.send('🔗 Connecting to CJdropshipping live feed...');
  } else {
    res.send('⚙️ Unknown command. Try again.');
  }
});

// Shopify Webhook Trigger
app.post('/webhook/shopify', (req, res) => {
  console.log('🔔 Webhook Triggered:', req.body);
  res.send('Webhook received OK.');
});

// Cron Job (auto-sync Shopify + CJ every 10 minutes)
cron.schedule('*/10 * * * *', async () => {
  console.log('🔄 Cron: Auto-syncing Shopify & CJ...');
  // Future: Auto-sync logic goes here
});

// Dashboard Route
app.get('/', (req, res) => {
  res.send(`<h1>🧠 TifaAI Unified Automation</h1><p>Store: ${SHOPIFY_STORE}</p>`);
});

app.listen(PORT, () => {
  console.log(`🚀 TifaAI running on port ${PORT}`);
});
