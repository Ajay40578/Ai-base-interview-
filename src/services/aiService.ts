import { Question, AnswerEvaluation, DifficultyLevel, RoleType, InterviewType } from '../types/index';

export function evaluateAnswerDeterministically(
  question: Question,
  candidateAnswer: string
): AnswerEvaluation {
  const answer = candidateAnswer.trim();
  const wordCount = answer.split(/\s+/).filter(Boolean).length;
  
  const expectedPoints = question.expected_points || [];
  let matchedPointsCount = 0;
  const matchedPoints: string[] = [];
  const missedPoints: string[] = [];

  const lowerAnswer = answer.toLowerCase();

  for (const point of expectedPoints) {
    const keyWords = point
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 3 && !['with', 'from', 'this', 'that', 'have', 'when', 'used', 'than', 'into'].includes(w));
    
    const matchCount = keyWords.filter(kw => lowerAnswer.includes(kw)).length;
    const matchRatio = keyWords.length > 0 ? matchCount / keyWords.length : 0;

    if (matchRatio >= 0.3 || (matchCount >= 2 && keyWords.length <= 4)) {
      matchedPointsCount++;
      matchedPoints.push(point);
    } else {
      missedPoints.push(point);
    }
  }

  let lengthFactor = 1.0;
  if (wordCount < 15) {
    lengthFactor = 0.45;
  } else if (wordCount < 30) {
    lengthFactor = 0.7;
  } else if (wordCount < 50) {
    lengthFactor = 0.88;
  } else if (wordCount > 300) {
    lengthFactor = 0.95;
  }

  const pointMatchRatio = expectedPoints.length > 0 ? (matchedPointsCount / expectedPoints.length) : 0.6;
  
  let rawScore = (pointMatchRatio * 70 + (Math.min(wordCount, 120) / 120) * 30) * lengthFactor;
  rawScore = Math.max(30, Math.min(96, Math.round(rawScore)));

  if (wordCount < 5) {
    rawScore = 20;
  }

  const technicalAccuracy = Math.min(98, Math.max(25, Math.round(rawScore * 1.02)));
  const relevance = Math.min(95, Math.max(30, Math.round(rawScore * 0.98 + (wordCount > 20 ? 5 : 0))));
  const completeness = Math.min(95, Math.max(20, Math.round(pointMatchRatio * 85 + (wordCount > 60 ? 12 : 5))));
  const communication = Math.min(94, Math.max(35, Math.round(Math.min(wordCount, 80) / 80 * 40 + 50)));
  const clarity = Math.min(95, Math.max(30, Math.round(rawScore * 0.95 + (wordCount > 35 ? 4 : -5))));

  const strengths: string[] = [];
  if (matchedPoints.length > 0) {
    strengths.push(`Identified core concept: ${matchedPoints[0].split(';')[0].slice(0, 75)}.`);
  } else {
    strengths.push('Demonstrated foundational awareness of the topic area.');
  }

  if (wordCount >= 40) {
    strengths.push('Provided a reasonably detailed explanation with supporting context.');
  }
  if (technicalAccuracy >= 75) {
    strengths.push('Used accurate technical terminology and standard naming conventions.');
  }
  if (strengths.length < 2) {
    strengths.push('Structured response in an understandable, conversational tone.');
  }

  const weaknesses: string[] = [];
  if (missedPoints.length > 0) {
    weaknesses.push(`Omitted key consideration: "${missedPoints[0].split(';')[0].slice(0, 80)}".`);
  }
  if (wordCount < 35) {
    weaknesses.push('Explanation was brief; could elaborate on trade-offs or implementation details.');
  }
  if (missedPoints.length > 1) {
    weaknesses.push(`Could also mention: "${missedPoints[1].split(';')[0].slice(0, 80)}".`);
  }
  if (weaknesses.length === 0) {
    weaknesses.push('Could provide a concrete real-world code snippet or architectural diagram walk-through.');
  }

  const improvementSuggestions: string[] = [
    'Explain the concept first in one crisp sentence, then follow up with a practical code or system example.',
    'Highlight edge cases, time/space complexity, or memory overhead to demonstrate depth.'
  ];
  if (missedPoints.length > 0) {
    improvementSuggestions.unshift(`Include explicit mention of: ${missedPoints[0].slice(0, 90)}`);
  }

  let adaptiveAction: 'increase' | 'maintain' | 'decrease' = 'maintain';
  let adaptiveExplanation = 'Score between 50-79: Difficulty maintained to assess depth.';
  
  if (rawScore >= 80) {
    adaptiveAction = 'increase';
    adaptiveExplanation = 'Score >= 80: Outstanding answer! Escalating next question to a higher difficulty.';
  } else if (rawScore < 50) {
    adaptiveAction = 'decrease';
    adaptiveExplanation = 'Score < 50: Concept gap detected. Next question will focus on core fundamentals.';
  }

  return {
    overall_score: rawScore,
    technical_accuracy: technicalAccuracy,
    relevance,
    completeness,
    communication,
    clarity,
    strengths: strengths.slice(0, 3),
    weaknesses: weaknesses.slice(0, 3),
    improvement_suggestions: improvementSuggestions.slice(0, 3),
    expected_points: expectedPoints,
    adaptive_action: adaptiveAction,
    adaptive_explanation: adaptiveExplanation
  };
}

export class AIService {
  async evaluateAnswer(
    question: Question,
    candidateAnswer: string,
    role: string,
    difficulty: DifficultyLevel
  ): Promise<AnswerEvaluation> {
    try {
      const response = await fetch('/api/ai/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, candidateAnswer, role, difficulty })
      });
      if (response.ok) {
        const data = await response.json();
        if (data && typeof data.overall_score === 'number') {
          return data;
        }
      }
    } catch {}

    return evaluateAnswerDeterministically(question, candidateAnswer);
  }

  async generateQuestions(
    role: RoleType | string,
    experienceLevel: string,
    interviewType: InterviewType,
    difficulty: DifficultyLevel,
    count: number,
    selectedSkills: string[]
  ): Promise<Question[]> {
    try {
      const response = await fetch('/api/ai/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, experienceLevel, interviewType, difficulty, count, selectedSkills })
      });
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data.questions) && data.questions.length > 0) {
          return data.questions;
        }
      }
    } catch {}

    return [];
  }

  getNextAdaptiveDifficulty(
    previousScore: number,
    currentDifficulty: DifficultyLevel
  ): {
    nextDifficulty: DifficultyLevel;
    action: 'increase' | 'maintain' | 'decrease';
    explanation: string;
  } {
    if (previousScore >= 80) {
      const nextDiff: DifficultyLevel = currentDifficulty === 'Easy' ? 'Medium' : 'Hard';
      return {
        nextDifficulty: nextDiff,
        action: 'increase',
        explanation: 'Score >= 80: Superior answer! Escalating difficulty to challenge depth.'
      };
    } else if (previousScore < 50) {
      const nextDiff: DifficultyLevel = currentDifficulty === 'Hard' ? 'Medium' : 'Easy';
      return {
        nextDifficulty: nextDiff,
        action: 'decrease',
        explanation: 'Score < 50: Reviewing core fundamental concepts before advancing.'
      };
    } else {
      return {
        nextDifficulty: currentDifficulty,
        action: 'maintain',
        explanation: 'Score 50–79: Maintaining current difficulty level to test consistency.'
      };
    }
  }
}

export const aiService = new AIService();
