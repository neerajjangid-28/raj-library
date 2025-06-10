const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Temporary in-memory message storage
let messages = [];

// Dummy admin credentials
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123',
};

// === LOGIN ROUTE ===
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (
    username === ADMIN_CREDENTIALS.username &&
    password === ADMIN_CREDENTIALS.password
  ) {
    res.json({
      success: true,
      user: {
        username,
        role: 'admin',
      },
    });
  } else {
    res.json({
      success: false,
      message: 'Invalid username or password',
    });
  }
});

// === GET MESSAGES ===
app.get('/messages', (req, res) => {
  res.json(messages);
});

// === POST MESSAGE ===
app.post('/messages', (req, res) => {
  const { text, sender } = req.body;

  if (!text || !sender) {
    return res.status(400).json({ success: false, message: 'Missing data' });
  }

  const newMessage = {
    id: Date.now(),
    text,
    sender,
    time: new Date().toLocaleTimeString(),
  };

  messages.push(newMessage);

  res.json({ success: true, message: newMessage });
});

// === DELETE MESSAGE (optional future feature) ===
// app.delete('/messages/:id', (req, res) => {
//   const { id } = req.params;
//   messages = messages.filter((msg) => msg.id !== parseInt(id));
//   res.json({ success: true });
// });

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
