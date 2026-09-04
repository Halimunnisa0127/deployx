const cors = require('cors');

const config = require('../env/env');

const allowedOrigins = [
  ...(config.allowedOrigins || []),
  config.clientUrl,
].filter(Boolean);

const corsMiddleware = function (req, res, next) {
  cors({
    origin: (origin, callback) => {
      // Allow requests without an Origin header.
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Check if the origin matches the host header (same-origin request, e.g. from Vite module scripts)
      const host = req.headers.host;
      if (host && origin.includes(host)) {
        return callback(null, true);
      }

      // Allow wildcard for configured base domain and local development to serve deployed apps smoothly
      const baseDomain = config.appBaseDomain || 'deployx.app';
      if (
        origin.endsWith(`.${baseDomain}`) ||
        origin.endsWith('.deployx.app') ||
        origin.includes('localhost') ||
        origin.includes('127.0.0.1')
      ) {
         return callback(null, true);
      }

      return callback(new Error('Not allowed by CORS'));
    },

    credentials: true,

    methods: [
      'GET',
      'POST',
      'PUT',
      'PATCH',
      'DELETE',
      'OPTIONS',
    ],

    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
    ],
  })(req, res, next);
};

module.exports = corsMiddleware;