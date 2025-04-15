const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const cron = require('node-cron');
require('dotenv').config();

const app = express();
app.use(cors());
const PORT = process.env.PORT || 10000;

const SHOPIFY_TOKEN = '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';
const SHOPIFY_STORE = 'twpt18-fd';

// Background CRON Job - every hour
cron.schedule('0 * * * *', async () => {
  console.log('🔄 Running hourly sync with Shopify...');
  const response = await fetch(`https://${SHOPIFY_STORE}.myshopify.com/admin/api/2024-01/products.json`, {
    method: 'GET',
    headers: {
      'X-Shopify-Access-Token': SHOPIFY_TOKEN,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    console.error('❌ Background Sync Error:', response.status);
    return;
  }

  const data = await response.json();
  console.log(`✅ Synced ${data.products.length} products from Shopify`);
});

// Manual route check (still usable)
app.get('/products', async (req, res) => {
  try {
    const response = await fetch(`https://${SHOPIFY_STORE}.myshopify.com/admin/api/2024-01/products.json`, {
      method: 'GET',
      headers: {
        'X-Shopify-Access-Token': SHOPIFY_TOKEN,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) throw new Error(`Shopify responded with ${response.status}`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch Shopify data', details: error.message });
  }
});

app.get('/', (req, res) => {
  res.send('✅ TifaAI Shopify Proxy is running with background sync.');
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
