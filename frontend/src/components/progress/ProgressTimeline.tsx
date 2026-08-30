import React from 'react';
import { DashboardProgressMilestone } from '../../types/dashboard.types';
import { CheckCircle2, Clock, Calendar, Check, Circle } from 'lucide-react';

interface ProgressTimelineProps {
  milestones: DashboardProgressMilestone[];
}

export const ProgressTimeline: React.FC<ProgressTimelineProps> = ({ milestones }) => {
  return (
    <div className="space-y-4">
      <div className="relative border-l-2 border-slate-800 ml-4 space-y-6 py-2">
        {milestones.map((m, idx) => (
          <div key={m.id} className="relative pl-6 group">
            {/* Dot marker */}
            <div
              className={
                'absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ' +
                (m.completed
                  ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                  : 'bg-slate-950 border-slate-700 text-slate-600')
              }
            >
              {m.completed && <Check className="w-2.5 h-2.5 stroke-[3]" />}
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition-colors space-y-1">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h5 className="text-xs md:text-sm font-bold text-white flex items-center gap-2">
                  <span>{m.title}</span>
                  {m.completed && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                      COMPLETED
                    </span>
                  )}
                </h5>
                <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {m.date}
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{m.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
