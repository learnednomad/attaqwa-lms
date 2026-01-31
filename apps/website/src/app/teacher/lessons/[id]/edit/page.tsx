'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { TeacherLayout } from '@/components/layout/teacher-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Loader2, Save, AlertCircle, Plus, X } from 'lucide-react';
import { teacherApi } from '@/lib/teacher-api';

const LESSON_TYPES = [
  { value: 'reading', label: 'Reading' },
  { value: 'video', label: 'Video' },
  { value: 'quiz', label: 'Quiz' },
  { value: 'interactive', label: 'Interactive' },
] as const;

type LessonType = typeof LESSON_TYPES[number]['value'];

export default function EditLessonPage() {
  const params = useParams();
  const router = useRouter();
  const lessonId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [lessonType, setLessonType] = useState<LessonType>('reading');
  const [lessonOrder, setLessonOrder] = useState(1);
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [content, setContent] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [isFree, setIsFree] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [learningObjectives, setLearningObjectives] = useState<string[]>(['']);

  // Validation
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        setLoading(true);
        setLoadError(null);
        const result = await teacherApi.lessons.getLesson(lessonId);
        const lesson = result.data as any;

        setTitle(lesson.title || '');
        setDescription(lesson.description || '');
        setLessonType((lesson.lesson_type as LessonType) || 'reading');
        setLessonOrder(lesson.lesson_order || 1);
        setDurationMinutes(lesson.duration_minutes || 30);
        setContent(lesson.content || '');
        setVideoUrl(lesson.video_url || '');
        setIsFree(lesson.is_free || false);
        setIsPreview(lesson.is_preview || false);
        setLearningObjectives(
          lesson.learning_objectives && lesson.learning_objectives.length > 0
            ? lesson.learning_objectives
            : ['']
        );
      } catch (err) {
        console.error('Failed to fetch lesson:', err);
        setLoadError(err instanceof Error ? err.message : 'Failed to load lesson');
      } finally {
        setLoading(false);
      }
    };

    if (lessonId) fetchLesson();
  }, [lessonId]);

  const addObjective = () => {
    setLearningObjectives([...learningObjectives, '']);
  };

  const removeObjective = (index: number) => {
    setLearningObjectives(learningObjectives.filter((_, i) => i !== index));
  };

  const updateObjective = (index: number, value: string) => {
    const updated = [...learningObjectives];
    updated[index] = value;
    setLearningObjectives(updated);
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    } else if (title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }

    if (durationMinutes < 1 || durationMinutes > 300) {
      newErrors.durationMinutes = 'Duration must be between 1 and 300 minutes';
    }

    if (lessonOrder < 1) {
      newErrors.lessonOrder = 'Lesson order must be at least 1';
    }

    if (lessonType === 'video' && videoUrl && !videoUrl.startsWith('http')) {
      newErrors.videoUrl = 'Video URL must be a valid URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setSaving(true);
      setError(null);

      const trimmedTitle = title.trim();
      const lessonData = {
        title: trimmedTitle,
        slug: trimmedTitle
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, ''),
        description: description.trim(),
        lesson_type: lessonType,
        lesson_order: lessonOrder,
        duration_minutes: durationMinutes,
        content: content,
        video_url: videoUrl.trim() || null,
        is_free: isFree,
        is_preview: isPreview,
        learning_objectives: learningObjectives.filter(o => o.trim() !== ''),
      };

      await teacherApi.lessons.updateLesson(lessonId, lessonData as any);
      router.push(`/teacher/lessons/${lessonId}`);
    } catch (err) {
      console.error('Failed to update lesson:', err);
      setError(err instanceof Error ? err.message : 'Failed to update lesson');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <TeacherLayout title="Edit Lesson" subtitle="Loading...">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        </div>
      </TeacherLayout>
    );
  }

  if (loadError) {
    return (
      <TeacherLayout title="Edit Lesson" subtitle="Error loading lesson">
        <Card className="p-8 text-center">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load lesson</h3>
          <p className="text-gray-500 mb-4">{loadError}</p>
          <Link href="/teacher/lessons">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Lessons
            </Button>
          </Link>
        </Card>
      </TeacherLayout>
    );
  }

  return (
    <TeacherLayout title="Edit Lesson" subtitle={`Editing: ${title}`}>
      {/* Back Button */}
      <div className="mb-4">
        <Link href={`/teacher/lessons/${lessonId}`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Lesson
          </Button>
        </Link>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Error Message */}
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="p-4">
              <p className="text-red-700">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Basic Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Lesson Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Introduction to Fiqh and Taharah"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={errors.title ? 'border-red-500' : ''}
              />
              {errors.title && (
                <p className="text-sm text-red-500 mt-1">{errors.title}</p>
              )}
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Brief description of the lesson..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="lessonType">Lesson Type *</Label>
                <Select value={lessonType} onValueChange={(v) => setLessonType(v as LessonType)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {LESSON_TYPES.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="lessonOrder">Lesson Order *</Label>
                <Input
                  id="lessonOrder"
                  type="number"
                  min={1}
                  value={lessonOrder}
                  onChange={(e) => setLessonOrder(parseInt(e.target.value) || 1)}
                  className={errors.lessonOrder ? 'border-red-500' : ''}
                />
                {errors.lessonOrder && (
                  <p className="text-sm text-red-500 mt-1">{errors.lessonOrder}</p>
                )}
              </div>

              <div>
                <Label htmlFor="durationMinutes">Duration (minutes) *</Label>
                <Input
                  id="durationMinutes"
                  type="number"
                  min={1}
                  max={300}
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(parseInt(e.target.value) || 1)}
                  className={errors.durationMinutes ? 'border-red-500' : ''}
                />
                {errors.durationMinutes && (
                  <p className="text-sm text-red-500 mt-1">{errors.durationMinutes}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Lesson Content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="content">Content (HTML supported)</Label>
              <Textarea
                id="content"
                placeholder="Write the lesson content here... HTML is supported."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={16}
                className="font-mono text-sm"
              />
              <p className="text-sm text-gray-500 mt-1">
                HTML formatting is supported for rich content.
              </p>
            </div>

            {(lessonType === 'video' || videoUrl) && (
              <div>
                <Label htmlFor="videoUrl">Video URL</Label>
                <Input
                  id="videoUrl"
                  placeholder="https://..."
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className={errors.videoUrl ? 'border-red-500' : ''}
                />
                {errors.videoUrl && (
                  <p className="text-sm text-red-500 mt-1">{errors.videoUrl}</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Settings */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFree}
                  onChange={(e) => setIsFree(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-700">Free Access</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPreview}
                  onChange={(e) => setIsPreview(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-700">Available as Preview</span>
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Learning Objectives */}
        <Card className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Learning Objectives</CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addObjective}
              disabled={learningObjectives.length >= 20}
            >
              <Plus className="h-4 w-4 mr-1" /> Add Objective
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {learningObjectives.map((objective, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  placeholder={`Objective ${index + 1}`}
                  value={objective}
                  onChange={(e) => updateObjective(index, e.target.value)}
                />
                {learningObjectives.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeObjective(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <p className="text-sm text-gray-500">
              Define what students will learn. Maximum 20 objectives.
            </p>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4">
          <Link href={`/teacher/lessons/${lessonId}`}>
            <Button type="button" variant="outline" disabled={saving}>
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700"
            disabled={saving}
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" /> Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </TeacherLayout>
  );
}
