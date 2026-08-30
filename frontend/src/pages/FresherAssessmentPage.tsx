import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Compass,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Plus,
  Trash2,
  Globe,
  Code,
  Shield,
  Cloud,
  Smartphone,
  Palette,
  Briefcase,
  FileText,
  BookOpen,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Textarea } from '../components/ui/Textarea';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Alert } from '../components/ui/Alert';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Spinner } from '../components/ui/Spinner';
import { Container } from '../components/layout/Container';
import { assessmentApi } from '../services/assessmentApi';
import { resumeApi } from '../services/resumeApi';
import { Upload } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import {
  FresherAssessmentData,
  SkillLevel,
  TechSkillItem,
  ProjectItem,
  InternshipItem,
  CertificationItem,
  AchievementItem,
  ResumeOption,
} from '../types';

export const FresherAssessmentPage: React.FC = () => {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  const [step, setStep] = useState(1);
  const totalSteps = 6;

  // Step 1: Education
  const [degree, setDegree] = useState('B.Tech');
  const [customDegree, setCustomDegree] = useState('');
  const [branchMajor, setBranchMajor] = useState('Computer Science');
  const [customBranch, setCustomBranch] = useState('');
  const [collegeUniversity, setCollegeUniversity] = useState('');
  const [graduationYear, setGraduationYear] = useState<number>(new Date().getFullYear());
  const [currentYearSemester, setCurrentYearSemester] = useState('4th Year');

  // Step 2: Technical Background
  const [programmingLanguages, setProgrammingLanguages] = useState<TechSkillItem[]>([
    { name: 'JavaScript', level: 'INTERMEDIATE' },
    { name: 'Python', level: 'BASIC' },
  ]);
  const [frameworks, setFrameworks] = useState<TechSkillItem[]>([
    { name: 'React', level: 'INTERMEDIATE' },
    { name: 'Node.js', level: 'BASIC' },
  ]);
  const [databases, setDatabases] = useState<TechSkillItem[]>([
    { name: 'PostgreSQL', level: 'BASIC' },
  ]);
  const [tools, setTools] = useState<TechSkillItem[]>([
    { name: 'Git', level: 'INTERMEDIATE' },
  ]);

  // Step 3: Interests
  const [interests, setInterests] = useState<string[]>([
    'WEB_DEVELOPMENT',
    'SOFTWARE_ENGINEERING',
  ]);
  const [customInterest, setCustomInterest] = useState('');

  // Step 4: Career Goal
  const [targetRole, setTargetRole] = useState('Fullstack Developer');
  const [customTargetRole, setCustomTargetRole] = useState('');
  const [preferredIndustry, setPreferredIndustry] = useState('Technology');
  const [companyTypes, setCompanyTypes] = useState<string[]>(['PRODUCT_COMPANY', 'STARTUP']);
  const [shortTermGoal, setShortTermGoal] = useState('I want to become job-ready and secure my first software engineering role.');
  const [longTermGoal, setLongTermGoal] = useState('I want to grow into a Senior Fullstack Engineer building high-scale distributed systems.');

  // Step 5: Experience
  const [projects, setProjects] = useState<ProjectItem[]>([
    {
      id: '1',
      name: 'Career Engine Platform',
      description: 'AI-powered career intelligence and roadmap planning web application.',
      technologies: ['React', 'TypeScript', 'Node.js', 'Tailwind CSS'],
      projectUrl: '',
      githubUrl: '',
      roleContribution: 'Lead Frontend Architecture & State Management',
    },
  ]);
  const [internships, setInternships] = useState<InternshipItem[]>([]);
  const [certifications, setCertifications] = useState<CertificationItem[]>([]);
  const [achievements, setAchievements] = useState<AchievementItem[]>([]);
  const [extracurriculars, setExtracurriculars] = useState<string[]>(['Coding Club', 'Open Source Hackathons']);

  // Step 6: Resume
  const [resumeOption, setResumeOption] = useState<ResumeOption>('BUILD');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isUploadingResume, setIsUploadingResume] = useState<boolean>(false);
  const [uploadedResumeSummary, setUploadedResumeSummary] = useState<string | null>(null);

  const handleResumeFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setResumeFile(selected);
      setIsUploadingResume(true);
      setError(null);
      try {
        const uploadRes = await resumeApi.uploadResumeFile(selected, targetRole);
        await resumeApi.createResume({
          name: selected.name.replace(/\.[^/.]+$/, '') + ' (Assessment Upload)',
          targetRole: targetRole || 'Software Engineer',
          status: 'READY',
          data: uploadRes.parsedData,
        });
        setUploadedResumeSummary(
          `Successfully parsed ${selected.name}! Extracted skills and project highlights into your profile.`
        );
      } catch (err: any) {
        setError(err.message || 'Failed to parse resume document.');
      } finally {
        setIsUploadingResume(false);
      }
    }
  };

  useEffect(() => {
    let isMounted = true;
    assessmentApi
      .getFresherAssessment()
      .then((res) => {
        if (!isMounted) return;
        const d = res.assessment;
        if (d) {
          if (d.education?.degree) setDegree(d.education.degree);
          if (d.education?.branchMajor) setBranchMajor(d.education.branchMajor);
          if (d.education?.collegeUniversity) setCollegeUniversity(d.education.collegeUniversity);
          if (d.education?.graduationYear) setGraduationYear(d.education.graduationYear);
          if (d.education?.currentYearSemester) setCurrentYearSemester(d.education.currentYearSemester);

          if (d.technicalBackground?.programmingLanguages) setProgrammingLanguages(d.technicalBackground.programmingLanguages);
          if (d.technicalBackground?.frameworks) setFrameworks(d.technicalBackground.frameworks);
          if (d.technicalBackground?.databases) setDatabases(d.technicalBackground.databases);
          if (d.technicalBackground?.tools) setTools(d.technicalBackground.tools);

          if (d.interests && d.interests.length > 0) setInterests(d.interests);

          if (d.careerGoal?.targetRole) setTargetRole(d.careerGoal.targetRole);
          if (d.careerGoal?.preferredIndustry) setPreferredIndustry(d.careerGoal.preferredIndustry);
          if (d.careerGoal?.companyType) setCompanyTypes(d.careerGoal.companyType);
          if (d.careerGoal?.shortTermGoal) setShortTermGoal(d.careerGoal.shortTermGoal);
          if (d.careerGoal?.longTermGoal) setLongTermGoal(d.careerGoal.longTermGoal);

          if (d.experience?.projects && d.experience.projects.length > 0) setProjects(d.experience.projects);
          if (d.experience?.internships) setInternships(d.experience.internships);
          if (d.experience?.certifications) setCertifications(d.experience.certifications);
          if (d.experience?.achievements) setAchievements(d.experience.achievements);
          if (d.experience?.extracurriculars) setExtracurriculars(d.experience.extracurriculars);

          if (d.resume?.resumeOption) setResumeOption(d.resume.resumeOption);

          if (d.currentStep && d.currentStep >= 1 && d.currentStep <= 6) {
            setStep(d.currentStep);
          }
        }
      })
      .catch((err) => {
        console.error('Failed to load fresher assessment:', err);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const buildCurrentPayload = (): FresherAssessmentData => ({
    education: {
      degree: degree === 'Other' ? customDegree : degree,
      branchMajor: branchMajor === 'Other' ? customBranch : branchMajor,
      collegeUniversity: collegeUniversity.trim(),
      graduationYear: Number(graduationYear),
      currentYearSemester,
    },
    technicalBackground: {
      programmingLanguages,
      frameworks,
      databases,
      tools,
    },
    interests,
    careerGoal: {
      targetRole: targetRole === 'Other' ? customTargetRole : targetRole,
      preferredIndustry,
      companyType: companyTypes,
      shortTermGoal,
      longTermGoal,
    },
    experience: {
      projects,
      internships,
      certifications,
      achievements,
      extracurriculars,
    },
    resume: {
      resumeOption,
    },
    currentStep: step,
  });

  const autoSaveCurrentStep = async (nextStepNumber: number) => {
    setSaveStatus('saving');
    try {
      const payload = buildCurrentPayload();
      await assessmentApi.saveFresherStep(nextStepNumber, payload);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (err: any) {
      setSaveStatus('error');
      setError(err.message || 'Failed to auto-save progress.');
    }
  };

  const validateStep1 = (): boolean => {
    const finalDegree = degree === 'Other' ? customDegree.trim() : degree;
    const finalMajor = branchMajor === 'Other' ? customBranch.trim() : branchMajor;
    if (!finalDegree) {
      setError('Please specify your Degree.');
      return false;
    }
    if (!finalMajor) {
      setError('Please specify your Branch / Major.');
      return false;
    }
    if (!collegeUniversity.trim()) {
      setError('Please enter your College or University name.');
      return false;
    }
    if (!graduationYear || graduationYear < 1990 || graduationYear > 2035) {
      setError('Please enter a valid graduation year.');
      return false;
    }
    setError(null);
    return true;
  };

  const updateSkillLevel = (
    list: TechSkillItem[],
    setList: React.Dispatch<React.SetStateAction<TechSkillItem[]>>,
    name: string,
    level: SkillLevel
  ) => {
    const existing = list.find((item) => item.name === name);
    if (existing) {
      setList(list.map((item) => (item.name === name ? { ...item, level } : item)));
    } else {
      setList([...list, { name, level }]);
    }
  };

  const removeSkill = (
    list: TechSkillItem[],
    setList: React.Dispatch<React.SetStateAction<TechSkillItem[]>>,
    name: string
  ) => {
    setList(list.filter((item) => item.name !== name));
  };

  const addCustomSkill = (
    list: TechSkillItem[],
    setList: React.Dispatch<React.SetStateAction<TechSkillItem[]>>,
    name: string
  ) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    if (!list.some((s) => s.name.toLowerCase() === trimmed.toLowerCase())) {
      setList([...list, { name: trimmed, level: 'BASIC' }]);
    }
  };

  const handleContinue = async () => {
    setError(null);
    if (step === 1 && !validateStep1()) return;
    if (step === 3 && interests.length === 0) {
      setError('Please select at least one interest area.');
      return;
    }
    if (step === 4 && !(targetRole === 'Other' ? customTargetRole.trim() : targetRole)) {
      setError('Please specify your target role.');
      return;
    }

    if (step < totalSteps) {
      const nextStep = step + 1;
      setStep(nextStep);
      await autoSaveCurrentStep(nextStep);
    } else {
      await handleComplete();
    }
  };

  const handleBack = async () => {
    if (step > 1) {
      const prevStep = step - 1;
      setStep(prevStep);
      await autoSaveCurrentStep(prevStep);
    }
  };

  const handleComplete = async () => {
    setIsSaving(true);
    setError(null);
    try {
      await assessmentApi.saveFresherStep(6, buildCurrentPayload());
      await assessmentApi.completeFresherAssessment();
      await refreshUser();
      setIsCompleted(true);
    } catch (err: any) {
      setError(err.message || 'Failed to complete assessment.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className='min-h-screen bg-background flex flex-col items-center justify-center space-y-4'>
        <Spinner size='lg' />
        <p className='text-xs font-mono text-text-muted'>Loading career assessment...</p>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className='min-h-screen bg-background text-text py-16 px-4 relative subtle-radial-glow flex flex-col justify-center items-center'>
        <div className='absolute inset-0 subtle-grid-bg opacity-30 pointer-events-none' />
        <Card variant='elevated' padding='lg' className='w-full max-w-xl text-center space-y-6 z-10'>
          <div className='w-16 h-16 rounded-2xl bg-accent-emerald/10 text-accent-emerald border border-accent-emerald/30 flex items-center justify-center mx-auto shadow-subtle-glow'>
            <CheckCircle2 className='w-8 h-8' />
          </div>
          <div className='space-y-2'>
            <Badge variant='emerald' size='md'>Intake Complete</Badge>
            <h1 className='text-3xl font-display font-extrabold text-text'>Your career profile is ready.</h1>
            <p className='text-sm text-text-muted leading-relaxed max-w-md mx-auto'>
              We've gathered enough structured information to start building your personalized career path.
            </p>
          </div>
          <div className='pt-4'>
            <Button variant='primary' size='lg' className='w-full' onClick={() => navigate('/dashboard')} rightIcon={<ArrowRight className='w-4 h-4' />}>
              Go to Dashboard
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const interestOptions = [
    { id: 'WEB_DEVELOPMENT', title: 'Web Development', desc: 'Fullstack apps, React, Node.js & modern standards', icon: Globe },
    { id: 'SOFTWARE_ENGINEERING', title: 'Software Engineering', desc: 'System architecture, DSA, OOP & clean design', icon: Code },
    { id: 'AI_ML', title: 'AI / Machine Learning', desc: 'LLMs, PyTorch, Python & Data Science', icon: Sparkles },
    { id: 'CLOUD_DEVOPS', title: 'Cloud & DevOps', desc: 'Docker, Kubernetes, AWS & CI/CD automation', icon: Cloud },
    { id: 'CYBERSECURITY', title: 'Cybersecurity', desc: 'App security, defense & network protocols', icon: Shield },
    { id: 'APP_DEVELOPMENT', title: 'App Development', desc: 'Mobile apps, iOS, Android & React Native', icon: Smartphone },
    { id: 'UI_UX', title: 'UI / UX Design', desc: 'Figma design systems & accessibility', icon: Palette },
    { id: 'PRODUCT_MANAGEMENT', title: 'Product Management', desc: 'Roadmaps, agile sprints & technical strategy', icon: Briefcase },
  ];

  const skillLevelOrder: SkillLevel[] = ['BEGINNER', 'BASIC', 'INTERMEDIATE', 'ADVANCED'];

  return (
    <div className='min-h-screen bg-[#050608] text-white py-10 px-4 sm:px-8 lg:px-12 relative overflow-hidden flex flex-col justify-between'>
      {/* Ambient background glow */}
      <div className='absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[1200px] h-[500px] bg-gradient-to-b from-blue-600/10 via-indigo-600/5 to-transparent blur-[140px] pointer-events-none rounded-full' />
      <div className='absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:32px_32px] opacity-40 pointer-events-none' />

      <div className='w-full max-w-[1400px] mx-auto space-y-8 relative z-10'>
        {/* Header */}
        <div className='flex items-center justify-between pb-3 border-b border-border/80'>
          <Link to='/' className='flex items-center gap-2.5'>
            <div className='w-8 h-8 rounded-lg bg-surface-elevated border border-border flex items-center justify-center text-primary'>
              <Compass className='w-4 h-4 text-primary' />
            </div>
            <span className='font-display font-bold text-sm text-text'>Career Engine</span>
          </Link>
          <div className='flex items-center gap-3'>
            {saveStatus === 'saving' && (
              <span className='text-[11px] font-mono text-primary flex items-center gap-1'>
                <Spinner size='sm' /> Auto-saving...
              </span>
            )}
            {saveStatus === 'saved' && (
              <span className='text-[11px] font-mono text-accent-emerald flex items-center gap-1'>
                <CheckCircle2 className='w-3 h-3' /> Saved
              </span>
            )}
            <Badge variant='primary' size='sm'>Fresher Track</Badge>
          </div>
        </div>

        {/* Stepper */}
        <div className='space-y-2 text-left'>
          <div className='flex justify-between items-baseline'>
            <span className='text-xs font-mono text-primary-light font-semibold uppercase tracking-wider'>
              Step {step} of {totalSteps}
            </span>
            <span className='text-xs font-mono text-text-dim font-medium'>
              {Math.round((step / totalSteps) * 100)}% Complete
            </span>
          </div>
          <ProgressBar value={(step / totalSteps) * 100} size='sm' variant='primary' />
        </div>

        {error && <Alert variant='error'>{error}</Alert>}

        {/* Step 1 */}
        {step === 1 && (
          <Card variant='elevated' padding='lg' className='space-y-6 text-left'>
            <div className='space-y-1 pb-4 border-b border-border'>
              <span className='text-xs font-mono uppercase tracking-wider text-primary font-semibold'>Section 1 • Education</span>
              <h2 className='text-2xl font-display font-bold text-text'>Let's start with your education.</h2>
              <p className='text-xs text-text-muted'>Tell us about your university and current academic status.</p>
            </div>
            <div className='space-y-4'>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <Select
                  label='Degree'
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                  options={[
                    { value: 'B.Tech', label: 'B.Tech' },
                    { value: 'B.E.', label: 'B.E.' },
                    { value: 'BCA', label: 'BCA' },
                    { value: 'MCA', label: 'MCA' },
                    { value: 'B.Sc', label: 'B.Sc' },
                    { value: 'M.Sc', label: 'M.Sc' },
                    { value: 'MBA', label: 'MBA' },
                    { value: 'Other', label: 'Other Degree...' },
                  ]}
                />
                {degree === 'Other' && (
                  <Input label='Specify Degree' placeholder='e.g. Diploma' value={customDegree} onChange={(e) => setCustomDegree(e.target.value)} required />
                )}
              </div>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <Select
                  label='Branch / Major'
                  value={branchMajor}
                  onChange={(e) => setBranchMajor(e.target.value)}
                  options={[
                    { value: 'Computer Science', label: 'Computer Science' },
                    { value: 'Information Technology', label: 'Information Technology' },
                    { value: 'Data Science', label: 'Data Science' },
                    { value: 'Electronics', label: 'Electronics' },
                    { value: 'Mechanical', label: 'Mechanical' },
                    { value: 'Civil', label: 'Civil' },
                    { value: 'Other', label: 'Other...' },
                  ]}
                />
                {branchMajor === 'Other' && (
                  <Input label='Specify Major' placeholder='e.g. AI & ML' value={customBranch} onChange={(e) => setCustomBranch(e.target.value)} required />
                )}
              </div>
              <Input label='College / University Name' placeholder='e.g. State University' value={collegeUniversity} onChange={(e) => setCollegeUniversity(e.target.value)} required />
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <Select
                  label='Graduation Year'
                  value={graduationYear.toString()}
                  onChange={(e) => setGraduationYear(Number(e.target.value))}
                  options={[
                    { value: '2023', label: '2023 (Graduated)' },
                    { value: '2024', label: '2024 (Graduated)' },
                    { value: '2025', label: '2025 (Graduating This Year)' },
                    { value: '2026', label: '2026' },
                    { value: '2027', label: '2027' },
                    { value: '2028', label: '2028+' },
                  ]}
                />
                <Select
                  label='Current Status'
                  value={currentYearSemester}
                  onChange={(e) => setCurrentYearSemester(e.target.value)}
                  options={[
                    { value: '1st Year', label: '1st Year' },
                    { value: '2nd Year', label: '2nd Year' },
                    { value: '3rd Year', label: '3rd Year' },
                    { value: '4th Year / Final Year', label: '4th Year / Final Year' },
                    { value: 'Graduated', label: 'Graduated' },
                  ]}
                />
              </div>
            </div>
          </Card>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <Card variant='elevated' padding='lg' className='space-y-6 text-left'>
            <div className='space-y-1 pb-4 border-b border-border'>
              <span className='text-xs font-mono uppercase tracking-wider text-primary font-semibold'>Section 2 • Technical Background</span>
              <h2 className='text-2xl font-display font-bold text-text'>What can you work with?</h2>
              <p className='text-xs text-text-muted'>Select your technologies and indicate comfort level.</p>
            </div>
            <div className='space-y-3'>
              <label className='block text-xs font-mono uppercase tracking-wider text-text-muted font-semibold'>Programming Languages</label>
              <div className='space-y-2'>
                {programmingLanguages.map((skill) => (
                  <div key={skill.name} className='p-3 rounded-lg bg-surface border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3'>
                    <span className='text-sm font-semibold text-text'>{skill.name}</span>
                    <div className='flex items-center gap-1.5'>
                      {skillLevelOrder.map((lvl) => (
                        <button
                          key={lvl}
                          type='button'
                          onClick={() => updateSkillLevel(programmingLanguages, setProgrammingLanguages, skill.name, lvl)}
                          className={`px-2.5 py-1 text-[11px] font-mono rounded border transition-all ${skill.level === lvl ? 'bg-primary text-white border-primary font-semibold' : 'bg-surface-elevated text-text-dim border-border'}`}
                        >
                          {lvl}
                        </button>
                      ))}
                      <button type='button' onClick={() => removeSkill(programmingLanguages, setProgrammingLanguages, skill.name)} className='p-1 text-text-dim hover:text-accent-rose ml-1'>
                        <Trash2 className='w-3.5 h-3.5' />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className='flex flex-wrap gap-1.5 pt-1'>
                {['JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'Go', 'Rust', 'PHP'].map((lang) => (
                  <button key={lang} type='button' onClick={() => addCustomSkill(programmingLanguages, setProgrammingLanguages, lang)} className='px-2.5 py-1 text-xs rounded-md bg-surface-elevated border border-border text-text-muted hover:border-primary/50 hover:text-text flex items-center gap-1'>
                    <Plus className='w-3 h-3' /> {lang}
                  </button>
                ))}
              </div>
            </div>

            <div className='space-y-3 pt-3 border-t border-border'>
              <label className='block text-xs font-mono uppercase tracking-wider text-text-muted font-semibold'>Frameworks & Libraries</label>
              <div className='space-y-2'>
                {frameworks.map((skill) => (
                  <div key={skill.name} className='p-3 rounded-lg bg-surface border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3'>
                    <span className='text-sm font-semibold text-text'>{skill.name}</span>
                    <div className='flex items-center gap-1.5'>
                      {skillLevelOrder.map((lvl) => (
                        <button
                          key={lvl}
                          type='button'
                          onClick={() => updateSkillLevel(frameworks, setFrameworks, skill.name, lvl)}
                          className={`px-2.5 py-1 text-[11px] font-mono rounded border transition-all ${skill.level === lvl ? 'bg-secondary text-white border-secondary font-semibold' : 'bg-surface-elevated text-text-dim border-border'}`}
                        >
                          {lvl}
                        </button>
                      ))}
                      <button type='button' onClick={() => removeSkill(frameworks, setFrameworks, skill.name)} className='p-1 text-text-dim hover:text-accent-rose ml-1'>
                        <Trash2 className='w-3.5 h-3.5' />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className='flex flex-wrap gap-1.5 pt-1'>
                {['React', 'Next.js', 'Node.js', 'Express', 'Django', 'Spring', 'Angular', 'Vue'].map((fw) => (
                  <button key={fw} type='button' onClick={() => addCustomSkill(frameworks, setFrameworks, fw)} className='px-2.5 py-1 text-xs rounded-md bg-surface-elevated border border-border text-text-muted hover:border-secondary/50 hover:text-text flex items-center gap-1'>
                    <Plus className='w-3 h-3' /> {fw}
                  </button>
                ))}
              </div>
            </div>
          </Card>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <Card variant='elevated' padding='lg' className='space-y-6 text-left'>
            <div className='space-y-1 pb-4 border-b border-border'>
              <span className='text-xs font-mono uppercase tracking-wider text-primary font-semibold'>Section 3 • Interests</span>
              <h2 className='text-2xl font-display font-bold text-text'>What are you interested in?</h2>
              <p className='text-xs text-text-muted'>Choose the areas you'd actually enjoy exploring.</p>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
              {interestOptions.map((opt) => {
                const isSelected = interests.includes(opt.id);
                const Icon = opt.icon;
                return (
                  <div
                    key={opt.id}
                    onClick={() => {
                      if (isSelected) setInterests(interests.filter((i) => i !== opt.id));
                      else setInterests([...interests, opt.id]);
                    }}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${isSelected ? 'bg-primary/10 border-primary shadow-subtle-glow' : 'bg-surface hover:bg-surface-elevated border-border'}`}
                  >
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${isSelected ? 'bg-primary text-white' : 'bg-surface-elevated text-text-muted border border-border'}`}>
                      <Icon className='w-4 h-4' />
                    </div>
                    <div className='flex-1 min-w-0'>
                      <div className='flex items-center justify-between'>
                        <h4 className='text-sm font-bold text-text'>{opt.title}</h4>
                        {isSelected && <CheckCircle2 className='w-4 h-4 text-primary' />}
                      </div>
                      <p className='text-xs text-text-muted leading-relaxed mt-0.5'>{opt.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        {/* Step 4 */}
        {step === 4 && (
          <Card variant='elevated' padding='lg' className='space-y-6 text-left'>
            <div className='space-y-1 pb-4 border-b border-border'>
              <span className='text-xs font-mono uppercase tracking-wider text-primary font-semibold'>Section 4 • Career Goals</span>
              <h2 className='text-2xl font-display font-bold text-text'>Where do you want your career to go?</h2>
              <p className='text-xs text-text-muted'>Define target role and company preferences.</p>
            </div>
            <div className='space-y-4'>
              <Select
                label='Target Job Role'
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                options={[
                  { value: 'Fullstack Developer', label: 'Fullstack Developer' },
                  { value: 'Frontend Developer', label: 'Frontend Developer' },
                  { value: 'Backend Developer', label: 'Backend Developer' },
                  { value: 'Software Engineer', label: 'Software Engineer' },
                  { value: 'Data Scientist', label: 'Data Scientist' },
                  { value: 'ML Engineer', label: 'AI / ML Engineer' },
                  { value: 'DevOps Engineer', label: 'DevOps / Cloud Engineer' },
                  { value: 'Other', label: 'Other Role...' },
                ]}
              />
              {targetRole === 'Other' && (
                <Input placeholder='e.g. Distributed Systems Engineer' value={customTargetRole} onChange={(e) => setCustomTargetRole(e.target.value)} required />
              )}
              <Select
                label='Preferred Industry'
                value={preferredIndustry}
                onChange={(e) => setPreferredIndustry(e.target.value)}
                options={[
                  { value: 'Technology', label: 'Technology' },
                  { value: 'FinTech', label: 'FinTech' },
                  { value: 'Healthcare', label: 'Healthcare' },
                  { value: 'E-commerce', label: 'E-commerce' },
                  { value: 'Gaming', label: 'Gaming' },
                  { value: 'Other', label: 'Other...' },
                ]}
              />
              <Textarea label='Short-Term Goal (Next 6–12 months)' value={shortTermGoal} onChange={(e) => setShortTermGoal(e.target.value)} rows={2} />
              <Textarea label='Long-Term Goal (Next 3–5 years)' value={longTermGoal} onChange={(e) => setLongTermGoal(e.target.value)} rows={2} />
            </div>
          </Card>
        )}

        {/* Step 5 */}
        {step === 5 && (
          <Card variant='elevated' padding='lg' className='space-y-6 text-left'>
            <div className='space-y-1 pb-4 border-b border-border'>
              <span className='text-xs font-mono uppercase tracking-wider text-primary font-semibold'>Section 5 • Projects & Experience</span>
              <h2 className='text-2xl font-display font-bold text-text'>Tell us what you've already built.</h2>
              <p className='text-xs text-text-muted'>Add portfolio projects or practical exercises.</p>
            </div>
            <div className='space-y-3'>
              {projects.map((proj, idx) => (
                <div key={proj.id || idx} className='p-4 rounded-xl bg-surface border border-border space-y-3'>
                  <span className='text-xs font-mono text-primary font-bold'>Project #{idx + 1}</span>
                  <Input label='Project Name' value={proj.name} onChange={(e) => {
                    const upd = [...projects];
                    upd[idx].name = e.target.value;
                    setProjects(upd);
                  }} />
                  <Textarea label='Project Description' value={proj.description} onChange={(e) => {
                    const upd = [...projects];
                    upd[idx].description = e.target.value;
                    setProjects(upd);
                  }} rows={2} />
                </div>
              ))}
              <Button
                type='button'
                variant='outline'
                size='sm'
                onClick={() => setProjects([...projects, { id: Math.random().toString(), name: '', description: '', technologies: [] }])}
                leftIcon={<Plus className='w-3.5 h-3.5' />}
              >
                Add Another Project
              </Button>
            </div>
          </Card>
        )}

        {/* Step 6: Resume */}
        {step === 6 && (
          <div className='w-full rounded-3xl bg-[#0B1020] border border-white/[0.08] p-8 sm:p-12 shadow-2xl space-y-8 text-left relative overflow-hidden'>
            <div className='space-y-2 pb-6 border-b border-white/[0.06]'>
              <span className='text-xs font-mono uppercase tracking-widest text-blue-400 font-bold'>
                SECTION 6 • RESUME
              </span>
              <h2 className='text-3xl sm:text-4xl font-extrabold text-white tracking-tight'>
                Do you already have a resume?
              </h2>
              <p className='text-sm text-[#8D96AA]'>
                Choose your preferred starting method for resume creation and structured intelligence extraction.
              </p>
            </div>

            {/* 3 Full-Width Resume Choice Cards */}
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-5'>
              
              {/* Option 1: Upload */}
              <div
                onClick={() => setResumeOption('UPLOAD')}
                className={`p-6 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between relative group ${
                  resumeOption === 'UPLOAD'
                    ? 'bg-blue-600/15 border-blue-500/60 ring-1 ring-blue-500/40 text-white shadow-[0_0_20px_rgba(59,130,246,0.25)]'
                    : 'bg-white/[0.02] border-white/[0.08] hover:border-white/[0.2] hover:bg-white/[0.04]'
                }`}
              >
                <div className='flex items-start justify-between mb-4'>
                  <div className={`p-3 rounded-xl ${resumeOption === 'UPLOAD' ? 'bg-blue-500/20 text-blue-400' : 'bg-white/[0.05] text-[#8D96AA]'}`}>
                    <FileText className='w-6 h-6' />
                  </div>
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    resumeOption === 'UPLOAD' ? 'border-blue-400 bg-blue-500' : 'border-white/[0.2]'
                  }`}>
                    {resumeOption === 'UPLOAD' && <div className='w-2 h-2 rounded-full bg-white' />}
                  </div>
                </div>
                <div>
                  <h4 className='text-base font-bold text-white mb-1.5'>Upload Resume</h4>
                  <p className='text-xs text-[#8D96AA] leading-relaxed'>
                    Upload existing PDF or Doc for automated parsing.
                  </p>
                </div>
              </div>

              {/* Option 2: Build */}
              <div
                onClick={() => setResumeOption('BUILD')}
                className={`p-6 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between relative group ${
                  resumeOption === 'BUILD'
                    ? 'bg-blue-600/15 border-blue-500/60 ring-1 ring-blue-500/40 text-white shadow-[0_0_20px_rgba(59,130,246,0.25)]'
                    : 'bg-white/[0.02] border-white/[0.08] hover:border-white/[0.2] hover:bg-white/[0.04]'
                }`}
              >
                <div className='flex items-start justify-between mb-4'>
                  <div className={`p-3 rounded-xl ${resumeOption === 'BUILD' ? 'bg-blue-500/20 text-blue-400' : 'bg-white/[0.05] text-[#8D96AA]'}`}>
                    <Sparkles className='w-6 h-6' />
                  </div>
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    resumeOption === 'BUILD' ? 'border-blue-400 bg-blue-500' : 'border-white/[0.2]'
                  }`}>
                    {resumeOption === 'BUILD' && <div className='w-2 h-2 rounded-full bg-white' />}
                  </div>
                </div>
                <div>
                  <h4 className='text-base font-bold text-white mb-1.5'>Build My Resume</h4>
                  <p className='text-xs text-[#8D96AA] leading-relaxed'>
                    Create a structured resume with Career Engine from scratch.
                  </p>
                </div>
              </div>

              {/* Option 3: Skip */}
              <div
                onClick={() => setResumeOption('SKIP')}
                className={`p-6 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between relative group ${
                  resumeOption === 'SKIP'
                    ? 'bg-blue-600/15 border-blue-500/60 ring-1 ring-blue-500/40 text-white shadow-[0_0_20px_rgba(59,130,246,0.25)]'
                    : 'bg-white/[0.02] border-white/[0.08] hover:border-white/[0.2] hover:bg-white/[0.04]'
                }`}
              >
                <div className='flex items-start justify-between mb-4'>
                  <div className={`p-3 rounded-xl ${resumeOption === 'SKIP' ? 'bg-blue-500/20 text-blue-400' : 'bg-white/[0.05] text-[#8D96AA]'}`}>
                    <BookOpen className='w-6 h-6' />
                  </div>
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    resumeOption === 'SKIP' ? 'border-blue-400 bg-blue-500' : 'border-white/[0.2]'
                  }`}>
                    {resumeOption === 'SKIP' && <div className='w-2 h-2 rounded-full bg-white' />}
                  </div>
                </div>
                <div>
                  <h4 className='text-base font-bold text-white mb-1.5'>Skip for Now</h4>
                  <p className='text-xs text-[#8D96AA] leading-relaxed'>
                    Configure and upload your resume later from your dashboard.
                  </p>
                </div>
              </div>

            </div>

            {/* Expansive Full-Width Dropzone Area */}
            {resumeOption === 'UPLOAD' && (
              <div className='space-y-4 pt-2'>
                <label className='flex flex-col items-center justify-center min-h-[220px] w-full border-2 border-dashed border-white/[0.15] hover:border-blue-500/60 rounded-3xl cursor-pointer bg-white/[0.015] hover:bg-white/[0.035] transition-all p-8 text-center group'>
                  <div className='p-4 bg-blue-500/10 text-blue-400 rounded-2xl mb-4 group-hover:scale-110 group-hover:bg-blue-500/20 transition-all'>
                    <Upload className='w-8 h-8' />
                  </div>
                  <span className='text-sm sm:text-base font-bold text-white mb-1'>
                    {resumeFile ? resumeFile.name : 'Click to select your PDF or DOCX resume (Max 10MB)'}
                  </span>
                  <span className='text-xs text-[#8D96AA]'>
                    {isUploadingResume ? 'Analyzing document structure with Gemini AI...' : 'Supports PDF and Word formats • Instant skill extraction'}
                  </span>
                  <input
                    type='file'
                    accept='.pdf,.docx,.doc'
                    onChange={handleResumeFileUpload}
                    className='hidden'
                    disabled={isUploadingResume}
                  />
                </label>

                {isUploadingResume && (
                  <div className='flex items-center justify-center space-x-2 text-xs font-mono text-blue-400 pt-2'>
                    <Spinner size='sm' />
                    <span>Extracting skills & experience data...</span>
                  </div>
                )}

                {uploadedResumeSummary && (
                  <div className='p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2'>
                    <CheckCircle2 className='w-4 h-4 shrink-0' />
                    <span>{uploadedResumeSummary}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Bottom Actions Bar */}
        <div className='flex items-center justify-between pt-6 w-full'>
          <button
            type='button'
            onClick={handleBack}
            disabled={step === 1 || isSaving}
            className='h-12 px-6 rounded-2xl border border-white/[0.1] hover:bg-white/[0.05] text-slate-300 hover:text-white text-xs sm:text-sm font-semibold flex items-center gap-2 transition-colors disabled:opacity-40'
          >
            <ArrowLeft className='w-4 h-4' />
            <span>Back</span>
          </button>
          
          <button
            type='button'
            onClick={handleContinue}
            disabled={isSaving}
            className='h-12 px-8 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-[0_0_20px_rgba(59,130,246,0.35)] hover:shadow-[0_0_30px_rgba(59,130,246,0.55)] transition-all flex items-center gap-2'
          >
            <span>{step === totalSteps ? 'Complete Assessment' : 'Continue'}</span>
            {step === totalSteps ? <CheckCircle2 className='w-4 h-4' /> : <ArrowRight className='w-4 h-4' />}
          </button>
        </div>
      </div>
    </div>
  );
};