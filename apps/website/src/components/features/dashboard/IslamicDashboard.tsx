'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/lib/hooks/useAuth';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Clock, 
  TrendingUp, 
  Calendar,
  Users,
  Award,
  Compass,
  Moon
} from 'lucide-react';

// Types
interface PrayerTimes {
  date: string;
  location: { latitude: number; longitude: number };
  prayers: {
    fajr: string;
    sunrise: string;
    dhuhr: string;
    asr: string;
    maghrib: string;
    isha: string;
  };
  method: string;
}

interface EducationProgress {
  id: string;
  courseTitle: string;
  ageGroup: 'PRESCHOOL' | 'ELEMENTARY' | 'MIDDLE_SCHOOL' | 'HIGH_SCHOOL' | 'COLLEGE' | 'ADULTS' | 'SENIORS';
  contentType: 'QURAN' | 'HADITH' | 'ISLAMIC_STUDIES' | 'ARABIC' | 'ISLAMIC_HISTORY';
  progress: number; // 0-100
  totalLessons: number;
  completedLessons: number;
  lastAccessedAt: string;
  nextLesson?: {
    title: string;
    estimatedDuration: number;
  };
}

interface DashboardStats {
  totalPrayersThisWeek: number;
  educationalHoursThisMonth: number;
  completedCourses: number;
  communityRank?: number;
  currentStreak: number;
  upcomingEvents: number;
}

interface IslamicDashboardProps {
  className?: string;
}

