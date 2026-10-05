import {
  User,
  Profile,
  Interview,
  Question,
  SkillGapAnalysis,
  ImprovementPlan,
  DashboardStats
} from '../types/index';

export const DEMO_USER: User = {
  id: 'usr_alex_kumar_01',
  name: 'Alex Kumar',
  email: 'alex.kumar@mit.edu',
  college: 'National Institute of Technology',
  degree: 'B.Tech in Computer Science & Engineering',
  graduation_year: 2026,
  experience_level: 'Fresher',
  preferred_role: 'Java Backend Developer',
  created_at: '2026-09-15T09:00:00Z',
};

export const DEMO_PROFILE: Profile = {
  id: 'prof_alex_01',
  user_id: 'usr_alex_kumar_01',
  skills: [
    'Java 17',
    'Object-Oriented Programming (OOP)',
    'Java Collections Framework',
    'Spring Boot basics',
    'REST APIs',
    'PostgreSQL',
    'MySQL',
    'Git / GitHub',
    'Data Structures & Algorithms',
    'Hibernate basics'
  ],
  projects: [
    {
      title: 'E-Commerce Microservices Platform',
      description: 'Built customer & order services using Java 17, Spring Boot, Spring Data JPA, and PostgreSQL with JWT authentication.',
      tech_stack: ['Java 17', 'Spring Boot', 'PostgreSQL', 'Docker', 'REST API'],
      link: 'https://github.com/alexkumar/ecommerce-microservices'
    },
    {
      title: 'Real-time Chat & Collaboration Server',
      description: 'WebSocket-based chat application with message history, group channels, and Redis caching.',
      tech_stack: ['Spring WebFlux', 'WebSocket', 'Redis', 'React'],
      link: 'https://github.com/alexkumar/realtime-chat'
    }
  ],
  certifications: [
    'Oracle Certified Associate: Java SE 8 Programmer',
    'HackerRank Problem Solving (5 Stars)',
    'AWS Cloud Practitioner (In Progress)'
  ],
  internships: [
    'Software Engineering Intern @ CloudScale Tech (May 2025 - July 2025): Developed internal REST endpoints, wrote unit tests with JUnit 5 and Mockito.'
  ],
  education: 'B.Tech in Computer Science & Engineering, NIT (CGPA: 8.8/10)',
  resume_text: `Alex Kumar | alex.kumar@mit.edu | GitHub: github.com/alexkumar
Passionate 2026 CS graduate with strong foundations in Java, OOP principles, Data Structures, and Spring Boot.
Experience building robust RESTful services, database schemas in PostgreSQL, and responsive frontends.
Looking for Full-time Entry Level Java Backend Developer or Software Engineer roles.`,
  profile_strength: 72,
  missing_skills: [
    'Spring Security (OAuth2 / JWT deep dive)',
    'Docker & Container Orchestration',
    'Advanced SQL (Window functions, Indexing & Query Optimization)'
  ],
  recommended_topics: [
    'Spring Boot Actuator & Metrics',
    'Exception Handling best practices (@ControllerAdvice)',
    'Database Transaction Management (@Transactional)'
  ]
};

