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
import { ArrowLeft, ArrowRight, CheckCircle2, Sparkles, Briefcase } from "lucide-react";

export const ProfessionalForm: React.FC = () => {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [currentRole, setCurrentRole] = useState("Software Engineer");
  const [currentCompany, setCurrentCompany] = useState("");
  const [experienceYears, setExperienceYears] = useState<string>("3");
  const [targetRole, setTargetRole] = useState("Senior Fullstack Engineer");

  const [currentTechStack, setCurrentTechStack] = useState<string[]>([
    "TypeScript",
    "React",
    "Node.js",
    "PostgreSQL",
    "Docker",
  ]);

  const [motivation, setMotivation] = useState("Promotion & Senior IC Track");
  const [challenges, setChallenges] = useState("");

  const availableTech = [
    "TypeScript",
    "JavaScript",
    "React",
    "Next.js",
    "Node.js",
    "Python",
    "Go",
    "Java",
    "PostgreSQL",
    "Redis",
    "Docker",
    "Kubernetes",
    "AWS",
    "GCP",
    "GraphQL",
    "Microservices",
  ];

  const targetRoles = [
    { value: "Senior Fullstack Engineer", label: "Senior Fullstack Engineer" },
    { value: "Lead Backend Engineer", label: "Lead Backend Engineer" },
    { value: "Principal Software Architect", label: "Principal Software Architect" },
    { value: "AI / ML Systems Engineer", label: "AI / ML Systems Engineer" },
    { value: "Staff Platform & DevOps Engineer", label: "Staff Platform & DevOps Engineer" },
    { value: "Engineering Manager", label: "Engineering Manager" },
  ];

  const toggleTech = (tech: string) => {
    if (currentTechStack.includes(tech)) {
      setCurrentTechStack(currentTechStack.filter((t) => t !== tech));
    } else {
      setCurrentTechStack([...currentTechStack, tech]);
    }
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      if (!currentRole.trim()) {
        setError("Please enter your current professional title.");
        return;
      }
      setError(null);
      setStep(2);
    } else if (step === 2) {
      if (currentTechStack.length === 0) {
        setError("Please select at least one technology in your current stack.");
        return;
      }
      setError(null);
      setStep(3);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    const totalMonths = Math.round(parseFloat(experienceYears || "1") * 12);

    try {
      await assessmentService.submitProfessional({
        currentRole: currentRole.trim(),
        currentCompany: currentCompany.trim() || undefined,
        totalExperienceMonths: totalMonths,
        currentTechStack,
        targetRole,
        motivationForChange: motivation,
        challengesFaced: challenges.trim() || undefined,
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
    { number: 1, title: "Current Role" },
    { number: 2, title: "Stack & Targets" },
    { number: 3, title: "Goals & Review" },
  ];

  return (
    <Card variant="elevated" padding="lg" className="w-full max-w-2xl mx-auto text-left space-y-6">
      <div className="flex items-center justify-between pb-2 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center">
            <Briefcase className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-text">Professional Career Intake</h2>
            <span className="text-xs text-text-muted">Experienced Engineer Assessment</span>
          </div>
        </div>
        <Badge variant="secondary">Step {step} of 3</Badge>
      </div>

      <AssessmentProgress steps={steps} currentStep={step} />

      {error && <Alert variant="error">{error}</Alert>}

      {/* Step 1: Current Role */}
      {step === 1 && (
        <form onSubmit={handleNext} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Current Title / Role"
              placeholder="e.g. Software Engineer II"
              value={currentRole}
              onChange={(e) => setCurrentRole(e.target.value)}
              required
            />
            <Input
              label="Current Company / Organization (Optional)"
              placeholder="e.g. Acme Corp"
              value={currentCompany}
              onChange={(e) => setCurrentCompany(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Total Years of Professional Experience"
              value={experienceYears}
              onChange={(e) => setExperienceYears(e.target.value)}
              options={[
                { value: "1", label: "1 Year" },
                { value: "2", label: "2 Years" },
                { value: "3", label: "3 Years" },
                { value: "5", label: "4 - 5 Years" },
                { value: "7", label: "6 - 8 Years" },
                { value: "10", label: "9+ Years (Staff / Principal)" },
              ]}
            />
            <Select
              label="Primary Motivation"
              value={motivation}
              onChange={(e) => setMotivation(e.target.value)}
              options={[
                { value: "Promotion & Senior IC Track", label: "Promotion / Senior IC Elevation" },
                { value: "Domain Pivot (AI / Cloud)", label: "Domain Pivot (AI / Cloud Architecture)" },
                { value: "Higher Compensation & Tier-1 Tech", label: "Higher Compensation & Tier-1 Tech" },
                { value: "Tech Lead & Management Transition", label: "Tech Lead & Management Transition" },
              ]}
            />
          </div>

          <div className="pt-4 flex justify-end">
            <Button type="submit" variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Continue to Tech Stack & Target Role
            </Button>
          </div>
        </form>
      )}

      {/* Step 2: Tech Stack & Target Goal */}
      {step === 2 && (
        <form onSubmit={handleNext} className="space-y-6">
          <Select
            label="Target Next Role"
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            options={targetRoles}
          />

          <div className="space-y-2 pt-2 border-t border-border/80">
            <label className="block text-xs font-mono uppercase tracking-wider text-text-muted font-semibold">
              Current Core Tech Stack (Select all that apply)
            </label>
            <div className="flex flex-wrap gap-2">
              {availableTech.map((tech) => {
                const isSelected = currentTechStack.includes(tech);
                return (
                  <button
                    key={tech}
                    type="button"
                    onClick={() => toggleTech(tech)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition-all ${
                      isSelected
                        ? "bg-secondary text-white border-secondary shadow-subtle-glow"
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
              Continue to Review
            </Button>
          </div>
        </form>
      )}

      {/* Step 3: Goals & Review */}
      {step === 3 && (
        <div className="space-y-6">
          <Textarea
            label="Current Growth Bottlenecks or Challenges (Optional)"
            placeholder="e.g. Need more high-scale system design experience, want to master distributed microservices and cloud deployment..."
            value={challenges}
            onChange={(e) => setChallenges(e.target.value)}
            rows={3}
          />

          <div className="p-4 rounded-xl bg-surface border border-border space-y-2 text-xs">
            <div className="font-semibold text-text flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-secondary" /> Professional Trajectory Baseline
            </div>
            <p className="text-text-muted leading-relaxed">
              <strong>{currentRole}</strong> ({experienceYears} YOE) ➔ Target: <strong>{targetRole}</strong> • Core Stack: {currentTechStack.join(", ")}
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
