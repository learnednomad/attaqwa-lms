'use client';

import React, { useState, useEffect } from 'react';
import { FeatureFlagService } from '@attaqwa/shared';
import { Button } from '@/components/ui/button';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Clock, 
  User, 
  BookOpen,
  CheckCircle,
  Play,
  Volume2,
  Download,
  Star,
  Eye
} from 'lucide-react';
import type { CourseDifficulty, AgeTier as AgeTierType } from '@attaqwa/shared-types';

// TODO: Move these to @attaqwa/shared-types in Epic 2
type IslamicSubject = 'QURAN' | 'HADITH' | 'FIQH' | 'AQIDAH' | 'SEERAH' | 'WORSHIP' | 'ARABIC_LANGUAGE' | 'ISLAMIC_HISTORY';
type EducationContentType = 'LESSON' | 'VIDEO' | 'AUDIO' | 'QUIZ' | 'ARTICLE' | 'INTERACTIVE';
type DifficultyLevel = CourseDifficulty;
type AgeTier = AgeTierType;

interface EducationContent {
  id: string;
  title: string;
  description: string;
  content: string;
  subject: IslamicSubject;
  ageTier: AgeTier;
  difficultyLevel: DifficultyLevel;
  contentType: EducationContentType;
  estimatedDuration: number;
  thumbnailUrl?: string;
  isPublished: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  author: {
    id: string;
    name: string;
  };
  _count: {
    userProgress: number;
    quizAttempts: number;
  };
  arabicContent?: string;
  transliteration?: string;
  translation?: string;
  mediaUrl?: string;
  userProgress?: {
    id: string;
    progress: number;
    status: string;
    lastAccessed: Date;
    timeSpent: number;
  };
}

// Mock content data - would normally come from API
const mockContent: Record<string, EducationContent> = {
  '1': {
    id: '1',
    title: 'Introduction to Quran',
    description: 'Learn the basics of Quranic reading and understanding with proper pronunciation and meaning.',
    content: `# Introduction to the Holy Quran

## Overview
The Quran is the holy book of Islam, revealed to Prophet Muhammad (peace be upon him) over a period of 23 years. It contains 114 chapters (Surahs) and over 6,000 verses (Ayahs).

## Learning Objectives
By the end of this lesson, you will:
- Understand the significance of the Quran in Islamic faith
- Learn basic Arabic pronunciation rules
- Practice reading simple Quranic verses
- Appreciate the beauty of Quranic language

## The Opening Chapter - Al-Fatiha

The first chapter of the Quran is called Al-Fatiha (The Opening). It is recited in every unit of prayer.

### Arabic Text
بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ
الرَّحْمَنِ الرَّحِيمِ
مَالِكِ يَوْمِ الدِّينِ

### Transliteration
Bismillah ar-Rahman ar-Raheem
Al-hamdu lillahi rabbil alameen
Ar-Rahman ar-Raheem
Maliki yawm ad-deen

### Translation
In the name of Allah, the Most Gracious, the Most Merciful
All praise is due to Allah, Lord of the worlds
The Most Gracious, the Most Merciful
Master of the Day of Judgment

## Practice Exercise
Try reading Al-Fatiha slowly, focusing on proper pronunciation. Listen to the audio pronunciation and repeat each verse.

## Next Steps
After completing this lesson, you can:
1. Take the comprehension quiz
2. Practice with additional Quranic verses
3. Move to the next lesson on Tajweed rules`,
    subject: 'QURAN' as IslamicSubject,
    ageTier: 'CHILDREN' as AgeTier,
    difficultyLevel: 'BEGINNER' as DifficultyLevel,
    contentType: 'LESSON' as EducationContentType,
    estimatedDuration: 30,
    thumbnailUrl: '/images/quran-basics.jpg',
    isPublished: true,
    tags: ['basics', 'reading', 'pronunciation', 'al-fatiha'],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
    author: {
      id: '1',
      name: 'Imam Abdullah'
    },
    _count: {
      userProgress: 24,
      quizAttempts: 18
    },
    arabicContent: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ',
    transliteration: 'Bismillah ar-Rahman ar-Raheem',
    translation: 'In the name of Allah, the Most Gracious, the Most Merciful',
    mediaUrl: '/audio/al-fatiha-recitation.mp3',
    userProgress: {
      id: 'prog1',
      progress: 65,
      status: 'IN_PROGRESS',
      lastAccessed: new Date(),
      timeSpent: 18
    }
  }
};

