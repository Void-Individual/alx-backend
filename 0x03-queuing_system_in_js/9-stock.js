import express from 'express';
import { createClient, print } from 'redis';

const { promisify } = require('util');

const client = createClient({
  url: 'redis://127.0.0.1:6379',
  socket: {
    connectTimeout: 5000 // Set a timeout to prevent long waits
}
});

client.on('connect', () => {
  console.log('Redis client connected to the server');
});

client.on('error', (err) => {
  console.log('There was an error:', err.message);
});

//client.connect();

// Promisify Redis client methods
//const setAsync = promisify(client.set).bind(client);
//const getAsync = promisify(client.get).bind(client);

// Connect to Redis
//(async () => {
//  try {
//    await client.connect();
//  } catch (err) {
//    console.error('Error connecting to Redis server:', err.message);
//  }
//})();

client.connect();

async function reserveStockById(itemId, stock) {
  try {
    const response = await client.set(itemId, stock, print);
    console.log('Reply: ', response);
  } catch (err) {
    console.error('Error reserving stock:', err);
  }
}

async function getCurrentReservedStockById(itemId) {
  try {
    const value = await client.get(itemId);
    return value ? parseInt(value, 10) : 0; // Convert the value to an integer
  } catch (err) {
    console.error('Error getting reserved stock:', err);
    return 0;
  }
}

const listProducts = [
  { Id: 1,
    name: 'Suitcase 250',
    price: 50, stock: 4 },
  { Id: 2,
    name: 'Suitcase 450',
    price: 100, stock: 10 },
  { Id: 3,
    name: 'Suitcase 650',
    price: 350, stock: 2 },
  { Id: 4,
    name: 'Suitcase 1050',
    price: 550, stock: 5 }
];

function getItemById(id) {
  for (const product of listProducts) {
    if (product.Id.toString() === id) {
      return product;
    }
  }
  return null;
}

const app = express();
const port = 1245;

app.get('/list_products', (req, res) => {
  res.send(listProducts);
});

app.get('/list_products/:itemId', async (req, res) => {
  const itemId = req.params.itemId;
  const item = getItemById(itemId);

  if (item) {
    const initialAvailableQuantity = item.stock;
    const reservedStock = await getCurrentReservedStockById(itemId);
    const currentQuantity = initialAvailableQuantity - reservedStock;

    item.initialAvailableQuantity = initialAvailableQuantity;
    item.currentQuantity = currentQuantity;

    res.send(item);
  } else {
    res.status(404).send({ "status":"Product not found" });
  }
});

app.get('/reserve_product/:itemId', async (req, res) => {
  const itemId = req.params.itemId;
  const item = getItemById(itemId);

  if (item) {
    const initialAvailableQuantity = item.stock;
    const reservedStock = await getCurrentReservedStockById(itemId);
    const currentQuantity = initialAvailableQuantity - reservedStock;

    if (currentQuantity < 1) {
      res.send({ "status": "Not enough stock available", "itemId": itemId })
    } else {
      await reserveStockById(itemId, 1);
      res.send({ "status": "Reservation confirmed", "itemId": itemId })
    }

  } else {
    res.status(404).send({ "status": "Product not found" });
  }
});

app.listen(port, () => {
  console.log(`Server runing at localhost:${port}`);
})
