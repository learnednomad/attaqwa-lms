/**
 * Seerah Modules Component
 * Displays the list of Seerah course modules with progress
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Clock,
  CheckCircle2,
  Circle,
  Lock,
  ChevronRight,
  Award,
  FileText,
  Layers
} from 'lucide-react';
import { cn } from '@/lib/utils';

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
        return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
      case 'in-progress':
        return <Circle className="w-5 h-5 text-amber-500" />;
      case 'available':
        return <Circle className="w-5 h-5 text-neutral-300" />;
      default:
        return <Lock className="w-5 h-5 text-neutral-300" />;
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
    return <div className="text-center py-8 text-sm text-neutral-400">Loading modules...</div>;
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-xl font-semibold text-neutral-900">Course Modules</h2>
        <div className="flex-1 h-px bg-neutral-100" />
      </div>

      <div className="space-y-3">
        {modules.map((module) => {
          const status = getModuleStatus(module);
          const isExpanded = expandedModule === module.id;
          const isAccessible = status !== 'locked';

          return (
            <div
              key={module.id}
              className={cn(
                "group rounded-xl border bg-white overflow-hidden transition-colors",
                status === 'completed' && "border-emerald-200",
                status === 'in-progress' && "border-amber-200",
                status !== 'completed' && status !== 'in-progress' && "border-neutral-200",
                isAccessible && "hover:border-emerald-300"
              )}
            >
              {/* Module Header */}
              <div
                className="p-5 cursor-pointer"
                onClick={() => setExpandedModule(isExpanded ? null : module.id)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="mt-0.5 shrink-0">
                      {getModuleIcon(status)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-medium text-neutral-900 truncate">
                          {module.title}
                        </p>
                        {status === 'completed' && (
                          <span className="shrink-0 rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                            Completed
                          </span>
                        )}
                        {status === 'in-progress' && (
                          <span className="shrink-0 rounded-md border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                            In Progress
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-neutral-400 leading-relaxed mb-3">
                        {module.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                          <BookOpen className="h-3 w-3" />
                          <span>{module.chapters.length} Chapters</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                          <Clock className="h-3 w-3" />
                          <span>{formatDuration(module.estimatedDuration)}</span>
                        </div>
                        {module.quizzes.length > 0 && (
                          <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                            <FileText className="h-3 w-3" />
                            <span>{module.quizzes[0]._count.questions} Questions</span>
                          </div>
                        )}
                        {module.userProgress?.score && (
                          <div className="flex items-center gap-1.5 text-xs text-amber-600">
                            <Award className="h-3 w-3" />
                            <span className="font-medium">Score: {module.userProgress.score}%</span>
                          </div>
                        )}
                      </div>

                      {module.userProgress && module.userProgress.progress > 0 && (
                        <div className="mt-3">
                          <div className="flex justify-between text-[10px] text-neutral-400 mb-1">
                            <span>Progress</span>
                            <span className="font-medium text-neutral-600">{module.userProgress.progress}%</span>
                          </div>
                          <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-emerald-500 rounded-full transition-all"
                              style={{ width: `${module.userProgress.progress}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <ChevronRight
                    className={cn(
                      "w-4 h-4 text-neutral-300 transition-transform shrink-0 mt-0.5",
                      isExpanded && "rotate-90",
                      isAccessible && "group-hover:text-emerald-500"
                    )}
                  />
                </div>
              </div>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="border-t border-neutral-100 px-5 py-4">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-3">Chapters</h4>
                  <div className="space-y-1">
                    {module.chapters.map((chapter) => (
                      <div
                        key={chapter.id}
                        className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-neutral-50 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-neutral-400 w-5">
                            {chapter.order}.
                          </span>
                          <span className="text-sm text-neutral-700">{chapter.title}</span>
                        </div>
                        <span className="text-xs text-neutral-400">
                          {formatDuration(chapter.estimatedDuration)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {module.quizzes.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-neutral-100">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">Assessment</h4>
                      <div className="bg-neutral-50 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-neutral-900">
                              {module.quizzes[0].title}
                            </p>
                            <p className="text-xs text-neutral-400 mt-1">
                              {module.quizzes[0]._count.questions} questions &middot;
                              Pass: {module.quizzes[0].passingScore}%
                            </p>
                          </div>
                          {module.userProgress?.attempts ? (
                            <span className="rounded-md border border-neutral-200 bg-white px-2 py-0.5 text-[10px] font-semibold text-neutral-500">
                              {module.userProgress.attempts} attempt{module.userProgress.attempts !== 1 ? 's' : ''}
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end mt-4">
                    {isAccessible ? (
                      <Link
                        href={`/education/seerah/${module.id}`}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
                      >
                        {status === 'completed' ? 'Review Module' :
                         status === 'in-progress' ? 'Continue Learning' :
                         'Start Module'}
                        <ChevronRight className="h-3.5 w-3.5" />
                      </Link>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-lg bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-400">
                        <Lock className="h-3.5 w-3.5" />
                        Complete Previous Module
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
