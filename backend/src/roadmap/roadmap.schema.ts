import { z } from 'zod';

export const PhaseTypeEnum = z.enum([
  'FOUNDATION',
  'SKILL_BUILDING',
  'PRACTICE',
  'PROJECT',
  'PORTFOLIO',
  'INTERVIEW',
  'APPLICATION',
]);

export const TaskTypeEnum = z.enum([
  'LEARNING',
  'PRACTICE',
  'PROJECT',
  'READING',
  'ASSESSMENT',
  'PORTFOLIO',
  'INTERVIEW',
]);

export const TaskPriorityEnum = z.enum(['LOW', 'MEDIUM', 'HIGH']);

export const RoadmapTaskItemSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  type: TaskTypeEnum,
  estimatedTime: z.string().min(1),
  priority: TaskPriorityEnum,
  skills: z.array(z.string()).default([]),
  prerequisites: z.array(z.string()).optional(),
});

export const RoadmapProjectItemSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  skills: z.array(z.string()).default([]),
});

export const RoadmapPhaseSkillSchema = z.object({
  name: z.string().min(1),
  reason: z.string().min(1),
});

export const RoadmapPhaseItemSchema = z.object({
  id: z.string().min(1),
  phaseNumber: z.number().int().min(1),
  phaseType: PhaseTypeEnum,
  title: z.string().min(1),
  description: z.string().min(1),
  estimatedDuration: z.string().min(1),
  objectives: z.array(z.string()).min(1),
  skills: z.array(RoadmapPhaseSkillSchema).min(1),
  tasks: z.array(RoadmapTaskItemSchema).min(1),
  project: RoadmapProjectItemSchema.optional(),
  completionCriteria: z.array(z.string()).min(1),
});

export const RoadmapDataSchema = z.object({
  targetRole: z.string().min(1),
  currentLevel: z.string().min(1),
  estimatedDuration: z.string().min(1),
  phases: z.array(RoadmapPhaseItemSchema).min(1),
});

export function validateRoadmapBusinessRules(roadmap: z.infer<typeof RoadmapDataSchema>): void {
  const phaseIds = new Set<string>();
  const taskIds = new Set<string>();

  for (const phase of roadmap.phases) {
    if (phaseIds.has(phase.id)) {
      throw new Error(`Duplicate phase ID detected: ${phase.id}`);
    }
    phaseIds.add(phase.id);

    for (const task of phase.tasks) {
      if (taskIds.has(task.id)) {
        throw new Error(`Duplicate task ID detected: ${task.id}`);
      }
      taskIds.add(task.id);
    }
  }
}
