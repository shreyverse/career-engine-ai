import { env } from '../config/env';
import { db } from '../config/database';
import { GoogleGenAI } from '@google/genai';
import { CareerAnalysisService } from '../ai/careerAnalysis.service';
import { CareerAnalysisData } from '../types/careerAnalysis.types';
import {
  RoadmapData,
  StoredRoadmapRecord,
  FullRoadmapResponse,
  NextMoveItem,
  PhaseType,
  ItemStatus,
} from '../types/roadmap.types';
import {
  RoadmapDataSchema,
  validateRoadmapBusinessRules,
} from './roadmap.schema';
import {
  buildRoadmapSystemInstruction,
  buildRoadmapUserPrompt,
} from './roadmap.prompt';

export class RoadmapService {
  private static getClient(): GoogleGenAI | null {
    if (!env.geminiApiKey) return null;
    return new GoogleGenAI({ apiKey: env.geminiApiKey });
  }

  public static async generateRoadmapForUser(
    userId: string,
    forceRegenerate = false
  ): Promise<FullRoadmapResponse> {
    let analysisRecord = await CareerAnalysisService.getLatestAnalysis(userId);
    if (!analysisRecord) {
      analysisRecord = await CareerAnalysisService.generateAnalysisForUser(userId);
    }

    const existingRoadmap = await db.getRoadmap(userId);
    if (existingRoadmap && !forceRegenerate) {
      return this.formatRoadmapResponse(userId, existingRoadmap, analysisRecord.id);
    }

    const analysis = analysisRecord.analysisData;
    let roadmapData: RoadmapData;

    const client = this.getClient();
    if (client) {
      try {
        const systemInstruction = buildRoadmapSystemInstruction();
        const userPrompt = buildRoadmapUserPrompt(analysis);

        const response = await client.models.generateContent({
          model: env.geminiModel || 'gemini-2.5-flash',
          contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
          config: {
            systemInstruction,
            responseMimeType: 'application/json',
            temperature: 0.2,
          },
        });

        let raw = (response.text || '').trim();
        if (raw.startsWith('```json')) raw = raw.substring(7);
        if (raw.startsWith('```')) raw = raw.substring(3);
        if (raw.endsWith('```')) raw = raw.substring(0, raw.length - 3);
        raw = raw.trim();

        const parsed = JSON.parse(raw);
        const validated = RoadmapDataSchema.parse(parsed);
        validateRoadmapBusinessRules(validated);
        roadmapData = validated;
      } catch (err: any) {
        console.warn('Gemini roadmap generation failed, using intelligent fallback:', err.message);
        roadmapData = this.generateDeterministicRoadmap(analysis);
      }
    } else {
      roadmapData = this.generateDeterministicRoadmap(analysis);
    }

    const savedRoadmap = await db.saveRoadmap(
      userId,
      analysisRecord.id,
      analysis.targetRole,
      roadmapData.estimatedDuration || '5-7 months',
      roadmapData
    );

    return this.formatRoadmapResponse(userId, savedRoadmap, analysisRecord.id);
  }

  public static async getLatestRoadmap(userId: string): Promise<FullRoadmapResponse | null> {
    const roadmap = await db.getRoadmap(userId);
    if (!roadmap) return null;

    const analysisRecord = await CareerAnalysisService.getLatestAnalysis(userId);
    const sourceId = analysisRecord ? analysisRecord.id : roadmap.sourceAnalysisId;

    return this.formatRoadmapResponse(userId, roadmap, sourceId);
  }

  public static async updateTaskProgress(
    userId: string,
    taskId: string,
    completed: boolean
  ): Promise<FullRoadmapResponse> {
    const roadmap = await db.getRoadmap(userId);
    if (!roadmap) {
      const err: any = new Error('No active roadmap found.');
      err.statusCode = 404;
      err.code = 'ROADMAP_NOT_FOUND';
      throw err;
    }

    await db.updateTaskStatus(
      userId,
      roadmap.id,
      taskId,
      completed ? 'COMPLETED' : 'NOT_STARTED'
    );

    const analysisRecord = await CareerAnalysisService.getLatestAnalysis(userId);
    const sourceId = analysisRecord ? analysisRecord.id : roadmap.sourceAnalysisId;

    return this.formatRoadmapResponse(userId, roadmap, sourceId);
  }

