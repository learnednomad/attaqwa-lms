'use client';

import { Download, FileText, Calendar as CalendarIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/types';
import { cn } from '@/lib/utils';

interface CalendarDownloadProps {
  calendar: Calendar;
  className?: string;
  compact?: boolean;
  featured?: boolean;
  archived?: boolean;
  index?: number;
}

export function CalendarDownload({
  calendar,
  className,
  compact = false,
  featured = false,
  archived = false,
  index = 0,
}: CalendarDownloadProps) {
  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = calendar.fileUrl;
    link.download = calendar.fileName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Featured card mode
  if (featured) {
    return (
      <div className={cn('card-premium p-6', className)}>
        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-islamic-green-500 to-islamic-green-700 shadow-lg">
              <CalendarIcon className="h-6 w-6 text-white" />
            </div>
            <div className="space-y-1">
              <h3
                className="text-lg font-semibold text-islamic-navy-800"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {calendar.title}
              </h3>
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="text-xs">
                  {calendar.year}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {formatFileSize(calendar.fileSize)} &middot; PDF
                </span>
              </div>
            </div>
          </div>
          {calendar.description && (
            <p className="text-sm leading-relaxed text-islamic-navy-600 line-clamp-3">
              {calendar.description}
            </p>
          )}
          <button
            onClick={handleDownload}
            className="btn-islamic-primary flex w-full items-center justify-center gap-2"
          >
            <Download className="h-4 w-4" />
            Download Calendar
          </button>
        </div>
      </div>
    );
  }

  // Compact row mode (for "All Available" and "Archived" lists)
  if (compact) {
    const isArchived = archived;
    const borderColor = isArchived ? 'border-l-islamic-navy-300' : 'border-l-islamic-green-500';
    const iconBg = isArchived ? 'bg-islamic-navy-100' : 'bg-islamic-green-100';
    const iconColor = isArchived ? 'text-islamic-navy-600' : 'text-islamic-green-600';
    const rowBg = index % 2 === 1 ? (isArchived ? 'bg-islamic-navy-50/30' : 'bg-islamic-green-50/30') : 'bg-white';

    return (
      <div
        className={cn(
          'flex items-center justify-between rounded-lg border-l-4 px-5 py-4',
          borderColor,
          rowBg,
          isArchived ? 'hover:bg-islamic-navy-50/50' : 'hover:bg-islamic-green-50/50',
          className
        )}
      >
        <div className="flex items-center gap-3">
          <div className={cn('rounded-md p-2', iconBg)}>
            <FileText className={cn('h-4 w-4', iconColor)} />
          </div>
          <div>
            <h4 className="text-sm font-medium text-islamic-navy-800">{calendar.title}</h4>
            <p className="text-xs text-muted-foreground">
              {formatFileSize(calendar.fileSize)} &middot; PDF
            </p>
          </div>
        </div>
        <Button
          size="sm"
          onClick={handleDownload}
          className="gap-1.5"
        >
          <Download className="h-3 w-3" />
          Download
        </Button>
      </div>
    );
  }

  // Regular card mode
  return (
    <Card
      className={cn(
        'hover:shadow-[var(--shadow-islamic)]',
        className
      )}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="rounded-md bg-islamic-green-100 p-2">
              <CalendarIcon className="h-5 w-5 text-islamic-green-600" />
            </div>
            <div>
              <CardTitle className="text-lg text-islamic-navy-800">
                {calendar.title}
              </CardTitle>
              <div className="mt-1 flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {calendar.year}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {formatFileSize(calendar.fileSize)}
                </span>
              </div>
            </div>
          </div>
          {!calendar.isActive && <Badge variant="secondary">Archived</Badge>}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {calendar.description && (
          <p className="text-sm text-gray-600">{calendar.description}</p>
        )}

        <div className="flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            PDF Document &middot; Available for download
          </div>
          <Button onClick={handleDownload} className="gap-2">
            <Download className="h-4 w-4" />
            Download Calendar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
