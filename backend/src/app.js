require('express-async-errors');

const express = require('express');

const securityMiddleware = require('./config/security/security.middleware');
const corsMiddleware = require('./config/cors/cors.middleware');

const bodyParserMiddleware = require('./middleware/bodyParser.middleware');
const requestContext = require('./middleware/requestContext');
const requestLoggerMiddleware = require('./middleware/requestLogger.middleware');
const rateLimiterMiddleware = require('./middleware/rateLimiter.middleware');
const domainRouter = require('./middleware/domainRouter.middleware');

const healthRoutes = require('./routes/health.routes');
const indexRoutes = require('./routes/index.routes');

const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Security
securityMiddleware(app);

// CORS
app.use(corsMiddleware);

// Body & Cookie Parsing
bodyParserMiddleware(app);

// Request Context
app.use(requestContext);

// Custom Domain Router
app.use(domainRouter);

// HTTP Request Logger
app.use(requestLoggerMiddleware);

// Rate Limiter
app.use(rateLimiterMiddleware);

// Root Endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to DeployX Backend",
    status: "running"
  });
});

// Health
app.use('/', healthRoutes);

// Feature Routes
app.use('/', indexRoutes);

// 404
app.use(notFound);

// Global Error Handler
app.use(errorHandler);

module.exports = app;