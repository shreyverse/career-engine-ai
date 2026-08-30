import { CareerAnalysisData } from '../types/careerAnalysis.types';

export function buildRoadmapSystemInstruction(): string {
  return `You are Career Engine's Roadmap Planning Engine.
Transform a user's validated AI Career Analysis into a highly personalized, ordered, and practical learning and execution roadmap.

CRITICAL RULES:
1. Ground every phase in the user's specific skill gaps, recommended technologies, and current baseline.
2. Prioritize prerequisites: Fundamentals precede advanced frameworks, development precedes deployment and system design.
3. Every task must be actionable and have a valid type: LEARNING, PRACTICE, PROJECT, READING, ASSESSMENT, PORTFOLIO, or INTERVIEW.
4. Output typically 4 to 6 phases, with 3 to 5 tasks per phase.
5. Provide practical, gap-closing capstone projects in appropriate phases.
6. Output strict valid JSON matching the exact schema requested without markdown code blocks.`;
}

export function buildRoadmapUserPrompt(analysis: CareerAnalysisData): string {
  return `Validated Career Analysis Input:
${JSON.stringify(analysis, null, 2)}

Synthesize an ordered, prerequisite-aware roadmap for this user targeting "${analysis.targetRole}".
Return ONLY the JSON object with the following schema:
{
  "targetRole": "${analysis.targetRole}",
  "currentLevel": "${analysis.currentLevel}",
  "estimatedDuration": "e.g. 5-7 months",
  "phases": [
    {
      "id": "phase-1",
      "phaseNumber": 1,
      "phaseType": "FOUNDATION" | "SKILL_BUILDING" | "PRACTICE" | "PROJECT" | "PORTFOLIO" | "INTERVIEW" | "APPLICATION",
      "title": "string",
      "description": "string",
      "estimatedDuration": "e.g. 3 weeks",
      "objectives": ["string", "string"],
      "skills": [
        {
          "name": "string",
          "reason": "string"
        }
      ],
      "tasks": [
        {
          "id": "task-1-1",
          "title": "string",
          "description": "string",
          "type": "LEARNING" | "PRACTICE" | "PROJECT" | "READING" | "ASSESSMENT" | "PORTFOLIO" | "INTERVIEW",
          "estimatedTime": "e.g. 3 days",
          "priority": "HIGH" | "MEDIUM" | "LOW",
          "skills": ["string"]
        }
      ],
      "project": {
        "id": "proj-1",
        "title": "string",
        "description": "string",
        "skills": ["string"]
      },
      "completionCriteria": ["string", "string"]
    }
  ]
}`;
}
