import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GraduationCap, Briefcase, Compass, ArrowRight } from "lucide-react";
import { Alert } from "../components/ui/Alert";
import { Spinner } from "../components/ui/Spinner";
import { useAuth } from "../hooks/useAuth";

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, setCareerType } = useAuth();
  const [selectedStage, setSelectedStage] = useState<"FRESHER" | "PROFESSIONAL" | null>(
    user?.careerType === "PROFESSIONAL" ? "PROFESSIONAL" : user?.careerType === "FRESHER" ? "FRESHER" : null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSelectStage = async (stage: "FRESHER" | "PROFESSIONAL") => {
    setSelectedStage(stage);
    setIsLoading(true);
    setError(null);

    try {
      const res = await setCareerType(stage);
      navigate(res.nextRoute);
    } catch (err: any) {
      setError(err.message || "Failed to set career stage. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050608] text-white py-4 px-4 sm:px-8 lg:px-12 relative overflow-hidden flex flex-col justify-between select-none w-full">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[1600px] h-[550px] bg-gradient-to-b from-blue-600/10 via-purple-600/5 to-transparent blur-[160px] pointer-events-none rounded-full" />
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:28px_28px] opacity-40 pointer-events-none" />

      {/* Header: Far Left to Far Right End */}
      <header className="w-full flex items-center justify-between pb-4 border-b border-white/[0.08] relative z-10">
        {/* Left End: Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-[#0B1020] border border-white/[0.12] flex items-center justify-center text-blue-400 group-hover:border-blue-500/50 transition-colors shadow-subtle-glow">
            <Compass className="w-4 h-4 text-blue-400" />
          </div>
          <span className="font-display font-bold text-xl text-white tracking-tight">Career Engine</span>
        </Link>

        {/* Right End: User info */}
        <div className="flex items-center gap-4 sm:gap-6">
          {user && (
            <span className="text-xs sm:text-sm font-mono text-slate-400">
              Signed in as <strong className="text-white font-medium">{user.fullName}</strong>
            </span>
          )}
          <span className="text-xs sm:text-sm font-mono text-blue-400 font-medium">
            Career Onboarding
          </span>
        </div>
      </header>

      {/* Main Workspace: 100% Full Width across Screen */}
      <main className="w-full space-y-8 relative z-10 my-auto py-6">
        
        {/* Centered Heading */}
        <div className="space-y-2.5 text-center max-w-3xl mx-auto">
          <p className="text-[11px] font-mono uppercase tracking-widest text-blue-400 font-semibold">
            STAGE 1 • PERSONALIZATION SETUP
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-white tracking-tight leading-tight">
            What best describes your career stage?
          </h1>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-2xl mx-auto">
            Tell us where you are in your career so we can personalize your path.
          </p>
        </div>

        {error && <Alert variant="error">{error}</Alert>}

        {/* Full-Width Dual Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 text-left w-full items-stretch">
          
          {/* 1. Fresher Card */}
          <div
            onClick={() => !isLoading && handleSelectStage("FRESHER")}
            className={`p-8 sm:p-10 lg:p-12 rounded-2xl border transition-all duration-200 cursor-pointer relative flex flex-col justify-between h-full ${
              selectedStage === "FRESHER"
                ? "bg-[#090E1A] border-blue-500 ring-2 ring-blue-500/40 shadow-[0_0_40px_rgba(59,130,246,0.3)]"
                : "bg-[#090E1A] border-white/[0.08] hover:border-blue-500/60 hover:bg-[#0C1322] hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]"
            } ${isLoading && selectedStage === "FRESHER" ? "opacity-90" : ""}`}
          >
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <span className="text-xs sm:text-sm font-mono text-blue-400 font-medium tracking-tight">
                  Early Career
                </span>
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2.5">
                  Fresher
                </h2>
                <p className="text-sm sm:text-base text-slate-400 leading-relaxed min-h-[44px]">
                  "I'm starting my career and want a clear path toward my first opportunity."
                </p>
              </div>

              <div className="pt-5 border-t border-white/[0.08] space-y-2.5">
                <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
                  IDEAL FOR:
                </div>
                <div className="flex flex-wrap gap-2">
                  {["Student", "Recent Graduate", "Looking for First Job", "Self-Taught"].map((tag) => (
                    <span
                      key={tag}
                      className="px-3.5 py-1.5 rounded-lg bg-[#111827] text-slate-300 border border-white/[0.06] text-xs sm:text-sm font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 pt-5 border-t border-white/[0.08] flex items-center justify-between text-xs sm:text-sm font-semibold text-blue-400">
              {isLoading && selectedStage === "FRESHER" ? (
                <span className="flex items-center gap-2 text-blue-300">
                  <Spinner size="sm" /> Initializing Fresher Track...
                </span>
              ) : (
                <>
                  <span>Start 6-Step Fresher Assessment</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </div>
          </div>

          {/* 2. Professional Card */}
          <div
            onClick={() => !isLoading && handleSelectStage("PROFESSIONAL")}
            className={`p-8 sm:p-10 lg:p-12 rounded-2xl border transition-all duration-200 cursor-pointer relative flex flex-col justify-between h-full ${
              selectedStage === "PROFESSIONAL"
                ? "bg-[#090E1A] border-violet-500 ring-2 ring-violet-500/40 shadow-[0_0_40px_rgba(139,92,246,0.3)]"
                : "bg-[#090E1A] border-white/[0.08] hover:border-violet-500/60 hover:bg-[#0C1322] hover:shadow-[0_0_30px_rgba(139,92,246,0.15)]"
            } ${isLoading && selectedStage === "PROFESSIONAL" ? "opacity-90" : ""}`}
          >
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-violet-500/10 text-violet-400 flex items-center justify-center border border-violet-500/20">
                  <Briefcase className="w-6 h-6" />
                </div>
                <span className="text-xs sm:text-sm font-mono text-violet-400 font-medium tracking-tight">
                  Experienced
                </span>
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2.5">
                  Professional
                </h2>
                <p className="text-sm sm:text-base text-slate-400 leading-relaxed min-h-[44px]">
                  "I'm already working and want to grow, switch or advance my career."
                </p>
              </div>

              <div className="pt-5 border-t border-white/[0.08] space-y-2.5">
                <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
                  IDEAL FOR:
                </div>
                <div className="flex flex-wrap gap-2">
                  {["Working Professional", "Promotion", "Company Switch", "Domain Switch"].map((tag) => (
                    <span
                      key={tag}
                      className="px-3.5 py-1.5 rounded-lg bg-[#111827] text-slate-300 border border-white/[0.06] text-xs sm:text-sm font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 pt-5 border-t border-white/[0.08] flex items-center justify-between text-xs sm:text-sm font-semibold text-violet-400">
              {isLoading && selectedStage === "PROFESSIONAL" ? (
                <span className="flex items-center gap-2 text-violet-300">
                  <Spinner size="sm" /> Initializing Professional Track...
                </span>
              ) : (
                <>
                  <span>Start 6-Step Professional Assessment</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="w-full relative z-10 pt-4 text-center text-xs text-slate-600">
        <p>Your assessment progress auto-saves at every step. You can leave and resume anytime.</p>
      </footer>
    </div>
  );
};
