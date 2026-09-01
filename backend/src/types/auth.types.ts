export type CareerStage = "FRESHER" | "PROFESSIONAL" | "CAREER_CHANGER" | "STUDENT";
export type UserRole = "USER" | "ADMIN" | "MENTOR";
export type SkillLevel = "BEGINNER" | "BASIC" | "INTERMEDIATE" | "ADVANCED";
export type ResumeOption = "UPLOAD" | "BUILD" | "SKIP";

export interface UserDto {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string | null;
  role: UserRole;
  authProvider?: "local" | "google";
  careerStage: CareerStage;
  careerType?: CareerStage | null;
  isOnboarded: boolean;
  hasCompletedOnboarding: boolean;
  onboardingStep: number;
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  accessToken: string;
  tokenType: string;
  expiresIn: string;
}

export interface AuthResponseData {
  user: UserDto;
  token: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  fullName: string;
  careerStage?: CareerStage;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface JwtPayload {
  userId: string;
  email: string;
  role: UserRole;
}

// -------------------------------------------------------
// FRESHER ASSESSMENT STRUCTURE
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

// -------------------------------------------------------
// PROFESSIONAL ASSESSMENT STRUCTURE
// -------------------------------------------------------

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

export interface GoogleAuthDto {
  credential: string;
}
