const express = require('express');
const router = express.Router();
const contentController = require('../controllers/content.controller');
const analysisController = require('../controllers/analysis.controller');
const validate = require('../middlewares/validation.middleware');
const { verifyJWT } = require('../middlewares/auth.middleware');
const {
  createContentSchema,
  updateIssueStatusSchema,
} = require('../validators/content.validator');

router.use(verifyJWT);

router.post('/', validate(createContentSchema), contentController.createContent);
router.get('/', contentController.listContent);
router.get('/:id', contentController.getContentById);

// Content AI Analysis routes
router.post('/:id/analyze', analysisController.analyzeContent);
router.patch(
  '/:id/issues/:issue_id',
  validate(updateIssueStatusSchema),
  analysisController.updateIssueStatus
);

module.exports = router;

