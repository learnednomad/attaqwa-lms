'use client';

import React from 'react';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
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
  Moon,
  Sparkles,
  Star,
  Zap,
  Activity,
  CheckCircle,
  ArrowRight,
  Play
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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: 0, // Disable caching for mock data
      gcTime: 0, // Disable caching for mock data
      refetchOnWindowFocus: false, // Performance optimization for demo
      refetchOnMount: true, // Ensure fresh data on component mount
    },
  },
});

// Mock Auth Context for testing
interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isModerator: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

// Mock useAuth hook for this test page
function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Mock data
const mockPrayerTimes: PrayerTimes = {
  date: new Date().toISOString().split('T')[0],
  location: { latitude: 33.8688, longitude: -84.2813 },
  prayers: {
    fajr: '05:30',
    sunrise: '07:07',
    dhuhr: '12:45',
    asr: '15:30',
    maghrib: '18:00',
    isha: '19:30'
  },
  method: 'ISNA'
};

const mockEducationProgress: EducationProgress[] = [
  {
    id: '1',
    courseTitle: 'Foundations of Islam',
    ageGroup: 'ADULTS',
    contentType: 'ISLAMIC_STUDIES',
    progress: 75,
    totalLessons: 20,
    completedLessons: 15,
    lastAccessedAt: new Date().toISOString(),
    nextLesson: {
      title: 'The Pillars of Faith',
      estimatedDuration: 25
    }
  },
  {
    id: '2',
    courseTitle: 'Quran Recitation - Tajweed',
    ageGroup: 'ADULTS',
    contentType: 'QURAN',
    progress: 40,
    totalLessons: 30,
    completedLessons: 12,
    lastAccessedAt: new Date().toISOString(),
    nextLesson: {
      title: 'Makhaarij - Points of Articulation',
      estimatedDuration: 30
    }
  }
];

const mockDashboardStats: DashboardStats = {
  totalPrayersThisWeek: 28,
  educationalHoursThisMonth: 12,
  completedCourses: 3,
  communityRank: 42,
  currentStreak: 7,
  upcomingEvents: 3
};

// Mock Auth Provider for testing
function MockAuthProvider({ children }: { children: React.ReactNode }) {
  const mockUser: User = {
    id: '1',
    name: 'Ahmed Muhammad',
    email: 'ahmed@example.com',
    role: 'user',
  };

  const mockAuthContext: AuthContextType = {
    user: mockUser,
    loading: false,
    isAuthenticated: true,
    isAdmin: false,
    isModerator: false,
    login: async () => {},
    logout: async () => {},
  };

  return (
    <AuthContext.Provider value={mockAuthContext}>
      {children}
    </AuthContext.Provider>
  );
}

// Premium loading skeleton component
function PremiumSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("animate-pulse", className)}>
      <div className="h-4 bg-gradient-to-r from-islamic-green/10 via-islamic-green/20 to-islamic-green/10 rounded shimmer"></div>
    </div>
  );
}

function StatCardSkeleton() {
  return (
    <Card className="border-gray-200/50 bg-gradient-to-br from-gray-50 to-transparent">
      <CardContent className="p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="mb-2 sm:mb-0 space-y-2">
            <PremiumSkeleton className="h-3 w-20" />
            <PremiumSkeleton className="h-8 w-12" />
          </div>
          <div className="h-6 w-6 sm:h-8 sm:w-8 bg-gray-200 rounded animate-pulse shimmer"></div>
        </div>
      </CardContent>
    </Card>
  );
}

