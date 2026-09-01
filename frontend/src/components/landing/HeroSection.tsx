import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Compass, Target, Layers, CheckCircle2, ChevronRight, FileText } from "lucide-react";
import { ResumeAnalysisModal } from "../resume/ResumeAnalysisModal";

export const HeroSection: React.FC = () => {
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);

  return (
    <section className="w-full min-h-[96vh] flex flex-col justify-center items-center pt-28 pb-20 px-4 sm:px-8 lg:px-16 relative overflow-hidden bg-[#050608]">
      
      {/* 1. Atmospheric Ambient Radial Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[1100px] h-[520px] bg-gradient-to-b from-blue-600/20 via-indigo-600/15 to-transparent blur-[120px] pointer-events-none rounded-full animate-hero-glow" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[600px] h-[280px] bg-blue-500/25 blur-[85px] pointer-events-none rounded-full" />

      {/* 2. Clearly Visible Layered Elliptical Orbits & Moving Trajectory Nodes */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden select-none">
        
        <svg
          className="w-full max-w-[1700px] h-[900px] animate-orbit-pulse"
          viewBox="0 0 1600 850"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Glowing filter for nodes */}
            <filter id="node-glow-bright" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur1" />
              <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur2" />
              <feMerge>
                <feMergeNode in="blur1" />
                <feMergeNode in="blur2" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Elliptical paths for animated nodes */}
            <path
              id="orbitOuter"
              d="M 800, 75 a 710,350 0 1,0 0.1,0 Z"
            />
            <path
              id="orbitMiddle"
              d="M 800, 165 a 530,260 0 1,0 0.1,0 Z"
            />
            <path
              id="orbitInner"
              d="M 800, 255 a 370,170 0 1,0 0.1,0 Z"
            />
          </defs>

          {/* Layer 1: Outer Orbit Ring (Noticeable soft indigo dashed line) */}
          <ellipse
            cx="800"
            cy="425"
            rx="710"
            ry="350"
            stroke="rgba(99, 102, 241, 0.22)"
            strokeWidth="1.5"
            strokeDasharray="6 10"
            transform="rotate(-2 800 425)"
          />

          {/* Layer 2: Middle Orbit Ring (Vibrant electric blue dashed line) */}
          <ellipse
            cx="800"
            cy="425"
            rx="530"
            ry="260"
            stroke="rgba(59, 130, 246, 0.32)"
            strokeWidth="1.5"
            strokeDasharray="4 8"
            transform="rotate(2 800 425)"
          />

          {/* Layer 3: Inner Orbit Ring (Crisp soft cyan dashed line) */}
          <ellipse
            cx="800"
            cy="425"
            rx="370"
            ry="170"
            stroke="rgba(147, 197, 253, 0.38)"
            strokeWidth="1.5"
            strokeDasharray="3 6"
            transform="rotate(-1 800 425)"
          />

          {/* Trajectory Nodes traveling along orbits */}

          {/* Node 1: Electric Blue particle on Middle Orbit (Clockwise 28s) */}
          <circle r="4" fill="#38BDF8" filter="url(#node-glow-bright)">
            <animateMotion dur="28s" repeatCount="indefinite">
              <mpath href="#orbitMiddle" />
            </animateMotion>
          </circle>

          {/* Node 2: Bright Indigo particle on Middle Orbit (Counter-clockwise 38s) */}
          <circle r="4" fill="#818CF8" filter="url(#node-glow-bright)">
            <animateMotion dur="38s" keyPoints="1;0" keyTimes="0;1" repeatCount="indefinite">
              <mpath href="#orbitMiddle" />
            </animateMotion>
          </circle>

          {/* Node 3: Bright Cyan particle on Outer Orbit (Clockwise 48s) */}
          <circle r="3.5" fill="#67E8F9" filter="url(#node-glow-bright)">
            <animateMotion dur="48s" repeatCount="indefinite">
              <mpath href="#orbitOuter" />
            </animateMotion>
          </circle>

          {/* Node 4: Bright Purple particle on Inner Orbit (Clockwise 22s) */}
          <circle r="3.5" fill="#C084FC" filter="url(#node-glow-bright)">
            <animateMotion dur="22s" repeatCount="indefinite">
              <mpath href="#orbitInner" />
            </animateMotion>
          </circle>

          {/* Static Accent Star/Glow Nodes at Cardinal Angles */}
          <circle cx="270" cy="425" r="3" fill="#60A5FA" opacity="0.7" filter="url(#node-glow-bright)" />
          <circle cx="1330" cy="425" r="3" fill="#818CF8" opacity="0.7" filter="url(#node-glow-bright)" />
          <circle cx="800" cy="165" r="2.5" fill="#38BDF8" opacity="0.6" filter="url(#node-glow-bright)" />
          <circle cx="800" cy="685" r="2.5" fill="#A78BFA" opacity="0.6" filter="url(#node-glow-bright)" />

        </svg>
      </div>

      {/* 3. Subtle Matrix Grid Texture */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:32px_32px] opacity-60 pointer-events-none" />

      {/* 4. Center Hero Content Container */}
      <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col items-center text-center space-y-8">
        
        {/* Announcement Pill */}
        <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-white/[0.04] border border-white/[0.1] shadow-[0_0_25px_rgba(59,130,246,0.2)] hover:border-blue-500/40 transition-all cursor-pointer group">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
          </span>
          <span className="text-xs font-mono uppercase tracking-widest text-[#F5F7FF] font-bold">
            AI-POWERED CAREER GUIDANCE
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-[#8D96AA] group-hover:text-white group-hover:translate-x-0.5 transition-all" />
        </div>

        {/* Main Hero Headline */}
        <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[88px] font-extrabold tracking-tight text-[#F5F7FF] leading-[1.04] max-w-5xl">
          Transform Your Career <br className="hidden sm:block" />
          with <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 drop-shadow-[0_0_40px_rgba(99,102,241,0.35)]">Career Engine AI</span>
        </h1>

        {/* Supporting Subtitle */}
        <p className="text-lg sm:text-xl md:text-2xl text-[#8D96AA] max-w-3xl font-normal leading-relaxed">
          Analyze your skills, identify your gaps, and build a personalized roadmap to reach your career goals.
        </p>

        {/* Action CTA Buttons: Row 1 */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-3 w-full sm:w-auto">
          <Link
            to="/onboarding"
            className="w-full sm:w-auto px-9 py-4.5 rounded-full text-base font-bold text-white bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-[0_0_28px_rgba(59,130,246,0.45)] hover:shadow-[0_0_42px_rgba(59,130,246,0.7)] transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2.5 group"
          >
            <span>Start Your Career Analysis</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>

          <a
            href="#how-it-works"
            className="w-full sm:w-auto px-8 py-4.5 rounded-full text-base font-semibold text-[#F5F7FF] bg-white/[0.04] border border-white/[0.12] hover:bg-white/[0.08] hover:border-white/[0.25] transition-all flex items-center justify-center gap-2.5"
          >
            <Compass className="w-5 h-5 text-blue-400" />
            <span>Explore How It Works</span>
          </a>
        </div>

        {/* Third Prominent Option directly below */}
        <div className="pt-2 flex flex-col items-center space-y-2">
          <button
            type="button"
            onClick={() => setIsResumeModalOpen(true)}
            className="px-8 py-3.5 rounded-2xl bg-[#090E1E] border border-blue-500/40 hover:border-blue-500/80 hover:bg-[#0E1730] shadow-[0_0_25px_rgba(59,130,246,0.22)] hover:shadow-[0_0_35px_rgba(59,130,246,0.4)] transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-3 group cursor-pointer"
          >
            <FileText className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
            <span className="text-base font-bold text-white">Analyze Your Resume</span>
            <ArrowRight className="w-4 h-4 text-blue-400 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <p className="text-xs font-mono text-slate-400">
            Get your ATS score instantly — no login required.
          </p>
        </div>

        {/* Expanded 4-Stage Career Engine Process Cards Grid */}
        <div className="pt-12 w-full max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
            
            <Link
              to="/career-analysis"
              className="p-5 rounded-2xl bg-white/[0.025] border border-white/[0.08] hover:border-blue-500/40 hover:bg-white/[0.04] transition-all space-y-2 block group shadow-lg"
            >
              <div className="flex items-center space-x-2 text-blue-400 text-sm font-mono font-bold group-hover:text-blue-300">
                <Sparkles className="w-4 h-4" />
                <span>1. AI Profiling</span>
              </div>
              <p className="text-xs text-[#8D96AA] leading-relaxed">
                Evaluates your current skills, projects, and career stage with Gemini AI reasoning.
              </p>
            </Link>

            <Link
              to="/skills"
              className="p-5 rounded-2xl bg-white/[0.025] border border-white/[0.08] hover:border-indigo-500/40 hover:bg-white/[0.04] transition-all space-y-2 block group shadow-lg"
            >
              <div className="flex items-center space-x-2 text-indigo-400 text-sm font-mono font-bold group-hover:text-indigo-300">
                <Target className="w-4 h-4" />
                <span>2. Skill Gaps</span>
              </div>
              <p className="text-xs text-[#8D96AA] leading-relaxed">
                Pinpoints exact technical and domain deficiencies against real hiring benchmarks.
              </p>
            </Link>

            <Link
              to="/career-path"
              className="p-5 rounded-2xl bg-white/[0.025] border border-white/[0.08] hover:border-purple-500/40 hover:bg-white/[0.04] transition-all space-y-2 block group shadow-lg"
            >
              <div className="flex items-center space-x-2 text-purple-400 text-sm font-mono font-bold group-hover:text-purple-300">
                <Layers className="w-4 h-4" />
                <span>3. Roadmap</span>
              </div>
              <p className="text-xs text-[#8D96AA] leading-relaxed">
                Synthesizes ordered learning sprints, milestone tasks, and portfolio projects.
              </p>
            </Link>

            <Link
              to="/jobs"
              className="p-5 rounded-2xl bg-white/[0.025] border border-white/[0.08] hover:border-emerald-500/40 hover:bg-white/[0.04] transition-all space-y-2 block group shadow-lg"
            >
              <div className="flex items-center space-x-2 text-emerald-400 text-sm font-mono font-bold group-hover:text-emerald-300">
                <CheckCircle2 className="w-4 h-4" />
                <span>4. Job Match</span>
              </div>
              <p className="text-xs text-[#8D96AA] leading-relaxed">
                Calculates 6-pillar compatibility scoring for live opportunities matching your profile.
              </p>
            </Link>

          </div>
        </div>

      </div>

      {/* Resume Analysis Interactive Modal */}
      <ResumeAnalysisModal
        isOpen={isResumeModalOpen}
        onClose={() => setIsResumeModalOpen(false)}
      />
    </section>
  );
};
