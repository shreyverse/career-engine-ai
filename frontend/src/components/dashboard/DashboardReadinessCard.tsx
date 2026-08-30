import React from 'react';
import { DashboardReadiness } from '../../types/dashboard.types';
import { Award, CheckCircle2, Sparkles, TrendingUp } from 'lucide-react';

interface DashboardReadinessCardProps {
  readiness: DashboardReadiness;
  targetRole: string;
}

export const DashboardReadinessCard: React.FC<DashboardReadinessCardProps> = ({ readiness, targetRole }) => {
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (readiness.overall / 100) * circumference;

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10b981'; // emerald
    if (score >= 65) return '#3b82f6'; // blue
    if (score >= 50) return '#f59e0b'; // amber
    return '#ef4444'; // rose
  };

  const pillars = [
    { label: 'Skills', score: readiness.skills },
    { label: 'Experience', score: readiness.experience },
    { label: 'Projects', score: readiness.projects },
    { label: 'Alignment', score: readiness.careerAlignment },
  ];

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-xl flex flex-col justify-between">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
          <Award className="w-4 h-4 text-emerald-400" />
          <span>Career Readiness Score</span>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
          {readiness.confidence} CONFIDENCE
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-6">
        {/* Circular Ring */}
        <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r={radius} className="stroke-slate-800 fill-none" strokeWidth="10" />
            <circle
              cx="60"
              cy="60"
              r={radius}
              className="fill-none transition-all duration-1000 ease-out"
              stroke={getScoreColor(readiness.overall)}
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-2xl font-extrabold text-white font-mono leading-none">
              {readiness.overall}%
            </span>
            <span className="text-[9px] text-slate-400 font-mono mt-0.5">READY</span>
          </div>
        </div>

        {/* 4 Pillars Breakdown */}
        <div className="flex-1 grid grid-cols-2 gap-3 w-full">
          {pillars.map((p) => (
            <div key={p.label} className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80 space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400 font-medium">{p.label}</span>
                <span className="text-white font-bold font-mono">{p.score}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all duration-700"
                  style={{ width: p.score + '%' }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/80 p-3 rounded-xl border border-slate-800/60 flex items-start gap-2">
        <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <span>{readiness.reasoning}</span>
      </p>
    </div>
  );
};
