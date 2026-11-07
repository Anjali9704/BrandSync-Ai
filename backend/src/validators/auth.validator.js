const Joi = require('joi');
const { ROLES } = require('../constants');

const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  email: Joi.string().email().trim().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid(...Object.values(ROLES)).default(ROLES.CONTENT_CREATOR),
  organisation: Joi.string().trim().default('BrandSync AI'),
});

const loginSchema = Joi.object({
  email: Joi.string().email().trim().required(),
  password: Joi.string().required(),
});

const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().trim().required(),
});

module.exports = {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
};