  public static async updateProjectProgress(
    userId: string,
    projectId: string,
    status: ItemStatus
  ): Promise<FullRoadmapResponse> {
    const roadmap = await db.getRoadmap(userId);
    if (!roadmap) {
      const err: any = new Error('No active roadmap found.');
      err.statusCode = 404;
      err.code = 'ROADMAP_NOT_FOUND';
      throw err;
    }

    await db.updateProjectStatus(userId, roadmap.id, projectId, status);

    const analysisRecord = await CareerAnalysisService.getLatestAnalysis(userId);
    const sourceId = analysisRecord ? analysisRecord.id : roadmap.sourceAnalysisId;

    return this.formatRoadmapResponse(userId, roadmap, sourceId);
  }

  public static async formatRoadmapResponse(
    userId: string,
    storedRoadmap: StoredRoadmapRecord,
    currentSourceAnalysisId: string
  ): Promise<FullRoadmapResponse> {
    const taskProgressMap = await db.getUserTaskProgressMap(userId, storedRoadmap.id);
    const projectProgressMap = await db.getUserProjectProgressMap(userId, storedRoadmap.id);

    let totalTasksCount = 0;
    let completedTasksCount = 0;
    let totalProjectsCount = 0;
    let completedProjectsCount = 0;

    let activePhase: { phaseNumber: number; title: string; phaseType: PhaseType } | null = null;
    let nextMoveCandidate: NextMoveItem | null = null;

    const enrichedPhases = storedRoadmap.roadmapData.phases.map((phase) => {
      let phaseCompletedTasks = 0;
      const phaseTotalTasks = phase.tasks.length;

      const enrichedTasks = phase.tasks.map((task) => {
        totalTasksCount++;
        const isCompleted = taskProgressMap.get(task.id) === 'COMPLETED';
        if (isCompleted) {
          completedTasksCount++;
          phaseCompletedTasks++;
        } else if (!nextMoveCandidate) {
          nextMoveCandidate = {
            taskId: task.id,
            phaseId: phase.id,
            phaseTitle: phase.title,
            title: task.title,
            description: task.description,
            priority: task.priority,
            estimatedTime: task.estimatedTime,
            type: task.type,
            why: `High priority step in ${phase.title} to prepare for ${storedRoadmap.targetRole}.`,
          };
        }

        return {
          ...task,
          completed: isCompleted,
        };
      });

      const phaseProgress =
        phaseTotalTasks > 0 ? Math.round((phaseCompletedTasks / phaseTotalTasks) * 100) : 0;

      if (phase.project) {
        totalProjectsCount++;
        const projStatus = projectProgressMap.get(phase.project.id) || 'NOT_STARTED';
        if (projStatus === 'COMPLETED') {
          completedProjectsCount++;
        }
        phase.project.status = projStatus;
      }

      if (!activePhase && phaseProgress < 100) {
        activePhase = {
          phaseNumber: phase.phaseNumber,
          title: phase.title,
          phaseType: phase.phaseType,
        };
      }

      return {
        ...phase,
        tasks: enrichedTasks,
        progress: phaseProgress,
      };
    });

    const overallProgress =
      totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;

    const isStale = storedRoadmap.sourceAnalysisId !== currentSourceAnalysisId;

    return {
      roadmap: {
        ...storedRoadmap.roadmapData,
        phases: enrichedPhases,
      },
      metadata: {
        id: storedRoadmap.id,
        version: storedRoadmap.version,
        sourceAnalysisId: storedRoadmap.sourceAnalysisId,
        createdAt: storedRoadmap.createdAt,
        updatedAt: storedRoadmap.updatedAt,
      },
      progress: {
        overallProgress,
        completedTasksCount,
        totalTasksCount,
        completedProjectsCount,
        totalProjectsCount,
        currentPhase: activePhase || (enrichedPhases.length > 0 ? {
          phaseNumber: enrichedPhases[0].phaseNumber,
          title: enrichedPhases[0].title,
          phaseType: enrichedPhases[0].phaseType,
        } : null),
      },
      nextMove: nextMoveCandidate,
      isStale,
    };
  }

