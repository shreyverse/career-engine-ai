import { apiRequest } from "./api";
import { FresherAssessmentData, ProfessionalAssessmentData, CareerStage } from "../types";

export interface FresherAssessmentResponse {
  careerType: "FRESHER";
  hasCompletedOnboarding: boolean;
  onboardingStep: number;
  assessment: FresherAssessmentData;
}

export interface ProfessionalAssessmentResponse {
  careerType: "PROFESSIONAL";
  hasCompletedOnboarding: boolean;
  onboardingStep: number;
  assessment: ProfessionalAssessmentData;
}

export const assessmentApi = {
  // Fresher Endpoints
  async getFresherAssessment(): Promise<FresherAssessmentResponse> {
    return apiRequest<FresherAssessmentResponse>("/fresher-assessment");
  },

  async saveFresherStep(step: number, data: Partial<FresherAssessmentData>): Promise<{ step: number; assessment: FresherAssessmentData }> {
    return apiRequest("/fresher-assessment", {
      method: "PUT",
      body: JSON.stringify({ step, data }),
    });
  },

  async completeFresherAssessment(): Promise<any> {
    return apiRequest("/fresher-assessment/complete", {
      method: "POST",
    });
  },

  // Professional Endpoints
  async getProfessionalAssessment(): Promise<ProfessionalAssessmentResponse> {
    return apiRequest<ProfessionalAssessmentResponse>("/professional-assessment");
  },

  async saveProfessionalStep(step: number, data: Partial<ProfessionalAssessmentData>): Promise<{ step: number; assessment: ProfessionalAssessmentData }> {
    return apiRequest("/professional-assessment", {
      method: "PUT",
      body: JSON.stringify({ step, data }),
    });
  },

  async completeProfessionalAssessment(): Promise<any> {
    return apiRequest("/professional-assessment/complete", {
      method: "POST",
    });
  },

  // Onboarding Routing & State Management
  async setCareerType(careerType: CareerStage): Promise<{ user: any; careerType: CareerStage; nextRoute: string }> {
    return apiRequest("/onboarding/career-type", {
      method: "POST",
      body: JSON.stringify({ careerType }),
    });
  },

  async resetOnboarding(newCareerType?: CareerStage): Promise<{ user: any; message: string }> {
    return apiRequest("/onboarding/reset", {
      method: "POST",
      body: JSON.stringify({ newCareerType }),
    });
  },
};
