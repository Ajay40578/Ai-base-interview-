import React, { useState, useEffect } from 'react';
import {
  BrainCircuit,
  Clock,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Send,
  SkipForward,
  Sparkles,
  Zap,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  HelpCircle,
  Pause,
  Play,
  RotateCcw
} from 'lucide-react';
import { Question, AnswerEvaluation, DifficultyLevel } from '../types';
import { api } from '../services/api';

interface InterviewRoomPageProps {
  interviewId: string;
  initialQuestions: Question[];
  role: string;
  onFinish: (interviewId: string) => void;
  onExit: () => void;
}

export const InterviewRoomPage: React.FC<InterviewRoomPageProps> = ({
  interviewId,
  initialQuestions,
  role,
  onFinish,
  onExit,
}) => {
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [candidateAnswer, setCandidateAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [evalModalOpen, setEvalModalOpen] = useState(false);
  const [currentEvaluation, setCurrentEvaluation] = useState<AnswerEvaluation | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Timer state
  const [timeRemaining, setTimeRemaining] = useState(120); // 2 minutes per question
  const [isTimerPaused, setIsTimerPaused] = useState(false);

  // Audio Speech state
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const currentQuestion: Question | undefined = questions[currentIndex];

  // Timer countdown
  useEffect(() => {
    if (isTimerPaused || evalModalOpen) return;
    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimerPaused, evalModalOpen]);

  // Reset timer on question switch
  useEffect(() => {
    setTimeRemaining(120);
    setCandidateAnswer('');
    setValidationError(null);
  }, [currentIndex]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Text to Speech
  const handleSpeakQuestion = () => {
    if (!('speechSynthesis' in window) || !currentQuestion) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(currentQuestion.question_text);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  // Web Speech Recognition for voice dictation
  const handleToggleVoiceDictation = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser environment. You can type directly in the answer box.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setCandidateAnswer((prev) => (prev ? `${prev} ${transcript}` : transcript));
      };

      recognition.start();
    } catch (err) {
      console.warn('Speech recognition error:', err);
      setIsListening(false);
    }
  };

  // Insert Sample Answer for Hackathon Judges
  const handleInsertSampleAnswer = () => {
    if (!currentQuestion) return;
    if (currentQuestion.sample_answer) {
      setCandidateAnswer(currentQuestion.sample_answer);
    } else {
      setCandidateAnswer(
        `In ${role}, this concept is fundamental. Specifically, ${currentQuestion.expected_points?.[0] || 'it optimizes runtime complexity'}. Additionally, it handles edge cases by maintaining clear state boundaries and reducing overall resource overhead.`
      );
    }
    setValidationError(null);
  };

  // Handle Answer Submission
  const handleSubmitAnswer = async () => {
    setValidationError(null);
    if (!candidateAnswer.trim()) {
      setValidationError('Your answer cannot be empty. Please provide your explanation or insert a demo answer.');
      return;
    }

    if (!currentQuestion) return;

    setIsSubmitting(true);
    try {
      const response = await api.submitAnswer(
        interviewId,
        currentQuestion,
        candidateAnswer.trim(),
        role,
        currentQuestion.difficulty,
        120 - timeRemaining
      );

      setCurrentEvaluation(response.answer.evaluation);

      // Adaptive question adjustment for remaining questions
      if (response.nextAdaptive && currentIndex + 1 < questions.length) {
        const updatedQuestions = [...questions];
        updatedQuestions[currentIndex + 1] = {
          ...updatedQuestions[currentIndex + 1],
          difficulty: response.nextAdaptive.nextDifficulty,
          is_adaptive: true,
        };
        setQuestions(updatedQuestions);
      }

      setIsSubmitting(false);
      setEvalModalOpen(true);
    } catch (err: any) {
      console.error('Submission failed:', err);
      setIsSubmitting(false);
      setValidationError('Evaluation error. Please retry.');
    }
  };

  // Move to next question or finalize
  const handleNextQuestion = () => {
    setEvalModalOpen(false);
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onFinish(interviewId);
    }
  };

  const handleSkipQuestion = () => {
    if (confirm('Are you sure you want to skip this question? It will be marked with 0 points.')) {
      setCandidateAnswer('Skipped by candidate.');
      if (currentIndex + 1 < questions.length) {
        setCurrentIndex(currentIndex + 1);
      } else {
        onFinish(interviewId);
      }
    }
  };

  const wordCount = candidateAnswer.trim() ? candidateAnswer.trim().split(/\s+/).length : 0;
  const charCount = candidateAnswer.length;

  if (!currentQuestion) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <p className="text-slate-600">Loading interview room...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-100/70 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Top Header Bar */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 text-sm">{role}</span>
                <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200">
                  Question {currentIndex + 1} of {questions.length}
                </span>
                {currentQuestion.is_adaptive && (
                  <span className="text-[10px] font-bold bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full border border-purple-200 flex items-center gap-1">
                    <Zap className="w-3 h-3 text-purple-600" />
                    Adaptive Question
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">Live AI Mock Session • Timed Simulation</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Timer */}
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-mono font-bold ${
                timeRemaining <= 30
                  ? 'bg-rose-50 border-rose-300 text-rose-700 animate-pulse'
                  : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>{formatTimer(timeRemaining)}</span>
              <button
                onClick={() => setIsTimerPaused(!isTimerPaused)}
                className="hover:text-slate-900 p-0.5"
                title={isTimerPaused ? 'Resume timer' : 'Pause timer'}
              >
                {isTimerPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
              </button>
            </div>

            <button
              onClick={onExit}
              className="text-xs font-semibold text-slate-500 hover:text-rose-600 px-3 py-1.5 rounded-lg hover:bg-rose-50 transition-colors"
            >
              End Interview
            </button>
          </div>
        </div>

        {/* Two-Column Grid: Interviewer Left / Candidate Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT: Interviewer Panel (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>

              {/* Interviewer Persona Card */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-sm ring-2 ring-blue-500">
                    AI
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Dr. Sarah Vance</h4>
                    <p className="text-[11px] text-slate-500">Principal Systems Evaluator</p>
                  </div>
                </div>

                <button
                  onClick={handleSpeakQuestion}
                  className={`p-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    isSpeaking
                      ? 'bg-blue-600 text-white border-blue-600 animate-pulse'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                  title="Listen to question"
                >
                  {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  <span className="text-[11px]">{isSpeaking ? 'Mute' : 'Listen'}</span>
                </button>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2 mt-4">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                  Topic: {currentQuestion.category}
                </span>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                    currentQuestion.difficulty === 'Hard'
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : currentQuestion.difficulty === 'Medium'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}
                >
                  Difficulty: {currentQuestion.difficulty}
                </span>
              </div>

              {/* Question Text */}
              <div className="mt-4">
                <h3 className="text-lg font-extrabold text-slate-900 leading-snug">
                  {currentQuestion.question_text}
                </h3>
              </div>

              {/* Adaptive Explanation */}
              {currentQuestion.is_adaptive && (
                <div className="mt-4 p-3 rounded-xl bg-purple-50/80 border border-purple-200 text-purple-900 text-xs flex items-start gap-2">
                  <Zap className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Adaptive Questioning Active:</span>
                    <p className="text-[11px] text-purple-800 mt-0.5">
                      InterviewAI adjusts the next question based on your performance.
                    </p>
                  </div>
                </div>
              )}

              {/* Interviewer Tip */}
              <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-slate-700">
                  <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
                  <span>Evaluation Criteria:</span>
                </div>
                <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-600 pl-1">
                  <li>Direct conceptual accuracy and clarity</li>
                  <li>Mentioning time / space complexities or trade-offs</li>
                  <li>Real-world practical code or architectural examples</li>
                </ul>
              </div>
            </div>
          </div>

          {/* RIGHT: Candidate Answer Panel (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2">
              <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                Candidate Answer Console
              </span>

              <div className="flex items-center gap-2">
                {/* Voice Dictation Button */}
                <button
                  onClick={handleToggleVoiceDictation}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    isListening
                      ? 'bg-rose-50 border-rose-300 text-rose-700 animate-pulse font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                  title="Speech-to-text voice input"
                >
                  {isListening ? <Mic className="w-3.5 h-3.5 text-rose-600" /> : <MicOff className="w-3.5 h-3.5 text-slate-500" />}
                  <span>{isListening ? 'Listening...' : 'Voice Mic'}</span>
                </button>

                {/* Quick Insert Sample Answer (Hackathon Demo) */}
                <button
                  onClick={handleInsertSampleAnswer}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-50 border border-amber-200 text-amber-900 hover:bg-amber-100 transition-colors shadow-xs cursor-pointer"
                  title="Insert realistic demo answer for fast judge testing"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Insert Demo Answer</span>
                </button>
              </div>
            </div>

            {/* Answer Text Area */}
            <div className="relative">
              <textarea
                value={candidateAnswer}
                onChange={(e) => {
                  setCandidateAnswer(e.target.value);
                  if (validationError) setValidationError(null);
                }}
                rows={11}
                placeholder="Type your response here... Structure your answer clearly with core concepts, practical trade-offs, and examples. You can also use the 'Insert Demo Answer' button for quick judge evaluation."
                className="w-full p-4 text-sm font-normal text-slate-800 border border-slate-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none leading-relaxed transition-all resize-none"
              ></textarea>

              {/* Word & Char Count */}
              <div className="absolute bottom-3 right-3 text-[11px] text-slate-400 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded border border-slate-200">
                {wordCount} words • {charCount} chars
              </div>
            </div>

            {/* Validation Message */}
            {validationError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{validationError}</span>
              </div>
            )}

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={handleSkipQuestion}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <SkipForward className="w-3.5 h-3.5" />
                <span>Skip Question</span>
              </button>

              <button
                onClick={handleSubmitAnswer}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20 hover:from-blue-700 hover:to-indigo-700 transition-all cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>AI is evaluating your answer...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Answer</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Evaluating Overlay State */}
      {isSubmitting && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
              <BrainCircuit className="w-10 h-10 animate-pulse" />
            </div>
            <h3 className="text-xl font-black text-slate-900">
              AI is Evaluating Your Answer...
            </h3>
            <p className="text-xs text-slate-500">
              Assessing technical accuracy, relevance, completeness, clarity, and adaptive difficulty.
            </p>
            <div className="space-y-2 pt-2 text-left text-xs font-medium text-slate-600">
              <div className="flex items-center gap-2 text-emerald-600">
                <CheckCircle2 className="w-4 h-4" />
                <span>Parsing candidate answer semantic tokens...</span>
              </div>
              <div className="flex items-center gap-2 text-blue-600">
                <CheckCircle2 className="w-4 h-4" />
                <span>Benchmarking against {currentQuestion.category} key rubrics...</span>
              </div>
              <div className="flex items-center gap-2 text-indigo-600 animate-pulse">
                <Zap className="w-4 h-4" />
                <span>Computing next adaptive difficulty level...</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Immediate Evaluation Feedback Modal */}
      {evalModalOpen && currentEvaluation && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl my-8 space-y-6 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                  Evaluation Report • Question {currentIndex + 1}
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-1">Answer Evaluation</h3>
              </div>

              {/* Big Score Badge */}
              <div className="text-right">
                <div className="text-3xl font-black text-blue-600">
                  {currentEvaluation.overall_score}
                  <span className="text-base text-slate-400 font-semibold">/100</span>
                </div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Overall Score
                </div>
              </div>
            </div>

            {/* Criteria Breakdown Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/70 text-center">
                <div className="text-[10px] text-slate-500 font-bold uppercase">Accuracy</div>
                <div className="text-sm font-extrabold text-slate-900 mt-0.5">
                  {currentEvaluation.technical_accuracy}%
                </div>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/70 text-center">
                <div className="text-[10px] text-slate-500 font-bold uppercase">Relevance</div>
                <div className="text-sm font-extrabold text-slate-900 mt-0.5">
                  {currentEvaluation.relevance}%
                </div>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/70 text-center">
                <div className="text-[10px] text-slate-500 font-bold uppercase">Completeness</div>
                <div className="text-sm font-extrabold text-slate-900 mt-0.5">
                  {currentEvaluation.completeness}%
                </div>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/70 text-center">
                <div className="text-[10px] text-slate-500 font-bold uppercase">Communication</div>
                <div className="text-sm font-extrabold text-slate-900 mt-0.5">
                  {currentEvaluation.communication}%
                </div>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/70 text-center col-span-2 sm:col-span-1">
                <div className="text-[10px] text-slate-500 font-bold uppercase">Clarity</div>
                <div className="text-sm font-extrabold text-slate-900 mt-0.5">
                  {currentEvaluation.clarity}%
                </div>
              </div>
            </div>

            {/* Strengths & Weaknesses */}
            <div className="space-y-3">
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4">
                <h5 className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Strengths</span>
                </h5>
                <ul className="space-y-1 text-xs text-emerald-800">
                  {currentEvaluation.strengths.map((str, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="font-bold">✓</span>
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4">
                <h5 className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Areas for Improvement</span>
                </h5>
                <ul className="space-y-1 text-xs text-amber-900">
                  {currentEvaluation.weaknesses.map((w, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="font-bold">⚠</span>
                      <span>{w}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Expected Key Points vs Candidate Answer */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs space-y-3">
              <div>
                <h5 className="font-bold text-slate-800 mb-1">Expected Key Points:</h5>
                <ul className="list-disc list-inside space-y-0.5 text-slate-600 text-[11px]">
                  {currentQuestion.expected_points.map((pt, i) => (
                    <li key={i}>{pt}</li>
                  ))}
                </ul>
              </div>

              <div className="pt-2 border-t border-slate-200">
                <h5 className="font-bold text-slate-800 mb-1">Coaching Suggestion:</h5>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  {currentEvaluation.improvement_suggestions[0]}
                </p>
              </div>
            </div>

            {/* Adaptive Next Question Notice */}
            {currentEvaluation.adaptive_explanation && (
              <div className="p-3.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-900 text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>{currentEvaluation.adaptive_explanation}</span>
                </div>
              </div>
            )}

            {/* Next Button */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={handleNextQuestion}
                className="px-6 py-3 rounded-xl font-bold text-sm bg-blue-600 hover:bg-blue-700 text-white shadow-md flex items-center gap-2 cursor-pointer transition-colors"
              >
                <span>
                  {currentIndex + 1 < questions.length ? 'Continue to Next Question' : 'View Final Scorecard'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
