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
}

export function CalendarDownload({ 
  calendar, 
  className, 
  compact = false 
}: CalendarDownloadProps) {
  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
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

  if (compact) {
    return (
      <div className={cn('flex items-center justify-between rounded-lg border p-3', className)}>
        <div className="flex items-center gap-3">
          <div className="rounded-md bg-islamic-green-100 p-2">
            <FileText className="h-4 w-4 text-islamic-green-600" />
          </div>
          <div>
            <h4 className="font-medium text-sm">{calendar.title}</h4>
            <p className="text-xs text-muted-foreground">
              {formatFileSize(calendar.fileSize)} • PDF
            </p>
          </div>
        </div>
        <Button size="sm" onClick={handleDownload} className="gap-1">
          <Download className="h-3 w-3" />
          Download
        </Button>
      </div>
    );
  }

  return (
    <Card className={cn('transition-shadow hover:shadow-md', className)}>
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
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs">
                  {calendar.year}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {formatFileSize(calendar.fileSize)}
                </span>
              </div>
            </div>
          </div>
          {!calendar.isActive && (
            <Badge variant="secondary">Archived</Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {calendar.description && (
          <p className="text-sm text-gray-600">{calendar.description}</p>
        )}
        
        <div className="flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            PDF Document • Available for download
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