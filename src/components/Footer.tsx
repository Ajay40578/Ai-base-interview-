import React from 'react';
import { BrainCircuit, Github, ExternalLink, Award, CheckCircle2 } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-lg text-white tracking-tight">
                Interview<span className="text-blue-400">AI</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              AI-based Mock Interview Simulator built for high-stakes tech interview preparation.
              Designed for university hackathon problem statement criteria.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium bg-emerald-950/60 px-2.5 py-1.5 rounded-md border border-emerald-800/40 w-fit">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Full-Stack Prototype Ready</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Product</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('dashboard')} className="hover:text-white transition-colors cursor-pointer">
                  Candidate Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('create')} className="hover:text-white transition-colors cursor-pointer">
                  Adaptive Mock Room
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('questions')} className="hover:text-white transition-colors cursor-pointer">
                  Question Bank (45+ Curated)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('skill-gap')} className="hover:text-white transition-colors cursor-pointer">
                  Skill Gap Matrix
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('improvement-plan')} className="hover:text-white transition-colors cursor-pointer">
                  7-Day Improvement Plan
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Official Stack
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                <span>Java 17 LTS / Spring Boot 3</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                <span>REST APIs & JPA/Hibernate</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                <span>React + TypeScript + Tailwind CSS</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>PostgreSQL / Relational Data Model</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                <span>Adaptive AI Evaluation Engine</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Hackathon Evaluation
            </h4>
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-amber-400 font-semibold">
                <Award className="w-4 h-4" />
                <span>Demo Profile Pre-Loaded</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Logged in as Alex Kumar (Fresher, Java Backend). Includes completed mock interviews,
                scorecard, skill gaps, and 7-day plan.
              </p>
              <button
                onClick={() => onNavigate('spring-boot')}
                className="w-full mt-2 py-1.5 px-2 bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 rounded border border-blue-500/40 text-[11px] font-semibold flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>View Spring Boot Spec</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © 2026 InterviewAI. Built for College Hackathon — AI-based Mock Interview Simulator.
          </div>
          <div className="flex items-center gap-6">
            <span className="text-slate-400">All features functional</span>
            <div className="flex items-center gap-1 text-slate-400 hover:text-white cursor-pointer">
              <Github className="w-4 h-4" />
              <span>Git/GitHub Ready</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
