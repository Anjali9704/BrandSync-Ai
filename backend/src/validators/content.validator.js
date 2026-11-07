const Joi = require('joi');
const { CONTENT_TYPES, PLATFORMS } = require('../constants');

const createContentSchema = Joi.object({
  title: Joi.string().trim().min(3).max(200).required(),
  body: Joi.string().trim().min(10).required(),
  content_type: Joi.string().valid(...CONTENT_TYPES).default('social_post'),
  platform: Joi.string().valid(...PLATFORMS).default('linkedin'),
});

const updateIssueStatusSchema = Joi.object({
  status: Joi.string().valid('accepted', 'rejected', 'open').required(),
});

module.exports = {
  createContentSchema,
  updateIssueStatusSchema,
};

