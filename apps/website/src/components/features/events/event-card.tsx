import { format } from 'date-fns';
import { Clock, MapPin, DollarSign } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Event } from '@/types';
import { cn } from '@/lib/utils';

interface EventCardProps {
  event: Event;
  className?: string;
  showPrayerTimes?: boolean;
}

export function EventCard({
  event,
  className,
  showPrayerTimes = true,
}: EventCardProps) {
  const monthAbbrev = format(event.date, 'MMM').toUpperCase();
  const dayNumber = format(event.date, 'd');

  const timeRange = event.startTime
    ? event.endTime
      ? `${event.startTime} - ${event.endTime}`
      : event.startTime
    : null;

  return (
    <div
      className={cn(
        'flex bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden',
        className
      )}
    >
      {/* Left accent border */}
      <div className="w-1 bg-amber-500 flex-shrink-0" />

      {/* Date block */}
      <div className="flex flex-col items-center justify-center px-4 py-4 border-r border-gray-100 min-w-[70px]">
        <span className="text-xs font-semibold text-amber-600 uppercase tracking-wide">
          {monthAbbrev}
        </span>
        <span className="text-2xl font-bold text-gray-900">{dayNumber}</span>
      </div>

      {/* Content */}
      <div className="flex-1 p-4">
        <h3 className="font-semibold text-gray-900 leading-tight">
          {event.title}
        </h3>

        {/* Location and time info */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500 mt-1.5">
          {event.location && (
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {event.location}
            </span>
          )}
          {timeRange && (
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span className="font-medium">{timeRange}</span>
            </span>
          )}
        </div>

        {/* Description */}
        {event.description && (
          <p className="text-gray-600 mt-2 text-sm leading-relaxed line-clamp-2">
            {event.description}
          </p>
        )}

        {/* Prayer times as pills */}
        {showPrayerTimes && event.prayerTimes && event.prayerTimes.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {event.prayerTimes.map((prayer, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium"
              >
                {prayer.name}: {prayer.time}
              </span>
            ))}
            {/* Indoor/Outdoor badges */}
            {event.isIndoor && (
              <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                Indoor
              </span>
            )}
            {event.isOutdoor && (
              <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                Outdoor
              </span>
            )}
          </div>
        )}

        {/* Zakat info */}
        {event.zakatInfo && (
          <div className="mt-3 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg inline-flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-amber-700" />
            <span className="text-amber-800 font-medium text-sm">
              Zakat ul Fitr: {event.zakatInfo.currency} ${event.zakatInfo.amount}
              {event.zakatInfo.description && ` - ${event.zakatInfo.description}`}
            </span>
          </div>
        )}

        {/* Past event indicator */}
        {!event.isActive && (
          <div className="mt-3">
            <Badge variant="secondary" className="text-xs">
              Past Event
            </Badge>
          </div>
        )}
      </div>
    </div>
  );
}
