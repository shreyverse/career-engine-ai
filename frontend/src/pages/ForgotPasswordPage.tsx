import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Compass, ArrowLeft, Lock, CheckCircle2, KeyRound, ShieldAlert } from "lucide-react";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Alert } from "../components/ui/Alert";
import { authService } from "../services/authService";

export const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState<"REQUEST" | "VERIFY_RESET" | "SUCCESS">("REQUEST");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setIsLoading(true);
    setError(null);

    try {
      const res = await authService.forgotPassword(email.trim());
      setSuccessMsg(res.message || `A 6-digit confirmation code has been dispatched to ${email.trim()}.`);
      setStep("VERIFY_RESET");
    } catch (err: any) {
      setError(err.message || "Failed to find account with this email.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetToken.trim()) {
      setError("Please enter the 6-digit code sent to your email.");
      return;
    }
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await authService.resetPassword(resetToken.trim(), newPassword);
      setSuccessMsg(res.message || "Identity confirmed and password updated!");
      setStep("SUCCESS");
    } catch (err: any) {
      setError(err.message || "Invalid or expired verification code. Please check your email and try again.");
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
            <h1 className="text-xl sm:text-2xl font-display font-bold text-text">
              {step === "SUCCESS" ? "Password Reset Complete" : "Reset Password"}
            </h1>
            <Badge variant="emerald">Secure Out-of-Band Auth</Badge>
          </div>
          <p className="text-xs text-text-muted">
            {step === "REQUEST" && "Enter your account email. We will dispatch a 6-digit verification code."}
            {step === "VERIFY_RESET" && `Enter the 6-digit confirmation code sent to ${email} to set a new password.`}
            {step === "SUCCESS" && "Your identity was confirmed and password successfully updated."}
          </p>
        </div>

        {error && (
          <Alert variant="error" className="text-xs">
            {error}
          </Alert>
        )}

        {successMsg && step !== "SUCCESS" && (
          <Alert variant="info" className="text-xs">
            {successMsg}
          </Alert>
        )}

        {step === "REQUEST" && (
          <form onSubmit={handleRequestSubmit} className="space-y-4">
            <Input
              label="Account Email Address"
              type="email"
              placeholder="you@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4" />}
              required
            />

            <Button type="submit" variant="primary" className="w-full" isLoading={isLoading}>
              Send Confirmation Code
            </Button>
          </form>
        )}

        {step === "VERIFY_RESET" && (
          <form onSubmit={handleResetSubmit} className="space-y-4">
            <Input
              label="Enter 6-Digit Email Verification Code"
              type="text"
              placeholder="e.g. 849201"
              value={resetToken}
              onChange={(e) => setResetToken(e.target.value)}
              leftIcon={<KeyRound className="w-4 h-4" />}
              required
            />

            <Input
              label="New Password"
              type="password"
              placeholder="At least 6 characters"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4" />}
              required
            />

            <Input
              label="Confirm New Password"
              type="password"
              placeholder="Re-enter password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4" />}
              required
            />

            <Button type="submit" variant="primary" className="w-full" isLoading={isLoading}>
              Verify Code & Update Password
            </Button>

            <button
              type="button"
              onClick={() => { setStep("REQUEST"); setError(null); }}
              className="text-xs text-text-dim hover:text-primary transition-colors block text-center w-full mt-2"
            >
              Didn't receive a code? Try another email
            </button>
          </form>
        )}

        {step === "SUCCESS" && (
          <div className="space-y-4 text-center">
            <div className="p-4 rounded-xl bg-accent-emerald/10 border border-accent-emerald/30 text-accent-emerald space-y-2">
              <CheckCircle2 className="w-8 h-8 mx-auto" />
              <p className="text-xs font-semibold">{successMsg}</p>
            </div>

            <Button
              variant="primary"
              className="w-full"
              onClick={() => navigate("/login")}
            >
              Sign In with New Password
            </Button>
          </div>
        )}

        <div className="pt-4 border-t border-border/80 text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-xs text-primary-light hover:underline font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
          </Link>
        </div>
      </Card>
    </div>
  );
};
