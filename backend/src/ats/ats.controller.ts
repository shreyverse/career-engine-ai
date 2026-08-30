import { Request, Response } from 'express';
import { ATSService } from './ats.service';
import { ATSAnalysisRequestSchema } from './ats.schema';

export const analyzeResume = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.userId;
    const parsed = ATSAnalysisRequestSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Invalid analysis input.', details: parsed.error.issues },
      });
      return;
    }

    const result = await ATSService.analyzeResume(
      userId,
      parsed.data.resumeId,
      parsed.data.targetRole,
      parsed.data.jobDescription
    );

    res.status(200).json({
      success: true,
      data: result,
      meta: { timestamp: new Date().toISOString() },
    });
  } catch (err: any) {
    res.status(err.message.includes('not found') ? 404 : 500).json({
      success: false,
      error: { code: 'ATS_ANALYSIS_FAILED', message: err.message },
    });
  }
};

export const getAnalysis = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.userId;
    const analysisId = req.params.analysisId as string;
    const result = await ATSService.getAnalysisById(userId, analysisId);
    res.status(200).json({ success: true, data: result });
  } catch (err: any) {
    res.status(404).json({ success: false, error: { message: err.message } });
  }
};

export const listAnalyses = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.userId;
    const history = await ATSService.getUserHistory(userId);
    res.status(200).json({ success: true, data: history });
  } catch (err: any) {
    res.status(500).json({ success: false, error: { message: err.message } });
  }
};

export const compareAnalyses = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.userId;
    const first = req.query.first as string;
    const second = req.query.second as string;

    if (!first || !second) {
      res.status(400).json({ success: false, error: { message: 'Parameters "first" and "second" analysis IDs are required.' } });
      return;
    }

    const comparison = await ATSService.compareAnalyses(userId, first, second);
    res.status(200).json({ success: true, data: comparison });
  } catch (err: any) {
    res.status(400).json({ success: false, error: { message: err.message } });
  }
};
