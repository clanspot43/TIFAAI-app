const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cron = require('node-cron');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 10000;

const SHOPIFY_TOKEN = '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';
const SHOPIFY_STORE = 'twpti8-fd.myshopify.com';

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/health', (req, res) => {
  res.send({ status: 'ok', message: 'TifaAI backend alive' });
});

app.get('/', (req, res) => {
  res.send('馃洜锔� TifaAI Shopify Proxy is running babe!');
});

app.get('/products', async (req, res) => {
  console.log('鉃★笍 /products called by:', req.headers['user-agent'] || 'unknown');
  try {
    const response = await fetch(`https://${SHOPIFY_STORE}/admin/api/2024-01/products.json`, {
      headers: {
        'X-Shopify-Access-Token': SHOPIFY_TOKEN,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      console.error(`鉂� Shopify API Error: ${response.status}`);
      return res.status(response.status).json({ error: `Shopify returned ${response.status}` });
    }

    const data = await response.json();
    res.status(200).json({
      status: 'success',
      called_by: req.headers['user-agent'] || 'unknown',
      products: data.products || []
    });
  } catch (err) {
    console.error('鉂� Internal Fetch Error:', err.message);
    res.status(500).json({ error: 'Failed to fetch products', detail: err.message });
  }
});

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
    console.error('鉂� Full settings error:', err.message);
    res.status(500).json({ error: 'Failed to pull settings', detail: err.message });
  }
});

app.post('/webhook/shopify', (req, res) => {
  console.log('鈿狅笍 Webhook received:', req.body);
  res.sendStatus(200);
});

app.get('/cj', (req, res) => {
  res.send('馃摝 CJdropshipping module online.');
});

app.get('/tiktok', (req, res) => {
  res.send('馃摬 TikTok ad manager online.');
});

app.get('/ui', (req, res) => {
  res.send('<h2>馃 TifaAI UI Panel (coming soon)</h2>');
});

app.post('/command', (req, res) => {
  const cmd = req.body.command?.toLowerCase();
  console.log('馃 Command received:', cmd);

  if (cmd?.includes('tiktok')) res.send('馃摬 TikTok module upgraded!');
  else if (cmd?.includes('cj')) res.send('馃摝 CJ module synced!');
  else if (cmd?.includes('analytics')) res.send('馃搳 Analytics module active!');
  else if (cmd?.includes('theme')) res.send('馃帹 Theme editor enabled!');
  else if (cmd?.includes('description')) res.send('馃摑 Auto-descriptions activated!');
  else res.send('鉂� Unknown command.');
});

cron.schedule('*/10 * * * *', () => {
  console.log('鈴憋笍 Cron: Running auto-sync...');
});

app.listen(PORT, () => {
  console.log('馃煝 TifaAI running on port ' + PORT);
});
