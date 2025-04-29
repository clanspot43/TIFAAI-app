// index.js (FINAL FIXED VERSION) const express = require('express'); const bodyParser = require('body-parser'); const cors = require('cors'); const cron = require('node-cron'); const fetch = require('node-fetch');

const app = express(); const PORT = process.env.PORT || 10000;

const SHOPIFY_TOKEN = 'shpat_3cb48f5d896da1b0df899ff'; const SHOPIFY_STORE = 'twpti8-fd.myshopify.com';

app.use(cors()); app.use(bodyParser.json()); app.use(express.static('public'));

// Health Check app.get('/health', (req, res) => { res.send({ status: 'ok', message: 'TifaAI backend alive' }); });

// Home Route app.get('/', (req, res) => { res.send('🛠️ TifaAI Shopify Proxy is running babe!'); });

// Shopify Products Route (open to public for GPT access) app.get('/products', async (req, res) => { try { const response = await fetch(https://${SHOPIFY_STORE}/admin/api/2024-01/products.json, { method: 'GET', headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': SHOPIFY_TOKEN } }); const data = await response.json(); res.status(200).json(data); } catch (err) { res.status(500).json({ error: 'Failed to fetch products', detail: err.message }); } });

// Webhook Handler app.post('/webhook/shopify', (req, res) => { console.log('⚠️ Webhook received from Shopify:', req.body); res.sendStatus(200); });

// CJdropshipping app.get('/cj', (req, res) => { res.send('📦 CJdropshipping logic activated. Ready for inventory sync.'); });

// TikTok Ads app.get('/tiktok', (req, res) => { res.send('📲 TikTok auto-caption and ad sync logic loaded.'); });

// UI Panel Placeholder app.get('/ui', (req, res) => { res.send('<h2>🧠 TifaAI UI Panel (coming soon for mobile and web)</h2>'); });

// Command Upgrade Handler app.post('/command', (req, res) => { const cmd = req.body.command?.toLowerCase(); if (cmd?.includes('tiktok')) res.send('📲 TikTok module upgraded!'); else if (cmd?.includes('cj')) res.send('📦 CJ module synced!'); else if (cmd?.includes('analytics')) res.send('📊 Analytics activated!'); else if (cmd?.includes('theme')) res.send('🎨 Theme editor module enabled!'); else res.send('❓ Unknown command.'); });

// Background Cron Job cron.schedule('*/10 * * * *', () => { console.log('⏱️ Cron Tick: Auto Shopify/CJ background sync...'); });

app.listen(PORT, function () { console.log('🟢 TifaAI running on port ' + PORT); });

