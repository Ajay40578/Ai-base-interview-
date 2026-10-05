import React, { useState, useEffect } from 'react';
import {
  CalendarCheck,
  CheckCircle2,
  Circle,
  Clock,
  Sparkles,
  ArrowRight,
  BookOpen,
  PlayCircle,
  ChevronRight,
  RotateCcw
} from 'lucide-react';
import { ImprovementPlan } from '../types';
import { api } from '../services/api';

interface ImprovementPlanPageProps {
  onStartInterview: () => void;
  onNavigate: (page: string) => void;
}

export const ImprovementPlanPage: React.FC<ImprovementPlanPageProps> = ({
  onStartInterview,
  onNavigate,
}) => {
  const [plan, setPlan] = useState<ImprovementPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeDay, setActiveDay] = useState<number>(3); // Default to current in-progress day

  useEffect(() => {
    loadPlan();
  }, []);

  const loadPlan = async () => {
    try {
      setLoading(true);
      const res = await api.getImprovementPlan();
      setPlan(res);
    } catch (err) {
      console.error('Failed to load improvement plan:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTask = async (dayNumber: number, taskId: string, currentStatus: boolean) => {
    try {
      const updated = await api.togglePlanTask(dayNumber, taskId, !currentStatus);
      setPlan({ ...updated });
    } catch (err) {
      console.error('Failed to update task:', err);
    }
  };

  if (loading || !plan) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center animate-pulse">
        <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4"></div>
        <div className="h-6 bg-slate-200 rounded w-1/3 mx-auto"></div>
      </div>
    );
  }

  const totalTasks = plan.days.reduce((acc, d) => acc + d.tasks.length, 0);
  const completedTasks = plan.days.reduce(
    (acc, d) => acc + d.tasks.filter((t) => t.completed).length,
    0
  );
  const progressPercent = Math.round((completedTasks / totalTasks) * 100);

  const selectedDay = plan.days.find((d) => d.day === activeDay) || plan.days[0];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-blue-200 text-xs font-semibold mb-2">
            <CalendarCheck className="w-3.5 h-3.5" />
            <span>AI Curriculum Generator</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            7-Day Personalized Improvement Plan
          </h1>
          <p className="mt-1 text-sm text-blue-100 max-w-xl">
            Tailored specifically for <strong>{plan.target_role}</strong>. Closes critical gaps in Exception Handling, Collections, and Spring Boot auto-configuration.
          </p>
        </div>

        {/* Progress Card */}
        <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/20 text-center shrink-0">
          <div className="text-4xl font-black text-white">{progressPercent}%</div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-blue-200 mt-0.5">
            {completedTasks} of {totalTasks} Tasks Completed
          </div>
        </div>
      </div>

      {/* 7-Day Navigation Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
        {plan.days.map((d) => {
          const isSelected = activeDay === d.day;
          const dayCompleted = d.completed;
          return (
            <button
              key={d.day}
              onClick={() => setActiveDay(d.day)}
              className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                isSelected
                  ? 'border-blue-600 bg-blue-50/80 shadow-xs'
                  : dayCompleted
                  ? 'border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50'
                  : 'border-slate-200 bg-white hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-center gap-1 mb-1">
                {dayCompleted ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Circle className="w-3.5 h-3.5 text-slate-300" />
                )}
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Day {d.day}
                </span>
              </div>
              <div
                className={`text-xs font-bold truncate ${
                  isSelected ? 'text-blue-900' : 'text-slate-800'
                }`}
              >
                {d.title.split(' ')[0]} {d.title.split(' ')[1] || ''}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Day Task Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                Day {selectedDay.day} Curriculum
              </span>
              {selectedDay.completed && (
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Day Completed ✓
                </span>
              )}
            </div>
            <h3 className="text-xl font-black text-slate-900 mt-2">{selectedDay.title}</h3>
            <p className="text-xs text-slate-500 mt-0.5">{selectedDay.topic}</p>
          </div>

          <div className="text-right">
            <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">
              Estimated Effort
            </span>
            <span className="text-sm font-extrabold text-slate-800 flex items-center gap-1 justify-end mt-0.5">
              <Clock className="w-4 h-4 text-blue-600" />
              {selectedDay.tasks.reduce((a, b) => a + b.est_minutes, 0)} minutes
            </span>
          </div>
        </div>

        <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200/70">
          {selectedDay.description}
        </p>

        {/* Task Checkboxes */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Daily Action Items (Click to Complete):
          </h4>
          {selectedDay.tasks.map((task) => (
            <div
              key={task.id}
              onClick={() => handleToggleTask(selectedDay.day, task.id, task.completed)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-4 ${
                task.completed
                  ? 'bg-emerald-50/40 border-emerald-200 text-slate-700'
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => {}} // handled by parent onClick
                  className="w-5 h-5 rounded text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                />
                <span
                  className={`text-sm font-medium ${
                    task.completed ? 'line-through text-slate-400' : 'text-slate-800'
                  }`}
                >
                  {task.task}
                </span>
              </div>

              <span className="text-[11px] font-semibold text-slate-500 shrink-0 bg-slate-100 px-2 py-0.5 rounded">
                ~{task.est_minutes} min
              </span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {activeDay > 1 && (
              <button
                onClick={() => setActiveDay(activeDay - 1)}
                className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-2 rounded-lg hover:bg-slate-100"
              >
                ← Previous Day
              </button>
            )}
            {activeDay < 7 && (
              <button
                onClick={() => setActiveDay(activeDay + 1)}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-50"
              >
                Next Day →
              </button>
            )}
          </div>

          <button
            onClick={onStartInterview}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors cursor-pointer"
          >
            <PlayCircle className="w-4 h-4" />
            <span>Practice Day {selectedDay.day} Drill Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};
