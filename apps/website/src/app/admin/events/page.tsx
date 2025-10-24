'use client';

import { useState } from 'react';
import { useEvents, useDeleteEvent } from '@/lib/hooks/useEvents';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Calendar, MapPin, Clock, Eye } from 'lucide-react';
import Link from 'next/link';
import { formatDate, formatTime, truncateText } from '@attaqwa/shared';

export default function EventsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all');
  
  const { data, isLoading, error } = useEvents({
    page: currentPage,
    limit: 10,
    ...(filter === 'upcoming' && { upcoming: true }),
    ...(filter === 'past' && { upcoming: false }),
  });

  const deleteMutation = useDeleteEvent();

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (error) {
        console.error('Delete error:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Events</h1>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-islamic-green-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Events</h1>
        </div>
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-red-600">
              Error loading events: {error.message}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const events = data?.data || [];
  const pagination = data?.pagination;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Events</h1>
        <Button asChild className="bg-islamic-green-600 hover:bg-islamic-green-700">
          <Link href="/admin/events/new">
            <Plus className="w-4 h-4 mr-2" />
            Create New
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex space-x-2">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('all')}
        >
          All Events
        </Button>
        <Button
          variant={filter === 'upcoming' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('upcoming')}
        >
          <Calendar className="w-4 h-4 mr-1" />
          Upcoming
        </Button>
        <Button
          variant={filter === 'past' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('past')}
        >
          Past Events
        </Button>
      </div>

      {/* Events List */}
      <Card>
        <CardHeader>
          <CardTitle>
            {pagination && `${pagination.total} Total Events`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {events.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No events found.</p>
              <Button asChild>
                <Link href="/admin/events/new">Create your first event</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {events.map((event) => {
                const eventDate = new Date(event.date);
                const isUpcoming = eventDate > new Date();
                
                return (
                  <div
                    key={event.id}
                    className="flex items-start justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-semibold text-gray-900">{event.title}</h3>
                        <div className="flex items-center space-x-2">
                          <Badge
                            variant={isUpcoming ? 'default' : 'secondary'}
                            className={
                              isUpcoming
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800'
                            }
                          >
                            {isUpcoming ? 'Upcoming' : 'Past'}
                          </Badge>
                          <Badge
                            variant={event.isActive ? 'default' : 'secondary'}
                            className={
                              event.isActive
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }
                          >
                            {event.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 text-sm">
                        {truncateText(event.description, 150)}
                      </p>
                      
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {formatDate(eventDate)}
                        </span>
                        {event.startTime && (
                          <span className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {formatTime(event.startTime)}
                            {event.endTime && ` - ${formatTime(event.endTime)}`}
                          </span>
                        )}
                        {event.location && (
                          <span className="flex items-center">
                            <MapPin className="w-3 h-3 mr-1" />
                            {event.location}
                          </span>
                        )}
                        {event.isIndoor && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
                            Indoor
                          </span>
                        )}
                        {event.isOutdoor && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded">
                            Outdoor
                          </span>
                        )}
                        {event.imageUrl && (
                          <span className="flex items-center">
                            <Eye className="w-3 h-3 mr-1" />
                            Has Image
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/admin/events/${event.id}/edit`}>
                          <Edit className="w-4 h-4" />
                        </Link>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(event.id, event.title)}
                        disabled={deleteMutation.isPending}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage <= 1}
          >
            Previous
          </Button>
          
          <span className="text-sm text-gray-600 px-3">
            Page {currentPage} of {pagination.totalPages}
          </span>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.min(pagination.totalPages, currentPage + 1))}
            disabled={currentPage >= pagination.totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}