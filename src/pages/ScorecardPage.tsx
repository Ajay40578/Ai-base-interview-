import React, { useEffect, useState } from 'react';
import {
  Award,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Target,
  CalendarCheck,
  Download,
  Share2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Zap,
  ArrowRight
} from 'lucide-react';
import { Interview } from '../types';
import { api } from '../services/api';

// Zero-dependency canvas confetti burst
function fireConfetti() {
  if (typeof window === 'undefined') return;
  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.inset = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '9999';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    document.body.removeChild(canvas);
    return;
  }

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles: {
    x: number;
    y: number;
    vx: number;
    vy: number;
    color: string;
    size: number;
    rotation: number;
    vRot: number;
    opacity: number;
  }[] = [];

  const colors = ['#2563EB', '#4F46E5', '#7C3AED', '#06B6D4', '#10B981', '#F59E0B', '#EF4444'];

  for (let i = 0; i < 90; i++) {
    particles.push({
      x: canvas.width / 2,
      y: canvas.height * 0.45,
      vx: (Math.random() - 0.5) * 14,
      vy: (Math.random() - 0.8) * 16,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 8 + 4,
      rotation: Math.random() * 360,
      vRot: (Math.random() - 0.5) * 10,
      opacity: 1,
    });
  }

  let animationFrameId: number;
  let startTime = Date.now();

  function render() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const elapsed = Date.now() - startTime;

    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.35; // gravity
      p.rotation += p.vRot;
      p.opacity = Math.max(0, 1 - elapsed / 2500);

      ctx.save();
      ctx.globalAlpha = p.opacity;
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      ctx.restore();
    });

    if (elapsed < 2500) {
      animationFrameId = requestAnimationFrame(render);
    } else {
      if (document.body.contains(canvas)) {
        document.body.removeChild(canvas);
      }
    }
  }

  render();
}

interface ScorecardPageProps {
  interviewId: string;
  onRetake: () => void;
  onNavigate: (page: string) => void;
}

