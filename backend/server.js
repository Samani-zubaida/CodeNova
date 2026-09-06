const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Disable Mongoose query buffering so operations don't hang when MongoDB Atlas is offline/unreachable
mongoose.set('bufferCommands', false);

const authRoutes = require('./routes/auth');
const sandboxRoutes = require('./routes/sandbox');
const progressRoutes = require('./routes/progress');
const levelsRoutes = require('./routes/levels');
const dashboardRoutes = require('./routes/dashboard');
const competitionsRoutes = require('./routes/competitions');
const usersRoutes = require('./routes/users');
const aiRoutes = require('./routes/ai');

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB connection
console.log('[Database] MongoDB URI provided:', !!process.env.MONGODB_URI);

if (process.env.MONGODB_URI) {
  console.log('[Database] Attempting MongoDB Atlas connection (timeout 4s)...');
  mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 4000,
    connectTimeoutMS: 4000
  })
  .then(() => {
    console.log('[Database] Connected successfully to MongoDB Atlas');
  })
  .catch((err) => {
    console.warn('[Database] MongoDB Atlas connection error: ' + err.message);
    console.warn('[Database] Resilient local persistent storage engine active for Auth & Data.');
  });
} else {
  console.warn('[Database] MONGODB_URI not provided. Local storage engine active.');
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/sandbox', sandboxRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/levels', levelsRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/competitions', competitionsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/ai', aiRoutes);

app.get('/', (req, res) => {
  res.send('Code Nova API is running');
});

const http = require('http');
const { Server } = require('socket.io');

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Initialize socket manager for Duels
require('./socket/duelManager')(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log('Code Nova Server running on port ' + PORT);
});
