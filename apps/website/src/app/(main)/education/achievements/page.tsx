'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Award, Star, BookOpen, CheckCircle2,
  Lock, Trophy, Flame, Target
} from 'lucide-react';
import Link from 'next/link';

const achievements = [
  { title: 'First Steps', description: 'Complete your first lesson', icon: Star, earned: true, date: '2024-10-15', category: 'Learning' },
  { title: 'Quran Explorer', description: 'Complete 5 Quran lessons', icon: BookOpen, earned: true, date: '2024-11-20', category: 'Quran' },
  { title: 'Knowledge Seeker', description: 'Enroll in 3 courses', icon: Target, earned: true, date: '2024-12-01', category: 'Learning' },
  { title: 'Quiz Champion', description: 'Score 90%+ on 5 quizzes', icon: Trophy, earned: true, date: '2025-01-05', category: 'Assessment' },
  { title: 'Consistent Learner', description: 'Study 7 days in a row', icon: Flame, earned: true, date: '2025-01-12', category: 'Dedication' },
  { title: 'Hadith Scholar', description: 'Complete all Hadith lessons', icon: BookOpen, earned: false, progress: 65, category: 'Hadith' },
  { title: 'Perfect Score', description: 'Get 100% on any quiz', icon: Star, earned: false, progress: 0, category: 'Assessment' },
  { title: 'Community Helper', description: 'Help 10 fellow students', icon: CheckCircle2, earned: false, progress: 30, category: 'Community' },
  { title: 'Arabic Master', description: 'Complete Arabic Grammar course', icon: Award, earned: false, progress: 45, category: 'Arabic' },
  { title: 'Seerah Expert', description: 'Complete all Seerah modules', icon: BookOpen, earned: false, progress: 20, category: 'Seerah' },
];

const earnedCount = achievements.filter(a => a.earned).length;

export default function AchievementsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <Link href="/education" className="hover:text-emerald-600">Education</Link>
          <span>/</span>
          <Link href="/education/progress" className="hover:text-emerald-600">Progress</Link>
          <span>/</span>
          <span className="text-gray-900">Achievements</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Achievements</h1>
        <p className="text-gray-600 mt-2">Track your milestones and earn badges as you learn</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Earned</p>
                <p className="text-2xl font-bold text-emerald-600">{earnedCount}</p>
              </div>
              <div className="p-3 bg-emerald-100 rounded-xl">
                <Trophy className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">In Progress</p>
                <p className="text-2xl font-bold text-amber-600">
                  {achievements.filter(a => !a.earned && (a.progress ?? 0) > 0).length}
                </p>
              </div>
              <div className="p-3 bg-amber-100 rounded-xl">
                <Target className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Locked</p>
                <p className="text-2xl font-bold text-gray-400">
                  {achievements.filter(a => !a.earned && (a.progress ?? 0) === 0).length}
                </p>
              </div>
              <div className="p-3 bg-gray-100 rounded-xl">
                <Lock className="h-6 w-6 text-gray-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Earned Achievements */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-500" />
            Earned Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.filter(a => a.earned).map((achievement, index) => {
              const Icon = achievement.icon;
              return (
                <div key={index} className="p-4 border border-emerald-200 bg-emerald-50/50 rounded-xl">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-emerald-100 rounded-lg">
                      <Icon className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{achievement.title}</h3>
                      <p className="text-xs text-gray-500 mt-1">{achievement.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className="bg-emerald-100 text-emerald-700 text-xs">{achievement.category}</Badge>
                        <span className="text-xs text-gray-400">{achievement.date}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Locked Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Lock className="h-5 w-5 text-gray-400" />
            Not Yet Earned
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.filter(a => !a.earned).map((achievement, index) => {
              const Icon = achievement.icon;
              const progress = achievement.progress ?? 0;
              return (
                <div key={index} className="p-4 border border-gray-200 rounded-xl opacity-80">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <Icon className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-700">{achievement.title}</h3>
                      <p className="text-xs text-gray-500 mt-1">{achievement.description}</p>
                      <Badge variant="outline" className="mt-2 text-xs">{achievement.category}</Badge>
                      {progress > 0 && (
                        <div className="mt-2">
                          <div className="flex items-center gap-2">
                            <Progress value={progress} className="h-1.5 flex-1" />
                            <span className="text-xs text-gray-500">{progress}%</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Back link */}
      <div className="mt-8 text-center">
        <Link href="/education/progress">
          <Button variant="outline">Back to Progress</Button>
        </Link>
      </div>
    </div>
  );
}
