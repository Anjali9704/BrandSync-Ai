const reportService = require('../services/report.service');
const asyncHandler = require('../utils/asyncHandler');

const getSummary = asyncHandler(async (req, res) => {
  const summary = await reportService.getSummary(req.query);
  return res.status(200).json(summary);
});

module.exports = {
  getSummary,
};

