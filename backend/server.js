require('dotenv').config();
const express = require('express');
const cors = require('cors');
const videoRoutes = require('./routes/videoRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration - Allow all origins
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// API routes
app.use('/api', videoRoutes);
app.use('/', videoRoutes); // Direct root support for /videos, /like, /share as well

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', uptime: process.uptime() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

// Bind explicitly to 0.0.0.0 for Cloud Containers (Render / Railway / Docker)
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Socially Approved Backend API running on port ${PORT}`);
});