export const SEED_QUESTIONS: Question[] = [
  {
    id: 'q_java_01',
    role: 'Java Backend Developer',
    category: 'Java',
    difficulty: 'Easy',
    question_text: 'What is the difference between ArrayList and LinkedList in Java?',
    expected_points: [
      'ArrayList is backed by dynamic array; LinkedList by doubly linked list',
      'ArrayList provides O(1) random access; LinkedList takes O(n) to traverse',
      'LinkedList provides faster O(1) insertion/deletion at known nodes; ArrayList takes O(n) due to shifting',
      'Memory overhead: LinkedList requires extra memory for node pointers (prev and next)'
    ],
    sample_answer: 'ArrayList is implemented as a resizable array, which provides O(1) time complexity for random access using an index. In contrast, LinkedList is implemented as a doubly linked list where each node contains pointers to its previous and next elements. Getting an element by index takes O(n) because it must traverse the list, but insertion and deletion at known positions takes O(1).'
  },
  {
    id: 'q_java_02',
    role: 'Java Backend Developer',
    category: 'Java',
    difficulty: 'Medium',
    question_text: 'Explain the internal working of HashMap in Java, including collision resolution.',
    expected_points: [
      'HashMap works on hashing principle using hashCode() and equals()',
      'Internal structure is an array of Node buckets (Node<K,V>[] table)',
      'Collision resolution uses chaining; in Java 8+, converts to Red-Black tree when bucket reaches 8 nodes and capacity >= 64',
      'Treeification reduces worst case search time from O(n) to O(log n)'
    ],
    sample_answer: 'HashMap in Java is based on hashing. It maintains an array of buckets. When put(K, V) is invoked, Java calculates the key hash and finds the bucket index via (n-1) & hash. If collisions happen, it initially chains nodes in a linked list. In Java 8+, when bucket length reaches 8 and overall capacity is >= 64, it converts to a Red-Black tree, improving lookup from O(n) to O(log n).'
  },
  {
    id: 'q_spring_01',
    role: 'Java Backend Developer',
    category: 'Spring Boot',
    difficulty: 'Easy',
    question_text: 'What is dependency injection and Inversion of Control (IoC) in Spring Boot?',
    expected_points: [
      'IoC delegates object creation and lifecycle management to the Spring IoC container',
      'Dependency Injection (DI) is the pattern implementing IoC by injecting dependencies into dependent components',
      'Constructor injection is recommended over field injection for immutability and unit testing'
    ],
    sample_answer: 'Inversion of Control (IoC) is a design principle where control of object creation, configuration, and lifecycle is inverted from application code to the framework container. Dependency Injection (DI) implements IoC by supplying dependencies at runtime. Constructor injection is preferred because it ensures immutability and makes unit testing with Mockito clean and straightforward.'
  },
  {
    id: 'q_spring_03',
    role: 'Java Backend Developer',
    category: 'Spring Boot',
    difficulty: 'Medium',
    question_text: 'How do you handle exceptions globally in a Spring Boot REST API?',
    expected_points: [
      'Use @RestControllerAdvice (or @ControllerAdvice) along with @ExceptionHandler methods',
      'Create standardized error response DTO containing timestamp, status code, error, and path',
      'Map specific exceptions like ResourceNotFoundException to 404 and MethodArgumentNotValidException to 400'
    ],
    sample_answer: 'In Spring Boot, global exception handling is implemented using @RestControllerAdvice. Within this class, methods annotated with @ExceptionHandler intercept specific exceptions thrown from controllers, packaging them into standardized error payloads with appropriate HTTP status codes like 404 Not Found or 400 Bad Request.'
  },
  {
    id: 'q_sql_01',
    role: 'Java Backend Developer',
    category: 'SQL',
    difficulty: 'Easy',
    question_text: 'Explain the difference between INNER JOIN and LEFT JOIN with practical examples.',
    expected_points: [
      'INNER JOIN returns only rows that have matching values in both tables',
      'LEFT JOIN returns all rows from the left table, with NULL for unmatched right-side columns',
      'Example: Users and Orders. INNER JOIN yields only users with orders; LEFT JOIN yields all users'
    ],
    sample_answer: 'INNER JOIN returns only records where the join predicate matches in both tables, such as users who have placed orders. LEFT JOIN returns every row from the left table regardless of whether a match exists on the right; missing columns in the right table are filled with NULL values.'
  }
];

