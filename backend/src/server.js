const http = require('http');
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
const mongoose = require('mongoose');
const app = require('./app');
const config = require('./config/env/env');
const logger = require('./config/logger/logger');
const connectDB = require('./database/connection/connectDB');

let server;

const startServer = async () => {
  await connectDB();

  server = http.createServer(app);

  server.listen(config.port, () => {
    logger.info(`Server listening on port ${config.port} in ${config.env} mode`);
  });
};

startServer();

// Graceful Shutdown
const shutdown = async (signal) => {
  logger.info(`Received ${signal}. Shutting down gracefully...`);
  
  if (server) {
    server.close(async () => {
      logger.info('HTTP server closed. Finishing active requests...');
      
      try {
        await mongoose.connection.close(false);
        logger.info('MongoDB connection closed.');
      } catch (err) {
        logger.error(`Error closing MongoDB connection: ${err.message}`);
      }
      
      logger.info('Flushing logger...');
      logger.flush();
      
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

process.on('unhandledRejection', (err) => {
  logger.fatal(`Unhandled Promise Rejection: ${err.message}`);
  shutdown('unhandledRejection');
});

process.on('uncaughtException', (err) => {
  logger.fatal(`Uncaught Exception: ${err.message}`);
  shutdown('uncaughtException');
});