export function IslamicDashboard({ className }: IslamicDashboardProps) {
  const { user, isAuthenticated } = useAuth();

  // Prayer Times Query
  const { data: prayerTimes, isLoading: prayerLoading } = useQuery<PrayerTimes>({
    queryKey: ['prayer-times'],
    queryFn: () => fetch('/api/prayer-times').then(res => res.json()),
    staleTime: 60 * 60 * 1000, // 1 hour cache for prayer times
    enabled: isAuthenticated
  });

  // Educational Progress Query
  const { data: educationProgress, isLoading: educationLoading } = useQuery<EducationProgress[]>({
    queryKey: ['education-progress', user?.id],
    queryFn: () => fetch('/api/education/progress').then(res => res.json()),
    staleTime: 5 * 60 * 1000, // 5 minutes cache
    enabled: isAuthenticated && !!user?.id
  });

  // Dashboard Stats Query
  const { data: dashboardStats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ['dashboard-stats', user?.id],
    queryFn: () => fetch('/api/dashboard/stats').then(res => res.json()),
    staleTime: 10 * 60 * 1000, // 10 minutes cache
    enabled: isAuthenticated && !!user?.id
  });

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-gradient-to-br from-islamic-green/5 to-islamic-gold/5 rounded-lg">
        <div className="text-center p-8">
          <Moon className="h-16 w-16 text-islamic-green/60 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-islamic-navy mb-2">
            Welcome to Islamic Dashboard
          </h3>
          <p className="text-gray-600 mb-4">
            Please log in to access your personalized Islamic learning journey and prayer tracking.
          </p>
          <Button className="bg-islamic-green hover:bg-islamic-green/90">
            Sign In to Continue
          </Button>
        </div>
      </div>
    );
  }

  const getCurrentPrayer = () => {
    if (!prayerTimes) return null;
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5);
    
    const prayers = [
      { name: 'Fajr', time: prayerTimes.prayers.fajr, arabic: 'الفجر' },
      { name: 'Dhuhr', time: prayerTimes.prayers.dhuhr, arabic: 'الظهر' },
      { name: 'Asr', time: prayerTimes.prayers.asr, arabic: 'العصر' },
      { name: 'Maghrib', time: prayerTimes.prayers.maghrib, arabic: 'المغرب' },
      { name: 'Isha', time: prayerTimes.prayers.isha, arabic: 'العشاء' }
    ];

    return prayers.find(prayer => currentTime < prayer.time) || prayers[0];
  };

  const nextPrayer = getCurrentPrayer();

  return (
    <div className={cn("space-y-6", className)}>
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-islamic-green to-islamic-green/80 text-white rounded-lg p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">
              Assalamu Alaikum, {user?.name?.split(' ')[0] || 'Brother/Sister'}
            </h1>
            <p className="text-islamic-green-50 text-sm sm:text-base">
              May Allah bless your learning journey and spiritual growth
            </p>
          </div>
          <div className="mt-4 sm:mt-0 text-right">
            <div className="text-islamic-green-100 text-sm">Today's Date</div>
            <div className="text-lg font-semibold">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long',
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-islamic-green/20 bg-gradient-to-br from-islamic-green/5 to-transparent">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Prayers This Week</p>
                <p className="text-2xl font-bold text-islamic-green">
                  {statsLoading ? '...' : dashboardStats?.totalPrayersThisWeek || 0}
                </p>
              </div>
              <Clock className="h-8 w-8 text-islamic-green/60" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-islamic-gold/20 bg-gradient-to-br from-islamic-gold/5 to-transparent">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Learning Hours</p>
                <p className="text-2xl font-bold text-islamic-gold">
                  {statsLoading ? '...' : dashboardStats?.educationalHoursThisMonth || 0}
                </p>
              </div>
              <BookOpen className="h-8 w-8 text-islamic-gold/60" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-islamic-navy/20 bg-gradient-to-br from-islamic-navy/5 to-transparent">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Current Streak</p>
                <p className="text-2xl font-bold text-islamic-navy">
                  {statsLoading ? '...' : dashboardStats?.currentStreak || 0} days
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-islamic-navy/60" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-500/20 bg-gradient-to-br from-green-500/5 to-transparent">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Completed Courses</p>
                <p className="text-2xl font-bold text-green-600">
                  {statsLoading ? '...' : dashboardStats?.completedCourses || 0}
                </p>
              </div>
              <Award className="h-8 w-8 text-green-600/60" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Prayer Time & Qibla Section */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="border-islamic-green/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-islamic-green">
                <Clock className="h-5 w-5" />
                Next Prayer
              </CardTitle>
            </CardHeader>
            <CardContent>
              {prayerLoading ? (
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              ) : nextPrayer ? (
                <div className="text-center">
                  <div className="flex items-center justify-center gap-4 mb-4">
                    <div className="text-right">
                      <p className="text-2xl font-bold text-islamic-green prayer-time">
                        {nextPrayer.time}
                      </p>
                      <p className="text-lg font-semibold text-islamic-navy">
                        {nextPrayer.name}
                      </p>
                    </div>
                    <div className="text-left">
                      <p className="text-2xl font-arabic text-islamic-green">
                        {nextPrayer.arabic}
                      </p>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4 mt-4">
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                      <Compass className="h-4 w-4" />
                      <span>Qibla Direction: 58.5° NE</span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-center">Prayer times unavailable</p>
              )}
            </CardContent>
          </Card>

          <Card className="border-islamic-gold/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-islamic-gold">
                <Calendar className="h-5 w-5" />
                Islamic Calendar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Hijri Date:</span>
                  <span className="font-semibold">15 Sha'ban 1446</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Days to Ramadan:</span>
                  <Badge variant="outline" className="bg-islamic-gold/10 text-islamic-gold border-islamic-gold/30">
                    45 days
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Educational Progress Section */}
        <div className="lg:col-span-2">
          <Card className="border-islamic-navy/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-islamic-navy">
                <BookOpen className="h-5 w-5" />
                Your Islamic Learning Journey
              </CardTitle>
            </CardHeader>
            <CardContent>
              {educationLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                      <div className="h-2 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    </div>
                  ))}
                </div>
              ) : educationProgress && educationProgress.length > 0 ? (
                <div className="space-y-6">
                  {educationProgress.slice(0, 3).map((course) => (
                    <div key={course.id} className="border-l-4 border-islamic-green/30 pl-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-islamic-navy mb-1">
                            {course.courseTitle}
                          </h4>
                          <div className="flex gap-2 mb-2">
                            <Badge variant="secondary" className="text-xs">
                              {course.contentType}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {course.ageGroup.replace('_', ' ')}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">
                            {course.completedLessons}/{course.totalLessons} lessons
                          </p>
                          <p className="text-lg font-bold text-islamic-green">
                            {Math.round(course.progress)}%
                          </p>
                        </div>
                      </div>
                      
                      <Progress 
                        value={course.progress} 
                        className="h-2 mb-3"
                      />
                      
                      {course.nextLesson && (
                        <div className="bg-islamic-green/5 rounded-lg p-3">
                          <p className="text-sm text-gray-700 mb-1">
                            <strong>Next Lesson:</strong> {course.nextLesson.title}
                          </p>
                          <p className="text-xs text-gray-600">
                            Estimated duration: {course.nextLesson.estimatedDuration} minutes
                          </p>
                          <Button 
                            size="sm" 
                            className="mt-2 bg-islamic-green hover:bg-islamic-green/90 text-white"
                          >
                            Continue Learning
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  <div className="pt-4 border-t">
                    <Button 
                      variant="outline" 
                      className="w-full border-islamic-green text-islamic-green hover:bg-islamic-green hover:text-white"
                    >
                      View All Courses
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    Start Your Islamic Learning Journey
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Explore our comprehensive Islamic education programs designed for all ages.
                  </p>
                  <Button className="bg-islamic-green hover:bg-islamic-green/90">
                    Browse Courses
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Community Activity Section */}
      <Card className="border-islamic-gold/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-islamic-gold">
            <Users className="h-5 w-5" />
            Community Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-islamic-green mb-1">
                {statsLoading ? '...' : dashboardStats?.upcomingEvents || 0}
              </p>
              <p className="text-sm text-gray-600">Upcoming Events</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-islamic-gold mb-1">
                {statsLoading ? '...' : dashboardStats?.communityRank || '--'}
              </p>
              <p className="text-sm text-gray-600">Community Ranking</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-islamic-navy mb-1">156</p>
              <p className="text-sm text-gray-600">Active Members</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}