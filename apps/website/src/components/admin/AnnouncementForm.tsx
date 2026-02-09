'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Announcement, AnnouncementCategory } from '@/types';

const createAnnouncementSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  category: z.enum(['general', 'ramadan', 'eid', 'urgent', 'community', 'fundraising']),
  imageUrl: z.string().optional(),
  imageAlt: z.string().optional(),
  pdfUrl: z.string().optional(),
  isPinned: z.boolean(),
  publishDate: z.string().optional(),
  expiryDate: z.string().optional(),
});

type CreateAnnouncementInput = z.infer<typeof createAnnouncementSchema>;
import { useCreateAnnouncement, useUpdateAnnouncement } from '@/lib/hooks/useAnnouncements';
import { useRouter } from 'next/navigation';

interface AnnouncementFormProps {
  announcement?: Announcement;
  onSuccess?: () => void;
}

export function AnnouncementForm({ announcement, onSuccess }: AnnouncementFormProps) {
  const router = useRouter();
  const isEditing = !!announcement;

  const createMutation = useCreateAnnouncement();
  const updateMutation = useUpdateAnnouncement();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<CreateAnnouncementInput>({
    defaultValues: announcement ? {
      title: announcement.title,
      content: announcement.content,
      category: announcement.category,
      imageUrl: announcement.imageUrl || '',
      imageAlt: announcement.imageAlt || '',
      pdfUrl: announcement.pdfUrl || '',
      isPinned: announcement.isPinned || false,
      publishDate: announcement.publishDate || '',
      expiryDate: announcement.expiryDate || '',
    } : {
      title: '',
      content: '',
      category: 'general',
      imageUrl: '',
      imageAlt: '',
      pdfUrl: '',
      isPinned: false,
      publishDate: new Date().toISOString().split('T')[0],
      expiryDate: '',
    },
  });

  const onSubmit = async (data: CreateAnnouncementInput) => {
    try {
      if (isEditing) {
        await updateMutation.mutateAsync({
          id: announcement.id,
          data: {
            ...data,
            publishDate: data.publishDate || undefined,
            expiryDate: data.expiryDate || undefined,
          },
        });
      } else {
        await createMutation.mutateAsync({
          ...data,
          isActive: true,
          publishDate: data.publishDate || undefined,
          expiryDate: data.expiryDate || undefined,
        });
      }

      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/admin/announcements');
      }
    } catch (error) {
      console.error('Error saving announcement:', error);
    }
  };

  const mutation = isEditing ? updateMutation : createMutation;

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>
          {isEditing ? 'Edit Announcement' : 'Create New Announcement'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              {...register('title')}
              placeholder="Enter announcement title"
              className={errors.title ? 'border-red-500' : ''}
            />
            {errors.title && (
              <p className="text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content">Content *</Label>
            <Textarea
              id="content"
              {...register('content')}
              placeholder="Enter announcement content (Markdown supported)"
              rows={6}
              className={errors.content ? 'border-red-500' : ''}
            />
            {errors.content && (
              <p className="text-sm text-red-600">{errors.content.message}</p>
            )}
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <select
              id="category"
              {...register('category')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-islamic-green-500"
            >
              <option value="general">General</option>
              <option value="ramadan">Ramadan</option>
              <option value="eid">Eid</option>
              <option value="urgent">Urgent</option>
              <option value="community">Community</option>
              <option value="fundraising">Fundraising</option>
            </select>
          </div>

          {/* Pinned Checkbox */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isPinned"
              {...register('isPinned')}
              className="rounded border-gray-300 text-islamic-green-600 focus:ring-islamic-green-500"
            />
            <Label htmlFor="isPinned" className="text-sm font-medium">
              Pin this announcement
            </Label>
          </div>

          {/* Publish & Expiry Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="publishDate">Publish Date</Label>
              <Input
                id="publishDate"
                type="date"
                {...register('publishDate')}
              />
              <p className="text-xs text-muted-foreground">Defaults to today</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="expiryDate">Expiry Date</Label>
              <Input
                id="expiryDate"
                type="date"
                {...register('expiryDate')}
              />
              <p className="text-xs text-muted-foreground">Leave blank for no expiry</p>
            </div>
          </div>

          {/* Image URL */}
          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input
              id="imageUrl"
              type="url"
              {...register('imageUrl')}
              placeholder="https://example.com/image.jpg"
              className={errors.imageUrl ? 'border-red-500' : ''}
            />
            {errors.imageUrl && (
              <p className="text-sm text-red-600">{errors.imageUrl.message}</p>
            )}
          </div>

          {/* Image Alt Text */}
          <div className="space-y-2">
            <Label htmlFor="imageAlt">Image Alt Text</Label>
            <Input
              id="imageAlt"
              {...register('imageAlt')}
              placeholder="Descriptive text for the image"
            />
          </div>

          {/* PDF URL */}
          <div className="space-y-2">
            <Label htmlFor="pdfUrl">PDF Attachment URL</Label>
            <Input
              id="pdfUrl"
              type="url"
              {...register('pdfUrl')}
              placeholder="https://example.com/document.pdf"
              className={errors.pdfUrl ? 'border-red-500' : ''}
            />
            {errors.pdfUrl && (
              <p className="text-sm text-red-600">{errors.pdfUrl.message}</p>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/admin/announcements')}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || mutation.isPending}
              className="bg-islamic-green-600 hover:bg-islamic-green-700"
            >
              {isSubmitting || mutation.isPending
                ? 'Saving...'
                : isEditing
                ? 'Update Announcement'
                : 'Create Announcement'}
            </Button>
          </div>

          {/* Error Message */}
          {mutation.error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              {mutation.error instanceof Error ? mutation.error.message : 'An error occurred'}
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
