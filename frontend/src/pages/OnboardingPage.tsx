import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GraduationCap, Briefcase, Compass, ArrowRight } from "lucide-react";
import { Alert } from "../components/ui/Alert";
import { Badge } from "../components/ui/Badge";
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
    <div className="min-h-screen bg-background text-text py-6 px-4 sm:px-8 lg:px-12 relative subtle-radial-glow flex flex-col justify-between select-none w-full">
      {/* Grid Pattern matching Assessment Page */}
      <div className="absolute inset-0 subtle-grid-bg opacity-30 pointer-events-none" />

      {/* Header */}
      <header className="w-full flex items-center justify-between pb-4 border-b border-border/80 relative z-10">
        {/* Left: Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-surface-elevated border border-border flex items-center justify-center text-primary group-hover:scale-105 transition-transform shadow-subtle-glow">
            <Compass className="w-4 h-4 text-primary" />
          </div>
          <span className="font-display font-bold text-lg text-text tracking-tight">Career Engine</span>
        </Link>

        {/* Right: User and Tag */}
        <div className="flex items-center gap-4">
          {user && (
            <span className="text-xs sm:text-sm font-mono text-text-muted">
              Signed in as <strong className="text-text font-medium">{user.fullName}</strong>
            </span>
          )}
          <Badge variant="primary" size="sm">
            Career Onboarding
          </Badge>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="w-full max-w-6xl mx-auto space-y-8 relative z-10 my-auto py-8">
        
        {/* Centered Heading */}
        <div className="space-y-2.5 text-center max-w-3xl mx-auto">
          <p className="text-[11px] font-mono uppercase tracking-widest text-primary-light font-semibold">
            STAGE 1 • PERSONALIZATION SETUP
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-text tracking-tight leading-tight">
            What best describes your career stage?
          </h1>
          <p className="text-sm sm:text-base text-text-muted leading-relaxed max-w-2xl mx-auto">
            Tell us where you are in your career so we can personalize your path.
          </p>
        </div>

        {error && <Alert variant="error">{error}</Alert>}

        {/* Dual Cards Grid matching Elevated Card Styling */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 text-left w-full items-stretch">
          
          {/* 1. Fresher Card */}
          <div
            onClick={() => !isLoading && handleSelectStage("FRESHER")}
            className={`p-7 sm:p-9 rounded-2xl border transition-all duration-200 cursor-pointer relative flex flex-col justify-between h-full ${
              selectedStage === "FRESHER"
                ? "bg-surface-elevated border-primary ring-2 ring-primary/40 shadow-elevated-card"
                : "bg-surface hover:bg-surface-elevated border-border hover:border-primary/50 shadow-surface-card"
            } ${isLoading && selectedStage === "FRESHER" ? "opacity-90" : ""}`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <Badge variant="primary" size="sm">
                  Early Career
                </Badge>
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-text mb-2">
                  Fresher
                </h2>
                <p className="text-sm text-text-muted leading-relaxed min-h-[40px]">
                  "I'm starting my career and want a clear path toward my first opportunity."
                </p>
              </div>

              <div className="pt-4 border-t border-border/80 space-y-2">
                <div className="text-[11px] font-mono uppercase tracking-wider text-text-dim font-semibold">
                  IDEAL FOR:
                </div>
                <div className="flex flex-wrap gap-2">
                  {["Student", "Recent Graduate", "Looking for First Job", "Self-Taught"].map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1.5 rounded-lg bg-surface-elevated text-text-muted border border-border text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-border/80 flex items-center justify-between text-xs sm:text-sm font-semibold text-primary">
              {isLoading && selectedStage === "FRESHER" ? (
                <span className="flex items-center gap-2 text-primary-light">
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
            className={`p-7 sm:p-9 rounded-2xl border transition-all duration-200 cursor-pointer relative flex flex-col justify-between h-full ${
              selectedStage === "PROFESSIONAL"
                ? "bg-surface-elevated border-secondary ring-2 ring-secondary/40 shadow-elevated-card"
                : "bg-surface hover:bg-surface-elevated border-border hover:border-secondary/50 shadow-surface-card"
            } ${isLoading && selectedStage === "PROFESSIONAL" ? "opacity-90" : ""}`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center border border-secondary/20">
                  <Briefcase className="w-5 h-5" />
                </div>
                <Badge variant="secondary" size="sm">
                  Experienced
                </Badge>
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-text mb-2">
                  Professional
                </h2>
                <p className="text-sm text-text-muted leading-relaxed min-h-[40px]">
                  "I'm already working and want to grow, switch or advance my career."
                </p>
              </div>

              <div className="pt-4 border-t border-border/80 space-y-2">
                <div className="text-[11px] font-mono uppercase tracking-wider text-text-dim font-semibold">
                  IDEAL FOR:
                </div>
                <div className="flex flex-wrap gap-2">
                  {["Working Professional", "Promotion", "Company Switch", "Domain Switch"].map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1.5 rounded-lg bg-surface-elevated text-text-muted border border-border text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-border/80 flex items-center justify-between text-xs sm:text-sm font-semibold text-secondary">
              {isLoading && selectedStage === "PROFESSIONAL" ? (
                <span className="flex items-center gap-2 text-secondary-light">
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
      <footer className="w-full relative z-10 pt-4 text-center text-xs text-text-dim">
        <p>Your assessment progress auto-saves at every step. You can leave and resume anytime.</p>
      </footer>
    </div>
  );
};
