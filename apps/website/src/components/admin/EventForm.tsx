'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Event } from '@/types';

// TODO: Move to @attaqwa/shared in Epic 2
const createEventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  date: z.string().min(1, 'Date is required'),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  location: z.string().optional(),
  isIndoor: z.boolean(),
  isOutdoor: z.boolean(),
  imageUrl: z.string().optional(),
  imageAlt: z.string().optional(),
});

type CreateEventInput = z.infer<typeof createEventSchema>;
import { useCreateEvent, useUpdateEvent } from '@/lib/hooks/useEvents';
import { useRouter } from 'next/navigation';

interface EventFormProps {
  event?: Event;
  onSuccess?: () => void;
}

export function EventForm({ event, onSuccess }: EventFormProps) {
  const router = useRouter();
  const isEditing = !!event;
  
  const createMutation = useCreateEvent();
  const updateMutation = useUpdateEvent();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateEventInput>({
    // TODO: Re-enable Zod validation in Epic 2 - temporarily disabled due to type recursion issues
    // resolver: zodResolver(createEventSchema),
    defaultValues: event ? {
      title: event.title,
      description: event.description,
      date: event.date,
      startTime: event.startTime || '',
      endTime: event.endTime || '',
      location: event.location || '',
      isIndoor: event.isIndoor,
      isOutdoor: event.isOutdoor,
      imageUrl: event.imageUrl || '',
      imageAlt: event.imageAlt || '',
    } : {
      title: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      startTime: '',
      endTime: '',
      location: '',
      isIndoor: false,
      isOutdoor: false,
      imageUrl: '',
      imageAlt: '',
    },
  });

  const onSubmit = async (data: CreateEventInput) => {
    try {
      const eventData = {
        ...data,
        isActive: true,
      };

      if (isEditing) {
        await updateMutation.mutateAsync({
          id: event.id,
          data: eventData,
        });
      } else {
        await createMutation.mutateAsync(eventData);
      }
      
      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/admin/events');
      }
    } catch (error) {
      console.error('Error saving event:', error);
    }
  };

  const mutation = isEditing ? updateMutation : createMutation;

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>
          {isEditing ? 'Edit Event' : 'Create New Event'}
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
              placeholder="Enter event title"
              className={errors.title ? 'border-red-500' : ''}
            />
            {errors.title && (
              <p className="text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Enter event description"
              rows={4}
              className={errors.description ? 'border-red-500' : ''}
            />
            {errors.description && (
              <p className="text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date">Event Date *</Label>
            <Input
              id="date"
              type="date"
              {...register('date')}
              className={errors.date ? 'border-red-500' : ''}
            />
            <p className="text-xs text-muted-foreground">Defaults to today</p>
            {errors.date && (
              <p className="text-sm text-red-600">{errors.date.message}</p>
            )}
          </div>

          {/* Time Range */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                type="time"
                {...register('startTime')}
                className={errors.startTime ? 'border-red-500' : ''}
              />
              <p className="text-xs text-muted-foreground">Optional</p>
              {errors.startTime && (
                <p className="text-sm text-red-600">{errors.startTime.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime">End Time</Label>
              <Input
                id="endTime"
                type="time"
                {...register('endTime')}
                className={errors.endTime ? 'border-red-500' : ''}
              />
              <p className="text-xs text-muted-foreground">Optional</p>
              {errors.endTime && (
                <p className="text-sm text-red-600">{errors.endTime.message}</p>
              )}
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              {...register('location')}
              placeholder="Event location"
            />
          </div>

          {/* Location Type */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Location Type</Label>
            <div className="flex space-x-6">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isIndoor"
                  {...register('isIndoor')}
                  className="rounded border-gray-300 text-islamic-green-600 focus:ring-islamic-green-500"
                />
                <Label htmlFor="isIndoor" className="text-sm font-medium">
                  Indoor
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isOutdoor"
                  {...register('isOutdoor')}
                  className="rounded border-gray-300 text-islamic-green-600 focus:ring-islamic-green-500"
                />
                <Label htmlFor="isOutdoor" className="text-sm font-medium">
                  Outdoor
                </Label>
              </div>
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

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/admin/events')}
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
                ? 'Update Event'
                : 'Create Event'}
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