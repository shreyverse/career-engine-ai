import { z } from 'zod';

export const jobSearchSchema = z.object({
  query: z.string().optional(),
  location: z.string().optional(),
  remote: z.enum(['true', 'false']).optional(),
  remoteType: z.enum(['REMOTE', 'HYBRID', 'ON_SITE']).optional(),
  employmentType: z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP']).optional(),
  experienceLevel: z.enum(['ENTRY', 'MID', 'SENIOR']).optional(),
  postedWithinDays: z.string().optional(),
  page: z.string().optional(),
  limit: z.string().optional(),
});

export const createApplicationSchema = z.object({
  jobId: z.string().min(1, 'jobId is required'),
  jobTitle: z.string().min(1, 'jobTitle is required'),
  company: z.string().min(1, 'company is required'),
  location: z.string().optional().default('Remote'),
  status: z.enum(['SAVED', 'INTERESTED', 'APPLIED', 'INTERVIEW', 'OFFER', 'REJECTED']).default('APPLIED'),
  notes: z.string().max(2000).optional(),
  appliedAt: z.string().optional(),
  interviewDate: z.string().optional(),
  salaryOffered: z.string().optional(),
});

export const updateApplicationSchema = z.object({
  status: z.enum(['SAVED', 'INTERESTED', 'APPLIED', 'INTERVIEW', 'OFFER', 'REJECTED']).optional(),
  notes: z.string().max(2000).optional(),
  interviewDate: z.string().optional(),
  salaryOffered: z.string().optional(),
});
