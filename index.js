const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const cron = require('node-cron');
const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());

// Shopify credentials
const SHOPIFY_TOKEN = 's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'; // Your Admin API token
const SHOPIFY_STORE = 'twpti8-fd'; // Only the subdomain

// Main fetch function
const fetchShopifyProducts = async () => {
  try {
    const response = await fetch(`https://${SHOPIFY_STORE}.myshopify.com/admin/api/2024-01/products.json`, {
      method: 'GET',
      headers: {
        'X-Shopify-Access-Token': SHOPIFY_TOKEN,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Shopify responded with ${response.status}`);
    }

    const data = await response.json();
    console.log(`[TifaAI]: Synced ${data.products.length} products at ${new Date().toISOString()}`);
    return data;
  } catch (error) {
    console.error('[TifaAI ERROR]:', error.message);
    return { error: true, message: error.message };
  }
};

// Route - used by GPT action
app.get('/products', async (req, res) => {
  const data = await fetchShopifyProducts();
  if (data.error) {
    res.status(500).json({ error: 'Failed to fetch Shopify data', details: data.message });
  } else {
    res.json(data);
  }
});

// Background task (every 5 minutes)
cron.schedule('*/5 * * * *', async () => {
  console.log('[TifaAI Background Task] Fetching Shopify data...');
  await fetchShopifyProducts();
});

// Default endpoint
app.get('/', (req, res) => {
  res.send('TifaAI Shopify Proxy is running.');
});

// Start server
app.listen(PORT, () => {
  console.log(`TifaAI Proxy running on port ${PORT}`);
});
