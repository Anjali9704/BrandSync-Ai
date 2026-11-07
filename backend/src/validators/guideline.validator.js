const Joi = require('joi');
const { GUIDELINE_SECTIONS } = require('../constants');

const createGuidelineSchema = Joi.object({
  section: Joi.string().valid(...GUIDELINE_SECTIONS).required(),
  title: Joi.string().trim().min(2).max(200).required(),
  content: Joi.string().allow('').default(''),
  items: Joi.array().items(Joi.string().trim()).default([]),
});

const updateGuidelineSchema = Joi.object({
  section: Joi.string().valid(...GUIDELINE_SECTIONS),
  title: Joi.string().trim().min(2).max(200),
  content: Joi.string().allow(''),
  items: Joi.array().items(Joi.string().trim()),
}).min(1);

module.exports = {
  createGuidelineSchema,
  updateGuidelineSchema,
};