export const DEMO_INTERVIEWS: Interview[] = [
  {
    id: 'int_001',
    user_id: 'usr_alex_kumar_01',
    role: 'Java Backend Developer',
    interview_type: 'Technical',
    difficulty: 'Medium',
    total_questions: 5,
    score: 78,
    status: 'Completed',
    started_at: '2026-10-04T14:30:00Z',
    completed_at: '2026-10-04T15:02:00Z',
    duration_minutes: 32,
    skills_focused: ['Java', 'Spring Boot', 'SQL', 'OOP'],
    is_adaptive: true,
    category_scores: {
      technical_knowledge: 82,
      communication: 74,
      problem_solving: 80,
      role_knowledge: 76,
      answer_relevance: 79
    },
    top_strengths: [
      'Strong grasp of Java memory model and collection internals',
      'Accurate understanding of IoC and dependency injection patterns',
      'Good conceptual clarity regarding SQL joins and indexing'
    ],
    top_weaknesses: [
      'Omitted edge cases in concurrent hash map re-hashing',
      'Spring Boot auto-configuration explanation missed @ConditionalOnMissingBean details',
      'Could structure behavioral answers with sharper metrics'
    ],
    overall_verdict: 'Good',
    answers: [
      {
        id: 'ans_001_1',
        interview_id: 'int_001',
        question_id: 'q_java_01',
        question_text: 'What is the difference between ArrayList and LinkedList in Java?',
        category: 'Java',
        difficulty: 'Easy',
        answer_text: 'ArrayList uses an array internally so it is faster for accessing elements with an index O(1). LinkedList uses a doubly linked list where each element has pointers to prev and next.',
        evaluation: {
          overall_score: 85,
          technical_accuracy: 88,
          relevance: 90,
          completeness: 80,
          communication: 82,
          clarity: 85,
          strengths: ['Identified dynamic array vs doubly linked list', 'Accurate O(1) index lookup'],
          weaknesses: ['Did not mention pointer memory overhead in LinkedList'],
          improvement_suggestions: ['Add explicit memory trade-off comparison.'],
          expected_points: ['ArrayList dynamic array', 'LinkedList doubly linked list', 'O(1) random access'],
          adaptive_action: 'increase',
          adaptive_explanation: 'Score >= 80: Next question escalated to Medium difficulty.'
        }
      }
    ]
  },
  {
    id: 'int_002',
    user_id: 'usr_alex_kumar_01',
    role: 'Java Backend Developer',
    interview_type: 'Technical',
    difficulty: 'Hard',
    total_questions: 5,
    score: 84,
    status: 'Completed',
    started_at: '2026-10-02T10:00:00Z',
    completed_at: '2026-10-02T10:35:00Z',
    duration_minutes: 35,
    skills_focused: ['Java Concurrency', 'JVM', 'ACID', 'Indexing'],
    is_adaptive: true,
    category_scores: {
      technical_knowledge: 86,
      communication: 80,
      problem_solving: 85,
      role_knowledge: 84,
      answer_relevance: 85
    },
    top_strengths: ['Clear articulation of JVM GC generations', 'Solid grasp of ACID isolation'],
    top_weaknesses: ['Minor gap on B+ Tree branching factor'],
    overall_verdict: 'Excellent',
    answers: []
  },
  {
    id: 'int_003',
    user_id: 'usr_alex_kumar_01',
    role: 'Software Engineer',
    interview_type: 'Mixed',
    difficulty: 'Medium',
    total_questions: 5,
    score: 91,
    status: 'Completed',
    started_at: '2026-09-28T16:00:00Z',
    completed_at: '2026-09-28T16:29:00Z',
    duration_minutes: 29,
    skills_focused: ['DSA', 'OOP', 'OS', 'Behavioral'],
    is_adaptive: false,
    category_scores: {
      technical_knowledge: 92,
      communication: 88,
      problem_solving: 94,
      role_knowledge: 90,
      answer_relevance: 91
    },
    top_strengths: ['Flawless explanation of Floyd Cycle Detection', 'Well-structured STAR answers'],
    top_weaknesses: ['Pacing was slightly fast on algorithm walk-through'],
    overall_verdict: 'Excellent',
    answers: []
  },
  {
    id: 'int_004',
    user_id: 'usr_alex_kumar_01',
    role: 'Full Stack Developer',
    interview_type: 'Technical',
    difficulty: 'Medium',
    total_questions: 5,
    score: 68,
    status: 'Completed',
    started_at: '2026-09-24T11:15:00Z',
    completed_at: '2026-09-24T11:43:00Z',
    duration_minutes: 28,
    skills_focused: ['React Hooks', 'State Management', 'REST'],
    is_adaptive: true,
    category_scores: {
      technical_knowledge: 70,
      communication: 68,
      problem_solving: 65,
      role_knowledge: 67,
      answer_relevance: 70
    },
    top_strengths: ['Understands React functional components and useEffect cleanup'],
    top_weaknesses: ['Confused useMemo and useCallback mechanics'],
    overall_verdict: 'Fair',
    answers: []
  }
];

