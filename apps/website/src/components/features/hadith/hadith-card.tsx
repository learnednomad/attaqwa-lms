import { Hash, User, BookOpen } from 'lucide-react';
import type { HadithEntry } from '@/types/hadith';

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}

function GradeBadge({ status }: { status: string }) {
  const colors =
    status === 'Sahih'
      ? 'text-emerald-700 border-emerald-200 bg-emerald-50'
      : status === 'Hasan'
        ? 'text-amber-700 border-amber-200 bg-amber-50'
        : 'text-neutral-600 border-neutral-200 bg-neutral-50';

  return (
    <span className={`text-[10px] font-medium rounded-full px-2 py-0.5 border ${colors}`}>
      {status}
    </span>
  );
}

export function HadithCard({ hadith }: { hadith: HadithEntry }) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5">
      {/* Header Row */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-neutral-50 border border-neutral-100 flex items-center justify-center">
            <Hash className="h-3.5 w-3.5 text-neutral-500" />
          </div>
          <span className="text-sm font-semibold text-neutral-900">
            Hadith {hadith.hadithNumber}
          </span>
          {hadith.chapter?.chapterEnglish && (
            <span className="text-xs text-neutral-400 hidden sm:inline">
              &middot; {hadith.chapter.chapterEnglish}
            </span>
          )}
        </div>
        {hadith.status && <GradeBadge status={hadith.status} />}
      </div>

      {/* Heading */}
      {hadith.headingEnglish && (
        <p className="text-xs font-semibold text-neutral-700 mb-3">
          {stripHtml(hadith.headingEnglish)}
        </p>
      )}

      {/* Arabic Text */}
      {hadith.hadithArabic && (
        <div className="rounded-lg bg-neutral-50 border border-neutral-100 p-4 mb-4">
          <p className="text-base leading-[2] font-arabic text-neutral-800 text-right" dir="rtl">
            {hadith.hadithArabic}
          </p>
        </div>
      )}

      {/* English Translation */}
      {hadith.hadithEnglish && (
        <div className="mb-4">
          <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wide mb-1">
            Translation
          </p>
          <p className="text-sm text-neutral-700 leading-relaxed">
            {stripHtml(hadith.hadithEnglish)}
          </p>
        </div>
      )}

      {/* Footer: Narrator + Reference */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-3 border-t border-neutral-100">
        {hadith.englishNarrator && (
          <div className="flex items-center gap-1.5 text-xs text-neutral-500">
            <User className="h-3 w-3 shrink-0" />
            <span>{stripHtml(hadith.englishNarrator)}</span>
          </div>
        )}
        <div className="flex items-center gap-1.5 text-xs text-neutral-400">
          <BookOpen className="h-3 w-3 shrink-0" />
          <span>
            {hadith.book?.bookName} #{hadith.hadithNumber}
          </span>
        </div>
      </div>
    </div>
  );
}
