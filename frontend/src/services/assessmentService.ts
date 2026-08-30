import { apiRequest } from "./api";

export interface FresherAssessmentPayload {
  degree: string;
  major: string;
  graduationYear: number;
  institution: string;
  gpa?: number;
  primaryInterests: string[];
  knownTechnologies: string[];
  projectSummary?: string;
  preferredCareerTracks: string[];
}

export interface ProfessionalAssessmentPayload {
  currentRole: string;
  currentCompany?: string;
  totalExperienceMonths: number;
  currentTechStack: string[];
  targetRole: string;
  motivationForChange?: string;
  challengesFaced?: string;
}

export interface AssessmentResponse {
  assessment: any;
  profile: any;
  user: any;
}

export const assessmentService = {
  async submitFresher(data: FresherAssessmentPayload): Promise<AssessmentResponse> {
    return apiRequest<AssessmentResponse>("/assessments/fresher", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async submitProfessional(data: ProfessionalAssessmentPayload): Promise<AssessmentResponse> {
    return apiRequest<AssessmentResponse>("/assessments/professional", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async getMyAssessment(): Promise<{ careerStage: string; isOnboarded: boolean; profile: any; assessment: any }> {
    return apiRequest("/assessments/me");
  },
};
