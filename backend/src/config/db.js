const mongoose = require('mongoose');
const config = require('./environment');

let memoryServer = null;

const connectDB = async () => {
  // If already connected, reuse existing connection (crucial for Serverless cold/warm starts)
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  try {
    const mongoUri = config.MONGODB_URI;
    const maskedUri = typeof mongoUri === 'string' && mongoUri.includes('@')
      ? mongoUri.replace(/:([^:@]+)@/, ':****@')
      : mongoUri;
    console.log(`[DB] Attempting connection to MongoDB at: ${maskedUri}`);

    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 8000,
    });

    console.log(`[DB] MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (err) {
    console.warn(`[DB] MongoDB connection failed: ${err.message}`);

    // Never attempt MongoMemoryServer in production or serverless environments (it will timeout/crash)
    if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
      throw new Error(`Database connection failed: ${err.message}. Please verify MONGODB_URI in Vercel.`);
    }

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
      throw innerErr;
    }
  }
};

const disconnectDB = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  if (memoryServer) {
    await memoryServer.stop();
  }
};

module.exports = { connectDB, disconnectDB };

