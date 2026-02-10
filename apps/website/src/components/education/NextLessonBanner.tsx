/**
 * Next Lesson Banner Component
 * Student dashboard banner suggesting the next lesson + streak info.
 */

'use client';

import { BookOpen, Flame, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface NextLessonBannerProps {
  nextLesson?: {
    id: string;
    title: string;
    courseName: string;
    courseSlug: string;
  };
  streak?: {
    current: number;
    longest: number;
  };
}

export function NextLessonBanner({ nextLesson, streak }: NextLessonBannerProps) {
  if (!nextLesson && !streak) return null;

  return (
    <div className="rounded-xl bg-gradient-to-r from-green-600 to-green-700 p-5 text-white shadow-lg">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Next Lesson */}
        {nextLesson ? (
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-white/20 p-3">
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-green-100">Continue Learning</p>
              <p className="text-lg font-bold">{nextLesson.title}</p>
              <p className="text-sm text-green-200">{nextLesson.courseName}</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-white/20 p-3">
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <p className="text-lg font-bold">Start a New Course</p>
              <p className="text-sm text-green-200">Explore our course catalog</p>
            </div>
          </div>
        )}

        <div className="flex items-center gap-4">
          {/* Streak Info */}
          {streak && streak.current > 0 && (
            <div className="flex items-center gap-2 rounded-lg bg-white/15 px-4 py-2">
              <Flame className="h-5 w-5 text-orange-300" />
              <div>
                <p className="text-lg font-bold">{streak.current}</p>
                <p className="text-xs text-green-200">day streak</p>
              </div>
            </div>
          )}

          {/* CTA */}
          {nextLesson ? (
            <Link
              href={`/courses/${nextLesson.courseSlug}/lessons/${nextLesson.id}`}
              className="flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 font-medium text-green-700 transition-colors hover:bg-green-50"
            >
              Continue
              <ArrowRight className="h-4 w-4" />
            </Link>
          ) : (
            <Link
              href="/student/courses"
              className="flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 font-medium text-green-700 transition-colors hover:bg-green-50"
            >
              Browse Courses
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
