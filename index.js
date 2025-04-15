
const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const cron = require('node-cron');
const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

// Shopify credentials
const SHOPIFY_TOKEN = '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';
const SHOPIFY_STORE = 'twpti8-fd.myshopify.com';

// Auto-sync every 5 mins
cron.schedule('*/5 * * * *', async () => {
  console.log('[TifaAI Sync] Background auto-sync triggered...');
  await fetchShopifyData();
});

// GET all products
app.get('/products', async (req, res) => {
  try {
    const data = await fetchShopifyData();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch Shopify data', details: error.message });
  }
});

// CREATE product
app.post('/products', async (req, res) => {
  try {
    const response = await fetch(`https://${SHOPIFY_STORE}/admin/api/2024-01/products.json`, {
      method: 'POST',
      headers: {
        'X-Shopify-Access-Token': SHOPIFY_TOKEN,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ product: req.body })
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create product', details: error.message });
  }
});

// UPDATE product
app.put('/products/:product_id', async (req, res) => {
  try {
    const productId = req.params.product_id;
    const response = await fetch(`https://${SHOPIFY_STORE}/admin/api/2024-01/products/${productId}.json`, {
      method: 'PUT',
      headers: {
        'X-Shopify-Access-Token': SHOPIFY_TOKEN,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ product: req.body })
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update product', details: error.message });
  }
});

// DELETE product
app.delete('/products/:product_id', async (req, res) => {
  try {
    const productId = req.params.product_id;
    const response = await fetch(`https://${SHOPIFY_STORE}/admin/api/2024-01/products/${productId}.json`, {
      method: 'DELETE',
      headers: {
        'X-Shopify-Access-Token': SHOPIFY_TOKEN
      }
    });
    res.status(response.status).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product', details: error.message });
  }
});

// Actual fetch logic
async function fetchShopifyData() {
  const url = `https://${SHOPIFY_STORE}/admin/api/2024-01/products.json`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'X-Shopify-Access-Token': SHOPIFY_TOKEN,
      'Content-Type': 'application/json'
    }
  });
  if (!response.ok) throw new Error(`Shopify responded with ${response.status}`);
  const data = await response.json();
  return data;
}

app.get('/', (req, res) => {
  res.send('TifaAI Shopify Automation Proxy is live!');
});

app.listen(PORT, () => {
  console.log(`TifaAI Proxy running on port ${PORT}`);
});
