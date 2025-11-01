'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AgeTierBadge } from './AgeTierFilter';

// Local type definitions matching Strapi schema
type AgeTier = 'children' | 'youth' | 'adults' | 'all';
type IslamicSubject = 'quran' | 'hadith' | 'fiqh' | 'aqeedah' | 'seerah' | 'arabic' | 'islamic_history' | 'akhlaq' | 'tajweed';
type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';
type EducationContentType = 'LESSON' | 'QUIZ' | 'VIDEO' | 'ARTICLE';

interface EducationContent {
  id: string;
  title: string;
  description: string;
  subject: IslamicSubject;
  ageTier: AgeTier;
  difficultyLevel: DifficultyLevel;
  contentType: EducationContentType;
  estimatedDuration: number;
  thumbnailUrl?: string;
  isPublished: boolean;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
  author?: {
    id: string;
    name: string;
  };
  _count?: {
    userProgress: number;
    quizAttempts: number;
  };
  userProgress?: {
    id: string;
    progress: number;
    status: string;
    lastAccessed: Date;
  };
  arabicContent?: string;
  transliteration?: string;
}

interface EducationContentCardProps {
  content: EducationContent;
  onClick?: (content: EducationContent) => void;
}

export function EducationContentCard({ content, onClick }: EducationContentCardProps) {
  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}min` : `${hours}h`;
    }
  };

  const getSubjectDisplay = (subject: IslamicSubject) => {
    const subjectMap: Record<string, string> = {
      'quran': 'Quran',
      'hadith': 'Hadith',
      'fiqh': 'Fiqh',
      'aqeedah': 'Aqeedah',
      'seerah': 'Seerah',
      'arabic': 'Arabic',
      'islamic_history': 'Islamic History',
      'akhlaq': 'Akhlaq',
    };
    return subjectMap[subject] || subject;
  };

  const getDifficultyColor = (level: DifficultyLevel) => {
    const colorMap: Record<string, string> = {
      'beginner': 'bg-green-100 text-green-800',
      'intermediate': 'bg-yellow-100 text-yellow-800',
      'advanced': 'bg-red-100 text-red-800',
    };
    return colorMap[level] || 'bg-gray-100 text-gray-800';
  };

  const getContentTypeIcon = (type: EducationContentType) => {
    const iconMap: Record<string, string> = {
      'LESSON': '📖',
      'QUIZ': '❓',
      'VIDEO': '🎥',
      'ARTICLE': '📄',
    };
    return iconMap[type] || '📖';
  };

  return (
    <Card 
      className="education-content-card hover:shadow-md transition-shadow cursor-pointer border rounded-lg"
      role="article"
      aria-label={`${content.title} - Islamic educational content`}
      tabIndex={0}
      onClick={() => onClick?.(content)}
    >
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start mb-2">
          <AgeTierBadge tier={content.ageTier} />
          <Badge variant="outline" className={getDifficultyColor(content.difficultyLevel)}>
            {content.difficultyLevel}
          </Badge>
        </div>
        
        <CardTitle className="text-lg">{content.title}</CardTitle>
        
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>{getContentTypeIcon(content.contentType)}</span>
          <span>{content.contentType}</span>
          <span>•</span>
          <span>{formatDuration(content.estimatedDuration)}</span>
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-gray-700 mb-4 line-clamp-2">{content.description}</p>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Subject:</span>
            <Badge variant="secondary">{getSubjectDisplay(content.subject)}</Badge>
          </div>
          
          {content.author && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">By:</span>
              <span className="font-medium">{content.author.name}</span>
            </div>
          )}

          {content.userProgress && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Progress:</span>
              <span className="font-medium">{content.userProgress.progress}%</span>
            </div>
          )}

          {content._count && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Learners:</span>
              <span>{content._count.userProgress}</span>
            </div>
          )}
        </div>

        {content.tags && content.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1">
            {content.tags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="text-xs"
              >
                #{tag}
              </Badge>
            ))}
          </div>
        )}
        
        {content.arabicContent && (
          <div className="mt-4 p-2 bg-islamic-green-50 rounded border">
            <div className="text-xs text-islamic-green-700 font-medium mb-1">
              Arabic Content Available
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}