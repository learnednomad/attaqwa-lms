import { BookOpen, User } from 'lucide-react';
import type { HadithEntry } from '@/types/hadith';

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}

export function DailyHadith({ hadith }: { hadith: HadithEntry }) {
  return (
    <div className="rounded-xl border border-emerald-200 bg-emerald-50/30 p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-emerald-100 border border-emerald-200 flex items-center justify-center">
          <BookOpen className="h-4 w-4 text-emerald-600" />
        </div>
        <div>
          <p className="text-xs font-semibold text-neutral-900">
            {hadith.book?.bookName}
          </p>
          <p className="text-[10px] text-neutral-500">
            {hadith.chapter?.chapterEnglish &&
              `Chapter: ${hadith.chapter.chapterEnglish}`}
          </p>
        </div>
        {hadith.status && (
          <span className="ml-auto text-[10px] font-medium text-emerald-700 border border-emerald-200 bg-emerald-50 rounded-full px-2 py-0.5">
            {hadith.status}
          </span>
        )}
      </div>

      {hadith.hadithArabic && (
        <div className="rounded-lg bg-white border border-emerald-100 p-4 mb-4">
          <p
            className="text-lg leading-[2] font-arabic text-neutral-800 text-right"
            dir="rtl"
          >
            {hadith.hadithArabic}
          </p>
        </div>
      )}

      {hadith.hadithEnglish && (
        <p className="text-sm text-neutral-700 leading-relaxed mb-3">
          {stripHtml(hadith.hadithEnglish)}
        </p>
      )}

      {hadith.englishNarrator && (
        <div className="flex items-center gap-2 text-xs text-neutral-500">
          <User className="h-3.5 w-3.5" />
          <span>{stripHtml(hadith.englishNarrator)}</span>
        </div>
      )}
    </div>
  );
}
