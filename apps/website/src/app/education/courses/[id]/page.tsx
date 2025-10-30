'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  BookOpen,
  Clock,
  BarChart,
  CheckCircle2,
  Lock,
  Loader2,
  GraduationCap,
  Target,
  Trophy
} from 'lucide-react';
import { useCourseById } from '@/lib/hooks/use-strapi-courses';
import { getSubjectLabel, getAgeTierLabel, getDifficultyLabel, formatDuration } from '@/lib/strapi-api';

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;

  const { data: course, isLoading, isError, error } = useCourseById(courseId);

  // Loading State
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-12 w-12 animate-spin text-islamic-green-600" />
          <span className="ml-4 text-lg text-gray-600">Loading course...</span>
        </div>
      </div>
    );
  }

  // Error State
  if (isError || !course) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="py-12 text-center">
            <div className="h-16 w-16 text-red-400 mx-auto mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Failed to load course</h3>
            <p className="text-gray-500 mb-4">
              {error?.message || 'Course not found'}
            </p>
            <div className="flex gap-2 justify-center">
              <Button variant="outline" onClick={() => router.back()}>
                Go Back
              </Button>
              <Button onClick={() => window.location.reload()}>Retry</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalLessons = course.lessons?.length || 0;
  // Calculate total duration from lessons, or estimate from duration_weeks
  const totalDuration = course.lessons?.reduce((sum, lesson) => sum + (lesson.duration_minutes || 0), 0)
    || (course.duration_weeks || 0) * 60 * 24 * 7; // weeks to minutes

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="hover:bg-gray-100"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Courses
        </Button>
      </div>

      {/* Course Header */}
      <div className="grid lg:grid-cols-3 gap-8 mb-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title and Description */}
          <div>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge className="bg-islamic-green-100 text-islamic-green-800 border-islamic-green-200">
                {getSubjectLabel(course.subject)}
              </Badge>
              <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                {getAgeTierLabel(course.age_tier)}
              </Badge>
              <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                {getDifficultyLabel(course.difficulty)}
              </Badge>
            </div>

            <h1 className="text-4xl font-bold text-islamic-navy-800 mb-4">
              {course.title}
            </h1>

            <p className="text-lg text-gray-600 leading-relaxed">
              {course.description}
            </p>
          </div>

          {/* Course Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <BookOpen className="h-8 w-8 text-islamic-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-islamic-navy-800">{totalLessons}</p>
                  <p className="text-sm text-gray-600">Lessons</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <Clock className="h-8 w-8 text-islamic-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-islamic-navy-800">
                    {formatDuration(totalDuration)}
                  </p>
                  <p className="text-sm text-gray-600">Duration</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <GraduationCap className="h-8 w-8 text-islamic-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-islamic-navy-800">
                    {getDifficultyLabel(course.difficulty)}
                  </p>
                  <p className="text-sm text-gray-600">Level</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <Trophy className="h-8 w-8 text-islamic-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-islamic-navy-800">0%</p>
                  <p className="text-sm text-gray-600">Complete</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Learning Objectives */}
          {course.learning_objectives && course.learning_objectives.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-islamic-green-600" />
                  What You'll Learn
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {course.learning_objectives.map((objective, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-islamic-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{objective}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Prerequisites */}
          {course.prerequisites && course.prerequisites.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-islamic-green-600" />
                  Prerequisites
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {course.prerequisites.map((prerequisite, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-islamic-green-600 font-bold">•</span>
                      <span className="text-gray-700">{prerequisite}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Enrollment Card */}
          <Card className="border-2 border-islamic-green-200">
            <CardHeader>
              <CardTitle>Start Learning</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                size="lg"
                className="w-full bg-islamic-green-600 hover:bg-islamic-green-700"
                onClick={() => {
                  // TODO: Implement enrollment
                  alert('Enrollment coming soon!');
                }}
              >
                Enroll Now
              </Button>

              <div className="text-center text-sm text-gray-600">
                <p>Free • Self-paced • {totalLessons} lessons</p>
              </div>
            </CardContent>
          </Card>

          {/* Course Progress Card (TODO: Show when enrolled) */}
          <Card className="hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart className="h-5 w-5" />
                Your Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Completed</span>
                    <span className="font-semibold">0/{totalLessons} lessons</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-islamic-green-600 h-2 rounded-full"
                      style={{ width: '0%' }}
                    />
                  </div>
                </div>
                <Button size="sm" variant="outline" className="w-full">
                  Continue Learning
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Lessons List */}
      <div>
        <h2 className="text-2xl font-bold text-islamic-navy-800 mb-6">
          Course Curriculum
        </h2>

        {course.lessons && course.lessons.length > 0 ? (
          <div className="space-y-3">
            {course.lessons
              .sort((a, b) => a.order_index - b.order_index)
              .map((lesson, index) => {
                const isCompleted = false; // TODO: Check actual progress
                const isLocked = false; // TODO: Implement sequential unlocking

                return (
                  <Card
                    key={lesson.id}
                    className={`hover:shadow-md transition-shadow ${
                      isLocked ? 'opacity-60' : 'cursor-pointer hover:border-islamic-green-200'
                    }`}
                    onClick={() => {
                      if (!isLocked) {
                        router.push(`/education/lessons/${lesson.documentId}`);
                      }
                    }}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        {/* Lesson Number/Status Icon */}
                        <div className="flex-shrink-0">
                          {isCompleted ? (
                            <div className="w-10 h-10 rounded-full bg-islamic-green-100 flex items-center justify-center">
                              <CheckCircle2 className="h-6 w-6 text-islamic-green-600" />
                            </div>
                          ) : isLocked ? (
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-islamic-green-50 border-2 border-islamic-green-600 flex items-center justify-center">
                              <span className="font-bold text-islamic-green-600">{index + 1}</span>
                            </div>
                          )}
                        </div>

                        {/* Lesson Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <h3 className="text-lg font-semibold text-islamic-navy-800">
                              {lesson.title}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-gray-600 flex-shrink-0">
                              <Clock className="h-4 w-4" />
                              {formatDuration(lesson.duration_minutes)}
                            </div>
                          </div>

                          <p className="text-gray-600 mb-3 line-clamp-2">
                            {lesson.description}
                          </p>

                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {lesson.content_type}
                            </Badge>
                            {lesson.quiz && (
                              <Badge variant="outline" className="text-xs border-purple-300 text-purple-700">
                                Includes Quiz
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No lessons yet</h3>
              <p className="text-gray-500">
                Lessons for this course are being prepared.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
