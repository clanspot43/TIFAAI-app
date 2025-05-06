// server.js (Express + Shopify Embedded Style) const express = require('express'); const bodyParser = require('body-parser'); const cors = require('cors'); const path = require('path');

const app = express(); const PORT = process.env.PORT || 3000;

// Shopify credentials const SHOPIFY_TOKEN = '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'; const SHOPIFY_STORE = 'twpti8-fd.myshopify.com';

// Setup app.use(cors()); app.use(bodyParser.json()); app.use(express.static('public'));

// Embedded App Root app.get('/', (req, res) => { res.send(<html> <head> <title>TifaAI Vitals Engine</title> <meta name="viewport" content="width=device-width, initial-scale=1" /> </head> <body style="font-family:sans-serif; padding:40px"> <h1>TifaAI Vitals Engine is online!</h1> <p>This embedded app is connected to your Shopify store: <strong>${SHOPIFY_STORE}</strong></p> <ul> <li><a href="/products">View Products</a></li> <li><a href="/health">Health Check</a></li> </ul> </body> </html>); });

// Health check app.get('/health', (req, res) => { res.json({ status: 'ok', message: 'TifaAI embedded app running.' }); });

// Products from Shopify app.get('/products', async (req, res) => { try { const response = await fetch(https://${SHOPIFY_STORE}/admin/api/2024-01/products.json, { headers: { 'X-Shopify-Access-Token': SHOPIFY_TOKEN, 'Content-Type': 'application/json', }, }); const data = await response.json(); res.send(<html><body> <h2>Products from Shopify (${data.products.length})</h2> <ul> ${data.products.map(p =><li>${p.title}</li>).join('')} </ul> <a href="/">Back</a> </body></html> ); } catch (err) { res.status(500).send(<p>Error loading products: ${err.message}</p><a href="/">Back</a>); } });

app.listen(PORT, () => { console.log(🟢 TifaAI Embedded App running on port ${PORT}); });

