'use client';

import { useEvent } from '@/lib/hooks/useEvents';
import { EventForm } from '@/components/admin/EventForm';
import { Card, CardContent } from '@/components/ui/card';
import { useParams } from 'next/navigation';

export default function EditEventPage() {
  const params = useParams();
  const id = params.id as string;
  
  const { data, isLoading, error } = useEvent(id);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Event</h1>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-islamic-green-600"></div>
        </div>
      </div>
    );
  }

  if (error || !data?.data) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Event</h1>
        </div>
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-red-600">
              {error?.message || 'Event not found'}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Edit Event</h1>
        <p className="text-gray-600 mt-2">
          Update the event details below.
        </p>
      </div>
      
      <EventForm event={data.data} />
    </div>
  );
}