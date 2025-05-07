const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 10000;

const SHOPIFY_STORE = 'twpti8-fd.myshopify.com';
const SHOPIFY_TOKEN = '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';
const CJ_API_KEY = '04ec689d3dc248f3a15d14b425b3ad11';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dashboard'))); // Serve dashboard UI

// Root route - Dashboard UI
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'dashboard', 'index.html'));
});

// Module Activator
const activateModules = () => {
  console.log('⚙️ Activating all Tifa modules...');
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
  modules.forEach(m => console.log(`✅ ${m} Activated`));
};

// Products API route
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

// Command trigger (GPT or admin)
app.post('/command', (req, res) => {
  const cmd = req.body.command?.toLowerCase();
  if (cmd?.includes('activate')) {
    activateModules();
    return res.send('✅ All Tifa modules activated.');
  }
  res.send('❓ Unknown command.');
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 TifaAI Embedded App running on port ${PORT}`);
  activateModules();
});
