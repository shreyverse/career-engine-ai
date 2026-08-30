import { GoogleGenAI } from '@google/genai';
import { env } from '../config/env';
import { db } from '../config/database';
import { CoachContextBuilder } from './coach.context';
import { CoachPromptBuilder } from './coach.prompt';
import { CoachGuardrails } from './coach.guardrails';
import {
  CoachConversation,
  CoachMessage,
  CoachStructuredResponse,
  WeeklyPlan,
  WeeklyPlanTask,
} from '../types/coach.types';

export class CoachService {
  private static ai = env.geminiApiKey
    ? new GoogleGenAI({ apiKey: env.geminiApiKey })
    : null;

  public static async createConversation(
    userId: string,
    title?: string,
    initialMessage?: string
  ): Promise<CoachConversation> {
    const id = 'conv-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6);
    const now = new Date().toISOString();
    const derivedTitle = title || (initialMessage ? this.generateDeterministicTitle(initialMessage) : 'New Career Consultation');

    const conv: CoachConversation = {
      id,
      userId,
      title: derivedTitle,
      createdAt: now,
      updatedAt: now,
      messages: [],
    };

    db.saveCoachConversation(conv);

    if (initialMessage) {
      await this.sendMessage(userId, id, initialMessage);
      const refreshed = db.getCoachConversationById(id);
      if (refreshed) return refreshed;
    }

    return conv;
  }

  public static async getConversations(userId: string): Promise<CoachConversation[]> {
    return db.getUserCoachConversations(userId);
  }

  public static async getConversationById(userId: string, conversationId: string): Promise<CoachConversation | null> {
    const conv = db.getCoachConversationById(conversationId);
    if (!conv || conv.userId !== userId) return null;
    return conv;
  }

  public static async deleteConversation(userId: string, conversationId: string): Promise<boolean> {
    const conv = db.getCoachConversationById(conversationId);
    if (!conv || conv.userId !== userId) return false;
    return db.deleteCoachConversation(conversationId);
  }

  public static async sendMessage(
    userId: string,
    conversationId: string,
    userMessageText: string
  ): Promise<{ userMessage: CoachMessage; assistantMessage: CoachMessage }> {
    const conv = db.getCoachConversationById(conversationId);
    if (!conv || conv.userId !== userId) {
      throw new Error('Conversation not found or unauthorized.');
    }

    const cleanText = CoachGuardrails.sanitizeUserInput(userMessageText);
    const safety = CoachGuardrails.checkSafetyAndCompliance(cleanText);

    // Save User message
    const userMsgId = 'msg-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6);
    const now = new Date().toISOString();
    const userMessage: CoachMessage = {
      id: userMsgId,
      conversationId,
      role: 'USER',
      content: cleanText,
      createdAt: now,
    };
    db.saveCoachMessage(userMessage);

    // Build Context
    const context = await CoachContextBuilder.buildContext(userId);
    const systemPrompt = CoachPromptBuilder.buildSystemPrompt(context);

    let structuredResponse: CoachStructuredResponse;

    if (safety.warning) {
      structuredResponse = {
        message: safety.warning,
        suggestedFollowUps: ['What should I focus on this week?', 'Explain my biggest skill gap.'],
      };
    } else {
      // Generate AI Response
      try {
        structuredResponse = await this.callGeminiCoach(systemPrompt, cleanText, conv.messages || []);
      } catch (err) {
        structuredResponse = this.generateFallbackResponse(cleanText, context);
      }
    }

    // Save Assistant message
    const assistantMsgId = 'msg-' + (Date.now() + 1) + '-' + Math.random().toString(36).substr(2, 6);
    const assistantMessage: CoachMessage = {
      id: assistantMsgId,
      conversationId,
      role: 'ASSISTANT',
      content: structuredResponse.message,
      actions: structuredResponse.actions,
      references: structuredResponse.references,
      suggestedFollowUps: structuredResponse.suggestedFollowUps,
      createdAt: new Date().toISOString(),
    };
    db.saveCoachMessage(assistantMessage);

    // Update conversation updatedAt
    db.touchCoachConversation(conversationId);

    return { userMessage, assistantMessage };
  }

  public static async getWeeklyPlan(userId: string): Promise<WeeklyPlan> {
    const roadmapRecord = await db.getRoadmap(userId);
    if (!roadmapRecord || !roadmapRecord.roadmapData?.phases) {
      return {
        totalTasks: 0,
        completedTasks: 0,
        progressPercentage: 0,
        activePhaseTitle: 'No Active Roadmap',
        activePhaseNumber: 0,
        tasks: [],
      };
    }

    const phases = roadmapRecord.roadmapData.phases;
    const taskStatusMap = await db.getUserTaskProgressMap(userId, roadmapRecord.id);

    let activePhase = phases[0];
    let selectedTasks: WeeklyPlanTask[] = [];
    let totalWeeklyTasks = 0;
    let completedWeeklyTasks = 0;

    // Find the active phase with incomplete tasks
    for (const phase of phases) {
      const incompleteInPhase = phase.tasks.filter(
        (t) => taskStatusMap.get(t.id) !== 'COMPLETED' && !t.completed
      );
      if (incompleteInPhase.length > 0 || phase === phases[phases.length - 1]) {
        activePhase = phase;
        break;
      }
    }

    // Select 3 to 6 tasks from active phase
    const candidateTasks = activePhase.tasks.slice(0, 6);
    for (const t of candidateTasks) {
      totalWeeklyTasks++;
      const isComp = taskStatusMap.get(t.id) === 'COMPLETED' || t.completed || false;
      if (isComp) completedWeeklyTasks++;
      selectedTasks.push({
        taskId: t.id,
        title: t.title,
        description: t.description,
        priority: t.priority || 'HIGH',
        estimatedTime: t.estimatedTime || '2-3 days',
        completed: isComp,
        skills: t.skills || [],
        phaseTitle: activePhase.title,
      });
    }

    const progressPercentage = totalWeeklyTasks > 0
      ? Math.round((completedWeeklyTasks / totalWeeklyTasks) * 100)
      : 0;

    return {
      totalTasks: totalWeeklyTasks,
      completedTasks: completedWeeklyTasks,
      progressPercentage,
      activePhaseTitle: activePhase.title,
      activePhaseNumber: activePhase.phaseNumber,
      tasks: selectedTasks,
    };
  }

