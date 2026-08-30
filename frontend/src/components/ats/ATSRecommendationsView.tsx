import React from 'react';
import { Link } from 'react-router-dom';
import { ATSRecommendationItem } from '../../types/ats.types';
import { Sparkles, ArrowRight, CheckCircle, AlertCircle, ArrowUpRight } from 'lucide-react';

interface ATSRecommendationsViewProps {
  recommendations: ATSRecommendationItem[];
  resumeId: string;
}

export const ATSRecommendationsView: React.FC<ATSRecommendationsViewProps> = ({
  recommendations,
  resumeId,
}) => {
  const getPriorityBadge = (p: string) => {
    switch (p) {
      case 'HIGH':
        return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
      case 'MEDIUM':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      default:
        return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            Prioritized Action Plan
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">
            Concrete recommendations to elevate your resume compatibility.
          </p>
        </div>
        <Link
          to={'/resume/builder/' + resumeId}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs transition-colors shadow-sm"
        >
          <span>Edit in Builder</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="space-y-3">
        {recommendations.length === 0 ? (
          <div className="p-8 text-center bg-slate-900/40 border border-slate-800 rounded-xl">
            <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <p className="text-xs text-slate-300 font-medium">Your resume looks thoroughly aligned with this role!</p>
          </div>
        ) : (
          recommendations.map((rec) => (
            <div
              key={rec.id}
              className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 md:p-5 space-y-3 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-300 font-mono">
                    {rec.type}
                  </span>
                  <h5 className="text-xs md:text-sm font-bold text-white">{rec.title}</h5>
                </div>
                <span
                  className={'px-2 py-0.5 rounded text-[10px] font-bold uppercase border ' + getPriorityBadge(rec.priority)}
                >
                  {rec.priority} PRIORITY
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">{rec.reason}</p>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs text-emerald-300 font-medium leading-relaxed flex items-start gap-2">
                <ArrowRight className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-200 block text-[11px] uppercase tracking-wider mb-0.5">
                    Recommended Action:
                  </strong>
                  {rec.action}
                </div>
              </div>

              {rec.beforeAfter && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                  <div className="p-3 rounded-xl bg-slate-950 border border-rose-500/20 text-xs space-y-1">
                    <span className="text-[10px] font-bold uppercase text-rose-400 tracking-wider block">
                      Current Content
                    </span>
                    <p className="text-slate-400 text-[11px] leading-relaxed italic">
                      &ldquo;{rec.beforeAfter.before}&rdquo;
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-emerald-500/20 text-xs space-y-1">
                    <span className="text-[10px] font-bold uppercase text-emerald-400 tracking-wider block">
                      Suggested Rewrite
                    </span>
                    <p className="text-emerald-200 text-[11px] leading-relaxed">
                      &ldquo;{rec.beforeAfter.after}&rdquo;
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
