import { Request, Response } from 'express';
import { JobsService } from './jobs.service';
import { jobSearchSchema, createApplicationSchema, updateApplicationSchema } from './jobs.schema';

export const searchJobs = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.userId;
    const parsed = jobSearchSchema.parse(req.query);
    const result = await JobsService.searchJobs(userId, {
      ...parsed,
      remote: parsed.remote === 'true',
      postedWithinDays: parsed.postedWithinDays ? Number(parsed.postedWithinDays) : undefined,
      page: parsed.page ? Number(parsed.page) : 1,
      limit: parsed.limit ? Number(parsed.limit) : 20,
    });
    res.status(200).json({
      success: true,
      data: result.jobs,
      meta: { total: result.total, page: parsed.page || 1, limit: parsed.limit || 20 },
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      error: { code: 'JOB_SEARCH_FAILED', message: err.message },
    });
  }
};

export const getRecommendedJobs = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.userId;
    const jobs = await JobsService.getRecommendedJobs(userId);
    res.status(200).json({
      success: true,
      data: jobs,
      meta: { count: jobs.length },
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: { code: 'RECOMMENDATIONS_FETCH_FAILED', message: err.message },
    });
  }
};

export const getJobById = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.userId;
    const jobId = req.params.jobId as string;
    const result = await JobsService.getJobById(userId, jobId);
    if (!result) {
      res.status(404).json({
        success: false,
        error: { code: 'JOB_NOT_FOUND', message: 'Job listing not found.' },
      });
      return;
    }
    res.status(200).json({
      success: true,
      data: result,
      meta: { timestamp: new Date().toISOString() },
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: { code: 'JOB_FETCH_FAILED', message: err.message },
    });
  }
};

export const saveJob = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.userId;
    const jobId = req.params.jobId as string;
    const saved = await JobsService.saveJob(userId, jobId);
    res.status(200).json({
      success: true,
      data: saved,
      meta: { timestamp: new Date().toISOString() },
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: { code: 'JOB_SAVE_FAILED', message: err.message },
    });
  }
};

export const unsaveJob = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.userId;
    const jobId = req.params.jobId as string;
    await JobsService.unsaveJob(userId, jobId);
    res.status(200).json({
      success: true,
      data: { unsaved: true },
      meta: { timestamp: new Date().toISOString() },
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: { code: 'JOB_UNSAVE_FAILED', message: err.message },
    });
  }
};

export const getSavedJobs = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.userId;
    const list = await JobsService.getSavedJobs(userId);
    res.status(200).json({
      success: true,
      data: list,
      meta: { count: list.length },
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: { code: 'SAVED_JOBS_FETCH_FAILED', message: err.message },
    });
  }
};

// Applications Controller
export const createApplication = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.userId;
    const parsed = createApplicationSchema.parse(req.body);
    const created = await JobsService.createApplication(userId, parsed);
    res.status(201).json({
      success: true,
      data: created,
      meta: { timestamp: new Date().toISOString() },
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      error: { code: 'APPLICATION_CREATE_FAILED', message: err.message },
    });
  }
};

export const updateApplication = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.userId;
    const id = req.params.id as string;
    const parsed = updateApplicationSchema.parse(req.body);
    const updated = await JobsService.updateApplication(userId, id, parsed);
    if (!updated) {
      res.status(404).json({
        success: false,
        error: { code: 'APPLICATION_NOT_FOUND', message: 'Application record not found.' },
      });
      return;
    }
    res.status(200).json({
      success: true,
      data: updated,
      meta: { timestamp: new Date().toISOString() },
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      error: { code: 'APPLICATION_UPDATE_FAILED', message: err.message },
    });
  }
};

export const getApplications = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.userId;
    const list = await JobsService.getApplications(userId);
    res.status(200).json({
      success: true,
      data: list,
      meta: { count: list.length },
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: { code: 'APPLICATIONS_FETCH_FAILED', message: err.message },
    });
  }
};

export const deleteApplication = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.userId;
    const id = req.params.id as string;
    const ok = await JobsService.deleteApplication(userId, id);
    if (!ok) {
      res.status(404).json({
        success: false,
        error: { code: 'APPLICATION_NOT_FOUND', message: 'Application record not found.' },
      });
      return;
    }
    res.status(200).json({
      success: true,
      data: { deleted: true },
      meta: { timestamp: new Date().toISOString() },
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: { code: 'APPLICATION_DELETE_FAILED', message: err.message },
    });
  }
};
