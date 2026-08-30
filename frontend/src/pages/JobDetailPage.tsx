import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { jobsApi } from '../services/jobsApi';
import { MatchedJobResult } from '../types/jobs.types';
import {
  Briefcase,
  Building2,
  MapPin,
  DollarSign,
  Calendar,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  Sparkles,
  Bot,
  FileCheck,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  ShieldCheck,
  Layers,
} from 'lucide-react';

export const JobDetailPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<MatchedJobResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState<boolean>(false);

  useEffect(() => {
    if (jobId) loadJobDetail(jobId);
  }, [jobId]);

  const loadJobDetail = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await jobsApi.getJobById(id);
      setData(res);
    } catch (err: any) {
      setError(err.message || 'Failed to load job details.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSave = async () => {
    if (!data || saving) return;
    setSaving(true);
    try {
      if (data.isSaved) {
        await jobsApi.unsaveJob(data.job.id);
        setData({ ...data, isSaved: false });
      } else {
        await jobsApi.saveJob(data.job.id);
        setData({ ...data, isSaved: true });
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update saved status.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 space-y-4">
        <div className="w-10 h-10 border-3 border-emerald-500/20 border-t-emerald-400 rounded-full animate-spin" />
        <p className="text-xs text-slate-400 font-mono">Loading Opportunity Diagnostics...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-slate-950 p-8 text-center text-slate-400 space-y-4">
        <p>{error || 'Job not found.'}</p>
        <Link to="/jobs" className="text-xs text-emerald-400 hover:underline">
          Back to Jobs
        </Link>
      </div>
    );
  }

  const { job, match } = data;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 space-y-8 max-w-5xl mx-auto">
      <Link
        to="/jobs"
        className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Opportunity Feed</span>
      </Link>

      {/* Top Banner Card */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-sm font-semibold text-emerald-400 block">{job.company}</span>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              {job.title}
            </h1>
            <div className="flex items-center flex-wrap gap-4 pt-2 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                {job.location} ({job.remoteType})
              </span>
              <span className="flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5 text-slate-500" />
                {job.employmentType}
              </span>
              {job.salary?.min && (
                <span className="flex items-center gap-1 font-mono text-slate-200">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                  ${job.salary.min.toLocaleString()} - ${job.salary.max?.toLocaleString()} / yr
                </span>
              )}
            </div>
          </div>

          {/* Match Score Gauge & Apply */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
              <span className="text-2xl font-black text-emerald-400 font-mono block leading-none">
                {match.score}%
              </span>
              <span className="text-[9px] text-slate-400 font-mono uppercase">Career Engine Match</span>
            </div>

            <button
              onClick={handleToggleSave}
              className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 transition-colors"
            >
              {data.isSaved ? (
                <BookmarkCheck className="w-5 h-5 text-emerald-400" />
              ) : (
                <Bookmark className="w-5 h-5" />
              )}
            </button>

            <a
              href={job.applicationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-md flex items-center gap-2"
            >
              <span>Apply on Company Site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* 6-Pillar Score Breakdown */}
        <div className="pt-4 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-center">
          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/60">
            <span className="text-[10px] text-slate-400 block">Role Align</span>
            <span className="text-sm font-bold text-white font-mono">{match.breakdown.roleAlignment}%</span>
          </div>
          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/60">
            <span className="text-[10px] text-slate-400 block">Skill Match</span>
            <span className="text-sm font-bold text-white font-mono">{match.breakdown.skillMatch}%</span>
          </div>
          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/60">
            <span className="text-[10px] text-slate-400 block">Experience</span>
            <span className="text-sm font-bold text-white font-mono">{match.breakdown.experienceMatch}%</span>
          </div>
          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/60">
            <span className="text-[10px] text-slate-400 block">Projects</span>
            <span className="text-sm font-bold text-white font-mono">{match.breakdown.projectDomainRelevance}%</span>
          </div>
          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/60">
            <span className="text-[10px] text-slate-400 block">Location</span>
            <span className="text-sm font-bold text-white font-mono">{match.breakdown.locationPreference}%</span>
          </div>
          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/60">
            <span className="text-[10px] text-slate-400 block">Career Goal</span>
            <span className="text-sm font-bold text-white font-mono">{match.breakdown.careerGoalAlignment}%</span>
          </div>
        </div>
      </div>

      {/* Integration Shortcuts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          to={`/coach?prompt=${encodeURIComponent(`Am I ready for the ${job.title} position at ${job.company}?`)}`}
          className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 transition-all flex items-center justify-between shadow-md group"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-400">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Ask Career Coach About This Role</h4>
              <p className="text-[11px] text-slate-400">Get tailored interview and preparation strategy.</p>
            </div>
          </div>
          <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
        </Link>

        <Link
          to="/resume/ats"
          className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500/40 transition-all flex items-center justify-between shadow-md group"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500/10 rounded-xl text-blue-400">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Optimize Resume for This Job</h4>
              <p className="text-[11px] text-slate-400">Run ATS check against this job description.</p>
            </div>
          </div>
          <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition-colors" />
        </Link>
      </div>

      {/* Why Matches vs Gaps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Why Fits */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center space-x-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4" />
            <span>Why This Matches You</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-300">
            {match.whyItFits.map((w, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-emerald-400 mt-0.5">•</span>
                <span>{w}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Potential Gaps */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center space-x-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
            <AlertCircle className="w-4 h-4" />
            <span>Potential Skill & Tenure Gaps</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-300">
            {match.potentialGaps.length > 0 ? (
              match.potentialGaps.map((g, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-amber-400 mt-0.5">•</span>
                  <span>{g}</span>
                </li>
              ))
            ) : (
              <li className="text-slate-500 italic">No critical qualification gaps detected.</li>
            )}
          </ul>
        </div>
      </div>

      {/* Job Description & Requirements */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6 shadow-xl">
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
            Job Description
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
            {job.description}
          </p>
        </div>

        {/* Required Skills */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-400 uppercase font-mono">
            Required Technical Skills
          </h4>
          <div className="flex flex-wrap gap-2">
            {job.requirements.map((req) => (
              <span
                key={req}
                className="px-3 py-1 rounded-xl text-xs font-mono bg-slate-950 text-slate-200 border border-slate-800"
              >
                {req}
              </span>
            ))}
          </div>
        </div>

        {/* Preferred Skills */}
        {job.preferredSkills.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase font-mono">
              Preferred / Nice-to-Have
            </h4>
            <div className="flex flex-wrap gap-2">
              {job.preferredSkills.map((pref) => (
                <span
                  key={pref}
                  className="px-3 py-1 rounded-xl text-xs font-mono bg-slate-950/60 text-slate-400 border border-slate-800/80"
                >
                  {pref}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
