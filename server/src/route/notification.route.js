import { Router } from 'express';
import { verifyJwt } from '../middleware/auth.middleware.js';
import { deleteNotifications, deleteSingleNotification, getNotifications } from '../controller/notification.controller.js';

const router = Router();

router.route('/delete-notifications').delete(verifyJwt, deleteNotifications);

router.route('/delete-single-notification/:notificationId').delete(verifyJwt, deleteSingleNotification);

router.route('/get-notifications').get(verifyJwt, getNotifications);

export default router;