import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import type { HadithChapter } from '@/types/hadith';

export function ChapterCard({
  chapter,
  bookSlug,
}: {
  chapter: HadithChapter;
  bookSlug: string;
}) {
  return (
    <Link
      href={`/resources/hadith-collections/${bookSlug}/${chapter.chapterNumber}`}
      className="group rounded-xl border border-neutral-200 bg-white p-4 transition-colors hover:border-emerald-300 hover:bg-emerald-50/30"
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="w-7 h-7 rounded-lg bg-neutral-50 border border-neutral-100 flex items-center justify-center shrink-0">
          <span className="text-xs font-semibold text-neutral-600">{chapter.chapterNumber}</span>
        </div>
        <ChevronRight className="h-3.5 w-3.5 text-neutral-300 group-hover:text-emerald-500 shrink-0 ml-auto transition-colors" />
      </div>
      <p className="text-sm font-medium text-neutral-900 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug">
        {chapter.chapterEnglish}
      </p>
      {chapter.chapterArabic && (
        <p className="text-xs text-neutral-400 font-arabic mt-1.5 line-clamp-1" dir="rtl">
          {chapter.chapterArabic}
        </p>
      )}
    </Link>
  );
}
