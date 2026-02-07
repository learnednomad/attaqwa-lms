'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { sanitizeHtml } from '@/lib/sanitize';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { StudentLayout } from '@/components/layout/student-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  ArrowLeft, ArrowRight, BookOpen, Clock, Video, FileText, Play,
  CheckCircle, Loader2, AlertCircle, HelpCircle, Target, Sparkles,
  XCircle, BarChart3, Trophy, RotateCcw, ChevronRight
} from 'lucide-react';
import { useLesson, useCourse, useLessons, useProgress, useUpdateLessonProgress } from '@/hooks/use-student-data';
import type { Lesson, QuizQuestion } from '@/lib/student-api';
import { AILessonSummary } from '@/components/education/AILessonSummary';

// ── Subject theming ──────────────────────────────────────────────────────────

const SUBJECT_COLORS: Record<string, { text: string; icon: string; gradient: string; bg: string }> = {
  quran:           { text: 'text-emerald-600', icon: 'text-emerald-500', gradient: 'from-emerald-600 to-emerald-800', bg: 'bg-emerald-50' },
  hadith:          { text: 'text-blue-600',    icon: 'text-blue-500',    gradient: 'from-blue-600 to-blue-800',       bg: 'bg-blue-50' },
  fiqh:            { text: 'text-purple-600',  icon: 'text-purple-500',  gradient: 'from-purple-600 to-purple-800',   bg: 'bg-purple-50' },
  aqeedah:         { text: 'text-indigo-600',  icon: 'text-indigo-500',  gradient: 'from-indigo-600 to-indigo-800',   bg: 'bg-indigo-50' },
  seerah:          { text: 'text-amber-600',   icon: 'text-amber-500',   gradient: 'from-amber-600 to-amber-800',     bg: 'bg-amber-50' },
  arabic:          { text: 'text-teal-600',    icon: 'text-teal-500',    gradient: 'from-teal-600 to-teal-800',       bg: 'bg-teal-50' },
  islamic_history: { text: 'text-orange-600',  icon: 'text-orange-500',  gradient: 'from-orange-600 to-orange-800',   bg: 'bg-orange-50' },
  akhlaq:          { text: 'text-pink-600',    icon: 'text-pink-500',    gradient: 'from-pink-600 to-pink-800',       bg: 'bg-pink-50' },
  tajweed:         { text: 'text-cyan-600',    icon: 'text-cyan-500',    gradient: 'from-cyan-600 to-cyan-800',       bg: 'bg-cyan-50' },
};

const SUBJECT_LABELS: Record<string, string> = {
  quran: 'Quran', hadith: 'Hadith', fiqh: 'Fiqh', aqeedah: 'Aqeedah',
  seerah: 'Seerah', arabic: 'Arabic', islamic_history: 'Islamic History',
  akhlaq: 'Akhlaq', tajweed: 'Tajweed',
};

function getSubjectFromTitle(title: string): string {
  const t = title.toLowerCase();
  if (t.includes('quran') || t.includes('surah')) return 'quran';
  if (t.includes('hadith')) return 'hadith';
  if (t.includes('fiqh') || t.includes('islamic studies')) return 'fiqh';
  if (t.includes('aqeedah') || t.includes('aqidah')) return 'aqeedah';
  if (t.includes('seerah') || t.includes('prophet')) return 'seerah';
  if (t.includes('arabic')) return 'arabic';
  if (t.includes('history')) return 'islamic_history';
  if (t.includes('akhlaq')) return 'akhlaq';
  if (t.includes('tajweed')) return 'tajweed';
  return 'quran';
}

const LESSON_TYPE_ICONS: Record<string, React.ElementType> = {
  video: Video,
  reading: FileText,
  interactive: Play,
  quiz: HelpCircle,
  audio: Play,
};

const LESSON_TYPE_LABELS: Record<string, string> = {
  video: 'Video Lesson',
  reading: 'Reading',
  interactive: 'Interactive',
  quiz: 'Quiz',
  audio: 'Audio Lesson',
};

// ── Mock comprehension questions generator ───────────────────────────────────

