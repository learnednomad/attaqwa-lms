/**
 * Seerah Modules Component
 * Displays the list of Seerah course modules with progress
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  BookOpen, 
  Clock, 
  CheckCircle2, 
  Circle, 
  Lock,
  ChevronRight,
  Award,
  FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Module {
  id: string;
  title: string;
  description: string;
  estimatedDuration: number;
  chapters: {
    id: string;
    title: string;
    order: number;
    estimatedDuration: number;
  }[];
  quizzes: {
    id: string;
    title: string;
    passingScore: number;
    _count: {
      questions: number;
    };
  }[];
  userProgress?: {
    progress: number;
    status: string;
    completedAt: string | null;
    score: number | null;
    attempts: number;
  };
}

export function SeerahModules() {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchModules();
  }, []);

  const fetchModules = async () => {
    try {
      const response = await fetch('/api/seerah/modules', {
        credentials: 'include',
      });
      const data = await response.json();
      setModules(data.modules || []);
    } catch (error) {
      console.error('Error fetching modules:', error);
    } finally {
      setLoading(false);
    }
  };

  const getModuleStatus = (module: Module) => {
    if (!module.userProgress) return 'locked';
    if (module.userProgress.status === 'COMPLETED') return 'completed';
    if (module.userProgress.status === 'IN_PROGRESS') return 'in-progress';
    return 'available';
  };

  const getModuleIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-6 h-6 text-islamic-green-600" />;
      case 'in-progress':
        return <Circle className="w-6 h-6 text-islamic-gold-600" />;
      case 'available':
        return <Circle className="w-6 h-6 text-gray-400" />;
      default:
        return <Lock className="w-6 h-6 text-gray-400" />;
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

  if (loading) {
    return <div className="text-center py-8">Loading modules...</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-islamic-navy mb-6">Course Modules</h2>
      
      {modules.map((module, index) => {
        const status = getModuleStatus(module);
        const isExpanded = expandedModule === module.id;
        const isAccessible = status !== 'locked';
        
        return (
          <Card 
            key={module.id}
            className={cn(
              "transition-all duration-200",
              status === 'completed' && "border-islamic-green-300 bg-islamic-green-50/30",
              status === 'in-progress' && "border-islamic-gold-300 bg-islamic-gold-50/30",
              !isAccessible && "opacity-75"
            )}
          >
            <CardHeader 
              className="cursor-pointer"
              onClick={() => setExpandedModule(isExpanded ? null : module.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  {getModuleIcon(status)}
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">
                      {module.title}
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      {module.description}
                    </CardDescription>
                    
                    <div className="flex flex-wrap gap-4 mt-4">
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <BookOpen className="w-4 h-4" />
                        <span>{module.chapters.length} Chapters</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        <span>{formatDuration(module.estimatedDuration)}</span>
                      </div>
                      {module.quizzes.length > 0 && (
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <FileText className="w-4 h-4" />
                          <span>{module.quizzes[0]._count.questions} Questions</span>
                        </div>
                      )}
                      {module.userProgress?.score && (
                        <div className="flex items-center gap-1 text-sm">
                          <Award className="w-4 h-4 text-islamic-gold-600" />
                          <span className="text-islamic-gold-700 font-medium">
                            Score: {module.userProgress.score}%
                          </span>
                        </div>
                      )}
                    </div>

                    {module.userProgress && module.userProgress.progress > 0 && (
                      <div className="mt-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">Progress</span>
                          <span className="font-medium">{module.userProgress.progress}%</span>
                        </div>
                        <Progress 
                          value={module.userProgress.progress} 
                          className="h-2"
                        />
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {status === 'completed' && (
                    <Badge className="bg-islamic-green-600 text-white">
                      Completed
                    </Badge>
                  )}
                  {status === 'in-progress' && (
                    <Badge className="bg-islamic-gold-600 text-white">
                      In Progress
                    </Badge>
                  )}
                  <ChevronRight 
                    className={cn(
                      "w-5 h-5 text-gray-400 transition-transform",
                      isExpanded && "rotate-90"
                    )}
                  />
                </div>
              </div>
            </CardHeader>

            {isExpanded && (
              <CardContent>
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-3">Chapters</h4>
                  <div className="space-y-2">
                    {module.chapters.map((chapter) => (
                      <div 
                        key={chapter.id}
                        className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">
                            {chapter.order}.
                          </span>
                          <span className="text-sm">{chapter.title}</span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {formatDuration(chapter.estimatedDuration)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {module.quizzes.length > 0 && (
                    <div className="mt-4 pt-4 border-t">
                      <h4 className="font-semibold mb-2">Assessment</h4>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-sm">
                              {module.quizzes[0].title}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {module.quizzes[0]._count.questions} questions • 
                              Pass: {module.quizzes[0].passingScore}%
                            </p>
                          </div>
                          {module.userProgress?.attempts ? (
                            <Badge variant="outline">
                              {module.userProgress.attempts} attempt{module.userProgress.attempts !== 1 ? 's' : ''}
                            </Badge>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end mt-4">
                    {isAccessible ? (
                      <Link href={`/education/seerah/${module.id}`}>
                        <Button className="bg-islamic-green-600 hover:bg-islamic-green-700">
                          {status === 'completed' ? 'Review Module' : 
                           status === 'in-progress' ? 'Continue Learning' : 
                           'Start Module'}
                        </Button>
                      </Link>
                    ) : (
                      <Button disabled>
                        Complete Previous Module
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        );
      })}
    </div>
  );
}