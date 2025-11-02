'use client';

import React, { useState, useEffect } from 'react';
import { FeatureFlagService } from '@attaqwa/shared';
import { Button } from '@/components/ui/button';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Clock, 
  CheckCircle,
  XCircle,
  Brain,
  Award,
  RefreshCw,
  Eye,
  AlertCircle
} from 'lucide-react';
// TODO: Move these to @attaqwa/shared-types in Epic 2
type QuestionType = 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'SHORT_ANSWER' | 'FILL_BLANK';

interface QuizQuestion {
  id: string;
  question: string;
  questionType: QuestionType;
  options?: string[];
  correctAnswer: string;
  explanation?: string;
  arabicText?: string;
  reference?: string;
  points: number;
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  subject: string;
  questions: QuizQuestion[];
  timeLimit?: number;
  passingScore: number;
  maxAttempts: number;
  showCorrectAnswers: boolean;
  userAttempts: number;
}

// Mock quiz data
const mockQuiz: Quiz = {
  id: '1',
  title: 'Quran Basics Quiz',
  description: 'Test your understanding of basic Quranic concepts and recitation rules.',
  subject: 'QURAN',
  timeLimit: 20,
  passingScore: 70,
  maxAttempts: 3,
  showCorrectAnswers: true,
  userAttempts: 1,
  questions: [
    {
      id: 'q1',
      question: 'How many chapters (Surahs) are in the Quran?',
      questionType: 'MULTIPLE_CHOICE' as QuestionType,
      options: ['110', '114', '118', '120'],
      correctAnswer: '114',
      explanation: 'The Quran contains 114 chapters called Surahs, ranging from 3 verses to 286 verses.',
      points: 1
    },
    {
      id: 'q2',
      question: 'What is the first chapter of the Quran called?',
      questionType: 'MULTIPLE_CHOICE' as QuestionType,
      options: ['Al-Baqarah', 'Al-Fatiha', 'An-Nas', 'Al-Ikhlas'],
      correctAnswer: 'Al-Fatiha',
      explanation: 'Al-Fatiha (The Opening) is the first chapter of the Quran and is recited in every unit of prayer.',
      arabicText: 'الفاتحة',
      points: 1
    },
    {
      id: 'q3',
      question: 'Bismillah contains the mention of which two attributes of Allah?',
      questionType: 'SHORT_ANSWER' as QuestionType,
      correctAnswer: 'Ar-Rahman and Ar-Raheem',
      explanation: 'Ar-Rahman (The Most Gracious) and Ar-Raheem (The Most Merciful) are mentioned in Bismillah.',
      arabicText: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ',
      reference: 'Al-Fatiha 1:1',
      points: 2
    },
    {
      id: 'q4',
      question: 'The Quran was revealed over a period of 23 years.',
      questionType: 'TRUE_FALSE' as QuestionType,
      correctAnswer: 'true',
      explanation: 'Yes, the Quran was revealed to Prophet Muhammad (peace be upon him) over approximately 23 years.',
      points: 1
    },
    {
      id: 'q5',
      question: 'Complete the verse: "In the name of Allah, the Most _____, the Most _____"',
      questionType: 'FILL_BLANK' as QuestionType,
      correctAnswer: 'Gracious, Merciful',
      explanation: 'The complete verse is "In the name of Allah, the Most Gracious, the Most Merciful" (Bismillah ar-Rahman ar-Raheem).',
      arabicText: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ',
      points: 2
    }
  ]
};

