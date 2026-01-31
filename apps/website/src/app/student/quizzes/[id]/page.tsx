'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { StudentLayout } from '@/components/layout/student-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  Award,
  AlertCircle,
  RotateCcw
} from 'lucide-react';
import { useQuiz } from '@/lib/hooks/use-strapi-courses';
import type { QuizQuestion } from '@/lib/strapi-api';

interface QuizAttempt {
  answers: Record<string, string>;
  startTime: number;
  timeElapsed: number;
}

export default function StudentQuizPage() {
  const params = useParams();
  const router = useRouter();
  const quizId = params.id as string;

  const { data: quiz, isLoading, isError, error } = useQuiz(quizId);

  const [hasStarted, setHasStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  useEffect(() => {
    if (!hasStarted || isSubmitted || !quiz) return;

    const interval = setInterval(() => {
      setTimeElapsed((prev) => {
        const newTime = prev + 1;
        if (quiz.time_limit_minutes && newTime >= quiz.time_limit_minutes * 60) {
          handleSubmit();
          return prev;
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [hasStarted, isSubmitted, quiz]);

  if (isLoading) {
    return (
      <StudentLayout title="Quiz" subtitle="Loading...">
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-12 w-12 animate-spin text-emerald-600" />
          <span className="ml-4 text-lg text-gray-600">Loading quiz...</span>
        </div>
      </StudentLayout>
    );
  }

  if (isError || !quiz) {
    return (
      <StudentLayout title="Quiz" subtitle="Error">
        <Card>
          <CardContent className="py-12 text-center">
            <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Failed to load quiz</h3>
            <p className="text-gray-500 mb-4">
              {error?.message || 'Quiz not found'}
            </p>
            <div className="flex gap-2 justify-center">
              <Button variant="outline" onClick={() => router.back()}>
                Go Back
              </Button>
              <Button onClick={() => window.location.reload()}>Retry</Button>
            </div>
          </CardContent>
        </Card>
      </StudentLayout>
    );
  }

  const questions = quiz.questions || [];
  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(answers).length;

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = (answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: answer,
    }));
  };

  const handleSubmit = () => {
    let correct = 0;
    questions.forEach((q) => {
      if (answers[q.id] === q.correct_answer) {
        correct++;
      }
    });

    const percentage = (correct / totalQuestions) * 100;
    setScore(Math.round(percentage));
    setIsSubmitted(true);
  };

  const handleRetake = () => {
    setHasStarted(false);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setTimeElapsed(0);
    setIsSubmitted(false);
    setScore(null);
  };

  const handleBackToLesson = () => {
    if (quiz.lesson) {
      router.push(`/student/lessons/${quiz.lesson.documentId}`);
    } else {
      router.back();
    }
  };

  // Quiz Start Screen
  if (!hasStarted) {
    return (
      <StudentLayout title={quiz.title} subtitle="Quiz">
        <Button
          variant="ghost"
          onClick={handleBackToLesson}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Lesson
        </Button>

        <div className="max-w-2xl mx-auto">
          <Card className="border-2 border-purple-200">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-purple-600" />
              </div>
              <CardTitle className="text-3xl">
                {quiz.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-center text-gray-600 text-lg">
                {quiz.description}
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-gray-900">{totalQuestions}</p>
                  <p className="text-sm text-gray-600">Questions</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-gray-900">{quiz.passing_score}%</p>
                  <p className="text-sm text-gray-600">Passing Score</p>
                </div>
                {quiz.time_limit_minutes && (
                  <>
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <p className="text-2xl font-bold text-gray-900">{quiz.time_limit_minutes}</p>
                      <p className="text-sm text-gray-600">Minutes</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <Clock className="h-6 w-6 text-emerald-600 mx-auto mb-1" />
                      <p className="text-sm text-gray-600">Timed Quiz</p>
                    </div>
                  </>
                )}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-blue-800">
                    <p className="font-semibold mb-1">Instructions:</p>
                    <ul className="space-y-1 list-disc list-inside">
                      <li>Answer all questions to the best of your ability</li>
                      <li>You can navigate between questions before submitting</li>
                      {quiz.time_limit_minutes && (
                        <li>The quiz will auto-submit when time runs out</li>
                      )}
                      <li>Review your answers before final submission</li>
                    </ul>
                  </div>
                </div>
              </div>

              <Button
                size="lg"
                className="w-full bg-purple-600 hover:bg-purple-700"
                onClick={() => setHasStarted(true)}
              >
                Start Quiz
              </Button>
            </CardContent>
          </Card>
        </div>
      </StudentLayout>
    );
  }

  // Quiz Results Screen
  if (isSubmitted && score !== null) {
    const passed = score >= quiz.passing_score;

    return (
      <StudentLayout title={`${quiz.title} - Results`} subtitle="Quiz Results">
        <div className="max-w-2xl mx-auto">
          <Card className={`border-2 ${passed ? 'border-green-200' : 'border-red-200'}`}>
            <CardHeader className="text-center">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
                passed ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {passed ? (
                  <CheckCircle2 className="h-10 w-10 text-green-600" />
                ) : (
                  <XCircle className="h-10 w-10 text-red-600" />
                )}
              </div>
              <CardTitle className="text-3xl">
                {passed ? 'Congratulations!' : 'Keep Trying!'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <p className="text-6xl font-bold text-gray-900 mb-2">{score}%</p>
                <p className="text-lg text-gray-600">
                  You scored {score}%. {passed ? 'You passed!' : `You need ${quiz.passing_score}% to pass.`}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-gray-900">{answeredCount}/{totalQuestions}</p>
                  <p className="text-sm text-gray-600">Answered</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {Math.round((score / 100) * totalQuestions)}
                  </p>
                  <p className="text-sm text-gray-600">Correct</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-gray-900">{formatTime(timeElapsed)}</p>
                  <p className="text-sm text-gray-600">Time Taken</p>
                </div>
              </div>

              {/* Answer Review */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Answer Summary</h3>
                <div className="space-y-2">
                  {questions.map((q, index) => {
                    const userAnswer = answers[q.id];
                    const isCorrect = userAnswer === q.correct_answer;

                    return (
                      <div key={q.id} className="flex items-center justify-between text-sm">
                        <span className="text-gray-700">Question {index + 1}</span>
                        {isCorrect ? (
                          <Badge className="bg-green-100 text-green-800 border-green-200">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Correct
                          </Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-800 border-red-200">
                            <XCircle className="h-3 w-3 mr-1" />
                            Incorrect
                          </Badge>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleBackToLesson}
                  className="flex-1"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Lesson
                </Button>
                <Button
                  onClick={handleRetake}
                  className="flex-1 bg-purple-600 hover:bg-purple-700"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Retake Quiz
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </StudentLayout>
    );
  }

  // Quiz Taking Screen
  return (
    <StudentLayout title={quiz.title} subtitle={`Question ${currentQuestionIndex + 1} of ${totalQuestions}`}>
      {/* Header with Progress */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6 sticky top-0 z-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">{quiz.title}</h2>
          <div className="flex items-center gap-4">
            {quiz.time_limit_minutes && (
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4" />
                <span className="font-mono font-semibold">
                  {formatTime((quiz.time_limit_minutes * 60) - timeElapsed)}
                </span>
              </div>
            )}
            <Badge variant="outline">
              {currentQuestionIndex + 1} / {totalQuestions}
            </Badge>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-purple-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Content */}
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-4 mb-2">
              <CardTitle className="text-2xl">
                Question {currentQuestionIndex + 1}
              </CardTitle>
              <Badge className="flex-shrink-0">
                {currentQuestion.points} {currentQuestion.points === 1 ? 'point' : 'points'}
              </Badge>
            </div>
            <p className="text-lg text-gray-700 leading-relaxed">
              {currentQuestion.question_text}
            </p>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Multiple Choice Options */}
            {currentQuestion.question_type === 'multiple_choice' && currentQuestion.options && (
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerChange(option)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      answers[currentQuestion.id] === option
                        ? 'border-purple-600 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        answers[currentQuestion.id] === option
                          ? 'border-purple-600 bg-purple-600'
                          : 'border-gray-300'
                      }`}>
                        {answers[currentQuestion.id] === option && (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>
                      <span className="text-gray-800">{option}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* True/False Options */}
            {currentQuestion.question_type === 'true_false' && (
              <div className="space-y-3">
                {['True', 'False'].map((option) => (
                  <button
                    key={option}
                    onClick={() => handleAnswerChange(option)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      answers[currentQuestion.id] === option
                        ? 'border-purple-600 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        answers[currentQuestion.id] === option
                          ? 'border-purple-600 bg-purple-600'
                          : 'border-gray-300'
                      }`}>
                        {answers[currentQuestion.id] === option && (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>
                      <span className="text-gray-800">{option}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Short Answer */}
            {currentQuestion.question_type === 'short_answer' && (
              <div>
                <textarea
                  value={answers[currentQuestion.id] || ''}
                  onChange={(e) => handleAnswerChange(e.target.value)}
                  placeholder="Type your answer here..."
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-600 focus:outline-none"
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-6">
          <Button
            variant="outline"
            onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentQuestionIndex === 0}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          <div className="text-sm text-gray-600">
            {answeredCount} of {totalQuestions} answered
          </div>

          {currentQuestionIndex < totalQuestions - 1 ? (
            <Button
              onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              className="bg-emerald-600 hover:bg-emerald-700"
              disabled={answeredCount < totalQuestions}
            >
              Submit Quiz
              <CheckCircle2 className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </StudentLayout>
  );
}
