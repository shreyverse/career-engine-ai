import React, { useState } from 'react';
import { Sparkles, Check, X, ArrowRight, Edit3, ShieldAlert } from 'lucide-react';
import { ResumeImprovementResponse } from '../../types/resume.types';

interface AIImprovementModalProps {
  isOpen: boolean;
  onClose: () => void;
  originalText: string;
  suggestion: ResumeImprovementResponse | null;
  isLoading: boolean;
  onAccept: (improvedText: string) => void;
}

export const AIImprovementModal: React.FC<AIImprovementModalProps> = ({
  isOpen,
  onClose,
  originalText,
  suggestion,
  isLoading,
  onAccept,
}) => {
  const [editedText, setEditedText] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(false);

  React.useEffect(() => {
    if (suggestion?.improvedContent) {
      setEditedText(suggestion.improvedContent);
      setIsEditing(false);
    }
  }, [suggestion]);

  if (!isOpen) return null;

  const handleAccept = () => {
    onAccept(editedText || suggestion?.improvedContent || originalText);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">AI Content Improvement</h3>
              <p className="text-xs text-slate-400">Enhance action verbs and clarity without inflating facts</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <div className="w-10 h-10 border-3 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
              <p className="text-sm font-medium text-slate-300">Analyzing syntax & active verbs...</p>
            </div>
          ) : (
            <>
              {/* Original Content */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1.5">
                  Original Content
                </label>
                <div className="p-3.5 bg-slate-950/80 border border-slate-800/80 rounded-xl text-xs text-slate-300 leading-relaxed">
                  {originalText}
                </div>
              </div>

              {/* Arrow Indicator */}
              <div className="flex justify-center -my-1 text-emerald-400">
                <ArrowRight className="w-4 h-4 rotate-90" />
              </div>

              {/* AI Suggestion */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    AI Suggestion
                  </label>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="text-xs text-slate-400 hover:text-emerald-400 flex items-center gap-1 transition-colors"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>{isEditing ? 'View Suggestion' : 'Edit Text'}</span>
                  </button>
                </div>

                {isEditing ? (
                  <textarea
                    rows={4}
                    value={editedText}
                    onChange={(e) => setEditedText(e.target.value)}
                    className="w-full p-3.5 bg-slate-950 border border-emerald-500/40 rounded-xl text-xs text-white leading-relaxed focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                ) : (
                  <div className="p-3.5 bg-emerald-950/20 border border-emerald-500/30 rounded-xl text-xs text-emerald-100 leading-relaxed font-medium">
                    {editedText || suggestion?.improvedContent}
                  </div>
                )}

                {suggestion?.explanation && (
                  <p className="mt-2 text-[11px] text-slate-400 italic">
                    💡 Note: {suggestion.explanation}
                  </p>
                )}
              </div>

              {/* Anti-Hallucination Guardrail Badge */}
              <div className="flex items-start gap-2.5 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-[11px] text-amber-300">
                <ShieldAlert className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
                <span>
                  <strong>Anti-Hallucination Guardrail:</strong> AI does not fabricate metrics or technologies. Please review and ensure all achievements reflect your genuine experience.
                </span>
              </div>
            </>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-950/60">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            Keep Original
          </button>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              disabled={isLoading || !suggestion}
              onClick={handleAccept}
              className="flex items-center space-x-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-semibold rounded-lg text-xs transition-colors shadow-sm"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Accept Suggestion</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
