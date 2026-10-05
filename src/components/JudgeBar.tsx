import React, { useState } from 'react';
import { Sparkles, RotateCcw, Code2, Play, Check } from 'lucide-react';
import { api } from '../services/api';

interface JudgeBarProps {
  onRefresh: () => void;
  onNavigate: (page: string) => void;
  onStartDemoInterview: () => void;
}

export const JudgeBar: React.FC<JudgeBarProps> = ({
  onRefresh,
  onNavigate,
  onStartDemoInterview,
}) => {
  const [resetting, setResetting] = useState(false);
  const [resetDone, setResetDone] = useState(false);

  const handleReset = async () => {
    setResetting(true);
    await api.resetDemoData();
    setResetting(false);
    setResetDone(true);
    onRefresh();
    setTimeout(() => setResetDone(false), 2500);
  };

  return (
    <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white px-3 sm:px-6 py-2 border-b border-indigo-900/50 text-xs shadow-inner">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        {/* Left: Judge indicator */}
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-bold text-slate-200">
            Hackathon Judge Panel:
          </span>
          <span className="hidden sm:inline bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/30 font-medium">
            Demo Mode Active (Candidate: Alex Kumar)
          </span>
        </div>

        {/* Right: Quick actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onStartDemoInterview}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>3-Min Demo Flow</span>
          </button>

          <button
            onClick={() => onNavigate('spring-boot')}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-indigo-900/60 hover:bg-indigo-800 text-indigo-200 border border-indigo-700/50 font-medium transition-colors cursor-pointer"
          >
            <Code2 className="w-3.5 h-3.5 text-indigo-400" />
            <span>Spring Boot Architecture</span>
          </button>

          <button
            onClick={handleReset}
            disabled={resetting}
            className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition-colors border border-slate-700 cursor-pointer"
            title="Reset all demo state"
          >
            {resetDone ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Reset Done</span>
              </>
            ) : (
              <>
                <RotateCcw className={`w-3.5 h-3.5 ${resetting ? 'animate-spin' : ''}`} />
                <span>Reset Demo</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
