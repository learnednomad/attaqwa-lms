import { format } from 'date-fns';
import { Clock, MapPin } from 'lucide-react';
import { Event } from '@/types';
import { cn } from '@/lib/utils';

interface EventCardProps {
  event: Event;
  className?: string;
}

export function EventCard({
  event,
  className,
}: EventCardProps) {
  const dateObj = new Date(event.date);
  const monthAbbrev = format(dateObj, 'MMM').toUpperCase();
  const dayNumber = format(dateObj, 'd');
  const isPast = dateObj < new Date();

  const timeRange = event.startTime
    ? event.endTime
      ? `${event.startTime} - ${event.endTime}`
      : event.startTime
    : null;

  return (
    <div
      className={cn(
        'flex rounded-xl border border-neutral-200 bg-white overflow-hidden',
        isPast && 'opacity-75',
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
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-sm font-semibold text-neutral-900 leading-snug">
            {event.title}
          </h3>
          {isPast && (
            <span className="text-[10px] font-medium text-neutral-400 uppercase tracking-wide shrink-0 mt-0.5">
              Past
            </span>
          )}
        </div>

        {/* Location and time */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutral-500 mt-1.5">
          {event.location && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-neutral-400" />
              {event.location}
            </span>
          )}
          {timeRange && (
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-neutral-400" />
              <span className="font-medium text-neutral-600">{timeRange}</span>
            </span>
          )}
        </div>

        {/* Description */}
        {event.description && (
          <p className="text-sm text-neutral-500 mt-2 leading-relaxed line-clamp-2">
            {event.description}
          </p>
        )}

        {/* Badges */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {event.isIndoor && (
            <span className="px-2.5 py-1 bg-neutral-100 text-neutral-500 rounded-md text-xs">
              Indoor
            </span>
          )}
          {event.isOutdoor && (
            <span className="px-2.5 py-1 bg-neutral-100 text-neutral-500 rounded-md text-xs">
              Outdoor
            </span>
          )}
          {event.category && (
            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-md text-xs font-medium capitalize">
              {event.category}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
