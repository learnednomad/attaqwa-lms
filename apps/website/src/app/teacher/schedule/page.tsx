'use client';

import React, { useState, useEffect } from 'react';
import { TeacherLayout } from '@/components/layout/teacher-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Calendar, MapPin, Users, Plus, ChevronLeft, ChevronRight, BookOpen, Loader2 } from 'lucide-react';
import { teacherApi } from '@/lib/teacher-api';

interface ScheduleItem {
  id: number;
  day: string;
  time: string;
  course: string;
  room: string;
  students: number;
  type: string;
}

export default function TeacherSchedulePage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await teacherApi.courses.getMyCourses();
        setCourses(res.data || []);
      } catch (err) {
        console.error('Failed to fetch courses:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // Generate schedule items from courses
  const schedule: ScheduleItem[] = courses.map((course, i) => ({
    id: course.id,
    day: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][i % 6],
    time: course.schedule || 'TBD',
    course: course.title,
    room: 'TBD',
    students: course.current_enrollments || 0,
    type: 'Class',
  }));

  const weekLabel = (() => {
    const now = new Date();
    const start = new Date(now);
    start.setDate(now.getDate() - now.getDay() + 1);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  })();

  if (loading) {
    return (
      <TeacherLayout title="Class Schedule" subtitle="View and manage your teaching schedule">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-islamic-green-600" />
        </div>
      </TeacherLayout>
    );
  }

  return (
    <TeacherLayout title="Class Schedule" subtitle="View and manage your teaching schedule">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Schedule */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold">Weekly Schedule</CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm text-gray-600">{weekLabel}</span>
                <Button variant="outline" size="icon">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {schedule.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p className="font-medium">No classes scheduled</p>
                  <p className="text-sm mt-1">Your courses don&apos;t have schedule data yet. Add schedule information to your courses.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {schedule.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-islamic-green-200 hover:bg-islamic-green-50/30 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-24 text-center">
                          <p className="font-medium text-gray-900">{item.day}</p>
                          <p className="text-sm text-gray-500">{item.time}</p>
                        </div>
                        <div className="h-12 w-px bg-gray-200" />
                        <div>
                          <h3 className="font-medium text-gray-900">{item.course}</h3>
                          <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" /> {item.room}
                            </span>
                            {item.students > 0 && (
                              <span className="flex items-center gap-1">
                                <Users className="h-4 w-4" /> {item.students} students
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline">{item.type}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-islamic-green-500" />
                Your Courses
              </CardTitle>
            </CardHeader>
            <CardContent>
              {courses.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">No courses found.</p>
              ) : (
                <div className="space-y-3">
                  {courses.map((course: any) => (
                    <div key={course.id} className="p-3 bg-gray-50 rounded-lg">
                      <p className="font-medium text-gray-900 text-sm">{course.title}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {course.lessons?.length || 0} lessons | {course.current_enrollments || 0} students
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Plus className="h-4 w-4 mr-2" /> Add Special Session
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="h-4 w-4 mr-2" /> Request Room Change
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Clock className="h-4 w-4 mr-2" /> Set Office Hours
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </TeacherLayout>
  );
}
