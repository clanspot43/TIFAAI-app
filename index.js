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

app.get('/', (req, res) => {
  console.log('馃煝 Root path hit');
  res.send('馃洜锔� TifaAI is running (Vitals mode enabled)');
});

app.get('/health', (req, res) => {
  console.log('鉂わ笍 Health check requested');
  res.send({ status: 'ok', message: 'Proxy alive' });
});

app.get('/products', async (req, res) => {
  try {
    console.log('馃摝 Fetching products from Shopify...');
    const response = await fetch(`https://${SHOPIFY_STORE}/admin/api/2024-01/products.json`, {
      headers: {
        'X-Shopify-Access-Token': SHOPIFY_TOKEN,
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    console.log('鉁� Products received:', data.products?.length || 0);
    res.json({ status: 'success', products: data.products });
  } catch (err) {
    console.error('鉂� Failed to fetch products:', err.message);
    res.status(500).json({ error: 'Fetch failed', detail: err.message });
  }
});

app.post('/cj/import', async (req, res) => {
  try {
    const queryPayload = {
      pageSize: 5,
      pageNum: 1,
      keyword: req.body.keyword || 'fitness'
    };
    console.log('馃寪 Sending request to CJ API...');
    const response = await fetch('https://developers.cjdropshipping.com/product/list', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'CJ-Access-Token': CJ_API_KEY
      },
      body: JSON.stringify(queryPayload)
    });
    const data = await response.json();
    console.log('鉁� CJ products imported:', data?.result?.length || 0);
    res.status(200).json({ status: 'imported', products: data.result });
  } catch (err) {
    console.error('鉂� CJ import failed:', err.message);
    res.status(500).json({ error: 'CJ import failed', detail: err.message });
  }
});
