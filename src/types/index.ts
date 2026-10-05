export type RoleType = 
  | 'Java Backend Developer'
  | 'Full Stack Developer'
  | 'Frontend Developer'
  | 'Data Analyst'
  | 'AI/ML Engineer'
  | 'Software Engineer'
  | 'Custom Role';

export type ExperienceLevel = 'Fresher' | 'Beginner' | 'Intermediate' | 'Advanced';

export type InterviewType = 'Technical' | 'HR' | 'Behavioral' | 'Mixed';

export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard';

export type QuestionCategory = 
  | 'Java'
  | 'Spring Boot'
  | 'SQL'
  | 'DSA'
  | 'React'
  | 'DBMS'
  | 'OS'
  | 'Computer Networks'
  | 'HR'
  | 'Behavioral';

export interface User {
  id: string;
  name: string;
  email: string;
  college: string;
  degree: string;
  graduation_year: number;
  experience_level: ExperienceLevel;
  preferred_role: RoleType;
  created_at: string;
  auth_provider?: 'google' | 'email' | 'demo';
  avatar_url?: string;
}

export interface Profile {
  id: string;
  user_id: string;
  skills: string[];
  projects: {
    title: string;
    description: string;
    tech_stack: string[];
    link?: string;
  }[];
  certifications: string[];
  internships: string[];
  education: string;
  resume_text: string;
  profile_strength: number;
  missing_skills: string[];
  recommended_topics: string[];
}

export interface Question {
  id: string;
  role: RoleType | string;
  category: QuestionCategory;
  difficulty: DifficultyLevel;
  question_text: string;
  expected_points: string[];
  sample_answer?: string;
  is_adaptive?: boolean;
}

export interface AnswerEvaluation {
  overall_score: number; // 0-100
  technical_accuracy: number;
  relevance: number;
  completeness: number;
  communication: number;
  clarity: number;
  strengths: string[];
  weaknesses: string[];
  improvement_suggestions: string[];
  expected_points: string[];
  adaptive_action?: 'increase' | 'maintain' | 'decrease';
  adaptive_explanation?: string;
}

export interface Answer {
  id: string;
  interview_id: string;
  question_id: string;
  question_text: string;
  category: QuestionCategory;
  difficulty: DifficultyLevel;
  answer_text: string;
  evaluation: AnswerEvaluation;
  time_spent_seconds?: number;
}

export interface Interview {
  id: string;
  user_id: string;
  role: RoleType | string;
  interview_type: InterviewType;
  difficulty: DifficultyLevel;
  total_questions: number;
  score: number; // Overall final score 0-100
  status: 'In Progress' | 'Completed' | 'Abandoned';
  started_at: string;
  completed_at?: string;
  duration_minutes?: number;
  skills_focused: string[];
  is_adaptive: boolean;
  answers: Answer[];
  category_scores?: {
    technical_knowledge: number;
    communication: number;
    problem_solving: number;
    role_knowledge: number;
    answer_relevance: number;
  };
  top_strengths?: string[];
  top_weaknesses?: string[];
  overall_verdict?: 'Excellent' | 'Good' | 'Fair' | 'Needs Improvement';
}

export interface SkillGapItem {
  skill: string;
  status: 'Strong' | 'Needs Improvement' | 'Critical';
  proficiency_score: number; // 0-100
  category: string;
  recommended_actions: string[];
}

export interface SkillGapAnalysis {
  role: string;
  analyzed_at: string;
  overall_readiness: number;
  skills: SkillGapItem[];
  critical_missing: string[];
  recommended_practice: {
    id: string;
    title: string;
    type: 'questions' | 'revision' | 'mock';
    detail: string;
    action_url?: string;
  }[];
}

export interface ImprovementPlanDay {
  day: number;
  title: string;
  topic: string;
  description: string;
  tasks: {
    id: string;
    task: string;
    completed: boolean;
    est_minutes: number;
  }[];
  completed: boolean;
}

export interface ImprovementPlan {
  id: string;
  user_id: string;
  interview_id?: string;
  created_at: string;
  target_role: string;
  days: ImprovementPlanDay[];
}

export interface DashboardStats {
  interviews_completed: number;
  average_score: number;
  best_score: number;
  current_streak: number;
  score_trend: {
    date: string;
    score: number;
    role: string;
  }[];
  skill_analysis: {
    technical: number;
    communication: number;
    problem_solving: number;
    confidence_clarity: number;
    role_knowledge: number;
  };
  recent_interviews: Interview[];
  recommended_actions: {
    id: string;
    title: string;
    subtitle: string;
    category: string;
    badge: string;
    target_action: string;
  }[];
}
