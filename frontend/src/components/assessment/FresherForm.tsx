import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { Textarea } from "../ui/Textarea";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Alert } from "../ui/Alert";
import { AssessmentProgress } from "./AssessmentProgress";
import { assessmentService } from "../../services/assessmentService";
import { useAuth } from "../../hooks/useAuth";
import { ArrowLeft, ArrowRight, CheckCircle2, Sparkles, GraduationCap } from "lucide-react";

export const FresherForm: React.FC = () => {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [degree, setDegree] = useState("B.S. Computer Science");
  const [major, setMajor] = useState("Software Engineering");
  const [graduationYear, setGraduationYear] = useState<number>(2025);
  const [institution, setInstitution] = useState("");
  const [gpa, setGpa] = useState<string>("");

  const [primaryInterests, setPrimaryInterests] = useState<string[]>([
    "Frontend Development",
    "Backend Systems",
  ]);

  const [knownTechnologies, setKnownTechnologies] = useState<string[]>([
    "JavaScript",
    "TypeScript",
    "React",
    "Git",
  ]);

  const [preferredTracks, setPreferredTracks] = useState<string[]>([
    "Fullstack Engineer",
  ]);

  const [projectSummary, setProjectSummary] = useState("");

  const availableInterests = [
    "Frontend Development",
    "Backend Systems",
    "Fullstack Engineering",
    "AI & Machine Learning",
    "Cloud & DevOps",
    "Data Science & Analytics",
    "Mobile App Development",
    "Cybersecurity",
  ];

  const availableTech = [
    "JavaScript",
    "TypeScript",
    "React",
    "Node.js",
    "Python",
    "Java",
    "C++",
    "SQL / PostgreSQL",
    "MongoDB",
    "Docker",
    "Git",
    "Tailwind CSS",
  ];

  const availableTracks = [
    "Fullstack Engineer",
    "Frontend Engineer",
    "Backend Engineer",
    "AI/ML Engineer",
    "DevOps / Cloud Engineer",
    "Data Engineer",
  ];

  const toggleItem = (list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>, item: string) => {
    if (list.includes(item)) {
      setList(list.filter((i) => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      if (!institution.trim()) {
        setError("Please enter your university / college institution name.");
        return;
      }
      setError(null);
      setStep(2);
    } else if (step === 2) {
      if (primaryInterests.length === 0) {
        setError("Please select at least one primary domain interest.");
        return;
      }
      setError(null);
      setStep(3);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      await assessmentService.submitFresher({
        degree,
        major,
        graduationYear: Number(graduationYear),
        institution: institution.trim(),
        gpa: gpa ? parseFloat(gpa) : undefined,
        primaryInterests,
        knownTechnologies,
        preferredCareerTracks: preferredTracks,
        projectSummary: projectSummary.trim() || undefined,
      });

      await refreshUser();
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to save assessment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { number: 1, title: "Education" },
    { number: 2, title: "Skills & Interests" },
    { number: 3, title: "Goals & Review" },
  ];

  return (
    <Card variant="elevated" padding="lg" className="w-full max-w-2xl mx-auto text-left space-y-6">
      <div className="flex items-center justify-between pb-2 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <GraduationCap className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-text">Fresher Career Intake</h2>
            <span className="text-xs text-text-muted">Early Career Assessment</span>
          </div>
        </div>
        <Badge variant="primary">Step {step} of 3</Badge>
      </div>

      <AssessmentProgress steps={steps} currentStep={step} />

      {error && <Alert variant="error">{error}</Alert>}

      {/* Step 1: Education */}
      {step === 1 && (
        <form onSubmit={handleNext} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Degree"
              placeholder="e.g. B.S. Computer Science"
              value={degree}
              onChange={(e) => setDegree(e.target.value)}
              required
            />
            <Input
              label="Major / Specialization"
              placeholder="e.g. Software Engineering"
              value={major}
              onChange={(e) => setMajor(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="University / Institution"
              placeholder="e.g. Stanford University"
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
              required
            />
            <Select
              label="Graduation Year"
              value={graduationYear.toString()}
              onChange={(e) => setGraduationYear(Number(e.target.value))}
              options={[
                { value: "2024", label: "2024 (Recent Graduate)" },
                { value: "2025", label: "2025 (Graduating This Year)" },
                { value: "2026", label: "2026" },
                { value: "2027", label: "2027" },
                { value: "2028", label: "2028+" },
              ]}
            />
          </div>

          <Input
            label="GPA (Optional)"
            placeholder="e.g. 3.8 / 4.0"
            value={gpa}
            onChange={(e) => setGpa(e.target.value)}
            helperText="Used strictly to calibrate initial interview readiness models"
          />

          <div className="pt-4 flex justify-end">
            <Button type="submit" variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Continue to Skills & Interests
            </Button>
          </div>
        </form>
      )}

      {/* Step 2: Interests & Technologies */}
      {step === 2 && (
        <form onSubmit={handleNext} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-xs font-mono uppercase tracking-wider text-text-muted font-semibold">
              Primary Domain Interests (Select all that apply)
            </label>
            <div className="flex flex-wrap gap-2">
              {availableInterests.map((interest) => {
                const isSelected = primaryInterests.includes(interest);
                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleItem(primaryInterests, setPrimaryInterests, interest)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                      isSelected
                        ? "bg-primary text-white border-primary shadow-subtle-glow"
                        : "bg-surface-elevated text-text-muted border-border hover:border-border-bright"
                    }`}
                  >
                    {interest}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-border/80">
            <label className="block text-xs font-mono uppercase tracking-wider text-text-muted font-semibold">
              Technologies You've Practiced / Learned
            </label>
            <div className="flex flex-wrap gap-2">
              {availableTech.map((tech) => {
                const isSelected = knownTechnologies.includes(tech);
                return (
                  <button
                    key={tech}
                    type="button"
                    onClick={() => toggleItem(knownTechnologies, setKnownTechnologies, tech)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition-all ${
                      isSelected
                        ? "bg-secondary text-white border-secondary"
                        : "bg-surface-elevated text-text-muted border-border hover:border-border-bright"
                    }`}
                  >
                    {tech}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-4 flex justify-between">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setStep(1)}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              Back
            </Button>
            <Button type="submit" variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Continue to Career Goals
            </Button>
          </div>
        </form>
      )}

      {/* Step 3: Goals & Review */}
      {step === 3 && (
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="block text-xs font-mono uppercase tracking-wider text-text-muted font-semibold">
              Preferred Target Role Tracks
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {availableTracks.map((track) => {
                const isSelected = preferredTracks.includes(track);
                return (
                  <button
                    key={track}
                    type="button"
                    onClick={() => toggleItem(preferredTracks, setPreferredTracks, track)}
                    className={`p-3 rounded-lg text-left text-xs font-medium border flex items-center justify-between transition-all ${
                      isSelected
                        ? "bg-primary/10 border-primary text-primary-light"
                        : "bg-surface-elevated border-border text-text-muted hover:bg-surface"
                    }`}
                  >
                    <span>{track}</span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-primary" />}
                  </button>
                );
              })}
            </div>
          </div>

          <Textarea
            label="Key Projects or Academic Highlights (Optional)"
            placeholder="Briefly describe 1-2 projects you have built or what you want to build next..."
            value={projectSummary}
            onChange={(e) => setProjectSummary(e.target.value)}
            rows={3}
          />

          <div className="p-4 rounded-xl bg-surface border border-border space-y-2 text-xs">
            <div className="font-semibold text-text flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-primary" /> Profile Baseline Summary
            </div>
            <p className="text-text-muted leading-relaxed">
              <strong>{degree}</strong> at {institution || "University"} • Interests: {primaryInterests.join(", ")} • Target: {preferredTracks.join(", ") || "Software Engineer"}
            </p>
          </div>

          <div className="pt-4 flex justify-between">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setStep(2)}
              disabled={isSubmitting}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              Back
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={handleSubmit}
              isLoading={isSubmitting}
              rightIcon={<CheckCircle2 className="w-4 h-4" />}
            >
              Save & Access Career Dashboard
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};
