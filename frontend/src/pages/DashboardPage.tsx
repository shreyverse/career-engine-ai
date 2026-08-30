import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { dashboardApi } from '../services/dashboardApi';
import { DashboardAggregatedResponse } from '../types/dashboard.types';
import {
  Sparkles,
  Compass,
  Route,
  Layers,
  FileText,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  Zap,
  Target,
  Code2,
  ChevronRight,
  BookOpen,
  Award,
  BarChart2
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<DashboardAggregatedResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await dashboardApi.getDashboardData();
      setData(res);
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 space-y-4">
          <div className="w-10 h-10 border-3 border-blue-500/20 border-t-blue-400 rounded-full animate-spin" />
          <p className="text-xs text-[#8D96AA] font-mono">Aggregating Career Intelligence Workspace...</p>
        </div>
      </AppLayout>
    );
  }

  if (error || !data) {
    return (
      <AppLayout>
        <div className="min-h-[60vh] p-8 flex flex-col items-center justify-center space-y-4">
          <AlertCircle className="w-8 h-8 text-rose-400" />
          <p className="text-sm text-slate-300">{error || 'Failed to load dashboard data.'}</p>
          <button
            onClick={loadDashboard}
            className="px-5 py-2.5 bg-blue-600 text-white text-xs font-semibold rounded-xl hover:bg-blue-500 transition-colors"
          >
            Retry
          </button>
        </div>
      </AppLayout>
    );
  }

  const { user, career, readiness, nextMove, skillGaps, roadmap, resume, ats, topStrengths, topWeaknesses, topRecommendedTech } = data;
  const firstName = user?.fullName ? user.fullName.split(' ')[0] : 'Career Explorer';

  const skillsList = [
    { name: 'JavaScript', level: '92%', percent: 92, status: 'Strong' },
    { name: 'React', level: '86%', percent: 86, status: 'Proficient' },
    { name: 'Node.js', level: '61%', percent: 61, status: 'Developing' },
    { name: 'System Design', level: '42%', percent: 42, status: 'Needs Improvement' },
    { name: 'AWS / Cloud', level: '35%', percent: 35, status: 'Gap' },
  ];

  const totalGapsCount = topWeaknesses?.length > 0 ? topWeaknesses.length : 7;
  const targetRoleName = career?.targetRole || 'Senior Full Stack Developer';
  const currentRoleName = career?.currentLevel || 'Frontend Developer';
  const overallProgress = readiness?.overall || 68;

  return (
    <AppLayout>
      <div className="w-full space-y-8 text-left">
        
        {/* 1. Dynamic Greeting Section */}
        <div className="space-y-1.5">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Welcome back, {firstName} 👋
          </h1>
          <p className="text-sm text-[#8D96AA]">
            Here&apos;s what Career Engine has learned about your career journey.
          </p>
        </div>

        {/* 2. CAREER STATUS SUMMARY CARD */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0B1020] border border-white/[0.08] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 blur-[100px] pointer-events-none rounded-full" />
          
          <div className="flex items-center justify-between pb-6 border-b border-white/[0.06]">
            <span className="text-[11px] font-mono uppercase tracking-widest text-blue-400 font-bold flex items-center gap-1.5">
              <Compass className="w-4 h-4" />
              YOUR CAREER JOURNEY
            </span>
            <span className="text-xs px-3 py-1 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20 font-mono font-semibold">
              Live Trajectory
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 pt-6 items-center">
            <div className="space-y-1">
              <span className="text-[11px] text-[#8D96AA] block font-medium">Current Role</span>
              <span className="text-base sm:text-lg font-bold text-white block truncate">{currentRoleName}</span>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] text-[#8D96AA] block font-medium">Target Role</span>
              <span className="text-base sm:text-lg font-bold text-blue-300 block truncate">{targetRoleName}</span>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] text-[#8D96AA] block font-medium">Career Progress</span>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-extrabold text-white">{overallProgress}%</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] text-[#8D96AA] block font-medium">Skills Analyzed</span>
              <span className="text-2xl font-extrabold text-white">24</span>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] text-[#8D96AA] block font-medium">Skills To Improve</span>
              <span className="text-2xl font-extrabold text-rose-400">{totalGapsCount}</span>
            </div>
          </div>
        </div>

        {/* 3. AI INSIGHT & JOURNEY PROGRESSION ROW */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Career Engine AI Insight Card */}
          <div className="p-6 sm:p-7 rounded-3xl bg-[#0B1020] border border-blue-500/20 shadow-xl space-y-5 relative overflow-hidden flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-blue-400 text-xs font-mono font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span>Career Engine AI Insight</span>
              </div>
              <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
                {readiness?.reasoning ? readiness.reasoning : "You're strong in JavaScript, React and frontend fundamentals. Your biggest opportunity is strengthening backend development, system design and cloud skills for target role readiness."}
              </p>
            </div>

            <div className="pt-2">
              <Link
                to="/career-analysis"
                className="inline-flex items-center gap-2 text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors group"
              >
                <span>View Full Analysis</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Quick Career Journey Summary */}
          <div className="p-6 sm:p-7 rounded-3xl bg-[#0B1020] border border-white/[0.08] shadow-xl space-y-5 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase tracking-wider text-[#8D96AA] font-bold block">
                Target Transition Path
              </span>
              <div className="flex items-center gap-3 pt-1">
                <span className="px-3 py-1.5 rounded-xl bg-white/[0.05] text-xs font-semibold text-slate-300">
                  {currentRoleName}
                </span>
                <ArrowRight className="w-4 h-4 text-blue-400 shrink-0" />
                <span className="px-3 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-xs font-bold text-blue-300">
                  {targetRoleName}
                </span>
              </div>
              <p className="text-xs text-[#8D96AA] pt-2">
                Your structured milestones are synchronized with current tech market hiring benchmarks.
              </p>
            </div>

            <div className="pt-2">
              <Link
                to="/career-path"
                className="inline-flex items-center gap-2 text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors group"
              >
                <span>Open Interactive Career Path</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        {/* 4. SKILL GAP SECTION */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0B1020] border border-white/[0.08] shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-white/[0.06]">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-400" />
                Your Skill Gap
              </h2>
              <p className="text-xs text-[#8D96AA]">Current Proficiency vs. Target Role Expectations</p>
            </div>
            <span className="text-xs font-mono text-rose-400 font-semibold bg-rose-500/10 border border-rose-500/20 px-3 py-1 rounded-full w-fit">
              {totalGapsCount} skills need improvement
            </span>
          </div>

          <div className="space-y-4">
            {skillsList.map((s) => (
              <div key={s.name} className="space-y-1.5">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-200">{s.name}</span>
                  <span className="font-mono text-[#8D96AA]">{s.level}</span>
                </div>
                <div className="h-2 w-full bg-white/[0.05] rounded-full overflow-hidden">
                  <div
                    className={
                      s.percent >= 80
                        ? "h-full bg-gradient-to-r from-blue-500 to-emerald-400 rounded-full"
                        : s.percent >= 60
                        ? "h-full bg-gradient-to-r from-blue-500 to-indigo-400 rounded-full"
                        : "h-full bg-gradient-to-r from-amber-500 to-rose-400 rounded-full"
                    }
                    style={{ width: s.level }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <Link
              to="/skills"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/30 text-xs font-bold text-blue-400 hover:text-blue-300 transition-all"
            >
              <span>Analyze Skill Gaps</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* 5. CAREER ROADMAP PROGRESSION */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0B1020] border border-white/[0.08] shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-white/[0.06]">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Route className="w-4 h-4 text-indigo-400" />
                Your Career Roadmap
              </h2>
              <p className="text-xs text-[#8D96AA]">Prerequisite-aware development journey</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#8D96AA]">Current Stage:</span>
              <span className="text-xs font-bold text-indigo-300 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20">
                Skill Development
              </span>
            </div>
          </div>

          {/* Horizontal Stage Progression */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 pt-2">
            {[
              { step: "1", title: "Current Role", done: true },
              { step: "2", title: "Skill Analysis", done: true },
              { step: "3", title: "Skill Development", current: true },
              { step: "4", title: "Projects", done: false },
              { step: "5", title: "Interview Prep", done: false },
              { step: "6", title: "Target Career", done: false },
            ].map((st) => (
              <div
                key={st.step}
                className={
                  st.current
                    ? "p-3 rounded-2xl bg-indigo-500/15 border border-indigo-500/40 text-left space-y-1 shadow-[0_0_15px_rgba(99,102,241,0.2)]"
                    : st.done
                    ? "p-3 rounded-2xl bg-white/[0.02] border border-emerald-500/30 text-left space-y-1"
                    : "p-3 rounded-2xl bg-white/[0.01] border border-white/[0.05] text-left space-y-1 opacity-60"
                }
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-[#8D96AA]">Stage {st.step}</span>
                  {st.done && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                  {st.current && <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />}
                </div>
                <span className="text-xs font-semibold text-white block truncate">{st.title}</span>
              </div>
            ))}
          </div>

          <div className="pt-2 flex justify-between items-center">
            <span className="text-xs text-[#8D96AA]">Progress: <strong className="text-white">68% Complete</strong></span>
            <Link
              to="/career-path"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500 shadow-lg shadow-indigo-500/25 transition-all"
            >
              <span>Continue Roadmap</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* 6. RECOMMENDED ACTIONS SECTION */}
        <div className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              Recommended for You
            </h2>
            <p className="text-xs text-[#8D96AA]">High-impact priority actions tailored to your profile</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-[#0B1020] border border-white/[0.08] hover:border-blue-500/30 transition-all space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                  <Code2 className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-white">Improve Node.js</h3>
                <p className="text-xs text-[#8D96AA]">Complete 2 backend microservice projects to verify asynchronous APIs.</p>
              </div>
              <Link to="/career-path" className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1">
                Start Task <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="p-5 rounded-2xl bg-[#0B1020] border border-white/[0.08] hover:border-indigo-500/30 transition-all space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                  <Layers className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-white">System Design</h3>
                <p className="text-xs text-[#8D96AA]">Master distributed caching, load balancers, and database indexing.</p>
              </div>
              <Link to="/coach" className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                Learn with AI <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="p-5 rounded-2xl bg-[#0B1020] border border-white/[0.08] hover:border-emerald-500/30 transition-all space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-white">Resume Optimization</h3>
                <p className="text-xs text-[#8D96AA]">Boost your ATS compatibility score with targeted keywords.</p>
              </div>
              <Link to="/resume" className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
                Optimize ATS <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="p-5 rounded-2xl bg-[#0B1020] border border-white/[0.08] hover:border-purple-500/30 transition-all space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                  <Award className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-white">Interview Prep</h3>
                <p className="text-xs text-[#8D96AA]">Practice 10 tailored technical and architecture interview prompts.</p>
              </div>
              <Link to="/coach" className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1">
                Practice Now <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* 7. MATCHED JOBS SECTION */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-blue-400" />
                Jobs That Match Your Profile
              </h2>
              <p className="text-xs text-[#8D96AA]">Opportunities scored against your verified skills & trajectory</p>
            </div>
            <Link to="/jobs" className="text-xs font-bold text-blue-400 hover:text-blue-300">
              View All Jobs →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-[#0B1020] border border-white/[0.08] hover:border-blue-500/30 transition-all space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Frontend Engineer</h3>
                  <span className="text-xs text-[#8D96AA]">TechFlow Inc. • Remote</span>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold font-mono">
                  92% Match
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <span className="text-[11px] px-2 py-0.5 rounded-md bg-white/[0.04] text-slate-300">React</span>
                <span className="text-[11px] px-2 py-0.5 rounded-md bg-white/[0.04] text-slate-300">TypeScript</span>
                <span className="text-[11px] px-2 py-0.5 rounded-md bg-white/[0.04] text-slate-300">Tailwind</span>
              </div>
              <Link
                to="/jobs"
                className="block text-center py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-bold text-white transition-colors"
              >
                View Job →
              </Link>
            </div>

            <div className="p-5 rounded-2xl bg-[#0B1020] border border-white/[0.08] hover:border-blue-500/30 transition-all space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Full Stack Developer</h3>
                  <span className="text-xs text-[#8D96AA]">ScaleSphere • Hybrid</span>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-bold font-mono">
                  85% Match
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <span className="text-[11px] px-2 py-0.5 rounded-md bg-white/[0.04] text-slate-300">Node.js</span>
                <span className="text-[11px] px-2 py-0.5 rounded-md bg-white/[0.04] text-slate-300">React</span>
                <span className="text-[11px] px-2 py-0.5 rounded-md bg-white/[0.04] text-slate-300">PostgreSQL</span>
              </div>
              <Link
                to="/jobs"
                className="block text-center py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-bold text-white transition-colors"
              >
                View Job →
              </Link>
            </div>

            <div className="p-5 rounded-2xl bg-[#0B1020] border border-white/[0.08] hover:border-blue-500/30 transition-all space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Backend Engineer</h3>
                  <span className="text-xs text-[#8D96AA]">Nexus Cloud • Remote</span>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-bold font-mono">
                  78% Match
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <span className="text-[11px] px-2 py-0.5 rounded-md bg-white/[0.04] text-slate-300">Node.js</span>
                <span className="text-[11px] px-2 py-0.5 rounded-md bg-white/[0.04] text-slate-300">Docker</span>
                <span className="text-[11px] px-2 py-0.5 rounded-md bg-white/[0.04] text-slate-300">AWS</span>
              </div>
              <Link
                to="/jobs"
                className="block text-center py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-bold text-white transition-colors"
              >
                View Job →
              </Link>
            </div>
          </div>
        </div>

      </div>
    </AppLayout>
  );
};
