import React from 'react';
import { ATSMatchCategory } from '../../types/ats.types';

interface ATSScoreGaugeProps {
  score: number;
  matchLevel: ATSMatchCategory;
  size?: number;
}

export const ATSScoreGauge: React.FC<ATSScoreGaugeProps> = ({ score, matchLevel, size = 160 }) => {
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getColor = () => {
    if (score >= 85) return '#10b981'; // emerald
    if (score >= 70) return '#3b82f6'; // blue
    if (score >= 50) return '#f59e0b'; // amber
    return '#ef4444'; // rose
  };

  const getBadgeStyle = () => {
    switch (matchLevel) {
      case 'STRONG':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'GOOD':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'MODERATE':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      default:
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
          {/* Background circle */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            className="stroke-slate-800 fill-none"
            strokeWidth="12"
          />
          {/* Progress circle */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            className="fill-none transition-all duration-1000 ease-out"
            stroke={getColor()}
            strokeWidth="12"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-4xl font-extrabold tracking-tight text-white font-mono">
            {score}
          </span>
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
            / 100
          </span>
        </div>
      </div>
      <div className={'mt-3 px-3 py-1 rounded-full text-xs font-bold border tracking-wide uppercase ' + getBadgeStyle()}>
        {matchLevel.replace(/_/g, ' ')}
      </div>
    </div>
  );
};
