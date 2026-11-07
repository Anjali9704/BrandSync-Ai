const app = require('./app');
const config = require('./config/environment');
const { connectDB } = require('./config/db');

const startServer = async () => {
  try {
    await connectDB();

    const server = app.listen(config.PORT, () => {
      console.log(`[BrandSync AI Backend] Running in ${config.NODE_ENV} mode on port ${config.PORT}`);
      console.log(`[CORS] Allowing origins: ${config.FRONTEND_URL}, http://localhost:5173`);
      console.log(`[Healthcheck] Available at http://localhost:${config.PORT}/api/v1/health`);
    });

    const shutdown = async () => {
      console.log('\n[BrandSync AI Backend] Gracefully shutting down...');
      server.close(() => {
        console.log('[BrandSync AI Backend] Closed remaining active connections.');
        process.exit(0);
      });
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (error) {
    console.error('[BrandSync AI Backend] Startup failure:', error.message);
    process.exit(1);
  }
};

startServer();

