'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
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
import { ArrowLeft, Loader2, Plus, X, Save } from 'lucide-react';
import { teacherApi, CourseFormData } from '@/lib/teacher-api';

const SUBJECTS = [
  { value: 'quran', label: 'Quran Studies' },
  { value: 'arabic', label: 'Arabic Language' },
  { value: 'fiqh', label: 'Islamic Jurisprudence (Fiqh)' },
  { value: 'hadith', label: 'Hadith Studies' },
  { value: 'seerah', label: "Prophet's Biography (Seerah)" },
  { value: 'aqeedah', label: 'Islamic Creed (Aqeedah)' },
  { value: 'akhlaq', label: 'Islamic Ethics (Akhlaq)' },
  { value: 'tajweed', label: 'Tajweed' },
] as const;

const DIFFICULTIES = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
] as const;

const AGE_TIERS = [
  { value: 'children', label: 'Children (6-12)' },
  { value: 'youth', label: 'Youth (13-17)' },
  { value: 'adults', label: 'Adults (18+)' },
  { value: 'seniors', label: 'Seniors (60+)' },
] as const;

type Subject = typeof SUBJECTS[number]['value'];
type Difficulty = typeof DIFFICULTIES[number]['value'];
type AgeTier = typeof AGE_TIERS[number]['value'];

export default function CreateCoursePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subject, setSubject] = useState<Subject>('quran');
  const [difficulty, setDifficulty] = useState<Difficulty>('beginner');
  const [ageTier, setAgeTier] = useState<AgeTier>('adults');
  const [durationWeeks, setDurationWeeks] = useState(12);
  const [schedule, setSchedule] = useState('');
  const [instructor, setInstructor] = useState('');
  const [maxStudents, setMaxStudents] = useState<number | ''>('');
  const [prerequisites, setPrerequisites] = useState('');
  const [learningOutcomes, setLearningOutcomes] = useState<string[]>(['']);

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  const addLearningOutcome = () => {
    setLearningOutcomes([...learningOutcomes, '']);
  };

  const removeLearningOutcome = (index: number) => {
    setLearningOutcomes(learningOutcomes.filter((_, i) => i !== index));
  };

  const updateLearningOutcome = (index: number, value: string) => {
    const updated = [...learningOutcomes];
    updated[index] = value;
    setLearningOutcomes(updated);
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    } else if (title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }

    if (!description.trim()) {
      newErrors.description = 'Description is required';
    } else if (description.length < 20) {
      newErrors.description = 'Description must be at least 20 characters';
    }

    if (durationWeeks < 1 || durationWeeks > 52) {
      newErrors.durationWeeks = 'Duration must be between 1 and 52 weeks';
    }

    if (maxStudents !== '' && (maxStudents < 1 || maxStudents > 1000)) {
      newErrors.maxStudents = 'Max students must be between 1 and 1000';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const courseData: CourseFormData = {
        title: title.trim(),
        description: description.trim(),
        subject,
        difficulty,
        age_tier: ageTier,
        duration_weeks: durationWeeks,
        schedule: schedule.trim() || undefined,
        instructor: instructor.trim() || undefined,
        max_students: maxStudents === '' ? null : maxStudents,
        prerequisites: prerequisites.trim() || undefined,
        learning_outcomes: learningOutcomes.filter(o => o.trim() !== ''),
      };

      await teacherApi.courses.createCourse(courseData);
      router.push('/teacher/courses');
    } catch (err) {
      console.error('Failed to create course:', err);
      setError(err instanceof Error ? err.message : 'Failed to create course');
    } finally {
      setSaving(false);
    }
  };

  return (
    <TeacherLayout title="Create Course" subtitle="Add a new course to your teaching portfolio">
      {/* Back Button */}
      <div className="mb-4">
        <Link href="/teacher/courses">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Courses
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
              <Label htmlFor="title">Course Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Introduction to Tajweed"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={errors.title ? 'border-red-500' : ''}
              />
              {errors.title && (
                <p className="text-sm text-red-500 mt-1">{errors.title}</p>
              )}
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Provide a detailed description of the course content and objectives..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className={errors.description ? 'border-red-500' : ''}
              />
              {errors.description && (
                <p className="text-sm text-red-500 mt-1">{errors.description}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="subject">Subject *</Label>
                <Select value={subject} onValueChange={(v) => setSubject(v as Subject)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {SUBJECTS.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="difficulty">Difficulty Level *</Label>
                <Select value={difficulty} onValueChange={(v) => setDifficulty(v as Difficulty)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    {DIFFICULTIES.map((d) => (
                      <SelectItem key={d.value} value={d.value}>
                        {d.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="ageTier">Age Group *</Label>
                <Select value={ageTier} onValueChange={(v) => setAgeTier(v as AgeTier)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select age group" />
                  </SelectTrigger>
                  <SelectContent>
                    {AGE_TIERS.map((a) => (
                      <SelectItem key={a.value} value={a.value}>
                        {a.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Course Details */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Course Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="durationWeeks">Duration (weeks) *</Label>
                <Input
                  id="durationWeeks"
                  type="number"
                  min={1}
                  max={52}
                  value={durationWeeks}
                  onChange={(e) => setDurationWeeks(parseInt(e.target.value) || 1)}
                  className={errors.durationWeeks ? 'border-red-500' : ''}
                />
                {errors.durationWeeks && (
                  <p className="text-sm text-red-500 mt-1">{errors.durationWeeks}</p>
                )}
              </div>

              <div>
                <Label htmlFor="maxStudents">Max Students (optional)</Label>
                <Input
                  id="maxStudents"
                  type="number"
                  min={1}
                  max={1000}
                  placeholder="No limit"
                  value={maxStudents}
                  onChange={(e) => setMaxStudents(e.target.value === '' ? '' : parseInt(e.target.value))}
                  className={errors.maxStudents ? 'border-red-500' : ''}
                />
                {errors.maxStudents && (
                  <p className="text-sm text-red-500 mt-1">{errors.maxStudents}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="schedule">Schedule (optional)</Label>
              <Input
                id="schedule"
                placeholder="e.g., Tuesdays and Thursdays, 7:00 PM - 8:30 PM"
                value={schedule}
                onChange={(e) => setSchedule(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="instructor">Instructor Name (optional)</Label>
              <Input
                id="instructor"
                placeholder="e.g., Ustadh Ahmad"
                value={instructor}
                onChange={(e) => setInstructor(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="prerequisites">Prerequisites (optional)</Label>
              <Textarea
                id="prerequisites"
                placeholder="List any prerequisites for this course..."
                value={prerequisites}
                onChange={(e) => setPrerequisites(e.target.value)}
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        {/* Learning Outcomes */}
        <Card className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Learning Outcomes</CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addLearningOutcome}
              disabled={learningOutcomes.length >= 20}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Outcome
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {learningOutcomes.map((outcome, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  placeholder={`Learning outcome ${index + 1}`}
                  value={outcome}
                  onChange={(e) => updateLearningOutcome(index, e.target.value)}
                />
                {learningOutcomes.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeLearningOutcome(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <p className="text-sm text-gray-500">
              Define what students will learn from this course. Maximum 20 outcomes.
            </p>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4">
          <Link href="/teacher/courses">
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
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Create Course
              </>
            )}
          </Button>
        </div>
      </form>
    </TeacherLayout>
  );
}
