const { connectDB, disconnectDB } = require('../config/db');
const seedDatabase = require('./seedRunner');

async function run() {
  try {
    await connectDB();
    await seedDatabase();
    console.log('Seeding completed successfully.');
    await disconnectDB();
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

run();

