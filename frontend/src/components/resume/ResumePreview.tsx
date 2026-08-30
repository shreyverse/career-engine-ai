import React from 'react';
import { ResumeData } from '../../types/resume.types';
import { Mail, Phone, MapPin, Globe, Linkedin, Github, Printer } from 'lucide-react';

interface ResumePreviewProps {
  data: ResumeData;
  scale?: number;
  onPrint?: () => void;
}

export const ResumePreview: React.FC<ResumePreviewProps> = ({ data, onPrint }) => {
  const { personal, summary, education, experience, skills, projects, certifications, achievements } = data;

  const groupedSkills = (skills || []).reduce<Record<string, string[]>>((acc, s) => {
    const cat = s.category || 'TECHNICAL';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(s.name);
    return acc;
  }, {});

  return (
    <div className="relative flex flex-col items-center">
      {onPrint && (
        <div className="w-full flex justify-end mb-3 print:hidden">
          <button
            onClick={onPrint}
            className="flex items-center space-x-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-sm font-medium transition-colors shadow-sm"
          >
            <Printer className="w-4 h-4 text-emerald-400" />
            <span>Print / Save as PDF</span>
          </button>
        </div>
      )}

      {/* ATS-Friendly Document Sheet */}
      <div
        id="resume-document"
        className="w-full max-w-[850px] bg-white text-slate-900 shadow-2xl rounded-sm p-10 sm:p-12 font-sans border border-slate-200 print:shadow-none print:border-none print:p-0 print:m-0 print:max-w-none text-[13px] leading-relaxed"
      >
        {/* Header / Personal Info */}
        <div className="border-b border-slate-300 pb-4 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 uppercase mb-2">
            {personal?.name || 'Your Full Name'}
          </h1>
          {data.targetRole && (
            <p className="text-sm font-semibold text-slate-700 tracking-wide uppercase mb-2">
              {data.targetRole}
            </p>
          )}

          {/* Contact Bar */}
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-slate-600">
            {personal?.email && (
              <span className="flex items-center gap-1">
                <Mail className="w-3 h-3 text-slate-500" />
                {personal.email}
              </span>
            )}
            {personal?.phone && (
              <span className="flex items-center gap-1">
                <Phone className="w-3 h-3 text-slate-500" />
                {personal.phone}
              </span>
            )}
            {personal?.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-500" />
                {personal.location}
              </span>
            )}
            {personal?.linkedin && (
              <span className="flex items-center gap-1">
                <Linkedin className="w-3 h-3 text-slate-500" />
                <a
                  href={personal.linkedin.startsWith('http') ? personal.linkedin : 'https://' + personal.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:underline text-slate-700"
                >
                  {personal.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//i, 'in/')}
                </a>
              </span>
            )}
            {personal?.github && (
              <span className="flex items-center gap-1">
                <Github className="w-3 h-3 text-slate-500" />
                <a
                  href={personal.github.startsWith('http') ? personal.github : 'https://' + personal.github}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:underline text-slate-700"
                >
                  {personal.github.replace(/^https?:\/\/(www\.)?github\.com\//i, 'gh/')}
                </a>
              </span>
            )}
            {personal?.portfolio && (
              <span className="flex items-center gap-1">
                <Globe className="w-3 h-3 text-slate-500" />
                <a
                  href={personal.portfolio.startsWith('http') ? personal.portfolio : 'https://' + personal.portfolio}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:underline text-slate-700"
                >
                  {personal.portfolio.replace(/^https?:\/\//i, '')}
                </a>
              </span>
            )}
          </div>
        </div>

        {/* Professional Summary */}
        {summary && summary.trim().length > 0 && (
          <div className="mt-5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-0.5 mb-2">
              Professional Summary
            </h2>
            <p className="text-slate-700 text-justify text-xs leading-normal">{summary}</p>
          </div>
        )}

        {/* Work Experience */}
        {experience && experience.length > 0 && (
          <div className="mt-5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-0.5 mb-2.5">
              Experience
            </h2>
            <div className="space-y-3.5">
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline text-xs">
                    <span className="font-bold text-slate-900">{exp.role}</span>
                    <span className="text-slate-600 font-medium">
                      {exp.startDate || 'Start'} – {exp.current ? 'Present' : exp.endDate || 'End'}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline text-xs mb-1">
                    <span className="italic font-medium text-slate-700">{exp.company}</span>
                    {exp.location && <span className="text-slate-500 text-[11px]">{exp.location}</span>}
                  </div>
                  {exp.description && <p className="text-slate-700 text-xs mb-1">{exp.description}</p>}
                  {exp.achievements && exp.achievements.length > 0 && (
                    <ul className="list-disc list-outside ml-4 space-y-1 text-slate-700 text-xs">
                      {exp.achievements.map((ach, idx) => (
                        <li key={idx} className="leading-snug">
                          {ach}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {projects && projects.length > 0 && (
          <div className="mt-5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-0.5 mb-2.5">
              Projects & Engineering Work
            </h2>
            <div className="space-y-3">
              {projects.map((proj) => (
                <div key={proj.id}>
                  <div className="flex justify-between items-baseline text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{proj.name}</span>
                      {proj.technologies && proj.technologies.length > 0 && (
                        <span className="text-[11px] text-slate-600 font-normal">
                          | {proj.technologies.join(', ')}
                        </span>
                      )}
                    </div>
                    {proj.url && (
                      <a
                        href={proj.url.startsWith('http') ? proj.url : 'https://' + proj.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-emerald-700 hover:underline"
                      >
                        Demo / Repository
                      </a>
                    )}
                  </div>
                  {proj.description && <p className="text-slate-700 text-xs mb-1">{proj.description}</p>}
                  {proj.highlights && proj.highlights.length > 0 && (
                    <ul className="list-disc list-outside ml-4 space-y-0.5 text-slate-700 text-xs">
                      {proj.highlights.map((hl, idx) => (
                        <li key={idx} className="leading-snug">
                          {hl}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Technical Skills */}
        {skills && skills.length > 0 && (
          <div className="mt-5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-0.5 mb-2">
              Technical Competencies
            </h2>
            <div className="space-y-1 text-xs">
              {Object.entries(groupedSkills).map(([cat, list]) => (
                <div key={cat} className="flex">
                  <span className="font-semibold text-slate-800 w-32 shrink-0">
                    {cat.replace(/_/g, ' ')}:
                  </span>
                  <span className="text-slate-700">{list.join(', ')}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {education && education.length > 0 && (
          <div className="mt-5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-0.5 mb-2.5">
              Education
            </h2>
            <div className="space-y-2">
              {education.map((edu) => (
                <div key={edu.id} className="flex justify-between items-baseline text-xs">
                  <div>
                    <span className="font-bold text-slate-900">{edu.institution}</span>
                    <div className="text-slate-700">
                      {edu.degree} {edu.field ? 'in ' + edu.field : ''}
                      {edu.grade ? ' (' + edu.grade + ')' : ''}
                    </div>
                  </div>
                  <span className="text-slate-600 text-right">
                    {edu.startDate || ''} {edu.startDate && edu.endDate ? '–' : ''} {edu.endDate || ''}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications & Achievements */}
        {((certifications && certifications.length > 0) || (achievements && achievements.length > 0)) && (
          <div className="mt-5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-0.5 mb-2">
              Certifications & Highlights
            </h2>
            <ul className="list-disc list-outside ml-4 space-y-1 text-slate-700 text-xs">
              {certifications?.map((c) => (
                <li key={c.id}>
                  <span className="font-semibold text-slate-800">{c.name}</span> — {c.issuer}
                  {c.issueDate ? ' (' + c.issueDate + ')' : ''}
                </li>
              ))}
              {achievements?.map((a) => (
                <li key={a.id}>
                  <span className="font-semibold text-slate-800">{a.title}</span>
                  {a.description ? ': ' + a.description : ''}
                  {a.date ? ' (' + a.date + ')' : ''}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
