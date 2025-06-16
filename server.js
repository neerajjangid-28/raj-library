const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const mongoURI = 'mongodb+srv://rajuser:Raj%23%401234@cluster0.p0k7arw.mongodb.net/rajlibrary?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// In-memory data
let users = [];
let messages = [];

const ADMIN = { username: 'admin', password: '1234' };

// Routes
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN.username && password === ADMIN.password) {
    return res.json({ role: 'admin' });
  }
  const user = users.find(u => u.username === username && u.password === password);
  if (user) return res.json({ role: 'student', allowed: user.allowed });
  res.status(401).json({ error: 'Invalid credentials' });
});

app.post('/register', (req, res) => {
  const user = { ...req.body, allowed: false };
  users.push(user);
  res.json({ message: 'Registered. Waiting for approval.' });
});

app.post('/allow', (req, res) => {
  const { username } = req.body;
  const user = users.find(u => u.username === username);
  if (user) {
    user.allowed = true;
    res.json({ message: 'Allowed.' });
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

app.post('/message', (req, res) => {
  const { sender, text } = req.body;
  const message = { id: Date.now(), sender, text };
  messages.push(message);
  res.json({ message: 'Sent.' });
});

app.get('/messages', (req, res) => {
  res.json(messages);
});

app.delete('/message/:id', (req, res) => {
  const id = parseInt(req.params.id);
  messages = messages.filter(m => m.id !== id);
  res.json({ message: 'Deleted.' });
});

app.get('/search', (req, res) => {
  const query = req.query.q;
  const result = messages.filter(m => m.text.includes(query));
  res.json(result);
});

// Start Server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
