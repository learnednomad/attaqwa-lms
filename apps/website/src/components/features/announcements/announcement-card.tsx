import { format } from 'date-fns';
import { Clock } from 'lucide-react';
import { Announcement } from '@/types';
import { cn } from '@/lib/utils';

interface AnnouncementCardProps {
  announcement: Announcement;
  className?: string;
  compact?: boolean;
}

export function AnnouncementCard({
  announcement,
  className,
  compact = false,
}: AnnouncementCardProps) {
  const monthAbbrev = format(announcement.date, 'MMM').toUpperCase();
  const dayNumber = format(announcement.date, 'd');

  // Strip HTML tags for plain text preview
  const plainTextContent = announcement.content.replace(/<[^>]*>/g, '');

  return (
    <div
      className={cn(
        'flex bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden',
        className
      )}
    >
      {/* Left accent border */}
      <div className="w-1 bg-emerald-500 flex-shrink-0" />

      {/* Date block */}
      <div className="flex flex-col items-center justify-center px-4 py-4 border-r border-gray-100 min-w-[70px]">
        <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wide">
          {monthAbbrev}
        </span>
        <span className="text-2xl font-bold text-gray-900">{dayNumber}</span>
      </div>

      {/* Content */}
      <div className="flex-1 p-4">
        <h3 className="font-semibold text-gray-900 leading-tight">
          {announcement.title}
        </h3>

        {announcement.time && (
          <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-1.5">
            <Clock className="w-4 h-4" />
            <span className="font-medium">{announcement.time}</span>
          </div>
        )}

        <p
          className={cn(
            'text-gray-600 mt-2 text-sm leading-relaxed',
            compact ? 'line-clamp-2' : 'line-clamp-3'
          )}
        >
          {plainTextContent}
        </p>
      </div>
    </div>
  );
}