export const ScorecardPage: React.FC<ScorecardPageProps> = ({
  interviewId,
  onRetake,
  onNavigate,
}) => {
  const [interview, setInterview] = useState<Interview | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(0);

  useEffect(() => {
    loadInterviewScorecard();
  }, [interviewId]);

  const loadInterviewScorecard = async () => {
    try {
      setLoading(true);
      const data = await api.finalizeInterview(interviewId);
      setInterview(data);

      if (data.score >= 75) {
        try {
          fireConfetti();
        } catch {}
      }
    } catch (err) {
      console.error('Failed to load scorecard:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !interview) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center animate-pulse">
        <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4"></div>
        <div className="h-6 bg-slate-200 rounded w-1/3 mx-auto"></div>
      </div>
    );
  }

  const categoryScores = interview.category_scores || {
    technical_knowledge: 82,
    communication: 74,
    problem_solving: 80,
    role_knowledge: 76,
    answer_relevance: 79
  };

  const categories = [
    { label: 'Technical Knowledge', score: categoryScores.technical_knowledge, color: 'bg-blue-600' },
    { label: 'Communication', score: categoryScores.communication, color: 'bg-indigo-600' },
    { label: 'Problem Solving', score: categoryScores.problem_solving, color: 'bg-purple-600' },
    { label: 'Role Knowledge', score: categoryScores.role_knowledge, color: 'bg-emerald-600' },
    { label: 'Answer Relevance', score: categoryScores.answer_relevance, color: 'bg-amber-600' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Banner / Summary */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-blue-200 text-xs font-semibold mb-3 border border-white/15">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>Official Interview Scorecard</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              {interview.role}
            </h1>
            <p className="mt-1 text-sm text-slate-300">
              Completed on{' '}
              {new Date(interview.completed_at || interview.started_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}{' '}
              • Duration: ~{interview.duration_minutes || 25} minutes • {interview.total_questions} Questions
            </p>
          </div>

          {/* Big Score Dial */}
          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 shrink-0">
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-black text-white leading-none">
                {interview.score}
                <span className="text-xl text-blue-300 font-semibold">/100</span>
              </div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-blue-200 mt-1">
                Overall Score
              </div>
            </div>

            <div className="border-l border-white/20 pl-4 text-left">
              <span className="text-[10px] text-slate-300 uppercase tracking-wider font-bold block">
                Performance
              </span>
              <span
                className={`text-sm font-extrabold px-2.5 py-0.5 rounded-full inline-block mt-0.5 ${
                  interview.overall_verdict === 'Excellent'
                    ? 'bg-emerald-500 text-white'
                    : interview.overall_verdict === 'Good'
                    ? 'bg-blue-500 text-white'
                    : 'bg-amber-500 text-slate-900'
                }`}
              >
                {interview.overall_verdict || 'Good'}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Next Step CTAs */}
        <div className="mt-8 pt-6 border-t border-white/15 flex flex-wrap gap-3">
          <button
            onClick={() => onNavigate('skill-gap')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
          >
            <Target className="w-4 h-4" />
            <span>Analyze Skill Gaps</span>
          </button>
          <button
            onClick={() => onNavigate('improvement-plan')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/20 cursor-pointer"
          >
            <CalendarCheck className="w-4 h-4" />
            <span>View 7-Day Improvement Plan</span>
          </button>
          <button
            onClick={onRetake}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all border border-white/20 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retake Interview</span>
          </button>
        </div>
      </div>

      {/* Category Scores & Radar Bar Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900">Category Competency Scores</h3>
          <p className="text-xs text-slate-500">Multifactor breakdown based on industrial rubrics</p>

          <div className="space-y-3.5 pt-2">
            {categories.map((cat, i) => (
              <div key={i} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-700">{cat.label}</span>
                  <span className="text-slate-900 font-bold">{cat.score}%</span>
                </div>
                <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${cat.score}%` }}
                    className={`h-full ${cat.color} rounded-full transition-all duration-700`}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Strengths & Weaknesses Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Key AI Takeaways</h3>
            <p className="text-xs text-slate-500">Synthesized insights across your submitted answers</p>

            <div className="mt-4 space-y-3">
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs">
                <div className="font-bold text-emerald-900 flex items-center gap-1.5 mb-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Top Strengths</span>
                </div>
                <ul className="space-y-1 text-emerald-800 text-[11px]">
                  {(interview.top_strengths || []).map((s, idx) => (
                    <li key={idx} className="flex items-start gap-1">
                      <span className="font-bold">•</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs">
                <div className="font-bold text-amber-900 flex items-center gap-1.5 mb-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Top Improvement Areas</span>
                </div>
                <ul className="space-y-1 text-amber-900 text-[11px]">
                  {(interview.top_weaknesses || []).map((w, idx) => (
                    <li key={idx} className="flex items-start gap-1">
                      <span className="font-bold">•</span>
                      <span>{w}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Target Role Readiness:</span>
            <span className="font-bold text-blue-700">76% Ready for Screenings</span>
          </div>
        </div>
      </div>

      {/* Question-By-Question Detailed Transcript */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Question-by-Question Review</h3>
            <p className="text-xs text-slate-500">
              Inspect your answers against expected key points and coaching feedback
            </p>
          </div>
          <span className="text-xs font-bold bg-slate-100 text-slate-700 px-3 py-1 rounded-full">
            {interview.answers.length} Answers Evaluated
          </span>
        </div>

        <div className="space-y-4">
          {interview.answers.map((ans, idx) => {
            const isExpanded = expandedQuestion === idx;
            return (
              <div
                key={ans.id}
                className="border border-slate-200 rounded-2xl overflow-hidden transition-all"
              >
                <div
                  onClick={() => setExpandedQuestion(isExpanded ? null : idx)}
                  className="p-4 bg-slate-50/70 hover:bg-slate-100/70 cursor-pointer flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{ans.question_text}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-bold text-slate-500 uppercase bg-slate-200/70 px-1.5 py-0.2 rounded">
                          {ans.category}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-500">
                          Difficulty: {ans.difficulty}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-sm font-black text-blue-600">
                      {ans.evaluation.overall_score}/100
                    </span>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </div>
                </div>

                {isExpanded && (
                  <div className="p-5 border-t border-slate-200 bg-white space-y-4 text-xs">
                    {/* Candidate Answer */}
                    <div>
                      <h5 className="font-bold text-slate-700 mb-1">Your Submitted Answer:</h5>
                      <p className="p-3 bg-slate-50 rounded-xl text-slate-800 leading-relaxed font-mono text-[11px] border border-slate-200/60">
                        {ans.answer_text}
                      </p>
                    </div>

                    {/* Expected Key Points */}
                    <div>
                      <h5 className="font-bold text-slate-700 mb-1">Expected Key Points:</h5>
                      <ul className="list-disc list-inside space-y-1 text-slate-600 pl-1 text-[11px]">
                        {ans.evaluation.expected_points.map((pt, pIdx) => (
                          <li key={pIdx}>{pt}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Criteria breakdown */}
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2">
                      <div className="bg-slate-50 p-2 rounded-lg text-center">
                        <div className="text-[9px] text-slate-400 uppercase font-bold">Accuracy</div>
                        <div className="font-bold text-slate-800">{ans.evaluation.technical_accuracy}%</div>
                      </div>
                      <div className="bg-slate-50 p-2 rounded-lg text-center">
                        <div className="text-[9px] text-slate-400 uppercase font-bold">Relevance</div>
                        <div className="font-bold text-slate-800">{ans.evaluation.relevance}%</div>
                      </div>
                      <div className="bg-slate-50 p-2 rounded-lg text-center">
                        <div className="text-[9px] text-slate-400 uppercase font-bold">Completeness</div>
                        <div className="font-bold text-slate-800">{ans.evaluation.completeness}%</div>
                      </div>
                      <div className="bg-slate-50 p-2 rounded-lg text-center">
                        <div className="text-[9px] text-slate-400 uppercase font-bold">Communication</div>
                        <div className="font-bold text-slate-800">{ans.evaluation.communication}%</div>
                      </div>
                      <div className="bg-slate-50 p-2 rounded-lg text-center col-span-2 sm:col-span-1">
                        <div className="text-[9px] text-slate-400 uppercase font-bold">Clarity</div>
                        <div className="font-bold text-slate-800">{ans.evaluation.clarity}%</div>
                      </div>
                    </div>

                    {/* Coaching Suggestion */}
                    {ans.evaluation.improvement_suggestions.length > 0 && (
                      <div className="p-3 bg-blue-50/70 border border-blue-200/60 rounded-xl text-blue-900">
                        <span className="font-bold">Coaching Advice: </span>
                        <span>{ans.evaluation.improvement_suggestions[0]}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
