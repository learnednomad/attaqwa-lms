import { format } from 'date-fns';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar, Clock, MapPin } from 'lucide-react';
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
  compact = false 
}: AnnouncementCardProps) {
  const formattedDate = format(announcement.date, 'MMMM dd, yyyy');

  return (
    <Card className={cn('overflow-hidden transition-shadow hover:shadow-md', className)}>
      {announcement.imageUrl && !compact && (
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={announcement.imageUrl}
            alt={announcement.imageAlt || announcement.title}
            fill
            className="object-cover transition-transform hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}
      
      <CardHeader className={cn('pb-2', compact && 'pb-1')}>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className={cn(
            'text-lg font-semibold leading-tight text-islamic-navy-800',
            compact && 'text-base'
          )}>
            {announcement.title}
          </CardTitle>
          {!announcement.isActive && (
            <Badge variant="secondary" className="text-xs">
              Archived
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{formattedDate}</span>
          </div>
          {announcement.time && (
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span className="prayer-time">{announcement.time}</span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className={cn('pt-0', compact && 'pb-3')}>
        <div 
          className={cn(
            'prose prose-sm max-w-none text-gray-700',
            compact && 'line-clamp-2'
          )}
          dangerouslySetInnerHTML={{ __html: announcement.content }}
        />
        
        {announcement.imageUrl && compact && (
          <>
            <Separator className="my-3" />
            <div className="relative h-24 w-full overflow-hidden rounded-md">
              <Image
                src={announcement.imageUrl}
                alt={announcement.imageAlt || announcement.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}