export const DEMO_SKILL_GAPS: SkillGapAnalysis = {
  role: 'Java Backend Developer',
  analyzed_at: '2026-10-05T10:00:00Z',
  overall_readiness: 76,
  skills: [
    {
      skill: 'Java OOP & Core Syntax',
      status: 'Strong',
      proficiency_score: 92,
      category: 'Java',
      recommended_actions: ['Maintain readiness with advanced multithreading challenges']
    },
    {
      skill: 'Java Collections Framework',
      status: 'Strong',
      proficiency_score: 88,
      category: 'Java',
      recommended_actions: ['Practice ConcurrentHashMap and CopyOnWriteArrayList scenarios']
    },
    {
      skill: 'Spring Boot Architecture',
      status: 'Needs Improvement',
      proficiency_score: 68,
      category: 'Framework',
      recommended_actions: ['Practice 10 Spring Boot auto-configuration questions']
    },
    {
      skill: 'REST API Design & Standards',
      status: 'Needs Improvement',
      proficiency_score: 70,
      category: 'API',
      recommended_actions: ['Complete 5 REST API error response problems']
    },
    {
      skill: 'SQL Joins & Indexing',
      status: 'Needs Improvement',
      proficiency_score: 65,
      category: 'Database',
      recommended_actions: ['Revise SQL joins, execution plans (EXPLAIN), and index types']
    },
    {
      skill: 'Exception Handling & @ControllerAdvice',
      status: 'Critical',
      proficiency_score: 48,
      category: 'Robustness',
      recommended_actions: ['Deep dive into centralized error handling architectures']
    },
    {
      skill: 'Spring Security & JWT',
      status: 'Critical',
      proficiency_score: 42,
      category: 'Security',
      recommended_actions: ['Build end-to-end OAuth2 & JWT filter chain']
    }
  ],
  critical_missing: [
    'Global Exception Handling (@ControllerAdvice pattern)',
    'Spring Security SecurityFilterChain & Token Verification',
    'Database Concurrency & Transaction Isolation tuning'
  ],
  recommended_practice: [
    {
      id: 'rp_1',
      title: 'Practice 10 Spring Boot Questions',
      type: 'questions',
      detail: 'Deep dive into bean lifecycle, scopes, auto-configuration, and @Conditional annotations.',
      action_url: '/create?role=Java%20Backend%20Developer&type=Technical'
    },
    {
      id: 'rp_2',
      title: 'Revise SQL Joins & Query Tuning',
      type: 'revision',
      detail: 'Analyze query execution plans, avoid full table scans, and master multi-table OUTER joins.',
      action_url: '/questions?category=SQL'
    },
    {
      id: 'rp_3',
      title: 'Complete 5 REST API Problems',
      type: 'mock',
      detail: 'Practice proper HTTP status codes, validation error payloads, and idempotent PUT vs POST.',
      action_url: '/create?role=Java%20Backend%20Developer&skills=REST%20API'
    }
  ]
};