function generateComprehensionQuestions(lesson: Lesson): QuizQuestion[] {
  const objectives = lesson.learning_objectives || [];
  const title = lesson.title;

  const questions: QuizQuestion[] = [
    {
      id: `comp-${lesson.id}-1`,
      question: `What is the primary focus of the lesson "${title}"?`,
      question_type: 'multiple_choice',
      options: [
        objectives[0] || `Understanding the core concepts of ${title}`,
        'General Islamic history overview',
        'Arabic calligraphy techniques',
        'Community event planning',
      ],
      correct_answer: 0,
      points: 1,
      explanation: objectives[0]
        ? `This lesson focuses on: ${objectives[0]}`
        : `This lesson covers the fundamental aspects of ${title}.`,
    },
    {
      id: `comp-${lesson.id}-2`,
      question: 'Which of the following is a key learning objective of this lesson?',
      question_type: 'multiple_choice',
      options: [
        objectives[1] || objectives[0] || `Mastering the fundamentals covered in ${title}`,
        'Memorizing unrelated historical dates',
        'Learning modern cooking recipes',
        'Studying advanced mathematics',
      ],
      correct_answer: 0,
      points: 1,
      explanation: 'This is one of the stated learning objectives for this lesson.',
    },
    {
      id: `comp-${lesson.id}-3`,
      question: 'True or False: This lesson should be approached with reflection and understanding, not just memorization.',
      question_type: 'true_false',
      options: ['True', 'False'],
      correct_answer: 0,
      points: 1,
      explanation: 'Islamic education emphasizes deep understanding (tafakkur) alongside memorization (hifz). Both are important.',
    },
  ];

  return questions;
}

// ── Comprehension Check Component ────────────────────────────────────────────

