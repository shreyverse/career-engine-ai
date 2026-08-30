import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, User, Compass, ArrowRight } from "lucide-react";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { PasswordInput } from "../components/ui/PasswordInput";
import { Select } from "../components/ui/Select";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Alert } from "../components/ui/Alert";
import { useAuth } from "../hooks/useAuth";

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [stage, setStage] = useState("FRESHER");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await register({
        fullName: fullName.trim(),
        email: email.trim(),
        password,
        careerStage: stage,
      });

      // Redirect newly registered user to Onboarding intake flow
      navigate("/onboarding");
    } catch (err: any) {
      setError(err.message || "Failed to create account. Please check your details.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-text flex flex-col justify-center items-center p-4 relative subtle-radial-glow">
      <div className="absolute inset-0 subtle-grid-bg opacity-30 pointer-events-none" />

      <Link to="/" className="flex items-center gap-2.5 mb-8 z-10">
        <div className="w-10 h-10 rounded-xl bg-surface-elevated border border-border flex items-center justify-center text-primary shadow-subtle-glow">
          <Compass className="w-5 h-5 text-primary" />
        </div>
        <span className="font-display font-bold text-xl text-text">Career Engine</span>
      </Link>

      <Card variant="elevated" padding="lg" className="w-full max-w-md z-10 space-y-6">
        <div className="space-y-1 text-left">
          <div className="flex items-center justify-between">
            <h1 className="text-xl sm:text-2xl font-display font-bold text-text">Create Account</h1>
            <Badge variant="emerald">Live Auth API</Badge>
          </div>
          <p className="text-xs text-text-muted">
            Establish your profile to begin personalized AI career strategy mapping.
          </p>
        </div>

        {error && <Alert variant="error">{error}</Alert>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            placeholder="Jane Doe"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            leftIcon={<User className="w-4 h-4" />}
            required
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="jane@domain.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<Mail className="w-4 h-4" />}
            required
          />

          <PasswordInput
            label="Password (min 6 chars)"
            placeholder="••••••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Select
            label="Career Stage"
            value={stage}
            onChange={(e) => setStage(e.target.value)}
            options={[
              { value: "FRESHER", label: "Fresher / Student (0 YOE)" },
              { value: "PROFESSIONAL", label: "Working Professional (1+ YOE)" },
              { value: "CAREER_CHANGER", label: "Career Changer / Domain Pivot" },
            ]}
          />

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            isLoading={isLoading}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Create Career Engine Account
          </Button>
        </form>

        <div className="pt-4 border-t border-border/80 text-center text-xs text-text-muted">
          Already have an account?{" "}
          <Link to="/login" className="text-primary-light hover:underline font-medium">
            Sign in
          </Link>
        </div>
      </Card>
    </div>
  );
};
