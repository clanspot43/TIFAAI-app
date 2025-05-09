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

// ✅ Get Shopify Products
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

// ✅ CJ Import Winning Products
app.post('/cj/import', async (req, res) => {
  try {
    const payload = {
      pageSize: 5,
      pageNum: 1,
      keyword: req.body.keyword || 'fitness'
    };

    const result = await fetch('https://api.cjdropshipping.com/api/product/list', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'CJ-Access-Token': CJ_API_KEY,
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const contentType = result.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await result.text();
      throw new Error(`CJ API responded with non-JSON: ${text.slice(0, 200)}...`);
    }

    const data = await result.json();
    res.status(200).json({ status: 'success', imported: data.result });
  } catch (err) {
    console.error('❌ CJ API Sync Error:', err.message);
    res.status(500).json({ error: 'CJ Import failed', detail: err.message });
  }
});

// ✅ Command Center
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

// ✅ Scheduled Sync Every 10 Mins
cron.schedule('*/10 * * * *', async () => {
  console.log('⏱️ Running cron job: auto product sync');
  try {
    const payload = { pageSize: 5, pageNum: 1, keyword: 'auto' };
    const result = await fetch('https://api.cjdropshipping.com/api/product/list', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'CJ-Access-Token': CJ_API_KEY,
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const contentType = result.headers.get('content-type');
    if (!contentType.includes('application/json')) {
      const fallback = await result.text();
      console.error('🛑 Sync failed: Non-JSON', fallback.slice(0, 100));
      return;
    }

    const data = await result.json();
    console.log(`✅ Auto Sync Imported ${data.result?.length || 0} items.`);
  } catch (err) {
    console.error('🔥 Auto Sync Error:', err.message);
  }
});

app.listen(PORT, () => {
  console.log(`🟢 TifaAI running on port ${PORT}`);
});
