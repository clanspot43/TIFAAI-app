// TifaAI Vitals-like Core const express = require('express'); const bodyParser = require('body-parser'); const cors = require('cors'); const cron = require('node-cron'); const fetch = require('node-fetch');

const app = express(); const PORT = process.env.PORT || 10000;

// Shopify + CJ API Credentials const SHOPIFY_TOKEN = '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'; const SHOPIFY_STORE = 'twpti8-fd.myshopify.com'; const CJ_API_KEY = '04ec689d3dc248f3a15d14b425b3ad11';

app.use(cors()); app.use(bodyParser.json()); app.use(express.static('public'));

// Health app.get('/health', (_, res) => res.send({ status: 'ok', message: 'Vitals mode active' }));

// Homepage app.get('/', (_, res) => res.send('🧠 TifaAI Vitals engine running'));

// Shopify Products app.get('/products', async (_, res) => { try { const r = await fetch(https://${SHOPIFY_STORE}/admin/api/2024-01/products.json, { headers: { 'X-Shopify-Access-Token': SHOPIFY_TOKEN, 'Content-Type': 'application/json' } }); const json = await r.json(); res.send({ products: json.products }); } catch (e) { res.status(500).send({ error: 'Failed to fetch Shopify products', detail: e.message }); } });

// Import Winning CJ Products app.post('/cj/import', async (req, res) => { try { const r = await fetch('https://developers.cjdropshipping.com/product/list', { method: 'POST', headers: { 'Content-Type': 'application/json', 'CJ-Access-Token': CJ_API_KEY }, body: JSON.stringify({ pageNum: 1, pageSize: 5, keyword: req.body.keyword || 'fitness' }) }); const data = await r.json(); res.send({ status: 'imported', products: data.result }); } catch (err) { res.status(500).send({ error: 'CJ import failed', detail: err.message }); } });

// Cron Sync Example cron.schedule('*/10 * * * *', () => { console.log('⏱️ Auto-sync running...'); });

// Server Start app.listen(PORT, () => { console.log(🟢 TifaAI Vitals engine running on port ${PORT}); });

// ---- package.json (for deployment) ---- /* { "name": "tifaai-vitals", "version": "1.0.0", "description": "Vitals-style automation for Shopify + CJdropshipping", "main": "index.js", "scripts": { "start": "node index.js" }, "dependencies": { "body-parser": "^1.20.2", "cors": "^2.8.5", "express": "^4.18.2", "node-cron": "^3.0.2", "node-fetch": "^2.6.7" } } */

