import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Compass,
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Zap,
  Target,
  Layers,
  TrendingUp,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { resumeApi } from '../services/resumeApi';
import { GoogleAuthButton } from '../components/auth/GoogleAuthButton';
import { Spinner } from '../components/ui/Spinner';

export const PublicResumeAnalyzerPage: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [targetRole, setTargetRole] = useState('Software Engineer');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

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

      // Store in localStorage for seamless post-login import
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
    <div className="min-h-screen bg-[#070D1E] text-white flex flex-col justify-between select-none relative overflow-hidden">
      {/* Ambient background lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[1400px] h-[550px] bg-gradient-to-b from-blue-600/20 via-indigo-600/10 to-transparent blur-[160px] pointer-events-none rounded-full" />
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:28px_28px] opacity-60 pointer-events-none" />

      {/* Top Header - 100% Full Width */}
      <header className="w-full border-b border-white/[0.08] relative z-20">
        <div className="w-full flex items-center justify-between py-5 px-6 sm:px-8 md:px-12">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-[#0E1730] border border-white/[0.12] flex items-center justify-center text-blue-400 group-hover:border-blue-500/50 transition-colors shadow-subtle-glow">
              <Compass className="w-5 h-5 text-blue-400" />
            </div>
            <span className="font-display font-bold text-xl text-white tracking-tight">Career Engine</span>
          </Link>

          <div className="flex items-center gap-4">
            <span className="text-xs sm:text-sm font-mono text-slate-400 hidden sm:inline-block">
              Instant AI Evaluation
            </span>
            <Link
              to="/login"
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-200 hover:text-white bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.1] transition-all"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="w-full max-w-5xl mx-auto px-4 sm:px-8 py-10 relative z-10 flex-1 flex flex-col justify-center">
        {!analysisResult ? (
          /* =========================================================================
             STEP 1: UPLOAD & ANALYZE VIEW
             ========================================================================= */
          <div className="space-y-8 text-center max-w-3xl mx-auto w-full">
            {/* Headline */}
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-mono font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span>Instant ATS Resume Scanner</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
                Analyze Your Resume
              </h1>
              <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-xl mx-auto">
                Upload your resume and discover how ready you are for your dream job. Get a comprehensive ATS score in seconds.
              </p>
            </div>

            {error && (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-center gap-2.5 text-left">
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Target Role Selector (Optional context) */}
            <div className="max-w-md mx-auto text-left space-y-1.5">
              <label className="text-xs font-mono text-slate-400 font-medium">
                Target Role Benchmark (Optional):
              </label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g. Software Engineer, Product Manager, AI Engineer"
                className="w-full h-11 px-4 rounded-xl bg-[#091124] border border-white/[0.1] focus:border-blue-500 focus:outline-none text-white text-sm placeholder-slate-500"
              />
            </div>

            {/* Drag & Drop Area */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`p-8 sm:p-12 rounded-3xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center space-y-4 relative group ${
                isDragOver
                  ? 'border-blue-500 bg-blue-500/10 scale-[1.01]'
                  : file
                  ? 'border-emerald-500/60 bg-[#0C152E]'
                  : 'border-white/[0.15] bg-[#091124] hover:bg-[#0D1833] hover:border-blue-500/50'
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf,.docx,.doc,.txt"
                className="hidden"
              />

              <div className="w-16 h-16 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20 group-hover:scale-110 transition-transform">
                {file ? <FileText className="w-8 h-8 text-emerald-400" /> : <Upload className="w-8 h-8" />}
              </div>

              <div className="space-y-1">
                {file ? (
                  <>
                    <p className="text-base sm:text-lg font-bold text-white flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      <span>{file.name}</span>
                    </p>
                    <p className="text-xs text-slate-400 font-mono">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB • Ready for analysis
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-base sm:text-lg font-bold text-white">
                      Drop your resume here
                    </p>
                    <p className="text-xs sm:text-sm text-slate-400">
                      or <span className="text-blue-400 font-semibold underline underline-offset-4">browse files</span> on your computer
                    </p>
                  </>
                )}
              </div>

              <div className="flex items-center gap-4 text-[11px] font-mono text-slate-500 pt-2">
                <span>Supported: PDF, DOC, DOCX</span>
                <span>•</span>
                <span>Max size: 10 MB</span>
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-2 flex flex-col items-center">
              <button
                type="button"
                onClick={handleAnalyze}
                disabled={!file || isAnalyzing}
                className="w-full sm:w-auto min-w-[260px] h-14 px-8 rounded-full bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-base text-white shadow-[0_0_30px_rgba(59,130,246,0.4)] hover:shadow-[0_0_45px_rgba(59,130,246,0.65)] transition-all flex items-center justify-center gap-3 group"
              >
                {isAnalyzing ? (
                  <>
                    <Spinner size="sm" />
                    <span>Analyzing Resume with AI...</span>
                  </>
                ) : (
                  <>
                    <span>Analyze Resume</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
              <p className="text-xs text-slate-500 font-mono mt-3">
                100% Free • No credit card or registration required
              </p>
            </div>
          </div>
        ) : (
          /* =========================================================================
             STEP 2: IMPRESSIVE ATS SCORE & SKILL BREAKDOWN RESULTS
             ========================================================================= */
          <div className="space-y-10 w-full animate-fadeIn">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-blue-400 uppercase tracking-wider mb-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>AI Analysis Complete • {analysisResult.fileName}</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
                  Your Resume ATS Evaluation
                </h1>
              </div>

              <button
                type="button"
                onClick={() => {
                  setAnalysisResult(null);
                  setFile(null);
                }}
                className="px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.09] text-xs font-mono text-slate-300 flex items-center gap-2 border border-white/[0.1] transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Scan Another Resume</span>
              </button>
            </div>

            {/* Score Showcase Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              
              {/* Left Column: Big Circular ATS Score Card */}
              <div className="lg:col-span-5 p-8 rounded-3xl bg-[#091124] border border-blue-500/30 shadow-2xl flex flex-col items-center justify-center text-center space-y-6 relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
                
                <span className="text-xs font-mono uppercase tracking-widest text-slate-400 font-semibold">
                  OVERALL ATS COMPATIBILITY
                </span>

                {/* Score Number Badge */}
                <div className="relative flex flex-col items-center justify-center">
                  <div className="w-40 h-40 rounded-full border-4 border-blue-500/20 flex flex-col items-center justify-center bg-[#0C152E] shadow-[0_0_50px_rgba(59,130,246,0.25)]">
                    <span className="text-5xl sm:text-6xl font-display font-black text-white">
                      {analysisResult.atsScore}
                    </span>
                    <span className="text-xs font-mono text-slate-400 font-semibold">
                      OUT OF 100
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className={`inline-block px-3.5 py-1 rounded-full text-xs font-mono font-bold border ${getScoreColor(analysisResult.atsScore)}`}>
                    {getScoreBadge(analysisResult.atsScore)}
                  </span>
                  <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                    Evaluated against hiring algorithms for <strong className="text-white">{targetRole}</strong>.
                  </p>
                </div>
              </div>

              {/* Right Column: 5 Category Breakdown Bars */}
              <div className="lg:col-span-7 p-8 rounded-3xl bg-[#091124] border border-white/[0.08] shadow-2xl space-y-5 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                  <span className="text-sm font-bold text-white tracking-tight">
                    ATS Performance Pillars
                  </span>
                  <span className="text-xs font-mono text-blue-400">
                    5 Dimensions Analyzed
                  </span>
                </div>

                <div className="space-y-4">
                  {[
                    { label: 'ATS Compatibility', val: analysisResult.categoryScores.atsCompatibility, desc: 'Structure, contact info & standard headers' },
                    { label: 'Skills Match', val: analysisResult.categoryScores.skillsMatch, desc: 'Keyword density of required tech competencies' },
                    { label: 'Keyword Optimization', val: analysisResult.categoryScores.keywordOptimization, desc: 'Impact action verbs & technical phrasing' },
                    { label: 'Experience Relevance', val: analysisResult.categoryScores.experienceRelevance, desc: 'Quantified metrics, results & seniority' },
                    { label: 'Resume Structure', val: analysisResult.categoryScores.resumeStructure, desc: 'Bullet points, layout hygiene & summary' },
                  ].map((cat) => (
                    <div key={cat.label} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-200">{cat.label}</span>
                        <span className="font-mono font-bold text-blue-300">{cat.val}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-white/[0.06] overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-1000"
                          style={{ width: `${cat.val}%` }}
                        />
                      </div>
                      <p className="text-[10px] text-slate-500 font-mono">{cat.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Extracted Skills Matrix */}
            {analysisResult.parsedData?.skills && analysisResult.parsedData.skills.length > 0 && (
              <div className="p-7 rounded-3xl bg-[#091124] border border-white/[0.08] space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white flex items-center gap-2">
                    <Zap className="w-4 h-4 text-blue-400" />
                    <span>Extracted Skills Identified by ATS</span>
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    {analysisResult.parsedData.skills.length} skills found
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {analysisResult.parsedData.skills.map((s: any, idx: number) => {
                    const skillName = typeof s === 'string' ? s : s.name;
                    return (
                      <span
                        key={idx}
                        className="px-3 py-1.5 rounded-lg bg-[#0E1730] text-blue-300 border border-blue-500/20 text-xs font-mono font-medium"
                      >
                        {skillName}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Key Strengths & Improvements */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Strengths */}
              <div className="p-6 rounded-3xl bg-[#091124] border border-emerald-500/20 space-y-3">
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Resume Strengths</span>
                </span>
                <ul className="space-y-2">
                  {analysisResult.strengths?.map((str: string, i: number) => (
                    <li key={i} className="text-xs sm:text-sm text-slate-300 flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Improvements */}
              <div className="p-6 rounded-3xl bg-[#091124] border border-amber-500/20 space-y-3">
                <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  <span>Recommended Improvements</span>
                </span>
                <ul className="space-y-2">
                  {analysisResult.improvements?.map((imp: string, i: number) => (
                    <li key={i} className="text-xs sm:text-sm text-slate-300 flex items-start gap-2">
                      <span className="text-amber-400 font-bold">•</span>
                      <span>{imp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* =========================================================================
               STEP 3: CONVERSION FUNNEL - UNLOCK FULL CAREER ROADMAP & SKILL GAPS
               ========================================================================= */}
            <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-[#0E1A38] to-[#091124] border-2 border-blue-500/40 shadow-[0_0_60px_rgba(59,130,246,0.2)] text-center space-y-8 relative overflow-hidden">
              <div className="space-y-3 max-w-2xl mx-auto">
                <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-mono font-bold uppercase tracking-wider border border-blue-500/30">
                  <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                  <span>Unlock Full Career Engine AI Platform</span>
                </span>
                <h2 className="text-2xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
                  Want to go beyond your ATS score?
                </h2>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                  Create your personalized Career Engine profile in 1 click to unlock your complete career growth roadmap.
                </p>
              </div>

              {/* 5 Feature Bullets */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-w-3xl mx-auto text-left">
                {[
                  { title: 'Detailed Skill Map', desc: 'Interactive radar of technical, soft, and domain competencies' },
                  { title: 'Skill Gap Analysis', desc: 'Pinpoints missing requirements for your dream job' },
                  { title: 'Personalized Roadmap', desc: 'Sprint-by-sprint structured curriculum to level up' },
                  { title: 'Dream Job Targeting', desc: 'Live company match & compensation benchmark targets' },
                  { title: 'Job Match Scoring', desc: '6-pillar compatibility ratings across live job postings' },
                  { title: 'AI Career Coach', desc: '24/7 technical interview mentor and career strategist' },
                ].map((feat) => (
                  <div key={feat.title} className="p-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] space-y-1">
                    <div className="flex items-center gap-2 text-xs font-bold text-white">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{feat.title}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-normal">{feat.desc}</p>
                  </div>
                ))}
              </div>

              {/* Conversion Buttons (Google OAuth + Email) */}
              <div className="max-w-md mx-auto space-y-4 pt-2">
                <GoogleAuthButton mode="signup" className="h-13 text-base shadow-xl" />
                
                <div className="flex items-center justify-center gap-3 text-xs text-slate-400">
                  <span>or</span>
                  <Link
                    to="/register"
                    className="text-blue-400 hover:text-blue-300 font-semibold underline underline-offset-4 transition-colors"
                  >
                    Sign up with Email & Password
                  </Link>
                </div>
                
                <p className="text-[11px] font-mono text-slate-500">
                  ✓ Your resume analysis will be automatically imported into your new profile.
                </p>
              </div>
            </div>

          </div>
        )}
      </main>

      {/* Bottom Footer */}
      <footer className="w-full max-w-7xl mx-auto py-6 px-4 sm:px-8 border-t border-white/[0.08] text-center text-xs text-slate-500 font-mono relative z-10 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p>© 2026 Career Engine AI. All rights reserved.</p>
        <div className="flex items-center gap-4 text-slate-400">
          <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
          <span>•</span>
          <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
        </div>
      </footer>
    </div>
  );
};
