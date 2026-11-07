const mongoose = require('mongoose');
const config = require('./environment');

let memoryServer = null;

const connectDB = async () => {
  try {
    const mongoUri = config.MONGODB_URI;
    console.log(`[DB] Attempting connection to MongoDB at: ${mongoUri}`);

    // Try connecting with a short timeout to handle when daemon isn't running
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 2500,
    });

    console.log(`[DB] MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (err) {
    console.warn(`[DB] Standalone MongoDB connection failed (${err.message}). Initializing embedded MongoDB Memory Server...`);
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      memoryServer = await MongoMemoryServer.create();
      const memUri = memoryServer.getUri();
      const conn = await mongoose.connect(memUri);
      console.log(`[DB] Embedded MongoDB Memory Server Connected: ${memUri}`);

      // Auto-run seeder on memory db startup so data is populated!
      const seedDatabase = require('../scripts/seedRunner');
      await seedDatabase();

      return conn;
    } catch (innerErr) {
      console.error('[DB] Critical: Failed to initialize MongoDB:', innerErr.message);
      process.exit(1);
    }
  }
};

const disconnectDB = async () => {
  await mongoose.disconnect();
  if (memoryServer) {
    await memoryServer.stop();
  }
};

module.exports = { connectDB, disconnectDB };

