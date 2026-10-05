import {
  User,
  Profile,
  Interview,
  Question,
  Answer,
  AnswerEvaluation,
  SkillGapAnalysis,
  ImprovementPlan,
  DashboardStats,
  RoleType,
  InterviewType,
  DifficultyLevel
} from '../types/index';
import {
  DEMO_USER,
  DEMO_PROFILE,
  DEMO_INTERVIEWS,
  SEED_QUESTIONS,
  DEMO_SKILL_GAPS,
  DEMO_IMPROVEMENT_PLAN,
  DEMO_DASHBOARD_STATS
} from '../data/seedData';
import { aiService } from './aiService';

const STORAGE_KEYS = {
  USER: 'interviewai_user',
  PROFILE: 'interviewai_profile',
  INTERVIEWS: 'interviewai_interviews',
  QUESTIONS: 'interviewai_questions',
  SKILL_GAPS: 'interviewai_skill_gaps',
  IMPROVEMENT_PLAN: 'interviewai_improvement_plan',
};

function initLocalStorage() {
  if (typeof window === 'undefined') return;
  if (!localStorage.getItem(STORAGE_KEYS.USER)) {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(DEMO_USER));
  }
  if (!localStorage.getItem(STORAGE_KEYS.PROFILE)) {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(DEMO_PROFILE));
  }
  if (!localStorage.getItem(STORAGE_KEYS.INTERVIEWS)) {
    localStorage.setItem(STORAGE_KEYS.INTERVIEWS, JSON.stringify(DEMO_INTERVIEWS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.QUESTIONS)) {
    localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(SEED_QUESTIONS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.SKILL_GAPS)) {
    localStorage.setItem(STORAGE_KEYS.SKILL_GAPS, JSON.stringify(DEMO_SKILL_GAPS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.IMPROVEMENT_PLAN)) {
    localStorage.setItem(STORAGE_KEYS.IMPROVEMENT_PLAN, JSON.stringify(DEMO_IMPROVEMENT_PLAN));
  }
}

initLocalStorage();

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const res = await fetch(`/api${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    });
    if (res.ok) {
      return (await res.json()) as T;
    }
    throw new Error(`HTTP error! status: ${res.status}`);
  }

  async login(email: string, _password?: string): Promise<{ user: User; token: string }> {
    try {
      return await this.request<{ user: User; token: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email })
      });
    } catch {
      const stored = localStorage.getItem(STORAGE_KEYS.USER);
      const user = stored ? JSON.parse(stored) : { ...DEMO_USER, email };
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      return { user, token: 'demo-jwt-token-alex-kumar' };
    }
  }

  async loginWithGoogle(googleUserData?: {
    name?: string;
    email?: string;
    avatar_url?: string;
  }): Promise<{ user: User; token: string }> {
    const userEmail = googleUserData?.email || 'ajaykumarak1275@gmail.com';
    const userName = googleUserData?.name || 'Ajay Kumar';
    
    const googleUser: User = {
      id: `usr_google_${Date.now()}`,
      name: userName,
      email: userEmail,
      college: 'National Institute of Technology',
      degree: 'B.Tech in Computer Science & Engineering',
      graduation_year: 2026,
      experience_level: 'Fresher',
      preferred_role: 'Java Backend Developer',
      created_at: new Date().toISOString(),
      auth_provider: 'google',
      avatar_url: googleUserData?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    };

    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(googleUser));
    return {
      user: googleUser,
      token: `google-oauth-token-${Date.now()}`
    };
  }

  async register(userData: Partial<User>): Promise<{ user: User; token: string }> {
    try {
      return await this.request<{ user: User; token: string }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData)
      });
    } catch {
      const newUser: User = {
        id: `usr_${Date.now()}`,
        name: userData.name || 'Alex Kumar',
        email: userData.email || 'alex.kumar@mit.edu',
        college: userData.college || 'MIT',
        degree: userData.degree || 'B.Tech CSE',
        graduation_year: userData.graduation_year || 2026,
        experience_level: userData.experience_level || 'Fresher',
        preferred_role: userData.preferred_role || 'Java Backend Developer',
        created_at: new Date().toISOString()
      };
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));
      return { user: newUser, token: 'demo-jwt-token' };
    }
  }

  async getCurrentUser(): Promise<User> {
    try {
      return await this.request<User>('/auth/me');
    } catch {
      const stored = localStorage.getItem(STORAGE_KEYS.USER);
      return stored ? JSON.parse(stored) : DEMO_USER;
    }
  }

  async getProfile(): Promise<Profile> {
    try {
      return await this.request<Profile>('/profile');
    } catch {
      const stored = localStorage.getItem(STORAGE_KEYS.PROFILE);
      return stored ? JSON.parse(stored) : DEMO_PROFILE;
    }
  }

  async updateProfile(updates: Partial<Profile>): Promise<Profile> {
    try {
      return await this.request<Profile>('/profile', {
        method: 'PUT',
        body: JSON.stringify(updates)
      });
    } catch {
      const current = await this.getProfile();
      const updated = { ...current, ...updates };
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(updated));
      return updated;
    }
  }

  async getDashboard(): Promise<DashboardStats> {
    try {
      return await this.request<DashboardStats>('/dashboard');
    } catch {
      const interviews = await this.getInterviews();
      const completed = interviews.filter(i => i.status === 'Completed');
      const avgScore = completed.length > 0 
        ? Math.round(completed.reduce((acc, i) => acc + (i.score || 0), 0) / completed.length) 
        : 78;
      const bestScore = completed.length > 0 
        ? Math.max(...completed.map(i => i.score || 0)) 
        : 91;

      return {
        ...DEMO_DASHBOARD_STATS,
        interviews_completed: completed.length,
        average_score: avgScore,
        best_score: bestScore,
        recent_interviews: interviews.slice(0, 5)
      };
    }
  }

  async getQuestions(filters?: { role?: string; category?: string; difficulty?: string }): Promise<Question[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.role) params.set('role', filters.role);
      if (filters?.category) params.set('category', filters.category);
      if (filters?.difficulty) params.set('difficulty', filters.difficulty);
      const query = params.toString() ? `?${params.toString()}` : '';
      return await this.request<Question[]>(`/questions${query}`);
    } catch {
      const stored = localStorage.getItem(STORAGE_KEYS.QUESTIONS);
      let list: Question[] = stored ? JSON.parse(stored) : SEED_QUESTIONS;
      if (filters?.role) {
        list = list.filter(q => q.role === filters.role || q.role === 'Software Engineer' || filters.role === 'Custom Role');
      }
      if (filters?.category) {
        list = list.filter(q => q.category === filters.category);
      }
      if (filters?.difficulty) {
        list = list.filter(q => q.difficulty === filters.difficulty);
      }
      return list;
    }
  }

  async getInterviews(): Promise<Interview[]> {
    try {
      return await this.request<Interview[]>('/interviews');
    } catch {
      const stored = localStorage.getItem(STORAGE_KEYS.INTERVIEWS);
      return stored ? JSON.parse(stored) : DEMO_INTERVIEWS;
    }
  }

  async getInterviewById(id: string): Promise<Interview | null> {
    try {
      return await this.request<Interview>(`/interviews/${id}`);
    } catch {
      const all = await this.getInterviews();
      return all.find(i => i.id === id) || null;
    }
  }

  async createInterview(params: {
    role: RoleType | string;
    experienceLevel: string;
    interviewType: InterviewType;
    difficulty: DifficultyLevel;
    totalQuestions: number;
    skills: string[];
    isAdaptive: boolean;
  }): Promise<{ interview: Interview; questions: Question[] }> {
    try {
      return await this.request<{ interview: Interview; questions: Question[] }>('/interviews', {
        method: 'POST',
        body: JSON.stringify(params)
      });
    } catch {
      const user = await this.getCurrentUser();
      const generatedQuestions = SEED_QUESTIONS.slice(0, Math.min(params.totalQuestions, SEED_QUESTIONS.length));

      const newInterview: Interview = {
        id: `int_${Date.now()}`,
        user_id: user.id,
        role: params.role,
        interview_type: params.interviewType,
        difficulty: params.difficulty,
        total_questions: params.totalQuestions,
        score: 0,
        status: 'In Progress',
        started_at: new Date().toISOString(),
        skills_focused: params.skills,
        is_adaptive: params.isAdaptive,
        answers: []
      };

      const existing = await this.getInterviews();
      localStorage.setItem(STORAGE_KEYS.INTERVIEWS, JSON.stringify([newInterview, ...existing]));
      return { interview: newInterview, questions: generatedQuestions };
    }
  }

  async submitAnswer(
    interviewId: string,
    question: Question,
    candidateAnswer: string,
    role: string,
    difficulty: DifficultyLevel,
    timeSpentSeconds: number = 45
  ): Promise<{ answer: Answer; nextAdaptive?: { nextDifficulty: DifficultyLevel; explanation: string } }> {
    try {
      return await this.request<{ answer: Answer; nextAdaptive?: { nextDifficulty: DifficultyLevel; explanation: string } }>(
        `/interviews/${interviewId}/answers`,
        {
          method: 'POST',
          body: JSON.stringify({ question, candidateAnswer, role, difficulty, timeSpentSeconds })
        }
      );
    } catch {
      const evaluation: AnswerEvaluation = await aiService.evaluateAnswer(question, candidateAnswer, role, difficulty);

      const newAnswer: Answer = {
        id: `ans_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        interview_id: interviewId,
        question_id: question.id,
        question_text: question.question_text,
        category: question.category,
        difficulty: question.difficulty,
        answer_text: candidateAnswer,
        evaluation,
        time_spent_seconds: timeSpentSeconds
      };

      const interviews = await this.getInterviews();
      const interview = interviews.find(i => i.id === interviewId);
      if (interview) {
        interview.answers.push(newAnswer);
        localStorage.setItem(STORAGE_KEYS.INTERVIEWS, JSON.stringify(interviews));
      }

      const adaptiveInfo = aiService.getNextAdaptiveDifficulty(evaluation.overall_score, difficulty);

      return {
        answer: newAnswer,
        nextAdaptive: {
          nextDifficulty: adaptiveInfo.nextDifficulty,
          explanation: adaptiveInfo.explanation
        }
      };
    }
  }

  async finalizeInterview(interviewId: string): Promise<Interview> {
    try {
      return await this.request<Interview>(`/interviews/${interviewId}/results`);
    } catch {
      const interviews = await this.getInterviews();
      const interview = interviews.find(i => i.id === interviewId);
      if (!interview) throw new Error('Interview not found');

      const answers = interview.answers || [];
      const totalAnswers = answers.length;
      const overallScore = totalAnswers > 0
        ? Math.round(answers.reduce((acc, a) => acc + (a.evaluation?.overall_score || 0), 0) / totalAnswers)
        : 75;

      const techScores = answers.map(a => a.evaluation?.technical_accuracy || 75);
      const commScores = answers.map(a => a.evaluation?.communication || 75);
      const psScores = answers.map(a => a.evaluation?.completeness || 75);
      const relScores = answers.map(a => a.evaluation?.relevance || 75);
      const clarScores = answers.map(a => a.evaluation?.clarity || 75);

      const avg = (arr: number[]) => Math.round(arr.reduce((a, b) => a + b, 0) / (arr.length || 1));

      interview.score = overallScore;
      interview.status = 'Completed';
      interview.completed_at = new Date().toISOString();
      interview.duration_minutes = Math.max(8, Math.round(totalAnswers * 3.5));
      interview.category_scores = {
        technical_knowledge: avg(techScores),
        communication: avg(commScores),
        problem_solving: avg(psScores),
        role_knowledge: avg(clarScores),
        answer_relevance: avg(relScores)
      };

      interview.top_strengths = [
        'Structured understanding of core architectural concepts',
        'Direct answering style that addresses question prompts without hesitation',
        'Demonstrated awareness of real-world edge cases'
      ];

      interview.top_weaknesses = [
        'Could include more detailed time/space complexity comparisons',
        'Spring Boot configuration mechanics require deeper precision'
      ];

      interview.overall_verdict = overallScore >= 85 ? 'Excellent' : overallScore >= 70 ? 'Good' : overallScore >= 55 ? 'Fair' : 'Needs Improvement';

      localStorage.setItem(STORAGE_KEYS.INTERVIEWS, JSON.stringify(interviews));
      return interview;
    }
  }

  async deleteInterview(interviewId: string): Promise<boolean> {
    try {
      await this.request<{ success: boolean }>(`/interviews/${interviewId}`, { method: 'DELETE' });
    } catch {
      const list = await this.getInterviews();
      const filtered = list.filter(i => i.id !== interviewId);
      localStorage.setItem(STORAGE_KEYS.INTERVIEWS, JSON.stringify(filtered));
    }
    return true;
  }

  async getSkillGaps(): Promise<SkillGapAnalysis> {
    try {
      return await this.request<SkillGapAnalysis>('/skills/gaps');
    } catch {
      const stored = localStorage.getItem(STORAGE_KEYS.SKILL_GAPS);
      return stored ? JSON.parse(stored) : DEMO_SKILL_GAPS;
    }
  }

  async getImprovementPlan(): Promise<ImprovementPlan> {
    try {
      return await this.request<ImprovementPlan>('/improvement-plan');
    } catch {
      const stored = localStorage.getItem(STORAGE_KEYS.IMPROVEMENT_PLAN);
      return stored ? JSON.parse(stored) : DEMO_IMPROVEMENT_PLAN;
    }
  }

  async togglePlanTask(dayNumber: number, taskId: string, completed: boolean): Promise<ImprovementPlan> {
    try {
      return await this.request<ImprovementPlan>('/improvement-plan/task', {
        method: 'PUT',
        body: JSON.stringify({ dayNumber, taskId, completed })
      });
    } catch {
      const plan = await this.getImprovementPlan();
      const targetDay = plan.days.find(d => d.day === dayNumber);
      if (targetDay) {
        const task = targetDay.tasks.find(t => t.id === taskId);
        if (task) {
          task.completed = completed;
          targetDay.completed = targetDay.tasks.every(t => t.completed);
        }
      }
      localStorage.setItem(STORAGE_KEYS.IMPROVEMENT_PLAN, JSON.stringify(plan));
      return plan;
    }
  }

  async resetDemoData(): Promise<void> {
    try {
      await fetch('/api/demo/reset', { method: 'POST' });
    } catch {}
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(DEMO_USER));
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(DEMO_PROFILE));
    localStorage.setItem(STORAGE_KEYS.INTERVIEWS, JSON.stringify(DEMO_INTERVIEWS));
    localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(SEED_QUESTIONS));
    localStorage.setItem(STORAGE_KEYS.SKILL_GAPS, JSON.stringify(DEMO_SKILL_GAPS));
    localStorage.setItem(STORAGE_KEYS.IMPROVEMENT_PLAN, JSON.stringify(DEMO_IMPROVEMENT_PLAN));
  }
}

export const api = new ApiService();
