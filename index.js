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
  res.send('🛠️ TifaAI Shopify Proxy is running babe!');
});

app.get('/products', async (req, res) => {
  console.log('➡️ /products called by:', req.headers['user-agent'] || 'unknown');

  try {
    const response = await fetch(`https://${SHOPIFY_STORE}/admin/api/2024-01/products.json`, {
      method: 'GET',
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

app.post('/webhook/shopify', (req, res) => {
  console.log('⚠️ Webhook received:', req.body);
  res.sendStatus(200);
});

app.get('/cj', (req, res) => {
  res.send('📦 CJdropshipping module online.');
});

app.get('/tiktok', (req, res) => {
  res.send('📲 TikTok ad manager online.');
});

app.get('/ui', (req, res) => {
  res.send('<h2>🧠 TifaAI UI Panel (coming soon)</h2>');
});

app.post('/command', (req, res) => {
  const cmd = req.body.command?.toLowerCase();
  if (cmd?.includes('tiktok')) res.send('📲 TikTok module upgraded!');
  else if (cmd?.includes('cj')) res.send('📦 CJ module synced!');
  else if (cmd?.includes('analytics')) res.send('📊 Analytics module active!');
  else if (cmd?.includes('theme')) res.send('🎨 Theme editor enabled!');
  else res.send('❓ Unknown command.');
});

cron.schedule('*/10 * * * *', () => {
  console.log('⏱️ Cron: Running auto-sync...');
});

app.listen(PORT, () => {
  console.log('🟢 TifaAI running on port ' + PORT);
});
