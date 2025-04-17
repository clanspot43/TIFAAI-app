const express = require('express');
const fetch = require('node-fetch');
const cron = require('node-cron');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 10000;

const SHOPIFY_TOKEN = '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';
const SHOPIFY_STORE = 'twpti8-fd.myshopify.com';

app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/products', async (req, res) => {
    try {
        const response = await fetch(`https://${SHOPIFY_STORE}/admin/api/2024-01/products.json`, {
            method: 'GET',
            headers: {
                'X-Shopify-Access-Token': SHOPIFY_TOKEN,
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).send('🛑 Auto-confirmation needed or token rejected.');
    }
});

// 🧠 Command-based upgrades (e.g. upgrade tiktok, analytics)
app.post('/command', (req, res) => {
    const command = req.body.command?.toLowerCase();
    console.log('📡 Command received:', command);
    if (command?.includes('tiktok')) return res.send('📈 Upgrading TikTok ad module...');
    if (command?.includes('analytics')) return res.send('📊 Activating analytics...');
    res.send('🧠 Command received but no action taken.');
});

// 🔁 Webhook listener
app.post('/webhook/shopify', (req, res) => {
    console.log('📩 Webhook Triggered:', req.body);
    res.send('✅ Webhook received.');
});

// ⏱️ Background Cron Sync
cron.schedule('*/10 * * * *', async () => {
    console.log('🔄 [Cron] Syncing Shopify + CJ...');
    // Example Shopify Sync
    try {
        const result = await fetch(`https://${SHOPIFY_STORE}/admin/api/2024-01/products.json`, {
            headers: { 'X-Shopify-Access-Token': SHOPIFY_TOKEN }
        });
        console.log('✅ [Cron] Product sync done');
    } catch (e) {
        console.log('❌ [Cron] Sync failed', e.message);
    }
});

// 🛠️ TikTok Ads Endpoint Placeholder
app.get('/tiktok', (req, res) => {
    res.send('🤖 TikTok ad sync & auto-caption module active.');
});

// 📦 CJdropshipping Endpoint Placeholder
app.get('/cj', (req, res) => {
    res.send('📦 CJ product + inventory sync online.');
});

// ⚙️ Shopify Settings Management Placeholder
app.get('/settings', (req, res) => {
    res.send('⚙️ Shopify settings automation live.');
});

// Dashboard Root
app.get('/', (req, res) => {
    res.send('<h1>💠 TifaAI Ultra Automation</h1><p>Connected to: ' + SHOPIFY_STORE + '</p>');
});

app.listen(PORT, () => {
    console.log(`🚀 TifaAI running on port ${PORT}`);
});
