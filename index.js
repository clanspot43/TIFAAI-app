
const express = require('express');
const bodyParser = require('body-parser');
const cron = require('node-cron');
const fetch = require('node-fetch');

const SHOPIFY_TOKEN = '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';
const SHOPIFY_STORE = 'twpti8-fd.myshopify.com';
const PORT = process.env.PORT || 10000;

const app = express();
app.use(bodyParser.json());

// Shopify endpoint test
app.get('/shopify', (req, res) => {
  res.send(`🛒 Shopify automation active for store: ${SHOPIFY_STORE}`);
});

// TikTok logic
app.get('/tiktok', (req, res) => {
  res.send('🎬 TikTok automation logic active.');
});

// CJdropshipping
app.get('/cj', (req, res) => {
  res.send('📦 CJ sync logic online.');
});

// Shopify Webhook
app.post('/webhook/shopify', (req, res) => {
  console.log('⚠️ Webhook received from Shopify:', req.body);
  res.send('Webhook OK');
});

// Upgrade TifaAI brain by command
app.post('/command', (req, res) => {
  const command = req.body.command?.toLowerCase() || '';
  if (command.includes('tiktok')) return res.send('🎯 Upgrading TikTok module...');
  if (command.includes('analytics')) return res.send('📊 Smart analytics activated.');
  if (command.includes('cj')) return res.send('📦 CJ module upgraded.');
  res.send('🤖 Unknown command. Try again.');
});

// Cron: Shopify + CJ Auto Sync every 10 minutes
cron.schedule('*/10 * * * *', async () => {
  console.log('🔁 Cron Sync: Auto syncing Shopify and CJ');
});

// Mobile UI route
app.get('/', (req, res) => {
  res.send(`<h1>TifaAI Mobile Control Panel</h1>
            <form method="POST" action="/command">
              <input name="command" placeholder="Give me a command" />
              <button type="submit">Send</button>
            </form>`);
});

app.listen(PORT, () => {
  console.log(`🚀 TifaAI running at port ${PORT} for ${SHOPIFY_STORE}`);
});
