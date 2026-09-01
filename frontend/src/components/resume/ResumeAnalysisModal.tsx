import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  X,
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  RefreshCw,
  Compass,
} from 'lucide-react';
import { resumeApi } from '../../services/resumeApi';
import { GoogleAuthButton } from '../auth/GoogleAuthButton';
import { Spinner } from '../ui/Spinner';

interface ResumeAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResumeAnalysisModal: React.FC<ResumeAnalysisModalProps> = ({
  isOpen,
  onClose,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [targetRole, setTargetRole] = useState('Software Engineer');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selected: File) => {
    setError(null);
    const validExtensions = ['.pdf', '.docx', '.doc', '.txt'];
    const hasValidExt = validExtensions.some((ext) =>
      selected.name.toLowerCase().endsWith(ext)
    );

    if (!hasValidExt) {
      setError('Please upload a valid PDF, DOCX, or DOC resume document.');
      return;
    }

    if (selected.size > 10 * 1024 * 1024) {
      setError('Resume file size exceeds 10MB limit.');
      return;
    }

    setFile(selected);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleAnalyze = async () => {
    if (!file) {
      setError('Please select or drop your resume document first.');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const result = await resumeApi.publicAnalyzeResume(file, targetRole);
      setAnalysisResult(result);

      try {
        localStorage.setItem(
          'pending_resume_analysis',
          JSON.stringify({
            fileName: result.fileName,
            parsedData: result.parsedData,
            atsScore: result.atsScore,
            targetRole: targetRole || 'Software Engineer',
            timestamp: Date.now(),
          })
        );
      } catch (storageErr) {
        console.warn('LocalStorage save failed:', storageErr);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to analyze resume. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10';
    if (score >= 60) return 'text-blue-400 border-blue-500/40 bg-blue-500/10';
    return 'text-amber-400 border-amber-500/40 bg-amber-500/10';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 85) return 'Strong Candidate (Top 10%)';
    if (score >= 70) return 'Job Competitive (Top 25%)';
    return 'Needs Optimization';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gradient-to-b from-[#070D1E] via-[#0A1329] to-[#060B18] text-white flex flex-col justify-between select-none animate-fadeIn">
      {/* Full-Screen Ambient Lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[1400px] h-[550px] bg-gradient-to-b from-blue-600/15 via-indigo-600/10 to-transparent blur-[160px] pointer-events-none rounded-full" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-600/15 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-600/15 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:28px_28px] opacity-40 pointer-events-none" />

      {/* Top Navigation Bar */}
      <header className="w-full max-w-7xl mx-auto flex items-center justify-between py-6 px-4 sm:px-8 border-b border-white/[0.06] relative z-20">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#0E1730] border border-white/[0.12] flex items-center justify-center text-blue-400 shadow-subtle-glow">
            <Compass className="w-5 h-5 text-blue-400" />
          </div>
          <span className="font-display font-bold text-xl text-white tracking-tight">Career Engine</span>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.1] text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-md"
        >
          <X className="w-5 h-5" />
        </button>
      </header>

      {/* Main Analysis Container - Floating Glass Panel */}
      <main className="w-full max-w-4xl mx-auto px-4 sm:px-8 py-8 relative z-10 flex-1 flex flex-col justify-center">
        {!analysisResult ? (
          <div className="p-8 sm:p-10 lg:p-12 rounded-3xl bg-[#091124]/75 backdrop-blur-2xl border border-white/[0.08] shadow-[0_0_60px_rgba(59,130,246,0.12)] space-y-6 text-center w-full">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-mono font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span>Instant ATS Resume Scanner</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-white tracking-tight">
                Analyze Your Resume
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl mx-auto">
                Upload your resume and discover how ready you are for your next opportunity.
              </p>
            </div>

            {error && (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs sm:text-sm flex items-center gap-2.5 text-left">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Target Role input */}
            <div className="text-left space-y-1.5 max-w-md mx-auto">
              <label className="text-xs font-mono text-slate-400 font-medium">
                Target Role Benchmark:
              </label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g. Software Engineer, AI Engineer"
                className="w-full h-11 px-4 rounded-xl bg-[#060B18] border border-white/[0.1] focus:border-blue-500 focus:outline-none text-white text-sm placeholder-slate-500"
              />
            </div>

            {/* Drag & Drop Box (Darker inner glass) */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`p-8 sm:p-10 rounded-2xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center space-y-3 ${isDragOver ? 'border-blue-500 bg-blue-500/10 scale-[1.01]' : file ? 'border-emerald-500/60 bg-[#070E20]' : 'border-white/[0.12] bg-[#060B18]/90 hover:bg-[#080E22] hover:border-blue-500/50'}`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf,.docx,.doc,.txt"
                className="hidden"
              />

              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
                {file ? <FileText className="w-7 h-7 text-emerald-400" /> : <Upload className="w-7 h-7" />}
              </div>

              <div className="space-y-1">
                {file ? (
                  <>
                    <p className="text-sm sm:text-base font-bold text-white flex items-center justify-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>{file.name}</span>
                    </p>
                    <p className="text-xs text-slate-400 font-mono">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB • Ready for analysis
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-base font-bold text-white">
                      Drop your resume here
                    </p>
                    <p className="text-xs text-slate-400">
                      or <span className="text-blue-400 font-semibold underline underline-offset-4">browse files</span>
                    </p>
                  </>
                )}
              </div>

              <span className="text-[11px] font-mono text-slate-500">
                PDF, DOC, DOCX • Max 10MB
              </span>
            </div>

            {/* Action Button */}
            <div className="pt-2 flex flex-col items-center">
              <button
                type="button"
                onClick={handleAnalyze}
                disabled={!file || isAnalyzing}
                className="w-full sm:w-auto min-w-[260px] h-13 px-8 rounded-full bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-sm text-white shadow-[0_0_30px_rgba(59,130,246,0.45)] hover:shadow-[0_0_45px_rgba(59,130,246,0.7)] transition-all flex items-center justify-center gap-2.5 cursor-pointer"
              >
                {isAnalyzing ? (
                  <>
                    <Spinner size="sm" />
                    <span>Analyzing Resume with AI...</span>
                  </>
                ) : (
                  <>
                    <span>Analyze Resume</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
              <p className="text-xs text-slate-400 font-mono mt-2.5">
                Get your ATS score instantly — no login required.
              </p>
            </div>
          </div>
        ) : (
          <div className="p-8 sm:p-10 lg:p-12 rounded-3xl bg-[#091124]/75 backdrop-blur-2xl border border-white/[0.08] shadow-[0_0_60px_rgba(59,130,246,0.12)] space-y-8 w-full animate-fadeIn">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-mono text-blue-400 uppercase tracking-wider mb-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Analysis Complete • {analysisResult.fileName}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-display font-extrabold text-white">
                  Your ATS Score Evaluation
                </h2>
              </div>

              <button
                type="button"
                onClick={() => {
                  setAnalysisResult(null);
                  setFile(null);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.09] text-xs font-mono text-slate-300 flex items-center gap-1.5 border border-white/[0.1] transition-all cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Rescan</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
              <div className="md:col-span-5 p-6 rounded-2xl bg-[#060B18]/90 border border-blue-500/30 flex flex-col items-center justify-center text-center space-y-4">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
                  YOUR ATS SCORE
                </span>
                
                <div className="w-32 h-32 rounded-full border-4 border-blue-500/25 flex flex-col items-center justify-center bg-[#091124] shadow-[0_0_40px_rgba(59,130,246,0.2)]">
                  <span className="text-4xl sm:text-5xl font-display font-black text-white">
                    {analysisResult.atsScore}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400 font-semibold">
                    / 100
                  </span>
                </div>

                <span className={`px-3 py-0.5 rounded-full text-xs font-mono font-bold border ${getScoreColor(analysisResult.atsScore)}`}>
                  {getScoreBadge(analysisResult.atsScore)}
                </span>
              </div>

              <div className="md:col-span-7 p-6 rounded-2xl bg-[#060B18]/90 border border-white/[0.08] space-y-3.5">
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Category Breakdown
                </span>

                <div className="space-y-2.5">
                  {[
                    { label: 'ATS Compatibility', val: analysisResult.categoryScores.atsCompatibility },
                    { label: 'Skills Match', val: analysisResult.categoryScores.skillsMatch },
                    { label: 'Keyword Optimization', val: analysisResult.categoryScores.keywordOptimization },
                    { label: 'Resume Structure', val: analysisResult.categoryScores.resumeStructure },
                    { label: 'Experience Relevance', val: analysisResult.categoryScores.experienceRelevance },
                  ].map((cat) => (
                    <div key={cat.label} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-300 font-medium">{cat.label}</span>
                        <span className="font-mono font-bold text-blue-300">{cat.val}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
                          style={{ width: `${cat.val}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-[#0E1A38] to-[#091124] border border-blue-500/40 text-center space-y-5">
              <div className="space-y-1.5">
                <h3 className="text-lg sm:text-2xl font-display font-bold text-white">
                  Your resume is only the beginning.
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
                  Unlock your complete Career Engine analysis and get your personalized roadmap.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-lg mx-auto text-left text-xs">
                {[
                  'Personalized Skill Map',
                  'Skill Gap Analysis',
                  'Career Roadmap',
                  'Dream Job Targeting',
                  'Job Match Score',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="max-w-sm mx-auto space-y-3 pt-2">
                <GoogleAuthButton mode="signup" className="h-12" />
                <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
                  <span>or</span>
                  <Link
                    to="/register"
                    onClick={onClose}
                    className="text-blue-400 hover:text-blue-300 font-semibold underline underline-offset-4"
                  >
                    Continue with Email
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto py-4 px-4 sm:px-8 text-center text-xs text-slate-500 font-mono relative z-20">
        <p>© 2026 Career Engine AI. All rights reserved.</p>
      </footer>
    </div>
  );
};