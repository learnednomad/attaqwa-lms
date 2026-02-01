'use client';

import React, { useState, useEffect } from 'react';
import { TeacherLayout } from '@/components/layout/teacher-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  BookOpen, Users, Clock, Award, TrendingUp,
  Calendar, ClipboardCheck, AlertCircle, CheckCircle,
  ArrowRight, Loader2, FileText, Star, BarChart3
} from 'lucide-react';
import { teacherApi } from '@/lib/teacher-api';

interface CourseData {
  id: number;
  title: string;
  students: number;
  progress: number;
  nextClass: string;
  room: string;
  pendingAssignments: number;
  subject: string;
}

interface StudentAlert {
  id: number;
  name: string;
  course: string;
  issue: string;
  severity: 'low' | 'medium' | 'high';
}

interface RecentActivity {
  id: number;
  type: 'enrollment' | 'submission' | 'completion' | 'question';
  message: string;
  time: string;
  student: string;
  course: string;
}

const mockCourses: CourseData[] = [
  {
    id: 1,
    title: 'Fiqh of Worship',
    students: 24,
    progress: 65,
    nextClass: 'Today 6:30 PM',
    room: 'A-101',
    pendingAssignments: 8,
    subject: 'Fiqh'
  },
  {
    id: 2,
    title: 'Hadith Studies - 40 Nawawi',
    students: 18,
    progress: 40,
    nextClass: 'Tomorrow 7:00 PM',
    room: 'B-203',
    pendingAssignments: 5,
    subject: 'Hadith'
  },
  {
    id: 3,
    title: 'Arabic Grammar Level 2',
    students: 15,
    progress: 75,
    nextClass: 'Wednesday 5:00 PM',
    room: 'C-105',
    pendingAssignments: 3,
    subject: 'Arabic'
  },
];

const mockAlerts: StudentAlert[] = [
  { id: 1, name: 'Ahmad Hassan', course: 'Fiqh of Worship', issue: 'Missing 3 assignments', severity: 'high' },
  { id: 2, name: 'Fatima Ali', course: 'Hadith Studies', issue: 'Low quiz scores (below 60%)', severity: 'medium' },
  { id: 3, name: 'Omar Ibrahim', course: 'Arabic Grammar', issue: 'Absent for 2 weeks', severity: 'high' },
  { id: 4, name: 'Aisha Mohamed', course: 'Fiqh of Worship', issue: 'Struggling with recent material', severity: 'low' },
];

const mockActivity: RecentActivity[] = [
  { id: 1, type: 'submission', message: 'Submitted "Wudu Practice" assignment', time: '10 minutes ago', student: 'Zayd Ahmed', course: 'Fiqh of Worship' },
  { id: 2, type: 'enrollment', message: 'Enrolled in course', time: '1 hour ago', student: 'Maryam Khan', course: 'Hadith Studies' },
  { id: 3, type: 'completion', message: 'Completed Lesson 15', time: '2 hours ago', student: 'Ibrahim Ali', course: 'Arabic Grammar' },
  { id: 4, type: 'question', message: 'Asked question in discussion', time: '3 hours ago', student: 'Sara Hassan', course: 'Fiqh of Worship' },
  { id: 5, type: 'submission', message: 'Submitted "Nahw Exercise 5"', time: '4 hours ago', student: 'Yusuf Omar', course: 'Arabic Grammar' },
];

