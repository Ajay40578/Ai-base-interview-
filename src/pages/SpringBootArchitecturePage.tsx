import React, { useState } from 'react';
import {
  Code2,
  Layers,
  Database,
  Server,
  FileCode,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  Cpu
} from 'lucide-react';

export const SpringBootArchitecturePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'controller' | 'service' | 'repository' | 'entity' | 'dto' | 'exception' | 'schema'
  >('controller');
  const [copied, setCopied] = useState(false);

  const codeSnippets: Record<string, { filename: string; path: string; code: string }> = {
    controller: {
      filename: 'InterviewController.java',
      path: 'src/main/java/com/interviewai/controller/InterviewController.java',
      code: `package com.interviewai.controller;

import com.interviewai.dto.request.CreateInterviewRequest;
import com.interviewai.dto.request.SubmitAnswerRequest;
import com.interviewai.dto.response.InterviewResponse;
import com.interviewai.dto.response.ScorecardResponse;
import com.interviewai.service.InterviewService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/interviews")
@CrossOrigin(origins = "*")
public class InterviewController {

    private final InterviewService interviewService;

    @Autowired
    public InterviewController(InterviewService interviewService) {
        this.interviewService = interviewService;
    }

    @PostMapping
    public ResponseEntity<InterviewResponse> createInterview(
            @Valid @RequestBody CreateInterviewRequest request,
            @RequestAttribute("userId") UUID userId) {
        InterviewResponse response = interviewService.createInterview(request, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<InterviewResponse>> getUserInterviews(
            @RequestAttribute("userId") UUID userId) {
        return ResponseEntity.ok(interviewService.getInterviewsByUserId(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<InterviewResponse> getInterviewById(@PathVariable("id") UUID id) {
        return ResponseEntity.ok(interviewService.getInterviewById(id));
    }

    @PostMapping("/{id}/answers")
    public ResponseEntity<InterviewResponse.AnswerResult> submitAnswer(
            @PathVariable("id") UUID interviewId,
            @Valid @RequestBody SubmitAnswerRequest request) {
        return ResponseEntity.ok(interviewService.recordAndEvaluateAnswer(interviewId, request));
    }

    @GetMapping("/{id}/results")
    public ResponseEntity<ScorecardResponse> getScorecard(@PathVariable("id") UUID interviewId) {
        return ResponseEntity.ok(interviewService.calculateScorecard(interviewId));
    }
}`
    },
    service: {
      filename: 'InterviewServiceImpl.java',
      path: 'src/main/java/com/interviewai/service/impl/InterviewServiceImpl.java',
      code: `package com.interviewai.service.impl;

import com.interviewai.entity.Interview;
import com.interviewai.entity.Answer;
import com.interviewai.repository.InterviewRepository;
import com.interviewai.repository.QuestionRepository;
import com.interviewai.service.AIService;
import com.interviewai.service.InterviewService;
import com.interviewai.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Service
@Transactional
public class InterviewServiceImpl implements InterviewService {

    private final InterviewRepository interviewRepository;
    private final QuestionRepository questionRepository;
    private final AIService aiService;

    public InterviewServiceImpl(
            InterviewRepository interviewRepository,
            QuestionRepository questionRepository,
            AIService aiService) {
        this.interviewRepository = interviewRepository;
        this.questionRepository = questionRepository;
        this.aiService = aiService;
    }

    @Override
    public InterviewResponse.AnswerResult recordAndEvaluateAnswer(UUID interviewId, SubmitAnswerRequest request) {
        Interview interview = interviewRepository.findById(interviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Interview not found with id: " + interviewId));

        // Evaluate candidate answer using AI Evaluation Engine
        AnswerEvaluation evaluation = aiService.evaluateAnswer(
                request.questionId(),
                request.candidateAnswer(),
                interview.getRole(),
                interview.getDifficulty()
        );

        Answer answer = new Answer();
        answer.setInterview(interview);
        answer.setQuestionId(request.questionId());
        answer.setAnswerText(request.candidateAnswer());
        answer.setTechnicalScore(evaluation.technicalAccuracy());
        answer.setOverallScore(evaluation.overallScore());
        answer.setEvaluationJson(evaluation.toJson());

        interview.getAnswers().add(answer);
        interviewRepository.save(interview);

        return new InterviewResponse.AnswerResult(answer.getId(), evaluation);
    }
}`
    },
    repository: {
      filename: 'InterviewRepository.java',
      path: 'src/main/java/com/interviewai/repository/InterviewRepository.java',
      code: `package com.interviewai.repository;

import com.interviewai.entity.Interview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface InterviewRepository extends JpaRepository<Interview, UUID> {

    List<Interview> findByUserIdOrderByStartedAtDesc(UUID userId);

    @Query("SELECT i FROM Interview i LEFT JOIN FETCH i.answers WHERE i.id = :id")
    Optional<Interview> findByIdWithAnswers(@Param("id") UUID id);

    @Query("SELECT AVG(i.score) FROM Interview i WHERE i.userId = :userId AND i.status = 'Completed'")
    Double calculateAverageScoreByUserId(@Param("userId") UUID userId);
}`
    },
    entity: {
      filename: 'Interview.java',
      path: 'src/main/java/com/interviewai/entity/Interview.java',
      code: `package com.interviewai.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "interviews")
@Getter
@Setter
public class Interview {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "role", nullable = false, length = 100)
    private String role;

    @Column(name = "interview_type", nullable = false, length = 50)
    private String interviewType;

    @Column(name = "difficulty", nullable = false, length = 20)
    private String difficulty;

    @Column(name = "total_questions", nullable = false)
    private Integer totalQuestions;

    @Column(name = "score")
    private Integer score = 0;

    @Column(name = "status", nullable = false, length = 30)
    private String status = "In Progress";

    @Column(name = "is_adaptive", nullable = false)
    private Boolean isAdaptive = true;

    @CreationTimestamp
    @Column(name = "started_at", updatable = false)
    private Instant startedAt;

    @Column(name = "completed_at")
    private Instant completedAt;

    @OneToMany(mappedBy = "interview", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Answer> answers = new ArrayList<>();
}`
    },
    dto: {
      filename: 'SubmitAnswerRequest.java',
      path: 'src/main/java/com/interviewai/dto/request/SubmitAnswerRequest.java',
      code: `package com.interviewai.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public record SubmitAnswerRequest(
        @NotNull(message = "Question ID is mandatory")
        UUID questionId,

        @NotBlank(message = "Candidate answer cannot be empty")
        String candidateAnswer,

        Integer timeSpentSeconds
) {}`
    },
    exception: {
      filename: 'GlobalExceptionHandler.java',
      path: 'src/main/java/com/interviewai/exception/GlobalExceptionHandler.java',
      code: `package com.interviewai.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleNotFound(ResourceNotFoundException ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", Instant.now());
        body.put("status", HttpStatus.NOT_FOUND.value());
        body.put("error", "Resource Not Found");
        body.put("message", ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(body);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationErrors(MethodArgumentNotValidException ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", Instant.now());
        body.put("status", HttpStatus.BAD_REQUEST.value());
        body.put("error", "Validation Error");
        ex.getBindingResult().getFieldErrors().forEach(f -> body.put(f.getField(), f.getDefaultMessage()));
        return ResponseEntity.badRequest().body(body);
    }
}`
    },
    schema: {
      filename: 'schema.sql',
      path: 'src/main/resources/db/migration/V1__init_schema.sql',
      code: `-- PostgreSQL DDL Schema for InterviewAI

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

CREATE INDEX idx_interviews_user ON interviews(user_id);
CREATE INDEX idx_answers_interview ON answers(interview_id);`
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(codeSnippets[activeTab].code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-blue-200 text-xs font-semibold mb-2">
            <Code2 className="w-3.5 h-3.5 text-purple-300" />
            <span>Hackathon Official Compliance</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Java 17 + Spring Boot Backend Architecture
          </h1>
          <p className="mt-1 text-sm text-blue-100 max-w-2xl leading-relaxed">
            Designed to fulfill the official college hackathon problem statement requirements: Java 17+, Spring Boot, REST APIs, PostgreSQL/MySQL, JPA/Hibernate, and Git.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/20 text-center shrink-0">
          <span className="text-[10px] font-bold text-amber-300 uppercase block tracking-wider">
            Target Stack
          </span>
          <span className="text-xs font-bold text-white block mt-0.5">
            Spring Boot 3.3.x • Java 17 LTS
          </span>
        </div>
      </div>

      {/* Architecture Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-1">
            Controller Layer
          </div>
          <h4 className="text-sm font-bold text-slate-900">@RestController & DTOs</h4>
          <p className="text-xs text-slate-500 mt-1">
            Clean decoupled endpoints with Bean Validation (@Valid).
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider mb-1">
            Service Layer
          </div>
          <h4 className="text-sm font-bold text-slate-900">@Transactional Business Logic</h4>
          <p className="text-xs text-slate-500 mt-1">
            Adaptive engine, rubric computation, and AI API integration.
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[10px] font-bold text-purple-600 uppercase tracking-wider mb-1">
            Persistence Layer
          </div>
          <h4 className="text-sm font-bold text-slate-900">Spring Data JPA / Hibernate</h4>
          <p className="text-xs text-slate-500 mt-1">
            Entities, relations, lazy fetching, and custom JPQL queries.
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-1">
            Error Handling
          </div>
          <h4 className="text-sm font-bold text-slate-900">@RestControllerAdvice</h4>
          <p className="text-xs text-slate-500 mt-1">
            Unified global exceptions mapped to exact HTTP status codes.
          </p>
        </div>
      </div>

      {/* Code Browser */}
      <div className="bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden">
        {/* Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/60 px-4 py-2 overflow-x-auto">
          <div className="flex items-center gap-1">
            {[
              { id: 'controller', label: 'Controller' },
              { id: 'service', label: 'Service' },
              { id: 'repository', label: 'Repository' },
              { id: 'entity', label: 'Entity (JPA)' },
              { id: 'dto', label: 'DTO Record' },
              { id: 'exception', label: 'Exception Advice' },
              { id: 'schema', label: 'SQL Schema' },
            ].map((tab) => {
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600 text-white font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <button
            onClick={handleCopyCode}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700 shrink-0 ml-2"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Code</span>
              </>
            )}
          </button>
        </div>

        {/* File Path Indicator */}
        <div className="px-6 py-2.5 bg-slate-900 border-b border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
          <span>{codeSnippets[activeTab].path}</span>
          <span className="text-blue-400 font-bold">Java 17 LTS</span>
        </div>

        {/* Code Content */}
        <div className="p-6 overflow-x-auto max-h-[500px]">
          <pre className="text-xs font-mono text-slate-200 leading-relaxed">
            {codeSnippets[activeTab].code}
          </pre>
        </div>
      </div>
    </div>
  );
};
