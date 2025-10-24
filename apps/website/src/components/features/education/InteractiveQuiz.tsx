'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface QuizQuestion {
  id: string;
  question: string;
  questionArabic?: string;
  options: string[];
  optionsArabic?: string[];
  correctAnswer: number;
  explanation?: string;
  explanationArabic?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
}

interface QuizProps {
  questions: QuizQuestion[];
  title: string;
  titleArabic?: string;
  onComplete: (score: number, totalQuestions: number) => void;
  showArabic?: boolean;
  timeLimit?: number; // in seconds
  variant?: 'default' | 'premium';
  className?: string;
}

export function InteractiveQuiz({
  questions,
  title,
  titleArabic,
  onComplete,
  showArabic = false,
  timeLimit,
  variant = 'default',
  className
}: QuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>(new Array(questions.length).fill(-1));
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(timeLimit || 0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);

  // Timer effect
  useEffect(() => {
    if (timeLimit && timeLeft > 0 && !isCompleted) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleCompleteQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeLeft, timeLimit, isCompleted]);

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setShowExplanation(false);
    } else {
      handleCompleteQuiz();
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
      setShowExplanation(false);
    }
  };

  const handleCompleteQuiz = () => {
    const calculatedScore = selectedAnswers.reduce((acc, answer, index) => {
      if (answer === questions[index].correctAnswer) {
        return acc + questions[index].points;
      }
      return acc;
    }, 0);

    setScore(calculatedScore);
    setIsCompleted(true);
    setShowResults(true);
    onComplete(calculatedScore, questions.length);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    const colorMap = {
      easy: 'bg-green-100 text-green-800 border-green-200',
      medium: 'bg-amber-100 text-amber-800 border-amber-200',
      hard: 'bg-red-100 text-red-800 border-red-200',
    };
    return colorMap[difficulty as keyof typeof colorMap] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getDifficultyIcon = (difficulty: string) => {
    const iconMap = {
      easy: '🟢',
      medium: '🟡', 
      hard: '🔴',
    };
    return iconMap[difficulty as keyof typeof iconMap] || '⚪';
  };

  const getScoreColor = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-blue-600';
    if (percentage >= 40) return 'text-amber-600';
    return 'text-red-600';
  };

  const currentQ = questions[currentQuestion];
  const isAnswered = selectedAnswers[currentQuestion] !== -1;
  const isCorrect = selectedAnswers[currentQuestion] === currentQ.correctAnswer;

  if (showResults) {
    const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);
    const percentage = Math.round((score / totalPoints) * 100);
    
    return (
      <Card className={cn(
        'w-full max-w-2xl mx-auto',
        variant === 'premium' && 'card-premium',
        'fade-in',
        className
      )}>
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-2xl font-bold text-green-700">
            🎉 Quiz Completed!
          </CardTitle>
          {showArabic && titleArabic && (
            <p className="arabic text-lg text-green-600 mt-2">{titleArabic}</p>
          )}
        </CardHeader>

        <CardContent className="text-center space-y-6">
          {/* Score Display */}
          <div className="p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200">
            <div className="text-4xl font-bold mb-2" style={{ color: getScoreColor(score, totalPoints) }}>
              {score}/{totalPoints}
            </div>
            <div className="text-lg text-gray-700 mb-2">
              {percentage}% Score
            </div>
            <div className="text-sm text-gray-500">
              {selectedAnswers.filter((answer, index) => answer === questions[index].correctAnswer).length} correct out of {questions.length} questions
            </div>
          </div>

          {/* Performance Badge */}
          <div className="flex justify-center">
            <Badge className={cn(
              'px-4 py-2 text-sm font-medium',
              percentage >= 90 && 'bg-green-100 text-green-800 border-green-300',
              percentage >= 70 && percentage < 90 && 'bg-blue-100 text-blue-800 border-blue-300',
              percentage >= 50 && percentage < 70 && 'bg-amber-100 text-amber-800 border-amber-300',
              percentage < 50 && 'bg-red-100 text-red-800 border-red-300'
            )}>
              {percentage >= 90 ? '🏆 Excellent!' :
               percentage >= 70 ? '⭐ Good Job!' :
               percentage >= 50 ? '👍 Well Done!' :
               '💪 Keep Practicing!'}
            </Badge>
          </div>

          {/* Time Stats */}
          {timeLimit && (
            <div className="text-sm text-gray-600">
              ⏱️ Completed in {formatTime(timeLimit - timeLeft)}
            </div>
          )}

          {/* Review Button */}
          <Button
            onClick={() => {
              setShowResults(false);
              setCurrentQuestion(0);
              setShowExplanation(true);
            }}
            className="btn-islamic"
          >
            📋 Review Answers
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn(
      'w-full max-w-2xl mx-auto',
      variant === 'premium' && 'card-premium',
      'slide-up',
      className
    )}>
      <CardHeader className="pb-4">
        {/* Header with title and progress */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <CardTitle className="text-xl font-semibold text-gray-800">
              {showArabic && titleArabic ? titleArabic : title}
            </CardTitle>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="text-xs">
                Question {currentQuestion + 1} of {questions.length}
              </Badge>
              <Badge variant="outline" className={getDifficultyColor(currentQ.difficulty)}>
                {getDifficultyIcon(currentQ.difficulty)} {currentQ.difficulty}
              </Badge>
              <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                {currentQ.points} points
              </Badge>
            </div>
          </div>

          {timeLimit > 0 && (
            <div className={cn(
              'text-right',
              timeLeft < 60 && 'text-red-600 animate-pulse'
            )}>
              <div className="text-xs text-gray-500">Time Left</div>
              <div className="text-lg font-mono font-bold">
                ⏰ {formatTime(timeLeft)}
              </div>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Question */}
        <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-green-500">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            {showArabic && currentQ.questionArabic ? currentQ.questionArabic : currentQ.question}
          </h3>
          {showArabic && currentQ.questionArabic && (
            <p className="text-sm text-gray-600">{currentQ.question}</p>
          )}
        </div>

        {/* Options */}
        <div className="space-y-3">
          {currentQ.options.map((option, index) => {
            const isSelected = selectedAnswers[currentQuestion] === index;
            const isCorrectOption = index === currentQ.correctAnswer;
            const showCorrection = showExplanation && isAnswered;

            return (
              <button
                key={index}
                onClick={() => !showExplanation && handleAnswerSelect(index)}
                disabled={showExplanation}
                className={cn(
                  'w-full p-4 text-left rounded-lg border-2 transition-all duration-200',
                  'hover:scale-[1.01] transform-gpu',
                  !showCorrection && !isSelected && 'border-gray-200 bg-white hover:border-green-300 hover:bg-green-50',
                  !showCorrection && isSelected && 'border-green-500 bg-green-50',
                  showCorrection && isCorrectOption && 'border-green-500 bg-green-100',
                  showCorrection && isSelected && !isCorrectOption && 'border-red-500 bg-red-100',
                  showCorrection && !isSelected && !isCorrectOption && 'border-gray-200 bg-gray-50 opacity-60',
                  showExplanation && 'cursor-not-allowed'
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="flex-1">
                    {showArabic && currentQ.optionsArabic ? currentQ.optionsArabic[index] : option}
                  </span>
                  
                  <div className="flex items-center gap-2">
                    {showCorrection && isCorrectOption && (
                      <span className="text-green-600 text-lg">✅</span>
                    )}
                    {showCorrection && isSelected && !isCorrectOption && (
                      <span className="text-red-600 text-lg">❌</span>
                    )}
                    {isSelected && !showCorrection && (
                      <div className="w-4 h-4 rounded-full bg-green-500"></div>
                    )}
                  </div>
                </div>
                
                {showArabic && currentQ.optionsArabic && (
                  <div className="text-sm text-gray-600 mt-1">{option}</div>
                )}
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {showExplanation && currentQ.explanation && (
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 fade-in">
            <div className="flex items-start gap-2">
              <span className="text-lg">💡</span>
              <div className="flex-1">
                <h4 className="font-semibold text-blue-800 mb-2">Explanation</h4>
                <p className="text-sm text-blue-700">
                  {showArabic && currentQ.explanationArabic ? currentQ.explanationArabic : currentQ.explanation}
                </p>
                {showArabic && currentQ.explanationArabic && (
                  <p className="text-xs text-blue-600 mt-1">{currentQ.explanation}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-4">
          <Button
            onClick={handlePrevQuestion}
            disabled={currentQuestion === 0}
            variant="outline"
            className="flex items-center gap-2"
          >
            ← Previous
          </Button>

          <div className="flex items-center gap-2">
            {isAnswered && !showExplanation && currentQ.explanation && (
              <Button
                onClick={() => setShowExplanation(true)}
                variant="outline"
                className="flex items-center gap-1 text-blue-600 border-blue-200 hover:bg-blue-50"
              >
                💡 Show Explanation
              </Button>
            )}

            <Button
              onClick={() => {
                if (currentQuestion === questions.length - 1) {
                  handleCompleteQuiz();
                } else {
                  handleNextQuestion();
                }
              }}
              disabled={!isAnswered}
              className="btn-islamic flex items-center gap-2"
            >
              {currentQuestion === questions.length - 1 ? '🏁 Finish Quiz' : 'Next →'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}