function ComprehensionCheck({
  questions,
  colors,
  onComplete,
}: {
  questions: QuizQuestion[];
  colors: { text: string; icon: string; gradient: string; bg: string };
  onComplete: (score: number, total: number) => void;
}) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(
    new Array(questions.length).fill(null)
  );
  const [showResult, setShowResult] = useState<boolean[]>(
    new Array(questions.length).fill(false)
  );
  const [quizComplete, setQuizComplete] = useState(false);

  const question = questions[currentQuestion];
  const isAnswered = selectedAnswers[currentQuestion] !== null;
  const isCorrect = selectedAnswers[currentQuestion] === question.correct_answer;
  const showingResult = showResult[currentQuestion];

  const score = useMemo(() => {
    return selectedAnswers.reduce<number>((acc, answer, i) => {
      return acc + (answer === questions[i].correct_answer ? 1 : 0);
    }, 0);
  }, [selectedAnswers, questions]);

  const handleSelectAnswer = useCallback((optionIndex: number) => {
    if (showingResult) return;
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = optionIndex;
    setSelectedAnswers(newAnswers);
  }, [showingResult, selectedAnswers, currentQuestion]);

  const handleCheckAnswer = useCallback(() => {
    const newShowResult = [...showResult];
    newShowResult[currentQuestion] = true;
    setShowResult(newShowResult);
  }, [showResult, currentQuestion]);

  const handleNext = useCallback(() => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setQuizComplete(true);
      onComplete(score, questions.length);
    }
  }, [currentQuestion, questions.length, onComplete, score]);

  const handleRetry = useCallback(() => {
    setCurrentQuestion(0);
    setSelectedAnswers(new Array(questions.length).fill(null));
    setShowResult(new Array(questions.length).fill(false));
    setQuizComplete(false);
  }, [questions.length]);

  if (quizComplete) {
    const percentage = Math.round((score / questions.length) * 100);
    const passed = percentage >= 67;

    return (
      <div className="text-center py-6">
        <div className={cn(
          'w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4',
          passed ? 'bg-emerald-100' : 'bg-amber-100',
        )}>
          {passed ? (
            <Trophy className="h-10 w-10 text-emerald-600" />
          ) : (
            <RotateCcw className="h-10 w-10 text-amber-600" />
          )}
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-1">
          {passed ? 'Great Job!' : 'Keep Learning!'}
        </h3>
        <p className="text-gray-500 mb-4">
          You scored {score}/{questions.length} ({percentage}%)
        </p>

        {/* Score bar */}
        <div className="w-full max-w-xs mx-auto bg-gray-100 rounded-full h-3 mb-6 overflow-hidden">
          <div
            className={cn(
              'h-3 rounded-full transition-all duration-700',
              passed ? 'bg-emerald-500' : 'bg-amber-500',
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>

        {!passed && (
          <p className="text-sm text-gray-500 mb-4">
            You need at least 67% to pass. Review the lesson content and try again.
          </p>
        )}

        <div className="flex items-center justify-center gap-3">
          <Button variant="outline" onClick={handleRetry}>
            <RotateCcw className="h-4 w-4 mr-2" /> Try Again
          </Button>
          {passed && (
            <Button className={cn('text-white bg-gradient-to-r', colors.gradient)}>
              <CheckCircle className="h-4 w-4 mr-2" /> Continue
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Progress dots */}
      <div className="flex items-center gap-2 mb-6">
        {questions.map((_, i) => (
          <div
            key={i}
            className={cn(
              'h-2 flex-1 rounded-full transition-colors',
              i < currentQuestion ? (
                selectedAnswers[i] === questions[i].correct_answer
                  ? 'bg-emerald-400'
                  : 'bg-red-300'
              ) : i === currentQuestion ? (
                `bg-gradient-to-r ${colors.gradient}`
              ) : 'bg-gray-200',
            )}
          />
        ))}
      </div>

      {/* Question header */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-gray-400">
          Question {currentQuestion + 1} of {questions.length}
        </span>
        <Badge variant="secondary" className="text-xs">
          {question.points} {question.points === 1 ? 'point' : 'points'}
        </Badge>
      </div>

      {/* Question text */}
      <h4 className="text-lg font-semibold text-gray-900 mb-5 leading-relaxed">
        {question.question}
      </h4>

      {/* Options */}
      <div className="space-y-3 mb-6">
        {question.options.map((option, i) => {
          const isSelected = selectedAnswers[currentQuestion] === i;
          const isCorrectOption = i === question.correct_answer;

          return (
            <button
              key={i}
              onClick={() => handleSelectAnswer(i)}
              disabled={showingResult}
              className={cn(
                'w-full text-left px-4 py-3.5 rounded-xl border-2 transition-all duration-200 flex items-center gap-3',
                !showingResult && !isSelected && 'border-gray-200 hover:border-gray-300 hover:bg-gray-50',
                !showingResult && isSelected && 'border-emerald-400 bg-emerald-50',
                showingResult && isCorrectOption && 'border-emerald-400 bg-emerald-50',
                showingResult && isSelected && !isCorrectOption && 'border-red-300 bg-red-50',
                showingResult && !isSelected && !isCorrectOption && 'border-gray-200 opacity-50',
              )}
            >
              <span className={cn(
                'w-8 h-8 rounded-lg flex items-center justify-center text-sm font-semibold shrink-0 transition-colors',
                !showingResult && !isSelected && 'bg-gray-100 text-gray-500',
                !showingResult && isSelected && 'bg-emerald-500 text-white',
                showingResult && isCorrectOption && 'bg-emerald-500 text-white',
                showingResult && isSelected && !isCorrectOption && 'bg-red-400 text-white',
                showingResult && !isSelected && !isCorrectOption && 'bg-gray-100 text-gray-400',
              )}>
                {showingResult && isCorrectOption ? (
                  <CheckCircle className="h-4 w-4" />
                ) : showingResult && isSelected && !isCorrectOption ? (
                  <XCircle className="h-4 w-4" />
                ) : (
                  String.fromCharCode(65 + i)
                )}
              </span>
              <span className={cn(
                'text-[15px]',
                showingResult && isCorrectOption && 'font-medium text-emerald-800',
                showingResult && isSelected && !isCorrectOption && 'text-red-700',
              )}>
                {option}
              </span>
            </button>
          );
        })}
      </div>

      {/* Explanation (shown after checking) */}
      {showingResult && question.explanation && (
        <div className={cn(
          'rounded-xl p-4 mb-6',
          isCorrect ? 'bg-emerald-50 border border-emerald-200' : 'bg-amber-50 border border-amber-200',
        )}>
          <div className="flex items-start gap-2">
            <Sparkles className={cn('h-4 w-4 mt-0.5 shrink-0', isCorrect ? 'text-emerald-600' : 'text-amber-600')} />
            <div>
              <p className={cn('text-sm font-medium mb-1', isCorrect ? 'text-emerald-800' : 'text-amber-800')}>
                {isCorrect ? 'Correct!' : 'Not quite right'}
              </p>
              <p className={cn('text-sm', isCorrect ? 'text-emerald-700' : 'text-amber-700')}>
                {question.explanation}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-end gap-3">
        {!showingResult ? (
          <Button
            onClick={handleCheckAnswer}
            disabled={!isAnswered}
            className={cn('text-white bg-gradient-to-r', colors.gradient)}
          >
            Check Answer
          </Button>
        ) : (
          <Button onClick={handleNext} className={cn('text-white bg-gradient-to-r', colors.gradient)}>
            {currentQuestion < questions.length - 1 ? (
              <>Next Question <ChevronRight className="h-4 w-4 ml-1" /></>
            ) : (
              <>See Results <Trophy className="h-4 w-4 ml-1" /></>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}

// ── Islamic pattern overlay ──────────────────────────────────────────────────

function IslamicPatternOverlay() {
  return (
    <div className="absolute inset-0 opacity-[0.07] pointer-events-none overflow-hidden">
      <svg width="100%" height="100%">
        <defs>
          <pattern id="islamic-lesson-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M30 0 L60 15 L60 45 L30 60 L0 45 L0 15 Z" fill="none" stroke="white" strokeWidth="1" />
            <path d="M30 10 L50 20 L50 40 L30 50 L10 40 L10 20 Z" fill="none" stroke="white" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#islamic-lesson-pattern)" />
      </svg>
    </div>
  );
}

// ── Reading progress hook ────────────────────────────────────────────────────

function useReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        setProgress(Math.min(Math.round((scrollTop / docHeight) * 100), 100));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return progress;
}

// ── Main component ───────────────────────────────────────────────────────────

export default function StudentLessonDetailPage() {
  const params = useParams();
  const router = useRouter();
  const lessonId = params.id as string;

  // TanStack Query hooks
  const { data: lesson, isLoading, error: lessonError } = useLesson(lessonId);
  const courseId = lesson?.course ? String(lesson.course.documentId || lesson.course.id) : '';
  const { data: course } = useCourse(courseId);
  const { data: courseLessonsRaw = [] } = useLessons(courseId ? { course_id: courseId } : undefined);
  const { data: allProgress = [] } = useProgress(courseId ? { course_id: courseId } : undefined);

  const courseLessons = useMemo(
    () => [...courseLessonsRaw].sort((a, b) => a.lesson_order - b.lesson_order),
    [courseLessonsRaw]
  );
  const progressData = useMemo(
    () => allProgress.find(p => p.lesson?.id === lesson?.id) || null,
    [allProgress, lesson?.id]
  );

  // Mutation for marking complete
  const updateProgress = useUpdateLessonProgress();

  // Local ephemeral UI state
  const [quizScore, setQuizScore] = useState<{ score: number; total: number } | null>(null);
  const readingProgress = useReadingProgress();

  const loading = isLoading;
  const error = lessonError ? (lessonError instanceof Error ? lessonError.message : 'Failed to load lesson') : null;

  const handleMarkComplete = () => {
    if (!lesson) return;
    updateProgress.mutate({
      lessonId: lesson.id,
      data: { status: 'completed', progress_percentage: 100 },
    });
  };

  const handleQuizComplete = useCallback((score: number, total: number) => {
    setQuizScore({ score, total });
  }, []);

  // Navigation
  const currentIndex = courseLessons.findIndex(l =>
    String(l.documentId) === lessonId || String(l.id) === lessonId
  );
  const prevLesson = currentIndex > 0 ? courseLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex >= 0 && currentIndex < courseLessons.length - 1
    ? courseLessons[currentIndex + 1] : null;

  // Theming
  const subjectKey = course?.subject || getSubjectFromTitle(course?.title || lesson?.title || '');
  const colors = SUBJECT_COLORS[subjectKey] || SUBJECT_COLORS.quran;
  const subjectLabel = SUBJECT_LABELS[subjectKey] || subjectKey;

  // Comprehension questions
  const comprehensionQuestions = useMemo(() => {
    if (!lesson) return [];
    if (lesson.quiz?.questions?.length) return lesson.quiz.questions;
    return generateComprehensionQuestions(lesson);
  }, [lesson]);

  // Course progress
  const courseProgress = useMemo(() => {
    if (courseLessons.length === 0) return 0;
    const completed = courseLessons.filter(cl =>
      allProgress.some(p => p.lesson?.id === cl.id && p.status === 'completed')
    ).length;
    return Math.round((completed / courseLessons.length) * 100);
  }, [courseLessons, allProgress]);

  if (loading) {
    return (
      <StudentLayout title="Lesson" subtitle="Loading...">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        </div>
      </StudentLayout>
    );
  }

  if (error || !lesson) {
    return (
      <StudentLayout title="Lesson" subtitle="Error">
        <Card className="p-8 text-center">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load lesson</h3>
          <p className="text-gray-500 mb-4">{error || 'Lesson not found'}</p>
          <Link href="/student/lessons">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Lessons
            </Button>
          </Link>
        </Card>
      </StudentLayout>
    );
  }

  const TypeIcon = LESSON_TYPE_ICONS[lesson.lesson_type] || FileText;
  const typeLabel = LESSON_TYPE_LABELS[lesson.lesson_type] || lesson.lesson_type;
  const isCompleted = progressData?.status === 'completed';
  const isInProgress = progressData?.status === 'in_progress';

  return (
    <StudentLayout title={lesson.title} subtitle={course?.title || 'Lesson'}>
      {/* ── Reading progress bar (sticky top) ──────────────────────────── */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-gray-100">
        <div
          className={cn('h-full transition-all duration-150 bg-gradient-to-r', colors.gradient)}
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* ── Hero Banner ────────────────────────────────────────────────── */}
      <div className={cn(
        'relative rounded-2xl overflow-hidden mb-8',
        `bg-gradient-to-br ${colors.gradient}`,
      )}>
        <IslamicPatternOverlay />
        <div className="relative z-10 px-6 py-8 md:px-8 md:py-10">
          {/* Back navigation */}
          <div className="flex items-center justify-between mb-6">
            <Link href="/student/lessons">
              <Button variant="ghost" size="sm" className="text-white/80 hover:text-white hover:bg-white/10">
                <ArrowLeft className="h-4 w-4 mr-2" /> All Lessons
              </Button>
            </Link>
            {course && (
              <Link href={`/student/courses/${course.documentId || course.id}`}>
                <Button variant="ghost" size="sm" className="text-white/80 hover:text-white hover:bg-white/10">
                  <BookOpen className="h-4 w-4 mr-2" /> {course.title}
                </Button>
              </Link>
            )}
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge className="bg-white/20 backdrop-blur-sm text-white border-0 hover:bg-white/30">
              <BarChart3 className="h-3 w-3 mr-1" /> {subjectLabel}
            </Badge>
            <Badge className="bg-white/20 backdrop-blur-sm text-white border-0 hover:bg-white/30 capitalize">
              <TypeIcon className="h-3 w-3 mr-1" /> {typeLabel}
            </Badge>
            {lesson.is_free && (
              <Badge className="bg-white/20 backdrop-blur-sm text-white border-0 hover:bg-white/30">
                Free
              </Badge>
            )}
            {isCompleted && (
              <Badge className="bg-white/30 backdrop-blur-sm text-white border-0">
                <CheckCircle className="h-3 w-3 mr-1" /> Completed
              </Badge>
            )}
            {isInProgress && (
              <Badge className="bg-amber-400/30 backdrop-blur-sm text-white border-0">
                <Sparkles className="h-3 w-3 mr-1" /> In Progress
              </Badge>
            )}
          </div>

          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            {lesson.title}
          </h1>

          {/* Description */}
          {lesson.description && (
            <p className="text-white/80 text-base max-w-2xl mb-5 leading-relaxed">
              {lesson.description}
            </p>
          )}

          {/* Meta chips */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/70">
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" /> {lesson.duration_minutes} min
            </span>
            <span className="flex items-center gap-1.5">
              <Target className="h-4 w-4" /> Lesson {lesson.lesson_order}{courseLessons.length > 0 && ` of ${courseLessons.length}`}
            </span>
            {lesson.learning_objectives?.length > 0 && (
              <span className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4" /> {lesson.learning_objectives.length} objectives
              </span>
            )}
          </div>

          {/* Course progress bar */}
          {courseLessons.length > 0 && (
            <div className="mt-5">
              <div className="flex justify-between text-xs text-white/60 mb-1.5">
                <span>Course Progress</span>
                <span>{courseProgress}%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-1.5">
                <div
                  className="bg-white h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${courseProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Main Layout ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Main Content Column ──────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-6">

          {/* Video Player */}
          {lesson.video_url && (
            <Card className="overflow-hidden shadow-[var(--shadow-islamic)]">
              <CardContent className="p-0">
                <div className="aspect-video bg-gray-900 flex items-center justify-center">
                  {lesson.video_url.includes('youtube') || lesson.video_url.includes('youtu.be') ? (
                    <iframe
                      src={lesson.video_url.replace('watch?v=', 'embed/')}
                      className="w-full h-full"
                      allowFullScreen
                      title={lesson.title}
                    />
                  ) : (
                    <div className="text-center text-white p-8">
                      <Video className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium mb-2">Video Lesson</p>
                      <a
                        href={lesson.video_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-400 hover:text-emerald-300 underline"
                      >
                        Open Video
                      </a>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Learning Objectives (moved above content for context) */}
          {lesson.learning_objectives && lesson.learning_objectives.length > 0 && (
            <Card className="shadow-[var(--shadow-islamic)]">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Target className={cn('h-5 w-5', colors.icon)} />
                  What You&apos;ll Learn
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {lesson.learning_objectives.map((obj, i) => (
                    <div
                      key={i}
                      className={cn(
                        'flex items-start gap-2.5 rounded-lg p-3 border',
                        colors.bg, 'border-transparent',
                      )}
                    >
                      <CheckCircle className={cn('h-4 w-4 mt-0.5 shrink-0', colors.icon)} />
                      <span className="text-sm text-gray-700 leading-relaxed">{obj}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* AI Summary */}
          {lesson.content && (
            <AILessonSummary content={lesson.content} />
          )}

          {/* Lesson Content */}
          {lesson.content && (
            <Card className="shadow-[var(--shadow-islamic)]">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <FileText className={cn('h-5 w-5', colors.icon)} />
                  Lesson Content
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className="prose prose-gray max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-600 prose-p:leading-relaxed prose-li:text-gray-600 prose-strong:text-gray-900 prose-a:text-emerald-600"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(lesson.content) }}
                />
              </CardContent>
            </Card>
          )}

          {/* ── Comprehension Check ────────────────────────────────────── */}
          {comprehensionQuestions.length > 0 && (
            <Card className="shadow-[var(--shadow-islamic)] border-2 border-dashed border-gray-200 overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <HelpCircle className={cn('h-5 w-5', colors.icon)} />
                    Comprehension Check
                  </CardTitle>
                  {quizScore && (
                    <Badge className={cn(
                      'border-0',
                      quizScore.score / quizScore.total >= 0.67
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-amber-100 text-amber-700',
                    )}>
                      {quizScore.score}/{quizScore.total}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Test your understanding of this lesson with a quick quiz.
                </p>
              </CardHeader>
              <CardContent>
                <ComprehensionCheck
                  questions={comprehensionQuestions}
                  colors={colors}
                  onComplete={handleQuizComplete}
                />
              </CardContent>
            </Card>
          )}

          {/* ── Bottom Navigation ──────────────────────────────────────── */}
          <Card className="shadow-[var(--shadow-islamic)]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between gap-3">
                {prevLesson ? (
                  <Link href={`/student/lessons/${prevLesson.documentId || prevLesson.id}`} className="flex-1">
                    <Button variant="outline" className="w-full justify-start rounded-xl">
                      <ArrowLeft className="h-4 w-4 mr-2 shrink-0" />
                      <div className="text-left min-w-0">
                        <span className="text-[10px] text-gray-400 block">Previous</span>
                        <span className="text-sm truncate block">{prevLesson.title}</span>
                      </div>
                    </Button>
                  </Link>
                ) : <div className="flex-1" />}

                {!isCompleted && (
                  <Button
                    className={cn('rounded-xl text-white bg-gradient-to-r shrink-0', colors.gradient)}
                    onClick={handleMarkComplete}
                    disabled={updateProgress.isPending}
                  >
                    {updateProgress.isPending ? (
                      <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...</>
                    ) : (
                      <><CheckCircle className="h-4 w-4 mr-2" /> Mark Complete</>
                    )}
                  </Button>
                )}

                {isCompleted && (
                  <Badge className="bg-emerald-100 text-emerald-700 border-0 px-4 py-2 shrink-0">
                    <CheckCircle className="h-4 w-4 mr-1.5" /> Completed
                  </Badge>
                )}

                {nextLesson ? (
                  <Link href={`/student/lessons/${nextLesson.documentId || nextLesson.id}`} className="flex-1">
                    <Button className={cn('w-full justify-end rounded-xl text-white bg-gradient-to-r', colors.gradient)}>
                      <div className="text-right min-w-0">
                        <span className="text-[10px] text-white/70 block">Next</span>
                        <span className="text-sm truncate block">{nextLesson.title}</span>
                      </div>
                      <ArrowRight className="h-4 w-4 ml-2 shrink-0" />
                    </Button>
                  </Link>
                ) : <div className="flex-1" />}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── Sidebar ──────────────────────────────────────────────────── */}
        <div className="space-y-6">

          {/* Lesson Quick Info */}
          <Card className="shadow-[var(--shadow-islamic)]">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-500" /> Lesson Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-0 text-sm">
              {[
                { icon: Clock, label: 'Duration', value: `${lesson.duration_minutes} min` },
                { icon: TypeIcon, label: 'Type', value: typeLabel },
                { icon: Target, label: 'Order', value: `Lesson ${lesson.lesson_order}` },
                { icon: BarChart3, label: 'Subject', value: subjectLabel },
              ].map((row, i, arr) => (
                <div
                  key={row.label}
                  className={cn(
                    'flex items-center justify-between py-3',
                    i < arr.length - 1 && 'border-b border-gray-100',
                  )}
                >
                  <span className="flex items-center gap-2 text-gray-500">
                    <row.icon className="h-4 w-4" /> {row.label}
                  </span>
                  <span className="font-medium capitalize">{row.value}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Course Curriculum */}
          {courseLessons.length > 0 && (
            <Card className="shadow-[var(--shadow-islamic)]">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Course Curriculum</CardTitle>
                {course && (
                  <p className="text-sm text-gray-500">{course.title}</p>
                )}
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y max-h-[400px] overflow-y-auto">
                  {courseLessons.map((cl) => {
                    const isCurrent = String(cl.documentId) === lessonId || String(cl.id) === lessonId;
                    const clProgress = allProgress.find(p => p.lesson?.id === cl.id);
                    const clCompleted = clProgress?.status === 'completed';

                    return (
                      <Link
                        key={cl.id}
                        href={`/student/lessons/${cl.documentId || cl.id}`}
                        className={cn(
                          'flex items-center gap-3 px-4 py-3 text-sm transition-colors',
                          isCurrent
                            ? `${colors.bg} border-l-2`
                            : 'hover:bg-gray-50',
                        )}
                        style={isCurrent ? { borderLeftColor: 'currentColor' } : undefined}
                      >
                        <span className={cn(
                          'w-7 h-7 rounded-lg flex items-center justify-center text-xs font-semibold shrink-0',
                          isCurrent && `bg-gradient-to-br ${colors.gradient} text-white`,
                          !isCurrent && clCompleted && `${colors.bg} ${colors.text}`,
                          !isCurrent && !clCompleted && 'bg-gray-100 text-gray-500',
                        )}>
                          {clCompleted && !isCurrent ? (
                            <CheckCircle className="h-3.5 w-3.5" />
                          ) : (
                            cl.lesson_order
                          )}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className={cn(
                            'truncate',
                            isCurrent ? `font-medium ${colors.text}` : 'text-gray-700',
                          )}>
                            {cl.title}
                          </p>
                          <p className="text-xs text-gray-400">{cl.duration_minutes} min</p>
                        </div>
                        {isCurrent && (
                          <ChevronRight className={cn('h-4 w-4 shrink-0', colors.icon)} />
                        )}
                      </Link>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* External Quiz Link (if lesson has a separate quiz) */}
          {lesson.quiz && (
            <Card className="shadow-[var(--shadow-islamic)]">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-purple-500" /> Full Quiz
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-3">{lesson.quiz.title}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {lesson.quiz.time_limit_minutes} min
                  </span>
                  <span>Pass: {lesson.quiz.passing_score}%</span>
                  <span>{lesson.quiz.max_attempts} attempts</span>
                </div>
                <Link href={`/student/quizzes/${lesson.quiz.documentId || lesson.quiz.id}`}>
                  <Button className={cn('w-full rounded-xl text-white bg-gradient-to-r', colors.gradient)}>
                    <HelpCircle className="h-4 w-4 mr-2" /> Take Quiz
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </StudentLayout>
  );
}
