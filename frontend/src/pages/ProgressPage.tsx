import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { dashboardApi } from '../services/dashboardApi';
import { DashboardAggregatedResponse } from '../types/dashboard.types';
import { ProgressTimeline } from '../components/progress/ProgressTimeline';
import {
  TrendingUp,
  Award,
  CheckCircle2,
  Layers,
  FileText,
  Sparkles,
  Clock,
  ArrowRight,
  ShieldCheck,
  Activity,
} from 'lucide-react';

export const ProgressPage: React.FC = () => {
  const [data, setData] = useState<DashboardAggregatedResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProgressData();
  }, []);

  const loadProgressData = async () => {
    setLoading(true);
    try {
      const res = await dashboardApi.getDashboardData();
      setData(res);
    } catch (err: any) {
      setError(err.message || 'Failed to load progress metrics.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 space-y-4">
        <div className="w-10 h-10 border-3 border-emerald-500/20 border-t-emerald-400 rounded-full animate-spin" />
        <p className="text-xs text-slate-400 font-mono">Loading Progress & Momentum Center...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-slate-950 p-8 text-center text-slate-400">
        {error || 'No progress data available.'}
      </div>
    );
  }

  const { progress, readiness, career, topStrengths, topWeaknesses, topRecommendedTech } = data;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-mono uppercase tracking-wider mb-1">
            <TrendingUp className="w-4 h-4" />
            <span>Growth Velocity & Momentum</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Career Progress Center
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1 max-w-2xl">
            Track your milestone completions, roadmap throughput, active skill improvements, and ATS score
            progression over time.
          </p>
        </div>

        <Link
          to="/dashboard"
          className="px-4 py-2 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl text-xs font-semibold text-slate-300 hover:text-white transition-colors self-start md:self-auto"
        >
          Back to Dashboard
        </Link>
      </div>

      {/* 1. Metric Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-mono">Career Readiness</span>
          <div className="text-2xl font-bold text-white font-mono">{progress.readinessScore}%</div>
          <span className="text-[10px] text-emerald-400">Target: {career.targetRole}</span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-mono">Roadmap Progress</span>
          <div className="text-2xl font-bold text-white font-mono">{progress.roadmapCompletion}%</div>
          <span className="text-[10px] text-slate-400">Verified tasks</span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-mono">Skills Tracked</span>
          <div className="text-2xl font-bold text-white font-mono">
            {progress.skillsCompletedCount} / {progress.totalSkillsTracked}
          </div>
          <span className="text-[10px] text-slate-400">Completed gaps</span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-mono">Resume Score</span>
          <div className="text-2xl font-bold text-white font-mono">{progress.resumeCompleteness}%</div>
          <span className="text-[10px] text-slate-400">Completeness</span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-1 col-span-2 lg:col-span-1">
          <span className="text-[10px] text-slate-400 uppercase font-mono">ATS Diagnostic</span>
          <div className="text-2xl font-bold text-white font-mono">
            {progress.atsScoreLatest !== null ? progress.atsScoreLatest + ' / 100' : '—'}
          </div>
          <span className="text-[10px] text-emerald-400 font-mono">
            {progress.atsScoreDelta !== null
              ? (progress.atsScoreDelta >= 0 ? '+' : '') + progress.atsScoreDelta + ' pts revision delta'
              : 'Baseline score'}
          </span>
        </div>
      </div>

      {/* 2. Grid: Milestones & Skills Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Milestone Timeline */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Career Milestone History</span>
            </div>
          </div>
          <ProgressTimeline milestones={progress.milestones} />
        </div>

        {/* Right: Skills Acceleration & ATS Trend */}
        <div className="space-y-6">
          {/* Active Skills Velocity */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
                <Layers className="w-4 h-4 text-emerald-400" />
                <span>Tracked Skills Acceleration</span>
              </div>
              <Link to="/skills" className="text-xs text-emerald-400 hover:underline">
                Manage Skills
              </Link>
            </div>

            <div className="space-y-3">
              {progress.trackedSkills.length === 0 ? (
                <p className="text-xs text-slate-500 italic">No skills tracked yet.</p>
              ) : (
                progress.trackedSkills.map((sk) => (
                  <div key={sk.name} className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-200">{sk.name}</span>
                      <span className="font-mono text-emerald-400 font-semibold">{sk.progress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all duration-700"
                        style={{ width: sk.progress + '%' }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* ATS Score Trend */}
          {progress.atsHistory.length > 0 && (
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center space-x-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <span>ATS Score Revision Trend</span>
                </div>
                <Link to="/resume/ats" className="text-xs text-emerald-400 hover:underline">
                  New Analysis
                </Link>
              </div>

              <div className="space-y-2.5">
                {progress.atsHistory.map((item, idx) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-200 block">{item.targetRole}</span>
                      <span className="text-[10px] text-slate-500 font-mono">{item.date}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-emerald-400 font-mono">{item.score} / 100</span>
                      {idx === 0 && (
                        <span className="block text-[9px] text-slate-400 uppercase font-mono">Latest Revision</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
