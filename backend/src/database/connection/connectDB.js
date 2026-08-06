const mongoose = require("mongoose");
const config = require("../../config/env/env");
const logger = require("../../config/logger/logger");

const connectDB = async () => {
  try {
    // Disable autoIndex in production for better performance
    if (config.env === "production") {
      mongoose.set("autoIndex", false);
    }

    const conn = await mongoose.connect(config.mongoUri);

    logger.info(`✅ MongoDB Connected: ${conn.connection.host}`);

    mongoose.connection.on("error", (err) => {
      logger.error(`MongoDB Error: ${err.message}`);
    });

    mongoose.connection.on("disconnected", () => {
      logger.warn("⚠️ MongoDB Disconnected");
    });

    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      logger.info("MongoDB connection closed");
      process.exit(0);
    });
  } catch (error) {
    logger.fatal(`❌ MongoDB Connection Failed: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;