const contentService = require('../services/content.service');
const asyncHandler = require('../utils/asyncHandler');

const createContent = asyncHandler(async (req, res) => {
  const content = await contentService.createContent(req.body, req.user);
  return res.status(201).json(content);
});

const listContent = asyncHandler(async (req, res) => {
  const result = await contentService.listContent(req.query);
  return res.status(200).json(result);
});

const getContentById = asyncHandler(async (req, res) => {
  const content = await contentService.getContentById(req.params.id);
  return res.status(200).json(content);
});

module.exports = {
  createContent,
  listContent,
  getContentById,
};

