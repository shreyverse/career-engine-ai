import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GraduationCap, Briefcase, Compass, ArrowRight } from "lucide-react";
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
    <div className="min-h-screen bg-background text-text py-6 px-6 sm:px-12 lg:px-16 relative subtle-radial-glow flex flex-col justify-between select-none">
      <div className="absolute inset-0 subtle-grid-bg opacity-30 pointer-events-none" />

      {/* Full-Width Top Header: Logo on Far Left, User Profile on Far Right */}
      <header className="w-full flex items-center justify-between pb-5 border-b border-border/80 relative z-10">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-surface-elevated border border-border flex items-center justify-center text-primary shadow-subtle-glow">
            <Compass className="w-5 h-5 text-primary" />
          </div>
          <span className="font-display font-bold text-xl text-text">Career Engine</span>
        </Link>

        <div className="flex items-center gap-3">
          {user && (
            <span className="text-xs font-mono text-text-muted hidden sm:inline-block">
              Signed in as <strong className="text-text">{user.fullName}</strong>
            </span>
          )}
          <Badge variant="primary" size="md">
            Career Onboarding
          </Badge>
        </div>
      </header>

      {/* Centered Main Stage Setup Workspace */}
      <main className="w-full max-w-4xl mx-auto space-y-10 relative z-10 my-auto py-8">
        
        {/* Centered Hero Copy */}
        <div className="space-y-3 text-center max-w-2xl mx-auto">
          <p className="text-xs font-mono uppercase tracking-widest text-primary-light font-semibold">
            Stage 1 • Personalization Setup
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-text tracking-tight">
            What best describes your career stage?
          </h1>
          <p className="text-sm sm:text-base text-text-muted leading-relaxed">
            Tell us where you are in your career so we can personalize your path.
          </p>
        </div>

        {error && <Alert variant="error">{error}</Alert>}

        {/* Dual Cards Centered Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left pt-2 w-full">
          
          {/* Option 1 — Fresher */}
          <div
            onClick={() => !isLoading && handleSelectStage("FRESHER")}
            className={`p-6 sm:p-8 rounded-2xl border transition-all cursor-pointer relative group flex flex-col justify-between select-none ${
              selectedStage === "FRESHER"
                ? "bg-[#111A30] border-primary shadow-elevated-card ring-1 ring-primary/40"
                : "bg-[#0B1020] hover:bg-[#0F172E] border-border/80 hover:border-primary/50"
            } ${isLoading && selectedStage === "FRESHER" ? "opacity-90" : ""}`}
          >
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 group-hover:scale-105 transition-transform">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <Badge variant="primary">Early Career</Badge>
              </div>

              <h2 className="text-2xl font-bold text-text mb-2 group-hover:text-primary-light transition-colors">
                Fresher
              </h2>
              <p className="text-sm text-text-muted mb-6 leading-relaxed">
                "I'm starting my career and want a clear path toward my first opportunity."
              </p>

              <div className="pt-4 border-t border-border/60 space-y-2">
                <div className="text-[11px] font-mono uppercase tracking-wider text-text-dim">
                  Ideal for:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {["Student", "Recent Graduate", "Looking for First Job", "Self-Taught"].map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-md bg-[#162038] text-[#94A3B8] border border-white/[0.06] text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-border/60 flex items-center justify-between text-xs font-semibold text-primary">
              {isLoading && selectedStage === "FRESHER" ? (
                <span className="flex items-center gap-2 text-primary-light">
                  <Spinner size="sm" /> Initializing Fresher Track...
                </span>
              ) : (
                <>
                  <span>Start 6-Step Fresher Assessment</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </div>
          </div>

          {/* Option 2 — Professional */}
          <div
            onClick={() => !isLoading && handleSelectStage("PROFESSIONAL")}
            className={`p-6 sm:p-8 rounded-2xl border transition-all cursor-pointer relative group flex flex-col justify-between select-none ${
              selectedStage === "PROFESSIONAL"
                ? "bg-[#111A30] border-secondary shadow-elevated-card ring-1 ring-secondary/40"
                : "bg-[#0B1020] hover:bg-[#0F172E] border-border/80 hover:border-secondary/50"
            } ${isLoading && selectedStage === "PROFESSIONAL" ? "opacity-90" : ""}`}
          >
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="w-12 h-12 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center border border-secondary/20 group-hover:scale-105 transition-transform">
                  <Briefcase className="w-6 h-6" />
                </div>
                <Badge variant="secondary">Experienced</Badge>
              </div>

              <h2 className="text-2xl font-bold text-text mb-2 group-hover:text-secondary-light transition-colors">
                Professional
              </h2>
              <p className="text-sm text-text-muted mb-6 leading-relaxed">
                "I'm already working and want to grow, switch or advance my career."
              </p>

              <div className="pt-4 border-t border-border/60 space-y-2">
                <div className="text-[11px] font-mono uppercase tracking-wider text-text-dim">
                  Ideal for:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {["Working Professional", "Promotion", "Company Switch", "Domain Switch"].map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-md bg-[#162038] text-[#94A3B8] border border-white/[0.06] text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-border/60 flex items-center justify-between text-xs font-semibold text-secondary">
              {isLoading && selectedStage === "PROFESSIONAL" ? (
                <span className="flex items-center gap-2 text-secondary-light">
                  <Spinner size="sm" /> Initializing Professional Track...
                </span>
              ) : (
                <>
                  <span>Start 6-Step Professional Assessment</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </div>
          </div>

        </div>
      </main>

      {/* Centered Footer info */}
      <footer className="w-full relative z-10 pt-4 text-center text-xs text-text-dim">
        <p>Your assessment progress auto-saves at every step. You can leave and resume anytime.</p>
      </footer>
    </div>
  );
};
