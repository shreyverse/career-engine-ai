import React, { useState, useEffect, useRef } from "react";
import { AppLayout } from "../components/layout/AppLayout";
import {
  FileText,
  Upload,
  Plus,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Trash2,
  AlertCircle,
  Clock
} from "lucide-react";
import { resumeApi } from "../services/resumeApi";
import { StoredResumeRecord } from "../types/resume.types";
import { useAuth } from "../hooks/useAuth";
import { Spinner } from "../components/ui/Spinner";

export const ResumePage: React.FC = () => {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [resumes, setResumes] = useState<StoredResumeRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isAtsModalOpen, setIsAtsModalOpen] = useState(false);

  useEffect(() => {
    loadResumes();
  }, []);

  const loadResumes = async () => {
    try {
      setIsLoading(true);
      const data = await resumeApi.listResumes();
      setResumes(data || []);
    } catch (err: any) {
      console.error("Failed to load resumes:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setError(null);
      setUploadSuccess(null);

      const targetRole = "Software Engineer";
      const result = await resumeApi.uploadResumeFile(file, targetRole);

      setUploadSuccess(
        `Resume "${file.name}" uploaded successfully! Extracted ${result.parsedData?.skills?.length || 0} skills.`
      );
      await loadResumes();
    } catch (err: any) {
      setError(err.message || "Failed to upload and parse resume.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleCreateNewResume = async () => {
    try {
      setIsLoading(true);
      const newResume = await resumeApi.createResume({
        name: `${user?.fullName || "My"} Resume (v${resumes.length + 1})`,
        targetRole: "Software Engineer",
        status: "DRAFT",
        data: {
          personal: {
            name: user?.fullName || "",
            email: user?.email || "",
          },
          summary: "",
          experience: [],
          education: [],
          skills: [],
          projects: [],
          certifications: [],
          achievements: [],
        },
      });
      setResumes([newResume, ...resumes]);
      setUploadSuccess("Created new draft resume!");
    } catch (err: any) {
      setError(err.message || "Failed to create resume draft.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteResume = async (resumeId: string) => {
    if (!window.confirm("Are you sure you want to delete this resume version?")) return;
    try {
      await resumeApi.deleteResume(resumeId);
      setResumes(resumes.filter((r) => r.id !== resumeId));
    } catch (err: any) {
      setError(err.message || "Failed to delete resume.");
    }
  };

  return (
    <AppLayout maxWidth="wide">
      
      {/* Hidden File Input for live PDF/DOCX Upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept=".pdf,.docx,.doc"
        className="hidden"
      />

      <div className="w-full space-y-8 text-left">
        
        {/* Full-Width Page Header with Actions */}
        <div className="w-full flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/[0.08]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Resume Intelligence & Builder
              </h1>
              <p className="text-sm sm:text-base text-[#8D96AA] mt-1">
                Manage your ATS-ready resume versions, extract data from existing files, or build from scratch.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => setIsAtsModalOpen(true)}
              className="h-11 px-5 rounded-xl bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 text-blue-400 font-semibold text-sm flex items-center gap-2 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>ATS Analyzer</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="h-11 px-5 rounded-xl bg-white/[0.04] border border-white/[0.1] hover:bg-white/[0.08] hover:border-white/[0.2] text-white font-semibold text-sm flex items-center gap-2 transition-all disabled:opacity-50"
            >
              {isUploading ? <Spinner size="sm" /> : <Upload className="w-4 h-4 text-emerald-400" />}
              <span>Upload Resume</span>
            </button>

            <button
              onClick={handleCreateNewResume}
              className="h-11 px-6 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] flex items-center gap-2 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Build From Scratch</span>
            </button>
          </div>
        </div>

        {/* Notifications & Status Alerts */}
        {error && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {uploadSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
            <span>{uploadSuccess}</span>
          </div>
        )}

        {/* Loading Spinner */}
        {isLoading && (
          <div className="py-20 flex flex-col items-center justify-center space-y-4">
            <Spinner size="lg" />
            <p className="text-sm text-[#8D96AA] font-mono">Loading resume intelligence records...</p>
          </div>
        )}

        {/* Main Content: Full-Width Resumes Grid or Full-Width Empty State Workspace */}
        {!isLoading && resumes.length === 0 ? (
          
          /* Full-Width Workspace Card (Empty State) */
          <div className="w-full rounded-3xl bg-[#0B1020] border border-white/[0.08] p-8 sm:p-14 shadow-2xl space-y-12 text-center relative overflow-hidden min-h-[580px] flex flex-col justify-between">
            
            {/* Ambient Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-emerald-500/10 blur-[120px] pointer-events-none rounded-full" />

            {/* Centered Introductory Hero */}
            <div className="relative z-10 space-y-4 max-w-4xl mx-auto pt-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto shadow-[0_0_25px_rgba(16,185,129,0.25)]">
                <FileText className="w-8 h-8" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Create Your First Resume
              </h2>
              <p className="text-base sm:text-lg text-[#8D96AA] leading-relaxed">
                Get started by uploading an existing PDF or Word document for instant AI extraction, or create a clean, ATS-compliant resume from scratch.
              </p>
            </div>

            {/* Two Full-Width Option Cards (Spanning 100% of workspace, ~700px each) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full text-left relative z-10 pt-4">
              
              {/* Option 1: Upload Existing Resume */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-full p-8 sm:p-10 rounded-3xl bg-white/[0.025] border border-white/[0.08] hover:border-emerald-500/50 hover:bg-white/[0.045] transition-all cursor-pointer group relative flex flex-col justify-between min-h-[290px] shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="p-4 bg-emerald-500/10 text-emerald-400 rounded-2xl border border-emerald-500/20 group-hover:scale-105 group-hover:bg-emerald-500/20 transition-all">
                      <Upload className="w-8 h-8" />
                    </div>
                    <div className="w-11 h-11 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-[#8D96AA] group-hover:text-emerald-400 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/30 group-hover:translate-x-1.5 transition-all">
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-2.5 group-hover:text-emerald-300 transition-colors">
                    Upload Existing Resume
                  </h3>
                  <p className="text-sm sm:text-base text-[#8D96AA] leading-relaxed">
                    Upload PDF or DOCX. Gemini AI will extract your experience, skills, and projects for your review.
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-6 border-t border-white/[0.06] mt-6">
                  <span className="text-xs sm:text-sm text-[#8D96AA] font-medium">Supported formats:</span>
                  <span className="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold font-mono">
                    PDF
                  </span>
                  <span className="px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold font-mono">
                    DOCX
                  </span>
                </div>
              </div>

              {/* Option 2: Build From Scratch */}
              <div
                onClick={handleCreateNewResume}
                className="w-full p-8 sm:p-10 rounded-3xl bg-white/[0.025] border border-white/[0.08] hover:border-blue-500/50 hover:bg-white/[0.045] transition-all cursor-pointer group relative flex flex-col justify-between min-h-[290px] shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="p-4 bg-blue-500/10 text-blue-400 rounded-2xl border border-blue-500/20 group-hover:scale-105 group-hover:bg-blue-500/20 transition-all">
                      <Plus className="w-8 h-8" />
                    </div>
                    <div className="w-11 h-11 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-[#8D96AA] group-hover:text-blue-400 group-hover:bg-blue-500/10 group-hover:border-blue-500/30 group-hover:translate-x-1.5 transition-all">
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-2.5 group-hover:text-blue-300 transition-colors">
                    Build From Scratch
                  </h3>
                  <p className="text-sm sm:text-base text-[#8D96AA] leading-relaxed">
                    Use our step-by-step editor, import Career Engine assessed skills, and write bullet points with AI assistance.
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-6 border-t border-white/[0.06] mt-6">
                  <span className="text-xs sm:text-sm text-[#8D96AA] font-medium">What you get:</span>
                  <span className="px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>AI Suggestions</span>
                  </span>
                  <span className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>ATS-Optimized</span>
                  </span>
                </div>
              </div>

            </div>

          </div>
        ) : (
          
          /* Resumes Grid When Records Exist (Full Width) */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {resumes.map((r) => (
              <div
                key={r.id}
                className="p-6 rounded-3xl bg-[#0B1020] border border-white/[0.08] hover:border-white/[0.18] transition-all flex flex-col justify-between space-y-6 shadow-xl group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
                      <FileText className="w-6 h-6" />
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      {r.status}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-1 group-hover:text-blue-300 transition-colors">
                    {r.name}
                  </h3>
                  <p className="text-xs text-[#8D96AA] mb-4">Target: {r.targetRole || "Software Engineer"}</p>

                  <div className="space-y-2 pt-2 border-t border-white/[0.06]">
                    <div className="flex items-center justify-between text-xs text-[#8D96AA]">
                      <span>Experience Entries</span>
                      <span className="font-semibold text-white">{r.data?.experience?.length || 0}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-[#8D96AA]">
                      <span>Indexed Skills</span>
                      <span className="font-semibold text-white">{r.data?.skills?.length || 0}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-[#8D96AA]">
                      <span>Portfolio Projects</span>
                      <span className="font-semibold text-white">{r.data?.projects?.length || 0}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
                  <div className="flex items-center gap-1.5 text-xs text-[#8D96AA]">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{new Date(r.updatedAt).toLocaleDateString()}</span>
                  </div>
                  <button
                    onClick={() => handleDeleteResume(r.id)}
                    className="p-2 rounded-xl text-[#8D96AA] hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    title="Delete Resume"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* ATS Analyzer Modal */}
      {isAtsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-xl p-8 rounded-3xl bg-[#0B1020] border border-white/[0.1] shadow-2xl space-y-6 text-left">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-white">ATS Scoring & Diagnostics</h3>
              </div>
              <button
                onClick={() => setIsAtsModalOpen(false)}
                className="text-[#8D96AA] hover:text-white text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <p className="text-sm text-[#8D96AA] leading-relaxed">
              Career Engine evaluates your resume across semantic keyword density, technical competency match, and single-column formatting benchmarks.
            </p>

            <div className="space-y-3">
              {[
                { title: "Target Role Keyword Match", desc: "Evaluates keywords against live tech hiring benchmarks", score: "94%" },
                { title: "Impact & Metric Verbs", desc: "Checks for quantified outcomes (e.g., % improvement, latency reduction)", score: "88%" },
                { title: "Single-Column ATS Compliance", desc: "Ensures parser readable fonts, headings, and clean margins", score: "100%" },
              ].map((item) => (
                <div key={item.title} className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white">{item.title}</h4>
                    <p className="text-xs text-[#8D96AA] mt-0.5">{item.desc}</p>
                  </div>
                  <span className="text-sm font-mono font-bold text-emerald-400">{item.score}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={() => setIsAtsModalOpen(false)}
                className="h-11 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-500/25"
              >
                Close Diagnostics
              </button>
            </div>
          </div>
        </div>
      )}

    </AppLayout>
  );
};
