import bcrypt from 'bcryptjs';
import {
  CareerStage,
  UserRole,
  FresherAssessmentData,
  ProfessionalAssessmentData,
} from '../types/auth.types';
import { StoredCareerAnalysisRecord, CareerAnalysisData } from '../types/careerAnalysis.types';
import {
  StoredRoadmapRecord,
  StoredTaskProgressRecord,
  StoredProjectProgressRecord,
  RoadmapData,
  ItemStatus,
} from '../types/roadmap.types';
import { StoredSkillProgressRecord, SkillLearningStatus } from '../types/skills.types';
import {
  StoredResumeRecord,
  StoredResumeFileRecord,
  ResumeData,
  ResumeStatus,
} from '../types/resume.types';
import { ATSAnalysisRecord } from '../types/ats.types';
import { CoachConversation, CoachMessage } from '../types/coach.types';
import { SavedJobRecord, JobApplicationRecord } from '../types/jobs.types';

export interface StoredUser {
  id: string;
  email: string;
  passwordHash: string;
  fullName: string;
  avatarUrl?: string | null;
  role: UserRole;
  authProvider?: "local" | "google";
  careerStage: CareerStage;
  careerType?: CareerStage | null;
  isOnboarded: boolean;
  hasCompletedOnboarding: boolean;
  onboardingStep: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface StoredCareerProfile {
  id: string;
  userId: string;
  careerStage: CareerStage;
  targetRole: string;
  targetIndustry?: string;
  preferredWorkMode?: string;
  salaryExpectation?: string;
  learningVelocity?: string;
  weeklyHoursAvailable?: number;
  createdAt: Date;
  updatedAt: Date;
}

export class InMemoryDataStore {
  private users: Map<string, StoredUser> = new Map();
  private careerProfiles: Map<string, StoredCareerProfile> = new Map();
  private fresherAssessments: Map<string, FresherAssessmentData> = new Map();
  private professionalAssessments: Map<string, ProfessionalAssessmentData> = new Map();
  private careerAnalyses: Map<string, StoredCareerAnalysisRecord[]> = new Map();
  private skillProgress: Map<string, StoredSkillProgressRecord[]> = new Map();
  private roadmaps: Map<string, StoredRoadmapRecord[]> = new Map();
  private taskProgress: Map<string, StoredTaskProgressRecord[]> = new Map();
  private projectProgress: Map<string, StoredProjectProgressRecord[]> = new Map();
  private resumes: Map<string, StoredResumeRecord[]> = new Map();
  private resumeFiles: Map<string, StoredResumeFileRecord> = new Map();
  private atsAnalyses: Map<string, ATSAnalysisRecord[]> = new Map();
  private coachConversations: Map<string, CoachConversation> = new Map();
  private coachMessages: Map<string, CoachMessage[]> = new Map();
  private savedJobs: Map<string, SavedJobRecord[]> = new Map();
  private jobApplications: Map<string, JobApplicationRecord[]> = new Map();
  private passwordResetTokens: Map<string, { email: string; token: string; expiresAt: number }> = new Map();
  private passwordResetOTPs: Map<string, {
    email: string;
    otpHash: string;
    expiresAt: number;
    attempts: number;
    lastSentAt: number;
  }> = new Map();
  private resetSessionTokens: Map<string, {
    email: string;
    token: string;
    expiresAt: number;
  }> = new Map();

  constructor() {
    this.seedDemoUser();
  }

