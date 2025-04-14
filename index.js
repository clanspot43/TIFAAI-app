const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 10000;

// Shopify API credentials
const SHOPIFY_TOKEN = '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';
const SHOPIFY_STORE = 'zu-lora.myshopify.com';

app.use(cors());

// Main endpoint to fetch products
app.get('/products', async (req, res) => {
  try {
    const shopifyRes = await fetch(`https://${SHOPIFY_STORE}/admin/api/2023-10/products.json`, {
      method: 'GET',
      headers: {
        'X-Shopify-Access-Token': SHOPIFY_TOKEN,
        'Content-Type': 'application/json'
      }
    });

    if (!shopifyRes.ok) {
      throw new Error(`Shopify responded with ${shopifyRes.status}`);
    }

    const data = await shopifyRes.json();
    res.json({ products: data.products });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch Shopify data',
      details: error.message
    });
  }
});

// Basic ping endpoint
app.get('/', (req, res) => {
  res.send('TifaAI Shopify Proxy is running.');
});

app.listen(PORT, () => {
  console.log(`✅ Proxy running at http://localhost:${PORT}`);
});

