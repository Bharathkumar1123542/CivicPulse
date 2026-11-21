import { Router, Request, Response } from 'express';
import { db } from '../db.js';

const router = Router();

// GET notifications for a user
router.get('/', (req: Request, res: Response) => {
  const { userId = 'user-citizen-1' } = req.query;
  const notifications = db.getNotificationsByUserId(userId as string);
  const unreadCount = notifications.filter((n) => !n.read).length;
  return res.json({ unreadCount, notifications });
});

// Mark single notification read
router.put('/:id/read', (req: Request, res: Response) => {
  const success = db.markNotificationAsRead(req.params.id);
  return res.json({ success });
});

// Mark all read for user
router.put('/read-all', (req: Request, res: Response) => {
  const { userId = 'user-citizen-1' } = req.body;
  const success = db.markAllNotificationsAsRead(userId);
  return res.json({ success });
});

export default router;
