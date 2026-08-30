import React from 'react';
import { ATSComparisonResult } from '../../types/ats.types';
import { X, TrendingUp, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';

interface ATSComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  comparison: ATSComparisonResult | null;
}

export const ATSComparisonModal: React.FC<ATSComparisonModalProps> = ({
  isOpen,
  onClose,
  comparison,
}) => {
  if (!isOpen || !comparison) return null;

  const { firstAnalysis, secondAnalysis, scoreDelta, newMatchedKeywords, remainingGaps, summary } = comparison;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-white text-base">Resume Version Comparison</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Score progression banner */}
          <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-slate-950 border border-slate-800 text-center">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Baseline Version</span>
              <span className="text-2xl font-bold text-slate-300 font-mono">{firstAnalysis.score}</span>
              <span className="text-[10px] text-slate-500 block truncate">{firstAnalysis.resumeName}</span>
            </div>
            <div className="flex flex-col items-center justify-center">
              <div
                className={
                  'px-3 py-1 rounded-full text-xs font-bold font-mono ' +
                  (scoreDelta >= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400')
                }
              >
                {scoreDelta >= 0 ? '+' + scoreDelta : scoreDelta} pts
              </div>
              <span className="text-[10px] text-slate-500 mt-1">Score Delta</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Latest Version</span>
              <span className="text-2xl font-bold text-emerald-400 font-mono">{secondAnalysis.score}</span>
              <span className="text-[10px] text-slate-500 block truncate">{secondAnalysis.resumeName}</span>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
            {summary}
          </p>

          {/* Newly matched keywords */}
          <div className="space-y-2">
            <h5 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              New Matched Keywords ({newMatchedKeywords.length})
            </h5>
            {newMatchedKeywords.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No new keywords unlocked in this revision.</p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {newMatchedKeywords.map((kw) => (
                  <span
                    key={kw}
                    className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-xs font-mono"
                  >
                    +{kw}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Remaining gaps */}
          <div className="space-y-2">
            <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Remaining Skill Gaps ({remainingGaps.length})
            </h5>
            {remainingGaps.length === 0 ? (
              <p className="text-xs text-emerald-400 italic">All targeted skill requirements matched!</p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {remainingGaps.map((gap) => (
                  <span
                    key={gap}
                    className="px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800 text-xs font-mono"
                  >
                    {gap}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium rounded-lg transition-colors"
          >
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  );
};
