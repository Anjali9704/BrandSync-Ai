const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notification.controller');
const { verifyJWT } = require('../middlewares/auth.middleware');

router.use(verifyJWT);

router.get('/', notificationController.getNotifications);
router.patch('/read-all', notificationController.markAllAsRead);
router.patch('/:id/read', notificationController.markAsRead);
router.delete('/:id', notificationController.deleteNotification);

module.exports = router;

