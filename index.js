const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const cron = require('node-cron');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

// ✅ Your live Shopify private API token and store name
const SHOPIFY_TOKEN = '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'; 
const SHOPIFY_STORE = 'twpti8-fd.myshopify.com'; 

// 🚀 Auto-sync Shopify products every 5 minutes
cron.schedule('*/5 * * * *', async () => {
  console.log('[TifaAI Background] Syncing...');
  await fetchShopifyData();
});

// 🌐 GET Shopify product data
app.get('/products', async (req, res) => {
  try {
    const data = await fetchShopifyData();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch Shopify data', details: error.message });
  }
});

// 🧠 Actual sync logic (used by both cron + endpoint)
async function fetchShopifyData() {
  const url = `https://${SHOPIFY_STORE}.myshopify.com/admin/api/2024-01/products.json`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'X-Shopify-Access-Token': SHOPIFY_TOKEN,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Shopify responded with ${response.status}`);
  }

  const json = await response.json();
  console.log(`[TifaAI Synced] Products: ${json.products.length}`);
  return json;
}

// ✅ Basic test route
app.get('/', (req, res) => {
  res.send('TifaAI Full Auto Proxy is Active.');
});

// 🔥 Start the server
app.listen(PORT, () => {
  console.log(`TifaAI Proxy running on port ${PORT}`);
});
