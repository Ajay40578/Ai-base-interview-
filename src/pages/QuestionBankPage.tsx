import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Search,
  Filter,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Sparkles,
  PlayCircle,
  CheckCircle2,
  Copy,
  Check
} from 'lucide-react';
import { Question, QuestionCategory, DifficultyLevel } from '../types';
import { api } from '../services/api';

interface QuestionBankPageProps {
  onPracticeQuestion: (question: Question) => void;
}

export const QuestionBankPage: React.FC<QuestionBankPageProps> = ({ onPracticeQuestion }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories: (QuestionCategory | 'All')[] = [
    'All',
    'Java',
    'Spring Boot',
    'SQL',
    'DSA',
    'React',
    'DBMS',
    'OS',
    'Computer Networks',
    'HR',
    'Behavioral'
  ];

  useEffect(() => {
    loadQuestions();
  }, [selectedCategory, selectedDifficulty]);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      const data = await api.getQuestions({
        category: selectedCategory === 'All' ? undefined : selectedCategory,
        difficulty: selectedDifficulty === 'All' ? undefined : selectedDifficulty,
      });
      setQuestions(data);
    } catch (err) {
      console.error('Failed to load questions:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredQuestions = questions.filter((q) => {
    if (!searchQuery.trim()) return true;
    const s = searchQuery.toLowerCase();
    return (
      q.question_text.toLowerCase().includes(s) ||
      q.category.toLowerCase().includes(s) ||
      q.expected_points.some((p) => p.toLowerCase().includes(s))
    );
  });

  const handleCopy = (q: Question) => {
    navigator.clipboard.writeText(`${q.question_text}\n\nExpected points:\n- ${q.expected_points.join('\n- ')}`);
    setCopiedId(q.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-blue-200 text-xs font-semibold mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Curated Engineering Repository</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Interview Question Bank
          </h1>
          <p className="mt-1 text-sm text-blue-100 max-w-xl">
            Explore 45+ industry vetted technical & behavioral interview questions with full scoring rubrics and benchmark answers.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/20 text-center shrink-0">
          <div className="text-3xl font-black text-white">{filteredQuestions.length}</div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-blue-200 mt-0.5">
            Questions Available
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Search Bar */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by keyword (e.g. HashMap, JOIN, IoC, cycle detection, STAR)..."
              className="w-full pl-10 pr-4 py-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Difficulty Dropdown */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-bold text-slate-500">Difficulty:</span>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="text-xs font-semibold px-3 py-2 border border-slate-300 rounded-xl bg-white text-slate-700 outline-none"
            >
              <option value="All">All Levels</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-16 text-slate-400">Loading questions...</div>
        ) : filteredQuestions.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 text-slate-500">
            <BookOpen className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <h4 className="text-sm font-bold text-slate-700">No questions found matching your filter</h4>
            <p className="text-xs text-slate-400 mt-1">Try resetting the search query or selecting 'All' categories.</p>
          </div>
        ) : (
          filteredQuestions.map((q) => {
            const isExpanded = expandedId === q.id;
            return (
              <div
                key={q.id}
                className="bg-white rounded-2xl border border-slate-200 hover:border-slate-300 shadow-xs overflow-hidden transition-all"
              >
                <div
                  onClick={() => setExpandedId(isExpanded ? null : q.id)}
                  className="p-5 flex items-start justify-between gap-4 cursor-pointer hover:bg-slate-50/50"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200">
                        {q.category}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                          q.difficulty === 'Hard'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : q.difficulty === 'Medium'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        {q.difficulty}
                      </span>
                      <span className="text-[10px] text-slate-400">• {q.role}</span>
                    </div>

                    <h3 className="text-sm sm:text-base font-extrabold text-slate-900 leading-snug">
                      {q.question_text}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 pt-1">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onPracticeQuestion(q);
                      }}
                      className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-50 hover:bg-blue-100 text-blue-700 transition-colors"
                    >
                      <PlayCircle className="w-3.5 h-3.5 text-blue-600" />
                      <span>Practice</span>
                    </button>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </div>

                {isExpanded && (
                  <div className="p-5 border-t border-slate-200 bg-slate-50/60 space-y-4 text-xs">
                    {/* Expected Points */}
                    <div>
                      <h5 className="font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Expected Technical Key Points:</span>
                      </h5>
                      <ul className="list-disc list-inside space-y-1 text-slate-700 text-[11px] pl-1">
                        {q.expected_points.map((pt, i) => (
                          <li key={i}>{pt}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Sample Benchmark Answer */}
                    {q.sample_answer && (
                      <div className="pt-2 border-t border-slate-200/80">
                        <h5 className="font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                          <span>Exemplary Benchmark Answer:</span>
                        </h5>
                        <p className="p-3 bg-white rounded-xl text-slate-700 leading-relaxed font-mono text-[11px] border border-slate-200">
                          {q.sample_answer}
                        </p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="pt-2 flex items-center justify-between">
                      <button
                        onClick={() => handleCopy(q)}
                        className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-slate-800"
                      >
                        {copiedId === q.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-600">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Question & Rubrics</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => onPracticeQuestion(q)}
                        className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 shadow-xs"
                      >
                        <PlayCircle className="w-3.5 h-3.5" />
                        <span>Practice in Live Simulator</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
