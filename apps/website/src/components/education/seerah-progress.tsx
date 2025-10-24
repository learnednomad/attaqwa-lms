/**
 * Seerah Progress Component
 * Displays user's learning progress and achievements
 */

'use client';

import { useState, useEffect } from 'react';
import { 
  Trophy, 
  Target, 
  TrendingUp, 
  Clock,
  Award,
  Calendar,
  BookOpen,
  CheckCircle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface ProgressData {
  moduleProgress: any[];
  statistics: {
    modulesStarted: number;
    modulesCompleted: number;
    totalTimeSpent: number;
    averageScore: number;
    currentStreak: number;
  };
  achievements: {
    achievement: {
      id: string;
      title: string;
      description: string;
      icon: string;
      points: number;
      isRare: boolean;
    };
    earnedAt: string;
  }[];
  certificates: {
    id: string;
    title: string;
    issuedAt: string;
    verificationCode: string;
  }[];
  learningPath?: {
    pathTitle: string;
    totalModules: number;
    completedModules: number;
    progressPercentage: number;
  };
}

export function SeerahProgress() {
  const [progressData, setProgressData] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthAndFetchProgress();
  }, []);

  const checkAuthAndFetchProgress = async () => {
    try {
      // Check if user is authenticated
      const authResponse = await fetch('/api/auth/me', {
        credentials: 'include',
      });

      if (authResponse.ok) {
        setIsAuthenticated(true);
        // Fetch progress data
        const progressResponse = await fetch('/api/seerah/progress', {
          credentials: 'include',
        });
        if (progressResponse.ok) {
          const data = await progressResponse.json();
          setProgressData(data);
        }
      }
    } catch (error) {
      console.error('Error fetching progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  if (loading) {
    return (
      <Card className="mb-8">
        <CardContent className="py-8">
          <div className="text-center text-gray-500">Loading progress...</div>
        </CardContent>
      </Card>
    );
  }

  if (!isAuthenticated) {
    return (
      <Card className="mb-8 bg-islamic-green-50">
        <CardContent className="py-8">
          <div className="text-center">
            <BookOpen className="w-12 h-12 text-islamic-green-600 mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">Track Your Learning Journey</h3>
            <p className="text-gray-600 mb-4">
              Sign in to track your progress, earn achievements, and get certificates
            </p>
            <a 
              href="/signin?redirect=/education/seerah" 
              className="inline-flex items-center justify-center px-4 py-2 bg-islamic-green-600 text-white rounded-lg hover:bg-islamic-green-700"
            >
              Sign In to Start Learning
            </a>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!progressData) {
    return null;
  }

  const overallProgress = progressData.learningPath 
    ? (progressData.statistics.modulesCompleted / 8) * 100 
    : 0;

  return (
    <div className="space-y-6 mb-8">
      {/* Overall Progress Card */}
      <Card>
        <CardHeader>
          <CardTitle>Your Learning Progress</CardTitle>
          <CardDescription>
            Track your journey through the authentic Seerah curriculum
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Progress Bar */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Overall Completion</span>
                <span className="font-semibold">
                  {progressData.statistics.modulesCompleted} of 8 modules
                </span>
              </div>
              <Progress value={overallProgress} className="h-3" />
              <p className="text-xs text-gray-500 mt-1">
                {Math.round(overallProgress)}% Complete
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard
                icon={<BookOpen className="w-5 h-5" />}
                label="Modules Started"
                value={progressData.statistics.modulesStarted.toString()}
                color="text-islamic-green-600"
              />
              <StatCard
                icon={<CheckCircle className="w-5 h-5" />}
                label="Completed"
                value={progressData.statistics.modulesCompleted.toString()}
                color="text-islamic-green-600"
              />
              <StatCard
                icon={<Clock className="w-5 h-5" />}
                label="Time Spent"
                value={formatTime(progressData.statistics.totalTimeSpent)}
                color="text-islamic-gold-600"
              />
              <StatCard
                icon={<Target className="w-5 h-5" />}
                label="Avg Score"
                value={`${Math.round(progressData.statistics.averageScore)}%`}
                color="text-islamic-gold-600"
              />
            </div>

            {/* Current Streak */}
            {progressData.statistics.currentStreak > 0 && (
              <div className="bg-islamic-gold-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-islamic-gold-100 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-islamic-gold-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-islamic-navy">
                        {progressData.statistics.currentStreak} Day Streak!
                      </p>
                      <p className="text-sm text-gray-600">
                        Keep learning daily to maintain your streak
                      </p>
                    </div>
                  </div>
                  <span className="text-2xl">🔥</span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Achievements and Certificates */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent Achievements */}
        {progressData.achievements.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-islamic-gold-600" />
                Recent Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {progressData.achievements.slice(0, 3).map((item) => (
                  <div key={item.achievement.id} className="flex items-start gap-3">
                    <span className="text-2xl">{item.achievement.icon}</span>
                    <div className="flex-1">
                      <p className="font-medium text-sm">
                        {item.achievement.title}
                      </p>
                      <p className="text-xs text-gray-600">
                        {item.achievement.description}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          +{item.achievement.points} pts
                        </Badge>
                        {item.achievement.isRare && (
                          <Badge className="bg-islamic-gold-600 text-white text-xs">
                            Rare
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Certificates */}
        {progressData.certificates.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-islamic-green-600" />
                Your Certificates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {progressData.certificates.map((cert) => (
                  <div 
                    key={cert.id}
                    className="p-3 bg-islamic-green-50 rounded-lg"
                  >
                    <p className="font-medium text-sm mb-1">
                      {cert.title}
                    </p>
                    <p className="text-xs text-gray-600">
                      Issued: {new Date(cert.issuedAt).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-islamic-green-700 font-mono mt-1">
                      {cert.verificationCode}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function StatCard({ 
  icon, 
  label, 
  value, 
  color 
}: { 
  icon: React.ReactNode; 
  label: string; 
  value: string;
  color: string;
}) {
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className={`${color} mb-2`}>{icon}</div>
      <p className="text-xs text-gray-600">{label}</p>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  );
}