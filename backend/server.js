const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Import routes
const userRoutes = require('./routes/users');

// Import database connection to test it on startup
const { pool } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3001;

// Trust proxy (important for rate limiting and getting real IP addresses)
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS configuration
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    'http://localhost:3000',
    'http://127.0.0.1:3000'
  ],
  credentials: true,
  optionsSuccessStatus: 200
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Stricter rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later.'
  },
  skipSuccessfulRequests: true,
});

app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    // Test database connection
    await pool.query('SELECT 1');
    res.json({
      success: true,
      message: 'Server is healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      message: 'Server is unhealthy',
      error: error.message
    });
  }
});

// API routes
app.use('/api/users', authLimiter, userRoutes);

// Welcome route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Cursor.ai Learning Example API',
    version: '1.0.0',
    documentation: '/api/docs',
    endpoints: {
      health: '/health',
      users: '/api/users'
    }
  });
});

// API documentation route
app.get('/api/docs', (req, res) => {
  res.json({
    success: true,
    message: 'Cursor.ai Learning Example API Documentation',
    version: '1.0.0',
    endpoints: {
      'POST /api/users/register': 'Register a new user',
      'POST /api/users/login': 'Login user',
      'GET /api/users/profile': 'Get user profile (requires authentication)',
      'GET /api/users/me': 'Get current user info (requires authentication)',
      'POST /api/users/verify-email': 'Verify user email',
      'GET /health': 'Health check'
    },
    authentication: {
      type: 'Bearer Token',
      header: 'Authorization: Bearer <token>'
    },
    examples: {
      register: {
        method: 'POST',
        url: '/api/users/register',
        body: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          birthDate: '1990-01-01',
          phoneNumber: '+1234567890',
          password: 'SecurePassword123!',
          confirmPassword: 'SecurePassword123!'
        }
      },
      login: {
        method: 'POST',
        url: '/api/users/login',
        body: {
          email: 'john.doe@example.com',
          password: 'SecurePassword123!'
        }
      }
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('🚨 Global error handler:', error);
  
  res.status(error.status || 500).json({
    success: false,
    message: process.env.NODE_ENV === 'development' 
      ? error.message 
      : 'Something went wrong!',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Received SIGINT. Graceful shutdown...');
  try {
    await pool.end();
    console.log('✅ Database pool closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during shutdown:', error);
    process.exit(1);
  }
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Received SIGTERM. Graceful shutdown...');
  try {
    await pool.end();
    console.log('✅ Database pool closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during shutdown:', error);
    process.exit(1);
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`
🚀 Cursor.ai Learning Example API Server
📍 Environment: ${process.env.NODE_ENV || 'development'}
🌐 Server: http://localhost:${PORT}
📚 Documentation: http://localhost:${PORT}/api/docs
💊 Health Check: http://localhost:${PORT}/health
⏰ Started at: ${new Date().toISOString()}
  `);
});

module.exports = app;