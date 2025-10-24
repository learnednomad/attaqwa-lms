import { format } from 'date-fns';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar, Clock, MapPin, DollarSign } from 'lucide-react';
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
  showPrayerTimes = true 
}: EventCardProps) {
  const formattedDate = format(event.date, 'MMMM dd, yyyy');
  const eventDay = format(event.date, 'EEEE');

  const getEventTypeColor = (title: string) => {
    const titleLower = title.toLowerCase();
    if (titleLower.includes('eid')) return 'bg-islamic-gold-500 text-white';
    if (titleLower.includes('ramadan')) return 'bg-islamic-green-600 text-white';
    if (titleLower.includes('graduation')) return 'bg-islamic-navy-600 text-white';
    return 'bg-primary text-primary-foreground';
  };

  return (
    <Card className={cn('overflow-hidden transition-shadow hover:shadow-lg', className)}>
      {event.imageUrl && (
        <div className="relative h-56 w-full overflow-hidden">
          <Image
            src={event.imageUrl}
            alt={event.imageAlt || event.title}
            fill
            className="object-cover transition-transform hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}
      
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-xl font-bold leading-tight text-islamic-navy-800">
            {event.title}
          </CardTitle>
          <Badge className={getEventTypeColor(event.title)}>
            {eventDay}
          </Badge>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{formattedDate}</span>
          </div>
          
          {(event.startTime || event.endTime) && (
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span className="prayer-time">
                {event.startTime}
                {event.endTime && ` - ${event.endTime}`}
              </span>
            </div>
          )}
          
          {event.location && (
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{event.location}</span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="prose prose-sm max-w-none text-gray-700">
          {event.description}
        </div>

        {/* Prayer Times Section */}
        {showPrayerTimes && event.prayerTimes && event.prayerTimes.length > 0 && (
          <>
            <Separator />
            <div>
              <h4 className="mb-2 font-semibold text-islamic-green-700">Prayer Times</h4>
              <div className="grid gap-2 sm:grid-cols-2">
                {event.prayerTimes.map((prayer, index) => (
                  <div key={index} className="flex items-center justify-between rounded-lg bg-islamic-green-50 p-2">
                    <span className="font-medium text-islamic-green-800">{prayer.name}</span>
                    <span className="prayer-time font-bold text-islamic-green-700">{prayer.time}</span>
                  </div>
                ))}
              </div>
              
              {(event.isIndoor || event.isOutdoor) && (
                <div className="mt-2 flex gap-2">
                  {event.isIndoor && (
                    <Badge variant="outline" className="text-xs">
                      Indoor Available
                    </Badge>
                  )}
                  {event.isOutdoor && (
                    <Badge variant="outline" className="text-xs">
                      Outdoor Prayer
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </>
        )}

        {/* Zakat Information */}
        {event.zakatInfo && (
          <>
            <Separator />
            <div className="rounded-lg bg-islamic-gold-50 p-3">
              <div className="flex items-center gap-2 text-islamic-gold-800">
                <DollarSign className="h-4 w-4" />
                <h4 className="font-semibold">Zakat Information</h4>
              </div>
              <div className="mt-1 text-sm text-islamic-gold-700">
                <span className="font-bold">
                  {event.zakatInfo.currency} ${event.zakatInfo.amount}
                </span>
                {event.zakatInfo.description && (
                  <span className="ml-1">- {event.zakatInfo.description}</span>
                )}
              </div>
            </div>
          </>
        )}

        {/* Status indicators */}
        <div className="flex justify-between items-center">
          {!event.isActive && (
            <Badge variant="secondary">Past Event</Badge>
          )}
          <div className="text-xs text-muted-foreground">
            Updated {format(event.updatedAt, 'MMM dd, yyyy')}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}