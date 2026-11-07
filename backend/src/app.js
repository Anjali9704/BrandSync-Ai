const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const config = require('./config/environment');
const routes = require('./routes');
const errorHandler = require('./middlewares/error.middleware');

const app = express();

// Allowed CORS origins
const allowedOrigins = [
  config.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
].filter(Boolean);

// CORS configuration (Strictly following the project specification)
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    credentials: true,
  })
);

// Body parsers
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));

// Logging
if (config.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Versioned API Routes Registration
app.use('/api/v1', routes);

// 404 handler for unknown routes
app.use('*', (req, res) => {
  res.status(404).json({
    statusCode: 404,
    success: false,
    message: `Endpoint ${req.originalUrl} not found`,
    detail: `Endpoint ${req.originalUrl} not found`,
  });
});

// Centralized Error Handling Middleware
app.use(errorHandler);

module.exports = app;

