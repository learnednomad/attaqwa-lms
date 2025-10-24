/**
 * Seerah Module Content Component
 * Displays chapters and manages navigation within a module
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft,
  BookOpen, 
  Clock, 
  ChevronRight,
  CheckCircle,
  Circle,
  FileText,
  Play,
  Award
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { SeerahQuiz } from './seerah-quiz';

interface Chapter {
  id: string;
  title: string;
  chapterContent: string;
  order: number;
  estimatedDuration: number;
}

interface Module {
  id: string;
  title: string;
  description: string;
  content: string;
  estimatedDuration: number;
  chapters: Chapter[];
  quizzes: any[];
  resources: any[];
  islamicReferences: any[];
  author: {
    name: string;
  };
}

interface UserProgress {
  progress: number;
  status: string;
  currentChapter: number | null;
  score: number | null;
  attempts: number;
}

interface ModuleContentProps {
  moduleId: string;
}

export function SeerahModuleContent({ moduleId }: ModuleContentProps) {
  const router = useRouter();
  const [module, setModule] = useState<Module | null>(null);
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [currentChapter, setCurrentChapter] = useState<number>(0);

  useEffect(() => {
    fetchModule();
  }, [moduleId]);

  const fetchModule = async () => {
    try {
      const response = await fetch(`/api/seerah/modules/${moduleId}`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch module');
      }

      const data = await response.json();
      setModule(data.module);
      setUserProgress(data.userProgress);
      
      // Set current chapter based on progress
      if (data.userProgress?.currentChapter) {
        setCurrentChapter(data.userProgress.currentChapter - 1);
      }
    } catch (error) {
      console.error('Error fetching module:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateChapterProgress = async (chapterIndex: number) => {
    if (!module) return;

    try {
      const response = await fetch(`/api/seerah/modules/${moduleId}/chapters/${module.chapters[chapterIndex].id}`, {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentChapter(chapterIndex);
        
        // Update local progress
        setUserProgress(prev => prev ? {
          ...prev,
          progress: data.progressPercentage,
          currentChapter: chapterIndex + 1,
        } : null);
      }
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins > 0 ? `${mins}m` : ''}`;
    }
    return `${mins}m`;
  };

  const renderContent = (content: string) => {
    // Simple markdown-like rendering
    return content.split('\n').map((paragraph, index) => {
      if (paragraph.startsWith('#')) {
        const level = paragraph.match(/^#+/)?.[0].length || 1;
        const text = paragraph.replace(/^#+\s/, '');
        const HeadingTag = `h${Math.min(level, 6)}` as keyof JSX.IntrinsicElements;
        return (
          <HeadingTag key={index} className={`font-bold mb-3 mt-6 ${
            level === 1 ? 'text-2xl' : 
            level === 2 ? 'text-xl' : 
            'text-lg'
          }`}>
            {text}
          </HeadingTag>
        );
      }
      if (paragraph.trim()) {
        return <p key={index} className="mb-4 text-gray-700 leading-relaxed">{paragraph}</p>;
      }
      return null;
    });
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-islamic-green-600"></div>
        <p className="mt-2 text-gray-600">Loading module content...</p>
      </div>
    );
  }

  if (!module) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Module not found</p>
        <Button 
          onClick={() => router.push('/education/seerah')}
          className="mt-4"
        >
          Back to Modules
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link 
          href="/education/seerah"
          className="inline-flex items-center gap-2 text-islamic-green-600 hover:text-islamic-green-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Modules
        </Link>
        
        <h1 className="text-3xl font-bold text-islamic-navy mb-2">
          {module.title}
        </h1>
        <p className="text-gray-600 mb-4">
          {module.description}
        </p>

        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-1 text-gray-500">
            <BookOpen className="w-4 h-4" />
            <span>{module.chapters.length} Chapters</span>
          </div>
          <div className="flex items-center gap-1 text-gray-500">
            <Clock className="w-4 h-4" />
            <span>{formatDuration(module.estimatedDuration)}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-500">
            <FileText className="w-4 h-4" />
            <span>By {module.author.name}</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      {userProgress && userProgress.progress > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Module Progress</span>
              <span className="font-semibold">{userProgress.progress}%</span>
            </div>
            <Progress value={userProgress.progress} className="h-2" />
            {userProgress.status === 'COMPLETED' && (
              <div className="flex items-center gap-2 mt-3 text-islamic-green-600">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Module Completed!</span>
                {userProgress.score && (
                  <Badge className="ml-auto bg-islamic-gold-600">
                    Score: {userProgress.score}%
                  </Badge>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="chapters">Chapters</TabsTrigger>
          <TabsTrigger value="quiz">Quiz</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Module Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-islamic max-w-none">
                {renderContent(module.content)}
              </div>

              {/* Islamic References */}
              {module.islamicReferences.length > 0 && (
                <div className="mt-8 pt-6 border-t">
                  <h3 className="font-semibold mb-4">Islamic References</h3>
                  <div className="space-y-3">
                    {module.islamicReferences.map((ref: any) => (
                      <div key={ref.id} className="bg-islamic-green-50 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">📖</span>
                          <div className="flex-1">
                            {ref.arabicText && (
                              <p className="arabic text-right mb-2">{ref.arabicText}</p>
                            )}
                            {ref.translation && (
                              <p className="text-sm text-gray-700">{ref.translation}</p>
                            )}
                            <div className="flex gap-2 mt-2">
                              {ref.surahNumber && (
                                <Badge variant="outline" className="text-xs">
                                  Surah {ref.surahNumber}:{ref.ayahNumber}
                                </Badge>
                              )}
                              {ref.hadithBook && (
                                <Badge variant="outline" className="text-xs">
                                  {ref.hadithBook} #{ref.hadithNumber}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Resources */}
              {module.resources.length > 0 && (
                <div className="mt-6 pt-6 border-t">
                  <h3 className="font-semibold mb-4">Additional Resources</h3>
                  <div className="space-y-2">
                    {module.resources.map((resource: any) => (
                      <a
                        key={resource.id}
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-2 rounded hover:bg-gray-50"
                      >
                        <FileText className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{resource.title}</span>
                        <ChevronRight className="w-4 h-4 text-gray-400 ml-auto" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chapters" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Chapter Content</CardTitle>
              <CardDescription>
                Navigate through the module chapters
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Chapter Navigation */}
              <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {module.chapters.map((chapter, index) => (
                  <button
                    key={chapter.id}
                    onClick={() => updateChapterProgress(index)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors",
                      currentChapter === index
                        ? "bg-islamic-green-600 text-white"
                        : userProgress && userProgress.currentChapter && index < userProgress.currentChapter
                        ? "bg-islamic-green-100 text-islamic-green-700"
                        : "bg-gray-100 hover:bg-gray-200"
                    )}
                  >
                    {userProgress && userProgress.currentChapter && index < userProgress.currentChapter ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <Circle className="w-4 h-4" />
                    )}
                    <span className="text-sm font-medium">
                      {chapter.order}. {chapter.title}
                    </span>
                  </button>
                ))}
              </div>

              {/* Chapter Content */}
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-1">
                      Chapter {module.chapters[currentChapter].order}: {module.chapters[currentChapter].title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Estimated time: {formatDuration(module.chapters[currentChapter].estimatedDuration)}
                    </p>
                  </div>
                </div>

                <div className="prose prose-islamic max-w-none">
                  {renderContent(module.chapters[currentChapter].chapterContent)}
                </div>

                {/* Chapter Navigation */}
                <div className="flex justify-between mt-8 pt-6 border-t">
                  <Button
                    variant="outline"
                    onClick={() => updateChapterProgress(currentChapter - 1)}
                    disabled={currentChapter === 0}
                  >
                    Previous Chapter
                  </Button>
                  {currentChapter < module.chapters.length - 1 ? (
                    <Button
                      onClick={() => updateChapterProgress(currentChapter + 1)}
                      className="bg-islamic-green-600 hover:bg-islamic-green-700"
                    >
                      Next Chapter
                    </Button>
                  ) : (
                    <Button
                      onClick={() => setActiveTab('quiz')}
                      className="bg-islamic-gold-600 hover:bg-islamic-gold-700"
                    >
                      Take Quiz
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quiz" className="mt-6">
          {module.quizzes.length > 0 ? (
            <SeerahQuiz 
              quizId={module.quizzes[0].id} 
              moduleId={moduleId}
            />
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No quiz available for this module</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}