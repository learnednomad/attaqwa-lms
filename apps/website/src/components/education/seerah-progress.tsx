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
  BookOpen,
  CheckCircle
} from 'lucide-react';

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
      const authResponse = await fetch('/api/auth/me', {
        credentials: 'include',
      });

      if (authResponse.ok) {
        setIsAuthenticated(true);
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
      <div className="rounded-xl border border-neutral-200 bg-white p-8">
        <div className="text-center text-sm text-neutral-400">Loading progress...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="rounded-xl border border-neutral-200 bg-white p-8">
        <div className="text-center">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-4 h-4 text-emerald-600" />
          </div>
          <h3 className="text-sm font-semibold text-neutral-900 mb-1">Track Your Learning Journey</h3>
          <p className="text-xs text-neutral-500 mb-4">
            Sign in to track your progress, earn achievements, and get certificates
          </p>
          <a
            href="/student/login?redirect=/education/seerah"
            className="inline-flex items-center justify-center px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Sign In to Start Learning
          </a>
        </div>
      </div>
    );
  }

  if (!progressData) {
    return null;
  }

  const overallProgress = progressData.learningPath
    ? (progressData.statistics.modulesCompleted / 8) * 100
    : 0;

  return (
    <div className="space-y-3">
      {/* Overall Progress */}
      <div className="rounded-xl border border-neutral-200 bg-white p-5">
        <h3 className="text-sm font-semibold text-neutral-900 mb-1">Your Learning Progress</h3>
        <p className="text-xs text-neutral-400 mb-4">
          Track your journey through the authentic Seerah curriculum
        </p>

        {/* Progress Bar */}
        <div className="mb-5">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-neutral-400">Overall Completion</span>
            <span className="font-medium text-neutral-600">
              {progressData.statistics.modulesCompleted} of 8 modules
            </span>
          </div>
          <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
          <p className="text-[10px] text-neutral-400 mt-1">
            {Math.round(overallProgress)}% Complete
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard
            icon={<BookOpen className="w-3.5 h-3.5" />}
            label="Modules Started"
            value={progressData.statistics.modulesStarted.toString()}
          />
          <StatCard
            icon={<CheckCircle className="w-3.5 h-3.5" />}
            label="Completed"
            value={progressData.statistics.modulesCompleted.toString()}
          />
          <StatCard
            icon={<Clock className="w-3.5 h-3.5" />}
            label="Time Spent"
            value={formatTime(progressData.statistics.totalTimeSpent)}
          />
          <StatCard
            icon={<Target className="w-3.5 h-3.5" />}
            label="Avg Score"
            value={`${Math.round(progressData.statistics.averageScore)}%`}
          />
        </div>

        {/* Current Streak */}
        {progressData.statistics.currentStreak > 0 && (
          <div className="mt-4 bg-amber-50 border border-amber-100 rounded-lg p-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                <TrendingUp className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-900">
                  {progressData.statistics.currentStreak} Day Streak!
                </p>
                <p className="text-xs text-neutral-500">
                  Keep learning daily to maintain your streak
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Achievements and Certificates */}
      {(progressData.achievements.length > 0 || progressData.certificates.length > 0) && (
        <div className="grid md:grid-cols-2 gap-3">
          {/* Recent Achievements */}
          {progressData.achievements.length > 0 && (
            <div className="rounded-xl border border-neutral-200 bg-white p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center">
                  <Trophy className="h-3.5 w-3.5 text-amber-600" />
                </div>
                <h3 className="text-sm font-semibold text-neutral-900">Recent Achievements</h3>
              </div>
              <div className="space-y-3">
                {progressData.achievements.slice(0, 3).map((item) => (
                  <div key={item.achievement.id} className="flex items-start gap-3">
                    <span className="text-xl">{item.achievement.icon}</span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-neutral-900">
                        {item.achievement.title}
                      </p>
                      <p className="text-xs text-neutral-400">
                        {item.achievement.description}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="rounded-md border border-neutral-200 bg-neutral-50 px-1.5 py-0.5 text-[10px] font-semibold text-neutral-500">
                          +{item.achievement.points} pts
                        </span>
                        {item.achievement.isRare && (
                          <span className="rounded-md border border-amber-200 bg-amber-50 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700">
                            Rare
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certificates */}
          {progressData.certificates.length > 0 && (
            <div className="rounded-xl border border-neutral-200 bg-white p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                  <Award className="h-3.5 w-3.5 text-emerald-600" />
                </div>
                <h3 className="text-sm font-semibold text-neutral-900">Your Certificates</h3>
              </div>
              <div className="space-y-3">
                {progressData.certificates.map((cert) => (
                  <div
                    key={cert.id}
                    className="bg-emerald-50/50 border border-emerald-100 rounded-lg p-3"
                  >
                    <p className="text-sm font-medium text-neutral-900 mb-1">
                      {cert.title}
                    </p>
                    <p className="text-xs text-neutral-400">
                      Issued: {new Date(cert.issuedAt).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-emerald-700 font-mono mt-1">
                      {cert.verificationCode}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-neutral-50 rounded-lg p-3">
      <div className="text-emerald-600 mb-1.5">{icon}</div>
      <p className="text-[10px] text-neutral-400">{label}</p>
      <p className="text-sm font-semibold text-neutral-900">{value}</p>
    </div>
  );
}
