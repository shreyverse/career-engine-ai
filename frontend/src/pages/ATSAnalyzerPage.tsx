import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { resumeApi } from '../services/resumeApi';
import { atsApi } from '../services/atsApi';
import { StoredResumeRecord } from '../types/resume.types';
import { ATSAnalysisRecord, ATSComparisonResult } from '../types/ats.types';
import { ATSScoreGauge } from '../components/ats/ATSScoreGauge';
import { ATSScoreBreakdown } from '../components/ats/ATSScoreBreakdown';
import { ATSKeywordsView } from '../components/ats/ATSKeywordsView';
import { ATSRecommendationsView } from '../components/ats/ATSRecommendationsView';
import { ATSComparisonModal } from '../components/ats/ATSComparisonModal';
import {
  Sparkles,
  FileText,
  Briefcase,
  TrendingUp,
  History,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';

export const ATSAnalyzerPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const preselectedResumeId = searchParams.get('resumeId');

  const [resumes, setResumes] = useState<StoredResumeRecord[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<string>(preselectedResumeId || '');
  const [targetRole, setTargetRole] = useState<string>('Senior Fullstack Engineer');
  const [jobDescription, setJobDescription] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'KEYWORDS' | 'RECOMMENDATIONS' | 'HISTORY'>('OVERVIEW');

  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [analysisStep, setAnalysisStep] = useState<number>(0);
  const [currentAnalysis, setCurrentAnalysis] = useState<ATSAnalysisRecord | null>(null);
  const [history, setHistory] = useState<ATSAnalysisRecord[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [comparisonModalOpen, setComparisonModalOpen] = useState<boolean>(false);
  const [comparisonData, setComparisonData] = useState<ATSComparisonResult | null>(null);

  const diagnosticSteps = [
    'Reading your structured resume data...',
    'Understanding target role core competencies...',
    'Extracting technical keywords & semantic concepts...',
    'Evaluating structure and bullet impact...',
    'Synthesizing actionable recommendations...',
  ];

  useEffect(() => {
    loadResumesAndHistory();
  }, []);

  const loadResumesAndHistory = async () => {
    try {
      const [resumesList, historyList] = await Promise.all([
        resumeApi.listResumes(),
        atsApi.getHistory(),
      ]);
      setResumes(resumesList);
      setHistory(historyList);

      if (!selectedResumeId && resumesList.length > 0) {
        setSelectedResumeId(resumesList[0].id);
        if (resumesList[0].targetRole) setTargetRole(resumesList[0].targetRole);
      }

      if (historyList.length > 0 && !currentAnalysis) {
        setCurrentAnalysis(historyList[0]);
      }
    } catch (err: any) {
      console.error('Failed to load ATS workspace data:', err);
    }
  };

  const handleRunAnalysis = async () => {
    if (!selectedResumeId) {
      setError('Please select a resume to analyze.');
      return;
    }
    if (!targetRole.trim()) {
      setError('Please provide a target role title.');
      return;
    }

    setError(null);
    setAnalyzing(true);
    setAnalysisStep(0);

    const stepInterval = setInterval(() => {
      setAnalysisStep((prev) => (prev < diagnosticSteps.length - 1 ? prev + 1 : prev));
    }, 450);

    try {
      const result = await atsApi.analyzeResume({
        resumeId: selectedResumeId,
        targetRole: targetRole.trim(),
        jobDescription: jobDescription.trim() || undefined,
      });
      clearInterval(stepInterval);
      setCurrentAnalysis(result);
      setHistory((prev) => [result, ...prev.filter((h) => h.id !== result.id)]);
      setActiveTab('OVERVIEW');
    } catch (err: any) {
      clearInterval(stepInterval);
      setError(err.message || 'ATS Analysis failed. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleCompare = async (firstId: string, secondId: string) => {
    try {
      const comp = await atsApi.compareAnalyses(firstId, secondId);
      setComparisonData(comp);
      setComparisonModalOpen(true);
    } catch (err: any) {
      alert('Failed to compare versions: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-mono uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Career Engine Resume Intelligence</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            ATS Compatibility Analyzer
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1 max-w-2xl">
            Diagnostic analysis combining deterministic keyword extraction and Gemini AI semantic matching against
            your target role or job description.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            to="/resume"
            className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
          >
            Resume Workspace
          </Link>
          <Link
            to="/resume/builder"
            className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors shadow-sm"
          >
            Resume Builder
          </Link>
        </div>
      </div>

      {/* ATS Scoring Disclaimer Banner */}
      <div className="bg-slate-900/50 border border-slate-800/90 rounded-xl p-4 flex items-start space-x-3.5 text-xs text-slate-300">
        <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="text-white font-semibold block mb-0.5">Career Engine ATS-Style Score</strong>
          This score estimates how well your resume aligns with the selected role or job description using Career
          Engine&apos;s transparent resume analysis system. Different employers and ATS platforms use varied internal
          filtering algorithms.
        </div>
      </div>

      {/* Input Configuration Panel */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 md:p-6 space-y-5 shadow-lg">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 1. Resume Picker */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-emerald-400" />
              1. Select Resume
            </label>
            {resumes.length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 text-center">
                No resumes found.{' '}
                <Link to="/resume/builder" className="text-emerald-400 underline">
                  Build one first
                </Link>
              </div>
            ) : (
              <select
                value={selectedResumeId}
                onChange={(e) => {
                  setSelectedResumeId(e.target.value);
                  const found = resumes.find((r) => r.id === e.target.value);
                  if (found?.targetRole) setTargetRole(found.targetRole);
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 outline-none"
              >
                {resumes.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} ({r.completeness}% complete)
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* 2. Target Role */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-emerald-400" />
              2. Target Role Title
            </label>
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g. Senior Fullstack Engineer"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 outline-none font-mono"
            />
          </div>

          {/* 3. Action Trigger */}
          <div className="space-y-2 flex flex-col justify-end">
            <button
              type="button"
              onClick={handleRunAnalysis}
              disabled={analyzing || !selectedResumeId || !targetRole}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md"
            >
              {analyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Analyzing Alignment...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Analyze Resume</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Optional Job Description Box */}
        <div className="space-y-2 pt-2 border-t border-slate-800/80">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-400">
              Optional: Paste Job Description (Mode B — Keyword Precision Matching)
            </label>
            <span className="text-[11px] text-slate-500">{jobDescription.length} / 25000 chars</span>
          </div>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            rows={3}
            placeholder="Paste job requirements, responsibilities, or qualification bullets to run precision keyword & semantic matching..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 outline-none leading-relaxed"
          />
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Progressive Loading State */}
      {analyzing && (
        <div className="p-12 text-center bg-slate-900/40 border border-slate-800 rounded-2xl space-y-4 animate-pulse">
          <div className="w-10 h-10 border-2 border-emerald-500/20 border-t-emerald-400 rounded-full animate-spin mx-auto" />
          <div className="space-y-1.5">
            <h4 className="text-sm font-bold text-white">Running Career Engine ATS Intelligence Engine</h4>
            <p className="text-xs text-emerald-400 font-mono">{diagnosticSteps[analysisStep]}</p>
          </div>
        </div>
      )}

      {/* Diagnostic Report Results */}
      {!analyzing && currentAnalysis && (
        <div className="space-y-6 animate-fadeIn">
          {/* Top Score Banner */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
              <ATSScoreGauge score={currentAnalysis.score} matchLevel={currentAnalysis.matchLevel} />
              <div className="space-y-2">
                <div className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider">
                  Analysis Complete • {currentAnalysis.careerStage} Evaluation
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                  {currentAnalysis.targetRole}
                </h3>
                <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
                  Evaluated for resume &ldquo;{currentAnalysis.resumeName}&rdquo;.
                  {currentAnalysis.score >= 70
                    ? ' Strong technical alignment detected across core pillars.'
                    : ' Opportunities identified to increase keyword density and project contribution depth.'}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2 shrink-0 w-full md:w-auto">
              <Link
                to={'/resume/builder/' + currentAnalysis.resumeId}
                className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs text-center transition-colors shadow-sm flex items-center justify-center gap-1.5"
              >
                <span>Apply Suggestions in Builder</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-800 space-x-6 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('OVERVIEW')}
              className={
                'pb-3 transition-colors border-b-2 ' +
                (activeTab === 'OVERVIEW'
                  ? 'border-emerald-400 text-white'
                  : 'border-transparent text-slate-400 hover:text-slate-200')
              }
            >
              Overview & Breakdown
            </button>
            <button
              onClick={() => setActiveTab('KEYWORDS')}
              className={
                'pb-3 transition-colors border-b-2 ' +
                (activeTab === 'KEYWORDS'
                  ? 'border-emerald-400 text-white'
                  : 'border-transparent text-slate-400 hover:text-slate-200')
              }
            >
              Keywords ({currentAnalysis.keywords.matched.length} Matched / {currentAnalysis.keywords.missing.length} Gaps)
            </button>
            <button
              onClick={() => setActiveTab('RECOMMENDATIONS')}
              className={
                'pb-3 transition-colors border-b-2 ' +
                (activeTab === 'RECOMMENDATIONS'
                  ? 'border-emerald-400 text-white'
                  : 'border-transparent text-slate-400 hover:text-slate-200')
              }
            >
              Action Plan ({currentAnalysis.recommendations.length})
            </button>
            <button
              onClick={() => setActiveTab('HISTORY')}
              className={
                'pb-3 transition-colors border-b-2 ' +
                (activeTab === 'HISTORY'
                  ? 'border-emerald-400 text-white'
                  : 'border-transparent text-slate-400 hover:text-slate-200')
              }
            >
              Analysis History ({history.length})
            </button>
          </div>

          {/* Tab 1: Overview */}
          {activeTab === 'OVERVIEW' && (
            <div className="space-y-6">
              <ATSScoreBreakdown
                breakdown={currentAnalysis.scoreBreakdown}
                careerStage={currentAnalysis.careerStage}
              />

              {/* What's Working Section */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  What&apos;s Working Well
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {currentAnalysis.strengths.map((st, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                      <div className="text-xs font-semibold text-slate-200">{st.title}</div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">{st.explanation}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Keywords */}
          {activeTab === 'KEYWORDS' && <ATSKeywordsView keywords={currentAnalysis.keywords} />}

          {/* Tab 3: Recommendations */}
          {activeTab === 'RECOMMENDATIONS' && (
            <ATSRecommendationsView
              recommendations={currentAnalysis.recommendations}
              resumeId={currentAnalysis.resumeId}
            />
          )}

          {/* Tab 4: History & Comparison */}
          {activeTab === 'HISTORY' && (
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <History className="w-4 h-4 text-emerald-400" />
                  Past Diagnostic Analyses
                </h4>
                <span className="text-xs text-slate-400">Select any two to compare version progression</span>
              </div>

              <div className="space-y-2.5">
                {history.map((item, idx) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4 hover:border-slate-700 transition-colors"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-white">{item.targetRole}</span>
                        <span className="text-[10px] text-slate-500 font-mono">({item.resumeName})</span>
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Score: <strong className="text-emerald-400 font-mono">{item.score}</strong> •{' '}
                        {new Date(item.createdAt).toLocaleString()}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {idx > 0 && (
                        <button
                          onClick={() => handleCompare(history[idx].id, history[0].id)}
                          className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-slate-300 hover:text-white text-[11px] transition-colors"
                        >
                          Compare with Latest
                        </button>
                      )}
                      <button
                        onClick={() => setCurrentAnalysis(item)}
                        className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 text-[11px] transition-colors"
                      >
                        View Report
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Comparison Modal */}
      <ATSComparisonModal
        isOpen={comparisonModalOpen}
        onClose={() => setComparisonModalOpen(false)}
        comparison={comparisonData}
      />
    </div>
  );
};
