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
        'flex rounded-xl border border-neutral-200 bg-white overflow-hidden',
        announcement.isArchived && 'opacity-70',
        className
      )}
    >
      {/* Date block */}
      <div className="flex flex-col items-center justify-center px-5 py-5 border-r border-neutral-100 min-w-[72px] bg-neutral-50">
        <span className="text-[10px] font-semibold text-emerald-600 uppercase tracking-widest">
          {monthAbbrev}
        </span>
        <span className="text-2xl font-bold text-neutral-900 tabular-nums leading-tight">
          {dayNumber}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 p-5">
        <h3 className="text-sm font-semibold text-neutral-900 leading-snug">
          {announcement.title}
        </h3>

        {announcement.time && (
          <div className="flex items-center gap-1.5 text-xs text-neutral-500 mt-1.5">
            <Clock className="w-3 h-3 text-neutral-400" />
            <span className="font-medium text-neutral-600">{announcement.time}</span>
          </div>
        )}

        <p
          className={cn(
            'text-sm text-neutral-500 mt-2 leading-relaxed',
            compact ? 'line-clamp-2' : 'line-clamp-3'
          )}
        >
          {plainTextContent}
        </p>
      </div>
    </div>
  );
}
