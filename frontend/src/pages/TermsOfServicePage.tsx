import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, FileText, CheckCircle2, ShieldAlert, ArrowLeft, Mail, Scale, Sparkles } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

export const TermsOfServicePage: React.FC = () => {
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

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8">
        {/* Back Link */}
        <Link to="/" className="inline-flex items-center gap-2 text-xs font-mono text-text-muted hover:text-white transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
        </Link>

        {/* Hero Title */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant="primary" className="px-2.5 py-0.5 text-xs">Public Legal Agreement</Badge>
            <span className="text-xs text-text-muted font-mono">Effective Date: September 1, 2026</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight">
            Terms of Service
          </h1>
          <p className="text-text-muted text-base leading-relaxed max-w-2xl">
            Please read these Terms of Service carefully before accessing or using Career Engine AI. By creating an account or using our platform, you agree to be bound by these terms.
          </p>
        </div>

        {/* Summary Card */}
        <Card variant="elevated" padding="lg" className="border-white/[0.08] bg-[#0E1528]/80">
          <div className="flex items-start gap-4">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shrink-0">
              <Scale className="w-6 h-6" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-base font-semibold text-white">Summary of Terms</h3>
              <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                Career Engine AI provides AI-powered career roadmap generation, ATS resume optimization, and skill guidance. You agree to use the service ethically, safeguard your credentials, and understand that career guidance is assistive in nature.
              </p>
            </div>
          </div>
        </Card>

        {/* Terms Sections */}
        <div className="space-y-8 text-sm leading-relaxed text-[#BAC2D6]">
          {/* Section 1 */}
          <section className="space-y-3 bg-[#0A0F1E] border border-white/[0.06] p-6 rounded-2xl">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-primary/10 text-primary text-xs flex items-center justify-center font-mono">1</span>
              Acceptance of Terms
            </h2>
            <p>
              By accessing, browsing, or utilizing any feature of Career Engine AI (the "Platform"), you agree to comply with and be bound by these Terms of Service and our Privacy Policy. If you disagree with any part of these terms, you may not use the Platform.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3 bg-[#0A0F1E] border border-white/[0.06] p-6 rounded-2xl">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-primary/10 text-primary text-xs flex items-center justify-center font-mono">2</span>
              User Accounts & Security
            </h2>
            <p>
              When creating an account either via direct email registration or Google OAuth:
            </p>
            <ul className="space-y-2 list-disc list-inside text-text-muted pl-1">
              <li>You must provide accurate, current, and complete registration information.</li>
              <li>You are responsible for maintaining the confidentiality of your credentials and account session tokens.</li>
              <li>You agree to notify us immediately of any unauthorized use or security breach involving your account.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3 bg-[#0A0F1E] border border-white/[0.06] p-6 rounded-2xl">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-primary/10 text-primary text-xs flex items-center justify-center font-mono">3</span>
              Acceptable Use Policy
            </h2>
            <p>
              You agree not to engage in any prohibited activities on Career Engine AI, including:
            </p>
            <ul className="space-y-2 list-disc list-inside text-text-muted pl-1">
              <li>Uploading malicious files, viruses, or unauthorized scripts.</li>
              <li>Attempting to probe, scan, or reverse engineer any vulnerability of our systems or APIs.</li>
              <li>Using automated scraping, bots, or unauthorized automated tools on the Platform.</li>
              <li>Providing fraudulent or fabricated professional certifications or employment records.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-3 bg-[#0A0F1E] border border-white/[0.06] p-6 rounded-2xl">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-primary/10 text-primary text-xs flex items-center justify-center font-mono">4</span>
              AI Career Guidance & Recommendations Disclaimer
            </h2>
            <p>
              Career Engine AI uses advanced artificial intelligence to generate skill roadmaps, ATS compatibility assessments, and strategic career recommendations:
            </p>
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs sm:text-sm space-y-1">
              <div className="font-semibold flex items-center gap-1.5 text-amber-300">
                <Sparkles className="w-4 h-4" /> AI Advisory Notice
              </div>
              <p>
                All roadmaps, ATS scores, and career advice are generated as assistive guidance. Career Engine AI does not guarantee job placement, interview calls, or specific employment outcomes with any specific company.
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section className="space-y-3 bg-[#0A0F1E] border border-white/[0.06] p-6 rounded-2xl">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-primary/10 text-primary text-xs flex items-center justify-center font-mono">5</span>
              Intellectual Property
            </h2>
            <p>
              You retain all ownership rights to your resumes, profile answers, and uploaded content. Career Engine AI and its creators retain all rights, title, and interest in the platform software, algorithms, designs, and user interface.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-3 bg-[#0A0F1E] border border-white/[0.06] p-6 rounded-2xl">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-primary/10 text-primary text-xs flex items-center justify-center font-mono">6</span>
              Limitation of Liability
            </h2>
            <p>
              To the maximum extent permitted by applicable law, Career Engine AI shall not be liable for any indirect, incidental, special, or consequential damages resulting from your use of or inability to use the platform.
            </p>
          </section>

          {/* Section 7 */}
          <section className="space-y-3 bg-[#0A0F1E] border border-white/[0.06] p-6 rounded-2xl">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-primary/10 text-primary text-xs flex items-center justify-center font-mono">7</span>
              Contact Information
            </h2>
            <p>
              For any questions regarding these Terms of Service, please reach out to:
            </p>
            <div className="p-4 rounded-xl bg-surface-base border border-white/[0.08] flex items-center gap-3">
              <Mail className="w-5 h-5 text-primary shrink-0" />
              <div>
                <div className="text-xs text-text-muted">Official Support Contact Email</div>
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
          <Link to="/terms" className="text-primary font-medium">Terms of Service</Link>
          <span>•</span>
          <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
        </div>
      </footer>
    </div>
  );
};
