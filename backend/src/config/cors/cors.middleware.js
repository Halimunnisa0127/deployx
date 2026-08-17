const cors = require('cors');

const config = require('../env/env');

const allowedOrigins = [
  'http://localhost:5173',
  config.clientUrl,
].filter(Boolean);

const corsMiddleware = cors({
  origin: (origin, callback) => {
    // Allow requests without an Origin header.
    // Example: Postman or server-to-server requests.
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
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
});

module.exports = corsMiddleware;