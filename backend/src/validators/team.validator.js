const Joi = require('joi');
const { ROLES } = require('../constants');

const inviteMemberSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  email: Joi.string().email().trim().required(),
  role: Joi.string().valid(...Object.values(ROLES)).required(),
  organisation: Joi.string().trim().default('BrandSync AI'),
});

const updateMemberSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100),
  role: Joi.string().valid(...Object.values(ROLES)),
  status: Joi.string().valid('active', 'inactive'),
}).min(1);

module.exports = {
  inviteMemberSchema,
  updateMemberSchema,
};

