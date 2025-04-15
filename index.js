
const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const cron = require('node-cron');
const app = express();
const PORT = process.env.PORT || 10000;

const SHOPIFY_TOKEN = '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';
const SHOPIFY_STORE = 'twpti8-fd'; 
app.use(cors());
app.use(express.json());

// Get all products
app.get('/products', async (req, res) => {
  try {
    const response = await fetch(`https://${SHOPIFY_STORE}.myshopify.com/admin/api/2024-01/products.json`, {
      method: 'GET',
      headers: {
        'X-Shopify-Access-Token': SHOPIFY_TOKEN,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) throw new Error(`Shopify responded with ${response.status}`);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Fetch Failed', details: err.message });
  }
});

// Update product title
app.post('/update-product-title', async (req, res) => {
  const { productId, newTitle } = req.body;

  try {
    const response = await fetch(`https://${SHOPIFY_STORE}.myshopify.com/admin/api/2024-01/products/${productId}.json`, {
      method: 'PUT',
      headers: {
        'X-Shopify-Access-Token': SHOPIFY_TOKEN,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        product: { id: productId, title: newTitle }
      })
    });

    const result = await response.json();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Update Failed', details: err.message });
  }
});

// Background sync task (runs every 5 minutes)
cron.schedule('*/5 * * * *', async () => {
  console.log('[TifaAI Background] Syncing product data...');
  try {
    const response = await fetch(`https://${SHOPIFY_STORE}.myshopify.com/admin/api/2024-01/products.json`, {
      method: 'GET',
      headers: {
        'X-Shopify-Access-Token': SHOPIFY_TOKEN,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) throw new Error(`[Background] Shopify responded with ${response.status}`);
    const data = await response.json();
    console.log(`[TifaAI Background] Synced ${data.products.length} products.`);
  } catch (err) {
    console.error('[TifaAI Background] Error:', err.message);
  }
});

app.get('/', (req, res) => res.send('TifaAI Proxy is live with background sync!'));
app.listen(PORT, () => console.log(`TifaAI Proxy running on port ${PORT}`));
