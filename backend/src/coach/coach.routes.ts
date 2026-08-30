import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import {
  createConversation,
  getConversations,
  getConversationById,
  sendMessage,
  deleteConversation,
  getWeeklyPlan,
} from './coach.controller';

const router = Router();

router.use(authMiddleware);

router.post('/conversations', createConversation);
router.get('/conversations', getConversations);
router.get('/conversations/:id', getConversationById);
router.post('/conversations/:id/messages', sendMessage);
router.delete('/conversations/:id', deleteConversation);
router.get('/weekly-plan', getWeeklyPlan);

export default router;
