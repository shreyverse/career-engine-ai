import { db } from '../config/database';
import { CuratedJobProvider, CURATED_JOBS_FEED } from './providers/curatedProvider';
import { JobMatcher } from './jobs.matcher';
import { JobScoringEngine, CandidateProfileForMatching } from './jobs.scoring';
import {
  NormalizedJob,
  MatchedJobResult,
  JobSearchQuery,
  SavedJobRecord,
  JobApplicationRecord,
} from '../types/jobs.types';

export class JobsService {
  private static provider = new CuratedJobProvider();

  public static async searchJobs(userId: string, query: JobSearchQuery): Promise<{ jobs: MatchedJobResult[]; total: number }> {
    const rawJobs = await this.provider.fetchJobs(query);
    const ranked = await JobMatcher.rankJobsForUser(userId, rawJobs);

    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;
    const startIndex = (page - 1) * limit;
    const paginated = ranked.slice(startIndex, startIndex + limit);

    return {
      jobs: paginated,
      total: ranked.length,
    };
  }

  public static async getRecommendedJobs(userId: string, limitCount = 10): Promise<MatchedJobResult[]> {
    const rawJobs = await this.provider.fetchJobs({});
    const ranked = await JobMatcher.rankJobsForUser(userId, rawJobs);
    return ranked.slice(0, limitCount);
  }

  public static async getJobById(userId: string, jobId: string): Promise<MatchedJobResult | null> {
    const job = await this.provider.getJobById(jobId);
    if (!job) return null;
    const rankedList = await JobMatcher.rankJobsForUser(userId, [job]);
    return rankedList[0] || null;
  }

  public static async saveJob(userId: string, jobId: string): Promise<SavedJobRecord> {
    const saved: SavedJobRecord = {
      id: 'save-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
      userId,
      jobId,
      createdAt: new Date().toISOString(),
    };
    return db.saveUserJob(saved);
  }

  public static async unsaveJob(userId: string, jobId: string): Promise<boolean> {
    return db.unsaveUserJob(userId, jobId);
  }

  public static async getSavedJobs(userId: string): Promise<MatchedJobResult[]> {
    const savedRecords = db.getUserSavedJobs(userId);
    const savedJobIds = savedRecords.map((s) => s.jobId);
    const allJobs = await this.provider.fetchJobs({});
    const savedJobsList = allJobs.filter((j) => savedJobIds.includes(j.id));
    return JobMatcher.rankJobsForUser(userId, savedJobsList);
  }

  // Applications
  public static async createApplication(
    userId: string,
    data: {
      jobId: string;
      jobTitle: string;
      company: string;
      location?: string;
      status?: any;
      notes?: string;
      appliedAt?: string;
      interviewDate?: string;
      salaryOffered?: string;
    }
  ): Promise<JobApplicationRecord> {
    const record: JobApplicationRecord = {
      id: 'app-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
      userId,
      jobId: data.jobId,
      jobTitle: data.jobTitle,
      company: data.company,
      location: data.location || 'Remote',
      status: data.status || 'APPLIED',
      notes: data.notes,
      appliedAt: data.appliedAt || new Date().toISOString(),
      interviewDate: data.interviewDate,
      salaryOffered: data.salaryOffered,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return db.saveJobApplication(record);
  }

  public static async updateApplication(
    userId: string,
    id: string,
    updates: Partial<JobApplicationRecord>
  ): Promise<JobApplicationRecord | null> {
    return db.updateJobApplication(userId, id, updates);
  }

  public static async getApplications(userId: string): Promise<JobApplicationRecord[]> {
    return db.getUserJobApplications(userId);
  }

  public static async deleteApplication(userId: string, id: string): Promise<boolean> {
    return db.deleteJobApplication(userId, id);
  }
}
