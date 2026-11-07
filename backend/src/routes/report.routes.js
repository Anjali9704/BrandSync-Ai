const express = require('express');
const router = express.Router();
const reportController = require('../controllers/report.controller');
const { verifyJWT, authorizeRoles } = require('../middlewares/auth.middleware');
const { ROLES } = require('../constants');

router.use(verifyJWT);

router.get(
  '/summary',
  authorizeRoles(ROLES.ADMIN, ROLES.BRAND_MANAGER),
  reportController.getSummary
);

module.exports = router;

