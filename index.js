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

app.get('/', (req, res) => res.send('馃洜锔� TifaAI Shopify Proxy is running babe!'));
app.get('/health', (req, res) => res.send({ status: 'ok' }));

app.get('/products', async (req, res) => {
  try {
    const response = await fetch(`https://${SHOPIFY_STORE}/admin/api/2024-01/products.json`, {
      headers: {
        'X-Shopify-Access-Token': SHOPIFY_TOKEN,
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    res.json({ status: 'success', products: data.products });
  } catch (err) {
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
    const response = await fetch('https://developers.cjdropshipping.com/product/list', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'CJ-Access-Token': CJ_API_KEY
      },
      body: JSON.stringify(queryPayload)
    });
    const data = await response.json();
    res.status(200).json({ status: 'imported', products: data.result });
  } catch (err) {
    res.status(500).json({ error: 'CJ import failed', detail: err.message });
  }
});

app.listen(PORT, () => console.log('馃煝 TifaAI running on port ' + PORT));
