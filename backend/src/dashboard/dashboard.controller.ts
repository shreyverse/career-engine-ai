import { Request, Response } from 'express';
import { DashboardService } from './dashboard.service';

export const getDashboardData = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.userId;
    const data = await DashboardService.getDashboardData(userId);
    res.status(200).json({
      success: true,
      data,
      meta: { timestamp: new Date().toISOString() },
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: { code: 'DASHBOARD_FETCH_FAILED', message: err.message },
    });
  }
};
