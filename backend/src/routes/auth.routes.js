const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const validate = require('../middlewares/validation.middleware');
const { verifyJWT } = require('../middlewares/auth.middleware');
const {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
} = require('../validators/auth.validator');

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post('/forgot-password', validate(forgotPasswordSchema), authController.forgotPassword);
router.get('/me', verifyJWT, authController.getMe);
router.put('/profile', verifyJWT, authController.updateProfile);
router.put('/change-password', verifyJWT, authController.changePassword);
router.put('/preferences', verifyJWT, authController.updatePreferences);

module.exports = router;
