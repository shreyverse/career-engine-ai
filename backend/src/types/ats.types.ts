export type ATSMatchCategory = 'STRONG' | 'GOOD' | 'MODERATE' | 'NEEDS_IMPROVEMENT';

export interface ATSScoreBreakdown {
  overall: number;
  keywordMatch: number;
  experienceRelevance: number;
  projectRelevance: number;
  roleAlignment: number;
  structureCompleteness: number;
  contentQuality: number;
}

export interface ATSMatchedKeyword {
  term: string;
  category: string;
  frequencyInResume: number;
}

export interface ATSMissingKeyword {
  term: string;
  category: string;
  importance: 'REQUIRED' | 'PREFERRED';
  reason: string;
}

export interface ATSRelatedKeyword {
  resumeTerm: string;
  jdTerm: string;
  explanation: string;
}

export interface ATSIrrelevantKeyword {
  term: string;
  reason: string;
}

export interface ATSKeywordMatchResult {
  matched: ATSMatchedKeyword[];
  missing: ATSMissingKeyword[];
  related: ATSRelatedKeyword[];
  irrelevant: ATSIrrelevantKeyword[];
}

export interface ATSStrengthItem {
  title: string;
  explanation: string;
}

export interface ATSMissingSkillItem {
  skill: string;
  importance: 'HIGH' | 'MEDIUM' | 'LOW';
  reason: string;
  action: 'ADD_IF_GENUINE' | 'LEARN';
}

export type ATSRecommendationType =
  | 'CONTENT'
  | 'SKILL'
  | 'KEYWORD'
  | 'STRUCTURE'
  | 'EXPERIENCE'
  | 'PROJECT'
  | 'FORMATTING';

export interface ATSRecommendationItem {
  id: string;
  type: ATSRecommendationType;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  title: string;
  reason: string;
  action: string;
  beforeAfter?: {
    before: string;
    after: string;
    section: string;
    targetId?: string;
  };
}

export interface ATSAnalysisRecord {
  id: string;
  userId: string;
  resumeId: string;
  resumeName: string;
  targetRole: string;
  jobDescription?: string;
  jobDescriptionHash?: string;
  careerStage: 'FRESHER' | 'PROFESSIONAL';
  score: number;
  matchLevel: ATSMatchCategory;
  scoreBreakdown: ATSScoreBreakdown;
  keywords: ATSKeywordMatchResult;
  strengths: ATSStrengthItem[];
  weaknesses: ATSMissingSkillItem[];
  recommendations: ATSRecommendationItem[];
  formatHealth: {
    atsFriendlySections: boolean;
    clearHeadings: boolean;
    dateConsistency: boolean;
    bulletDensityGood: boolean;
    notes: string[];
  };
  createdAt: Date;
}

export interface ATSAnalysisRequestDto {
  resumeId: string;
  targetRole: string;
  jobDescription?: string;
}

export interface ATSComparisonResult {
  firstAnalysis: ATSAnalysisRecord;
  secondAnalysis: ATSAnalysisRecord;
  scoreDelta: number;
  newMatchedKeywords: string[];
  remainingGaps: string[];
  resolvedWeaknesses: string[];
  summary: string;
}
