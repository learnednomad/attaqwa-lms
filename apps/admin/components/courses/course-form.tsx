/**
 * Course Form Component
 * Reusable form for creating and editing courses
 */

'use client';

import { Upload, X } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Course, CourseCategory, CourseDifficulty } from '@attaqwa/shared-types';

export interface CourseFormProps {
  initialData?: Partial<Course>;
  onSubmit: (data: CourseFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export interface CourseFormData {
  title: string;
  description: string;
  category: CourseCategory;
  difficulty: CourseDifficulty;
  ageTier: string;
  coverImage?: File | string;
  duration?: number;
  isPublished: boolean;
}

export function CourseForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: CourseFormProps) {
  const [formData, setFormData] = useState<CourseFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    category: initialData?.category || 'general',
    difficulty: initialData?.difficulty || 'beginner',
    ageTier: initialData?.ageTier || 'all',
    coverImage: initialData?.coverImage?.url || undefined,
    duration: initialData?.estimatedDuration || 0,
    isPublished: initialData?.isPublished || false,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CourseFormData, string>>>({});
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(
    initialData?.coverImage?.url || null
  );

  const categories: { value: CourseCategory; label: string }[] = [
    { value: 'quran', label: 'Quran Studies' },
    { value: 'hadith', label: 'Hadith Studies' },
    { value: 'fiqh', label: 'Islamic Jurisprudence (Fiqh)' },
    { value: 'seerah', label: 'Prophet\'s Biography (Seerah)' },
    { value: 'aqeedah', label: 'Islamic Creed (Aqeedah)' },
    { value: 'general', label: 'General Islamic Studies' },
  ];

  const difficulties: { value: CourseDifficulty; label: string }[] = [
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
            <label className="mb-1.5 block text-sm font-medium text-charcoal-700">
              Description
              <span className="text-red-500">*</span>
            </label>
            <textarea
              placeholder="Provide a detailed description of the course content and objectives..."
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={5}
              className={`w-full rounded-lg border px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 ${
                errors.description
                  ? 'border-red-500'
                  : 'border-charcoal-300'
              }`}
            />
            {errors.description && (
              <p className="mt-1 text-xs text-red-600">{errors.description}</p>
            )}
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
                  handleInputChange('category', e.target.value as CourseCategory)
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
                  handleInputChange('difficulty', e.target.value as CourseDifficulty)
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
          <div className="rounded-lg border-2 border-dashed border-charcoal-300 p-8 text-center">
            <Upload className="mx-auto h-12 w-12 text-charcoal-400" />
            <p className="mt-2 text-sm text-charcoal-600">
              Upload a cover image for your course
            </p>
            <p className="mt-1 text-xs text-charcoal-500">
              PNG, JPG up to 5MB
            </p>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="mt-4"
            />
            {errors.coverImage && (
              <p className="mt-2 text-xs text-red-600">{errors.coverImage}</p>
            )}
          </div>
        )}
      </div>

      {/* Publishing Section */}
      <div className="rounded-lg border border-charcoal-200 bg-white p-6">
        <h2 className="mb-4 text-xl font-semibold text-charcoal-900">
          Publishing Settings
        </h2>

        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={formData.isPublished}
            onChange={(e) => handleInputChange('isPublished', e.target.checked)}
            className="h-4 w-4 rounded border-charcoal-300 text-primary-600 focus:ring-2 focus:ring-primary-500"
          />
          <div>
            <p className="text-sm font-medium text-charcoal-900">
              Publish course immediately
            </p>
            <p className="text-xs text-charcoal-600">
              Make this course visible to students
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
