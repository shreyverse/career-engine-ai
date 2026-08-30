export type ResumeStatus = 'DRAFT' | 'READY' | 'ARCHIVED';

export type SkillCategory =
  | 'TECHNICAL'
  | 'TOOLS'
  | 'DATABASE'
  | 'CLOUD'
  | 'SOFT_SKILL'
  | 'DOMAIN';

export interface ResumePersonalInfo {
  name: string;
  email: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
}

export interface ResumeEducation {
  id: string;
  institution: string;
  degree: string;
  field?: string;
  startDate?: string;
  endDate?: string;
  grade?: string;
  current?: boolean;
}

export interface ResumeExperience {
  id: string;
  company: string;
  role: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  current?: boolean;
  description?: string;
  achievements: string[];
}

export interface ResumeSkill {
  id: string;
  name: string;
  category: SkillCategory;
  level?: 'BASIC' | 'INTERMEDIATE' | 'ADVANCED';
}

export interface ResumeProject {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  url?: string;
  githubUrl?: string;
  highlights: string[];
}

export interface ResumeCertification {
  id: string;
  name: string;
  issuer: string;
  issueDate?: string;
  url?: string;
}

export interface ResumeAchievement {
  id: string;
  title: string;
  description?: string;
  date?: string;
}

export interface ResumeData {
  personal: ResumePersonalInfo;
  summary: string;
  education: ResumeEducation[];
  experience: ResumeExperience[];
  skills: ResumeSkill[];
  projects: ResumeProject[];
  certifications: ResumeCertification[];
  achievements: ResumeAchievement[];
  additional?: string[];
  targetRole?: string;
}

export interface StoredResumeRecord {
  id: string;
  userId: string;
  name: string;
  targetRole: string;
  version: number;
  status: ResumeStatus;
  completeness: number;
  data: ResumeData;
  createdAt: string;
  updatedAt: string;
}

export interface StoredResumeFileRecord {
  id: string;
  resumeId?: string;
  userId: string;
  storageKey: string;
  originalFileName: string;
  mimeType: string;
  fileSize: number;
  extractedText?: string;
  createdAt: string;
}

export interface ResumeImprovementRequest {
  section: 'summary' | 'experience' | 'project' | 'achievement';
  itemId?: string;
  content: string;
  targetRole?: string;
}

export interface ResumeImprovementResponse {
  originalContent: string;
  improvedContent: string;
  explanation: string;
}