  private seedDemoUser() {
    const demoPasswordHash = bcrypt.hashSync('password123', 10);
    const demoUserId = 'user-demo-001';

    const demoUser: StoredUser = {
      id: demoUserId,
      email: 'demo@careerengine.ai',
      passwordHash: demoPasswordHash,
      fullName: 'Alex Vance',
      avatarUrl: null,
      role: 'USER',
      careerStage: 'PROFESSIONAL',
      careerType: 'PROFESSIONAL',
      isOnboarded: true,
      hasCompletedOnboarding: true,
      onboardingStep: 6,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(demoUser.id, demoUser);
    const shreyanshUser: StoredUser = {
      id: 'user-shreyansh-001',
      email: 'shreyanshsri06@gmail.com',
      passwordHash: demoPasswordHash,
      fullName: 'Shreyansh Srivastava',
      avatarUrl: null,
      role: 'USER',
      careerStage: 'FRESHER',
      careerType: 'FRESHER',
      isOnboarded: false,
      hasCompletedOnboarding: false,
      onboardingStep: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(shreyanshUser.id, shreyanshUser);

    const demoProfile: StoredCareerProfile = {
      id: 'profile-demo-001',
      userId: demoUserId,
      careerStage: 'PROFESSIONAL',
      targetRole: 'Senior Fullstack Engineer',
      targetIndustry: 'Cloud Infrastructure & SaaS',
      preferredWorkMode: 'REMOTE',
      salaryExpectation: '$140k - $175k',
      learningVelocity: 'MODERATE',
      weeklyHoursAvailable: 15,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.careerProfiles.set(demoUserId, demoProfile);

    const demoAnalysisData: CareerAnalysisData = {
      targetRole: 'Senior Fullstack Engineer',
      currentLevel: 'INTERMEDIATE',
      careerSummary:
        'You have robust engineering foundations with 3+ years in frontend and API integrations. To transition into Senior Fullstack, focus on distributed backend architecture, query optimization at scale, and end-to-end system design.',
      strengths: [
        'Production React & TypeScript architectural experience with clean component boundaries',
        'Demonstrated REST API lifecycle and integration understanding',
        'Solid testing foundation with automated CI workflows',
      ],
      weaknesses: [
        'Limited hands-on distributed systems and event-driven caching topologies at scale',
        'Need deeper PostgreSQL query execution plan tuning and connection pool management',
        'Absence of multi-container microservice orchestration portfolio projects',
      ],
      skillGaps: [
        {
          skill: 'Distributed System Design',
          currentLevel: 'BASIC',
          requiredLevel: 'ADVANCED',
          gap: 'HIGH',
          priority: 'HIGH',
          reason: 'Senior Fullstack roles require designing fault-tolerant services that scale to high throughput.',
        },
        {
          skill: 'PostgreSQL Indexing & Optimization',
          currentLevel: 'BASIC',
          requiredLevel: 'INTERMEDIATE',
          gap: 'MEDIUM',
          priority: 'HIGH',
          reason: 'Diagnosing slow multi-join queries with EXPLAIN ANALYZE is critical for backend performance.',
        },
        {
          skill: 'Redis Distributed Caching',
          currentLevel: 'NONE',
          requiredLevel: 'INTERMEDIATE',
          gap: 'HIGH',
          priority: 'MEDIUM',
          reason: 'Implementing cache-aside, write-back, and sliding-window rate limiters across nodes.',
        },
        {
          skill: 'Docker Compose & Containerization',
          currentLevel: 'BASIC',
          requiredLevel: 'INTERMEDIATE',
          gap: 'MEDIUM',
          priority: 'MEDIUM',
          reason: 'Containerizing multi-service microservices and local test harnesses.',
        },
      ],
      recommendedTechnologies: [
        {
          technology: 'PostgreSQL 16 & Prisma/Drizzle',
          priority: 'HIGH',
          reason: 'Type-safe SQL queries with connection pool tuning.',
          prerequisites: ['SQL Fundamentals'],
        },
        {
          technology: 'Redis 7',
          priority: 'HIGH',
          reason: 'Sub-millisecond data caching, rate-limiting, and Pub/Sub messaging.',
          prerequisites: ['In-memory data structures'],
        },
        {
          technology: 'Docker & Docker Compose',
          priority: 'MEDIUM',
          reason: 'Reproducible multi-container staging and production deployments.',
          prerequisites: ['Linux CLI Basics'],
        },
      ],
      knowledgeAreas: [
        {
          topic: 'High-Availability & Distributed Caching',
          priority: 'HIGH',
          reason: 'Cache invalidation strategies, thundering herd mitigation, and distributed locking.',
        },
        {
          topic: 'Database ACID Isolation Levels & Sharding',
          priority: 'HIGH',
          reason: 'Mitigating concurrency race conditions and table contention under high write loads.',
        },
      ],
      recommendedProjects: [
        {
          title: 'High-Throughput Distributed Rate Limiter & Cache Layer',
          purpose: 'Demonstrate atomic Redis Lua script rate-limiting and cache-aside query proxying.',
          skills: ['Redis', 'Node.js', 'Docker', 'System Design'],
          difficulty: 'ADVANCED',
        },
        {
          title: 'Multi-Tenant Financial Settlement Ledger',
          purpose: 'Implement ACID transactions, idempotency keys, and sub-15ms PostgreSQL query execution.',
          skills: ['PostgreSQL', 'TypeScript', 'Prisma', 'REST APIs'],
          difficulty: 'ADVANCED',
        },
      ],
      nextActions: [
        {
          title: 'Master PostgreSQL EXPLAIN ANALYZE & Composite Indexes',
          description: 'Eliminate sequential table scans on multi-table queries with targeted indexes.',
          priority: 'HIGH',
          estimatedEffort: '1 week',
        },
        {
          title: 'Build Atomic Redis Rate-Limiter Middleware',
          description: 'Implement sliding-window Lua script rate-limiting for Express/Node.js.',
          priority: 'HIGH',
          estimatedEffort: '3-4 days',
        },
        {
          title: 'Practice 3 High-Scale Architecture Whiteboard Mock Rounds',
          description: 'Design distributed URL shortener and real-time collaborative document engine.',
          priority: 'MEDIUM',
          estimatedEffort: '1-2 weeks',
        },
      ],
      careerReadiness: {
        overall: 78,
        skills: 80,
        experience: 75,
        projects: 82,
        careerAlignment: 85,
        confidence: 'HIGH',
        reasoning: 'Strong foundation in modern frontend and Node.js. Ready for accelerated Senior level progression.',
      },
    };

    const demoAnalysisRecord: StoredCareerAnalysisRecord = {
      id: 'analysis-demo-001',
      userId: demoUserId,
      careerType: 'PROFESSIONAL',
      targetRole: 'Senior Fullstack Engineer',
      analysisData: demoAnalysisData,
      model: 'gemini-2.5-flash',
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.careerAnalyses.set(demoUserId, [demoAnalysisRecord]);

    const demoSkillProgress: StoredSkillProgressRecord[] = [
      {
        id: 'skill-prog-1',
        userId: demoUserId,
        skillName: 'Distributed System Design',
        status: 'LEARNING',
        progress: 40,
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'skill-prog-2',
        userId: demoUserId,
        skillName: 'PostgreSQL Indexing & Optimization',
        status: 'PRACTICING',
        progress: 65,
        updatedAt: new Date().toISOString(),
      },
    ];
    this.skillProgress.set(demoUserId, demoSkillProgress);

    // Seed Demo Resume
    const demoResumeData: ResumeData = {
      personal: {
        name: 'Alex Vance',
        email: 'alex.vance@careerengine.ai',
        phone: '+1 (555) 349-2810',
        location: 'San Francisco, CA (Remote)',
        linkedin: 'https://linkedin.com/in/alex-vance-fullstack',
        github: 'https://github.com/alexvance-dev',
        portfolio: 'https://alexvance.dev',
      },
      summary:
        'Experienced Full-Stack Software Engineer with 4+ years of expertise in TypeScript, React, Node.js, and relational database systems. Track record of delivering scalable web platforms, high-performance REST APIs, and microservices.',
      education: [
        {
          id: 'edu-demo-1',
          institution: 'University of California, Berkeley',
          degree: 'Bachelor of Science',
          field: 'Computer Science',
          startDate: '2016',
          endDate: '2020',
          grade: '3.8 GPA',
          current: false,
        },
      ],
      experience: [
        {
          id: 'exp-demo-1',
          company: 'Nexus Cloud Platforms',
          role: 'Full-Stack Software Engineer',
          location: 'San Francisco, CA',
          startDate: 'Jun 2022',
          endDate: 'Present',
          current: true,
          description:
            'Architect and deliver high-throughput cloud management microservices and real-time frontend dashboards.',
          achievements: [
            'Engineered resilient REST and WebSocket service tier serving over 150,000 monthly active users.',
            'Optimized complex PostgreSQL analytical queries, reducing 95th percentile response times by 35%.',
            'Implemented automated CI/CD pipeline test suites achieving 88% code coverage.',
          ],
        },
        {
          id: 'exp-demo-2',
          company: 'Hyperion Interactive',
          role: 'Frontend Engineer',
          location: 'San Jose, CA',
          startDate: 'Aug 2020',
          endDate: 'May 2022',
          current: false,
          description: 'Developed modern web client user interfaces using React, TypeScript, and Redux.',
          achievements: [
            'Built responsive design system components utilized across 4 internal product engineering squads.',
            'Collaborated with product designers to streamline user intake onboarding completion rates.',
          ],
        },
      ],
      skills: [
        { id: 'sk-demo-1', name: 'TypeScript', category: 'TECHNICAL', level: 'ADVANCED' },
        { id: 'sk-demo-2', name: 'React & Next.js', category: 'TECHNICAL', level: 'ADVANCED' },
        { id: 'sk-demo-3', name: 'Node.js & Express', category: 'TECHNICAL', level: 'ADVANCED' },
        { id: 'sk-demo-4', name: 'PostgreSQL & Prisma', category: 'DATABASE', level: 'INTERMEDIATE' },
        { id: 'sk-demo-5', name: 'Redis', category: 'DATABASE', level: 'BASIC' },
        { id: 'sk-demo-6', name: 'Docker & Compose', category: 'CLOUD', level: 'INTERMEDIATE' },
        { id: 'sk-demo-7', name: 'Git & GitHub Actions', category: 'TOOLS', level: 'ADVANCED' },
      ],
      projects: [
        {
          id: 'proj-demo-1',
          name: 'Distributed Sliding-Window Rate Limiter',
          description:
            'High-throughput Redis Lua-based rate limiting middleware for Node.js and Express services.',
          technologies: ['TypeScript', 'Redis', 'Docker', 'Node.js'],
          url: 'https://github.com/alexvance-dev/rate-limiter',
          githubUrl: 'https://github.com/alexvance-dev/rate-limiter',
          highlights: [
            'Implemented atomic sliding-window counter ensuring sub-2ms overhead across distributed worker nodes.',
          ],
        },
        {
          id: 'proj-demo-2',
          name: 'Multi-Tenant Financial Settlement Ledger',
          description:
            'ACID-compliant double-entry accounting transaction engine with PostgreSQL row-level security.',
          technologies: ['PostgreSQL', 'Prisma', 'TypeScript', 'Jest'],
          url: 'https://github.com/alexvance-dev/settlement-ledger',
          githubUrl: 'https://github.com/alexvance-dev/settlement-ledger',
          highlights: [
            'Guaranteed zero duplicate transaction mutations using idempotency keys and transactional isolation.',
          ],
        },
      ],
      certifications: [
        {
          id: 'cert-demo-1',
          name: 'AWS Certified Solutions Architect – Associate',
          issuer: 'Amazon Web Services',
          issueDate: '2023',
          url: '',
        },
      ],
      achievements: [
        {
          id: 'ach-demo-1',
          title: 'Nexus Cloud Innovation Hackathon Winner',
          description: 'First place for designing real-time observability tracing proxy.',
          date: '2023',
        },
      ],
      targetRole: 'Senior Fullstack Engineer',
    };

    const demoResumeRecord: StoredResumeRecord = {
      id: 'resume-demo-001',
      userId: demoUserId,
      name: 'Alex Vance — Senior Fullstack Resume',
      targetRole: 'Senior Fullstack Engineer',
      version: 1,
      status: 'READY',
      completeness: 95,
      data: demoResumeData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.resumes.set(demoUserId, [demoResumeRecord]);
  }

  public async findUserByEmail(email: string): Promise<StoredUser | null> {
    const cleanEmail = email.toLowerCase().trim();
    for (const user of this.users.values()) {
      if (user.email.toLowerCase() === cleanEmail) {
        return user;
      }
    }
    return null;
  }

  public async findUserById(id: string): Promise<StoredUser | null> {
    return this.users.get(id) || null;
  }

  public async createUser(userData: {
    email: string;
    passwordHash: string;
    fullName: string;
    avatarUrl?: string | null;
    role?: UserRole;
    authProvider?: "local" | "google";
    careerStage?: CareerStage;
    careerType?: CareerStage | null;
    isOnboarded?: boolean;
    hasCompletedOnboarding?: boolean;
    onboardingStep?: number;
  }): Promise<StoredUser> {
    const id = 'user-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    const now = new Date();
    const newUser: StoredUser = {
      id,
      email: userData.email.toLowerCase().trim(),
      passwordHash: userData.passwordHash,
      fullName: userData.fullName.trim(),
      avatarUrl: userData.avatarUrl || null,
      role: userData.role || 'USER',
      authProvider: userData.authProvider || 'local',
      careerStage: userData.careerStage || 'FRESHER',
      careerType: userData.careerType || userData.careerStage || null,
      isOnboarded: userData.isOnboarded || false,
      hasCompletedOnboarding: userData.hasCompletedOnboarding || false,
      onboardingStep: userData.onboardingStep || 1,
      createdAt: now,
      updatedAt: now,
    };
    this.users.set(id, newUser);
    return newUser;
  }

  public async updateUser(id: string, updates: Partial<StoredUser>): Promise<StoredUser | null> {
    const existing = this.users.get(id);
    if (!existing) return null;
    const updated: StoredUser = {
      ...existing,
      ...updates,
      updatedAt: new Date(),
    };
    this.users.set(id, updated);
    return updated;
  }

  public async resetUserOnboarding(userId: string, newStage?: CareerStage): Promise<StoredUser | null> {
    const user = this.users.get(userId);
    if (!user) return null;
    user.isOnboarded = false;
    user.hasCompletedOnboarding = false;
    user.onboardingStep = 1;
    if (newStage) {
      user.careerStage = newStage;
      user.careerType = newStage;
    }
    user.updatedAt = new Date();
    this.users.set(userId, user);
    this.fresherAssessments.delete(userId);
    this.professionalAssessments.delete(userId);
    return user;
  }

  public async getProfileByUserId(userId: string): Promise<StoredCareerProfile | null> {
    return this.careerProfiles.get(userId) || null;
  }

  public async getCareerProfile(userId: string): Promise<StoredCareerProfile | null> {
    return this.careerProfiles.get(userId) || null;
  }

  public async saveCareerProfile(userId: string, data: Partial<StoredCareerProfile>): Promise<StoredCareerProfile> {
    const existing = this.careerProfiles.get(userId);
    const now = new Date();
    const profile: StoredCareerProfile = {
      id: existing?.id || ('profile-' + Date.now()),
      userId,
      careerStage: data.careerStage || existing?.careerStage || 'FRESHER',
      targetRole: data.targetRole || existing?.targetRole || 'Fullstack Developer',
      targetIndustry: data.targetIndustry || existing?.targetIndustry,
      preferredWorkMode: data.preferredWorkMode || existing?.preferredWorkMode || 'FLEXIBLE',
      salaryExpectation: data.salaryExpectation || existing?.salaryExpectation,
      learningVelocity: data.learningVelocity || existing?.learningVelocity || 'MODERATE',
      weeklyHoursAvailable: data.weeklyHoursAvailable || existing?.weeklyHoursAvailable || 10,
      createdAt: existing?.createdAt || now,
      updatedAt: now,
    };
    this.careerProfiles.set(userId, profile);
    return profile;
  }

  public async getFresherAssessment(userId: string): Promise<FresherAssessmentData | null> {
    return this.fresherAssessments.get(userId) || null;
  }

  public async saveFresherAssessment(userId: string, data: Partial<FresherAssessmentData>): Promise<FresherAssessmentData> {
    const existing = this.fresherAssessments.get(userId) || ({} as FresherAssessmentData);
    const merged: FresherAssessmentData = {
      ...existing,
      ...data,
    };
    this.fresherAssessments.set(userId, merged);
    return merged;
  }

  public async saveFresherAssessmentStep(userId: string, step: number, stepData: any): Promise<FresherAssessmentData> {
    const existing = this.fresherAssessments.get(userId) || ({} as FresherAssessmentData);
    const merged: FresherAssessmentData = {
      ...existing,
      ...stepData,
      currentStep: step,
    };
    this.fresherAssessments.set(userId, merged);
    const user = this.users.get(userId);
    if (user) {
      user.onboardingStep = Math.max(user.onboardingStep || 1, step);
      this.users.set(userId, user);
    }
    return merged;
  }

  public async completeFresherAssessment(userId: string): Promise<FresherAssessmentData> {
    const existing = this.fresherAssessments.get(userId) || ({} as FresherAssessmentData);
    existing.currentStep = 6;
    existing.completedAt = new Date().toISOString();
    this.fresherAssessments.set(userId, existing);
    const user = this.users.get(userId);
    if (user) {
      user.isOnboarded = true;
      user.hasCompletedOnboarding = true;
      user.careerStage = 'FRESHER';
      user.careerType = 'FRESHER';
      this.users.set(userId, user);
    }
    return existing;
  }

  public async getProfessionalAssessment(userId: string): Promise<ProfessionalAssessmentData | null> {
    return this.professionalAssessments.get(userId) || null;
  }

  public async saveProfessionalAssessment(userId: string, data: Partial<ProfessionalAssessmentData>): Promise<ProfessionalAssessmentData> {
    const existing = this.professionalAssessments.get(userId) || ({} as ProfessionalAssessmentData);
    const merged: ProfessionalAssessmentData = {
      ...existing,
      ...data,
    };
    this.professionalAssessments.set(userId, merged);
    return merged;
  }

  public async saveProfessionalAssessmentStep(userId: string, step: number, stepData: any): Promise<ProfessionalAssessmentData> {
    const existing = this.professionalAssessments.get(userId) || ({} as ProfessionalAssessmentData);
    const merged: ProfessionalAssessmentData = {
      ...existing,
      ...stepData,
      currentStep: step,
    };
    this.professionalAssessments.set(userId, merged);
    const user = this.users.get(userId);
    if (user) {
      user.onboardingStep = Math.max(user.onboardingStep || 1, step);
      this.users.set(userId, user);
    }
    return merged;
  }

  public async completeProfessionalAssessment(userId: string): Promise<ProfessionalAssessmentData> {
    const existing = this.professionalAssessments.get(userId) || ({} as ProfessionalAssessmentData);
    existing.currentStep = 6;
    existing.completedAt = new Date().toISOString();
    this.professionalAssessments.set(userId, existing);
    const user = this.users.get(userId);
    if (user) {
      user.isOnboarded = true;
      user.hasCompletedOnboarding = true;
      user.careerStage = 'PROFESSIONAL';
      user.careerType = 'PROFESSIONAL';
      this.users.set(userId, user);
    }
    return existing;
  }

  public async getCareerAnalysis(userId: string): Promise<StoredCareerAnalysisRecord | null> {
    const records = this.careerAnalyses.get(userId) || [];
    if (records.length === 0) return null;
    return records[records.length - 1];
  }

  public async saveCareerAnalysis(
    userId: string,
    careerType: string,
    targetRole: string,
    analysisData: CareerAnalysisData,
    model: string
  ): Promise<StoredCareerAnalysisRecord> {
    const records = this.careerAnalyses.get(userId) || [];
    const version = records.length + 1;
    const now = new Date().toISOString();
    const newRecord: StoredCareerAnalysisRecord = {
      id: 'analysis-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
      userId,
      careerType: (careerType as any) === 'FRESHER' ? 'FRESHER' : 'PROFESSIONAL',
      targetRole,
      analysisData,
      model,
      version,
      createdAt: now,
      updatedAt: now,
    };
    records.push(newRecord);
    this.careerAnalyses.set(userId, records);
    return newRecord;
  }

  public async getUserSkillProgressMap(userId: string): Promise<Map<string, StoredSkillProgressRecord>> {
    const records = this.skillProgress.get(userId) || [];
    const map = new Map<string, StoredSkillProgressRecord>();
    for (const r of records) {
      map.set(r.skillName.toLowerCase(), r);
    }
    return map;
  }

  public async saveSkillProgress(
    userId: string,
    skillName: string,
    status: SkillLearningStatus,
    progress: number
  ): Promise<StoredSkillProgressRecord> {
    const records = this.skillProgress.get(userId) || [];
    const cleanName = skillName.trim();
    const existingIndex = records.findIndex((r) => r.skillName.toLowerCase() === cleanName.toLowerCase());
    const now = new Date().toISOString();

    if (existingIndex >= 0) {
      records[existingIndex] = {
        ...records[existingIndex],
        status,
        progress,
        updatedAt: now,
      };
      this.skillProgress.set(userId, records);
      return records[existingIndex];
    }

    const newRecord: StoredSkillProgressRecord = {
      id: 'skill-prog-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
      userId,
      skillName: cleanName,
      status,
      progress,
      updatedAt: now,
    };
    records.push(newRecord);
    this.skillProgress.set(userId, records);
    return newRecord;
  }

  public async getRoadmap(userId: string): Promise<StoredRoadmapRecord | null> {
    const records = this.roadmaps.get(userId) || [];
    if (records.length === 0) return null;
    return records[records.length - 1];
  }

  public async saveRoadmap(
    userId: string,
    sourceAnalysisId: string,
    targetRole: string,
    estimatedDuration: string,
    roadmapData: RoadmapData
  ): Promise<StoredRoadmapRecord> {
    const records = this.roadmaps.get(userId) || [];
    const version = records.length + 1;
    const now = new Date().toISOString();

    const newRecord: StoredRoadmapRecord = {
      id: 'roadmap-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
      userId,
      sourceAnalysisId,
      version,
      targetRole,
      estimatedDuration,
      roadmapData,
      createdAt: now,
      updatedAt: now,
    };
    records.push(newRecord);
    this.roadmaps.set(userId, records);
    return newRecord;
  }

  public async getUserTaskProgressMap(userId: string, roadmapId: string): Promise<Map<string, ItemStatus>> {
    const records = this.taskProgress.get(userId) || [];
    const map = new Map<string, ItemStatus>();
    for (const r of records) {
      if (r.roadmapId === roadmapId) {
        map.set(r.taskId, r.status);
      }
    }
    return map;
  }

  public async updateTaskStatus(
    userId: string,
    roadmapId: string,
    taskId: string,
    status: ItemStatus
  ): Promise<StoredTaskProgressRecord> {
    const records = this.taskProgress.get(userId) || [];
    const existingIndex = records.findIndex((r) => r.roadmapId === roadmapId && r.taskId === taskId);
    const now = new Date().toISOString();

    if (existingIndex >= 0) {
      records[existingIndex] = {
        ...records[existingIndex],
        status,
        completedAt: status === 'COMPLETED' ? now : null,
        updatedAt: now,
      };
      this.taskProgress.set(userId, records);
      return records[existingIndex];
    }

    const newRecord: StoredTaskProgressRecord = {
      id: 'task-prog-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
      userId,
      roadmapId,
      taskId,
      status,
      completedAt: status === 'COMPLETED' ? now : null,
      updatedAt: now,
    };
    records.push(newRecord);
    this.taskProgress.set(userId, records);
    return newRecord;
  }

  public async getUserProjectProgressMap(userId: string, roadmapId: string): Promise<Map<string, ItemStatus>> {
    const records = this.projectProgress.get(userId) || [];
    const map = new Map<string, ItemStatus>();
    for (const r of records) {
      if (r.roadmapId === roadmapId) {
        map.set(r.projectId, r.status);
      }
    }
    return map;
  }

  public async updateProjectStatus(
    userId: string,
    roadmapId: string,
    projectId: string,
    status: ItemStatus
  ): Promise<StoredProjectProgressRecord> {
    const records = this.projectProgress.get(userId) || [];
    const existingIndex = records.findIndex((r) => r.roadmapId === roadmapId && r.projectId === projectId);
    const now = new Date().toISOString();

    if (existingIndex >= 0) {
      records[existingIndex] = {
        ...records[existingIndex],
        status,
        completedAt: status === 'COMPLETED' ? now : null,
        updatedAt: now,
      };
      this.projectProgress.set(userId, records);
      return records[existingIndex];
    }

    const newRecord: StoredProjectProgressRecord = {
      id: 'proj-prog-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
      userId,
      roadmapId,
      projectId,
      status,
      completedAt: status === 'COMPLETED' ? now : null,
      updatedAt: now,
    };
    records.push(newRecord);
    this.projectProgress.set(userId, records);
    return newRecord;
  }

  // ==================== RESUME REPOSITORY ====================

  public async getUserResumes(userId: string): Promise<StoredResumeRecord[]> {
    return this.resumes.get(userId) || [];
  }

  public async getResumeById(resumeId: string): Promise<StoredResumeRecord | null> {
    for (const list of this.resumes.values()) {
      const found = list.find((r) => r.id === resumeId);
      if (found) return found;
    }
    return null;
  }

  public async saveResume(resumeData: {
    userId: string;
    name: string;
    targetRole: string;
    status: ResumeStatus;
    completeness: number;
    data: ResumeData;
  }): Promise<StoredResumeRecord> {
    const userResumes = this.resumes.get(resumeData.userId) || [];
    const version = userResumes.length + 1;
    const now = new Date().toISOString();

    const newRecord: StoredResumeRecord = {
      id: 'resume-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
      userId: resumeData.userId,
      name: resumeData.name,
      targetRole: resumeData.targetRole,
      version,
      status: resumeData.status,
      completeness: resumeData.completeness,
      data: resumeData.data,
      createdAt: now,
      updatedAt: now,
    };

    userResumes.push(newRecord);
    this.resumes.set(resumeData.userId, userResumes);
    return newRecord;
  }

  public async updateResume(
    resumeId: string,
    updates: {
      name?: string;
      targetRole?: string;
      status?: ResumeStatus;
      completeness?: number;
      data?: ResumeData;
    }
  ): Promise<StoredResumeRecord> {
    for (const [userId, list] of this.resumes.entries()) {
      const idx = list.findIndex((r) => r.id === resumeId);
      if (idx >= 0) {
        const existing = list[idx];
        const updated: StoredResumeRecord = {
          ...existing,
          ...updates,
          name: updates.name || existing.name,
          targetRole: updates.targetRole || existing.targetRole,
          status: updates.status || existing.status,
          completeness: updates.completeness !== undefined ? updates.completeness : existing.completeness,
          data: updates.data || existing.data,
          updatedAt: new Date().toISOString(),
        };
        list[idx] = updated;
        this.resumes.set(userId, list);
        return updated;
      }
    }
    throw new Error('Resume not found to update.');
  }

  public async deleteResume(resumeId: string): Promise<boolean> {
    for (const [userId, list] of this.resumes.entries()) {
      const filtered = list.filter((r) => r.id !== resumeId);
      if (filtered.length !== list.length) {
        this.resumes.set(userId, filtered);
        return true;
      }
    }
    return false;
  }

  public async saveResumeFile(fileData: {
    userId: string;
    storageKey: string;
    originalFileName: string;
    mimeType: string;
    fileSize: number;
    extractedText?: string;
    resumeId?: string;
  }): Promise<StoredResumeFileRecord> {
    const id = 'file-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6);
    const now = new Date().toISOString();
    const record: StoredResumeFileRecord = {
      id,
      resumeId: fileData.resumeId,
      userId: fileData.userId,
      storageKey: fileData.storageKey,
      originalFileName: fileData.originalFileName,
      mimeType: fileData.mimeType,
      fileSize: fileData.fileSize,
      extractedText: fileData.extractedText,
      createdAt: now,
    };
    this.resumeFiles.set(id, record);
    return record;
  }

  public async getResumeFileById(fileId: string): Promise<StoredResumeFileRecord | null> {
    return this.resumeFiles.get(fileId) || null;
  }

  public saveATSAnalysis(analysis: ATSAnalysisRecord): ATSAnalysisRecord {
    const list = this.atsAnalyses.get(analysis.userId) || [];
    list.unshift(analysis);
    this.atsAnalyses.set(analysis.userId, list);
    return analysis;
  }

  public getATSAnalysisById(analysisId: string): ATSAnalysisRecord | null {
    for (const list of this.atsAnalyses.values()) {
      const found = list.find((a) => a.id === analysisId);
      if (found) return found;
    }
    return null;
  }

  public getUserATSAnalyses(userId: string): ATSAnalysisRecord[] {
    return this.atsAnalyses.get(userId) || [];
  }

  public findDuplicateATSAnalysis(
    userId: string,
    resumeId: string,
    targetRole: string,
    jobDescriptionHash?: string
  ): ATSAnalysisRecord | null {
    const list = this.atsAnalyses.get(userId) || [];
    const tenMinutesAgo = Date.now() - 10 * 60 * 1000;
    return (
      list.find((a) => {
        const isRecent = new Date(a.createdAt).getTime() > tenMinutesAgo;
        const isSameResume = a.resumeId === resumeId;
        const isSameRole = a.targetRole.toLowerCase() === targetRole.toLowerCase();
        const isSameJD = (a.jobDescriptionHash || '') === (jobDescriptionHash || '');
        return isRecent && isSameResume && isSameRole && isSameJD;
      }) || null
    );
  }

  public saveCoachConversation(conv: CoachConversation): CoachConversation {
    this.coachConversations.set(conv.id, { ...conv });
    if (!this.coachMessages.has(conv.id)) {
      this.coachMessages.set(conv.id, []);
    }
    return conv;
  }

  public getCoachConversationById(id: string): CoachConversation | null {
    const conv = this.coachConversations.get(id);
    if (!conv) return null;
    const messages = this.coachMessages.get(id) || [];
    return { ...conv, messages };
  }

  public getUserCoachConversations(userId: string): CoachConversation[] {
    const results: CoachConversation[] = [];
    for (const conv of this.coachConversations.values()) {
      if (conv.userId === userId) {
        const messages = this.coachMessages.get(conv.id) || [];
        results.push({ ...conv, messages });
      }
    }
    return results.sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }

  public deleteCoachConversation(id: string): boolean {
    const exists = this.coachConversations.has(id);
    this.coachConversations.delete(id);
    this.coachMessages.delete(id);
    return exists;
  }

  public touchCoachConversation(id: string): void {
    const conv = this.coachConversations.get(id);
    if (conv) {
      conv.updatedAt = new Date().toISOString();
      this.coachConversations.set(id, conv);
    }
  }

  public saveCoachMessage(msg: CoachMessage): CoachMessage {
    const list = this.coachMessages.get(msg.conversationId) || [];
    list.push(msg);
    this.coachMessages.set(msg.conversationId, list);
    this.touchCoachConversation(msg.conversationId);
    return msg;
  }

  // Jobs & Applications
  public saveUserJob(record: SavedJobRecord): SavedJobRecord {
    const list = this.savedJobs.get(record.userId) || [];
    const exists = list.some((s) => s.jobId === record.jobId);
    if (!exists) {
      list.unshift(record);
      this.savedJobs.set(record.userId, list);
    }
    return record;
  }

  public unsaveUserJob(userId: string, jobId: string): boolean {
    const list = this.savedJobs.get(userId) || [];
    const filtered = list.filter((s) => s.jobId !== jobId);
    this.savedJobs.set(userId, filtered);
    return list.length !== filtered.length;
  }

  public getUserSavedJobs(userId: string): SavedJobRecord[] {
    return this.savedJobs.get(userId) || [];
  }

  public saveJobApplication(record: JobApplicationRecord): JobApplicationRecord {
    const list = this.jobApplications.get(record.userId) || [];
    list.unshift(record);
    this.jobApplications.set(record.userId, list);
    return record;
  }

  public updateJobApplication(
    userId: string,
    id: string,
    updates: Partial<JobApplicationRecord>
  ): JobApplicationRecord | null {
    const list = this.jobApplications.get(userId) || [];
    const idx = list.findIndex((a) => a.id === id);
    if (idx === 0 || idx > 0) {
      list[idx] = {
        ...list[idx],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      this.jobApplications.set(userId, list);
      return list[idx];
    }
    return null;
  }

  public getUserJobApplications(userId: string): JobApplicationRecord[] {
    return this.jobApplications.get(userId) || [];
  }

  public deleteJobApplication(userId: string, id: string): boolean {
    const list = this.jobApplications.get(userId) || [];
    const filtered = list.filter((a) => a.id !== id);
    this.jobApplications.set(userId, filtered);
    return list.length !== filtered.length;
  }

    // OTP Password Reset Store
  public savePasswordResetOTP(email: string, otpHash: string, expiresInMinutes = 10): { cooldownRemaining?: number } {
    const normalized = email.toLowerCase().trim();
    const existing = this.passwordResetOTPs.get(normalized);
    const now = Date.now();

    // 60-second cooldown check
    if (existing && now - existing.lastSentAt < 60 * 1000) {
      const remainingSeconds = Math.ceil((60 * 1000 - (now - existing.lastSentAt)) / 1000);
      return { cooldownRemaining: remainingSeconds };
    }

    const expiresAt = now + expiresInMinutes * 60 * 1000;
    this.passwordResetOTPs.set(normalized, {
      email: normalized,
      otpHash,
      expiresAt,
      attempts: 0,
      lastSentAt: now,
    });

    return {};
  }

  public getPasswordResetOTP(email: string) {
    const normalized = email.toLowerCase().trim();
    return this.passwordResetOTPs.get(normalized) || null;
  }

  public incrementOTPAttempts(email: string): number {
    const normalized = email.toLowerCase().trim();
    const record = this.passwordResetOTPs.get(normalized);
    if (!record) return 0;
    record.attempts += 1;
    if (record.attempts >= 5) {
      this.passwordResetOTPs.delete(normalized);
    } else {
      this.passwordResetOTPs.set(normalized, record);
    }
    return record.attempts;
  }

  public consumePasswordResetOTP(email: string): boolean {
    const normalized = email.toLowerCase().trim();
    return this.passwordResetOTPs.delete(normalized);
  }

  public saveResetSessionToken(token: string, email: string, expiresInMinutes = 15): void {
    const normalized = email.toLowerCase().trim();
    const expiresAt = Date.now() + expiresInMinutes * 60 * 1000;
    this.resetSessionTokens.set(token, { email: normalized, token, expiresAt });
  }

  public verifyResetSessionToken(token: string): { valid: boolean; email?: string } {
    const record = this.resetSessionTokens.get(token);
    if (!record) return { valid: false };
    if (Date.now() > record.expiresAt) {
      this.resetSessionTokens.delete(token);
      return { valid: false };
    }
    return { valid: true, email: record.email };
  }

  public consumeResetSessionToken(token: string): boolean {
    return this.resetSessionTokens.delete(token);
  }

  // Password Reset Tokens
  public savePasswordResetToken(email: string, token: string, expiresInMinutes = 15): void {
    const expiresAt = Date.now() + expiresInMinutes * 60 * 1000;
    this.passwordResetTokens.set(token, { email: email.toLowerCase().trim(), token, expiresAt });
  }

  public verifyPasswordResetToken(token: string): { valid: boolean; email?: string } {
    const record = this.passwordResetTokens.get(token);
    if (!record) return { valid: false };
    if (Date.now() > record.expiresAt) {
      this.passwordResetTokens.delete(token);
      return { valid: false };
    }
    return { valid: true, email: record.email };
  }

  public consumePasswordResetToken(token: string): boolean {
    return this.passwordResetTokens.delete(token);
  }
}

export const db = new InMemoryDataStore();
