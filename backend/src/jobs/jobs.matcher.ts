import { NormalizedJob, MatchedJobResult } from '../types/jobs.types';
import { JobScoringEngine, CandidateProfileForMatching } from './jobs.scoring';
import { db } from '../config/database';

export class JobMatcher {
  public static async rankJobsForUser(
    userId: string,
    jobs: NormalizedJob[]
  ): Promise<MatchedJobResult[]> {
    const user = await db.findUserById(userId);
    if (!user) throw new Error('User not found');

    const profile = await db.getCareerProfile(userId);
    const careerAnalysisRecord = await db.getCareerAnalysis(userId);
    const analysis = careerAnalysisRecord?.analysisData;
    const skillProgressMap = await db.getUserSkillProgressMap(userId);
    const savedJobs = db.getUserSavedJobs(userId);
    const applications = db.getUserJobApplications(userId);

    const candidateSkills = Array.from(skillProgressMap.keys());
    if (candidateSkills.length === 0) {
      candidateSkills.push('react', 'typescript', 'javascript', 'node.js', 'html', 'css', 'git', 'rest apis');
    }

    const candidate: CandidateProfileForMatching = {
      careerStage: user.careerStage,
      targetRole: profile?.targetRole || analysis?.targetRole || (user.careerStage === 'FRESHER' ? 'Software Engineer' : 'Senior Fullstack Engineer'),
      currentLevel: analysis?.currentLevel || (user.careerStage === 'FRESHER' ? 'ENTRY' : 'SENIOR'),
      skills: candidateSkills,
      strengths: analysis?.strengths || [],
      weaknesses: analysis?.weaknesses || [],
      projects: [{ name: 'Fullstack Platform', technologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'] }],
      preferredWorkMode: profile?.preferredWorkMode,
    };

    const savedJobIdSet = new Set(savedJobs.map((s) => s.jobId));
    const applicationMap = new Map(applications.map((a) => [a.jobId, a.status]));

    const matchedResults: MatchedJobResult[] = jobs.map((job) => {
      const match = JobScoringEngine.calculateMatchScore(candidate, job);
      return {
        job,
        match,
        isSaved: savedJobIdSet.has(job.id),
        applicationStatus: applicationMap.get(job.id) || null,
      };
    });

    // Sort by Match Score descending
    return matchedResults.sort((a, b) => b.match.score - a.match.score);
  }
}
