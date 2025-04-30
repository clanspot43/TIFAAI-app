const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cron = require('node-cron');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 10000;

// ✅ Make sure to store these in Render's environment variables
const SHOPIFY_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN || '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';
const SHOPIFY_STORE = process.env.SHOPIFY_STORE_DOMAIN || 'twpti8-fd.myshopify.com';

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Health check
app.get('/health', (_, res) => {
  res.json({ status: 'ok', message: 'TifaAI backend alive' });
});

// Root message
app.get('/', (_, res) => {
  res.send('🛠️ TifaAI Shopify Proxy is running babe!');
});

// Shopify product proxy
app.get('/products', async (req, res) => {
  console.log('➡️ /products requested by:', req.headers['user-agent'] || 'unknown');

  try {
    const response = await fetch(`https://${SHOPIFY_STORE}/admin/api/2024-01/products.json`, {
      method: 'GET',
      headers: {
        'X-Shopify-Access-Token': SHOPIFY_TOKEN,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      console.error(`❌ Shopify Error: ${response.status}`);
      return res.status(response.status).json({ error: `Shopify returned ${response.status}` });
    }

    const data = await response.json();
    res.status(200).json({
      status: 'success',
      source: req.headers['user-agent'] || 'unknown',
      products: data.products || []
    });
  } catch (err) {
    console.error('❌ Internal Error:', err.message);
    res.status(500).json({ error: 'Fetch failed', detail: err.message });
  }
});

// Webhook receiver
app.post('/webhook/shopify', (req, res) => {
  console.log('⚠️ Webhook:', req.body);
  res.sendStatus(200);
});

// Mock integrations
app.get('/cj', (_, res) => res.send('📦 CJdropshipping module online.'));
app.get('/tiktok', (_, res) => res.send('📲 TikTok ad manager online.'));
app.get('/ui', (_, res) => res.send('<h2>🧠 TifaAI UI Panel (coming soon)</h2>'));

// Command executor
app.post('/command', (req, res) => {
  const cmd = req.body.command?.toLowerCase() || '';
  if (cmd.includes('tiktok')) res.send('📲 TikTok module upgraded!');
  else if (cmd.includes('cj')) res.send('📦 CJ module synced!');
  else if (cmd.includes('analytics')) res.send('📊 Analytics module active!');
  else if (cmd.includes('theme')) res.send('🎨 Theme editor enabled!');
  else res.send('❓ Unknown command.');
});

// Cron every 10 min
cron.schedule('*/10 * * * *', () => {
  console.log('⏱️ Auto-sync running...');
});

// Server start
app.listen(PORT, () => {
  console.log('🟢 TifaAI running on port ' + PORT);
});
