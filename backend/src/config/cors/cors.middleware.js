const cors = require('cors');

const config = require('../env/env');

const allowedOrigins = [
  'http://localhost:5173',
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

      // Allow wildcard for deployx domains to serve deployed apps smoothly
      // Using simple string matching to allow deployed apps (e.g. *.deployx.app)
      if (origin.endsWith('.deployx.app') || origin.endsWith('localhost:5000')) {
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