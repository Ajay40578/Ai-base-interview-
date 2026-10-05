import React, { useState, useEffect } from 'react';
import { User, Question, Interview } from './types';
import { DEMO_USER, SEED_QUESTIONS } from './data/seedData';
import { api } from './services/api';

// Components
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { JudgeBar } from './components/JudgeBar';
import { GoogleAuthModal } from './components/GoogleAuthModal';

// Pages
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { CreateInterviewPage } from './pages/CreateInterviewPage';
import { InterviewRoomPage } from './pages/InterviewRoomPage';
import { ScorecardPage } from './pages/ScorecardPage';
import { SkillGapPage } from './pages/SkillGapPage';
import { ImprovementPlanPage } from './pages/ImprovementPlanPage';
import { ProfilePage } from './pages/ProfilePage';
import { QuestionBankPage } from './pages/QuestionBankPage';
import { InterviewHistoryPage } from './pages/InterviewHistoryPage';
import { SpringBootArchitecturePage } from './pages/SpringBootArchitecturePage';

export default function App() {
  // Pre-load demo user by default for seamless hackathon judge experience
  const [currentUser, setCurrentUser] = useState<User | null>(DEMO_USER);
  const [currentPage, setCurrentPage] = useState<string>('dashboard');

  // Active Interview Session State
  const [activeInterviewId, setActiveInterviewId] = useState<string | null>('int_001');
  const [activeQuestions, setActiveQuestions] = useState<Question[]>(SEED_QUESTIONS.slice(0, 5));
  const [activeRole, setActiveRole] = useState<string>('Java Backend Developer');

  // Selected Scorecard State
  const [selectedScorecardId, setSelectedScorecardId] = useState<string>('int_001');

  // Refresh trigger for judge resets
  const [refreshKey, setRefreshKey] = useState(0);

  // Google Login Dialog State
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [targetPageAfterAuth, setTargetPageAfterAuth] = useState<string>('create');

  useEffect(() => {
    // Check initial user from storage or server
    api.getCurrentUser().then((user) => {
      if (user) setCurrentUser(user);
    });
  }, [refreshKey]);

  // Auth Handlers
  const handleAuthSuccess = (user: User) => {
    setCurrentUser(user);
    setCurrentPage('dashboard');
  };

  const handleOpenGoogleAuth = (target: string = 'create') => {
    setTargetPageAfterAuth(target);
    setIsGoogleModalOpen(true);
  };

  const handleGoogleAuthSuccess = (user: User) => {
    setCurrentUser(user);
    setIsGoogleModalOpen(false);
    setCurrentPage(targetPageAfterAuth);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage('landing');
  };

  const handleTryDemo = async () => {
    await api.resetDemoData();
    setCurrentUser(DEMO_USER);
    setCurrentPage('dashboard');
    setRefreshKey((prev) => prev + 1);
  };

  // Launch a 3-Minute Demo Mock Interview for Judges
  const handleStartDemoInterview = async () => {
    const demoQuestions = SEED_QUESTIONS.slice(0, 5);
    try {
      const res = await api.createInterview({
        role: 'Java Backend Developer',
        experienceLevel: 'Fresher',
        interviewType: 'Technical',
        difficulty: 'Medium',
        totalQuestions: 5,
        skills: ['Java', 'Spring Boot', 'SQL', 'OOP', 'REST API'],
        isAdaptive: true,
      });
      setActiveInterviewId(res.interview.id);
      setActiveQuestions(res.questions.length > 0 ? res.questions : demoQuestions);
      setActiveRole('Java Backend Developer');
      setCurrentPage('room');
    } catch {
      setActiveInterviewId(`int_${Date.now()}`);
      setActiveQuestions(demoQuestions);
      setActiveRole('Java Backend Developer');
      setCurrentPage('room');
    }
  };

  // Callback when interview creation wizard completes
  const handleInterviewCreated = (interviewId: string, questions: Question[]) => {
    setActiveInterviewId(interviewId);
    setActiveQuestions(questions.length > 0 ? questions : SEED_QUESTIONS.slice(0, 5));
    setActiveRole(currentUser?.preferred_role || 'Java Backend Developer');
    setCurrentPage('room');
  };

  // Callback when candidate finishes all questions in room
  const handleInterviewFinished = (interviewId: string) => {
    setSelectedScorecardId(interviewId);
    setCurrentPage('scorecard');
  };

  // Callback to practice a single question from Question Bank
  const handlePracticeSingleQuestion = async (q: Question) => {
    try {
      const res = await api.createInterview({
        role: q.role,
        experienceLevel: currentUser?.experience_level || 'Fresher',
        interviewType: q.category === 'HR' || q.category === 'Behavioral' ? 'Behavioral' : 'Technical',
        difficulty: q.difficulty,
        totalQuestions: 1,
        skills: [q.category],
        isAdaptive: false,
      });
      setActiveInterviewId(res.interview.id);
      setActiveQuestions([q]);
      setActiveRole(q.role);
      setCurrentPage('room');
    } catch {
      setActiveInterviewId(`int_${Date.now()}`);
      setActiveQuestions([q]);
      setActiveRole(q.role);
      setCurrentPage('room');
    }
  };

  // Callback to retake an interview from History or Scorecard
  const handleRetakeInterview = (interview: Interview | null) => {
    const roleToUse = interview?.role || 'Java Backend Developer';
    setActiveRole(roleToUse);
    handleStartDemoInterview();
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white">
      {/* Hackathon Judge Toolbar */}
      <JudgeBar
        onRefresh={() => setRefreshKey((prev) => prev + 1)}
        onNavigate={(p) => setCurrentPage(p)}
        onStartDemoInterview={handleStartDemoInterview}
      />

      {/* Main Top Navigation */}
      <Navbar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        currentUser={currentUser}
        onLogout={handleLogout}
        onTryDemo={handleTryDemo}
      />

      {/* Page Routing */}
      <main className="flex-1">
        {currentPage === 'landing' && (
          <LandingPage
            onStartInterview={() => (currentUser ? setCurrentPage('create') : handleOpenGoogleAuth('create'))}
            onStartWithGoogle={() => handleOpenGoogleAuth('create')}
            onViewDashboard={() => (currentUser ? setCurrentPage('dashboard') : handleOpenGoogleAuth('dashboard'))}
            onTryDemo={handleTryDemo}
            onNavigate={(p) => setCurrentPage(p)}
          />
        )}

        {currentPage === 'auth' && (
          <AuthPage
            onAuthSuccess={handleAuthSuccess}
            onTryDemo={handleTryDemo}
          />
        )}

        {currentPage === 'dashboard' && currentUser && (
          <DashboardPage
            key={refreshKey}
            currentUser={currentUser}
            onStartInterview={() => setCurrentPage('create')}
            onLoginWithGoogle={() => handleOpenGoogleAuth('dashboard')}
            onViewInterviewResult={(id) => {
              setSelectedScorecardId(id);
              setCurrentPage('scorecard');
            }}
            onNavigate={(p) => setCurrentPage(p)}
          />
        )}

        {currentPage === 'create' && (
          <CreateInterviewPage
            onInterviewCreated={handleInterviewCreated}
            onCancel={() => setCurrentPage('dashboard')}
            currentUser={currentUser}
            onLoginWithGoogle={() => handleOpenGoogleAuth('create')}
          />
        )}

        {currentPage === 'room' && activeInterviewId && (
          <InterviewRoomPage
            interviewId={activeInterviewId}
            initialQuestions={activeQuestions}
            role={activeRole}
            onFinish={handleInterviewFinished}
            onExit={() => setCurrentPage('dashboard')}
          />
        )}

        {currentPage === 'scorecard' && selectedScorecardId && (
          <ScorecardPage
            interviewId={selectedScorecardId}
            onRetake={() => handleRetakeInterview(null)}
            onNavigate={(p) => setCurrentPage(p)}
          />
        )}

        {currentPage === 'skill-gap' && (
          <SkillGapPage
            onStartInterviewWithRole={(r) => {
              setActiveRole(r);
              setCurrentPage('create');
            }}
            onNavigate={(p) => setCurrentPage(p)}
          />
        )}

        {currentPage === 'improvement-plan' && (
          <ImprovementPlanPage
            onStartInterview={() => setCurrentPage('create')}
            onNavigate={(p) => setCurrentPage(p)}
          />
        )}

        {currentPage === 'profile' && currentUser && (
          <ProfilePage
            currentUser={currentUser}
            onNavigate={(p) => setCurrentPage(p)}
          />
        )}

        {currentPage === 'questions' && (
          <QuestionBankPage
            onPracticeQuestion={handlePracticeSingleQuestion}
          />
        )}

        {currentPage === 'history' && (
          <InterviewHistoryPage
            onViewResult={(id) => {
              setSelectedScorecardId(id);
              setCurrentPage('scorecard');
            }}
            onRetake={(item) => handleRetakeInterview(item)}
            onStartNew={() => setCurrentPage('create')}
          />
        )}

        {currentPage === 'spring-boot' && <SpringBootArchitecturePage />}
      </main>

      {/* Global Footer */}
      <Footer onNavigate={(p) => setCurrentPage(p)} />

      {/* Google Authentication Modal for Start New Interview */}
      <GoogleAuthModal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
        onSuccess={handleGoogleAuthSuccess}
        title="Sign In with Google to Start Interview"
        subtitle="Connect your Google Account (or continue as Ajay Kumar) to create an adaptive mock interview room and track your rubric scores."
      />
    </div>
  );
}
