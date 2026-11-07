const analysisService = require('../services/analysis.service');
const asyncHandler = require('../utils/asyncHandler');

const analyzeContent = asyncHandler(async (req, res) => {
  const analysis = await analysisService.analyzeContent(req.params.id, req.user);
  return res.status(200).json(analysis);
});

const updateIssueStatus = asyncHandler(async (req, res) => {
  const result = await analysisService.updateIssueStatus(
    req.params.id,
    req.params.issue_id,
    req.body.status
  );
  return res.status(200).json(result);
});

module.exports = {
  analyzeContent,
  updateIssueStatus,
};

