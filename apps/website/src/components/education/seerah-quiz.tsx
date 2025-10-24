/**
 * Seerah Quiz Component
 * Interactive quiz interface with timer and progress tracking
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  AlertCircle,
  CheckCircle,
  XCircle,
  Award,
  BookOpen
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface QuizQuestion {
  id: string;
  questionText: string;
  arabicText?: string;
  questionType: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'SHORT_ANSWER';
  points: number;
  options: {
    id: string;
    text: string;
    order: number;
  }[];
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  timeLimit: number | null;
  passingScore: number;
  maxAttempts: number;
  questions: QuizQuestion[];
}

interface QuizProps {
  quizId: string;
  moduleId: string;
}

export function SeerahQuiz({ quizId, moduleId }: QuizProps) {
  const router = useRouter();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [started, setStarted] = useState(false);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [attemptInfo, setAttemptInfo] = useState<any>(null);

  // Fetch quiz data
  useEffect(() => {
    fetchQuiz();
  }, [quizId]);

  // Timer effect
  useEffect(() => {
    if (!started || !timeRemaining || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev && prev <= 1) {
          handleSubmit(); // Auto-submit when time runs out
          return 0;
        }
        return prev ? prev - 1 : null;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [started, timeRemaining]);

  const fetchQuiz = async () => {
    try {
      const response = await fetch(`/api/seerah/quizzes/${quizId}`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch quiz');
      }

      const data = await response.json();
      setQuiz(data.quiz);
      setAttemptInfo(data.attemptInfo);
    } catch (error) {
      console.error('Error fetching quiz:', error);
    } finally {
      setLoading(false);
    }
  };

  const startQuiz = async () => {
    try {
      const response = await fetch(`/api/seerah/quizzes/${quizId}/start`, {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to start quiz');
      }

      const data = await response.json();
      setAttemptId(data.attemptId);
      setStarted(true);
      if (quiz?.timeLimit) {
        setTimeRemaining(quiz.timeLimit * 60); // Convert minutes to seconds
      }
    } catch (error) {
      console.error('Error starting quiz:', error);
    }
  };

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleSubmit = async () => {
    if (!attemptId || !quiz) return;

    setSubmitting(true);

    try {
      const formattedAnswers = quiz.questions.map(q => {
        const answer = answers[q.id] || '';
        if (q.questionType === 'SHORT_ANSWER') {
          return {
            questionId: q.id,
            textAnswer: answer,
            timeSpent: 0,
          };
        } else {
          return {
            questionId: q.id,
            selectedOptionId: answer,
            timeSpent: 0,
          };
        }
      });

      const totalTimeSpent = quiz.timeLimit 
        ? (quiz.timeLimit * 60) - (timeRemaining || 0)
        : 0;

      const response = await fetch('/api/seerah/quizzes/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          attemptId,
          answers: formattedAnswers,
          totalTimeSpent,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit quiz');
      }

      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Error submitting quiz:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const goToQuestion = (index: number) => {
    if (index >= 0 && index < (quiz?.questions.length || 0)) {
      setCurrentQuestion(index);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center">Loading quiz...</div>
        </CardContent>
      </Card>
    );
  }

  if (!quiz) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center text-red-600">Failed to load quiz</div>
        </CardContent>
      </Card>
    );
  }

  // Show results
  if (results) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Quiz Results</CardTitle>
          <CardDescription>{quiz.title}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Score Display */}
            <div className="text-center py-8">
              <div className={cn(
                "inline-flex items-center justify-center w-32 h-32 rounded-full mb-4",
                results.results.isPassed 
                  ? "bg-islamic-green-100 text-islamic-green-700"
                  : "bg-red-100 text-red-700"
              )}>
                <div>
                  <div className="text-3xl font-bold">{results.results.score}%</div>
                  <div className="text-sm">Score</div>
                </div>
              </div>

              {results.results.isPassed ? (
                <div>
                  <CheckCircle className="w-12 h-12 text-islamic-green-600 mx-auto mb-2" />
                  <h3 className="text-2xl font-bold text-islamic-green-700">Passed!</h3>
                  <p className="text-gray-600 mt-2">
                    Congratulations! You've passed this module's assessment.
                  </p>
                </div>
              ) : (
                <div>
                  <XCircle className="w-12 h-12 text-red-600 mx-auto mb-2" />
                  <h3 className="text-2xl font-bold text-red-700">Not Passed</h3>
                  <p className="text-gray-600 mt-2">
                    You need {results.results.passingScore}% to pass. Keep studying and try again!
                  </p>
                </div>
              )}
            </div>

            {/* Statistics */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600">Correct Answers</p>
                <p className="text-2xl font-bold">
                  {results.results.correctAnswers}/{results.results.totalQuestions}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600">Time Spent</p>
                <p className="text-2xl font-bold">
                  {Math.floor(results.results.timeSpent / 60)}m
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600">Passing Score</p>
                <p className="text-2xl font-bold">
                  {results.results.passingScore}%
                </p>
              </div>
            </div>

            {/* Achievements */}
            {results.achievements && results.achievements.length > 0 && (
              <div className="bg-islamic-gold-50 rounded-lg p-4">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Award className="w-5 h-5 text-islamic-gold-600" />
                  New Achievements!
                </h4>
                <div className="space-y-2">
                  {results.achievements.map((achievement: any) => (
                    <div key={achievement.id} className="flex items-center gap-3">
                      <span className="text-2xl">{achievement.icon}</span>
                      <div>
                        <p className="font-medium">{achievement.title}</p>
                        <p className="text-sm text-gray-600">{achievement.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certificate */}
            {results.certificate && (
              <Alert className="bg-islamic-green-50 border-islamic-green-300">
                <Award className="h-4 w-4" />
                <AlertDescription>
                  <strong>Certificate Earned!</strong> You've completed the entire Seerah curriculum.
                  Your certificate code: <code className="font-mono">{results.certificate.verificationCode}</code>
                </AlertDescription>
              </Alert>
            )}

            {/* Actions */}
            <div className="flex gap-3 justify-center">
              {results.nextModule && (
                <Button 
                  onClick={() => router.push(`/education/seerah/${results.nextModule.id}`)}
                  className="bg-islamic-green-600 hover:bg-islamic-green-700"
                >
                  Next Module
                </Button>
              )}
              <Button 
                variant="outline"
                onClick={() => router.push('/education/seerah')}
              >
                Back to Modules
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show quiz start screen
  if (!started) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{quiz.title}</CardTitle>
          <CardDescription>{quiz.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-islamic-green-50 rounded-lg p-4">
              <h4 className="font-semibold mb-2">Quiz Information</h4>
              <ul className="space-y-2 text-sm">
                <li>• {quiz.questions.length} questions</li>
                {quiz.timeLimit && <li>• Time limit: {quiz.timeLimit} minutes</li>}
                <li>• Passing score: {quiz.passingScore}%</li>
                <li>• Attempts remaining: {attemptInfo?.attemptsRemaining || 0}</li>
              </ul>
            </div>

            {attemptInfo?.canAttempt ? (
              <Button 
                onClick={startQuiz}
                className="w-full bg-islamic-green-600 hover:bg-islamic-green-700"
                size="lg"
              >
                Start Quiz
              </Button>
            ) : (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  You have used all your attempts for this quiz.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show quiz questions
  const question = quiz.questions[currentQuestion];
  const isLastQuestion = currentQuestion === quiz.questions.length - 1;

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{quiz.title}</CardTitle>
            <CardDescription>
              Question {currentQuestion + 1} of {quiz.questions.length}
            </CardDescription>
          </div>
          {timeRemaining !== null && (
            <Badge variant="outline" className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatTime(timeRemaining)}
            </Badge>
          )}
        </div>
        <Progress 
          value={((currentQuestion + 1) / quiz.questions.length) * 100} 
          className="mt-4"
        />
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Question */}
          <div>
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold">{question.questionText}</h3>
              <Badge>{question.points} pts</Badge>
            </div>
            {question.arabicText && (
              <p className="text-gray-600 arabic text-right mt-2">
                {question.arabicText}
              </p>
            )}
          </div>

          {/* Answer Options */}
          <div>
            {question.questionType === 'MULTIPLE_CHOICE' && (
              <RadioGroup
                value={answers[question.id] || ''}
                onValueChange={(value) => handleAnswerChange(question.id, value)}
              >
                <div className="space-y-2">
                  {question.options.map((option) => (
                    <div key={option.id} className="flex items-center space-x-2">
                      <RadioGroupItem value={option.id} id={option.id} />
                      <Label 
                        htmlFor={option.id} 
                        className="flex-1 cursor-pointer p-2 rounded hover:bg-gray-50"
                      >
                        {option.text}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            )}

            {question.questionType === 'TRUE_FALSE' && (
              <RadioGroup
                value={answers[question.id] || ''}
                onValueChange={(value) => handleAnswerChange(question.id, value)}
              >
                <div className="space-y-2">
                  {question.options.map((option) => (
                    <div key={option.id} className="flex items-center space-x-2">
                      <RadioGroupItem value={option.id} id={option.id} />
                      <Label 
                        htmlFor={option.id} 
                        className="flex-1 cursor-pointer p-2 rounded hover:bg-gray-50"
                      >
                        {option.text}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            )}

            {question.questionType === 'SHORT_ANSWER' && (
              <Textarea
                value={answers[question.id] || ''}
                onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                placeholder="Type your answer here..."
                className="min-h-[100px]"
              />
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => goToQuestion(currentQuestion - 1)}
              disabled={currentQuestion === 0}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>

            {isLastQuestion ? (
              <Button
                onClick={handleSubmit}
                disabled={submitting}
                className="bg-islamic-green-600 hover:bg-islamic-green-700"
              >
                {submitting ? 'Submitting...' : 'Submit Quiz'}
              </Button>
            ) : (
              <Button
                onClick={() => goToQuestion(currentQuestion + 1)}
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            )}
          </div>

          {/* Question Navigator */}
          <div className="pt-4 border-t">
            <p className="text-sm text-gray-600 mb-2">Question Navigator</p>
            <div className="flex flex-wrap gap-2">
              {quiz.questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToQuestion(index)}
                  className={cn(
                    "w-10 h-10 rounded-lg text-sm font-medium transition-colors",
                    currentQuestion === index
                      ? "bg-islamic-green-600 text-white"
                      : answers[quiz.questions[index].id]
                      ? "bg-islamic-green-100 text-islamic-green-700"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  )}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}