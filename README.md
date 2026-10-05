# InterviewAI: AI-Powered Mock Interview & Career Preparation Platform

> **College Hackathon Project**  
> **Problem Statement:** “AI-based Mock Interview Simulator”  
> **Tagline:** *“Practice Smarter. Interview Better.”*

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Spring Boot Compatible](https://img.shields.io/badge/Backend-Java%2017%20%7C%20Spring%20Boot%203-brightgreen.svg)](#spring-boot-architecture)
[![Frontend](https://img.shields.io/badge/Frontend-React%20%7C%20TypeScript%20%7C%20Tailwind-blue.svg)](#frontend-architecture)
[![AI Engine](https://img.shields.io/badge/AI%20Engine-Adaptive%20Rubrics%20%2B%20Gemini-purple.svg)](#ai-evaluation-architecture)

---

## 1. Executive Summary & Problem Description

### Problem Statement
University engineering students and entry-level software developers often struggle to convert technical knowledge into successful interview outcomes. Traditional interview preparation relies on memorizing static LeetCode answers or static flashcards. Candidates lack:
1. **Realistic Pressure**: Timed, verbal, and conversational simulators under realistic time pressure.
2. **Actionable Feedback**: Beyond binary "pass/fail", candidates need rubric-based evaluation of technical accuracy, relevance, communication, and completeness.
3. **Adaptive Questioning**: Real human interviewers dynamically adjust difficulty based on prior answers.
4. **Structured Recovery**: Clear visibility into exact skill gaps (e.g., strong in Java OOP, but critical gap in Exception Handling) and an actionable 7-day study plan.

### The Solution: InterviewAI
**InterviewAI** is an enterprise-grade AI-powered mock interview simulator and career preparation platform. It simulates high-pressure technical screenings, provides real-time rubric evaluations, adapts next-question difficulty dynamically, analyzes resume skill gaps, and generates a personalized 7-day recovery roadmap.

---

## 2. Key Features

1. **Adaptive AI Mock Interview Room**
   - Left-panel AI Interviewer persona with countdown timer, audio Text-To-Speech (reads questions aloud), and evaluation hints.
   - Right-panel candidate console with character/word counter, Web Speech voice dictation (microphone), and quick demo answers for judge evaluations.
   - **Adaptive Difficulty Engine**:
     - $\ge 80\%$ score: Escalates next question to a higher difficulty tier.
     - $50-79\%$ score: Maintains difficulty to test consistency.
     - $< 50\%$ score: Provides fundamental concept review questions.

2. **Multi-Factor Rubric Evaluation**
   - Overall Score out of 100.
   - Technical Accuracy, Relevance, Completeness, Communication, and Clarity breakdown.
   - Distinct **Strengths (✓)**, **Areas for Improvement (⚠)**, and **Coaching Suggestions**.
   - Side-by-side comparison of candidate answer vs. expected technical key points.

3. **Post-Interview Scorecard**
   - Category radar/bar scores: Technical Knowledge, Communication, Problem Solving, Role Knowledge, and Relevance.
   - Overall Performance verdict (Excellent, Good, Fair, Needs Improvement).
   - Question-by-question review with expandable full transcripts.

4. **Skill Gap Analyzer**
   - Categorizes skills into **Strong**, **Needs Improvement**, and **Critical**.
   - Example for *Java Backend Developer*: Strong in Java OOP & Collections; Needs Improvement in Spring Boot & SQL joins; Critical gap in `@ControllerAdvice` Exception Handling.
   - Direct 1-click links to targeted practice drills.

5. **Personalized 7-Day Improvement Plan**
   - Tailored study calendar generated directly from missed interview points.
   - Interactive daily task checklists with estimated completion minutes.

6. **Candidate Profile & Resume Analyzer**
   - Calculates Profile Strength score (72%).
   - Identifies missing skills (Docker, Spring Security, Advanced SQL).
   - Recommends interview topics based on parsed profile text.

7. **Curated 45+ Question Repository**
   - Categorized by Java, Spring Boot, SQL, DSA, React, DBMS, OS, Networks, HR, and Behavioral.
   - Search by keyword and filter by role or difficulty.

8. **Hackathon Judge Demo Mode**
   - 1-Click access pre-loaded with candidate **Alex Kumar**.
   - Pre-populated interview history, scorecards, skill gap matrix, and 7-day plan.
   - 1-Click "Reset Demo Data" to restore pristine evaluation states anytime.

---

## 3. Technology Stack & Spring Boot Compatibility

### Official Problem Criteria Alignment
| Official Problem Requirement | InterviewAI Implementation |
|---|---|
| **Java 17+** | Architecture blueprint, entities, and controllers written for Java 17 LTS records and switch expressions. |
| **Spring Boot** | Decoupled REST API contracts (`/api/v1/*`) compatible with Spring Boot 3.3.x. |
| **Spring Data JPA & Hibernate** | Relational schema mapped with UUID primary keys and foreign key constraints. |
| **PostgreSQL / MySQL** | DDL migrations (`schema.sql`) for tables, indexes, and JSONB payloads. |
| **React & TypeScript** | React 19 + TypeScript + Tailwind CSS modern SPA frontend. |
| **REST APIs** | Standardized JSON request/response DTOs with HTTP status codes (200, 201, 400, 404). |
| **Git / GitHub** | Clean repository layout with modular structure and `.gitignore`. |

---

## 4. System Architecture

```
┌────────────────────────────────────────────────────────┐
│                   React 19 Frontend                    │
│   (Vite + TypeScript + Tailwind CSS + Lucide Icons)    │
└───────────────────────────▲────────────────────────────┘
                            │ REST / JSON (HTTP)
┌───────────────────────────▼────────────────────────────┐
│              Spring Boot REST Controller Layer         │
│  InterviewController | QuestionController | Profile    │
└───────────────────────────▲────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│                     Service Layer                      │
│   InterviewServiceImpl | AdaptiveEngine | AIService    │
│   (Evaluates Answers, Computes Rubrics, Adapts Diff)   │
└───────────────────────────▲────────────────────────────┘
                            │
              ┌─────────────┴─────────────┐
              │                           │
┌─────────────▼────────────┐ ┌────────────▼─────────────┐
│  Spring Data JPA / ORM   │ │    AI Evaluation Engine   │
│  PostgreSQL / MySQL DDL  │ │ Deterministic Rubrics +   │
│  (users, interviews,     │ │ Gemini API Server Proxy   │
│   questions, answers)    │ │                           │
└──────────────────────────┘ └───────────────────────────┘
```

---

## 5. Database Schema (PostgreSQL DDL)

```sql
-- 1. Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    college VARCHAR(255),
    degree VARCHAR(255),
    graduation_year INT,
    experience_level VARCHAR(50) DEFAULT 'Fresher',
    preferred_role VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Profiles Table
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    skills TEXT[],
    projects JSONB,
    certifications TEXT[],
    resume_text TEXT,
    profile_strength INT DEFAULT 70
);

-- 3. Interviews Table
CREATE TABLE interviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(100) NOT NULL,
    interview_type VARCHAR(50) NOT NULL,
    difficulty VARCHAR(20) NOT NULL,
    total_questions INT NOT NULL,
    score INT DEFAULT 0,
    status VARCHAR(30) DEFAULT 'In Progress',
    is_adaptive BOOLEAN DEFAULT TRUE,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE
);

-- 4. Questions Table
CREATE TABLE questions (
    id VARCHAR(100) PRIMARY KEY,
    role VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    difficulty VARCHAR(20) NOT NULL,
    question_text TEXT NOT NULL,
    expected_points TEXT[] NOT NULL,
    sample_answer TEXT
);

-- 5. Answers Table
CREATE TABLE answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    interview_id UUID NOT NULL REFERENCES interviews(id) ON DELETE CASCADE,
    question_id VARCHAR(100) NOT NULL,
    answer_text TEXT NOT NULL,
    technical_score INT,
    overall_score INT,
    evaluation_json JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Improvement Plans Table
CREATE TABLE improvement_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    interview_id UUID REFERENCES interviews(id),
    target_role VARCHAR(100) NOT NULL,
    plan_data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

---

## 6. REST API Endpoints Specification

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/login` | Authenticate candidate & return JWT token |
| `POST` | `/api/auth/register` | Register new student profile |
| `GET` | `/api/profile` | Retrieve candidate skills, resume, and strength |
| `PUT` | `/api/profile` | Update profile information and skills |
| `POST` | `/api/interviews` | Initialize new interview session & generate questions |
| `GET` | `/api/interviews` | Retrieve candidate interview history |
| `GET` | `/api/interviews/{id}` | Get interview transcript and status |
| `POST` | `/api/interviews/{id}/answers` | Submit candidate answer & receive rubric evaluation |
| `GET` | `/api/interviews/{id}/results` | Finalize interview and generate Scorecard |
| `DELETE`| `/api/interviews/{id}` | Delete interview transcript |
| `GET` | `/api/questions` | Query Question Bank with role/category filters |
| `GET` | `/api/dashboard` | Get aggregate analytics, streaks, and trend metrics |
| `GET` | `/api/skills/gaps` | Get Skill Gap Analysis (Strong, Needs Improvement, Critical) |
| `GET` | `/api/improvement-plan` | Retrieve personalized 7-day study curriculum |
| `PUT` | `/api/improvement-plan/task`| Toggle completion status of daily study task |

---

## 7. Setup & Local Run Instructions

### Prerequisites
- Node.js 18+ / 20+
- npm 9+

### Quick Start
```bash
# 1. Clone repository
git clone https://github.com/your-username/interview-ai.git
cd interview-ai

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

Open your browser to `http://localhost:3000`.

---

## 8. Hackathon 3-Minute Demo Flow for Judges

1. **Landing Page**:
   - Observe the hero statement, 5-stage workflow, and feature overview.
   - Click **"Try Demo (Alex Kumar)"** or **"Launch Judge Demo"**.

2. **Dashboard**:
   - Notice the personalized greeting (*"Good evening, Alex Kumar"*).
   - Review 4 key metric cards: Interviews Completed (4), Avg Score (78%), Best Score (91%), and Streak (4 Days).
   - Examine the SVG score trend chart and competency radar bars.

3. **Create Mock Interview**:
   - Click **"Start New Interview"**.
   - Select **Java Backend Developer**, **Fresher**, **5 Questions**, and toggle **Adaptive Questioning**.
   - Click **"Generate Interview"**.

4. **Live Interview Room**:
   - Observe the Left Interviewer panel (Question number, Timer, Audio TTS reading question aloud).
   - On the Right panel, click **"Insert Demo Answer"** (quick test helper for judges).
   - Click **"Submit Answer"**.
   - Watch the AI evaluation rubric modal appear with criteria breakdown (Technical Accuracy, Relevance, Completeness, Clarity) and Adaptive difficulty adjustment notice.

5. **Scorecard**:
   - Review the final overall score /100 and confetti celebration.
   - Expand the question-by-question review to inspect the candidate answer vs expected key points.

6. **Skill Gap & 7-Day Plan**:
   - Navigate to **"Skill Gap"** to see Strong (Java OOP) vs Critical (Exception Handling).
   - Navigate to **"Improvement Plan"** and interactively check off Day 3 tasks.

7. **Spring Boot Specification**:
   - Click **"Spring Boot Spec"** in the top navigation to review the production Java 17 controller, service, repository, and entity code files.

---

## 9. Future Enhancements

- WebRTC live video proctoring and facial confidence/eye-contact sentiment analysis.
- PDF resume parser using Apache Tika or PDFBox on Spring Boot backend.
- Voice-only conversation mode using Gemini Live API WebSocket stream.
- Multi-speaker technical panel simulation (e.g. System Architect + HR Director dual questioning).

---

## 10. Contributors & License

Built with ❤️ for the College Hackathon. Licensed under the MIT License.
