require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'dollartree_secret_key_2024';
const DB_PATH = path.join(__dirname, 'data.json');

function readDB() {
  if (!fs.existsSync(DB_PATH)) return null;
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
}
function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}
function initDB() {
  if (readDB()) return;
  const owners = [
    { id: 1, username: 'Tejus', password: bcrypt.hashSync('password', 10) },
    { id: 2, username: 'Alex', password: bcrypt.hashSync('password', 10) },
    { id: 3, username: 'Tathvik', password: bcrypt.hashSync('password', 10) },
    { id: 4, username: 'Rithik', password: bcrypt.hashSync('password', 10) },
  ];
  const products = [
    { id:1, name:"Chips Ahoy! Cookies", category:"Snacks", price:1.25, image:"🍪", description:"Classic chocolate chip cookies" },
    { id:2, name:"Ritz Crackers", category:"Snacks", price:1.25, image:"🧀", description:"Buttery round crackers" },
    { id:3, name:"Doritos Nacho Cheese", category:"Snacks", price:1.25, image:"🌽", description:"Bold nacho cheese chips" },
    { id:4, name:"Oreo Cookies", category:"Snacks", price:1.25, image:"⚫", description:"America's favorite cookie" },
    { id:5, name:"Pringles Original", category:"Snacks", price:1.25, image:"🥔", description:"Once you pop, you can't stop" },
    { id:6, name:"Cheez-It Crackers", category:"Snacks", price:1.25, image:"🧡", description:"Real cheese baked in" },
    { id:7, name:"Coca-Cola 20oz", category:"Drinks", price:1.25, image:"🥤", description:"Ice cold Coca-Cola" },
    { id:8, name:"Minute Maid Juice", category:"Drinks", price:1.25, image:"🍊", description:"Fresh squeezed taste" },
    { id:9, name:"Arizona Iced Tea", category:"Drinks", price:1.25, image:"🍵", description:"Classic sweet tea" },
    { id:10, name:"Gatorade Blue", category:"Drinks", price:1.25, image:"💧", description:"Cool Blue electrolytes" },
    { id:11, name:"Snapple Peach Tea", category:"Drinks", price:1.25, image:"🍑", description:"Made from the best stuff" },
    { id:12, name:"Reese's Cups", category:"Candy", price:1.25, image:"🍫", description:"Peanut butter and chocolate" },
    { id:13, name:"Skittles Original", category:"Candy", price:1.25, image:"🌈", description:"Taste the rainbow" },
    { id:14, name:"Sour Patch Kids", category:"Candy", price:1.25, image:"🍬", description:"Sour then sweet" },
    { id:15, name:"Starburst Original", category:"Candy", price:1.25, image:"⭐", description:"Unexplainably juicy" },
    { id:16, name:"M&Ms Peanut", category:"Candy", price:1.25, image:"🟤", description:"Milk chocolate with peanut" },
    { id:17, name:"Dawn Dish Soap", category:"Household", price:1.25, image:"🫧", description:"Tough on grease" },
    { id:18, name:"Sponges 3-Pack", category:"Household", price:1.25, image:"🧽", description:"Heavy duty scrubbing" },
    { id:19, name:"Garbage Bags 10-Pack", category:"Household", price:1.25, image:"🗑️", description:"Strong and reliable" },
    { id:20, name:"Paper Towels 2-Roll", category:"Household", price:1.25, image:"🧻", description:"Absorbent and strong" },
    { id:21, name:"All-Purpose Cleaner", category:"Household", price:1.25, image:"🧴", description:"Cleans any surface" },
    { id:22, name:"Dove Body Wash", category:"Personal Care", price:1.25, image:"🚿", description:"Moisturizing body wash" },
    { id:23, name:"Colgate Toothpaste", category:"Personal Care", price:1.25, image:"🦷", description:"Whitening formula" },
    { id:24, name:"Band-Aids 10-Pack", category:"Personal Care", price:1.25, image:"🩹", description:"Flexible fabric bandages" },
    { id:25, name:"Hand Sanitizer", category:"Personal Care", price:1.25, image:"🤲", description:"99.9% germ kill" },
    { id:26, name:"Birthday Balloons 8-Pack", category:"Party", price:1.25, image:"🎈", description:"Colorful latex balloons" },
    { id:27, name:"Paper Plates 20-Pack", category:"Party", price:1.25, image:"🍽️", description:"Sturdy disposable plates" },
    { id:28, name:"Plastic Cups 20-Pack", category:"Party", price:1.25, image:"🥳", description:"Great for parties" },
    { id:29, name:"Gift Bags Assorted", category:"Party", price:1.25, image:"🎁", description:"Beautiful gift bags" },
  ];
  writeDB({ owners, products, orders: [], nextOrderId: 1, nextProductId: 30 });
  console.log('✅ Database initialized');
}
initDB();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend/public')));

function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try { req.owner = jwt.verify(token, JWT_SECRET); next(); }
  catch { res.status(401).json({ error: 'Invalid token' }); }
}

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const db = readDB();
  const owner = db.owners.find(o => o.username.toLowerCase() === (username||'').toLowerCase());
  if (!owner || !bcrypt.compareSync(password, owner.password))
    return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ id: owner.id, username: owner.username }, JWT_SECRET, { expiresIn: '24h' });
  res.json({ token, username: owner.username });
});

app.get('/api/products', (req, res) => {
  const db = readDB();
  res.json([...db.products].sort((a,b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name)));
});

app.put('/api/products/:id', authMiddleware, (req, res) => {
  const db = readDB();
  const p = db.products.find(p => p.id === parseInt(req.params.id));
  if (!p) return res.status(404).json({ error: 'Not found' });
  p.price = req.body.price;
  writeDB(db);
  res.json({ success: true });
});

app.post('/api/products', authMiddleware, (req, res) => {
  const { name, category, price, image, description } = req.body;
  const db = readDB();
  const np = { id: db.nextProductId++, name, category, price: price||1.25, image: image||'🛍️', description: description||'' };
  db.products.push(np);
  writeDB(db);
  res.json({ id: np.id });
});

app.delete('/api/products/:id', authMiddleware, (req, res) => {
  const db = readDB();
  db.products = db.products.filter(p => p.id !== parseInt(req.params.id));
  writeDB(db);
  res.json({ success: true });
});

app.post('/api/orders', (req, res) => {
  const { email, items, total } = req.body;
  if (!email || !items || !total) return res.status(400).json({ error: 'Missing fields' });
  const db = readDB();
  const order = { id: db.nextOrderId++, customer_email: email, items, total, status: 'pending', created_at: new Date().toISOString() };
  db.orders.push(order);
  writeDB(db);
  res.json({ id: order.id, message: 'Order placed!' });
});

app.get('/api/orders', authMiddleware, (req, res) => {
  const db = readDB();
  res.json([...db.orders].reverse());
});

app.put('/api/orders/:id/status', authMiddleware, (req, res) => {
  const db = readDB();
  const o = db.orders.find(o => o.id === parseInt(req.params.id));
  if (!o) return res.status(404).json({ error: 'Not found' });
  o.status = req.body.status;
  writeDB(db);
  res.json({ success: true });
});

app.get('*', (req, res) => res.sendFile(path.join(__dirname, '../frontend/public/index.html')));

app.listen(PORT, () => console.log(`🛒 Dollar Tree Store on http://localhost:${PORT}`));
