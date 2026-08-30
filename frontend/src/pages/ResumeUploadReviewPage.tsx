import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { resumeApi } from '../services/resumeApi';
import { ResumeData } from '../types/resume.types';
import { Upload, CheckCircle2, AlertCircle, Sparkles, ShieldCheck } from 'lucide-react';

export const ResumeUploadReviewPage: React.FC = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [targetRole, setTargetRole] = useState<string>('Software Engineer');
  const [resumeName, setResumeName] = useState<string>('Parsed Resume Profile');
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [parsedData, setParsedData] = useState<ResumeData | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      setResumeName(selected.name.replace(/\.[^/.]+$/, '') + ' (Parsed)');
      setUploadError(null);
    }
  };

  const handleUploadAndExtract = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) { setUploadError('Please select a resume file to upload.'); return; }
    setUploading(true);
    setUploadError(null);
    try {
      const res = await resumeApi.uploadResumeFile(file, targetRole);
      setParsedData(res.parsedData);
    } catch (err: any) {
      setUploadError(err.message || 'Failed to parse resume document.');
    } finally {
      setUploading(false);
    }
  };

  const handleSaveToWorkspace = async () => {
    if (!parsedData) return;
    setIsSaving(true);
    try {
      const created = await resumeApi.createResume({
        name: resumeName.trim() || 'My Extracted Resume',
        targetRole: targetRole.trim() || 'Software Engineer',
        status: 'READY',
        data: parsedData,
      });
      navigate('/resume/builder/' + encodeURIComponent(created.id));
    } catch (err: any) {
      alert(err.message || 'Failed to save parsed resume.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="border-b border-slate-800 pb-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Resume Extraction & Review</h1>
            <p className="text-sm text-slate-400">Upload your existing document, review structured fields, and verify details before saving.</p>
          </div>
          <button onClick={() => navigate('/resume')} className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg border border-slate-800 hover:bg-slate-900 transition-colors">← Back to Resumes</button>
        </div>
        {!parsedData && (
          <form onSubmit={handleUploadAndExtract} className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-6 shadow-xl">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">Target Role Context (Optional)</label>
                <input type="text" value={targetRole} onChange={(e) => setTargetRole(e.target.value)} placeholder="e.g. Senior Fullstack Engineer" className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">Upload Resume File (PDF or DOCX, max 10MB)</label>
                <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-800 hover:border-emerald-500/50 rounded-2xl cursor-pointer bg-slate-950/60 hover:bg-slate-950 transition-all">
                  <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400 mb-3"><Upload className="w-6 h-6" /></div>
                  <span className="text-sm font-semibold text-slate-200">{file ? file.name : 'Click or drag resume file here'}</span>
                  <span className="text-xs text-slate-500 mt-1">Supports .pdf and .docx documents</span>
                  <input type="file" accept=".pdf,.docx,.doc,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={handleFileChange} className="hidden" />
                </label>
              </div>
              {uploadError && (
                <div className="flex items-center space-x-2.5 p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-300">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}
              <button type="submit" disabled={uploading || !file} className="w-full flex items-center justify-center space-x-2 py-3 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-semibold rounded-xl text-sm transition-colors shadow-md">
                {uploading ? (<><div className="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" /><span>Extracting & Structuring with AI...</span></>) : (<><Sparkles className="w-4 h-4" /><span>Extract Resume Content</span></>)}
              </button>
            </div>
          </form>
        )}
        {parsedData && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-300 text-xs">
              <div className="flex items-center space-x-2.5"><ShieldCheck className="w-5 h-5 text-emerald-400" /><span><strong>Extraction Complete:</strong> Please review and correct the extracted data below before saving to your workspace.</span></div>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h2 className="text-base font-semibold text-white">Resume Settings</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label className="text-xs text-slate-400 block mb-1">Resume Name</label><input type="text" value={resumeName} onChange={(e) => setResumeName(e.target.value)} className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500" /></div>
                <div><label className="text-xs text-slate-400 block mb-1">Target Role</label><input type="text" value={targetRole} onChange={(e) => setTargetRole(e.target.value)} className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500" /></div>
              </div>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h2 className="text-base font-semibold text-white">Personal Contact Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label className="text-xs text-slate-400 block mb-1">Full Name</label><input type="text" value={parsedData.personal?.name || ''} onChange={(e) => setParsedData({ ...parsedData, personal: { ...parsedData.personal, name: e.target.value } })} className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500" /></div>
                <div><label className="text-xs text-slate-400 block mb-1">Email</label><input type="email" value={parsedData.personal?.email || ''} onChange={(e) => setParsedData({ ...parsedData, personal: { ...parsedData.personal, email: e.target.value } })} className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500" /></div>
              </div>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h2 className="text-base font-semibold text-white">Summary</h2>
              <textarea rows={3} value={parsedData.summary || ''} onChange={(e) => setParsedData({ ...parsedData, summary: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500" />
            </div>
            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
              <button type="button" onClick={() => setParsedData(null)} className="px-4 py-2.5 text-xs text-slate-400 hover:text-white rounded-xl transition-colors">Re-upload Different File</button>
              <button type="button" disabled={isSaving} onClick={handleSaveToWorkspace} className="flex items-center space-x-2 px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-semibold rounded-xl text-sm transition-colors shadow-md"><CheckCircle2 className="w-4 h-4" /><span>{isSaving ? 'Saving Resume...' : 'Save & Open Builder'}</span></button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};