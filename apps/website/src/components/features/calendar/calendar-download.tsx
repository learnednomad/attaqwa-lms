'use client';

import { Download, FileText, Calendar as CalendarIcon } from 'lucide-react';
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

  // Featured card
  if (featured) {
    return (
      <div className={cn('rounded-xl border border-neutral-200 bg-white p-6', className)}>
        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
              <CalendarIcon className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-neutral-900">
                {calendar.title}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] font-medium text-neutral-500 border border-neutral-200 rounded px-1.5 py-0.5">
                  {calendar.year}
                </span>
                <span className="text-xs text-neutral-400">
                  {formatFileSize(calendar.fileSize)} &middot; PDF
                </span>
              </div>
            </div>
          </div>
          {calendar.description && (
            <p className="text-sm text-neutral-500 leading-relaxed line-clamp-3">
              {calendar.description}
            </p>
          )}
          <button
            onClick={handleDownload}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white"
          >
            <Download className="h-3.5 w-3.5" />
            Download Calendar
          </button>
        </div>
      </div>
    );
  }

  // Compact row
  if (compact) {
    return (
      <div
        className={cn(
          'flex items-center justify-between px-4 py-3.5',
          index > 0 && 'border-t border-neutral-100',
          archived && 'opacity-70',
          className
        )}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-neutral-50 border border-neutral-100 flex items-center justify-center">
            <FileText className="h-4 w-4 text-neutral-400" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-neutral-900">{calendar.title}</h4>
            <p className="text-xs text-neutral-400">
              {formatFileSize(calendar.fileSize)} &middot; PDF
            </p>
          </div>
        </div>
        <button
          onClick={handleDownload}
          className="flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700"
        >
          <Download className="h-3 w-3" />
          Download
        </button>
      </div>
    );
  }

  // Regular card
  return (
    <div className={cn('rounded-xl border border-neutral-200 bg-white p-5', className)}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
            <CalendarIcon className="h-4 w-4 text-emerald-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-neutral-900">{calendar.title}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] font-medium text-neutral-500 border border-neutral-200 rounded px-1.5 py-0.5">
                {calendar.year}
              </span>
              <span className="text-xs text-neutral-400">{formatFileSize(calendar.fileSize)}</span>
            </div>
          </div>
        </div>
        {!calendar.isActive && (
          <span className="text-[10px] font-medium text-neutral-400 uppercase tracking-wide">Archived</span>
        )}
      </div>

      {calendar.description && (
        <p className="text-sm text-neutral-500 mt-3 leading-relaxed">{calendar.description}</p>
      )}

      <div className="flex items-center justify-between mt-4">
        <span className="text-xs text-neutral-400">PDF Document</span>
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white"
        >
          <Download className="h-3.5 w-3.5" />
          Download
        </button>
      </div>
    </div>
  );
}
