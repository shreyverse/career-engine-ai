import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { resumeApi } from '../services/resumeApi';
import { StoredResumeRecord } from '../types/resume.types';
import { FileText, Upload, Plus, ArrowRight, Trash2, Edit, Eye, Clock, AlertCircle, FileCheck, Sparkles } from 'lucide-react';
import { ResumePreview } from '../components/resume/ResumePreview';

export const ResumeWorkspacePage: React.FC = () => {
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<StoredResumeRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [previewResume, setPreviewResume] = useState<StoredResumeRecord | null>(null);

  useEffect(() => { loadResumes(); }, []);

  const loadResumes = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await resumeApi.listResumes();
      setResumes(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load resumes.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, resumeId: string) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this resume?')) return;
    try {
      await resumeApi.deleteResume(resumeId);
      setResumes((curr) => curr.filter((r) => r.id !== resumeId));
      if (previewResume?.id === resumeId) setPreviewResume(null);
    } catch (err: any) {
      alert(err.message || 'Failed to delete resume.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center space-x-3 mb-1">
              <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400">
                <FileText className="w-6 h-6" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Resume Intelligence & Builder</h1>
            </div>
            <p className="text-sm text-slate-400">Manage your ATS-ready resume versions, extract data from existing files, or build from scratch.</p>
          </div>
          <div className="flex items-center space-x-3 flex-wrap gap-2">
            <button onClick={() => navigate('/resume/ats')} className="flex items-center space-x-2 px-4 py-2.5 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-300 text-sm font-medium rounded-xl transition-colors shadow-sm">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span>ATS Analyzer</span>
            </button>
            <button onClick={() => navigate('/resume/upload')} className="flex items-center space-x-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-sm font-medium rounded-xl transition-colors shadow-sm">
              <Upload className="w-4 h-4 text-emerald-400" />
              <span>Upload Resume</span>
            </button>
            <button onClick={() => navigate('/resume/builder')} className="flex items-center space-x-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-sm font-semibold rounded-xl transition-colors shadow-md">
              <Plus className="w-4 h-4" />
              <span>Build From Scratch</span>
            </button>
          </div>
        </div>
        {error && (
          <div className="flex items-center space-x-3 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-sm text-rose-300">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <div className="w-10 h-10 border-3 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
            <p className="text-sm font-medium text-slate-400">Loading your resumes...</p>
          </div>
        ) : resumes.length === 0 ? (
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-8 sm:p-12 text-center max-w-3xl mx-auto space-y-8 shadow-xl">
            <div className="w-16 h-16 mx-auto bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-center text-emerald-400">
              <FileCheck className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-bold text-white">Create Your First Resume</h2>
              <p className="text-sm text-slate-400 max-w-lg mx-auto">Get started by uploading an existing PDF or Word document for instant AI extraction, or create a clean, ATS-compliant resume from scratch.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
              <div onClick={() => navigate('/resume/upload')} className="group p-6 bg-slate-950 border border-slate-800 hover:border-emerald-500/50 rounded-2xl cursor-pointer transition-all hover:shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl"><Upload className="w-5 h-5" /></div>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                </div>
                <h3 className="text-base font-semibold text-white mb-1">Upload Existing Resume</h3>
                <p className="text-xs text-slate-400 leading-relaxed">Upload PDF or DOCX. Gemini AI will extract your experience, skills, and projects for your review.</p>
              </div>
              <div onClick={() => navigate('/resume/builder')} className="group p-6 bg-slate-950 border border-slate-800 hover:border-blue-500/50 rounded-2xl cursor-pointer transition-all hover:shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-xl"><Plus className="w-5 h-5" /></div>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                </div>
                <h3 className="text-base font-semibold text-white mb-1">Build From Scratch</h3>
                <p className="text-xs text-slate-400 leading-relaxed">Use our step-by-step editor, import Career Engine assessed skills, and write bullet points with AI assistance.</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resumes.map((resume) => (
                <div key={resume.id} onClick={() => navigate('/resume/builder/' + encodeURIComponent(resume.id))} className="group bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 transition-all hover:shadow-xl cursor-pointer flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-white text-base group-hover:text-emerald-400 transition-colors line-clamp-1">{resume.name}</h3>
                        <p className="text-xs font-medium text-slate-400">{resume.targetRole}</p>
                      </div>
                      <span className={'px-2.5 py-0.5 rounded-full text-[11px] font-semibold border shrink-0 ' + (resume.status === 'READY' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border-amber-500/30')}>{resume.status}</span>
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs"><span className="text-slate-400">Completeness</span><span className="font-semibold text-slate-200">{resume.completeness}%</span></div>
                      <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden border border-slate-800">
                        <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: resume.completeness + '%' }} />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80 text-center text-xs">
                      <div className="p-2 bg-slate-950/60 rounded-lg"><div className="font-semibold text-white">{resume.data?.experience?.length || 0}</div><div className="text-[10px] text-slate-500">Exp</div></div>
                      <div className="p-2 bg-slate-950/60 rounded-lg"><div className="font-semibold text-white">{resume.data?.skills?.length || 0}</div><div className="text-[10px] text-slate-500">Skills</div></div>
                      <div className="p-2 bg-slate-950/60 rounded-lg"><div className="font-semibold text-white">{resume.data?.projects?.length || 0}</div><div className="text-[10px] text-slate-500">Projects</div></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-800/80 text-xs">
                    <span className="text-slate-500 flex items-center gap-1 text-[11px]"><Clock className="w-3 h-3" />{new Date(resume.updatedAt).toLocaleDateString()}</span>
                    <div className="flex items-center space-x-1">
                      <button type="button" onClick={(e) => { e.stopPropagation(); setPreviewResume(resume); }} className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors" title="Quick Preview"><Eye className="w-4 h-4" /></button>
                      <button type="button" onClick={(e) => { e.stopPropagation(); navigate('/resume/builder/' + encodeURIComponent(resume.id)); }} className="p-1.5 text-slate-400 hover:text-emerald-400 rounded-lg hover:bg-slate-800 transition-colors" title="Edit in Builder"><Edit className="w-4 h-4" /></button>
                      <button type="button" onClick={(e) => handleDelete(e, resume.id)} className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors" title="Delete Resume"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {previewResume && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
                <div><h3 className="font-bold text-white text-base">{previewResume.name}</h3><p className="text-xs text-slate-400">{previewResume.targetRole}</p></div>
                <div className="flex items-center space-x-3">
                  <button onClick={() => navigate('/resume/builder/' + encodeURIComponent(previewResume.id))} className="flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold rounded-lg text-xs transition-colors"><Edit className="w-3.5 h-3.5" /><span>Open in Builder</span></button>
                  <button onClick={() => setPreviewResume(null)} className="text-slate-400 hover:text-white text-sm px-2 py-1">✕</button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-6 bg-slate-950"><ResumePreview data={previewResume.data} onPrint={() => window.print()} /></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};