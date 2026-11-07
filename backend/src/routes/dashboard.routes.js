const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const { verifyJWT } = require('../middlewares/auth.middleware');

router.get('/stats', verifyJWT, dashboardController.getStats);

module.exports = router;

