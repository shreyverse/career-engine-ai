export interface PromptInputProfile {
  careerStage: 'FRESHER' | 'PROFESSIONAL';
  targetRole: string;
  targetIndustry?: string;
  education?: any;
  currentCareer?: any;
  technicalSkills: Array<{ name: string; level: string }>;
  frameworks: Array<{ name: string; level: string }>;
  databases: Array<{ name: string; level: string }>;
  tools: Array<{ name: string; level: string }>;
  interests?: string[];
  careerGoal?: any;
  experience?: any;
  challenges?: any;
}

export function buildSystemInstruction(): string {
  return `You are Career Engine's AI Career Intelligence Engine.
Analyze a user's current career position against their stated career goal. Provide practical, realistic and prioritized recommendations.

CRITICAL RULES:
1. Do not invent qualifications, experience, projects, achievements or skills that the user did not provide.
2. Every strength and weakness MUST be rooted in the supplied data.
3. Recommendations must explain WHY (connect to user's target role and current baseline).
4. Clearly distinguish between concrete technologies (e.g. React, PostgreSQL, Docker) and broader knowledge areas (e.g. System Design, Data Structures, Networking).
5. Output strict valid JSON matching the exact schema requested. Do not include markdown code blocks, backticks, or conversational prefix/suffix text.`;
}

export function buildUserPrompt(profile: PromptInputProfile): string {
  return `User Profile Data for Career Intelligence Analysis:
${JSON.stringify(profile, null, 2)}

Provide a comprehensive career intelligence report analyzing the gap between where this person is today and their target role "${profile.targetRole}".
Return ONLY the JSON object with the following schema:
{
  "careerSummary": "string explaining current standing, target, and key factors",
  "currentLevel": "BEGINNER" | "EARLY" | "INTERMEDIATE" | "ADVANCED",
  "targetRole": "${profile.targetRole}",
  "strengths": ["string", "string"],
  "weaknesses": ["string", "string"],
  "skillGaps": [
    {
      "skill": "string",
      "currentLevel": "NONE" | "BEGINNER" | "BASIC" | "INTERMEDIATE" | "ADVANCED",
      "requiredLevel": "BEGINNER" | "BASIC" | "INTERMEDIATE" | "ADVANCED",
      "gap": "LOW" | "MEDIUM" | "HIGH",
      "priority": "LOW" | "MEDIUM" | "HIGH",
      "reason": "string explaining why"
    }
  ],
  "recommendedTechnologies": [
    {
      "technology": "string",
      "priority": "LOW" | "MEDIUM" | "HIGH",
      "reason": "string",
      "prerequisites": ["string"]
    }
  ],
  "knowledgeAreas": [
    {
      "topic": "string",
      "priority": "LOW" | "MEDIUM" | "HIGH",
      "reason": "string"
    }
  ],
  "recommendedProjects": [
    {
      "title": "string",
      "purpose": "string",
      "skills": ["string"],
      "difficulty": "BEGINNER" | "INTERMEDIATE" | "ADVANCED"
    }
  ],
  "nextActions": [
    {
      "title": "string",
      "description": "string",
      "priority": "LOW" | "MEDIUM" | "HIGH",
      "estimatedEffort": "e.g. 1-2 weeks"
    }
  ],
  "careerReadiness": {
    "overall": 75,
    "skills": 70,
    "experience": 65,
    "projects": 80,
    "careerAlignment": 75,
    "confidence": "LOW" | "MEDIUM" | "HIGH",
    "reasoning": "string"
  }
}`;
}
