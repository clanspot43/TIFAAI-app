const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cron = require('node-cron');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 10000;

// 🔐 Shopify credentials
const SHOPIFY_TOKEN = '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';
const SHOPIFY_STORE = 'twpti8-fd.myshopify.com';

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// ✅ Health check
app.get('/health', (req, res) => {
  res.send({ status: 'ok', message: 'TifaAI backend alive' });
});

app.get('/', (req, res) => {
  res.send('🛠️ TifaAI Shopify Proxy is running babe!');
});

// ✅ Get all products
app.get('/products', async (req, res) => {
  console.log('➡️ /products called by:', req.headers['user-agent'] || 'unknown');
  try {
    const response = await fetch(`https://${SHOPIFY_STORE}/admin/api/2024-01/products.json`, {
      headers: {
        'X-Shopify-Access-Token': SHOPIFY_TOKEN,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      console.error(`❌ Shopify API Error: ${response.status}`);
      return res.status(response.status).json({ error: `Shopify returned ${response.status}` });
    }

    const data = await response.json();
    res.status(200).json({
      status: 'success',
      called_by: req.headers['user-agent'] || 'unknown',
      products: data.products || []
    });
  } catch (err) {
    console.error('❌ Internal Fetch Error:', err.message);
    res.status(500).json({ error: 'Failed to fetch products', detail: err.message });
  }
});

// ✅ NEW: Get Store Info
app.get('/settings/store', async (req, res) => {
  try {
    const response = await fetch(`https://${SHOPIFY_STORE}/admin/api/2024-01/shop.json`, {
      headers: { 'X-Shopify-Access-Token': SHOPIFY_TOKEN }
    });
    const data = await response.json();
    res.status(200).json({ store_settings: data });
  } catch (err) {
    console.error('❌ Store settings error:', err.message);
    res.status(500).json({ error: 'Failed to fetch store settings' });
  }
});

// ✅ NEW: Get Payment Gateways
app.get('/settings/payments', async (req, res) => {
  try {
    const response = await fetch(`https://${SHOPIFY_STORE}/admin/api/2024-01/payment_gateways.json`, {
      headers: { 'X-Shopify-Access-Token': SHOPIFY_TOKEN }
    });
    const data = await response.json();
    res.status(200).json({ payment_gateways: data.payment_gateways });
  } catch (err) {
    console.error('❌ Payment gateways error:', err.message);
    res.status(500).json({ error: 'Failed to fetch payment gateways' });
  }
});

// ✅ NEW: Get Shipping Zones
app.get('/settings/shipping', async (req, res) => {
  try {
    const response = await fetch(`https://${SHOPIFY_STORE}/admin/api/2024-01/shipping_zones.json`, {
      headers: { 'X-Shopify-Access-Token': SHOPIFY_TOKEN }
    });
    const data = await response.json();
    res.status(200).json({ shipping_zones: data.shipping_zones });
  } catch (err) {
    console.error('❌ Shipping zones error:', err.message);
    res.status(500).json({ error: 'Failed to fetch shipping zones' });
  }
});

// ✅ NEW: Pull all settings (combined endpoint)
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
    console.error('❌ Full settings error:', err.message);
    res.status(500).json({ error: 'Failed to pull settings', detail: err.message });
  }
});

// ✅ Webhook receiver
app.post('/webhook/shopify', (req, res) => {
  console.log('⚠️ Webhook received:', req.body);
  res.sendStatus(200);
});

// Modules
app.get('/cj', (req, res) => {
  res.send('📦 CJdropshipping module online.');
});

app.get('/tiktok', (req, res) => {
  res.send('📲 TikTok ad manager online.');
});

app.get('/ui', (req, res) => {
  res.send('<h2>🧠 TifaAI UI Panel (coming soon)</h2>');
});

// Command processor
app.post('/command', (req, res) => {
  const cmd = req.body.command?.toLowerCase();
  if (cmd?.includes('tiktok')) res.send('📲 TikTok module upgraded!');
  else if (cmd?.includes('cj')) res.send('📦 CJ module synced!');
  else if (cmd?.includes('analytics')) res.send('📊 Analytics module active!');
  else if (cmd?.includes('theme')) res.send('🎨 Theme editor enabled!');
  else res.send('❓ Unknown command.');
});

// Auto-sync every 10 minutes
cron.schedule('*/10 * * * *', () => {
  console.log('⏱️ Cron: Running auto-sync...');
});

// Start server
app.listen(PORT, () => {
  console.log('🟢 TifaAI running on port ' + PORT);
});
