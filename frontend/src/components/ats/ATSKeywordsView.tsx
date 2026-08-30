import React from 'react';
import { ATSKeywordMatchResult } from '../../types/ats.types';
import { CheckCircle2, AlertTriangle, ArrowRightLeft, ShieldAlert } from 'lucide-react';

interface ATSKeywordsViewProps {
  keywords: ATSKeywordMatchResult;
}

export const ATSKeywordsView: React.FC<ATSKeywordsViewProps> = ({ keywords }) => {
  return (
    <div className="space-y-6">
      {/* Anti-Stuffing Guardrail Disclaimer Banner */}
      <div className="bg-amber-950/20 border border-amber-500/30 rounded-xl p-4 flex items-start space-x-3">
        <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-200/90 leading-relaxed">
          <strong className="text-amber-300 font-semibold block mb-0.5">Anti-Keyword Stuffing Rule</strong>
          Only add recommended keywords to your resume if they accurately reflect your genuine, hands-on experience.
          Hiring teams verify listed skills during technical interviews.
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Matched Keywords */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center space-x-2 text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Matched Keywords ({keywords.matched.length})
            </h4>
          </div>
          <p className="text-[11px] text-slate-400">Skills detected in both your resume and the target role.</p>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {keywords.matched.length === 0 ? (
              <span className="text-xs text-slate-500 italic">No direct matches detected.</span>
            ) : (
              keywords.matched.map((k) => (
                <span
                  key={k.term}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-xs font-medium font-mono"
                >
                  <span>✓</span>
                  <span>{k.term}</span>
                  {k.frequencyInResume > 1 && (
                    <span className="text-[9px] bg-emerald-500/20 px-1 rounded-full text-emerald-400">
                      ×{k.frequencyInResume}
                    </span>
                  )}
                </span>
              ))
            )}
          </div>
        </div>

        {/* Missing Keywords */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center space-x-2 text-rose-400">
            <AlertTriangle className="w-4 h-4" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Missing Keywords ({keywords.missing.length})
            </h4>
          </div>
          <p className="text-[11px] text-slate-400">Core competencies requested by the role but not found.</p>
          <div className="space-y-2 pt-1">
            {keywords.missing.length === 0 ? (
              <span className="text-xs text-slate-500 italic">No critical missing keywords!</span>
            ) : (
              keywords.missing.map((k) => (
                <div
                  key={k.term}
                  className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-start justify-between gap-2"
                >
                  <div>
                    <span className="text-xs font-semibold text-rose-300 font-mono block">{k.term}</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">{k.reason}</span>
                  </div>
                  <span
                    className={
                      'text-[9px] px-1.5 py-0.5 rounded font-bold uppercase shrink-0 ' +
                      (k.importance === 'REQUIRED'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30')
                    }
                  >
                    {k.importance}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Semantic / Related Concepts */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center space-x-2 text-blue-400">
            <ArrowRightLeft className="w-4 h-4" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Semantic Matches ({keywords.related.length})
            </h4>
          </div>
          <p className="text-[11px] text-slate-400">Equivalent concepts recognized by Career Engine's AI engine.</p>
          <div className="space-y-2 pt-1">
            {keywords.related.length === 0 ? (
              <span className="text-xs text-slate-500 italic">No semantic approximations needed.</span>
            ) : (
              keywords.related.map((r, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-mono">
                    <span className="text-slate-300">{r.resumeTerm}</span>
                    <span className="text-blue-400">↔</span>
                    <span className="text-emerald-300">{r.jdTerm}</span>
                  </div>
                  <p className="text-[10px] text-slate-400">{r.explanation}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
