export type RemoteType = 'REMOTE' | 'HYBRID' | 'ON_SITE';
export type EmploymentType = 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP';
export type ExperienceLevel = 'ENTRY' | 'MID' | 'SENIOR';
export type ApplicationStatus = 'SAVED' | 'INTERESTED' | 'APPLIED' | 'INTERVIEW' | 'OFFER' | 'REJECTED';

export interface JobSalary {
  min: number | null;
  max: number | null;
  currency: string;
  period?: 'YEAR' | 'MONTH' | 'HOUR';
}

export interface NormalizedJob {
  id: string;
  source: string;
  sourceJobId: string;
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
  remoteType: RemoteType;
  employmentType: EmploymentType;
  experienceLevel: ExperienceLevel;
  description: string;
  requirements: string[];
  preferredSkills: string[];
  technologies: string[];
  experienceRequirement: string;
  educationRequirement?: string;
  salary: JobSalary;
  applicationUrl: string;
  postedAt: string;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface JobMatchBreakdown {
  overall: number;
  roleAlignment: number;
  skillMatch: number;
  experienceMatch: number;
  projectDomainRelevance: number;
  locationPreference: number;
  careerGoalAlignment: number;
}

export interface JobMatchScore {
  jobId: string;
  score: number;
  matchCategory: 'STRONG_MATCH' | 'STRETCH_OPPORTUNITY' | 'LONG_SHOT';
  breakdown: JobMatchBreakdown;
  matchedSkills: string[];
  missingRequiredSkills: string[];
  missingPreferredSkills: string[];
  whyItFits: string[];
  potentialGaps: string[];
}

export interface MatchedJobResult {
  job: NormalizedJob;
  match: JobMatchScore;
  isSaved?: boolean;
  applicationStatus?: ApplicationStatus | null;
}

export interface SavedJobRecord {
  id: string;
  userId: string;
  jobId: string;
  notes?: string;
  createdAt: string;
}

export interface JobApplicationRecord {
  id: string;
  userId: string;
  jobId: string;
  jobTitle: string;
  company: string;
  location: string;
  status: ApplicationStatus;
  notes?: string;
  appliedAt?: string;
  interviewDate?: string;
  salaryOffered?: string;
  createdAt: string;
  updatedAt: string;
}

export interface JobSearchFilters {
  query?: string;
  location?: string;
  remote?: boolean;
  remoteType?: RemoteType;
  employmentType?: EmploymentType;
  experienceLevel?: ExperienceLevel;
}
