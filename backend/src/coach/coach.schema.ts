import { z } from 'zod';

export const createConversationSchema = z.object({
  title: z.string().min(1).max(120).optional(),
  initialMessage: z.string().min(1).max(3000).optional(),
});

export const sendMessageSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty').max(3000, 'Message is too long'),
});

export const coachStructuredResponseSchema = z.object({
  message: z.string(),
  actions: z
    .array(
      z.object({
        title: z.string(),
        reason: z.string(),
        actionUrl: z.string().optional(),
        actionType: z
          .enum([
            'OPEN_TASK',
            'OPEN_ROADMAP',
            'OPEN_RESUME',
            'OPEN_ATS',
            'OPEN_SKILLS',
            'OPEN_SETTINGS',
          ])
          .optional(),
      })
    )
    .optional(),
  references: z
    .array(
      z.object({
        type: z.enum([
          'ROADMAP_TASK',
          'SKILL',
          'RESUME',
          'ATS',
          'CAREER_ANALYSIS',
        ]),
        id: z.string(),
        label: z.string().optional(),
      })
    )
    .optional(),
  suggestedFollowUps: z.array(z.string()).optional(),
});
