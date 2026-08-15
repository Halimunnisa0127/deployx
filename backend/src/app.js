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
const requestContext = require('./middleware/requestContext');
const ApiResponse = require('./shared/responses/ApiResponse');

const app = express();

// 1. Helmet
app.use(
  helmet({
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
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

// 4. Express JSON with raw body capture for GitHub Webhooks
app.use(express.json({
  verify: (req, res, buf) => {
    if (req.originalUrl && req.originalUrl.includes('/integrations/github/webhook')) {
      req.rawBody = buf;
    }
  }
}));

// 5. URL Encoded Parser
app.use(express.urlencoded({ extended: true }));

// 6. Cookie Parser
app.use(cookieParser());

// 6.5 Request Context
app.use(requestContext);

// 6.6 Custom Domain Router
const domainRouter = require('./middleware/domainRouter.middleware');
app.use(domainRouter);

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
  skip: (req) => req.path === '/' || req.path === '/health' || req.path.startsWith('/deployments'),
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

const telemetry = require('./shared/utils/telemetry');
app.get('/health/ready', (req, res) => {
  const mongoReady = telemetry.isMongoReady();
  const redisReady = telemetry.isRedisReady();
  const isHealthy = mongoReady && redisReady;

  const responseBody = {
    success: isHealthy,
    status: isHealthy ? 'ready' : 'unavailable',
    services: {
      mongodb: mongoReady ? 'ready' : 'unavailable',
      redis: redisReady ? 'ready' : 'unavailable',
    },
    timestamp: new Date().toISOString(),
  };

  if (!isHealthy) {
    return res.status(503).json(responseBody);
  }
  return res.json(responseBody);
});


// 10. Feature Routes
const authRoutes = require('./modules/auth/routes/auth.routes');
const userRoutes = require('./modules/users/routes/user.routes');
const projectRoutes = require('./modules/projects/routes/project.routes');
const deploymentRoutes = require('./modules/deployments/routes/deployment.routes');
const domainRoutes = require('./modules/domains/routes/domain.routes');
const githubIntegration = require('./modules/integrations/github');
const googleIntegration = require('./modules/integrations/google');
const adminHealthRoutes = require('./modules/admin/routes/adminHealth.routes');
const adminUserRoutes = require('./modules/admin/routes/adminUser.routes');
const adminProjectRoutes = require('./modules/admin/routes/adminProject.routes');
const adminDeploymentRoutes = require('./modules/admin/routes/adminDeployment.routes');

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/projects', projectRoutes);
app.use('/deployments', deploymentRoutes);
app.use('/domains', domainRoutes);
app.use('/integrations/github', githubIntegration.routes);
app.use('/integrations/google', googleIntegration.routes);
app.use('/admin/health', adminHealthRoutes);
app.use('/admin/users', adminUserRoutes);
app.use('/admin/projects', adminProjectRoutes);
app.use('/admin/deployments', adminDeploymentRoutes);

// 11. 404 Handler
app.use(notFound);

// 11. Global Error Handler
app.use(errorHandler);

module.exports = app;
