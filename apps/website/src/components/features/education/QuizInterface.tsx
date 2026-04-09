'use client';

import React from 'react';
import { InteractiveQuiz } from './InteractiveQuiz';

interface QuizData {
  id?: string;
  title: string;
  description?: string;
  questions: any[];
  passingScore?: number;
  timeLimit?: number;
  subject?: string;
  difficultyLevel?: string;
  [key: string]: any;
}

interface QuizInterfaceProps {
  quiz: QuizData;
  onComplete?: (score: number, totalQuestions: number) => void;
  onRetake?: () => void;
  showArabic?: boolean;
  variant?: 'default' | 'premium';
  className?: string;
}

export function QuizInterface({
  quiz,
  onComplete = () => {},
  showArabic,
  variant,
  className,
}: QuizInterfaceProps) {
  const questions = quiz.questions.map((q: any, index: number) => ({
    id: q.id || `q-${index}`,
    question: q.questionText || q.question || '',
    questionArabic: q.questionArabic,
    options: Array.isArray(q.options)
      ? q.options.map((opt: any) => (typeof opt === 'string' ? opt : opt.text || ''))
      : [],
    optionsArabic: q.optionsArabic,
    correctAnswer: typeof q.correctAnswer === 'number'
      ? q.correctAnswer
      : Array.isArray(q.options)
        ? q.options.findIndex((opt: any) => (typeof opt === 'object' && opt.isCorrect))
        : 0,
    explanation: q.explanation,
    explanationArabic: q.explanationArabic,
    difficulty: q.difficulty || 'medium',
    points: q.points || 10,
  }));

  return (
    <InteractiveQuiz
      questions={questions}
      title={quiz.title}
      onComplete={onComplete}
      showArabic={showArabic}
      timeLimit={quiz.timeLimit}
      variant={variant}
      className={className}
    />
  );
}
