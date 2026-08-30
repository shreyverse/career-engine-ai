import { NormalizedJob, JobSearchQuery } from '../types/jobs.types';

export interface JobProvider {
  name: string;
  fetchJobs(query: JobSearchQuery): Promise<NormalizedJob[]>;
  getJobById(id: string): Promise<NormalizedJob | null>;
}
