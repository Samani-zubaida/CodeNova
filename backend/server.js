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

app.set('trust proxy', 1);

const configuredFrontend = (process.env.FRONTEND_URL || '').replace(/\/+$/, '');

const exactAllowedOrigins = new Set([
  'https://code-nova-ashen.vercel.app',
  'https://code-nova.vercel.app',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:4173',
  'http://127.0.0.1:4173',
]);

if (configuredFrontend) {
  exactAllowedOrigins.add(configuredFrontend);
}

const isOriginAllowed = (origin) => {
  // Allow non-browser requests (e.g. curl, tests, mobile, server-to-server)
  if (!origin) return true;
  const normalized = origin.toLowerCase().replace(/\/+$/, '');
  if (exactAllowedOrigins.has(normalized)) return true;
  // Allow Code Nova Vercel preview and deployment branch domains
  if (/^https:\/\/code-nova[\w-]*\.vercel\.app$/.test(normalized)) return true;
  return false;
};

const corsOptions = {
  origin: (origin, callback) => {
    if (isOriginAllowed(origin)) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '1mb' }));

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

// Centralized error handler ensuring CORS headers and JSON format
app.use((err, req, res, next) => {
  console.error('[Server Error]:', err.message || err);
  if (res.headersSent) {
    return next(err);
  }
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error'
  });
});

const http = require('http');
const { Server } = require('socket.io');

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (isOriginAllowed(origin)) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    },
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Initialize socket manager for Duels
require('./socket/duelManager')(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log('Code Nova Server running on port ' + PORT);
});
