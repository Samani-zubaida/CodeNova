const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

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
console.log("MongoDB URI exists:", !!process.env.MONGODB_URI);

if (process.env.MONGODB_URI) {
  console.log("Starting MongoDB connection...");
  mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 10000
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:");
    console.error(err);
  });
} else {
  console.warn("WARNING: MONGODB_URI is undefined. Skipping database connection. Some features may not work.");
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
    origin: "*", // allow all origins for dev
    methods: ["GET", "POST"]
  }
});

// Initialize socket manager for Duels
require('./socket/duelManager')(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


