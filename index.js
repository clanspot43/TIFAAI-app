const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT;


// Your Shopify details (make sure no typo here!)
const SHOPIFY_TOKEN = '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';
const SHOPIFY_STORE = 'zu-lora.myshopify.com';

app.use(cors());

app.get('/products', async (req, res) => {
  try {
    const shopifyRes = await fetch(`https://${SHOPIFY_STORE}/admin/api/2023-10/products.json`, {
      method: 'GET',
      headers: {
        'X-Shopify-Access-Token': SHOPIFY_TOKEN,
        'Content-Type': 'application/json'
      }
    });
    const data = await shopifyRes.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch Shopify data', details: error.message });
  }
});

app.get('/', (req, res) => {
  res.send('TifaAI Shopify Proxy is running.');
});

app.listen(PORT, () => {
  console.log(`Proxy server running at http://localhost:${PORT}`);
});
