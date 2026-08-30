import React, { useEffect, useState } from 'react';
import { Download, X, BookOpen, Layers, Sparkles } from 'lucide-react';
import { skillsApi } from '../../services/skillsApi';
import { roadmapApi } from '../../services/roadmapApi';
import { ResumeSkill, ResumeProject } from '../../types/resume.types';

interface ProfileImportDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSkills: (skills: ResumeSkill[]) => void;
  onImportProjects: (projects: ResumeProject[]) => void;
}

export const ProfileImportDrawer: React.FC<ProfileImportDrawerProps> = ({
  isOpen,
  onClose,
  onImportSkills,
  onImportProjects,
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [profileSkills, setProfileSkills] = useState<string[]>([]);
  const [profileProjects, setProfileProjects] = useState<Array<{ title: string; purpose: string; skills: string[] }>>([]);

  const [selectedSkills, setSelectedSkills] = useState<Set<string>>(new Set());
  const [selectedProjects, setSelectedProjects] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (isOpen) {
      loadProfileData();
    }
  }, [isOpen]);

  const loadProfileData = async () => {
    setLoading(true);
    try {
      const [skillsRes, roadmapRes] = await Promise.allSettled([
        skillsApi.getSkillsWorkspace(),
        roadmapApi.getRoadmap(),
      ]);

      const foundSkills: string[] = [];
      if (skillsRes.status === 'fulfilled' && skillsRes.value) {
        if (skillsRes.value.allGaps) {
          skillsRes.value.allGaps.forEach((g) => foundSkills.push(g.skill));
        }
      }

      const foundProjects: Array<{ title: string; purpose: string; skills: string[] }> = [];
      if (roadmapRes.status === 'fulfilled' && roadmapRes.value?.roadmap?.phases) {
        roadmapRes.value.roadmap.phases.forEach((p) => {
          if (p.project) {
            foundProjects.push({
              title: p.project.title,
              purpose: p.project.description || '',
              skills: p.project.skills || [],
            });
          }
        });
      }

      setProfileSkills(foundSkills);
      setProfileProjects(foundProjects);
      setSelectedSkills(new Set(foundSkills));
      setSelectedProjects(new Set(foundProjects.map((_, i) => i)));
    } catch (err) {
      console.error('Failed to load profile import data:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleSkill = (skill: string) => {
    const next = new Set(selectedSkills);
    if (next.has(skill)) next.delete(skill);
    else next.add(skill);
    setSelectedSkills(next);
  };

  const toggleProject = (index: number) => {
    const next = new Set(selectedProjects);
    if (next.has(index)) next.delete(index);
    else next.add(index);
    setSelectedProjects(next);
  };

  const handleApply = () => {
    const newSkills: ResumeSkill[] = Array.from(selectedSkills).map((s) => ({
      id: 'skill-import-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      name: s,
      category: 'TECHNICAL',
      level: 'INTERMEDIATE',
    }));

    const newProjects: ResumeProject[] = Array.from(selectedProjects).map((idx) => {
      const p = profileProjects[idx];
      return {
        id: 'proj-import-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
        name: p.title,
        description: p.purpose,
        technologies: p.skills,
        highlights: [
          'Engineered scalable components using ' + p.skills.slice(0, 3).join(', ') + '.',
        ],
      };
    });

    if (newSkills.length > 0) onImportSkills(newSkills);
    if (newProjects.length > 0) onImportProjects(newProjects);

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border-l border-slate-800 w-full max-w-md h-full flex flex-col shadow-2xl">
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <h3 className="font-semibold text-white text-base">Import from Career Engine</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-3">
              <div className="w-8 h-8 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
              <p className="text-xs text-slate-400">Loading verified skills & roadmap projects...</p>
            </div>
          ) : (
            <>
              {/* Skills Section */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-emerald-400" />
                    Assessed Skills ({profileSkills.length})
                  </span>
                </div>
                {profileSkills.length === 0 ? (
                  <p className="text-xs text-slate-500 italic">No skills recorded in assessment yet.</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {profileSkills.map((s) => {
                      const isSelected = selectedSkills.has(s);
                      return (
                        <button
                          key={s}
                          type="button"
                          onClick={() => toggleSkill(s)}
                          className={
                            'px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ' +
                            (isSelected
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                              : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700')
                          }
                        >
                          {isSelected && '✓ '}
                          {s}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Projects Section */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                    Roadmap Projects ({profileProjects.length})
                  </span>
                </div>
                {profileProjects.length === 0 ? (
                  <p className="text-xs text-slate-500 italic">No roadmap projects generated yet.</p>
                ) : (
                  <div className="space-y-2.5">
                    {profileProjects.map((p, idx) => {
                      const isSelected = selectedProjects.has(idx);
                      return (
                        <div
                          key={idx}
                          onClick={() => toggleProject(idx)}
                          className={
                            'p-3 rounded-xl border cursor-pointer transition-colors ' +
                            (isSelected
                              ? 'bg-emerald-950/20 border-emerald-500/40 text-white'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700')
                          }
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-semibold text-slate-200">{p.title}</span>
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {}}
                              className="rounded border-slate-700 text-emerald-500 focus:ring-emerald-500"
                            />
                          </div>
                          <p className="text-[11px] text-slate-400 line-clamp-2 mb-1.5">{p.purpose}</p>
                          {p.skills && p.skills.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {p.skills.map((sk) => (
                                <span
                                  key={sk}
                                  className="px-1.5 py-0.5 bg-slate-900 border border-slate-800 rounded text-[10px] text-slate-400"
                                >
                                  {sk}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="flex items-center space-x-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold rounded-lg text-xs transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Add Selected to Resume</span>
          </button>
        </div>
      </div>
    </div>
  );
};
