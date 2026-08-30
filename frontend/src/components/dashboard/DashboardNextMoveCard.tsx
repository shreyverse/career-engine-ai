import React from 'react';
import { Link } from 'react-router-dom';
import { DashboardNextMove } from '../../types/dashboard.types';
import { ArrowRight, Clock, Sparkles, CheckCircle2, Route, AlertCircle } from 'lucide-react';

interface DashboardNextMoveCardProps {
  nextMove: DashboardNextMove;
}

export const DashboardNextMoveCard: React.FC<DashboardNextMoveCardProps> = ({ nextMove }) => {
  if (nextMove.status === 'NO_ROADMAP') {
    return (
      <div className="bg-gradient-to-r from-emerald-950/30 via-slate-900 to-slate-900 border border-emerald-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-mono uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Recommended Career Acceleration</span>
          </div>
          <h3 className="text-lg md:text-xl font-bold text-white tracking-tight">{nextMove.title}</h3>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">{nextMove.description}</p>
          <div className="pt-2">
            <Link
              to="/career-path"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md"
            >
              <span>Generate My Roadmap</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (nextMove.status === 'ALL_COMPLETE') {
    return (
      <div className="bg-slate-900/60 border border-emerald-500/30 rounded-2xl p-6 shadow-xl space-y-3">
        <div className="flex items-center space-x-2 text-emerald-400 text-xs font-mono uppercase tracking-wider">
          <CheckCircle2 className="w-4 h-4" />
          <span>Roadmap Target Achieved</span>
        </div>
        <h3 className="text-lg font-bold text-white">{nextMove.title}</h3>
        <p className="text-xs text-slate-300">{nextMove.description}</p>
        <div className="pt-2 flex gap-3">
          <Link
            to="/progress"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-500 text-slate-950 font-semibold text-xs rounded-xl hover:bg-emerald-400 transition-colors"
          >
            <span>View Progress Center</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 hover:border-emerald-500/40 rounded-2xl p-6 shadow-xl transition-all relative overflow-hidden group">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2.5 flex-1">
          <div className="flex items-center flex-wrap gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-mono">
              YOUR NEXT MOVE
            </span>
            {nextMove.phaseTitle && (
              <span className="text-xs text-slate-400 font-mono">
                Phase {nextMove.phaseNumber}: {nextMove.phaseTitle}
              </span>
            )}
            {nextMove.priority && (
              <span
                className={
                  'px-2 py-0.5 rounded text-[10px] font-bold uppercase ' +
                  (nextMove.priority === 'HIGH'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30')
                }
              >
                {nextMove.priority} PRIORITY
              </span>
            )}
          </div>

          <h3 className="text-base md:text-lg font-extrabold text-white tracking-tight group-hover:text-emerald-300 transition-colors">
            {nextMove.title}
          </h3>

          {nextMove.description && (
            <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">{nextMove.description}</p>
          )}

          <div className="flex items-center flex-wrap gap-4 pt-1 text-xs text-slate-400">
            {nextMove.estimatedTime && (
              <span className="flex items-center gap-1 text-[11px] font-mono text-slate-300">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                {nextMove.estimatedTime}
              </span>
            )}
            {nextMove.whyItMatters && (
              <span className="text-[11px] text-slate-400 italic">Why this matters: {nextMove.whyItMatters}</span>
            )}
          </div>
        </div>

        <div className="shrink-0 pt-2 md:pt-0">
          <Link
            to="/career-path"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-md hover:shadow-emerald-500/20"
          >
            <span>Continue Task</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
