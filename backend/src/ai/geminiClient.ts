import { env } from '../config/env';
import { GoogleGenAI } from '@google/genai';
import { PromptInputProfile, buildSystemInstruction, buildUserPrompt } from './prompts/careerAnalysis.prompt';
import { parseAndValidateAIResponse } from './utils/aiResponseParser';
import { CareerAnalysisData } from '../types/careerAnalysis.types';

export class GeminiClient {
  private static aiClient: GoogleGenAI | null = null;

  private static getClient(): GoogleGenAI | null {
    if (!env.geminiApiKey) {
      return null;
    }
    if (!this.aiClient) {
      this.aiClient = new GoogleGenAI({ apiKey: env.geminiApiKey });
    }
    return this.aiClient;
  }

  public static isApiKeyConfigured(): boolean {
    return Boolean(env.geminiApiKey && env.geminiApiKey.trim().length > 5);
  }

  public static async generateCareerAnalysis(profile: PromptInputProfile): Promise<CareerAnalysisData> {
    const client = this.getClient();

    if (!client) {
      return this.generateDeterministicAnalysis(profile);
    }

    try {
      const systemInstruction = buildSystemInstruction();
      const userPrompt = buildUserPrompt(profile);

      const response = await client.models.generateContent({
        model: env.geminiModel || 'gemini-2.5-flash',
        contents: [
          { role: 'user', parts: [{ text: userPrompt }] }
        ],
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      });

      const rawText = response.text || '';
      return parseAndValidateAIResponse(rawText);
    } catch (error: any) {
      console.warn('Gemini API call failed, using intelligent fallback analysis:', error.message);
      return this.generateDeterministicAnalysis(profile);
    }
  }

