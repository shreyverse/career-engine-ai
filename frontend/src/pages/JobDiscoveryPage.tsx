import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { jobsApi } from '../services/jobsApi';
import { MatchedJobResult, JobSearchFilters, ExperienceLevel } from '../types/jobs.types';
import {
  Briefcase,
  Search,
  MapPin,
  DollarSign,
  Bookmark,
  BookmarkCheck,
  Sparkles,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  Clock
} from 'lucide-react';
import { Spinner } from '../components/ui/Spinner';

export const JobDiscoveryPage: React.FC = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<MatchedJobResult[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [remoteFilter, setRemoteFilter] = useState<boolean>(false);
  const [levelFilter, setLevelFilter] = useState<string>('');
  const [savingJobId, setSavingJobId] = useState<string | null>(null);

  useEffect(() => {
    loadJobs();
  }, [remoteFilter, levelFilter]);

  const loadJobs = async (customQuery?: string) => {
    setLoading(true);
    setError(null);
    try {
      const filters: JobSearchFilters = {
        query: customQuery !== undefined ? customQuery : searchQuery,
        remote: remoteFilter ? true : undefined,
        experienceLevel: levelFilter ? (levelFilter as ExperienceLevel) : undefined,
      };
      const res = await jobsApi.searchJobs(filters);
      setJobs(res.jobs || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load jobs.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadJobs();
  };

  const handleTargetRoleShortcut = (role: string) => {
    setSearchQuery(role);
    loadJobs(role);
  };

  const handleToggleSave = async (e: React.MouseEvent, jobResult: MatchedJobResult) => {
    e.stopPropagation();
    const jobId = jobResult.job.id;
    if (savingJobId) return;
    setSavingJobId(jobId);

    try {
      if (jobResult.isSaved) {
        await jobsApi.unsaveJob(jobId);
        setJobs((curr) =>
          curr.map((j) => (j.job.id === jobId ? { ...j, isSaved: false } : j))
        );
      } else {
        await jobsApi.saveJob(jobId);
        setJobs((curr) =>
          curr.map((j) => (j.job.id === jobId ? { ...j, isSaved: true } : j))
        );
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update saved status.');
    } finally {
      setSavingJobId(null);
    }
  };

  const getMatchBadgeColor = (score: number) => {
    if (score >= 80) return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
    if (score >= 60) return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
    return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
  };

  return (
    <AppLayout maxWidth="wide">
      <div className="w-full space-y-8 text-left">
        
        {/* Full-Width Workspace Header */}
        <div className="w-full flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/[0.08]">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-emerald-400 text-xs font-mono uppercase font-bold tracking-wider">
              <Briefcase className="w-4 h-4" />
              <span>Job Intelligence Engine</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Personalized Opportunities
            </h1>
            <p className="text-sm sm:text-base text-[#8D96AA]">
              Discover real job openings evaluated and ranked against your verified profile, skills, and target role.
            </p>
          </div>

          {/* Header Action Controls */}
          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/jobs/saved"
              className="h-11 px-5 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] hover:border-white/[0.18] text-white font-semibold text-sm flex items-center gap-2 transition-all shadow-sm"
            >
              <Bookmark className="w-4 h-4 text-emerald-400" />
              <span>Saved Jobs</span>
            </Link>
            <Link
              to="/applications"
              className="h-11 px-5 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-[0_0_20px_rgba(16,185,129,0.25)] flex items-center gap-2 transition-all"
            >
              <TrendingUp className="w-4 h-4" />
              <span>Application Tracker</span>
            </Link>
          </div>
        </div>

        {/* Target Role Fast-Filter Banner (Full Width) */}
        <div className="w-full p-4 sm:p-5 rounded-2xl bg-[#0B1020] border border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center space-x-3.5">
            <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="text-sm">
              <span className="text-[#8D96AA] mr-2">Target Role Shortcut:</span>
              <strong className="text-white font-bold">Senior Fullstack Engineer</strong>
            </div>
          </div>
          <button
            onClick={() => handleTargetRoleShortcut('Fullstack Engineer')}
            className="px-4 py-2 bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.08] hover:border-emerald-500/40 text-emerald-300 rounded-xl text-xs font-bold transition-all shadow-sm shrink-0"
          >
            Match My Target Role
          </button>
        </div>

        {/* Full-Width Search & Filter Bar */}
        <form onSubmit={handleSearchSubmit} className="w-full space-y-4">
          <div className="flex flex-col md:flex-row gap-3.5">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8D96AA]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by job title, company, or technical skill (e.g. React, Node.js, PostgreSQL)..."
                className="w-full h-12 bg-[#0B1020] border border-white/[0.08] rounded-2xl pl-11 pr-4 text-sm text-white placeholder-[#8D96AA] focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition-all shadow-inner"
              />
            </div>

            {/* Filter Buttons & Dropdowns */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <button
                type="button"
                onClick={() => setRemoteFilter(!remoteFilter)}
                className={
                  'h-12 px-5 rounded-2xl text-xs font-bold border transition-all ' +
                  (remoteFilter
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                    : 'bg-[#0B1020] text-[#8D96AA] border-white/[0.08] hover:border-white/[0.18] hover:text-white')
                }
              >
                Remote Only
              </button>

              <select
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value)}
                className="h-12 bg-[#0B1020] border border-white/[0.08] text-white text-xs font-semibold rounded-2xl px-4 focus:outline-none focus:border-emerald-500/50"
              >
                <option value="" className="bg-[#07090D] text-white">All Experience Levels</option>
                <option value="ENTRY" className="bg-[#07090D] text-white">Entry Level (0-2 yrs)</option>
                <option value="MID" className="bg-[#07090D] text-white">Mid Level (2-4 yrs)</option>
                <option value="SENIOR" className="bg-[#07090D] text-white">Senior Level (5+ yrs)</option>
              </select>

              <button
                type="submit"
                className="h-12 px-6 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-2xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)]"
              >
                Search
              </button>
            </div>
          </div>
        </form>

        {error && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-sm text-rose-300 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Jobs Feed Grid (Full Width 2 Columns) */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <Spinner size="lg" />
            <p className="text-xs text-[#8D96AA] font-mono">Evaluating 6-pillar job compatibility scores...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="w-full bg-[#0B1020] border border-white/[0.08] rounded-3xl p-16 text-center space-y-4 shadow-xl">
            <Briefcase className="w-12 h-12 text-[#8D96AA] mx-auto" />
            <h3 className="text-lg font-bold text-white">No Matching Job Openings Found</h3>
            <p className="text-sm text-[#8D96AA] max-w-md mx-auto">
              Try broadening your search query or removing filters to discover more matching career opportunities.
            </p>
          </div>
        ) : (
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
            {jobs.map((item) => (
              <div
                key={item.job.id}
                onClick={() => navigate(`/jobs/${item.job.id}`)}
                className="w-full p-6 sm:p-7 rounded-3xl bg-[#0B1020] border border-white/[0.08] hover:border-emerald-500/40 hover:bg-[#0E1528] cursor-pointer transition-all shadow-xl space-y-5 group flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Company & Title Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="text-xs font-mono font-bold text-emerald-400 tracking-wide uppercase block">
                        {item.job.company}
                      </span>
                      <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-emerald-300 transition-colors mt-0.5">
                        {item.job.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0">
                      {/* Match Score Badge */}
                      <span
                        className={
                          'px-3 py-1.5 rounded-xl text-xs font-extrabold font-mono border shadow-sm ' +
                          getMatchBadgeColor(item.match.score)
                        }
                      >
                        {item.match.score}% MATCH
                      </span>

                      <button
                        onClick={(e) => handleToggleSave(e, item)}
                        className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-white/[0.2] text-[#8D96AA] hover:text-white transition-all"
                        title={item.isSaved ? 'Remove from Saved' : 'Save Job'}
                      >
                        {item.isSaved ? (
                          <BookmarkCheck className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Bookmark className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Metadata Chips: Location, Salary, Experience */}
                  <div className="flex items-center gap-2.5 flex-wrap text-xs text-[#8D96AA]">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                      <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      <span>{item.job.location}</span>
                    </div>

                    {item.job.salary && item.job.salary.min && (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                        <DollarSign className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>
                          ${(item.job.salary.min / 1000).toFixed(0)}k - ${(item.job.salary.max ? item.job.salary.max / 1000 : item.job.salary.min / 1000 + 30).toFixed(0)}k
                        </span>
                      </div>
                    )}

                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                      <Clock className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span>{item.job.experienceLevel}</span>
                    </div>
                  </div>

                  {/* AI Match Explanation */}
                  {item.match.whyItFits && item.match.whyItFits.length > 0 && (
                    <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.05] space-y-1.5">
                      <div className="text-[11px] font-mono font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                        <span>Why this matches you:</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {item.match.whyItFits[0]}
                      </p>
                    </div>
                  )}

                  {/* Matched Required Skills */}
                  {item.job.technologies && item.job.technologies.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap pt-1">
                      {item.job.technologies.slice(0, 5).map((skill: string) => (
                        <span
                          key={skill}
                          className="px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.06] text-[11px] font-mono font-medium text-slate-300"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer CTA */}
                <div className="flex items-center justify-between pt-4 border-t border-white/[0.06] mt-2">
                  <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
                    <span>View Role Details & Match Analysis</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </AppLayout>
  );
};
