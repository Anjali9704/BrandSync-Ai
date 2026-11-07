const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/review.controller');
const validate = require('../middlewares/validation.middleware');
const { verifyJWT, authorizeRoles } = require('../middlewares/auth.middleware');
const { ROLES } = require('../constants');
const { submitReviewSchema } = require('../validators/review.validator');

router.use(verifyJWT);

router.get(
  '/',
  authorizeRoles(ROLES.ADMIN, ROLES.BRAND_MANAGER, ROLES.REVIEWER),
  reviewController.getQueue
);
router.post(
  '/:content_id',
  validate(submitReviewSchema),
  reviewController.submitReview
);
router.get('/:content_id/history', reviewController.getHistory);

module.exports = router;