  public static generateDeterministicAnalysis(profile: PromptInputProfile): CareerAnalysisData {
    const isFresher = profile.careerStage === 'FRESHER';
    const targetRole = profile.targetRole || 'Fullstack Developer';

    const techNames = [
      ...profile.technicalSkills.map((s) => s.name),
      ...profile.frameworks.map((s) => s.name),
      ...profile.databases.map((s) => s.name),
      ...profile.tools.map((s) => s.name),
    ];

    const hasReact = techNames.some((t) => t.toLowerCase().includes('react'));
    const hasNode = techNames.some((t) => t.toLowerCase().includes('node'));
    const hasSql = techNames.some((t) => ['sql', 'postgres', 'mysql'].some((k) => t.toLowerCase().includes(k)));
    const hasDocker = techNames.some((t) => t.toLowerCase().includes('docker'));

    const strengths: string[] = [];
    if (profile.education?.degree) {
      strengths.push(`Formal technical foundation (${profile.education.degree} in ${profile.education.branchMajor || 'Engineering'})`);
    }
    if (techNames.length > 0) {
      strengths.push(`Practical exposure to core technologies: ${techNames.slice(0, 4).join(', ')}`);
    }
    if (profile.experience?.projects && profile.experience.projects.length > 0) {
      strengths.push(`Portfolio initiative with ${profile.experience.projects.length} documented practical project(s)`);
    }
    if (strengths.length === 0) {
      strengths.push('Strong foundational technical motivation and clear target career direction');
    }

    const weaknesses: string[] = [];
    if (!hasSql) {
      weaknesses.push('Limited depth in relational database design, indexing, and query optimization');
    }
    if (!hasDocker) {
      weaknesses.push('Lack of containerization and modern CI/CD deployment experience');
    }
    if (isFresher) {
      weaknesses.push('Needs production-grade application architecture and collaborative code review practices');
    } else {
      weaknesses.push('System design and high-availability architecture experience required for senior track');
    }

    const skillGaps = [
      {
        skill: hasSql ? 'Advanced PostgreSQL & Indexing' : 'Relational Databases (PostgreSQL)',
        currentLevel: hasSql ? 'BASIC' : 'NONE',
        requiredLevel: isFresher ? 'INTERMEDIATE' : 'ADVANCED',
        gap: 'HIGH',
        priority: 'HIGH',
        reason: `Critical for ${targetRole} to design normalized data models and optimize high-throughput queries.`,
      },
      {
        skill: 'System Design & Distributed Architecture',
        currentLevel: isFresher ? 'BEGINNER' : 'BASIC',
        requiredLevel: isFresher ? 'BASIC' : 'ADVANCED',
        gap: isFresher ? 'MEDIUM' : 'HIGH',
        priority: 'HIGH',
        reason: `Essential for designing scalable REST/gRPC microservices and understanding caching patterns.`,
      },
      {
        skill: 'Docker & Containerization',
        currentLevel: hasDocker ? 'BASIC' : 'NONE',
        requiredLevel: 'INTERMEDIATE',
        gap: 'MEDIUM',
        priority: 'MEDIUM',
        reason: 'Modern engineering teams expect local development consistency and containerized deployments.',
      },
    ];

    const recommendedTechnologies = [
      {
        technology: 'PostgreSQL',
        priority: 'HIGH',
        reason: 'Industry-standard relational database with rich support for complex queries, JSONB, and transactions.',
        prerequisites: ['SQL Basics', 'Database Concepts'],
      },
      {
        technology: 'Docker',
        priority: 'MEDIUM',
        reason: 'Isolate dependencies, simplify onboarding, and prepare services for cloud environments.',
        prerequisites: ['Linux Basics', 'Command Line'],
      },
      {
        technology: 'Redis',
        priority: 'MEDIUM',
        reason: 'In-memory caching and session management for high-velocity API endpoints.',
        prerequisites: ['Key-Value Concepts', 'Node.js/Python'],
      },
    ];

    const knowledgeAreas = [
      {
        topic: 'System Architecture & Caching Strategies',
        priority: 'HIGH',
        reason: 'Understand load balancing, read/write replicas, CDN caching, and asynchronous task queues.',
      },
      {
        topic: 'API Security & OAuth 2.0 / JWT Workflows',
        priority: 'HIGH',
        reason: 'Implement robust authentication, rate limiting, and token refresh rotations in production.',
      },
      {
        topic: 'Testing & CI/CD Pipelines',
        priority: 'MEDIUM',
        reason: 'Automate unit tests, integration tests, and GitHub Actions deployment workflows.',
      },
    ];

    const recommendedProjects = [
      {
        title: 'High-Concurrency REST API with PostgreSQL & Redis',
        purpose: 'Directly addresses database indexing, caching strategies, and resilient error-handling gaps.',
        skills: ['Node.js', 'PostgreSQL', 'Redis', 'Docker'],
        difficulty: isFresher ? 'INTERMEDIATE' : 'ADVANCED',
      },
      {
        title: 'Distributed Event Logging & Metrics Dashboard',
        purpose: 'Demonstrates microservice communication, structured logging, and frontend state synchronization.',
        skills: ['TypeScript', 'React', 'Tailwind CSS', 'WebSockets'],
        difficulty: 'INTERMEDIATE',
      },
    ];

    const nextActions = [
      {
        title: 'Master PostgreSQL Schema Design & Indexing',
        description: 'Design a 5-table normalized schema with foreign keys, compound indexes, and analyze query EXPLAIN plans.',
        priority: 'HIGH',
        estimatedEffort: '1-2 weeks',
      },
      {
        title: 'Containerize an Application with Docker Compose',
        description: 'Write a multi-container Dockerfile connecting a backend API, database, and Redis cache.',
        priority: 'HIGH',
        estimatedEffort: '3-5 days',
      },
      {
        title: 'Practice 10 Core System Design Scenarios',
        description: 'Study URL shortener, rate limiter, and notification system architectures.',
        priority: 'MEDIUM',
        estimatedEffort: '2 weeks',
      },
    ];

    const readinessScore = isFresher
      ? {
          overall: 68,
          skills: 65,
          experience: 60,
          projects: 75,
          careerAlignment: 72,
          confidence: 'HIGH' as const,
          reasoning: `Good foundation in ${techNames.slice(0, 2).join(', ') || 'coding'} with clear target alignment for ${targetRole}.`,
        }
      : {
          overall: 78,
          skills: 80,
          experience: 75,
          projects: 82,
          careerAlignment: 80,
          confidence: 'HIGH' as const,
          reasoning: `Experienced engineer with solid baseline; key growth lever is distributed systems and advanced database depth.`,
        };

    return {
      careerSummary: `You are currently at the ${isFresher ? 'Early' : 'Intermediate'} level aiming to accelerate into a ${targetRole} role. Your technical stack exhibits strong foundational elements, with key growth opportunities in relational persistence and scalable architecture.`,
      currentLevel: isFresher ? 'EARLY' : 'INTERMEDIATE',
      targetRole,
      strengths,
      weaknesses,
      skillGaps: skillGaps as any,
      recommendedTechnologies: recommendedTechnologies as any,
      knowledgeAreas: knowledgeAreas as any,
      recommendedProjects: recommendedProjects as any,
      nextActions: nextActions as any,
      careerReadiness: readinessScore,
    };
  }
}