export const DEMO_IMPROVEMENT_PLAN: ImprovementPlan = {
  id: 'plan_alex_01',
  user_id: 'usr_alex_kumar_01',
  interview_id: 'int_001',
  created_at: '2026-10-04T15:05:00Z',
  target_role: 'Java Backend Developer',
  days: [
    {
      day: 1,
      title: 'Java OOP Revision & Core Principles',
      topic: 'Encapsulation, Polymorphism, Abstraction, SOLID principles',
      description: 'Solidify object-oriented architecture and design patterns commonly evaluated in screenings.',
      completed: true,
      tasks: [
        { id: 'd1_t1', task: 'Revise 5 SOLID principles with concrete Java examples', completed: true, est_minutes: 30 },
        { id: 'd1_t2', task: 'Practice Method Overriding vs Overloading and covariant return types', completed: true, est_minutes: 25 },
        { id: 'd1_t3', task: 'Complete 5 OOP interview questions in the Question Bank', completed: true, est_minutes: 35 }
      ]
    },
    {
      day: 2,
      title: 'Java Collections Framework Deep Dive',
      topic: 'HashMap internals, Concurrent Collections, Set & List mechanics',
      description: 'Master time/space complexities, collision handling, and thread-safe collections.',
      completed: true,
      tasks: [
        { id: 'd2_t1', task: 'Review HashMap treeification threshold (Java 8 Red-Black Tree)', completed: true, est_minutes: 30 },
        { id: 'd2_t2', task: 'Compare ArrayList vs LinkedList and ArrayDeque use-cases', completed: true, est_minutes: 25 },
        { id: 'd2_t3', task: 'Analyze ConcurrentHashMap segmented locking vs CAS mechanics', completed: true, est_minutes: 35 }
      ]
    },
    {
      day: 3,
      title: 'Exception Handling & Architecture',
      topic: '@ControllerAdvice, Checked vs Unchecked, Global Error DTOs',
      description: 'Eliminate the critical skill gap identified during your recent interview evaluation.',
      completed: false,
      tasks: [
        { id: 'd3_t1', task: 'Study Throwable hierarchy: Error vs Exception (Checked vs RuntimeException)', completed: true, est_minutes: 25 },
        { id: 'd3_t2', task: 'Build a standard RestExceptionHandler using @RestControllerAdvice', completed: false, est_minutes: 40 },
        { id: 'd3_t3', task: 'Implement custom business exceptions with HTTP status mapping', completed: false, est_minutes: 30 }
      ]
    },
    {
      day: 4,
      title: 'Spring Boot Fundamentals & Lifecycle',
      topic: 'IoC, DI types, Bean Scopes, Auto-configuration mechanism',
      description: 'Gain complete confidence explaining what happens behind @SpringBootApplication.',
      completed: false,
      tasks: [
        { id: 'd4_t1', task: 'Trace AutoConfigurationImportSelector and META-INF descriptor paths', completed: false, est_minutes: 35 },
        { id: 'd4_t2', task: 'Compare Constructor vs Setter vs Field injection with unit tests', completed: false, est_minutes: 30 },
        { id: 'd4_t3', task: 'Practice 4 Spring Boot questions in InterviewAI practice room', completed: false, est_minutes: 40 }
      ]
    },
    {
      day: 5,
      title: 'REST APIs & Web Layer Best Practices',
      topic: 'HTTP Methods, Status Codes, Validation, Pagination, Idempotency',
      description: 'Refine industry-grade API contract design and request validation.',
      completed: false,
      tasks: [
        { id: 'd5_t1', task: 'Implement @Valid and Hibernate Validator constraints with error formatting', completed: false, est_minutes: 35 },
        { id: 'd5_t2', task: 'Review Idempotency rules for POST, PUT, PATCH, and DELETE', completed: false, est_minutes: 25 },
        { id: 'd5_t3', task: 'Study Spring Data Pageable and Slice mechanics for large datasets', completed: false, est_minutes: 30 }
      ]
    },
    {
      day: 6,
      title: 'SQL, Joins & Database Indexing',
      topic: 'INNER/LEFT/CROSS Joins, B+ Trees, ACID, Query Optimization',
      description: 'Strengthen database query mechanics, execution plans, and transaction boundaries.',
      completed: false,
      tasks: [
        { id: 'd6_t1', task: 'Solve 5 complex SQL join and aggregation queries', completed: false, est_minutes: 40 },
        { id: 'd6_t2', task: 'Study Clustered vs Non-Clustered index trade-offs on disk', completed: false, est_minutes: 30 },
        { id: 'd6_t3', task: 'Explain database isolation levels and dirty/phantom read prevention', completed: false, est_minutes: 35 }
      ]
    },
    {
      day: 7,
      title: 'Full Adaptive Mock Interview & Evaluation',
      topic: 'Simulated 10-Question Technical & Behavioral Panel',
      description: 'Put your week-long preparation to the test under timed conditions with real-time AI feedback.',
      completed: false,
      tasks: [
        { id: 'd7_t1', task: 'Complete a full 10-Question Java Backend Developer Mock Interview', completed: false, est_minutes: 45 },
        { id: 'd7_t2', task: 'Review new Scorecard and compare before/after readiness scores', completed: false, est_minutes: 20 },
        { id: 'd7_t3', task: 'Export progress report for hackathon showcase', completed: false, est_minutes: 15 }
      ]
    }
  ]
};

export const DEMO_DASHBOARD_STATS: DashboardStats = {
  interviews_completed: 4,
  average_score: 78,
  best_score: 91,
  current_streak: 4,
  score_trend: [
    { date: 'Sep 24', score: 68, role: 'Full Stack' },
    { date: 'Sep 28', score: 91, role: 'Software Engineer' },
    { date: 'Oct 02', score: 84, role: 'Java Backend' },
    { date: 'Oct 04', score: 78, role: 'Java Backend' }
  ],
  skill_analysis: {
    technical: 84,
    communication: 76,
    problem_solving: 83,
    confidence_clarity: 79,
    role_knowledge: 80
  },
  recent_interviews: DEMO_INTERVIEWS,
  recommended_actions: [
    {
      id: 'rec_1',
      title: 'Improve Java Collections',
      subtitle: 'Focus on HashMap treeification and concurrent maps',
      category: 'Technical',
      badge: 'High Impact',
      target_action: '/questions?category=Java'
    },
    {
      id: 'rec_2',
      title: 'Practice HR Questions',
      subtitle: 'Sharpen your STAR methodology behavioral answers',
      category: 'Behavioral',
      badge: 'Confidence',
      target_action: '/create?type=HR'
    },
    {
      id: 'rec_3',
      title: 'Improve SQL Fundamentals',
      subtitle: 'Review join differences and transaction isolation',
      category: 'Database',
      badge: 'Core Skill',
      target_action: '/questions?category=SQL'
    },
    {
      id: 'rec_4',
      title: 'Practice Spring Boot Interview',
      subtitle: 'Simulate a 5-question technical panel on Spring Boot',
      category: 'Framework',
      badge: 'Target Role',
      target_action: '/create?role=Java%20Backend%20Developer&type=Technical'
    }
  ]
};
