export type CareerStage = "FRESHER" | "PROFESSIONAL" | "CAREER_CHANGER" | "STUDENT";
export type UserRole = "USER" | "ADMIN" | "MENTOR";
export type SkillLevel = "BEGINNER" | "BASIC" | "INTERMEDIATE" | "ADVANCED";
export type ResumeOption = "UPLOAD" | "BUILD" | "SKIP";

export interface NavItem {
  label: string;
  href: string;
  isExternal?: boolean;
  badge?: string;
  icon?: string;
}

export interface StepItem {
  number: number;
  title: string;
  description: string;
  iconName: string;
}

export interface FeatureItem {
  id: string;
  title: string;
  tagline: string;
  description: string;
  iconName: string;
  badge?: string;
  status?: "Available" | "Coming Soon" | "Phase 2" | "Phase 3";
}

export interface MetricItem {
  label: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  subtext?: string;
}

export interface ToastMessage {
  id: string;
  title?: string;
  message: string;
  type?: "info" | "success" | "warning" | "error";
  durationMs?: number;
}

// -------------------------------------------------------
// ASSESSMENT DATA MODELS
// -------------------------------------------------------

export interface TechSkillItem {
  name: string;
  level: SkillLevel;
}

export interface ProjectItem {
  id?: string;
  name: string;
  description: string;
  technologies: string[];
  projectUrl?: string;
  githubUrl?: string;
  roleContribution?: string;
}

export interface InternshipItem {
  id?: string;
  company: string;
  role: string;
  duration: string;
  description: string;
  technologies?: string[];
}

export interface CertificationItem {
  id?: string;
  name: string;
  organization: string;
  year: number | string;
  credentialUrl?: string;
}

export interface AchievementItem {
  id?: string;
  title: string;
  description: string;
  year: number | string;
}

export interface FresherAssessmentData {
  education: {
    degree: string;
    branchMajor: string;
    collegeUniversity: string;
    graduationYear: number;
    currentYearSemester?: string;
  };
  technicalBackground: {
    programmingLanguages: TechSkillItem[];
    frameworks: TechSkillItem[];
    databases: TechSkillItem[];
    tools: TechSkillItem[];
  };
  interests: string[];
  careerGoal: {
    targetRole: string;
    preferredIndustry: string;
    companyType: string[];
    shortTermGoal: string;
    longTermGoal: string;
  };
  experience: {
    projects: ProjectItem[];
    internships: InternshipItem[];
    certifications: CertificationItem[];
    achievements: AchievementItem[];
    extracurriculars: string[];
  };
  resume: {
    resumeOption: ResumeOption;
  };
  currentStep: number;
  completedAt?: string | null;
}

export interface ProfessionalAssessmentData {
  currentCareer: {
    currentRole: string;
    yearsOfExperience: number;
    industry: string;
    company?: string;
    responsibilities?: string;
  };
  skills: {
    technicalSkills: TechSkillItem[];
    frameworks: TechSkillItem[];
    tools: TechSkillItem[];
    domainSkills: TechSkillItem[];
  };
  careerGoal: {
    lookingFor: string[];
    primaryMotivation?: string;
  };
  targetRole: {
    targetRole: string;
    targetIndustry: string;
    preferredCompanyType: string[];
  };
  challenges: {
    careerChallenges: string[];
    challengeDetails?: string;
  };
  resume: {
    resumeOption: ResumeOption;
  };
  currentStep: number;
  completedAt?: string | null;
}
