
const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const cron = require('node-cron');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

// ✅ Shopify Admin API Access
const SHOPIFY_TOKEN = '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';
const SHOPIFY_STORE = 'twpti8-fd.myshopify.com';

// ⏱ Background auto-sync every 5 minutes
cron.schedule('*/5 * * * *', async () => {
    console.log('[TifaAI] Auto-syncing...');
    await fetchShopifyData();
});

// 🔄 Core sync logic
async function fetchShopifyData() {
    const url = `https://${SHOPIFY_STORE}/admin/api/2024-01/products.json`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'X-Shopify-Access-Token': SHOPIFY_TOKEN,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error(`Shopify responded with ${response.status}`);
    }

    const data = await response.json();
    console.log(`[TifaAI] Synced ${data.products?.length ?? 0} products.`);
    return data;
}

// ➕ Create, Update, Delete routes (placeholder for expansion)

app.get('/products', async (req, res) => {
    try {
        const data = await fetchShopifyData();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch products', details: error.message });
    }
});

app.get('/', (req, res) => {
    res.send('TifaAI Proxy is active and auto-syncing.');
});

app.listen(PORT, () => {
    console.log(`TifaAI is running on port ${PORT}`);
});
