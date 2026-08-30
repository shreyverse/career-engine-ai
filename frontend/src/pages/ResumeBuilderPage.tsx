import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { resumeApi } from '../services/resumeApi';
import { ResumeData, ResumeStatus, ResumeSkill, ResumeProject, ResumeImprovementResponse } from '../types/resume.types';
import { ResumePreview } from '../components/resume/ResumePreview';
import { AIImprovementModal } from '../components/resume/AIImprovementModal';
import { ProfileImportDrawer } from '../components/resume/ProfileImportDrawer';
import { Save, Sparkles, Plus, Trash2, ArrowLeft, Layers, Briefcase, GraduationCap, Award, BookOpen, User } from 'lucide-react';

export const ResumeBuilderPage: React.FC = () => {
  const { resumeId } = useParams<{ resumeId?: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [currentResumeId, setCurrentResumeId] = useState<string | null>(resumeId || null);
  const [name, setName] = useState<string>('Software Engineer Resume');
  const [targetRole, setTargetRole] = useState<string>('Senior Fullstack Engineer');
  const [status, setStatus] = useState<ResumeStatus>('DRAFT');
  const [completeness, setCompleteness] = useState<number>(0);
  const [resumeData, setResumeData] = useState<ResumeData>({ personal: { name: '', email: '' }, summary: '', education: [], experience: [], skills: [], projects: [], certifications: [], achievements: [] });
  const [activeSection, setActiveSection] = useState<string>('personal');
  const [mobileTab, setMobileTab] = useState<'editor' | 'preview'>('editor');
  const [isImportDrawerOpen, setIsImportDrawerOpen] = useState<boolean>(false);
  const [aiModalOpen, setAiModalOpen] = useState<boolean>(false);
  const [aiOriginalText, setAiOriginalText] = useState<string>('');
  const [aiSuggestion, setAiSuggestion] = useState<ResumeImprovementResponse | null>(null);
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [aiTargetCallback, setAiTargetCallback] = useState<((text: string) => void) | null>(null);

  useEffect(() => { if (resumeId) { loadResume(resumeId); } else { setLoading(false); } }, [resumeId]);

  const loadResume = async (id: string) => {
    setLoading(true);
    try {
      const data = await resumeApi.getResume(id);
      setName(data.name);
      setTargetRole(data.targetRole);
      setStatus(data.status);
      setCompleteness(data.completeness);
      setResumeData(data.data);
    } catch (err: any) {
      alert(err.message || 'Failed to load resume.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (currentResumeId) {
        const updated = await resumeApi.updateResume(currentResumeId, { name, targetRole, status, data: { ...resumeData, targetRole } });
        setCompleteness(updated.completeness);
      } else {
        const created = await resumeApi.createResume({ name, targetRole, status, data: { ...resumeData, targetRole } });
        setCurrentResumeId(created.id);
        setCompleteness(created.completeness);
        navigate('/resume/builder/' + encodeURIComponent(created.id), { replace: true });
      }
    } catch (err: any) {
      alert(err.message || 'Failed to save resume.');
    } finally {
      setSaving(false);
    }
  };

  const triggerAIBulletImprovement = async (section: 'summary' | 'experience' | 'project' | 'achievement', content: string, onApply: (improved: string) => void) => {
    if (!content || content.trim().length < 5) { alert('Please enter at least 5 characters to improve with AI.'); return; }
    setAiOriginalText(content);
    setAiTargetCallback(() => onApply);
    setAiModalOpen(true);
    setAiLoading(true);
    setAiSuggestion(null);
    try {
      const dummyId = currentResumeId || 'preview';
      const res = await resumeApi.improveContent(dummyId, { section, content, targetRole });
      setAiSuggestion(res);
    } catch (err: any) {
      console.error('AI improvement request failed:', err);
    } finally {
      setAiLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-3">
        <div className="w-8 h-8 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
        <p className="text-xs text-slate-400">Loading Resume Builder...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <div className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-8 py-3.5 sticky top-0 z-30 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <button onClick={() => navigate('/resume')} className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"><ArrowLeft className="w-5 h-5" /></button>
          <div>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="bg-transparent font-bold text-white text-base sm:text-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 rounded px-1 -ml-1 border-b border-transparent hover:border-slate-700" />
            <div className="flex items-center space-x-2 text-xs text-slate-400"><span>Role: {targetRole}</span><span>•</span><span className="text-emerald-400 font-medium">Completeness: {completeness}%</span></div>
          </div>
        </div>
        <div className="flex items-center space-x-2.5">
          <select value={status} onChange={(e) => setStatus(e.target.value as ResumeStatus)} className="px-2.5 py-1.5 bg-slate-950 border border-slate-800 text-xs rounded-xl text-slate-300 focus:outline-none"><option value="DRAFT">Draft</option><option value="READY">Ready</option><option value="ARCHIVED">Archived</option></select>
          <button onClick={() => setIsImportDrawerOpen(true)} className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium rounded-xl transition-colors"><Sparkles className="w-3.5 h-3.5 text-emerald-400" /><span className="hidden sm:inline">Import from Profile</span></button>
          <button onClick={handleSave} disabled={saving} className="flex items-center space-x-1.5 px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs rounded-xl transition-colors shadow-sm"><Save className="w-3.5 h-3.5" /><span>{saving ? 'Saving...' : 'Save'}</span></button>
        </div>
      </div>
      <div className="flex lg:hidden border-b border-slate-800 bg-slate-900/60 p-1">
        <button onClick={() => setMobileTab('editor')} className={'flex-1 py-2 text-xs font-semibold rounded-lg transition-colors ' + (mobileTab === 'editor' ? 'bg-slate-800 text-white' : 'text-slate-400')}>Editor</button>
        <button onClick={() => setMobileTab('preview')} className={'flex-1 py-2 text-xs font-semibold rounded-lg transition-colors ' + (mobileTab === 'preview' ? 'bg-slate-800 text-white' : 'text-slate-400')}>ATS Preview</button>
      </div>
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        <div className={'lg:col-span-6 xl:col-span-5 border-r border-slate-800 bg-slate-950 overflow-y-auto p-4 sm:p-6 space-y-6 ' + (mobileTab === 'preview' ? 'hidden lg:block' : 'block')}>
          <div className="flex flex-wrap gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl">
            {[ { id: 'personal', label: 'Personal', icon: User }, { id: 'summary', label: 'Summary', icon: BookOpen }, { id: 'experience', label: 'Experience', icon: Briefcase }, { id: 'skills', label: 'Skills', icon: Layers }, { id: 'projects', label: 'Projects', icon: Award }, { id: 'education', label: 'Education', icon: GraduationCap } ].map((tab) => {
              const Icon = tab.icon;
              return (<button key={tab.id} onClick={() => setActiveSection(tab.id)} className={'flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ' + (activeSection === tab.id ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'text-slate-400 hover:text-white')}><Icon className="w-3.5 h-3.5" /><span>{tab.label}</span></button>);
            })}
          </div>
          {activeSection === 'personal' && (
            <div className="space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">Personal Contact Information</h2>
              <div className="space-y-3">
                <div><label className="text-xs text-slate-400 block mb-1">Full Name</label><input type="text" value={resumeData.personal?.name || ''} onChange={(e) => setResumeData({ ...resumeData, personal: { ...resumeData.personal, name: e.target.value } })} className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500" /></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div><label className="text-xs text-slate-400 block mb-1">Email Address</label><input type="email" value={resumeData.personal?.email || ''} onChange={(e) => setResumeData({ ...resumeData, personal: { ...resumeData.personal, email: e.target.value } })} className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500" /></div>
                  <div><label className="text-xs text-slate-400 block mb-1">Phone Number</label><input type="text" value={resumeData.personal?.phone || ''} onChange={(e) => setResumeData({ ...resumeData, personal: { ...resumeData.personal, phone: e.target.value } })} className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500" /></div>
                </div>
                <div><label className="text-xs text-slate-400 block mb-1">Location</label><input type="text" value={resumeData.personal?.location || ''} onChange={(e) => setResumeData({ ...resumeData, personal: { ...resumeData.personal, location: e.target.value } })} placeholder="e.g. San Francisco, CA (Remote)" className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500" /></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div><label className="text-xs text-slate-400 block mb-1">LinkedIn URL</label><input type="text" value={resumeData.personal?.linkedin || ''} onChange={(e) => setResumeData({ ...resumeData, personal: { ...resumeData.personal, linkedin: e.target.value } })} className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500" /></div>
                  <div><label className="text-xs text-slate-400 block mb-1">GitHub URL</label><input type="text" value={resumeData.personal?.github || ''} onChange={(e) => setResumeData({ ...resumeData, personal: { ...resumeData.personal, github: e.target.value } })} className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500" /></div>
                </div>
              </div>
            </div>
          )}
          {activeSection === 'summary' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">Professional Summary</h2>
                <button type="button" onClick={() => triggerAIBulletImprovement('summary', resumeData.summary || '', (improved) => setResumeData({ ...resumeData, summary: improved }))} className="flex items-center space-x-1 text-xs text-emerald-400 hover:text-emerald-300 transition-colors"><Sparkles className="w-3.5 h-3.5" /><span>Improve with AI</span></button>
              </div>
              <textarea rows={5} value={resumeData.summary || ''} onChange={(e) => setResumeData({ ...resumeData, summary: e.target.value })} placeholder="Write a concise overview of your technical background, core specialties, and impact..." className="w-full p-3.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white leading-relaxed focus:outline-none focus:ring-1 focus:ring-emerald-500" />
            </div>
          )}
          {activeSection === 'experience' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">Work Experience</h2>
                <button type="button" onClick={() => { const newExp = { id: 'exp-' + Date.now(), company: 'Company Name', role: 'Software Engineer', location: 'Remote', startDate: '2023', endDate: 'Present', current: true, description: '', achievements: ['Delivered core platform features with automated test pipelines.'] }; setResumeData({ ...resumeData, experience: [newExp, ...(resumeData.experience || [])] }); }} className="flex items-center space-x-1 text-xs text-emerald-400 hover:text-emerald-300 transition-colors"><Plus className="w-3.5 h-3.5" /><span>Add Experience</span></button>
              </div>
              <div className="space-y-4">
                {resumeData.experience?.map((exp, idx) => (
                  <div key={exp.id} className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
                    <div className="flex justify-between items-center"><span className="text-xs font-bold text-slate-300">Position #{idx + 1}</span><button type="button" onClick={() => { const next = resumeData.experience.filter((_, i) => i !== idx); setResumeData({ ...resumeData, experience: next }); }} className="text-slate-500 hover:text-rose-400 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button></div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div><label className="text-[11px] text-slate-400 block mb-1">Role Title</label><input type="text" value={exp.role} onChange={(e) => { const next = [...resumeData.experience]; next[idx].role = e.target.value; setResumeData({ ...resumeData, experience: next }); }} className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white" /></div>
                      <div><label className="text-[11px] text-slate-400 block mb-1">Company</label><input type="text" value={exp.company} onChange={(e) => { const next = [...resumeData.experience]; next[idx].company = e.target.value; setResumeData({ ...resumeData, experience: next }); }} className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white" /></div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center"><label className="text-[11px] text-slate-400">Achievements / Responsibilities</label><button type="button" onClick={() => { const next = [...resumeData.experience]; next[idx].achievements = [...(next[idx].achievements || []), '']; setResumeData({ ...resumeData, experience: next }); }} className="text-[11px] text-emerald-400 hover:underline">+ Add Bullet</button></div>
                      {exp.achievements?.map((ach, achIdx) => (
                        <div key={achIdx} className="flex items-start gap-2">
                          <input type="text" value={ach} onChange={(e) => { const next = [...resumeData.experience]; next[idx].achievements[achIdx] = e.target.value; setResumeData({ ...resumeData, experience: next }); }} placeholder="Describe impact, metrics, or technical implementation..." className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white" />
                          <button type="button" onClick={() => triggerAIBulletImprovement('experience', ach, (improved) => { const next = [...resumeData.experience]; next[idx].achievements[achIdx] = improved; setResumeData({ ...resumeData, experience: next }); })} className="p-1.5 text-slate-400 hover:text-emerald-400 rounded-lg hover:bg-slate-800" title="Improve bullet with AI"><Sparkles className="w-3.5 h-3.5" /></button>
                          <button type="button" onClick={() => { const next = [...resumeData.experience]; next[idx].achievements = next[idx].achievements.filter((_, i) => i !== achIdx); setResumeData({ ...resumeData, experience: next }); }} className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-800"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeSection === 'skills' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between"><h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">Skills Competencies ({resumeData.skills?.length || 0})</h2><button type="button" onClick={() => { const newSkill: ResumeSkill = { id: 'sk-' + Date.now(), name: '', category: 'TECHNICAL', level: 'INTERMEDIATE' }; setResumeData({ ...resumeData, skills: [...(resumeData.skills || []), newSkill] }); }} className="flex items-center space-x-1 text-xs text-emerald-400 hover:text-emerald-300 transition-colors"><Plus className="w-3.5 h-3.5" /><span>Add Skill</span></button></div>
              <div className="space-y-2">
                {resumeData.skills?.map((sk, idx) => (
                  <div key={sk.id} className="flex items-center gap-2 p-2 bg-slate-900 border border-slate-800 rounded-xl">
                    <input type="text" value={sk.name} onChange={(e) => { const next = [...resumeData.skills]; next[idx].name = e.target.value; setResumeData({ ...resumeData, skills: next }); }} placeholder="Skill name (e.g. TypeScript, Redis)" className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white" />
                    <select value={sk.category} onChange={(e) => { const next = [...resumeData.skills]; next[idx].category = e.target.value as any; setResumeData({ ...resumeData, skills: next }); }} className="px-2 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300"><option value="TECHNICAL">Technical</option><option value="DATABASE">Database</option><option value="CLOUD">Cloud / DevOps</option><option value="TOOLS">Tools & Git</option><option value="SOFT_SKILL">Soft Skill</option><option value="DOMAIN">Domain</option></select>
                    <button type="button" onClick={() => { const next = resumeData.skills.filter((_, i) => i !== idx); setResumeData({ ...resumeData, skills: next }); }} className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-800"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeSection === 'projects' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between"><h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">Projects & Highlights</h2><button type="button" onClick={() => { const newProj: ResumeProject = { id: 'proj-' + Date.now(), name: 'Fullstack Project', description: 'Application description', technologies: ['React', 'TypeScript', 'Node.js'], highlights: ['Engineered scalable microservices.'] }; setResumeData({ ...resumeData, projects: [...(resumeData.projects || []), newProj] }); }} className="flex items-center space-x-1 text-xs text-emerald-400 hover:text-emerald-300 transition-colors"><Plus className="w-3.5 h-3.5" /><span>Add Project</span></button></div>
              <div className="space-y-4">
                {resumeData.projects?.map((proj, idx) => (
                  <div key={proj.id} className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
                    <div className="flex justify-between items-center"><span className="text-xs font-bold text-slate-300">Project #{idx + 1}</span><button type="button" onClick={() => { const next = resumeData.projects.filter((_, i) => i !== idx); setResumeData({ ...resumeData, projects: next }); }} className="text-slate-500 hover:text-rose-400 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button></div>
                    <div><label className="text-[11px] text-slate-400 block mb-1">Project Name</label><input type="text" value={proj.name} onChange={(e) => { const next = [...resumeData.projects]; next[idx].name = e.target.value; setResumeData({ ...resumeData, projects: next }); }} className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white" /></div>
                    <div><label className="text-[11px] text-slate-400 block mb-1">Technologies (Comma Separated)</label><input type="text" value={proj.technologies?.join(', ') || ''} onChange={(e) => { const next = [...resumeData.projects]; next[idx].technologies = e.target.value.split(',').map((t) => t.trim()).filter(Boolean); setResumeData({ ...resumeData, projects: next }); }} className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white" /></div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeSection === 'education' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between"><h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">Education Details</h2><button type="button" onClick={() => { const newEdu = { id: 'edu-' + Date.now(), institution: 'University Name', degree: 'Bachelor of Science', field: 'Computer Science', startDate: '2020', endDate: '2024' }; setResumeData({ ...resumeData, education: [...(resumeData.education || []), newEdu] }); }} className="flex items-center space-x-1 text-xs text-emerald-400 hover:text-emerald-300 transition-colors"><Plus className="w-3.5 h-3.5" /><span>Add Education</span></button></div>
              <div className="space-y-4">
                {resumeData.education?.map((edu, idx) => (
                  <div key={edu.id} className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
                    <div className="flex justify-between items-center"><span className="text-xs font-bold text-slate-300">Education #{idx + 1}</span><button type="button" onClick={() => { const next = resumeData.education.filter((_, i) => i !== idx); setResumeData({ ...resumeData, education: next }); }} className="text-slate-500 hover:text-rose-400 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button></div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div><label className="text-[11px] text-slate-400 block mb-1">Institution</label><input type="text" value={edu.institution} onChange={(e) => { const next = [...resumeData.education]; next[idx].institution = e.target.value; setResumeData({ ...resumeData, education: next }); }} className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white" /></div>
                      <div><label className="text-[11px] text-slate-400 block mb-1">Degree</label><input type="text" value={edu.degree} onChange={(e) => { const next = [...resumeData.education]; next[idx].degree = e.target.value; setResumeData({ ...resumeData, education: next }); }} className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white" /></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className={'lg:col-span-6 xl:col-span-7 bg-slate-900/50 p-6 overflow-y-auto ' + (mobileTab === 'editor' ? 'hidden lg:block' : 'block')}>
          <ResumePreview data={{ ...resumeData, targetRole }} onPrint={() => window.print()} />
        </div>
      </div>
      <AIImprovementModal isOpen={aiModalOpen} onClose={() => setAiModalOpen(false)} originalText={aiOriginalText} suggestion={aiSuggestion} isLoading={aiLoading} onAccept={(improved) => { if (aiTargetCallback) aiTargetCallback(improved); }} />
      <ProfileImportDrawer isOpen={isImportDrawerOpen} onClose={() => setIsImportDrawerOpen(false)} onImportSkills={(importedSkills) => { setResumeData({ ...resumeData, skills: [...(resumeData.skills || []), ...importedSkills] }); }} onImportProjects={(importedProjects) => { setResumeData({ ...resumeData, projects: [...(resumeData.projects || []), ...importedProjects] }); }} />
    </div>
  );
};