const dashboardService = require('../services/dashboard.service');
const asyncHandler = require('../utils/asyncHandler');

const getStats = asyncHandler(async (req, res) => {
  const stats = await dashboardService.getStats();
  return res.status(200).json(stats);
});

module.exports = {
  getStats,
};

