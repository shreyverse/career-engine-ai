import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jobsApi } from '../services/jobsApi';
import { MatchedJobResult } from '../types/jobs.types';
import {
  Bookmark,
  Trash2,
  ExternalLink,
  ArrowRight,
  Briefcase,
  DollarSign,
  MapPin,
  AlertCircle,
} from 'lucide-react';

export const SavedJobsPage: React.FC = () => {
  const navigate = useNavigate();
  const [savedList, setSavedList] = useState<MatchedJobResult[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSavedJobs();
  }, []);

  const loadSavedJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await jobsApi.getSavedJobs();
      setSavedList(list);
    } catch (err: any) {
      setError(err.message || 'Failed to load saved jobs.');
    } finally {
      setLoading(false);
    }
  };

  const handleUnsave = async (e: React.MouseEvent, jobId: string) => {
    e.stopPropagation();
    try {
      await jobsApi.unsaveJob(jobId);
      setSavedList((curr) => curr.filter((j) => j.job.id !== jobId));
    } catch (err: any) {
      alert(err.message || 'Failed to remove saved job.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-mono uppercase tracking-wider mb-1">
            <Bookmark className="w-4 h-4" />
            <span>Saved Opportunities</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Your Bookmarked Jobs
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Review saved positions, check compatibility scores, and proceed to official application links.
          </p>
        </div>

        <Link
          to="/jobs"
          className="px-4 py-2 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl text-xs font-semibold text-slate-300 hover:text-white transition-colors"
        >
          Discover More Jobs
        </Link>
      </div>

      {error && (
        <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="w-10 h-10 border-3 border-emerald-500/20 border-t-emerald-400 rounded-full animate-spin" />
          <p className="text-xs text-slate-400 font-mono">Loading saved positions...</p>
        </div>
      ) : savedList.length === 0 ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center space-y-4 max-w-xl mx-auto">
          <Bookmark className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No Saved Jobs Yet</h3>
          <p className="text-xs text-slate-400">
            Browse the job discovery workspace and bookmark opportunities to track here.
          </p>
          <Link
            to="/jobs"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl hover:bg-emerald-400 transition-colors"
          >
            <span>Explore Jobs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {savedList.map((item) => (
            <div
              key={item.job.id}
              onClick={() => navigate(`/jobs/${item.job.id}`)}
              className="p-4 md:p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40 cursor-pointer transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg group"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-emerald-400">{item.job.company}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                    {item.match.score}% MATCH
                  </span>
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                  {item.job.title}
                </h3>
                <div className="flex items-center flex-wrap gap-4 text-xs text-slate-400">
                  <span>{item.job.location} ({item.job.remoteType})</span>
                  <span>{item.job.employmentType}</span>
                  {item.job.salary?.min && (
                    <span className="font-mono text-slate-300">
                      ${item.job.salary.min.toLocaleString()} - ${item.job.salary.max?.toLocaleString()} / yr
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={(e) => handleUnsave(e, item.job.id)}
                  className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-500 hover:text-rose-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <a
                  href={item.job.applicationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors flex items-center gap-1.5"
                >
                  <span>Apply</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
