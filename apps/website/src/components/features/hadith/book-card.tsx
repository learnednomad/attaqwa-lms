import Link from 'next/link';
import { BookOpen } from 'lucide-react';
import type { HadithBook } from '@/types/hadith';

export function BookCard({ book }: { book: HadithBook }) {
  return (
    <Link
      href={`/resources/hadith-collections/${book.bookSlug}`}
      className="group rounded-xl border border-neutral-200 bg-white p-5 transition-colors hover:border-emerald-300 hover:bg-emerald-50/30"
    >
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
          <BookOpen className="h-4 w-4 text-emerald-600" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-neutral-900 leading-tight group-hover:text-emerald-700 transition-colors">
            {book.bookName}
          </p>
          <p className="text-[10px] text-neutral-500 mt-0.5">{book.writerName}</p>
        </div>
      </div>
      <div className="flex items-center gap-3 mt-3 pt-3 border-t border-neutral-100">
        <span className="text-[10px] text-neutral-400">
          {Number(book.hadiths_count).toLocaleString()} hadiths
        </span>
        <span className="text-[10px] text-neutral-400">
          {Number(book.chapters_count)} chapters
        </span>
      </div>
    </Link>
  );
}