export default function EducationContentPage() {
  // Feature flag protection
  if (!FeatureFlagService.canAccessEducationUI()) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-islamic-navy-800 mb-4">Education Content</h1>
          <div className="bg-islamic-gold-50 border border-islamic-gold-200 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-islamic-gold-800 mb-2">🚧 Under Development</h2>
            <p className="text-islamic-gold-700">Educational content viewing is being enhanced.</p>
          </div>
          <Link href="/"><Button className="bg-islamic-green-600 hover:bg-islamic-green-700">Return to Home</Button></Link>
        </div>
      </div>
    );
  }

  const params = useParams();
  const contentId = params.id as string;
  const [content, setContent] = useState<EducationContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const foundContent = mockContent[contentId];
      setContent(foundContent || null);
      setCurrentProgress(foundContent?.userProgress?.progress || 0);
      setIsCompleted(foundContent?.userProgress?.status === 'COMPLETED');
      setLoading(false);
    }, 500);
  }, [contentId]);

  const handleMarkComplete = () => {
    setCurrentProgress(100);
    setIsCompleted(true);
    // Would normally call API to update progress
  };

  const handleStartQuiz = () => {
    window.location.href = `/education/quiz/${contentId}`;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-600 mb-4">Content Not Found</h1>
          <p className="text-gray-500 mb-6">The educational content you're looking for doesn't exist.</p>
          <Link href="/education">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Education
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const getSubjectColor = (subject: IslamicSubject) => {
    const colors = {
      QURAN: 'bg-islamic-green-100 text-islamic-green-800',
      HADITH: 'bg-islamic-gold-100 text-islamic-gold-800',
      FIQH: 'bg-blue-100 text-blue-800',
      AQIDAH: 'bg-purple-100 text-purple-800',
      SEERAH: 'bg-indigo-100 text-indigo-800',
      WORSHIP: 'bg-emerald-100 text-emerald-800',
      ARABIC_LANGUAGE: 'bg-orange-100 text-orange-800',
      ISLAMIC_HISTORY: 'bg-red-100 text-red-800'
    };
    return colors[subject] || 'bg-gray-100 text-gray-800';
  };

  const getDifficultyColor = (level: DifficultyLevel) => {
    const colors: Record<DifficultyLevel, string> = {
      beginner: 'bg-green-100 text-green-800',
      intermediate: 'bg-yellow-100 text-yellow-800',
      advanced: 'bg-orange-100 text-orange-800'
    };
    return colors[level] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link href="/education">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Education
            </Button>
          </Link>
          
          <div className="flex flex-col lg:flex-row lg:items-start gap-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-islamic-navy-800 mb-4">
                {content.title}
              </h1>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge className={getSubjectColor(content.subject)}>
                  {content.subject.replace('_', ' ')}
                </Badge>
                <Badge className={getDifficultyColor(content.difficultyLevel)}>
                  {content.difficultyLevel}
                </Badge>
                <Badge variant="outline">
                  {content.ageTier.replace('_', ' ')}
                </Badge>
              </div>
              
              <p className="text-lg text-gray-600 mb-6">{content.description}</p>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {content.estimatedDuration} minutes
                </div>
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {content.author.name}
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {content._count.userProgress} learners
                </div>
              </div>
            </div>
            
            {/* Progress Card */}
            <Card className="w-full lg:w-80">
              <CardHeader>
                <CardTitle className="text-lg">Your Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Progress</span>
                      <span>{currentProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-islamic-green-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${currentProgress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  {content.userProgress && (
                    <div className="text-sm text-gray-600">
                      Time spent: {content.userProgress.timeSpent} minutes
                    </div>
                  )}
                  
                  {!isCompleted ? (
                    <Button 
                      onClick={handleMarkComplete}
                      className="w-full bg-islamic-green-600 hover:bg-islamic-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark as Complete
                    </Button>
                  ) : (
                    <div className="flex items-center justify-center gap-2 text-green-600 font-medium">
                      <CheckCircle className="h-5 w-5" />
                      Completed
                    </div>
                  )}
                  
                  {content.contentType === 'LESSON' && (
                    <Button 
                      onClick={handleStartQuiz}
                      variant="outline" 
                      className="w-full"
                    >
                      Take Quiz
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Arabic Content (if available) */}
        {content.arabicContent && (
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-2xl mb-4 arabic font-amiri text-islamic-navy-800" dir="rtl">
                  {content.arabicContent}
                </div>
                {content.transliteration && (
                  <div className="text-lg text-gray-700 mb-2 italic">
                    {content.transliteration}
                  </div>
                )}
                {content.translation && (
                  <div className="text-base text-gray-600">
                    {content.translation}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Media Content */}
        {content.mediaUrl && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {content.contentType === 'VIDEO' && <Play className="h-5 w-5" />}
                {content.contentType === 'AUDIO' && <Volume2 className="h-5 w-5" />}
                Media Content
              </CardTitle>
            </CardHeader>
            <CardContent>
              {content.contentType === 'VIDEO' && (
                <video 
                  controls 
                  className="w-full rounded-lg"
                  poster={content.thumbnailUrl}
                >
                  <source src={content.mediaUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
              
              {content.contentType === 'AUDIO' && (
                <audio controls className="w-full">
                  <source src={content.mediaUrl} type="audio/mp3" />
                  Your browser does not support the audio tag.
                </audio>
              )}
            </CardContent>
          </Card>
        )}

        {/* Main Content */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Lesson Content
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div 
              className="prose prose-lg max-w-none prose-headings:text-islamic-navy-800 prose-a:text-islamic-green-600"
              dangerouslySetInnerHTML={{ 
                __html: content.content.replace(/\n/g, '<br>').replace(/##\s/g, '<h2>').replace(/###\s/g, '<h3>') 
              }}
            />
          </CardContent>
        </Card>

        {/* Tags */}
        {content.tags.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Related Topics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {content.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="cursor-pointer hover:bg-islamic-green-50">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={handleMarkComplete}
                className="flex-1 bg-islamic-green-600 hover:bg-islamic-green-700"
                disabled={isCompleted}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                {isCompleted ? 'Completed' : 'Mark as Complete'}
              </Button>
              
              <Button 
                onClick={handleStartQuiz}
                variant="outline" 
                className="flex-1"
              >
                Take Knowledge Quiz
              </Button>
              
              <Button variant="outline" className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                Download Notes
              </Button>
              
              <Button variant="outline">
                <Star className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}