const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const sandboxRoutes = require('./routes/sandbox');
const progressRoutes = require('./routes/progress');
const levelsRoutes = require('./routes/levels');

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB connection
console.log("MongoDB URI exists:", !!process.env.MONGODB_URI);
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

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/sandbox', sandboxRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/levels', levelsRoutes);

app.get('/', (req, res) => {
  res.send('Code Nova API is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