  private static async callGeminiCoach(
    systemPrompt: string,
    userText: string,
    recentMessages: CoachMessage[]
  ): Promise<CoachStructuredResponse> {
    if (!this.ai) {
      throw new Error('Gemini API client not initialized.');
    }

    const formattedHistory = recentMessages.slice(-6).map((m) => ({
      role: m.role === 'USER' ? 'user' : 'model',
      parts: [{ text: m.content }],
    }));

    const response = await this.ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        ...formattedHistory,
        { role: 'user', parts: [{ text: userText }] },
      ],
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        temperature: 0.3,
      },
    });

    const text = response.text?.trim() || '{}';
    return JSON.parse(text);
  }

    private static generateFallbackResponse(userText: string, context: any): CoachStructuredResponse {
    const lower = userText.toLowerCase().trim();
    const targetRole = context.careerTarget?.targetRole || 'Software Engineer';
    const nextTask = context.roadmap?.nextTask;
    const topGap = context.careerAnalysis?.skillGaps?.[0]?.skill || 'System Architecture';

    // Check if the user message is off-topic or unrelated
    if (!CoachGuardrails.isCareerRelated(lower)) {
      return {
        message: "Sorry, I am your Career Intelligence Coach specifically trained to assist with tech career development, skill gap closing, roadmaps, and resume preparation. I couldn't understand or connect your message to your career journey.\n\nHow can I help you with your career goals, target skills, or roadmap tasks today?",
        actions: [
          {
            title: 'Open Career Roadmap',
            reason: 'View current milestones for ' + targetRole,
            actionUrl: '/career-path',
            actionType: 'OPEN_ROADMAP',
          },
          {
            title: 'Analyze Skill Gaps',
            reason: 'Check verified strengths and focus areas',
            actionUrl: '/skills',
            actionType: 'OPEN_SKILLS',
          },
        ],
        suggestedFollowUps: [
          'What should I focus on this week?',
          'Explain my biggest skill gap for ' + targetRole,
          'How can I improve my resume for this role?',
        ],
      };
    }

    if (lower.includes('week') || lower.includes('focus') || lower.includes('priority')) {
      return {
        message: nextTask
          ? `Your highest priority this week is **${nextTask.title}** in your ${context.roadmap?.activePhaseTitle || 'active phase'}. Completing this directly targets your **${targetRole}** roadmap milestones.`
          : `Focus on mastering **${topGap}** to close your primary skill gap for **${targetRole}**. Build a small prototype demonstrating this capability.`,
        actions: [
          {
            title: nextTask ? 'Continue Roadmap Task' : 'Open Roadmap',
            reason: 'High-priority task in your active learning phase.',
            actionUrl: '/career-path',
            actionType: 'OPEN_ROADMAP',
          },
        ],
        references: nextTask ? [{ type: 'ROADMAP_TASK', id: nextTask.id, label: nextTask.title }] : [],
        suggestedFollowUps: [
          'What should I know before starting this task?',
          'How can I test my understanding of this skill?',
        ],
      };
    }

    if (lower.includes('resume') || lower.includes('ats')) {
      const atsScore = context.ats?.score;
      return {
        message: atsScore
          ? `Your latest ATS score is **${atsScore}/100**. Focus on demonstrating hands-on architectural experience in your bullet points rather than generic responsibility statements.`
          : `To maximize your resume impact for **${targetRole}**, emphasize quantifiable outcomes, live repository links, and specific technologies from your career assessment.`,
        actions: [
          {
            title: 'Run ATS Compatibility Check',
            reason: 'Check resume alignment against your target role.',
            actionUrl: '/resume/ats',
            actionType: 'OPEN_ATS',
          },
        ],
        suggestedFollowUps: [
          'How do I rewrite weak bullet points?',
          'Which missing skills should I prioritize on my resume?',
        ],
      };
    }

    return {
      message: `For your target role of **${targetRole}**, prioritize closing high-value architectural gaps like **${topGap}**. Follow your active roadmap sequence to ensure all technical prerequisites are met before building larger multi-tier systems.`,
      actions: [
        {
          title: 'Review Active Skill Gaps',
          reason: 'Check high-priority areas mapped from your assessment.',
          actionUrl: '/skills',
          actionType: 'OPEN_SKILLS',
        },
      ],
      suggestedFollowUps: [
        'What should I focus on this week?',
        'How can I improve my resume for this role?',
      ],
    };
  }

  private static generateDeterministicTitle(message: string): string {
    const clean = message.replace(/[^a-zA-Z0-9 ]/g, '').trim();
    const words = clean.split(/\s+/).slice(0, 5).join(' ');
    return words.charAt(0).toUpperCase() + words.slice(1) || 'Career Inquiry';
  }
}
