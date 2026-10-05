import React, { useState, useEffect } from 'react';
import {
  Target,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ArrowRight,
  BookOpen,
  Sparkles,
  PlayCircle,
  ExternalLink,
  Layers,
  ShieldAlert
} from 'lucide-react';
import { SkillGapAnalysis } from '../types';
import { api } from '../services/api';

interface SkillGapPageProps {
  onStartInterviewWithRole: (role: string, skill?: string) => void;
  onNavigate: (page: string) => void;
}

export const SkillGapPage: React.FC<SkillGapPageProps> = ({
  onStartInterviewWithRole,
  onNavigate,
}) => {
  const [data, setData] = useState<SkillGapAnalysis | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGaps();
  }, []);

  const loadGaps = async () => {
    try {
      setLoading(true);
      const res = await api.getSkillGaps();
      setData(res);
    } catch (err) {
      console.error('Failed to load skill gaps:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !data) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center animate-pulse">
        <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4"></div>
        <div className="h-6 bg-slate-200 rounded w-1/3 mx-auto"></div>
      </div>
    );
  }

  const strongSkills = data.skills.filter((s) => s.status === 'Strong');
  const needsImprovementSkills = data.skills.filter((s) => s.status === 'Needs Improvement');
  const criticalSkills = data.skills.filter((s) => s.status === 'Critical');

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-blue-200 text-xs font-semibold mb-2">
            <Target className="w-3.5 h-3.5 text-blue-300" />
            <span>Role Competency Analysis</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Skill Gap Matrix: {data.role}
          </h1>
          <p className="mt-1 text-sm text-blue-100 max-w-xl">
            Synthesized from your recent mock interview answers, profile assessment, and benchmark expectations for entry-level engineering roles.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/20 text-center shrink-0">
          <div className="text-4xl font-black text-white">{data.overall_readiness}%</div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-blue-200 mt-0.5">
            Role Readiness Score
          </div>
        </div>
      </div>

      {/* 3-Column Categorized Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Strong Skills */}
        <div className="bg-white rounded-3xl p-6 border border-emerald-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-emerald-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-extrabold text-slate-900">Strong Proficiency</h3>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              {strongSkills.length} Skills
            </span>
          </div>

          <div className="space-y-3">
            {strongSkills.map((item, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-100 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{item.skill}</span>
                  <span className="text-xs font-black text-emerald-700">{item.proficiency_score}%</span>
                </div>
                <div className="h-1.5 w-full bg-emerald-200 rounded-full overflow-hidden">
                  <div style={{ width: `${item.proficiency_score}%` }} className="h-full bg-emerald-600 rounded-full"></div>
                </div>
                <p className="text-[10px] text-emerald-800 leading-tight">
                  {item.recommended_actions[0]}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Needs Improvement */}
        <div className="bg-white rounded-3xl p-6 border border-amber-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-amber-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-extrabold text-slate-900">Needs Improvement</h3>
            </div>
            <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full">
              {needsImprovementSkills.length} Skills
            </span>
          </div>

          <div className="space-y-3">
            {needsImprovementSkills.map((item, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-amber-50/50 border border-amber-100 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{item.skill}</span>
                  <span className="text-xs font-black text-amber-700">{item.proficiency_score}%</span>
                </div>
                <div className="h-1.5 w-full bg-amber-200 rounded-full overflow-hidden">
                  <div style={{ width: `${item.proficiency_score}%` }} className="h-full bg-amber-500 rounded-full"></div>
                </div>
                <p className="text-[10px] text-amber-900 leading-tight">
                  {item.recommended_actions[0]}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Critical Skills */}
        <div className="bg-white rounded-3xl p-6 border border-rose-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-rose-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-extrabold text-slate-900">Critical Gaps</h3>
            </div>
            <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full">
              {criticalSkills.length} Action Items
            </span>
          </div>

          <div className="space-y-3">
            {criticalSkills.map((item, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-rose-50/60 border border-rose-100 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{item.skill}</span>
                  <span className="text-xs font-black text-rose-600">{item.proficiency_score}%</span>
                </div>
                <div className="h-1.5 w-full bg-rose-200 rounded-full overflow-hidden">
                  <div style={{ width: `${item.proficiency_score}%` }} className="h-full bg-rose-600 rounded-full"></div>
                </div>
                <p className="text-[10px] text-rose-800 leading-tight">
                  {item.recommended_actions[0]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommended Practice Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Recommended Practice Plan</h3>
          <p className="text-xs text-slate-500">
            Tailored drills specifically generated to close your highest priority gaps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {data.recommended_practice.map((item, idx) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between group bg-slate-50/50"
            >
              <div>
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center mb-3">
                  0{idx + 1}
                </div>
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{item.detail}</p>
              </div>

              <button
                onClick={() => onStartInterviewWithRole(data.role, item.title)}
                className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
              >
                <span>Launch Practice</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
