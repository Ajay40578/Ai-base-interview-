import React, { useState } from 'react';
import {
  PlayCircle,
  Briefcase,
  Sliders,
  Sparkles,
  Check,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  HelpCircle,
  Zap,
  Layers,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';
import { RoleType, ExperienceLevel, InterviewType, DifficultyLevel, User } from '../types';
import { api } from '../services/api';

interface CreateInterviewPageProps {
  onInterviewCreated: (interviewId: string, questions: any[]) => void;
  onCancel: () => void;
  currentUser?: User | null;
  onLoginWithGoogle?: () => void;
}

export const CreateInterviewPage: React.FC<CreateInterviewPageProps> = ({
  onInterviewCreated,
  onCancel,
  currentUser,
  onLoginWithGoogle,
}) => {
  const [role, setRole] = useState<RoleType | string>('Java Backend Developer');
  const [customRole, setCustomRole] = useState('');
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>('Fresher');
  const [interviewType, setInterviewType] = useState<InterviewType>('Technical');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('Medium');
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([
    'Java',
    'Spring Boot',
    'SQL',
    'OOP',
    'REST API'
  ]);
  const [isAdaptive, setIsAdaptive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const availableRoles: { name: RoleType | 'Custom Role'; desc: string }[] = [
    { name: 'Java Backend Developer', desc: 'Java 17, Spring Boot, JPA, SQL, Distributed Architecture' },
    { name: 'Full Stack Developer', desc: 'React, Node/Java, REST APIs, Databases & State' },
    { name: 'Frontend Developer', desc: 'React, TypeScript, CSS Architecture, Web Performance' },
    { name: 'Data Analyst', desc: 'Advanced SQL, Python, Statistical Modeling, BI Dashboards' },
    { name: 'AI/ML Engineer', desc: 'LLMs, PyTorch, Embeddings, Feature Engineering' },
    { name: 'Software Engineer', desc: 'Core DSA, System Fundamentals, OS, OOP, Problem Solving' },
    { name: 'Custom Role', desc: 'Specify your tailored target job title' },
  ];

  const skillOptions = [
    'Java',
    'Spring Boot',
    'SQL',
    'OOP',
    'REST API',
    'DSA',
    'PostgreSQL',
    'Hibernate/JPA',
    'React',
    'Docker',
    'Microservices',
    'Concurrency & Threads',
    'System Design',
    'Git'
  ];

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      if (selectedSkills.length > 1) {
        setSelectedSkills(selectedSkills.filter((s) => s !== skill));
      }
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleGenerate = async () => {
    setError(null);
    const finalRole = role === 'Custom Role' ? customRole.trim() : role;
    if (!finalRole) {
      setError('Please select an interview role.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.createInterview({
        role: finalRole,
        experienceLevel,
        interviewType,
        difficulty,
        totalQuestions: questionCount,
        skills: selectedSkills,
        isAdaptive,
      });

      onInterviewCreated(res.interview.id, res.questions);
    } catch (err: any) {
      setError(err?.message || 'Failed to generate interview room. Please retry.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={onCancel}
          className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 mb-3"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Dashboard</span>
        </button>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
            Interview Configuration Wizard
          </span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-1">
          Create Your Mock Interview
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Configure role, topics, and difficulty to generate an adaptive AI mock session.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span className="font-medium">{error}</span>
        </div>
      )}

      {/* Candidate Google Account Identity Card */}
      <div className="mb-6 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border border-blue-200/80 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white border border-blue-200 flex items-center justify-center shadow-xs">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-800">
                Candidate: {currentUser ? currentUser.name : 'Guest User'}
              </span>
              {currentUser?.auth_provider === 'google' && (
                <span className="text-[10px] font-bold bg-blue-600 text-white px-2 py-0.2 rounded-full">
                  Google Verified
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500">
              {currentUser ? currentUser.email : 'Not signed in'} • Session answers will be evaluated and added to your scorecard.
            </p>
          </div>
        </div>

        {onLoginWithGoogle && (
          <button
            type="button"
            onClick={onLoginWithGoogle}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white text-slate-700 hover:bg-slate-50 border border-slate-300 transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <span>{currentUser?.auth_provider === 'google' ? 'Switch Google Account' : 'Sign In with Google'}</span>
          </button>
        )}
      </div>

      <div className="space-y-8 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
        {/* Step 1: Job Role */}
        <div>
          <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-3">
            Step 1: Select Target Job Role
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {availableRoles.map((r) => {
              const isSelected = role === r.name;
              return (
                <div
                  key={r.name}
                  onClick={() => setRole(r.name)}
                  className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/70 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-bold ${isSelected ? 'text-blue-900' : 'text-slate-800'}`}>
                      {r.name}
                    </span>
                    {isSelected && <Check className="w-4 h-4 text-blue-600" />}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 leading-snug">{r.desc}</p>
                </div>
              );
            })}
          </div>

          {role === 'Custom Role' && (
            <div className="mt-3">
              <input
                type="text"
                value={customRole}
                onChange={(e) => setCustomRole(e.target.value)}
                placeholder="Enter custom role (e.g. Cloud DevOps Engineer, Android Developer)"
                className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          )}
        </div>

        {/* Step 2: Experience Level */}
        <div>
          <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-3">
            Step 2: Experience Level
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {(['Fresher', 'Beginner', 'Intermediate', 'Advanced'] as ExperienceLevel[]).map((lvl) => {
              const isSelected = experienceLevel === lvl;
              return (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setExperienceLevel(lvl)}
                  className={`py-3 px-3 rounded-xl border text-center transition-all cursor-pointer ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold shadow-xs'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="text-xs font-bold">{lvl}</div>
                  <div className="text-[10px] text-slate-500">
                    {lvl === 'Fresher' ? '0–1 yrs (Grad)' : lvl === 'Beginner' ? '1–2 yrs' : lvl === 'Intermediate' ? '2–4 yrs' : '5+ yrs'}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 3 & Step 4: Interview Type & Difficulty */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Step 3: Type */}
          <div>
            <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-2">
              Step 3: Interview Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(['Technical', 'HR', 'Behavioral', 'Mixed'] as InterviewType[]).map((t) => {
                const isSelected = interviewType === t;
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setInterviewType(t)}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-900 shadow-xs'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 4: Difficulty */}
          <div>
            <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-2">
              Step 4: Starting Difficulty
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Easy', 'Medium', 'Hard'] as DifficultyLevel[]).map((d) => {
                const isSelected = difficulty === d;
                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDifficulty(d)}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? d === 'Hard'
                          ? 'border-rose-600 bg-rose-50 text-rose-900'
                          : d === 'Medium'
                          ? 'border-amber-600 bg-amber-50 text-amber-900'
                          : 'border-emerald-600 bg-emerald-50 text-emerald-900'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {d}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Step 5: Question Count */}
        <div>
          <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-2">
            Step 5: Number of Questions
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[5, 10, 15].map((count) => {
              const isSelected = questionCount === count;
              return (
                <button
                  key={count}
                  type="button"
                  onClick={() => setQuestionCount(count)}
                  className={`py-3 px-4 rounded-xl border text-center transition-all cursor-pointer ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold shadow-xs'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="text-base font-extrabold">{count} Questions</div>
                  <div className="text-[10px] text-slate-500">
                    {count === 5 ? '~15 mins (Quick Demo)' : count === 10 ? '~30 mins (Standard)' : '~45 mins (Comprehensive)'}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 6: Skills & Topics (Multi-Select) */}
        <div>
          <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-2">
            Step 6: Skills & Topics ({selectedSkills.length} Selected)
          </label>
          <div className="flex flex-wrap gap-2">
            {skillOptions.map((skill) => {
              const isSelected = selectedSkills.includes(skill);
              return (
                <button
                  key={skill}
                  type="button"
                  onClick={() => toggleSkill(skill)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3" />}
                  <span>{skill}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Adaptive Interview Feature Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-50 via-purple-50 to-blue-50 border border-indigo-200/80 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-purple-600" />
              <span className="text-xs font-extrabold text-purple-900 uppercase tracking-wider">
                Unique Feature: Adaptive Interview Engine
              </span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              InterviewAI adjusts subsequent question difficulty in real time based on your performance:
              <br />
              <span className="font-semibold text-emerald-800">• Score &ge; 80</span>: Escalates to a harder question.
              <br />
              <span className="font-semibold text-amber-800">• Score 50–79</span>: Maintains difficulty level.
              <br />
              <span className="font-semibold text-rose-800">• Score &lt; 50</span>: Provides a simpler follow-up concept review.
            </p>
          </div>

          <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
            <input
              type="checkbox"
              checked={isAdaptive}
              onChange={(e) => setIsAdaptive(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
          </label>
        </div>

        {/* Submit Generate Button */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading}
            className="px-6 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Generating Interview Room...</span>
              </>
            ) : (
              <>
                <span>Generate Interview</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
