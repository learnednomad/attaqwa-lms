import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { PaginationMeta } from '@/types/hadith';

export function HadithPagination({
  pagination,
  basePath,
}: {
  pagination: PaginationMeta;
  basePath: string;
}) {
  if (pagination.last_page <= 1) return null;

  const prevPage = pagination.current_page > 1 ? pagination.current_page - 1 : null;
  const nextPage =
    pagination.current_page < pagination.last_page ? pagination.current_page + 1 : null;

  return (
    <div className="flex items-center justify-between">
      <p className="text-xs text-neutral-400">
        Page {pagination.current_page} of {pagination.last_page}
      </p>
      <div className="flex items-center gap-2">
        {prevPage ? (
          <Link
            href={`${basePath}?page=${prevPage}`}
            className="flex items-center gap-1 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 hover:border-emerald-300 transition-colors"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            Previous
          </Link>
        ) : (
          <span className="flex items-center gap-1 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-400 opacity-40 cursor-not-allowed">
            <ChevronLeft className="h-3.5 w-3.5" />
            Previous
          </span>
        )}
        {nextPage ? (
          <Link
            href={`${basePath}?page=${nextPage}`}
            className="flex items-center gap-1 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 hover:border-emerald-300 transition-colors"
          >
            Next
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        ) : (
          <span className="flex items-center gap-1 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-400 opacity-40 cursor-not-allowed">
            Next
            <ChevronRight className="h-3.5 w-3.5" />
          </span>
        )}
      </div>
    </div>
  );
}
