const express = require('express');
const router = express.Router();
const multer = require('multer');
const guidelineController = require('../controllers/guideline.controller');
const validate = require('../middlewares/validation.middleware');
const { verifyJWT, authorizeRoles } = require('../middlewares/auth.middleware');
const { ROLES } = require('../constants');
const {
  createGuidelineSchema,
  updateGuidelineSchema,
} = require('../validators/guideline.validator');

const upload = multer({ limits: { fileSize: 10 * 1024 * 1024 } });

router.use(verifyJWT);

// Guidelines CRUD
router.get('/', guidelineController.getGuidelines);
router.post(
  '/',
  authorizeRoles(ROLES.ADMIN, ROLES.BRAND_MANAGER),
  validate(createGuidelineSchema),
  guidelineController.createGuideline
);
router.put(
  '/:id',
  authorizeRoles(ROLES.ADMIN, ROLES.BRAND_MANAGER),
  validate(updateGuidelineSchema),
  guidelineController.updateGuideline
);
router.delete(
  '/:id',
  authorizeRoles(ROLES.ADMIN, ROLES.BRAND_MANAGER),
  guidelineController.deleteGuideline
);

// Assets
router.get('/assets', guidelineController.getAssets);
router.post('/assets', upload.single('file'), guidelineController.uploadAsset);
router.delete('/assets/:id', guidelineController.deleteAsset);

module.exports = router;

