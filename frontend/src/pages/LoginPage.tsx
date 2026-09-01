import { GoogleAuthButton } from '../components/auth/GoogleAuthButton';
import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Mail, Compass, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { PasswordInput } from "../components/ui/PasswordInput";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Alert } from "../components/ui/Alert";
import { useAuth } from "../hooks/useAuth";

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await login({ email: email.trim(), password });
      const from = (location.state as any)?.from?.pathname || "/dashboard";
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || "Failed to sign in. Please verify your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setEmail("demo@careerengine.ai");
    setPassword("password123");
    setIsLoading(true);
    setError(null);

    try {
      await login({ email: "demo@careerengine.ai", password: "password123" });
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Demo login failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-text flex flex-col justify-center items-center p-4 relative subtle-radial-glow">
      <div className="absolute inset-0 subtle-grid-bg opacity-30 pointer-events-none" />

      {/* Brand Header */}
      <Link to="/" className="flex items-center gap-2.5 mb-8 z-10">
        <div className="w-10 h-10 rounded-xl bg-surface-elevated border border-border flex items-center justify-center text-primary shadow-subtle-glow">
          <Compass className="w-5 h-5 text-primary" />
        </div>
        <span className="font-display font-bold text-xl text-text">Career Engine</span>
      </Link>

      <Card variant="elevated" padding="lg" className="w-full max-w-md z-10 space-y-6">
        <div className="space-y-1 text-left">
          <div className="flex items-center justify-between">
            <h1 className="text-xl sm:text-2xl font-display font-bold text-text">Sign In</h1>
            <Badge variant="emerald">Live Auth API</Badge>
          </div>
          <p className="text-xs text-text-muted">
            Enter your credentials to access your personalized career strategy.
          </p>
        </div>

        {error && <Alert variant="error">{error}</Alert>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="you@domain.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<Mail className="w-4 h-4" />}
            required
          />

          <div className="space-y-1">
            <PasswordInput
              label="Password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="flex justify-end pt-1">
              <Link
                to="/forgot-password"
                className="text-xs text-primary-light hover:underline font-medium"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            isLoading={isLoading}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Sign In to Career Engine
          </Button>
        </form>

        {/* Google Authentication Button */}
        <div className="space-y-4">
          <div className="relative flex items-center justify-center">
            <div className="border-t border-white/[0.08] w-full" />
            <span className="bg-[#0B1020] px-3 text-[11px] font-mono text-[#8D96AA] uppercase tracking-wider relative z-10">
              OR
            </span>
          </div>

          <GoogleAuthButton
            mode="signin"
            onError={(errMsg) => setError(errMsg)}
          />
        </div>


        <div className="pt-3 border-t border-border flex items-center justify-between">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleDemoLogin}
            disabled={isLoading}
            className="w-full text-xs"
            leftIcon={<Sparkles className="w-3.5 h-3.5 text-primary" />}
          >
            Fill & Sign In with Demo Account
          </Button>
        </div>

        <div className="pt-2 text-center text-xs text-text-muted">
          Don't have an account yet?{" "}
          <Link to="/register" className="text-primary-light hover:underline font-medium">
            Create account
          </Link>
        </div>
      </Card>
    </div>
  );
};