export default function TeacherDashboard() {
  const [courses, setCourses] = useState<CourseData[]>([]);
  const [alerts] = useState<StudentAlert[]>(mockAlerts);
  const [activity] = useState<RecentActivity[]>(mockActivity);
  const [loading, setLoading] = useState(true);
  const [dataSource, setDataSource] = useState<'api' | 'mock'>('mock');

  // Stats
  const totalStudents = courses.reduce((sum, c) => sum + c.students, 0);
  const pendingGrading = courses.reduce((sum, c) => sum + c.pendingAssignments, 0);
  const avgProgress = courses.length > 0
    ? Math.round(courses.reduce((sum, c) => sum + c.progress, 0) / courses.length)
    : 0;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const dashboardData = await teacherApi.dashboard.getData();

        // Transform API data to UI format
        if (dashboardData.courses.total > 0) {
          const coursesRes = await teacherApi.courses.getMyCourses();
          const apiCourses = (coursesRes.data || []).map((course: any) => ({
            id: course.id,
            title: course.title,
            students: course.current_enrollments || 0,
            progress: Math.round(Math.random() * 100), // Would need real progress data
            nextClass: 'TBD',
            room: 'TBD',
            pendingAssignments: 0,
            subject: course.subject || 'General',
          }));

          if (apiCourses.length > 0) {
            setCourses(apiCourses);
            setDataSource('api');
          } else {
            setCourses(mockCourses);
            setDataSource('mock');
          }
        } else {
          setCourses(mockCourses);
          setDataSource('mock');
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        setCourses(mockCourses);
        setDataSource('mock');
      } finally {
        setLoading(false);
      }
    };

    // Skip API call in development for now
    const isDev = process.env.NODE_ENV === 'development';
    if (isDev) {
      setCourses(mockCourses);
      setLoading(false);
    } else {
      fetchData();
    }
  }, []);

  if (loading) {
    return (
      <TeacherLayout title="Dashboard" subtitle="Welcome back, Sheikh Abdullah">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        </div>
      </TeacherLayout>
    );
  }

  return (
    <TeacherLayout title="Dashboard" subtitle="Welcome back, Sheikh Abdullah">
      {/* Data Source Badge */}
      <div className="mb-4">
        {dataSource === 'api' ? (
          <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
            <CheckCircle className="h-3 w-3 mr-1" />
            Live Data from Strapi
          </Badge>
        ) : (
          <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">
            <AlertCircle className="h-3 w-3 mr-1" />
            Demo Mode (Mock Data)
          </Badge>
        )}
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">{totalStudents}</p>
              </div>
              <div className="p-3 bg-indigo-100 rounded-xl">
                <Users className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
            <p className="text-xs text-emerald-600 mt-2 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" /> +3 this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active Courses</p>
                <p className="text-2xl font-bold text-gray-900">{courses.length}</p>
              </div>
              <div className="p-3 bg-emerald-100 rounded-xl">
                <BookOpen className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">This semester</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pending Grading</p>
                <p className="text-2xl font-bold text-gray-900">{pendingGrading}</p>
              </div>
              <div className="p-3 bg-amber-100 rounded-xl">
                <ClipboardCheck className="h-6 w-6 text-amber-600" />
              </div>
            </div>
            <p className="text-xs text-amber-600 mt-2">Assignments to review</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Avg. Progress</p>
                <p className="text-2xl font-bold text-gray-900">{avgProgress}%</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-xl">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <p className="text-xs text-emerald-600 mt-2 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" /> +5% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* My Courses */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-semibold">My Courses</CardTitle>
              <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-700">
                View All <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {courses.map((course) => (
                  <div
                    key={course.id}
                    className="p-4 border border-gray-200 rounded-xl hover:border-indigo-200 hover:bg-indigo-50/30 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-gray-900">{course.title}</h3>
                          <Badge variant="outline" className="text-xs">
                            {course.subject}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Users className="h-4 w-4" /> {course.students} students
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" /> {course.nextClass}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" /> Room {course.room}
                          </span>
                        </div>
                      </div>
                      {course.pendingAssignments > 0 && (
                        <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">
                          {course.pendingAssignments} to grade
                        </Badge>
                      )}
                    </div>
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-500">Course Progress</span>
                        <span className="font-medium text-gray-700">{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Students Needing Attention */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-amber-500" />
                Students Needing Attention
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {alerts.slice(0, 4).map((alert) => (
                  <div
                    key={alert.id}
                    className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      alert.severity === 'high' ? 'bg-red-500' :
                      alert.severity === 'medium' ? 'bg-amber-500' : 'bg-blue-500'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm">{alert.name}</p>
                      <p className="text-xs text-gray-500">{alert.course}</p>
                      <p className="text-xs text-gray-600 mt-1">{alert.issue}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4" size="sm">
                View All Alerts
              </Button>
            </CardContent>
          </Card>

          {/* Today's Schedule */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Calendar className="h-5 w-5 text-indigo-500" />
                Today&apos;s Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-indigo-50 rounded-lg border border-indigo-100">
                  <div className="text-center">
                    <p className="text-sm font-medium text-indigo-700">6:30</p>
                    <p className="text-xs text-indigo-500">PM</p>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">Fiqh of Worship</p>
                    <p className="text-xs text-gray-500">Room A-101 | 24 students</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-700">8:00</p>
                    <p className="text-xs text-gray-500">PM</p>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">Office Hours</p>
                    <p className="text-xs text-gray-500">Room B-105 | Drop-in</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Activity */}
      <Card className="mt-6">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-semibold">Recent Student Activity</CardTitle>
          <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-700">
            View All <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {activity.map((item) => (
              <div key={item.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className={`p-2 rounded-lg ${
                  item.type === 'submission' ? 'bg-emerald-100' :
                  item.type === 'enrollment' ? 'bg-indigo-100' :
                  item.type === 'completion' ? 'bg-purple-100' : 'bg-amber-100'
                }`}>
                  {item.type === 'submission' ? <FileText className="h-4 w-4 text-emerald-600" /> :
                   item.type === 'enrollment' ? <Users className="h-4 w-4 text-indigo-600" /> :
                   item.type === 'completion' ? <Award className="h-4 w-4 text-purple-600" /> :
                   <Star className="h-4 w-4 text-amber-600" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm">
                    <span className="font-medium text-gray-900">{item.student}</span>
                    <span className="text-gray-500"> {item.message}</span>
                  </p>
                  <p className="text-xs text-gray-400 mt-1">{item.course} &bull; {item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </TeacherLayout>
  );
}
