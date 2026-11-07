const guidelineService = require('../services/guideline.service');
const asyncHandler = require('../utils/asyncHandler');

const getGuidelines = asyncHandler(async (req, res) => {
  const guidelines = await guidelineService.getGuidelines(req.query);
  return res.status(200).json(guidelines);
});

const createGuideline = asyncHandler(async (req, res) => {
  const guideline = await guidelineService.createGuideline(req.body, req.user);
  return res.status(201).json(guideline);
});

const updateGuideline = asyncHandler(async (req, res) => {
  const guideline = await guidelineService.updateGuideline(req.params.id, req.body, req.user);
  return res.status(200).json(guideline);
});

const deleteGuideline = asyncHandler(async (req, res) => {
  const result = await guidelineService.deleteGuideline(req.params.id);
  return res.status(200).json(result);
});

const getAssets = asyncHandler(async (req, res) => {
  const assets = await guidelineService.getAssets();
  return res.status(200).json(assets);
});

const uploadAsset = asyncHandler(async (req, res) => {
  const assetData = {
    name: req.body.name || req.file?.originalname || 'Brand Asset',
    type: req.body.type || 'other',
    url: req.file ? `/uploads/${req.file.filename}` : req.body.url || null,
    fileSize: req.file?.size || 0,
    mimeType: req.file?.mimetype || null,
  };
  const asset = await guidelineService.createAsset(assetData, req.user);
  return res.status(201).json(asset);
});

const deleteAsset = asyncHandler(async (req, res) => {
  const result = await guidelineService.deleteAsset(req.params.id);
  return res.status(200).json(result);
});

module.exports = {
  getGuidelines,
  createGuideline,
  updateGuideline,
  deleteGuideline,
  getAssets,
  uploadAsset,
  deleteAsset,
};

