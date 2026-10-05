import React, { useState, useEffect } from 'react';
import {
  History,
  CheckCircle2,
  Trash2,
  RotateCcw,
  ExternalLink,
  Search,
  Filter,
  ArrowUpDown,
  BookOpen
} from 'lucide-react';
import { Interview } from '../types';
import { api } from '../services/api';

interface InterviewHistoryPageProps {
  onViewResult: (id: string) => void;
  onRetake: (interview: Interview) => void;
  onStartNew: () => void;
}

export const InterviewHistoryPage: React.FC<InterviewHistoryPageProps> = ({
  onViewResult,
  onRetake,
  onStartNew,
}) => {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('All');
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const data = await api.getInterviews();
      setInterviews(data);
    } catch (err) {
      console.error('Failed to load history:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this interview transcript and scorecard?')) {
      await api.deleteInterview(id);
      setInterviews((prev) => prev.filter((i) => i.id !== id));
    }
  };

  const filteredInterviews = interviews.filter((item) => {
    if (roleFilter !== 'All' && item.role !== roleFilter) return false;
    if (difficultyFilter !== 'All' && item.difficulty !== difficultyFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.role.toLowerCase().includes(q) ||
        item.interview_type.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-blue-200 text-xs font-semibold mb-2">
            <History className="w-3.5 h-3.5" />
            <span>Audit Trail & Records</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Interview History & Archives
          </h1>
          <p className="mt-1 text-sm text-blue-100 max-w-xl">
            Review past scores, inspect question transcripts, and monitor your score climb over time.
          </p>
        </div>

        <button
          onClick={onStartNew}
          className="px-5 py-3 rounded-xl font-bold text-xs bg-white text-blue-700 hover:bg-blue-50 shadow-md transition-colors shrink-0"
        >
          Start New Interview
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search past sessions..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="text-xs font-semibold px-3 py-2 border border-slate-300 rounded-xl bg-white text-slate-700 outline-none"
          >
            <option value="All">All Roles</option>
            <option value="Java Backend Developer">Java Backend Developer</option>
            <option value="Full Stack Developer">Full Stack Developer</option>
            <option value="Software Engineer">Software Engineer</option>
          </select>

          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="text-xs font-semibold px-3 py-2 border border-slate-300 rounded-xl bg-white text-slate-700 outline-none"
          >
            <option value="All">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
        {loading ? (
          <div className="text-center py-12 text-slate-400">Loading history...</div>
        ) : filteredInterviews.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <BookOpen className="w-8 h-8 mx-auto text-slate-300 mb-2" />
            <p className="text-sm font-semibold">No interviews match your filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="pb-3 pl-2">Date</th>
                  <th className="pb-3">Role</th>
                  <th className="pb-3">Type</th>
                  <th className="pb-3">Difficulty</th>
                  <th className="pb-3">Score</th>
                  <th className="pb-3">Duration</th>
                  <th className="pb-3 text-right pr-2">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredInterviews.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 pl-2 font-medium text-slate-600">
                      {new Date(item.started_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="py-4 font-bold text-slate-900">
                      {item.role}
                      {item.is_adaptive && (
                        <span className="ml-2 text-[10px] font-semibold bg-purple-50 text-purple-700 px-1.5 py-0.2 rounded border border-purple-200">
                          Adaptive
                        </span>
                      )}
                    </td>
                    <td className="py-4 text-slate-600">{item.interview_type}</td>
                    <td className="py-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          item.difficulty === 'Hard'
                            ? 'bg-rose-50 text-rose-700'
                            : item.difficulty === 'Medium'
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-emerald-50 text-emerald-700'
                        }`}
                      >
                        {item.difficulty}
                      </span>
                    </td>
                    <td className="py-4 font-bold">
                      <span
                        className={`text-sm ${
                          item.score >= 80
                            ? 'text-emerald-600'
                            : item.score >= 65
                            ? 'text-blue-600'
                            : 'text-amber-600'
                        }`}
                      >
                        {item.score}/100
                      </span>
                    </td>
                    <td className="py-4 text-slate-500">~{item.duration_minutes || 28} mins</td>
                    <td className="py-4 text-right pr-2 space-x-2">
                      <button
                        onClick={() => onViewResult(item.id)}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors inline-flex items-center gap-1 cursor-pointer"
                        title="View Scorecard"
                      >
                        <span>Scorecard</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>

                      <button
                        onClick={() => onRetake(item)}
                        className="px-2 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors inline-flex items-center gap-1 cursor-pointer"
                        title="Retake this session"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span className="hidden sm:inline">Retake</span>
                      </button>

                      <button
                        onClick={() => handleDelete(item.id)}
                        className="px-2 py-1.5 rounded-lg text-xs font-semibold text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors inline-flex items-center cursor-pointer"
                        title="Delete session"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
