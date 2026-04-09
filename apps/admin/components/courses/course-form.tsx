/**
 * Course Form Component
 * Reusable form for creating and editing courses
 */

'use client';

import { Upload, X } from 'lucide-react';
import Image from 'next/image';
import { useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
function CourseImageDropzone({
  onFileSelect,
  error,
}: {
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div
      onDrop={(e) => {
        e.preventDefault();
        setIsDragOver(false);
        const file = e.dataTransfer.files?.[0];
        if (file && fileInputRef.current) {
          const dt = new DataTransfer();
          dt.items.add(file);
          fileInputRef.current.files = dt.files;
          fileInputRef.current.dispatchEvent(new Event('change', { bubbles: true }));
        }
      }}
      onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
      onDragLeave={(e) => { e.preventDefault(); setIsDragOver(false); }}
      onClick={() => fileInputRef.current?.click()}
      className={`cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
        isDragOver
          ? 'border-primary-400 bg-primary-50/50'
          : 'border-charcoal-300 hover:border-charcoal-400 hover:bg-charcoal-50/50'
      }`}
    >
      <Upload className={`mx-auto h-12 w-12 ${isDragOver ? 'text-primary-500' : 'text-charcoal-400'}`} />
      <p className="mt-2 text-sm text-charcoal-600">
        Drag and drop or{' '}
        <span className="font-medium text-primary-600">browse</span>
      </p>
      <p className="mt-1 text-xs text-charcoal-500">PNG, JPG up to 5MB</p>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={onFileSelect}
        className="hidden"
      />
      {error && (
        <p className="mt-2 text-xs text-red-600">{error}</p>
      )}
    </div>
  );
}

export interface CourseFormProps {
  initialData?: Record<string, unknown>;
  onSubmit: (data: CourseFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export interface CourseFormData {
  title: string;
  description: string;
  category: string;
  difficulty: string;
  ageTier: string;
  coverImage?: File | string;
  duration?: number;
  isPublished: boolean;
  instructor: string;
  schedule: string;
  prerequisites: string;
  learningOutcomes: string[];
  maxStudents?: number;
  startDate: string;
  endDate: string;
}

export function CourseForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: CourseFormProps) {
  const [formData, setFormData] = useState<CourseFormData>({
    title: (initialData?.title as string) || '',
    description: (initialData?.description as string) || '',
    category: (initialData?.subject as string) || (initialData?.category as string) || 'quran',
    difficulty: (initialData?.difficulty as string) || 'beginner',
    ageTier: (initialData?.age_tier as string) || (initialData?.ageTier as string) || 'all',
    coverImage: (initialData?.coverImage as { url: string })?.url || undefined,
    duration: (initialData?.duration_weeks as number) ? (initialData?.duration_weeks as number) * 60 : (initialData?.estimatedDuration as number) || 0,
    isPublished: (initialData?.publishedAt != null) || (initialData?.isPublished as boolean) || false,
    instructor: (initialData?.instructor as string) || '',
    schedule: (initialData?.schedule as string) || 'self-paced',
    prerequisites: (initialData?.prerequisites as string) || '',
    learningOutcomes: (initialData?.learning_outcomes as string[]) || [''],
    maxStudents: (initialData?.max_students as number) || undefined,
    startDate: (initialData?.start_date as string) || '',
    endDate: (initialData?.end_date as string) || '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CourseFormData, string>>>({});
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(
    (initialData?.coverImage as { url: string })?.url || null
  );

  const categories: { value: string; label: string }[] = [
    { value: 'quran', label: 'Quran Studies' },
    { value: 'arabic', label: 'Arabic Language' },
    { value: 'tajweed', label: 'Tajweed' },
    { value: 'hadith', label: 'Hadith Studies' },
    { value: 'fiqh', label: 'Islamic Jurisprudence (Fiqh)' },
    { value: 'seerah', label: 'Prophet\'s Biography (Seerah)' },
    { value: 'aqeedah', label: 'Islamic Creed (Aqeedah)' },
    { value: 'akhlaq', label: 'Islamic Ethics (Akhlaq)' },
  ];

  const difficulties: { value: string; label: string }[] = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
  ];

  const ageTiers = [
    { value: 'children', label: 'Children (6-12)' },
    { value: 'youth', label: 'Youth (13-17)' },
    { value: 'adults', label: 'Adults (18+)' },
    { value: 'all', label: 'All Ages' },
  ];

  const handleInputChange = (
    field: keyof CourseFormData,
    value: string | boolean | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors((prev) => ({ ...prev, coverImage: 'Please upload an image file' }));
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, coverImage: 'Image must be less than 5MB' }));
        return;
      }

      setFormData((prev) => ({ ...prev, coverImage: file }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Clear error
      if (errors.coverImage) {
        setErrors((prev) => ({ ...prev, coverImage: undefined }));
      }
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, coverImage: undefined }));
    setCoverImagePreview(null);
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CourseFormData, string>> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Course title is required';
    } else if (formData.title.length < 3) {
      newErrors.title = 'Course title must be at least 3 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Course description is required';
    } else if (formData.description.length < 20) {
      newErrors.description = 'Description must be at least 20 characters';
    }

    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }

    if (!formData.difficulty) {
      newErrors.difficulty = 'Please select a difficulty level';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information Section */}
      <div className="rounded-lg border border-charcoal-200 bg-white p-6">
        <h2 className="mb-4 text-xl font-semibold text-charcoal-900">
          Basic Information
        </h2>

        <div className="space-y-4">
          <Input
            label="Course Title"
            placeholder="e.g., Introduction to Tajweed"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            error={errors.title}
            required
          />

          <div>
            <label htmlFor="course-description" className="mb-1.5 block text-sm font-medium text-charcoal-700">
              Description
              <span className="text-red-500">*</span>
            </label>
            <textarea
              id="course-description"
              placeholder="Provide a detailed description of the course content and objectives..."
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={5}
              maxLength={1000}
              className={`w-full rounded-lg border px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 ${
                errors.description
                  ? 'border-red-500'
                  : 'border-charcoal-300'
              }`}
            />
            <div className="mt-1 flex justify-between">
              {errors.description ? (
                <p className="text-xs text-red-600">{errors.description}</p>
              ) : (
                <p className="text-xs text-charcoal-500">Describe learning objectives, topics covered, and what students will achieve</p>
              )}
              <span className={`text-xs ${formData.description.length > 900 ? 'text-amber-600' : 'text-charcoal-400'}`}>
                {formData.description.length}/1000
              </span>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-charcoal-700">
                Category
                <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  handleInputChange('category', e.target.value)
                }
                className={`w-full rounded-lg border px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 ${
                  errors.category
                    ? 'border-red-500'
                    : 'border-charcoal-300'
                }`}
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-xs text-red-600">{errors.category}</p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-charcoal-700">
                Difficulty Level
                <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.difficulty}
                onChange={(e) =>
                  handleInputChange('difficulty', e.target.value)
                }
                className={`w-full rounded-lg border px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 ${
                  errors.difficulty
                    ? 'border-red-500'
                    : 'border-charcoal-300'
                }`}
              >
                {difficulties.map((diff) => (
                  <option key={diff.value} value={diff.value}>
                    {diff.label}
                  </option>
                ))}
              </select>
              {errors.difficulty && (
                <p className="mt-1 text-xs text-red-600">{errors.difficulty}</p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-charcoal-700">
                Age Group
              </label>
              <select
                value={formData.ageTier}
                onChange={(e) => handleInputChange('ageTier', e.target.value)}
                className="w-full rounded-lg border border-charcoal-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              >
                {ageTiers.map((tier) => (
                  <option key={tier.value} value={tier.value}>
                    {tier.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <Input
            label="Estimated Duration (minutes)"
            type="number"
            placeholder="e.g., 180"
            value={formData.duration || ''}
            onChange={(e) => handleInputChange('duration', parseInt(e.target.value) || 0)}
            helperText="Total estimated time to complete the course"
          />
        </div>
      </div>

      {/* Course Details Section */}
      <div className="rounded-lg border border-charcoal-200 bg-white p-6">
        <h2 className="mb-4 text-xl font-semibold text-charcoal-900">
          Course Details
        </h2>

        <div className="space-y-4">
          <Input
            label="Instructor Name"
            placeholder="e.g., Sheikh Ahmad Muhammad"
            value={formData.instructor}
            onChange={(e) => handleInputChange('instructor', e.target.value)}
            required
          />

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="course-schedule" className="mb-1.5 block text-sm font-medium text-charcoal-700">
                Schedule
              </label>
              <select
                id="course-schedule"
                value={formData.schedule}
                onChange={(e) => handleInputChange('schedule', e.target.value)}
                className="w-full rounded-lg border border-charcoal-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              >
                <option value="self-paced">Self-Paced</option>
                <option value="weekly">Weekly Classes</option>
                <option value="daily">Daily Sessions</option>
                <option value="weekend">Weekend Only</option>
                <option value="intensive">Intensive (Multi-day)</option>
              </select>
            </div>

            <Input
              label="Max Students"
              type="number"
              min="1"
              placeholder="Unlimited"
              value={formData.maxStudents || ''}
              onChange={(e) => handleInputChange('maxStudents', parseInt(e.target.value) || 0)}
              helperText="Leave empty for unlimited"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Start Date"
              type="date"
              value={formData.startDate}
              onChange={(e) => handleInputChange('startDate', e.target.value)}
            />
            <Input
              label="End Date"
              type="date"
              value={formData.endDate}
              onChange={(e) => handleInputChange('endDate', e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="course-prerequisites" className="mb-1.5 block text-sm font-medium text-charcoal-700">
              Prerequisites
            </label>
            <textarea
              id="course-prerequisites"
              placeholder="e.g., Basic Arabic reading ability, completion of Quran 101..."
              value={formData.prerequisites}
              onChange={(e) => handleInputChange('prerequisites', e.target.value)}
              rows={2}
              className="w-full rounded-lg border border-charcoal-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
            <p className="mt-1 text-xs text-charcoal-500">What should students know before taking this course?</p>
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="text-sm font-medium text-charcoal-700">Learning Outcomes</label>
              <button
                type="button"
                onClick={() => {
                  const updated = [...formData.learningOutcomes, ''];
                  setFormData((prev) => ({ ...prev, learningOutcomes: updated }));
                }}
                className="text-xs font-medium text-primary-600 hover:text-primary-700"
              >
                + Add outcome
              </button>
            </div>
            <div className="space-y-2">
              {formData.learningOutcomes.map((outcome, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-medium text-primary-700">
                    {index + 1}
                  </span>
                  <input
                    type="text"
                    placeholder={`e.g., ${index === 0 ? 'Understand the rules of Tajweed' : 'Apply proper pronunciation in recitation'}`}
                    value={outcome}
                    onChange={(e) => {
                      const updated = [...formData.learningOutcomes];
                      updated[index] = e.target.value;
                      setFormData((prev) => ({ ...prev, learningOutcomes: updated }));
                    }}
                    className="flex-1 rounded-lg border border-charcoal-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                  />
                  {formData.learningOutcomes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        const updated = formData.learningOutcomes.filter((_, i) => i !== index);
                        setFormData((prev) => ({ ...prev, learningOutcomes: updated }));
                      }}
                      className="shrink-0 rounded p-1 text-charcoal-400 hover:bg-charcoal-50 hover:text-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <p className="mt-1.5 text-xs text-charcoal-500">What will students be able to do after completing this course?</p>
          </div>
        </div>
      </div>

      {/* Cover Image Section */}
      <div className="rounded-lg border border-charcoal-200 bg-white p-6">
        <h2 className="mb-4 text-xl font-semibold text-charcoal-900">
          Cover Image
        </h2>

        {coverImagePreview ? (
          <div className="relative">
            <div className="relative h-64 overflow-hidden rounded-lg">
              <Image
                src={coverImagePreview}
                alt="Cover preview"
                fill
                className="object-cover"
              />
            </div>
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute right-2 top-2 rounded-full bg-red-600 p-2 text-white transition-colors hover:bg-red-700"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <CourseImageDropzone
            onFileSelect={handleImageUpload}
            error={errors.coverImage}
          />
        )}
      </div>

      {/* Publishing Section */}
      <div className="rounded-lg border border-charcoal-200 bg-white p-6">
        <h2 className="mb-4 text-xl font-semibold text-charcoal-900">
          Publishing Settings
        </h2>

        <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-charcoal-200 p-4 transition-colors hover:bg-charcoal-50">
          <input
            type="checkbox"
            checked={formData.isPublished}
            onChange={(e) => handleInputChange('isPublished', e.target.checked)}
            className="h-[18px] w-[18px] rounded border-charcoal-300 text-primary-600 focus:ring-2 focus:ring-primary-500"
          />
          <div>
            <p className="text-sm font-medium text-charcoal-900">
              Publish course immediately
            </p>
            <p className="text-xs text-charcoal-600">
              Make this course visible to students. You can also save as draft and publish later.
            </p>
          </div>
        </label>
      </div>

      {/* Form Actions */}
      <div className="flex items-center justify-end space-x-3 border-t border-charcoal-200 pt-6">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {initialData ? 'Update Course' : 'Create Course'}
        </Button>
      </div>
    </form>
  );
}
