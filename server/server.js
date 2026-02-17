/**
 * ChordFlow Server - Production Ready
 * Enhanced with security, rate limiting, and monitoring
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { initializeDatabase } = require('./src/config/database');
const songRoutes = require('./src/routes/songRoutes');
const { apiLimiter } = require('./src/middleware/security');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Initialize database
initializeDatabase();

// Security Headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  next();
});

// CORS Configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:5173', 'http://localhost:3000'];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin) || NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'DELETE'],
  credentials: false,
}));

// Body parsing middleware
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Rate limiting
app.use('/api/', apiLimiter);

// API Routes
app.use('/api', songRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'ChordFlow API is running',
    uptime: process.uptime(),
    timestamp: Date.now(),
    environment: NODE_ENV,
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'ChordFlow API',
    version: '1.0.0',
    description: 'Free guitar chords and tabs API',
    endpoints: {
      songs: '/api/songs',
      search: '/api/songs/search',
      upload: '/api/songs/upload',
      manual: '/api/songs/manual',
      health: '/health',
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    path: req.path,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);

  // Don't leak error details in production
  const message = NODE_ENV === 'production'
    ? 'Internal server error'
    : err.message;

  res.status(err.status || 500).json({
    success: false,
    error: message,
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\nSIGINT received, shutting down gracefully...');
  process.exit(0);
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════╗
║      🎸 ChordFlow Server Running      ║
║                                       ║
║  Port: ${PORT}${PORT < 1000 ? '    ' : PORT < 10000 ? '   ' : '  '}                      ║
║  Environment: ${NODE_ENV.padEnd(24)} ║
║  Database: SQLite                     ║
║                                       ║
║  API: http://localhost:${PORT}/api${PORT < 1000 ? '    ' : PORT < 10000 ? '   ' : '  '}  ║
║  Health: http://localhost:${PORT}/health ║
╚═══════════════════════════════════════╝
  `);
});
