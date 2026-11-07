const Joi = require('joi');

const submitReviewSchema = Joi.object({
  decision: Joi.string().valid('approved', 'rejected', 'changes_requested', 'pending').required(),
  comment: Joi.string().allow('').default(''),
  final_text: Joi.string().allow(null, '').optional(),
});

module.exports = {
  submitReviewSchema,
};

