import React from 'react';
import { ATSScoreBreakdown as IBreakdown } from '../../types/ats.types';
import { Key, Briefcase, Layers, Compass, Layout, CheckCircle2 } from 'lucide-react';

interface ATSScoreBreakdownProps {
  breakdown: IBreakdown;
  careerStage: 'FRESHER' | 'PROFESSIONAL';
}

export const ATSScoreBreakdown: React.FC<ATSScoreBreakdownProps> = ({ breakdown, careerStage }) => {
  const metrics = [
    {
      label: 'Keyword Match',
      score: breakdown.keywordMatch,
      weight: '30%',
      icon: Key,
      desc: 'Technical terms, libraries, and role vocabulary',
    },
    {
      label: 'Experience Relevance',
      score: breakdown.experienceRelevance,
      weight: careerStage === 'FRESHER' ? '5%' : '20%',
      icon: Briefcase,
      desc: careerStage === 'FRESHER' ? 'Adjusted for early-career profile' : 'Direct industry responsibility relevance',
    },
    {
      label: 'Project Depth',
      score: breakdown.projectRelevance,
      weight: careerStage === 'FRESHER' ? '30%' : '15%',
      icon: Layers,
      desc: careerStage === 'FRESHER' ? 'Primary evaluation pillar for freshers' : 'Hands-on system architectures built',
    },
    {
      label: 'Role Alignment',
      score: breakdown.roleAlignment,
      weight: '15%',
      icon: Compass,
      desc: 'Overall positioning and targeted domain scope',
    },
    {
      label: 'Structure & Completeness',
      score: breakdown.structureCompleteness,
      weight: '10%',
      icon: Layout,
      desc: 'Standard sections, headers, and contact info',
    },
    {
      label: 'Content Quality',
      score: breakdown.contentQuality,
      weight: '10%',
      icon: CheckCircle2,
      desc: 'Action verbs, concise engineering summaries',
    },
  ];

  const getBarColor = (val: number) => {
    if (val >= 80) return 'bg-emerald-500';
    if (val >= 65) return 'bg-blue-500';
    if (val >= 50) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <h4 className="text-sm font-bold text-white uppercase tracking-wider">Score Breakdown by Pillar</h4>
        <span className="text-xs text-slate-400 font-mono">
          Model: <span className="text-emerald-400 font-semibold">{careerStage}</span>
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.label} className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                    <Icon className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white">{m.label}</div>
                    <div className="text-[10px] text-slate-400 font-mono">Weight: {m.weight}</div>
                  </div>
                </div>
                <span className="text-sm font-bold text-white font-mono">{m.score}%</span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={'h-full rounded-full transition-all duration-700 ' + getBarColor(m.score)}
                  style={{ width: m.score + '%' }}
                />
              </div>
              <p className="text-[11px] text-slate-400">{m.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
