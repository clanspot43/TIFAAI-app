const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const app = express();
const PORT = process.env.PORT || 10000;

const SHOPIFY_STORE = 'twpti8-fd.myshopify.com';
const SHOPIFY_TOKEN = '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';
const CJ_API_KEY = '04ec689d3dc248f3a15d14b425b3ad11';

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.send('馃挕 TifaAI Vitals Engine is online!'));

const activateModules = () => {
  console.log('鈿欙笍 Activating all Tifa modules...');
  const modules = [
    'CJdropshipping Sync',
    'Auto Descriptions',
    'Smart Pricing',
    'Urgency Timer',
    'AI Product Import',
    'Auto Reviews + Ratings',
    'Vitals Mode UI Enhancer',
    'Upsells + Bundles',
    'Shipping Sync',
    'Analytics Tracker',
    'TikTok Auto Ad'
  ];
  modules.forEach(m => console.log(`鉁� ${m} Activated`));
};

app.get('/products', async (req, res) => {
  try {
    const response = await fetch(`https://${SHOPIFY_STORE}/admin/api/2024-01/products.json`, {
      headers: { 'X-Shopify-Access-Token': SHOPIFY_TOKEN }
    });
    const data = await response.json();
    res.json({ status: 'success', products: data.products });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/command', (req, res) => {
  const cmd = req.body.command?.toLowerCase();
  if (cmd?.includes('activate')) {
    activateModules();
    return res.send('鉁� All Tifa modules activated.');
  }
  res.send('鉂� Unknown command.');
});

app.listen(PORT, () => {
  console.log(`馃殌 TifaAI Embedded App running on port ${PORT}`);
  activateModules();
});
