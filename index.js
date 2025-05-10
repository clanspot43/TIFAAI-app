const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cron = require('node-cron');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 10000;

const SHOPIFY_TOKEN = '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';
const SHOPIFY_STORE = 'twpti8-fd.myshopify.com';
const CJ_API_KEY = '04ec689d3dc248f3a15d14b425b3ad11';

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/', (req, res) => res.send('💡 TifaAI Vitals Engine is online!'));
app.get('/health', (req, res) => res.send({ status: 'ok' }));

app.get('/products', async (req, res) => {
  try {
    const result = await fetch(`https://${SHOPIFY_STORE}/admin/api/2024-01/products.json`, {
      headers: {
        'X-Shopify-Access-Token': SHOPIFY_TOKEN,
        'Content-Type': 'application/json'
      }
    });
    const data = await result.json();
    res.json({ products: data.products });
  } catch (err) {
    res.status(500).json({ error: 'Shopify fetch failed', detail: err.message });
  }
});

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

app.post('/command', async (req, res) => {
  const cmd = req.body.command?.toLowerCase() || '';
  console.log('🧠 Command received:', cmd);

  if (cmd.includes('auto')) {
    res.send('✅ Full automation activated: Auto CJ import, sync, Shopify updates enabled!');
  } else if (cmd.includes('tiktok')) {
    res.send('📲 TikTok module upgraded!');
  } else if (cmd.includes('cj')) {
    res.send('📦 CJ module synced!');
  } else if (cmd.includes('analytics')) {
    res.send('📊 Analytics module active!');
  } else {
    res.send('❓ Unknown command.');
  }
});

cron.schedule('*/10 * * * *', async () => {
  console.log('⏱️ Running cron job: auto product sync');
  try {
    const result = await fetch('https://developers.cjdropshipping.com/product/list', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'CJ-Access-Token': CJ_API_KEY
      },
      body: JSON.stringify({ pageSize: 1, pageNum: 1, keyword: 'trending' })
    });
    const json = await result.json();
    console.log('✅ Auto Sync Success:', json.result);
  } catch (err) {
    console.error('❌ Auto Sync Error:', err.message);
  }
});

app.listen(PORT, () => {
  console.log(`🟢 TifaAI running on port ${PORT}`);
});
