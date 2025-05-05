// index.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cron = require('node-cron');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 10000;

// 🔐 API Credentials
const SHOPIFY_TOKEN = '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';
const SHOPIFY_STORE = 'twpti8-fd.myshopify.com';
const CJ_API_KEY = '04ec689d3dc248f3a15d14b425b3ad11';

app.use(cors());
app.use(bodyParser.json());

// ✅ Health
app.get('/', (req, res) => res.send('🛠️ TifaAI Vitals Proxy Running'));
app.get('/health', (req, res) => res.send({ status: 'ok' }));

// ✅ Get all Shopify products
app.get('/products', async (req, res) => {
  try {
    const response = await fetch(`https://${SHOPIFY_STORE}/admin/api/2024-01/products.json`, {
      headers: {
        'X-Shopify-Access-Token': SHOPIFY_TOKEN,
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    res.json({ status: 'success', products: data.products });
  } catch (err) {
    res.status(500).json({ error: 'Fetch failed', detail: err.message });
  }
});

// ✅ Import winning product from CJdropshipping
app.post('/cj/import', async (req, res) => {
  try {
    const queryPayload = {
      pageSize: 5,
      pageNum: 1,
      keyword: req.body.keyword || 'fitness'
    };

    const response = await fetch('https://developers.cjdropshipping.com/product/list', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'CJ-Access-Token': CJ_API_KEY
      },
      body: JSON.stringify(queryPayload)
    });

    const data = await response.json();
    res.status(200).json({ status: 'imported', products: data.result });
  } catch (err) {
    res.status(500).json({ error: 'CJ import failed', detail: err.message });
  }
});

// ✅ Shopify Setting Sync (Vitals style)
app.get('/settings/full', async (req, res) => {
  try {
    const [shopRes, payRes, shipRes] = await Promise.all([
      fetch(`https://${SHOPIFY_STORE}/admin/api/2024-01/shop.json`, {
        headers: { 'X-Shopify-Access-Token': SHOPIFY_TOKEN }
      }),
      fetch(`https://${SHOPIFY_STORE}/admin/api/2024-01/payment_gateways.json`, {
        headers: { 'X-Shopify-Access-Token': SHOPIFY_TOKEN }
      }),
      fetch(`https://${SHOPIFY_STORE}/admin/api/2024-01/shipping_zones.json`, {
        headers: { 'X-Shopify-Access-Token': SHOPIFY_TOKEN }
      })
    ]);

    const [shopData, payData, shipData] = await Promise.all([
      shopRes.json(),
      payRes.json(),
      shipRes.json()
    ]);

    res.status(200).json({
      store: shopData,
      payments: payData.payment_gateways,
      shipping: shipData.shipping_zones
    });
  } catch (err) {
    res.status(500).json({ error: 'Settings fetch failed', detail: err.message });
  }
});

// Cron Job to Auto Sync
cron.schedule('*/10 * * * *', () => {
  console.log('⏱️ Auto Sync Task Running...');
});

// Start Server
app.listen(PORT, () => console.log(`🟢 TifaAI Vitals Proxy running on port ${PORT}`));
