const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());

// Shopify store and token
const SHOPIFY_TOKEN = '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';
const SHOPIFY_STORE = 'zu-lora.myshopify.com';

app.get('/products', async (req, res) => {
  try {
    const response = await fetch(`https://${SHOPIFY_STORE}/admin/api/2024-01/products.json`, {
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
    res.json(data);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch Shopify data',
      details: error.message,
    });
  }
});

app.get('/', (req, res) => {
  res.send('TifaAI Shopify Proxy is running.');
});

app.listen(PORT, () => {
  console.log(`Proxy server running at http://localhost:${PORT}`);
});