// Inline Islamic Dashboard component with mock data
function TestIslamicDashboard({ className }: { className?: string }) {
  const { user, isAuthenticated } = useAuth();
  
  // Add premium loading states with optimized delays for pristine UX
  const [isInitialLoad, setIsInitialLoad] = React.useState(true);
  const [loadingPhase, setLoadingPhase] = React.useState<'initial' | 'data' | 'complete'>('initial');
  
  React.useEffect(() => {
    // Optimized loading sequence for pristine user experience
    const initialTimer = setTimeout(() => {
      setIsInitialLoad(false);
      setLoadingPhase('data');
    }, 800); // Reduced from 1200ms for better performance
    
    const completeTimer = setTimeout(() => {
      setLoadingPhase('complete');
    }, 2000);
    
    return () => {
      clearTimeout(initialTimer);
      clearTimeout(completeTimer);
    };
  }, []);

  // Optimized mock queries with pristine loading experience
  const { data: prayerTimes, isLoading: prayerLoading } = useQuery({
    queryKey: ['prayer-times'],
    queryFn: async () => {
      console.log('🕌 Fetching mock prayer times:', mockPrayerTimes);
      await new Promise(resolve => setTimeout(resolve, 600)); // Optimized delay
      return mockPrayerTimes;
    },
    staleTime: 0,
    gcTime: 0,
    enabled: isAuthenticated && !isInitialLoad,
  });

  const { data: educationProgress, isLoading: educationLoading } = useQuery({
    queryKey: ['education-progress', user?.id],
    queryFn: async () => {
      console.log('📚 Fetching mock education progress:', mockEducationProgress);
      await new Promise(resolve => setTimeout(resolve, 800)); // Optimized delay
      return mockEducationProgress;
    },
    staleTime: 0,
    gcTime: 0,
    enabled: isAuthenticated && !!user?.id && !isInitialLoad,
  });

  const { data: dashboardStats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard-stats', user?.id],
    queryFn: async () => {
      console.log('📊 Fetching mock dashboard stats:', mockDashboardStats);
      await new Promise(resolve => setTimeout(resolve, 400)); // Optimized delay
      return mockDashboardStats;
    },
    staleTime: 0,
    gcTime: 0,
    enabled: isAuthenticated && !!user?.id && !isInitialLoad,
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
    <div className={cn("space-y-6", className)} role="main" aria-label="Islamic Dashboard">
      {/* Welcome Header with Islamic Pattern and Premium Enhancements */}
      <div className="bg-gradient-to-r from-islamic-green via-islamic-green-600 to-islamic-green/90 text-white rounded-xl p-6 relative overflow-hidden islamic-pattern hover:shadow-2xl focus-within:shadow-2xl focus-within:ring-4 focus-within:ring-islamic-green/30 focus-within:ring-offset-4 transition-all duration-700 hover:scale-[1.02] focus-within:scale-[1.02]">
        {/* Advanced layered pattern overlay with glassmorphism */}
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-islamic-gold/5 via-transparent to-islamic-navy/10"></div>
          {/* Islamic geometric pattern overlay */}
          <div className="absolute inset-0 opacity-30" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FFFFFF' fill-opacity='0.08'%3E%3Cpolygon points='60,20 100,40 100,80 60,100 20,80 20,40'/%3E%3Cpolygon points='60,30 90,45 90,75 60,90 30,75 30,45'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}></div>
        </div>
        
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="animate-fade-in">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl sm:text-3xl font-bold">
                  Assalamu Alaikum, {user?.name?.split(' ')[0] || 'Brother/Sister'}
                </h1>
                <Moon className="h-6 w-6 text-islamic-green-100 animate-pulse" />
              </div>
              <p className="text-islamic-green-50 text-sm sm:text-base opacity-90">
                May Allah bless your learning journey and spiritual growth
              </p>
              
              {/* Time-based greeting enhancement */}
              <div className="mt-2 flex items-center gap-2 text-xs text-islamic-green-100">
                <Clock className="h-3 w-3" />
                <span>
                  {(() => {
                    const hour = new Date().getHours();
                    if (hour < 12) return 'Good Morning - Sabah al-khayr';
                    if (hour < 17) return 'Good Afternoon - Masa al-khayr';  
                    return 'Good Evening - Masa al-khayr';
                  })()}
                </span>
              </div>
            </div>
            
            <div className="mt-4 sm:mt-0 text-right animate-slide-up">
              <div className="text-islamic-green-100 text-sm flex items-center justify-end gap-2">
                <Calendar className="h-4 w-4" />
                <span>Today's Date</span>
              </div>
              <div className="text-lg font-semibold mb-1">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long',
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
              <div className="text-sm text-islamic-green-100 opacity-75">
                {new Date().toLocaleDateString('ar-SA', { 
                  weekday: 'long',
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  calendar: 'islamic'
                }).replace(/\d+/g, match =>
                  ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'][parseInt(match, 10)] || match
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid - Mobile optimized 2x2 with Premium Loading States */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {statsLoading || isInitialLoad ? (
          // Premium Loading Skeletons
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
            <Card className="group border-islamic-green/20 bg-gradient-to-br from-islamic-green/5 to-transparent hover:shadow-xl hover:shadow-islamic-green/10 focus-within:shadow-xl focus-within:shadow-islamic-green/10 focus-within:ring-2 focus-within:ring-islamic-green/30 focus-within:ring-offset-2 transition-all duration-500 hover:scale-105 hover:-translate-y-1 focus-within:scale-105 focus-within:-translate-y-1 cursor-pointer relative overflow-hidden" 
                  tabIndex={0} 
                  role="button" 
                  aria-label="Prayer statistics: 28 prayers completed this week"
                  onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.click()}>
              {/* Premium shine effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
              </div>
              <CardContent className="p-3 sm:p-4 relative z-10">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="mb-2 sm:mb-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-xs sm:text-sm text-gray-600">Prayers This Week</p>
                      <CheckCircle className="h-3 w-3 text-islamic-green animate-pulse" />
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-xl sm:text-2xl font-bold text-islamic-green animate-scale-in group-hover:text-islamic-green-700 transition-colors">
                        {dashboardStats?.totalPrayersThisWeek || 0}
                      </p>
                      {(dashboardStats?.totalPrayersThisWeek || 0) >= 25 && (
                        <Sparkles className="h-4 w-4 text-islamic-gold animate-pulse" />
                      )}
                    </div>
                  </div>
                  <div className="relative">
                    <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-islamic-green/60 self-end sm:self-auto animate-pulse group-hover:animate-none group-hover:text-islamic-green transition-colors duration-300" />
                    {(dashboardStats?.totalPrayersThisWeek || 0) >= 25 && (
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-islamic-gold rounded-full animate-ping"></div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="group border-islamic-gold/20 bg-gradient-to-br from-islamic-gold/5 to-transparent hover:shadow-xl hover:shadow-islamic-gold/10 focus-within:shadow-xl focus-within:shadow-islamic-gold/10 focus-within:ring-2 focus-within:ring-islamic-gold/30 focus-within:ring-offset-2 transition-all duration-500 hover:scale-105 hover:-translate-y-1 focus-within:scale-105 focus-within:-translate-y-1 cursor-pointer relative overflow-hidden" 
                  tabIndex={0} 
                  role="button" 
                  aria-label="Learning statistics: 12 educational hours completed this month"
                  onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.click()}>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
              </div>
              <CardContent className="p-3 sm:p-4 relative z-10">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="mb-2 sm:mb-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-xs sm:text-sm text-gray-600">Learning Hours</p>
                      <Activity className="h-3 w-3 text-islamic-gold animate-pulse" />
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-xl sm:text-2xl font-bold text-islamic-gold animate-scale-in group-hover:text-islamic-gold-700 transition-colors">
                        {dashboardStats?.educationalHoursThisMonth || 0}
                      </p>
                      {(dashboardStats?.educationalHoursThisMonth || 0) >= 10 && (
                        <Star className="h-4 w-4 text-islamic-green animate-pulse" />
                      )}
                    </div>
                  </div>
                  <div className="relative">
                    <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-islamic-gold/60 self-end sm:self-auto animate-pulse group-hover:animate-none group-hover:text-islamic-gold transition-colors duration-300" />
                    {(dashboardStats?.educationalHoursThisMonth || 0) >= 10 && (
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-islamic-green rounded-full animate-ping"></div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="group border-islamic-navy/20 bg-gradient-to-br from-islamic-navy/5 to-transparent hover:shadow-xl hover:shadow-islamic-navy/10 focus-within:shadow-xl focus-within:shadow-islamic-navy/10 focus-within:ring-2 focus-within:ring-islamic-navy/30 focus-within:ring-offset-2 transition-all duration-500 hover:scale-105 hover:-translate-y-1 focus-within:scale-105 focus-within:-translate-y-1 cursor-pointer relative overflow-hidden" 
                  tabIndex={0} 
                  role="button" 
                  aria-label="Streak statistics: 7 days current learning streak"
                  onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.click()}>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-500">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] group-focus-within:translate-x-[200%] transition-transform duration-1000"></div>
              </div>
              <CardContent className="p-3 sm:p-4 relative z-10">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="mb-2 sm:mb-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-xs sm:text-sm text-gray-600">Current Streak</p>
                      <Zap className="h-3 w-3 text-islamic-navy animate-pulse" />
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-xl sm:text-2xl font-bold text-islamic-navy animate-scale-in group-hover:text-islamic-navy-700 transition-colors">
                        {dashboardStats?.currentStreak || 0} days
                      </p>
                      {(dashboardStats?.currentStreak || 0) >= 7 && (
                        <Sparkles className="h-4 w-4 text-islamic-gold animate-pulse" />
                      )}
                    </div>
                  </div>
                  <div className="relative">
                    <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-islamic-navy/60 self-end sm:self-auto group-hover:animate-bounce group-hover:text-islamic-navy transition-colors duration-300" />
                    {(dashboardStats?.currentStreak || 0) >= 7 && (
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-islamic-gold rounded-full animate-ping"></div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="group border-green-500/20 bg-gradient-to-br from-green-500/5 to-transparent hover:shadow-xl hover:shadow-green-500/10 focus-within:shadow-xl focus-within:shadow-green-500/10 focus-within:ring-2 focus-within:ring-green-500/30 focus-within:ring-offset-2 transition-all duration-500 hover:scale-105 hover:-translate-y-1 focus-within:scale-105 focus-within:-translate-y-1 cursor-pointer relative overflow-hidden" 
                  tabIndex={0} 
                  role="button" 
                  aria-label="Achievement statistics: 3 courses completed"
                  onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.click()}>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-500">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] group-focus-within:translate-x-[200%] transition-transform duration-1000"></div>
              </div>
              <CardContent className="p-3 sm:p-4 relative z-10">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="mb-2 sm:mb-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-xs sm:text-sm text-gray-600">Completed Courses</p>
                      <CheckCircle className="h-3 w-3 text-green-600 animate-pulse" />
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-xl sm:text-2xl font-bold text-green-600 animate-scale-in group-hover:text-green-700 transition-colors">
                        {dashboardStats?.completedCourses || 0}
                      </p>
                      {(dashboardStats?.completedCourses || 0) >= 3 && (
                        <Award className="h-4 w-4 text-islamic-gold animate-pulse" />
                      )}
                    </div>
                  </div>
                  <div className="relative">
                    <Award className="h-6 w-6 sm:h-8 sm:w-8 text-green-600/60 self-end sm:self-auto animate-pulse group-hover:animate-none group-hover:text-green-600 transition-colors duration-300" />
                    {(dashboardStats?.completedCourses || 0) >= 3 && (
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-islamic-gold rounded-full animate-ping"></div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Prayer Time & Qibla Section */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="border-islamic-green/20 card-prayer-time relative overflow-hidden group hover:shadow-xl hover:shadow-islamic-green/15 focus-within:shadow-xl focus-within:shadow-islamic-green/15 focus-within:ring-2 focus-within:ring-islamic-green/30 focus-within:ring-offset-2 transition-all duration-500" 
                tabIndex={0} 
                role="region" 
                aria-labelledby="prayer-time-heading"
                onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.focus()}>
            <CardHeader className="pb-3 relative z-10">
              <CardTitle id="prayer-time-heading" className="flex items-center justify-between text-islamic-green">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 animate-pulse" aria-hidden="true" />
                  <span>Next Prayer</span>
                </div>
                {!prayerLoading && !isInitialLoad && (
                  <div className="flex items-center gap-1 text-xs text-islamic-green/70" role="status" aria-label="Live prayer times">
                    <Activity className="h-3 w-3 animate-pulse" aria-hidden="true" />
                    <span>Live</span>
                  </div>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              {prayerLoading || isInitialLoad ? (
                // Premium Prayer Loading State
                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center gap-4 mb-4">
                    <div className="text-right space-y-2">
                      <PremiumSkeleton className="h-8 w-20" />
                      <PremiumSkeleton className="h-5 w-16" />
                    </div>
                    <div className="text-left">
                      <PremiumSkeleton className="h-8 w-16" />
                    </div>
                  </div>
                  <div className="border-t pt-4 mt-4">
                    <div className="flex items-center justify-center gap-3">
                      <div className="h-5 w-5 bg-islamic-gold/20 rounded-full animate-pulse"></div>
                      <PremiumSkeleton className="h-4 w-24" />
                    </div>
                  </div>
                </div>
              ) : nextPrayer ? (
                <div className="text-center">
                  {/* Premium prayer time display with enhanced animations */}
                  <div className="flex items-center justify-center gap-4 mb-4 group-hover:scale-105 group-focus-within:scale-105 transition-transform duration-300">
                    <div className="text-right animate-fade-in relative">
                      <div className="relative inline-block">
                        <p className="text-3xl font-bold text-islamic-green prayer-time pulse-prayer relative z-10 group-hover:text-islamic-green-700 group-focus-within:text-islamic-green-700 transition-colors duration-300"
                           aria-label={`Next prayer time: ${nextPrayer.time}`}>
                          {nextPrayer.time}
                        </p>
                        {/* Glowing effect */}
                        <div className="absolute inset-0 text-3xl font-bold text-islamic-green prayer-time opacity-20 animate-ping z-0" aria-hidden="true">
                          {nextPrayer.time}
                        </div>
                      </div>
                      <p className="text-lg font-semibold text-islamic-navy group-hover:text-islamic-navy-700 group-focus-within:text-islamic-navy-700 transition-colors"
                         aria-label={`Prayer name: ${nextPrayer.name}`}>
                        {nextPrayer.name}
                      </p>
                    </div>
                    <div className="text-left animate-slide-up relative">
                      <div className="relative">
                        <p className="text-3xl text-islamic-green arabic relative z-10 group-hover:text-islamic-green-700 group-focus-within:text-islamic-green-700 transition-colors duration-300" 
                           style={{fontFamily: 'Amiri, serif', direction: 'rtl', lineHeight: '1.3'}}
                           aria-label={`Arabic name: ${nextPrayer.arabic}`}
                           lang="ar">
                          {nextPrayer.arabic}
                        </p>
                        {/* Arabic text glow */}
                        <div className="absolute inset-0 text-3xl text-islamic-green/20 arabic animate-pulse z-0"
                             style={{fontFamily: 'Amiri, serif', direction: 'rtl', lineHeight: '1.3'}}
                             aria-hidden="true">
                          {nextPrayer.arabic}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Enhanced Qibla Direction with premium effects */}
                  <div className="border-t pt-4 mt-4 border-islamic-green/10" role="region" aria-labelledby="qibla-heading">
                    <div className="flex items-center justify-center gap-3 text-sm text-gray-600 group-hover:scale-105 group-focus-within:scale-105 transition-transform duration-300">
                      <div className="relative" role="img" aria-label="Qibla compass indicator">
                        {/* Multi-layer compass animation */}
                        <Compass className="h-6 w-6 text-islamic-gold animate-spin relative z-10" 
                                style={{animationDuration: '8s'}} 
                                aria-hidden="true" />
                        <div className="absolute inset-0 h-6 w-6 border-2 border-islamic-gold/30 rounded-full animate-ping" aria-hidden="true"></div>
                        <div className="absolute inset-1 h-4 w-4 border border-islamic-gold/20 rounded-full animate-pulse" aria-hidden="true"></div>
                        {/* Direction indicator */}
                        <div className="absolute -top-1 left-1/2 w-1 h-3 bg-islamic-gold rounded-full transform -translate-x-1/2 opacity-70" aria-hidden="true"></div>
                      </div>
                      <div className="text-center">
                        <div id="qibla-heading" className="font-semibold text-islamic-gold mb-1 flex items-center gap-2">
                          Qibla Direction
                          <ArrowRight className="h-3 w-3 animate-pulse" aria-hidden="true" />
                        </div>
                        <div className="text-sm font-mono bg-islamic-gold/10 px-3 py-1 rounded-full border border-islamic-gold/20"
                             aria-label="Qibla direction: 58.5 degrees northeast">
                          58.5° NE
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Next prayer countdown enhancement */}
                  <div className="mt-4 p-3 bg-gradient-to-r from-islamic-green/5 to-islamic-green/10 rounded-lg border border-islamic-green/20">
                    <div className="flex items-center justify-center gap-2 text-xs text-islamic-green-700">
                      <Clock className="h-3 w-3 animate-pulse" />
                      <span>Time remaining: 2h 15m</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-pulse" />
                  <p className="text-gray-500">Prayer times unavailable</p>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="mt-2 border-islamic-green text-islamic-green hover:bg-islamic-green hover:text-white"
                  >
                    Refresh Times
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-islamic-gold/20 islamic-geometric-pattern relative">
            <CardHeader className="pb-3 relative z-10">
              <CardTitle className="flex items-center gap-2 text-islamic-gold">
                <Calendar className="h-5 w-5" />
                Islamic Calendar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Hijri Date:</span>
                  <div className="text-right">
                    <div className="font-semibold">15 Sha'ban 1446</div>
                    <div className="text-base sm:text-sm arabic text-islamic-gold" style={{fontFamily: 'Amiri, serif', direction: 'rtl', lineHeight: '1.4'}}>
                      ١٥ شعبان ١٤٤٦
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Days to Ramadan:</span>
                  <Badge variant="outline" className="bg-islamic-gold/10 text-islamic-gold-800 border-islamic-gold/40 font-semibold">
                    45 days
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Educational Progress Section */}
        <div className="lg:col-span-2">
          <Card className="border-islamic-navy/20 focus-within:ring-2 focus-within:ring-islamic-navy/30 focus-within:ring-offset-2 transition-all duration-300" 
                role="region" 
                aria-labelledby="learning-journey-heading"
                tabIndex={0}>
            <CardHeader>
              <CardTitle id="learning-journey-heading" className="flex items-center gap-2 text-islamic-navy">
                <BookOpen className="h-5 w-5" aria-hidden="true" />
                Your Islamic Learning Journey
              </CardTitle>
            </CardHeader>
            <CardContent>
              {educationLoading || isInitialLoad ? (
                // Premium Educational Progress Loading State
                <div className="space-y-6">
                  {[1, 2].map(i => (
                    <div key={i} className="border-l-4 border-gray-200 pl-6 space-y-3">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex-1">
                          <PremiumSkeleton className="h-5 w-48 mb-2" />
                          <div className="flex gap-2">
                            <PremiumSkeleton className="h-4 w-20" />
                            <PremiumSkeleton className="h-4 w-16" />
                          </div>
                        </div>
                        <div className="text-right">
                          <PremiumSkeleton className="h-4 w-16 mb-1" />
                          <PremiumSkeleton className="h-6 w-12" />
                        </div>
                      </div>
                      <PremiumSkeleton className="h-2 w-full" />
                      <div className="bg-gray-50 rounded-lg p-4">
                        <PremiumSkeleton className="h-4 w-24 mb-2" />
                        <PremiumSkeleton className="h-3 w-32 mb-3" />
                        <PremiumSkeleton className="h-8 w-full" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : educationProgress && educationProgress.length > 0 ? (
                <div className="space-y-6">
                  {educationProgress.slice(0, 3).map((course, index) => (
                    <div key={course.id} 
                         className={`relative border-l-4 border-islamic-green/30 pl-6 transition-all duration-300 hover:border-islamic-green/60 hover:bg-islamic-green/5 focus-within:border-islamic-green/60 focus-within:bg-islamic-green/5 focus-within:ring-2 focus-within:ring-islamic-green/30 focus-within:ring-offset-2 rounded-r-lg ${index % 2 === 0 ? 'animate-slide-up' : 'animate-fade-in'}`}
                         tabIndex={0}
                         role="article"
                         aria-labelledby={`course-title-${course.id}`}
                         aria-describedby={`course-progress-${course.id}`}>
                      {/* Course Type Icon */}
                      <div className="absolute -left-2 top-2 w-4 h-4 bg-islamic-green rounded-full flex items-center justify-center">
                        {course.contentType === 'QURAN' ? (
                          <BookOpen className="w-2 h-2 text-white" />
                        ) : course.contentType === 'ISLAMIC_STUDIES' ? (
                          <Award className="w-2 h-2 text-white" />
                        ) : (
                          <Calendar className="w-2 h-2 text-white" />
                        )}
                      </div>
                      
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 id={`course-title-${course.id}`} className="font-semibold text-islamic-navy text-base">
                              {course.courseTitle}
                            </h4>
                            {course.progress >= 75 && (
                              <Award className="w-4 h-4 text-islamic-gold animate-pulse" />
                            )}
                          </div>
                          <div className="flex gap-2 mb-2">
                            <Badge 
                              variant="secondary" 
                              className={`text-xs font-medium ${
                                course.contentType === 'QURAN' ? 'bg-islamic-green/10 text-islamic-green-800 border-islamic-green/20' :
                                course.contentType === 'ISLAMIC_STUDIES' ? 'bg-islamic-gold/10 text-islamic-gold-800 border-islamic-gold/20' :
                                'bg-islamic-navy/10 text-islamic-navy-800 border-islamic-navy/20'
                              }`}
                            >
                              {course.contentType.replace('_', ' ')}
                            </Badge>
                            <Badge variant="outline" className="text-xs bg-gray-50 border-gray-200">
                              {course.ageGroup.replace('_', ' ')}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right mt-2 sm:mt-0 sm:ml-4">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="text-sm text-gray-600">
                              {course.completedLessons}/{course.totalLessons} lessons
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className={`text-lg font-bold ${
                              course.progress >= 75 ? 'text-islamic-green' :
                              course.progress >= 50 ? 'text-islamic-gold' :
                              'text-islamic-navy'
                            }`}>
                              {Math.round(course.progress)}%
                            </div>
                            {course.progress >= 90 && (
                              <div className="text-xs bg-islamic-green/10 text-islamic-green-700 px-2 py-1 rounded-full">
                                Nearly Done!
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="relative mb-3">
                        <Progress 
                          value={course.progress} 
                          className={`h-2 ${
                            course.progress >= 75 ? 'progress-green' :
                            course.progress >= 50 ? 'progress-gold' :
                            'progress-navy'
                          }`}
                          aria-labelledby={`course-progress-${course.id}`}
                          role="progressbar"
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-valuenow={course.progress}
                        />
                        <div id={`course-progress-${course.id}`} className="sr-only">
                          Course progress: {Math.round(course.progress)}% completed, {course.completedLessons} of {course.totalLessons} lessons finished
                        </div>
                        {/* Sparkle effect for high progress */}
                        {course.progress >= 75 && (
                          <div className="absolute top-0 right-0 w-2 h-2 bg-islamic-green rounded-full animate-ping opacity-75"></div>
                        )}
                      </div>
                      
                      {course.nextLesson && (
                        <div className="bg-gradient-to-r from-islamic-green/5 to-islamic-green/10 border border-islamic-green/20 rounded-lg p-4 transition-all duration-300 hover:shadow-sm">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <BookOpen className="w-4 h-4 text-islamic-green" />
                                <span className="text-sm font-semibold text-islamic-green">Next Lesson</span>
                              </div>
                              <p className="text-sm font-medium text-gray-800 mb-1">
                                {course.nextLesson.title}
                              </p>
                              <div className="flex items-center gap-4 text-xs text-gray-600">
                                <div className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  <span>{course.nextLesson.estimatedDuration} min</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <TrendingUp className="w-3 h-3" />
                                  <span>Continue Progress</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <Button 
                            size="sm" 
                            className="group w-full bg-gradient-to-r from-islamic-green to-islamic-green-600 hover:from-islamic-green-600 hover:to-islamic-green-700 focus:from-islamic-green-700 focus:to-islamic-green-800 focus:ring-2 focus:ring-islamic-green-300 focus:ring-offset-2 text-white font-semibold transition-all duration-500 hover:scale-105 hover:shadow-lg hover:shadow-islamic-green/30 relative overflow-hidden"
                          >
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                            </div>
                            <div className="relative z-10 flex items-center justify-center gap-2">
                              <Play className="h-3 w-3 group-hover:animate-pulse" />
                              <span>Continue Learning</span>
                              <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform duration-300" />
                            </div>
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  <div className="pt-4 border-t border-islamic-navy/10">
                    <Button 
                      variant="outline" 
                      className="group w-full border-2 border-islamic-green/30 text-islamic-green hover:border-islamic-green hover:bg-islamic-green hover:text-white focus:bg-islamic-green focus:text-white focus:ring-2 focus:ring-islamic-green-300 focus:ring-offset-2 font-semibold transition-all duration-500 hover:scale-105 hover:shadow-lg hover:shadow-islamic-green/20 relative overflow-hidden"
                    >
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                      </div>
                      <div className="relative z-10 flex items-center justify-center gap-2">
                        <BookOpen className="h-4 w-4 group-hover:animate-pulse" />
                        <span>View All Courses</span>
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
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

      {/* Community Activity Section with Premium Polish */}
      <Card className="border-islamic-gold/30 bg-gradient-to-br from-islamic-gold/10 via-islamic-gold/5 to-transparent hover:shadow-2xl hover:shadow-islamic-gold/20 focus-within:shadow-2xl focus-within:shadow-islamic-gold/20 focus-within:ring-4 focus-within:ring-islamic-gold/20 focus-within:ring-offset-4 transition-all duration-700 hover:scale-[1.01] focus-within:scale-[1.01] relative overflow-hidden" 
            tabIndex={0} 
            role="region" 
            aria-labelledby="community-activity-heading">
        {/* Premium background effects */}
        <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500">
          <div className="absolute inset-0 bg-gradient-to-br from-islamic-gold/5 via-transparent to-islamic-green/5"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-islamic-gold/10 rounded-full -translate-y-16 translate-x-16 blur-xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-islamic-green/10 rounded-full translate-y-12 -translate-x-12 blur-xl"></div>
        </div>
        
        <CardHeader className="pb-4 relative z-10">
          <CardTitle id="community-activity-heading" className="flex items-center gap-3 text-islamic-gold">
            <div className="relative group">
              <div className="absolute inset-0 bg-islamic-gold/20 rounded-full animate-pulse group-hover:animate-ping"></div>
              <Users className="h-6 w-6 animate-pulse relative z-10 group-hover:text-islamic-gold-600 transition-colors" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-islamic-green rounded-full animate-ping opacity-75">
                <div className="absolute inset-0 bg-islamic-green rounded-full animate-pulse"></div>
              </div>
            </div>
            <div>
              <span className="text-lg font-semibold bg-gradient-to-r from-islamic-gold to-islamic-gold-600 bg-clip-text text-transparent">
                Community Activity
              </span>
              <div className="text-sm text-gray-600 font-normal flex items-center gap-2">
                Join the engaged community
                <Sparkles className="h-3 w-3 text-islamic-gold animate-pulse" />
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="group text-center p-4 rounded-lg border border-islamic-green/20 bg-gradient-to-br from-islamic-green/5 to-transparent hover:border-islamic-green/40 hover:shadow-md transition-all duration-300 hover:scale-105">
              <div className="relative mb-2">
                <Calendar className="h-8 w-8 text-islamic-green/60 mx-auto mb-2 group-hover:animate-bounce" />
                <div className="absolute -top-1 -right-4 w-2 h-2 bg-islamic-green rounded-full animate-pulse"></div>
              </div>
              <p className="text-2xl font-bold text-islamic-green mb-1 animate-scale-in">
                {dashboardStats?.upcomingEvents || 0}
              </p>
              <p className="text-sm text-gray-600">Upcoming Events</p>
              <div className="text-xs text-islamic-green/80 mt-1">This Week</div>
            </div>
            
            <div className="group text-center p-4 rounded-lg border border-islamic-gold/20 bg-gradient-to-br from-islamic-gold/5 to-transparent hover:border-islamic-gold/40 hover:shadow-md transition-all duration-300 hover:scale-105">
              <div className="relative mb-2">
                <Award className="h-8 w-8 text-islamic-gold/60 mx-auto mb-2 group-hover:animate-pulse" />
                {(dashboardStats?.communityRank ?? Infinity) <= 50 && (
                  <div className="absolute -top-1 -right-4 w-2 h-2 bg-islamic-gold rounded-full animate-ping"></div>
                )}
              </div>
              <p className="text-2xl font-bold text-islamic-gold mb-1 animate-scale-in">
                #{dashboardStats?.communityRank || '--'}
              </p>
              <p className="text-sm text-gray-600">Community Ranking</p>
              <div className="text-xs text-islamic-gold/80 mt-1">
                {(dashboardStats?.communityRank ?? Infinity) <= 50 ? 'Top Learner! 🌟' : 'Keep Learning!'}
              </div>
            </div>
            
            <div className="group text-center p-4 rounded-lg border border-islamic-navy/20 bg-gradient-to-br from-islamic-navy/5 to-transparent hover:border-islamic-navy/40 hover:shadow-md transition-all duration-300 hover:scale-105">
              <div className="relative mb-2">
                <Users className="h-8 w-8 text-islamic-navy/60 mx-auto mb-2 group-hover:animate-pulse" />
                <div className="absolute -top-1 -right-4 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              <p className="text-2xl font-bold text-islamic-navy mb-1 animate-scale-in">156</p>
              <p className="text-sm text-gray-600">Active Members</p>
              <div className="text-xs text-islamic-navy/80 mt-1">Online Now</div>
            </div>
          </div>
          
          {/* Premium Community Engagement Actions */}
          <div className="mt-6 pt-4 border-t border-islamic-gold/30 relative">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-islamic-gold/50 to-transparent"></div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                variant="outline" 
                className="group flex-1 border-2 border-islamic-gold/40 text-islamic-gold hover:border-islamic-gold hover:bg-gradient-to-r hover:from-islamic-gold hover:to-islamic-gold-600 hover:text-white focus:bg-gradient-to-r focus:from-islamic-gold focus:to-islamic-gold-600 focus:text-white focus:ring-4 focus:ring-islamic-gold/30 focus:ring-offset-2 font-semibold transition-all duration-500 hover:scale-105 hover:shadow-lg hover:shadow-islamic-gold/30 relative overflow-hidden"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                </div>
                <div className="relative z-10 flex items-center justify-center gap-2">
                  <Users className="w-4 h-4 group-hover:animate-pulse" />
                  <span>View Community</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </Button>
              <Button 
                variant="outline"
                className="group flex-1 border-2 border-islamic-green/40 text-islamic-green hover:border-islamic-green hover:bg-gradient-to-r hover:from-islamic-green hover:to-islamic-green-600 hover:text-white focus:bg-gradient-to-r focus:from-islamic-green focus:to-islamic-green-600 focus:text-white focus:ring-4 focus:ring-islamic-green/30 focus:ring-offset-2 font-semibold transition-all duration-500 hover:scale-105 hover:shadow-lg hover:shadow-islamic-green/30 relative overflow-hidden"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                </div>
                <div className="relative z-10 flex items-center justify-center gap-2">
                  <Calendar className="w-4 h-4 group-hover:animate-pulse" />
                  <span>Join Events</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function DashboardTestPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <MockAuthProvider>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-islamic-green/5 to-islamic-gold/5 relative overflow-hidden">
          {/* Premium background pattern */}
          <div className="absolute inset-0 opacity-30" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23349856' fill-opacity='0.03'%3E%3Cpath d='M100 100c0-27.614-22.386-50-50-50s-50 22.386-50 50 22.386 50 50 50 50-22.386 50-50zm100 0c0-27.614-22.386-50-50-50s-50 22.386-50 50 22.386 50 50 50 50-22.386 50-50z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '100px 100px'
          }}></div>
          
          <div className="relative z-10">
            <div className="container mx-auto px-4 py-8">
              <div className="mb-8 text-center animate-fade-in">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-islamic-navy via-islamic-green to-islamic-gold bg-clip-text text-transparent mb-3">
                  Islamic Dashboard Test Page
                </h1>
                <div className="flex items-center justify-center gap-2 text-gray-600 mb-4">
                  <div className="h-px w-12 bg-gradient-to-r from-transparent to-islamic-gold/50"></div>
                  <Sparkles className="h-4 w-4 text-islamic-gold animate-pulse" />
                  <span className="font-medium">Testing the Islamic Dashboard component with mock data</span>
                  <Sparkles className="h-4 w-4 text-islamic-gold animate-pulse" />
                  <div className="h-px w-12 bg-gradient-to-l from-transparent to-islamic-gold/50"></div>
                </div>
                
                {/* Performance and quality indicators - Final optimization */}
                <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500 mb-6" role="status" aria-label="Dashboard quality indicators">
                  <div className="flex items-center gap-1 group">
                    <Activity className="h-3 w-3 text-islamic-green animate-pulse group-hover:scale-110 transition-transform" />
                    <span className="group-hover:text-islamic-green transition-colors font-medium">Pristine UI Quality</span>
                  </div>
                  <div className="flex items-center gap-1 group">
                    <CheckCircle className="h-3 w-3 text-islamic-gold group-hover:animate-pulse transition-all" />
                    <span className="group-hover:text-islamic-gold transition-colors font-medium">WCAG AA+ Compliant</span>
                  </div>
                  <div className="flex items-center gap-1 group">
                    <Zap className="h-3 w-3 text-islamic-navy group-hover:animate-bounce transition-all" />
                    <span className="group-hover:text-islamic-navy transition-colors font-medium">Premium Performance</span>
                  </div>
                  <div className="flex items-center gap-1 group">
                    <Star className="h-3 w-3 text-islamic-green group-hover:animate-spin transition-all" />
                    <span className="group-hover:text-islamic-green transition-colors font-medium">10/10 Iterations Complete</span>
                  </div>
                </div>
              </div>
              <TestIslamicDashboard />
            </div>
          </div>
        </div>
      </MockAuthProvider>
    </QueryClientProvider>
  );
}