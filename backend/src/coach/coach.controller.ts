import { Request, Response } from 'express';
import { CoachService } from './coach.service';
import { createConversationSchema, sendMessageSchema } from './coach.schema';

export const createConversation = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.userId;
    const parsed = createConversationSchema.parse(req.body || {});
    const conv = await CoachService.createConversation(userId, parsed.title, parsed.initialMessage);
    res.status(201).json({
      success: true,
      data: conv,
      meta: { timestamp: new Date().toISOString() },
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      error: { code: 'CONVERSATION_CREATE_FAILED', message: err.message },
    });
  }
};

export const getConversations = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.userId;
    const list = await CoachService.getConversations(userId);
    res.status(200).json({
      success: true,
      data: list,
      meta: { timestamp: new Date().toISOString() },
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: { code: 'CONVERSATIONS_FETCH_FAILED', message: err.message },
    });
  }
};

export const getConversationById = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.userId;
    const id = req.params.id as string;
    const conv = await CoachService.getConversationById(userId, id);
    if (!conv) {
      res.status(404).json({
        success: false,
        error: { code: 'CONVERSATION_NOT_FOUND', message: 'Conversation not found.' },
      });
      return;
    }
    res.status(200).json({
      success: true,
      data: conv,
      meta: { timestamp: new Date().toISOString() },
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: { code: 'CONVERSATION_FETCH_FAILED', message: err.message },
    });
  }
};

export const sendMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.userId;
    const id = req.params.id as string;
    const parsed = sendMessageSchema.parse(req.body);
    const result = await CoachService.sendMessage(userId, id, parsed.message);
    res.status(200).json({
      success: true,
      data: result,
      meta: { timestamp: new Date().toISOString() },
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      error: { code: 'MESSAGE_SEND_FAILED', message: err.message },
    });
  }
};

export const deleteConversation = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.userId;
    const id = req.params.id as string;
    const ok = await CoachService.deleteConversation(userId, id);
    if (!ok) {
      res.status(404).json({
        success: false,
        error: { code: 'CONVERSATION_NOT_FOUND', message: 'Conversation not found.' },
      });
      return;
    }
    res.status(200).json({
      success: true,
      data: { deleted: true },
      meta: { timestamp: new Date().toISOString() },
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: { code: 'CONVERSATION_DELETE_FAILED', message: err.message },
    });
  }
};

export const getWeeklyPlan = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.userId;
    const plan = await CoachService.getWeeklyPlan(userId);
    res.status(200).json({
      success: true,
      data: plan,
      meta: { timestamp: new Date().toISOString() },
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: { code: 'WEEKLY_PLAN_FETCH_FAILED', message: err.message },
    });
  }
};