  public static generateDeterministicRoadmap(analysis: CareerAnalysisData): RoadmapData {
    const isEarly = analysis.currentLevel === 'BEGINNER' || analysis.currentLevel === 'EARLY';
    const targetRole = analysis.targetRole || 'Fullstack Developer';

    const phases = isEarly
      ? [
          {
            id: 'phase-1',
            phaseNumber: 1,
            phaseType: 'FOUNDATION' as PhaseType,
            title: 'Modern Fullstack Core & Foundations',
            description: 'Strengthen core JavaScript/TypeScript semantics, asynchronous patterns, and DOM architecture.',
            estimatedDuration: '4 weeks',
            objectives: [
              'Master async/await, closures, and Event Loop execution',
              'Deepen TypeScript type definitions and generics',
              'Understand HTTP/HTTPS, CORS, and REST principles',
            ],
            skills: [
              { name: 'TypeScript', reason: 'Industry standard for resilient fullstack codebases.' },
              { name: 'Async JS & Event Loop', reason: 'Crucial for non-blocking API interactions.' },
            ],
            tasks: [
              {
                id: 'task-1-1',
                title: 'Master TypeScript Generics & Utility Types',
                description: 'Write type-safe utility functions, mapped types, and strict API response schemas.',
                type: 'LEARNING' as const,
                estimatedTime: '4 days',
                priority: 'HIGH' as const,
                skills: ['TypeScript'],
              },
              {
                id: 'task-1-2',
                title: 'Deep Dive into Asynchronous JavaScript & Promises',
                description: 'Build custom Promise utilities and trace microtask/macrotask execution order.',
                type: 'PRACTICE' as const,
                estimatedTime: '3 days',
                priority: 'HIGH' as const,
                skills: ['JavaScript'],
              },
              {
                id: 'task-1-3',
                title: 'Modern REST API Contracts & Status Codes',
                description: 'Study idempotency, error formats (RFC 7807), and pagination standards.',
                type: 'READING' as const,
                estimatedTime: '2 days',
                priority: 'MEDIUM' as const,
                skills: ['REST APIs'],
              },
            ],
            completionCriteria: [
              'Complete 5 TypeScript typing challenges',
              'Explain the JavaScript Event Loop with practical microtask examples',
            ],
          },
          {
            id: 'phase-2',
            phaseNumber: 2,
            phaseType: 'SKILL_BUILDING' as PhaseType,
            title: 'Backend API Engineering & Relational Databases',
            description: 'Design robust backend services using Node.js/Express, connect PostgreSQL, and master query design.',
            estimatedDuration: '5 weeks',
            objectives: [
              'Build modular Express REST services with middleware pipelines',
              'Design normalized PostgreSQL database schemas with foreign keys and indexes',
              'Implement secure authentication with JWT, refresh tokens, and bcrypt',
            ],
            skills: [
              { name: 'Node.js & Express', reason: 'Primary runtime for scalable backend services.' },
              { name: 'PostgreSQL', reason: 'Standard relational storage required for ' + targetRole + '.' },
            ],
            tasks: [
              {
                id: 'task-2-1',
                title: 'Design Normalized PostgreSQL Database Schema',
                description: 'Create a multi-table database schema with primary/foreign keys and compound indexes.',
                type: 'PRACTICE' as const,
                estimatedTime: '4 days',
                priority: 'HIGH' as const,
                skills: ['PostgreSQL'],
              },
              {
                id: 'task-2-2',
                title: 'Implement JWT Authentication & Token Rotation',
                description: 'Build secure login, register, and refresh token middleware with httpOnly cookies.',
                type: 'LEARNING' as const,
                estimatedTime: '5 days',
                priority: 'HIGH' as const,
                skills: ['Authentication', 'Node.js'],
              },
              {
                id: 'task-2-3',
                title: 'Query Optimization & EXPLAIN ANALYZE',
                description: 'Diagnose slow query plans and apply B-tree indexing on filter and join keys.',
                type: 'PRACTICE' as const,
                estimatedTime: '3 days',
                priority: 'MEDIUM' as const,
                skills: ['PostgreSQL'],
              },
            ],
            project: {
              id: 'proj-phase-2',
              title: 'Production-Grade Auth & Data Engine',
              description: 'REST API service featuring token refresh, PostgreSQL storage, and query indexing.',
              skills: ['Node.js', 'Express', 'PostgreSQL', 'JWT'],
            },
            completionCriteria: [
              'All endpoints validated with automated integration tests',
              'Zero SQL injection vulnerabilities using parameterized queries',
            ],
          },
          {
            id: 'phase-3',
            phaseNumber: 3,
            phaseType: 'PROJECT' as PhaseType,
            title: 'Fullstack Capstone & Containerization',
            description: 'Unify frontend and backend architectures into an end-to-end deployed portfolio application.',
            estimatedDuration: '4 weeks',
            objectives: [
              'Integrate React frontend state with backend API endpoints',
              'Containerize the application with Docker and Docker Compose',
              'Set up GitHub Actions automated CI/CD pipeline',
            ],
            skills: [
              { name: 'Docker', reason: 'Ensures consistent local development and cloud deployment.' },
              { name: 'CI/CD & GitHub Actions', reason: 'Automates testing and build verification.' },
            ],
            tasks: [
              {
                id: 'task-3-1',
                title: 'Write Dockerfile & Multi-Container Compose',
                description: 'Containerize frontend, backend API, PostgreSQL, and Redis cache containers.',
                type: 'PROJECT' as const,
                estimatedTime: '4 days',
                priority: 'HIGH' as const,
                skills: ['Docker'],
              },
              {
                id: 'task-3-2',
                title: 'Configure GitHub Actions CI Workflow',
                description: 'Set up automated linting, unit test execution, and production build checks on PR.',
                type: 'LEARNING' as const,
                estimatedTime: '3 days',
                priority: 'MEDIUM' as const,
                skills: ['CI/CD'],
              },
            ],
            project: {
              id: 'proj-phase-3',
              title: 'Fullstack SaaS Workspace Platform',
              description: 'Real-time multi-user web application with Docker Compose and automated CI/CD.',
              skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker'],
            },
            completionCriteria: [
              'Docker compose up spins up complete environment in one command',
              'CI pipeline passes cleanly on main branch',
            ],
          },
          {
            id: 'phase-4',
            phaseNumber: 4,
            phaseType: 'INTERVIEW' as PhaseType,
            title: 'Technical Interview Preparation & Readiness',
            description: 'Prepare for algorithmic assessments, system architecture discussions, and behavioral rounds.',
            estimatedDuration: '3 weeks',
            objectives: [
              'Practice core Data Structures & Algorithms patterns (Arrays, Hashmaps, Graphs)',
              'Prepare structured system architecture walkthroughs for portfolio projects',
              'Refine STAR-format behavioral responses',
            ],
            skills: [
              { name: 'Data Structures & Algorithms', reason: 'Essential for technical screening rounds.' },
              { name: 'System Architecture Communication', reason: 'Demonstrates engineering maturity.' },
            ],
            tasks: [
              {
                id: 'task-4-1',
                title: 'Complete 25 Targeted Algorithmic Problems',
                description: 'Focus on Two Pointers, Sliding Window, BFS/DFS, and Dynamic Programming patterns.',
                type: 'PRACTICE' as const,
                estimatedTime: '1-2 weeks',
                priority: 'HIGH' as const,
                skills: ['Algorithms'],
              },
              {
                id: 'task-4-2',
                title: 'Prepare Technical Project Walkthrough Deck',
                description: 'Document architecture diagrams, key technical trade-offs, and scaling bottlenecks.',
                type: 'PORTFOLIO' as const,
                estimatedTime: '3 days',
                priority: 'HIGH' as const,
                skills: ['System Design'],
              },
            ],
            completionCriteria: [
              'Solve medium algorithmic problem within 30 minutes',
              'Articulate database indexing decisions clearly in mock interview',
            ],
          },
        ]
      : [
          {
            id: 'phase-1',
            phaseNumber: 1,
            phaseType: 'SKILL_BUILDING' as PhaseType,
            title: 'Distributed Systems & High-Scale Architecture',
            description: 'Transition from single-instance services to distributed, fault-tolerant microservice topologies.',
            estimatedDuration: '4 weeks',
            objectives: [
              'Master distributed caching topologies with Redis and cache invalidation strategies',
              'Implement asynchronous event messaging with Kafka or RabbitMQ',
              'Design for high availability, partition tolerance, and eventual consistency',
            ],
            skills: [
              { name: 'System Design', reason: 'Core differentiator for senior engineer leveling.' },
              { name: 'Distributed Caching (Redis)', reason: 'Sub-millisecond read latency at scale.' },
            ],
            tasks: [
              {
                id: 'task-1-1',
                title: 'Design Distributed Sliding-Window Rate Limiter',
                description: 'Implement atomic Lua scripts in Redis to prevent API abuse across load-balanced nodes.',
                type: 'PROJECT' as const,
                estimatedTime: '4 days',
                priority: 'HIGH' as const,
                skills: ['Redis', 'System Design'],
              },
              {
                id: 'task-1-2',
                title: 'Study 5 High-Scale Architecture Case Studies',
                description: 'Analyze real-world designs: Uber geospatial dispatch, Discord real-time state, and Netflix CDN.',
                type: 'READING' as const,
                estimatedTime: '1 week',
                priority: 'HIGH' as const,
                skills: ['System Design'],
              },
            ],
            completionCriteria: [
              'Articulate cache-aside, write-through, and write-back patterns with pros/cons',
              'Design resilient fallback strategy for cache node failures',
            ],
          },
          {
            id: 'phase-2',
            phaseNumber: 2,
            phaseType: 'PROJECT' as PhaseType,
            title: 'Advanced Database Engineering & Query Tuning',
            description: 'Master connection pooling, transaction isolation anomalies, and PostgreSQL partition management.',
            estimatedDuration: '4 weeks',
            objectives: [
              'Analyze complex EXPLAIN query plans and design composite indexes',
              'Implement table partitioning for time-series and high-volume ledger data',
              'Manage distributed database locks and concurrency conflicts',
            ],
            skills: [
              { name: 'Advanced PostgreSQL', reason: 'Prevent database bottlenecks under high concurrency.' },
            ],
            tasks: [
              {
                id: 'task-2-1',
                title: 'Optimize Slow Multi-Join Queries with EXPLAIN ANALYZE',
                description: 'Eliminate sequential table scans on 1M+ row datasets using partial and covering indexes.',
                type: 'PRACTICE' as const,
                estimatedTime: '5 days',
                priority: 'HIGH' as const,
                skills: ['PostgreSQL'],
              },
              {
                id: 'task-2-2',
                title: 'Implement Database Sharding & Read Replica Routing',
                description: 'Configure read-replica connection pools for queries and primary for mutations.',
                type: 'PROJECT' as const,
                estimatedTime: '1 week',
                priority: 'HIGH' as const,
                skills: ['Database Architecture'],
              },
            ],
            project: {
              id: 'proj-phase-2-pro',
              title: 'High-Throughput Order Settlement Engine',
              description: 'Financial ledger system with ACID isolation, idempotency keys, and sub-10ms query performance.',
              skills: ['PostgreSQL', 'Node.js', 'Redis', 'Docker'],
            },
            completionCriteria: [
              'Zero deadlock errors under 500 concurrent workers test load',
              'All queries execute under 15ms latency threshold',
            ],
          },
          {
            id: 'phase-3',
            phaseNumber: 3,
            phaseType: 'INTERVIEW' as PhaseType,
            title: 'Senior IC & Staff Technical Interview Execution',
            description: 'Refine system design whiteboard execution, live architecture defense, and cross-functional leadership.',
            estimatedDuration: '3 weeks',
            objectives: [
              'Drive end-to-end 45-minute System Design interviews from requirements to deep dive',
              'Demonstrate technical leadership, mentorship, and engineering decision frameworks',
            ],
            skills: [
              { name: 'System Design Interviewing', reason: 'Determines senior offer band and title calibration.' },
            ],
            tasks: [
              {
                id: 'task-3-1',
                title: 'Conduct 4 Mock Senior System Design Interviews',
                description: 'Practice designing YouTube video ingestion, distributed task scheduler, and WhatsApp messaging.',
                type: 'PRACTICE' as const,
                estimatedTime: '2 weeks',
                priority: 'HIGH' as const,
                skills: ['System Design'],
              },
            ],
            completionCriteria: [
              'Structure system design into clean requirements, estimation, API, data model, and bottlenecks',
            ],
          },
        ];

    return {
      targetRole,
      currentLevel: analysis.currentLevel,
      estimatedDuration: isEarly ? '5-7 months' : '3-5 months',
      phases,
    };
  }
}