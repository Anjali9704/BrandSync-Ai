const reviewService = require('../services/review.service');
const asyncHandler = require('../utils/asyncHandler');

const getQueue = asyncHandler(async (req, res) => {
  const queue = await reviewService.getQueue(req.query.status);
  return res.status(200).json(queue);
});

const submitReview = asyncHandler(async (req, res) => {
  const result = await reviewService.submitReview(req.params.content_id, req.body, req.user);
  return res.status(200).json(result);
});

const getHistory = asyncHandler(async (req, res) => {
  const history = await reviewService.getHistory(req.params.content_id);
  return res.status(200).json(history);
});

module.exports = {
  getQueue,
  submitReview,
  getHistory,
};

