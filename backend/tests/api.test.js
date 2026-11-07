const { connectDB, disconnectDB } = require('../src/config/db');
const authService = require('../src/services/auth.service');
const guidelineService = require('../src/services/guideline.service');
const dashboardService = require('../src/services/dashboard.service');

async function testBackend() {
  console.log('--- Starting Backend Verification Tests ---');
  try {
    await connectDB();
    console.log('✓ Database connection established.');

    // 1. Test Login
    const loginRes = await authService.login('admin@brandsync.ai', 'Pass@123');
    if (!loginRes.access_token || loginRes.user.email !== 'admin@brandsync.ai') {
      throw new Error('Login verification failed');
    }
    console.log('✓ Auth Service: Admin login succeeded, JWT issued.');

    // 2. Test Guidelines
    const guidelines = await guidelineService.getGuidelines({});
    if (!Array.isArray(guidelines) || guidelines.length === 0) {
      throw new Error('Guidelines retrieval failed');
    }
    console.log(`✓ Guideline Service: Fetched ${guidelines.length} guidelines.`);

    // 3. Test Dashboard Stats
    const stats = await dashboardService.getStats();
    if (!stats.total_submitted || !stats.activity) {
      throw new Error('Dashboard stats verification failed');
    }
    console.log('✓ Dashboard Service: Statistics aggregated successfully.');

    console.log('--- All Backend Tests Passed Cleanly (100%) ---');
    await disconnectDB();
    process.exit(0);
  } catch (err) {
    console.error('✗ Backend verification test failed:', err);
    process.exit(1);
  }
}

testBackend();

