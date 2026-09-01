import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GraduationCap, Briefcase, Compass, ArrowRight, Check } from "lucide-react";
import { Badge } from "../components/ui/Badge";
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
    <div className="min-h-screen bg-[#050608] text-white py-8 px-4 sm:px-8 lg:px-12 relative overflow-hidden flex flex-col justify-between select-none">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[1000px] h-[450px] bg-gradient-to-b from-blue-600/10 via-indigo-600/5 to-transparent blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:32px_32px] opacity-40 pointer-events-none" />

      {/* Header */}
      <header className="w-full max-w-5xl mx-auto flex items-center justify-between pb-6 border-b border-white/[0.08] relative z-10">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.1] flex items-center justify-center text-blue-400 group-hover:border-blue-500/40 group-hover:bg-blue-500/10 transition-all">
            <Compass className="w-5 h-5 text-blue-400" />
          </div>
          <span className="font-display font-bold text-xl text-white tracking-tight">Career Engine</span>
        </Link>

        <div className="flex items-center gap-3">
          {user && (
            <span className="text-xs font-mono text-slate-400 hidden sm:inline-block">
              Signed in as <strong className="text-white">{user.fullName}</strong>
            </span>
          )}
          <Badge variant="primary" size="md">
            Career Onboarding
          </Badge>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="w-full max-w-4xl mx-auto space-y-8 relative z-10 my-auto py-6">
        
        {/* Hero Title */}
        <div className="space-y-3 text-center max-w-2xl mx-auto">
          <p className="text-xs font-mono uppercase tracking-widest text-blue-400 font-semibold">
            Stage 1 • Personalization Setup
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-white tracking-tight">
            What best describes your career stage?
          </h1>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Tell us where you are in your career so we can personalize your path.
          </p>
        </div>

        {error && <Alert variant="error">{error}</Alert>}

        {/* Dual Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 text-left pt-2 w-full">
          
          {/* Card 1: Fresher Track */}
          <div
            onClick={() => !isLoading && handleSelectStage("FRESHER")}
            className={`p-6 sm:p-8 rounded-2xl border transition-all duration-200 cursor-pointer relative flex flex-col justify-between ${
              selectedStage === "FRESHER"
                ? "bg-[#131E36] border-blue-500 ring-2 ring-blue-500/50 shadow-[0_0_30px_rgba(59,130,246,0.25)]"
                : "bg-[#0F172A] border-white/[0.1] hover:border-blue-500/60 hover:bg-[#131E36] hover:shadow-[0_0_25px_rgba(59,130,246,0.15)] shadow-md"
            } ${isLoading && selectedStage === "FRESHER" ? "opacity-95" : ""}`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-blue-500/10 text-blue-300 border border-blue-500/20">
                  Early Career
                </span>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Fresher
                </h2>
                <p className="text-sm text-slate-400 leading-relaxed">
                  "I'm starting my career and want a clear path toward my first opportunity."
                </p>
              </div>

              <div className="pt-4 border-t border-white/[0.08] space-y-2">
                <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500">
                  Ideal for:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {["Student", "Recent Graduate", "Looking for First Job", "Self-Taught"].map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-md bg-white/[0.04] text-slate-300 border border-white/[0.06] text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs font-semibold text-blue-400">
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

          {/* Card 2: Professional Track */}
          <div
            onClick={() => !isLoading && handleSelectStage("PROFESSIONAL")}
            className={`p-6 sm:p-8 rounded-2xl border transition-all duration-200 cursor-pointer relative flex flex-col justify-between ${
              selectedStage === "PROFESSIONAL"
                ? "bg-[#131E36] border-violet-500 ring-2 ring-violet-500/50 shadow-[0_0_30px_rgba(139,92,246,0.25)]"
                : "bg-[#0F172A] border-white/[0.1] hover:border-violet-500/60 hover:bg-[#131E36] hover:shadow-[0_0_25px_rgba(139,92,246,0.15)] shadow-md"
            } ${isLoading && selectedStage === "PROFESSIONAL" ? "opacity-95" : ""}`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-violet-500/10 text-violet-400 flex items-center justify-center border border-violet-500/20">
                  <Briefcase className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-violet-500/10 text-violet-300 border border-violet-500/20">
                  Experienced
                </span>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Professional
                </h2>
                <p className="text-sm text-slate-400 leading-relaxed">
                  "I'm already working and want to grow, switch or advance my career."
                </p>
              </div>

              <div className="pt-4 border-t border-white/[0.08] space-y-2">
                <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500">
                  Ideal for:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {["Working Professional", "Promotion", "Company Switch", "Domain Switch"].map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-md bg-white/[0.04] text-slate-300 border border-white/[0.06] text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs font-semibold text-violet-400">
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
      <footer className="w-full relative z-10 pt-4 text-center text-xs text-slate-500">
        <p>Your assessment progress auto-saves at every step. You can leave and resume anytime.</p>
      </footer>
    </div>
  );
};
