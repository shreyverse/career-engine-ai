import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ShieldCheck, Lock, Mail, ArrowLeft, CheckCircle, EyeOff, Server, Database, Globe } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#070B14] text-text selection:bg-primary selection:text-white">
      {/* Top Navigation */}
      <header className="border-b border-white/[0.08] bg-[#0A0F1D]/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-surface-elevated border border-border flex items-center justify-center text-primary shadow-subtle-glow">
              <Compass className="w-5 h-5 text-primary" />
            </div>
            <span className="font-display font-bold text-lg text-white">Career Engine AI</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link to="/register">
              <Button variant="primary" size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8">
        {/* Back Link */}
        <Link to="/" className="inline-flex items-center gap-2 text-xs font-mono text-text-muted hover:text-white transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
        </Link>

        {/* Hero Title */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant="emerald" className="px-2.5 py-0.5 text-xs">Public Legal Document</Badge>
            <span className="text-xs text-text-muted font-mono">Last Updated: September 1, 2026</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-text-muted text-base leading-relaxed max-w-2xl">
            At Career Engine AI, we respect your privacy and are committed to protecting your personal information. This Privacy Policy explains our data collection, usage, storage, and security practices.
          </p>
        </div>

        {/* Highlight Card: Google User Data Commitment */}
        <Card variant="elevated" padding="lg" className="border-primary/30 bg-gradient-to-br from-[#0E1528] to-[#0A1020] relative overflow-hidden">
          <div className="flex items-start gap-4">
            <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 text-primary shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h3 className="text-base font-semibold text-white">Our Google User Data & Privacy Commitment</h3>
              <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                Career Engine AI uses Google Sign-In solely for authenticating users and creating secure profiles. <strong>We do not sell, rent, trade, or monetize your Google user data.</strong> We adhere strictly to the <span className="text-primary font-medium">Google API Services User Data Policy</span>, including the Limited Use requirements.
              </p>
            </div>
          </div>
        </Card>

        {/* Policy Sections */}
        <div className="space-y-8 text-sm leading-relaxed text-[#BAC2D6]">
          {/* Section 1 */}
          <section className="space-y-3 bg-[#0A0F1E] border border-white/[0.06] p-6 rounded-2xl">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-primary/10 text-primary text-xs flex items-center justify-center font-mono">1</span>
              Information We Collect
            </h2>
            <p>
              When you use Career Engine AI, we collect information necessary to provide you with personalized career acceleration, ATS resume optimization, skill roadmap planning, and intelligent career coaching:
            </p>
            <ul className="space-y-2 list-disc list-inside text-text-muted pl-1">
              <li><strong className="text-white">Account Information:</strong> Full name, email address, password hash (for email registrations), and profile avatar.</li>
              <li><strong className="text-white">Google OAuth Information:</strong> Verified email address, name, profile picture, and Google account identifier when using "Continue with Google".</li>
              <li><strong className="text-white">Career Profile Data:</strong> Career stage (Fresher or Professional), target job roles, preferred industries, technical skills, and assessment responses.</li>
              <li><strong className="text-white">Resume Information:</strong> Text content from uploaded resumes (PDF/DOCX) or built within our resume builder for ATS compatibility analysis and improvement.</li>
              <li><strong className="text-white">AI Coach Conversation Logs:</strong> Queries submitted to the AI Career Coach to generate relevant interview, career, and salary guidance.</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="space-y-3 bg-[#0A0F1E] border border-white/[0.06] p-6 rounded-2xl">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-primary/10 text-primary text-xs flex items-center justify-center font-mono">2</span>
              How We Use Google User Data
            </h2>
            <p>
              When you choose to authenticate using Google OAuth 2.0 / Google Identity Services:
            </p>
            <ul className="space-y-2 list-disc list-inside text-text-muted pl-1">
              <li>We request basic profile permissions (<code className="text-primary font-mono text-xs">openid</code>, <code className="text-primary font-mono text-xs">email</code>, <code className="text-primary font-mono text-xs">profile</code>).</li>
              <li>We use your verified Google email to authenticate your identity or link your existing Career Engine profile.</li>
              <li>We use your Google display name and profile picture to personalize your workspace interface.</li>
              <li><strong className="text-white">No Advertising Use:</strong> Your Google user data is NEVER used for serving advertisements, market surveillance, or training generalized foundation models.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3 bg-[#0A0F1E] border border-white/[0.06] p-6 rounded-2xl">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-primary/10 text-primary text-xs flex items-center justify-center font-mono">3</span>
              How We Store and Protect Your Data
            </h2>
            <p>
              Security is foundational to Career Engine AI:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3.5 rounded-xl bg-surface-base border border-white/[0.05] space-y-1">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs">
                  <Lock className="w-4 h-4" /> TLS 1.3 Encryption
                </div>
                <p className="text-xs text-text-muted">All client-server communications are encrypted in transit via modern HTTPS/TLS protocols.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-surface-base border border-white/[0.05] space-y-1">
                <div className="flex items-center gap-2 text-blue-400 font-semibold text-xs">
                  <Server className="w-4 h-4" /> Secure JWT Session Tokens
                </div>
                <p className="text-xs text-text-muted">Authenticated sessions utilize signed, cryptographically verified JSON Web Tokens with strict expiry.</p>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section className="space-y-3 bg-[#0A0F1E] border border-white/[0.06] p-6 rounded-2xl">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-primary/10 text-primary text-xs flex items-center justify-center font-mono">4</span>
              Data Sharing & Third-Party Processors
            </h2>
            <p>
              We do not sell your personal data. We only share necessary data with trusted infrastructure providers required to operate Career Engine AI:
            </p>
            <ul className="space-y-2 list-disc list-inside text-text-muted pl-1">
              <li><strong className="text-white">Cloud Hosting:</strong> Render (secure server and database infrastructure).</li>
              <li><strong className="text-white">AI Language Models:</strong> Google Gemini API (used strictly to analyze resumes and answer career coaching queries in real-time).</li>
              <li><strong className="text-white">Email Delivery:</strong> Nodemailer / Google SMTP (used strictly for dispatching password reset OTP codes from <code className="text-primary font-mono text-xs">careerengine460@gmail.com</code>).</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="space-y-3 bg-[#0A0F1E] border border-white/[0.06] p-6 rounded-2xl">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-primary/10 text-primary text-xs flex items-center justify-center font-mono">5</span>
              Your Rights and Account Deletion
            </h2>
            <p>
              You maintain full ownership of your data. You have the right to:
            </p>
            <ul className="space-y-2 list-disc list-inside text-text-muted pl-1">
              <li>Access and review all career profile and resume data stored in your account.</li>
              <li>Update or correct your personal details at any time from your Account Settings.</li>
              <li>Request complete permanent deletion of your account, resumes, and assessment records by emailing our team.</li>
            </ul>
          </section>

          {/* Section 6 */}
          <section className="space-y-3 bg-[#0A0F1E] border border-white/[0.06] p-6 rounded-2xl">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-primary/10 text-primary text-xs flex items-center justify-center font-mono">6</span>
              Contact Us
            </h2>
            <p>
              If you have any questions, concerns, or requests regarding this Privacy Policy or your personal information, please contact us:
            </p>
            <div className="p-4 rounded-xl bg-surface-base border border-white/[0.08] flex items-center gap-3">
              <Mail className="w-5 h-5 text-primary shrink-0" />
              <div>
                <div className="text-xs text-text-muted">Official Privacy Contact Email</div>
                <a href="mailto:careerengine460@gmail.com" className="text-sm font-semibold text-primary hover:underline">
                  careerengine460@gmail.com
                </a>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.08] py-8 text-center text-xs text-text-muted space-y-2">
        <div>© {new Date().getFullYear()} Career Engine AI. All rights reserved.</div>
        <div className="flex justify-center gap-4">
          <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          <span>•</span>
          <Link to="/privacy" className="text-primary font-medium">Privacy Policy</Link>
        </div>
      </footer>
    </div>
  );
};
