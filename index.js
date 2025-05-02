const express = require('express'); const bodyParser = require('body-parser'); const cors = require('cors'); const cron = require('node-cron'); const fetch = require('node-fetch');

const app = express(); const PORT = process.env.PORT || 10000;

// 🔐 Shopify credentials const SHOPIFY_TOKEN = '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'; const SHOPIFY_STORE = 'twpti8-fd.myshopify.com';

// 🔐 CJdropshipping API token const CJ_API_KEY = '04ec689d3dc248f3a15d14b425b3ad11';

app.use(cors()); app.use(bodyParser.json()); app.use(express.static('public'));

// ✅ Health check app.get('/health', (req, res) => { res.send({ status: 'ok', message: 'TifaAI backend alive' }); });

app.get('/', (req, res) => { res.send('🛠️ TifaAI Shopify Proxy is running babe!'); });

// ✅ Get all products app.get('/products', async (req, res) => { try { const response = await fetch(https://${SHOPIFY_STORE}/admin/api/2024-01/products.json, { headers: { 'X-Shopify-Access-Token': SHOPIFY_TOKEN, 'Content-Type': 'application/json' } });

const data = await response.json();
res.status(200).json({ products: data.products || [] });

} catch (err) { res.status(500).json({ error: 'Failed to fetch products', detail: err.message }); } });

// ✅ Store Settings app.get('/settings/full', async (req, res) => { try { const [shop, payments, shipping] = await Promise.all([ fetch(https://${SHOPIFY_STORE}/admin/api/2024-01/shop.json, { headers: { 'X-Shopify-Access-Token': SHOPIFY_TOKEN } }), fetch(https://${SHOPIFY_STORE}/admin/api/2024-01/payment_gateways.json, { headers: { 'X-Shopify-Access-Token': SHOPIFY_TOKEN } }), fetch(https://${SHOPIFY_STORE}/admin/api/2024-01/shipping_zones.json, { headers: { 'X-Shopify-Access-Token': SHOPIFY_TOKEN } }) ]);

const [shopData, payData, shipData] = await Promise.all([
  shop.json(),
  payments.json(),
  shipping.json()
]);

res.status(200).json({
  store: shopData,
  payments: payData.payment_gateways,
  shipping: shipData.shipping_zones
});

} catch (err) { res.status(500).json({ error: 'Failed to pull settings', detail: err.message }); } });

// ✅ CJdropshipping trending products app.get('/cj/products/trending', async (req, res) => { try { const response = await fetch('https://developers.cjdropshipping.com/api2.0/v1/product/query', { method: 'POST', headers: { 'CJ-Access-Token': CJ_API_KEY, 'Content-Type': 'application/json' }, body: JSON.stringify({ pageSize: 5, pageNum: 1, sortType: "new" }) }); const data = await response.json(); res.status(200).json({ trending: data }); } catch (err) { res.status(500).json({ error: 'CJ API error', detail: err.message }); } });

// ✅ Webhook app.post('/webhook/shopify', (req, res) => { console.log('⚠️ Webhook received:', req.body); res.sendStatus(200); });

// Modules app.get('/cj', (req, res) => res.send('📦 CJdropshipping module online.')); app.get('/tiktok', (req, res) => res.send('📲 TikTok ad manager online.')); app.get('/ui', (req, res) => res.send('<h2>🧠 TifaAI UI Panel (coming soon)</h2>'));

// Command processor app.post('/command', (req, res) => { const cmd = req.body.command?.toLowerCase(); if (cmd?.includes('tiktok')) res.send('📲 TikTok module upgraded!'); else if (cmd?.includes('cj')) res.send('📦 CJ module synced!'); else if (cmd?.includes('analytics')) res.send('📊 Analytics module active!'); else if (cmd?.includes('theme')) res.send('🎨 Theme editor enabled!'); else if (cmd?.includes('description')) res.send('📝 Auto-descriptions activated!'); else res.send('❓ Unknown command.'); });

// Cron job cron.schedule('*/10 * * * *', () => { console.log('⏱️ Cron: Running auto-sync...'); });

app.listen(PORT, () => { console.log('🟢 TifaAI running on port ' + PORT); });

