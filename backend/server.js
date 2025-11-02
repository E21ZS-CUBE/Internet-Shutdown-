// backend/server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/database');
const { scheduleScrapers } = require('./services/scheduler');

dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize scraper scheduler
scheduleScrapers();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
const shutdownRoutes = require('./routes/shutdowns');
const stateRoutes = require('./routes/states');
const statisticsRoutes = require('./routes/statistics');
const geoRoutes = require('./routes/geo');
const sourcesRoutes = require('./routes/sources');
const searchRoutes = require('./routes/search');
const ooniRoutes = require('./routes/ooni');
const sflcRoutes = require('./routes/sflc');
const cloudflareRoutes = require('./routes/cloudflare');

// Routes
app.use('/api/shutdowns', shutdownRoutes);
app.use('/api/states', stateRoutes);
app.use('/api/statistics', statisticsRoutes);
app.use('/api/geo', geoRoutes);
app.use('/api/sources', sourcesRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/ooni', ooniRoutes);
app.use('/api/sflc', sflcRoutes);
app.use('/api/cloudflare', cloudflareRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      status: err.status || 500
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✓ Server running on http://localhost:${PORT}`);
  console.log(`✓ API available at http://localhost:${PORT}/api`);
});

module.exports = app;