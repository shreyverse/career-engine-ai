import { z } from 'zod';
import { ResumeData } from '../types/resume.types';

export const ResumePersonalInfoSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email address').or(z.string().min(1)),
  phone: z.string().max(30).optional().default(''),
  location: z.string().max(100).optional().default(''),
  linkedin: z.string().max(200).optional().default(''),
  github: z.string().max(200).optional().default(''),
  portfolio: z.string().max(200).optional().default(''),
});

export const ResumeEducationSchema = z.object({
  id: z.string().default(() => 'edu-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5)),
  institution: z.string().min(1, 'Institution is required'),
  degree: z.string().min(1, 'Degree is required'),
  field: z.string().optional().default(''),
  startDate: z.string().optional().default(''),
  endDate: z.string().optional().default(''),
  grade: z.string().optional().default(''),
  current: z.boolean().optional().default(false),
});

export const ResumeExperienceSchema = z.object({
  id: z.string().default(() => 'exp-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5)),
  company: z.string().min(1, 'Company is required'),
  role: z.string().min(1, 'Role is required'),
  location: z.string().optional().default(''),
  startDate: z.string().optional().default(''),
  endDate: z.string().optional().default(''),
  current: z.boolean().optional().default(false),
  description: z.string().optional().default(''),
  achievements: z.array(z.string()).default([]),
});

export const ResumeSkillSchema = z.object({
  id: z.string().default(() => 'skill-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5)),
  name: z.string().min(1, 'Skill name is required'),
  category: z.enum(['TECHNICAL', 'TOOLS', 'DATABASE', 'CLOUD', 'SOFT_SKILL', 'DOMAIN']).default('TECHNICAL'),
  level: z.enum(['BASIC', 'INTERMEDIATE', 'ADVANCED']).optional().default('INTERMEDIATE'),
});

export const ResumeProjectSchema = z.object({
  id: z.string().default(() => 'proj-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5)),
  name: z.string().min(1, 'Project name is required'),
  description: z.string().optional().default(''),
  technologies: z.array(z.string()).default([]),
  url: z.string().optional().default(''),
  githubUrl: z.string().optional().default(''),
  highlights: z.array(z.string()).default([]),
});

export const ResumeCertificationSchema = z.object({
  id: z.string().default(() => 'cert-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5)),
  name: z.string().min(1, 'Certification name is required'),
  issuer: z.string().min(1, 'Issuer is required'),
  issueDate: z.string().optional().default(''),
  url: z.string().optional().default(''),
});

export const ResumeAchievementSchema = z.object({
  id: z.string().default(() => 'ach-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5)),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional().default(''),
  date: z.string().optional().default(''),
});

export const ResumeDataSchema = z.object({
  personal: ResumePersonalInfoSchema,
  summary: z.string().optional().default(''),
  education: z.array(ResumeEducationSchema).default([]),
  experience: z.array(ResumeExperienceSchema).default([]),
  skills: z.array(ResumeSkillSchema).default([]),
  projects: z.array(ResumeProjectSchema).default([]),
  certifications: z.array(ResumeCertificationSchema).default([]),
  achievements: z.array(ResumeAchievementSchema).default([]),
  additional: z.array(z.string()).optional().default([]),
  targetRole: z.string().optional(),
});

export const CreateResumeSchema = z.object({
  name: z.string().min(1, 'Resume name is required').max(100),
  targetRole: z.string().min(1, 'Target role is required').max(100),
  status: z.enum(['DRAFT', 'READY', 'ARCHIVED']).optional().default('DRAFT'),
  data: ResumeDataSchema.optional(),
});

export const UpdateResumeSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  targetRole: z.string().min(1).max(100).optional(),
  status: z.enum(['DRAFT', 'READY', 'ARCHIVED']).optional(),
  data: ResumeDataSchema.optional(),
});

export const ResumeImprovementSchema = z.object({
  section: z.enum(['summary', 'experience', 'project', 'achievement']),
  itemId: z.string().optional(),
  content: z.string().min(5, 'Content must be at least 5 characters to improve').max(2000),
  targetRole: z.string().optional(),
});

export function calculateResumeCompleteness(data: Partial<ResumeData>): number {
  if (!data) return 0;
  let score = 0;

  if (data.personal && data.personal.name && data.personal.email) score += 15;
  if (data.personal && (data.personal.phone || data.personal.linkedin || data.personal.github)) score += 10;

  if (data.summary && data.summary.trim().length >= 30) score += 15;
  else if (data.summary && data.summary.trim().length > 0) score += 5;

  if (data.experience && data.experience.length > 0) {
    const hasDetail = data.experience.some((e) => (e.description && e.description.length > 20) || (e.achievements && e.achievements.length > 0));
    score += hasDetail ? 20 : 10;
  }

  if (data.education && data.education.length > 0) score += 15;

  if (data.skills && data.skills.length >= 3) score += 15;
  else if (data.skills && data.skills.length > 0) score += 5;

  if ((data.projects && data.projects.length > 0) || (data.certifications && data.certifications.length > 0)) score += 10;

  return Math.min(100, Math.max(0, score));
}
