const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());

// Shopify token and store
const SHOPIFY_TOKEN = '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'; // ← yours
const SHOPIFY_STORE = const SHOPIFY_STORE = 'twpti8-fd';
; // ← only subdomain, no ".myshopify.com"

// GET /products route
app.get('/products', async (req, res) => {
  try {
    const response = await fetch(`https://${SHOPIFY_STORE}.myshopify.com/admin/api/2024-01/products.json`, {
      method: 'GET',
      headers: {
        'X-Shopify-Access-Token': SHOPIFY_TOKEN,
        'Content-Type': 'application/json',
      },
    });

    // ✅ Throw only if response is not OK
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

// Root endpoint
app.get('/', (req, res) => {
  res.send('TifaAI Shopify Proxy is running.');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Proxy server running at http://localhost:${PORT}`);
});