export default function QuizPage() {
  // Feature flag protection
  if (!FeatureFlagService.canAccessEducationUI()) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-islamic-navy-800 mb-4">Education Quiz</h1>
          <div className="bg-islamic-gold-50 border border-islamic-gold-200 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-islamic-gold-800 mb-2">🚧 Under Development</h2>
            <p className="text-islamic-gold-700">Interactive quiz system is being enhanced.</p>
          </div>
          <Link href="/"><Button className="bg-islamic-green-600 hover:bg-islamic-green-700">Return to Home</Button></Link>
        </div>
      </div>
    );
  }

  const params = useParams();
  const quizId = params.id as string;
  
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [showExplanations, setShowExplanations] = useState(false);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setQuiz(mockQuiz);
      setTimeRemaining(mockQuiz.timeLimit ? mockQuiz.timeLimit * 60 : null);
      setLoading(false);
    }, 500);
  }, [quizId]);

  useEffect(() => {
    if (timeRemaining && timeRemaining > 0 && !isSubmitted) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0) {
      handleSubmit();
    }
  }, [timeRemaining, isSubmitted]);

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = () => {
    if (!quiz) return;

    // Calculate results
    let correctCount = 0;
    let totalPoints = 0;
    let earnedPoints = 0;

    const questionResults = quiz.questions.map(question => {
      const userAnswer = answers[question.id] || '';
      const isCorrect = userAnswer.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim();
      
      totalPoints += question.points;
      if (isCorrect) {
        correctCount++;
        earnedPoints += question.points;
      }

      return {
        questionId: question.id,
        userAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
        points: question.points,
        earnedPoints: isCorrect ? question.points : 0
      };
    });

    const score = Math.round((earnedPoints / totalPoints) * 100);
    const isPassed = score >= quiz.passingScore;

    setResults({
      score,
      correctCount,
      totalQuestions: quiz.questions.length,
      isPassed,
      questionResults
    });

    setIsSubmitted(true);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-600 mb-4">Quiz Not Found</h1>
          <Link href="/education">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Education
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (isSubmitted && results) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Results Header */}
          <Card className="mb-6">
            <CardContent className="p-8 text-center">
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                results.isPassed ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {results.isPassed ? (
                  <CheckCircle className="h-8 w-8 text-green-600" />
                ) : (
                  <XCircle className="h-8 w-8 text-red-600" />
                )}
              </div>
              
              <h1 className="text-3xl font-bold mb-2">
                {results.isPassed ? 'Congratulations!' : 'Keep Learning!'}
              </h1>
              
              <p className="text-xl text-gray-600 mb-4">
                You scored {results.score}% on {quiz.title}
              </p>
              
              <div className="flex justify-center gap-6 text-sm text-gray-600">
                <span>{results.correctCount} of {results.totalQuestions} correct</span>
                <span>Passing score: {quiz.passingScore}%</span>
              </div>
              
              {results.isPassed && (
                <Badge className="mt-4 bg-islamic-green-600">
                  <Award className="h-4 w-4 mr-1" />
                  Quiz Passed!
                </Badge>
              )}
            </CardContent>
          </Card>

          {/* Question Review */}
          {quiz.showCorrectAnswers && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Question Review</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {quiz.questions.map((question, index) => {
                    const result = results.questionResults[index];
                    return (
                      <div key={question.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                        <div className="flex items-start gap-3 mb-3">
                          <div className={`mt-1 rounded-full p-1 ${
                            result.isCorrect ? 'bg-green-100' : 'bg-red-100'
                          }`}>
                            {result.isCorrect ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-600" />
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-islamic-navy-800 mb-2">
                              {index + 1}. {question.question}
                            </h4>
                            
                            {question.arabicText && (
                              <div className="mb-3 p-3 bg-islamic-green-50 rounded-lg">
                                <div className="text-lg arabic font-amiri text-islamic-navy-800 text-center" dir="rtl">
                                  {question.arabicText}
                                </div>
                              </div>
                            )}
                            
                            <div className="space-y-2 text-sm">
                              <div>
                                <span className="font-medium">Your answer: </span>
                                <span className={result.isCorrect ? 'text-green-600' : 'text-red-600'}>
                                  {result.userAnswer || 'No answer'}
                                </span>
                              </div>
                              
                              {!result.isCorrect && (
                                <div>
                                  <span className="font-medium">Correct answer: </span>
                                  <span className="text-green-600">{question.correctAnswer}</span>
                                </div>
                              )}
                              
                              {question.explanation && (
                                <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                                  <p className="text-blue-800">{question.explanation}</p>
                                  {question.reference && (
                                    <p className="text-blue-600 text-xs mt-2">
                                      Reference: {question.reference}
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex gap-4">
            <Link href="/education">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Education
              </Button>
            </Link>
            
            {!results.isPassed && quiz.userAttempts < quiz.maxAttempts && (
              <Button 
                onClick={() => window.location.reload()}
                className="bg-islamic-green-600 hover:bg-islamic-green-700"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            )}
            
            <Link href="/education/progress">
              <Button variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                View Progress
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Quiz Header */}
        <div className="mb-6">
          <Link href="/education">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Education
            </Button>
          </Link>
          
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-islamic-navy-800">
              {quiz.title}
            </h1>
            
            {timeRemaining !== null && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className={`font-mono font-bold ${
                  timeRemaining < 300 ? 'text-red-600' : 'text-gray-700'
                }`}>
                  {formatTime(timeRemaining)}
                </span>
              </div>
            )}
          </div>
          
          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span>Question {currentQuestion + 1} of {quiz.questions.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-islamic-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
          
          {/* Quiz Info */}
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="outline">
              {quiz.subject}
            </Badge>
            <Badge variant="outline">
              Passing Score: {quiz.passingScore}%
            </Badge>
            <Badge variant="outline">
              Attempt {quiz.userAttempts + 1} of {quiz.maxAttempts}
            </Badge>
          </div>
        </div>

        {/* Question Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Question {currentQuestion + 1}
              <Badge variant="outline">{currentQ.points} point{currentQ.points > 1 ? 's' : ''}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Question Text */}
              <div>
                <h3 className="text-lg font-semibold text-islamic-navy-800 mb-4">
                  {currentQ.question}
                </h3>
                
                {/* Arabic Text */}
                {currentQ.arabicText && (
                  <div className="mb-4 p-4 bg-islamic-green-50 rounded-lg text-center">
                    <div className="text-xl arabic font-amiri text-islamic-navy-800" dir="rtl">
                      {currentQ.arabicText}
                    </div>
                  </div>
                )}
              </div>

              {/* Answer Options */}
              <div className="space-y-3">
                {currentQ.questionType === 'MULTIPLE_CHOICE' && currentQ.options && (
                  <div className="space-y-2">
                    {currentQ.options.map((option, index) => (
                      <label key={index} className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name={`question-${currentQ.id}`}
                          value={option}
                          checked={answers[currentQ.id] === option}
                          onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
                          className="mr-3 text-islamic-green-600 focus:ring-islamic-green-500"
                        />
                        <span className="text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                )}

                {currentQ.questionType === 'TRUE_FALSE' && (
                  <div className="space-y-2">
                    {['True', 'False'].map((option) => (
                      <label key={option} className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name={`question-${currentQ.id}`}
                          value={option.toLowerCase()}
                          checked={answers[currentQ.id] === option.toLowerCase()}
                          onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
                          className="mr-3 text-islamic-green-600 focus:ring-islamic-green-500"
                        />
                        <span className="text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                )}

                {(currentQ.questionType === 'SHORT_ANSWER' || currentQ.questionType === 'FILL_BLANK') && (
                  <div>
                    <textarea
                      value={answers[currentQ.id] || ''}
                      onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
                      placeholder="Enter your answer..."
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-islamic-green-500 focus:border-transparent"
                      rows={3}
                    />
                  </div>
                )}
              </div>

              {/* Reference */}
              {currentQ.reference && (
                <div className="text-sm text-gray-600 italic">
                  Reference: {currentQ.reference}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
            disabled={currentQuestion === 0}
          >
            Previous
          </Button>

          <div className="text-sm text-gray-500 self-center">
            {Object.keys(answers).length} of {quiz.questions.length} answered
          </div>

          {currentQuestion < quiz.questions.length - 1 ? (
            <Button
              onClick={() => setCurrentQuestion(currentQuestion + 1)}
              className="bg-islamic-green-600 hover:bg-islamic-green-700"
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              className="bg-islamic-green-600 hover:bg-islamic-green-700"
              disabled={Object.keys(answers).length < quiz.questions.length}
            >
              Submit Quiz
            </Button>
          )}
        </div>

        {/* Warning for incomplete answers */}
        {Object.keys(answers).length < quiz.questions.length && currentQuestion === quiz.questions.length - 1 && (
          <Card className="mt-4 border-orange-200 bg-orange-50">
            <CardContent className="p-4 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              <span className="text-orange-800">
                You have unanswered questions. Review your answers before submitting.
              </span>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}