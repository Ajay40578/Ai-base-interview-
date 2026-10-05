import React from 'react';
import {
  BrainCircuit,
  PlayCircle,
  LayoutDashboard,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Target,
  FileCheck2,
  CalendarCheck,
  ShieldCheck,
  Zap,
  Code2,
  Layers,
  ChevronRight,
  Users
} from 'lucide-react';

interface LandingPageProps {
  onStartInterview: () => void;
  onViewDashboard: () => void;
  onTryDemo: () => void;
  onNavigate: (page: string) => void;
  onStartWithGoogle?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartInterview,
  onViewDashboard,
  onTryDemo,
  onNavigate,
  onStartWithGoogle,
}) => {
  const features = [
    {
      icon: BrainCircuit,
      color: 'from-blue-500 to-indigo-600',
      title: '1. AI Mock Interviews',
      desc: 'Simulate realistic high-pressure tech interviews with adaptive difficulty that reacts to your performance.'
    },
    {
      icon: Target,
      color: 'from-purple-500 to-indigo-600',
      title: '2. Role-Based Questions',
      desc: 'Tailored question banks for Java Backend, Full Stack, Frontend, Data, and System Design with exact rubrics.'
    },
    {
      icon: Zap,
      color: 'from-amber-500 to-orange-600',
      title: '3. Instant Answer Evaluation',
      desc: 'Comprehensive multi-criteria scoring: technical accuracy, relevance, completeness, clarity, and communication.'
    },
    {
      icon: TrendingUp,
      color: 'from-emerald-500 to-teal-600',
      title: '4. Skill Gap Analysis',
      desc: 'Automated breakdown of Strong skills vs Needs Improvement vs Critical gaps (e.g. Exception handling, Spring Security).'
    },
    {
      icon: FileCheck2,
      color: 'from-blue-600 to-cyan-600',
      title: '5. Performance Analytics',
      desc: 'Track scores over time, category radar charts, streak counters, and detailed post-interview scorecards.'
    },
    {
      icon: CalendarCheck,
      color: 'from-rose-500 to-pink-600',
      title: '6. Personalized 7-Day Plan',
      desc: 'Dynamic 7-day study roadmap designed specifically around missed concepts from your recent mock session.'
    }
  ];

  const workflowSteps = [
    { step: '01', title: 'Choose Role', desc: 'Select target position, experience tier, skills & difficulty level.' },
    { step: '02', title: 'Practice', desc: 'Answer realistic questions under realistic timed interview room pressure.' },
    { step: '03', title: 'AI Evaluation', desc: 'Get rubric-based score /100, specific strengths, and missing points.' },
    { step: '04', title: 'Improve', desc: 'Follow your targeted 7-Day Improvement Plan with focused drills.' },
    { step: '05', title: 'Retake', desc: 'Re-enter adaptive simulation and track your score climb towards mastery.' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-16 sm:pb-28 border-b border-slate-200/80 bg-gradient-to-b from-white via-slate-50 to-slate-100">
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Hackathon Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-semibold mb-6 shadow-xs animate-in fade-in duration-300">
            <span className="flex h-2 w-2 rounded-full bg-blue-600"></span>
            <span>College Hackathon Project: AI-based Mock Interview Simulator</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight max-w-4xl mx-auto leading-[1.12]">
            Your AI-Powered <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Interview Coach
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
            Practice realistic interviews, receive instant feedback, identify skill gaps, and improve your interview performance.
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onStartInterview}
              className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-base bg-blue-600 text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all cursor-pointer"
            >
              <PlayCircle className="w-5 h-5" />
              <span>Start Mock Interview</span>
            </button>

            {onStartWithGoogle && (
              <button
                onClick={onStartWithGoogle}
                className="flex items-center gap-2.5 px-5 py-3.5 rounded-xl font-bold text-base bg-white text-slate-800 border-2 border-slate-200 hover:border-blue-400 hover:bg-slate-50 transition-all shadow-xs cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
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
                <span>Continue with Google</span>
              </button>
            )}

            <button
              onClick={onViewDashboard}
              className="flex items-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-base bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 transition-all shadow-xs cursor-pointer"
            >
              <LayoutDashboard className="w-5 h-5 text-slate-400" />
              <span>View Dashboard</span>
            </button>

            <button
              onClick={onTryDemo}
              className="flex items-center gap-2 px-5 py-3.5 rounded-xl font-bold text-base bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100 transition-all shadow-xs cursor-pointer"
            >
              <Sparkles className="w-5 h-5 text-amber-600" />
              <span>Try Demo (Alex Kumar)</span>
            </button>
          </div>

          {/* Sub-hero feature badges */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Adaptive Difficulty Engine
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-blue-500" />
              Spring Boot Architecture Blueprint
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-purple-500" />
              Instant Rubric Scorecard /100
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-indigo-500" />
              7-Day Personalized Improvement Plan
            </span>
          </div>

          {/* Quick Preview Card */}
          <div className="mt-14 max-w-4xl mx-auto bg-white rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-200/80 text-left">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-rose-400"></div>
                <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                <span className="text-xs font-mono text-slate-400 ml-2">InterviewAI / Room / Java Backend Developer</span>
              </div>
              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100">
                Live Simulator Preview
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-6">
              {/* Question Preview */}
              <div className="md:col-span-5 bg-slate-50 rounded-xl p-4 border border-slate-200/70">
                <div className="text-[11px] font-bold text-blue-600 uppercase tracking-wider mb-1">
                  Question 1 of 5 • Java Collections
                </div>
                <h4 className="text-sm font-bold text-slate-900 leading-snug">
                  "What is the difference between ArrayList and LinkedList in Java?"
                </h4>
                <div className="mt-3 text-xs text-slate-500 space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                    <span>Evaluates indexing complexity O(1) vs O(n)</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                    <span>Memory overhead of node pointers</span>
                  </div>
                </div>
              </div>

              {/* Evaluation Preview */}
              <div className="md:col-span-7 bg-blue-50/50 rounded-xl p-4 border border-blue-200/60">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-700">Instant AI Answer Evaluation</span>
                  <span className="text-xs font-extrabold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                    Score: 85/100
                  </span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="text-emerald-700 bg-emerald-50 px-2.5 py-1.5 rounded border border-emerald-100">
                    ✓ <strong>Strength:</strong> Correctly identified dynamic array vs doubly linked list.
                  </div>
                  <div className="text-amber-800 bg-amber-50 px-2.5 py-1.5 rounded border border-amber-100">
                    ⚠ <strong>Improvement:</strong> Mention node pointer memory overhead.
                  </div>
                  <div className="text-indigo-700 font-medium">
                    ⚡ <strong>Adaptive Adjustment:</strong> Score &gt;= 80 → Next question escalated to Medium!
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-blue-600 mb-2">
            Core Capabilities
          </h2>
          <h3 className="text-3xl sm:text-4xl font-black text-slate-900">
            Engineered for Comprehensive Interview Readiness
          </h3>
          <p className="mt-3 text-slate-600 text-sm sm:text-base">
            Every feature is designed to replace stressful guesswork with measurable, data-driven mastery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all group"
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${feat.color} text-white flex items-center justify-center mb-5 shadow-sm group-hover:scale-105 transition-transform`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-2">{feat.title}</h4>
                <p className="text-sm text-slate-600 leading-relaxed">{feat.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5-Step Workflow Section */}
      <section className="py-20 bg-slate-100/70 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-blue-600 mb-2">
              Continuous Improvement Loop
            </h2>
            <h3 className="text-3xl font-black text-slate-900">
              The InterviewAI 5-Stage Workflow
            </h3>
            <p className="text-sm text-slate-600 mt-2">
              Choose Role → Practice → AI Evaluation → Improve → Retake
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {workflowSteps.map((step, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl p-5 border border-slate-200 relative shadow-xs"
              >
                <div className="text-2xl font-black text-blue-600/30 mb-2 font-mono">{step.step}</div>
                <h4 className="text-base font-bold text-slate-900 mb-1.5">{step.title}</h4>
                <p className="text-xs text-slate-600 leading-normal">{step.desc}</p>
                {idx < workflowSteps.length - 1 && (
                  <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                    <ChevronRight className="w-5 h-5 text-slate-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* "How InterviewAI Works" Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-400/30 mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Under The Hood</span>
              </div>
              <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                How InterviewAI Evaluates & Adapts in Real-Time
              </h3>
              <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed">
                Traditional interview prep relies on static flashcards. InterviewAI assesses candidate responses against industrial scoring rubrics, identifies missed edge cases, and adjusts question difficulty dynamically.
              </p>

              <div className="mt-6 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-blue-600/50 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-blue-300" />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-white">Adaptive Difficulty Engine</h5>
                    <p className="text-xs text-slate-300">
                      Scores ≥ 80 trigger harder architectural questions; scores &lt; 50 shift back to fundamental concepts.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-purple-600/50 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-purple-300" />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-white">Deterministic + Gemini API Hybrid</h5>
                    <p className="text-xs text-slate-300">
                      Supports transparent deterministic evaluation rubrics or cloud-native Gemini AI models without exposing API keys.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-emerald-600/50 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-white">Spring Boot Ready Architecture</h5>
                    <p className="text-xs text-slate-300">
                      Fully documented controller, service, repository, and DTO layers ready for Java 17 + Spring Boot backend deployment.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <button
                  onClick={onTryDemo}
                  className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-sm text-white transition-colors cursor-pointer"
                >
                  Explore as Alex Kumar
                </button>
                <button
                  onClick={() => onNavigate('spring-boot')}
                  className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 font-semibold text-sm text-white transition-colors border border-white/20 cursor-pointer"
                >
                  View Spring Boot Spec
                </button>
              </div>
            </div>

            {/* Architecture Card */}
            <div className="bg-slate-800/90 rounded-2xl p-6 border border-slate-700/80 font-mono text-xs shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-700">
                <span className="text-slate-400">system-architecture.json</span>
                <span className="text-emerald-400 text-[10px] bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                  Java 17 Compatible
                </span>
              </div>
              <pre className="mt-4 text-slate-300 overflow-x-auto leading-relaxed">
{`{
  "application": "InterviewAI",
  "client": "React 19 + TypeScript + Tailwind",
  "backend": "Spring Boot 3.3.x (Java 17 LTS)",
  "database": "PostgreSQL (Schema: users, interviews, answers)",
  "evaluation_engine": {
    "adaptive_mode": true,
    "scoring_criteria": [
      "technical_accuracy",
      "relevance",
      "completeness",
      "clarity"
    ]
  },
  "endpoints": [
    "POST /api/interviews",
    "POST /api/interviews/{id}/answers",
    "GET  /api/interviews/{id}/results",
    "GET  /api/skills/gaps",
    "GET  /api/improvement-plan"
  ]
}`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-16 text-center max-w-4xl mx-auto px-4">
        <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
          Ready to Ace Your Next Technical Interview?
        </h3>
        <p className="mt-2 text-slate-600 text-sm">
          No sign up required for judges — explore Alex Kumar’s pre-computed performance in 1-click.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            onClick={onStartInterview}
            className="px-6 py-3 rounded-xl font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-md transition-colors"
          >
            Start Mock Interview
          </button>
          <button
            onClick={onTryDemo}
            className="px-6 py-3 rounded-xl font-bold bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100 transition-colors"
          >
            Launch Judge Demo
          </button>
        </div>
      </section>
    </div>
  );
};
