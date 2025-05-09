const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cron = require('node-cron');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 10000;

// Config
const SHOPIFY_TOKEN = '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';
const SHOPIFY_STORE = 'twpti8-fd.myshopify.com';
const CJ_API_KEY = '04ec689d3dc248f3a15d14b425b3ad11';

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/', (req, res) => res.send('💡 TifaAI Vitals Engine is online!'));
app.get('/health', (req, res) => res.send({ status: 'ok' }));

// Shopify product fetcher
app.get('/products', async (req, res) => {
  try {
    const result = await fetch(`https://${SHOPIFY_STORE}/admin/api/2024-01/products.json`, {
      headers: {
        'X-Shopify-Access-Token': SHOPIFY_TOKEN,
        'Content-Type': 'application/json'
      }
    });
    if (!result.ok) throw new Error(`Shopify error: ${result.status}`);
    const data = await result.json();
    res.json({ products: data.products });
  } catch (err) {
    res.status(500).json({ error: 'Shopify fetch failed', detail: err.message });
  }
});

// CJ import (limit: 5 products)
app.post('/cj/import', async (req, res) => {
  try {
    const payload = {
      pageSize: 5,
      pageNum: 1,
      keyword: req.body.keyword || 'fitness'
    };
    const result = await fetch('https://developers.cjdropshipping.com/product/list', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'CJ-Access-Token': CJ_API_KEY
      },
      body: JSON.stringify(payload)
    });
    const data = await result.json();
    res.status(200).json({ status: 'success', imported: data.result });
  } catch (err) {
    res.status(500).json({ error: 'CJ Import failed', detail: err.message });
  }
});

// CJ → Shopify automation pipeline
async function syncCJToShopify(keyword = 'fitness') {
  try {
    const result = await fetch('https://developers.cjdropshipping.com/product/list', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'CJ-Access-Token': CJ_API_KEY
      },
      body: JSON.stringify({ keyword, pageSize: 3, pageNum: 1 })
    });
    const data = await result.json();

    for (const item of data.result || []) {
      const product = {
        product: {
          title: item.name || 'CJ Product',
          body_html: item.sellPoint || '',
          vendor: 'CJdropshipping',
          product_type: item.categoryName || 'General',
          variants: [{
            price: item.sellPrice || '9.99'
          }]
        }
      };
      await fetch(`https://${SHOPIFY_STORE}/admin/api/2024-01/products.json`, {
        method: 'POST',
        headers: {
          'X-Shopify-Access-Token': SHOPIFY_TOKEN,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(product)
      });
    }
    console.log('✅ CJ→Shopify sync complete');
  } catch (err) {
    console.error('❌ Sync failed:', err.message);
  }
}

// GPT command executor
app.post('/command', async (req, res) => {
  const cmd = req.body.command?.toLowerCase() || '';
  console.log('🧠 Command:', cmd);

  if (cmd.includes('auto')) {
    await syncCJToShopify();
    res.send('✅ Auto pipeline: CJ→Shopify sync done');
  } else if (cmd.includes('tiktok')) res.send('📲 TikTok module upgraded!');
  else if (cmd.includes('cj')) res.send('📦 CJ module synced!');
  else if (cmd.includes('analytics')) res.send('📊 Analytics coming soon');
  else res.send('❓ Unknown command.');
});

// Cron auto-sync every 10 minutes
cron.schedule('*/10 * * * *', () => {
  console.log('⏱️ Auto Sync Running');
  syncCJToShopify();
});

app.listen(PORT, () => {
  console.log(`🟢 TifaAI running on ${PORT}`);
});
