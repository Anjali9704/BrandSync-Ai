const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const dashboardRoutes = require('./dashboard.routes');
const contentRoutes = require('./content.routes');
const guidelineRoutes = require('./guideline.routes');
const reviewRoutes = require('./review.routes');
const reportRoutes = require('./report.routes');
const teamRoutes = require('./team.routes');
const notificationRoutes = require('./notification.routes');

router.get('/', (req, res) => {
  res.status(200).json({
    status: 'online',
    service: 'BrandSync AI Governance Engine API v1',
    health: '/api/v1/health',
  });
});

router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'BrandSync AI Governance Engine',
    version: '1.0.0',
  });
});

router.use('/auth', authRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/content', contentRoutes);
router.use('/guidelines', guidelineRoutes);
router.use('/review', reviewRoutes);
router.use('/reports', reportRoutes);
router.use('/team', teamRoutes);
router.use('/notifications', notificationRoutes);

module.exports = router;
