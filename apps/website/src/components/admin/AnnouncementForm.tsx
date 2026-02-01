'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Announcement } from '@/types';

// TODO: Move to @attaqwa/shared in Epic 2
const createAnnouncementSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  imageUrl: z.string().optional(),
  imageAlt: z.string().optional(),
  pdfUrl: z.string().optional(),
  isEvent: z.boolean(),
  eventDate: z.string().optional(),
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
    setValue,
  } = useForm<CreateAnnouncementInput>({
    // TODO: Re-enable Zod validation in Epic 2 - temporarily disabled due to type recursion issues
    // resolver: zodResolver(createAnnouncementSchema),
    defaultValues: announcement ? {
      title: announcement.title,
      content: announcement.content,
      imageUrl: announcement.imageUrl || '',
      imageAlt: announcement.imageAlt || '',
      pdfUrl: announcement.pdfUrl || '',
      isEvent: announcement.isEvent,
      eventDate: announcement.eventDate ? new Date(announcement.eventDate).toISOString().slice(0, 16) : '',
    } : {
      title: '',
      content: '',
      imageUrl: '',
      imageAlt: '',
      pdfUrl: '',
      isEvent: false,
      eventDate: '',
    },
  });

  const isEvent = watch('isEvent');

  const onSubmit = async (data: CreateAnnouncementInput) => {
    try {
      if (isEditing) {
        await updateMutation.mutateAsync({
          id: announcement.id,
          data: {
            ...data,
            eventDate: data.eventDate ? new Date(data.eventDate) : undefined,
          },
        });
      } else {
        await createMutation.mutateAsync({
          ...data,
          eventDate: data.eventDate ? new Date(data.eventDate) : undefined,
          date: new Date(),
          isActive: true,
          isArchived: false,
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

          {/* Is Event Checkbox */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isEvent"
              {...register('isEvent')}
              className="rounded border-gray-300 text-islamic-green-600 focus:ring-islamic-green-500"
            />
            <Label htmlFor="isEvent" className="text-sm font-medium">
              This is an event
            </Label>
          </div>

          {/* Event Date - Only show if isEvent is true */}
          {isEvent && (
            <div className="space-y-2">
              <Label htmlFor="eventDate">Event Date & Time</Label>
              <Input
                id="eventDate"
                type="datetime-local"
                {...register('eventDate')}
                className={errors.eventDate ? 'border-red-500' : ''}
              />
              {errors.eventDate && (
                <p className="text-sm text-red-600">{errors.eventDate.message}</p>
              )}
            </div>
          )}

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