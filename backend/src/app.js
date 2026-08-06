require('express-async-errors');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const pinoHttp = require('pino-http');
const rateLimit = require('express-rate-limit');
const fs = require('fs');
const path = require('path');

const config = require('./config/env/env');
const logger = require('./config/logger/logger');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');
const ApiResponse = require('./shared/responses/ApiResponse');

const app = express();

// 1. Helmet
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        // Configurable CSP here
      },
    },
  })
);

// 2. CORS
app.use(
  cors({
    origin: config.clientUrl,
    credentials: true,
  })
);

// 3. Compression
app.use(compression());

// 4. Express JSON
app.use(express.json());

// 5. URL Encoded Parser
app.use(express.urlencoded({ extended: true }));

// 6. Cookie Parser
app.use(cookieParser());

// 7. Pino HTTP Logger
app.use(
  pinoHttp({
    logger,
  })
);

// 8. Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  skip: (req) => req.path === '/' || req.path === '/health',
  message: ApiResponse.error('Too many requests, please try again later.', {}, 429),
});
app.use(limiter);

// 9. Health Routes
app.get('/', (req, res) => {
  res.json(ApiResponse.success('DeployX Backend API'));
});

app.get('/health', (req, res) => {
  let version = 'unknown';
  try {
    const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '../../package.json'), 'utf8'));
    version = pkg.version;
  } catch (err) {
    // Ignore error, version remains unknown
  }

  res.json({
    success: true,
    message: 'DeployX Backend Running',
    environment: config.env,
    version,
    uptime: Number(process.uptime().toFixed(2)),
    timestamp: new Date().toISOString(),
  });
});

// 10. Feature Routes
const authRoutes = require('./modules/auth/routes/auth.routes');
app.use('/auth', authRoutes);

// 11. 404 Handler
app.use(notFound);

// 11. Global Error Handler
app.use(errorHandler);

module.exports = app;
