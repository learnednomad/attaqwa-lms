'use client';

import { useState, useCallback, useEffect } from 'react';
import { ChevronLeft, ChevronRight, BookOpen, Loader2 } from 'lucide-react';

interface MushafPageAyah {
  number: number;
  numberInSurah: number;
  text: string;
  surahNumber: number;
  surahName: string;
  surahEnglishName: string;
  juz: number;
  hizbQuarter: number;
}

interface MushafPageData {
  pageNumber: number;
  ayahs: MushafPageAyah[];
  juz: number;
  surahs: { number: number; name: string; englishName: string }[];
}

const TOTAL_PAGES = 604;
const BISMILLAH = 'بِسۡمِ ٱللَّهِ ٱلرَّحۡمَـٰنِ ٱلرَّحِيمِ';

export function MushafPageViewer({ initialPage }: { initialPage: MushafPageData }) {
  const [page, setPage] = useState<MushafPageData>(initialPage);
  const [loading, setLoading] = useState(false);
  const [pageInput, setPageInput] = useState(String(initialPage.pageNumber));

  const fetchPage = useCallback(async (pageNum: number) => {
    if (pageNum < 1 || pageNum > TOTAL_PAGES) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/v1/mushaf?page=${pageNum}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const json = await res.json();
      setPage(json.data);
      setPageInput(String(pageNum));
    } catch (e) {
      console.error('[mushaf] Failed to load page', e);
    } finally {
      setLoading(false);
    }
  }, []);

  const goTo = useCallback(
    (num: number) => {
      const clamped = Math.max(1, Math.min(TOTAL_PAGES, num));
      if (clamped !== page.pageNumber) fetchPage(clamped);
    },
    [page.pageNumber, fetchPage]
  );

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goTo(page.pageNumber - 1); // RTL: right = previous
      if (e.key === 'ArrowLeft') goTo(page.pageNumber + 1);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [goTo, page.pageNumber]);

  // Group ayahs by surah for rendering surah headers
  const groupedBySurah: { surahNumber: number; surahName: string; surahEnglishName: string; ayahs: MushafPageAyah[] }[] = [];
  for (const ayah of page.ayahs) {
    const last = groupedBySurah[groupedBySurah.length - 1];
    if (last && last.surahNumber === ayah.surahNumber) {
      last.ayahs.push(ayah);
    } else {
      groupedBySurah.push({
        surahNumber: ayah.surahNumber,
        surahName: ayah.surahName,
        surahEnglishName: ayah.surahEnglishName,
        ayahs: [ayah],
      });
    }
  }

  return (
    <div>
      {/* Navigation bar */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2 text-sm text-neutral-500">
          <BookOpen className="h-4 w-4" />
          <span>Juz {page.juz}</span>
          <span className="text-neutral-300">|</span>
          <span>
            {page.surahs.map((s) => s.englishName).join(', ')}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => goTo(page.pageNumber - 1)}
            disabled={page.pageNumber <= 1 || loading}
            className="rounded-lg border border-neutral-200 p-1.5 text-neutral-500 transition-colors hover:border-emerald-300 hover:text-emerald-600 disabled:opacity-30 disabled:cursor-not-allowed"
            title="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const num = parseInt(pageInput, 10);
              if (!isNaN(num)) goTo(num);
            }}
            className="flex items-center"
          >
            <input
              type="text"
              inputMode="numeric"
              value={pageInput}
              onChange={(e) => setPageInput(e.target.value)}
              onBlur={() => {
                const num = parseInt(pageInput, 10);
                if (!isNaN(num)) goTo(num);
                else setPageInput(String(page.pageNumber));
              }}
              className="w-14 text-center rounded-lg border border-neutral-200 px-2 py-1.5 text-sm font-medium text-neutral-700 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400"
            />
            <span className="ml-1.5 text-xs text-neutral-400">/ {TOTAL_PAGES}</span>
          </form>
          <button
            onClick={() => goTo(page.pageNumber + 1)}
            disabled={page.pageNumber >= TOTAL_PAGES || loading}
            className="rounded-lg border border-neutral-200 p-1.5 text-neutral-500 transition-colors hover:border-emerald-300 hover:text-emerald-600 disabled:opacity-30 disabled:cursor-not-allowed"
            title="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Mushaf page */}
      <div className="relative rounded-xl border border-neutral-200 bg-[#fefcf4] overflow-hidden shadow-sm">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#fefcf4]/80">
            <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
          </div>
        )}

        {/* Page header */}
        <div className="flex items-center justify-between border-b border-neutral-200/60 px-6 py-2.5 text-xs text-neutral-400">
          <span>Juz {page.juz}</span>
          <span className="font-arabic text-sm text-neutral-500">
            {page.surahs.map((s) => s.name).join(' - ')}
          </span>
          <span>Page {page.pageNumber}</span>
        </div>

        {/* Ayahs */}
        <div className="px-6 sm:px-10 py-8" dir="rtl">
          {groupedBySurah.map((group) => {
            const startsNewSurah = group.ayahs[0].numberInSurah === 1;
            return (
              <div key={`${group.surahNumber}-${group.ayahs[0].numberInSurah}`}>
                {/* Surah header when a new surah starts on this page */}
                {startsNewSurah && (
                  <div className="my-6 first:mt-0">
                    <div className="flex items-center justify-center gap-4">
                      <div className="h-px flex-1 bg-gradient-to-l from-emerald-300/50 to-transparent" />
                      <div className="text-center rounded-lg border border-emerald-200/60 bg-emerald-50/50 px-6 py-2.5">
                        <p className="font-arabic text-lg text-emerald-800">
                          سُورَةُ {group.surahName.replace('سُورَةُ ', '')}
                        </p>
                        <p className="text-[10px] text-emerald-600 mt-0.5" dir="ltr">
                          {group.surahEnglishName} &middot; {group.surahNumber}
                        </p>
                      </div>
                      <div className="h-px flex-1 bg-gradient-to-r from-emerald-300/50 to-transparent" />
                    </div>
                    {/* Bismillah for all surahs except At-Tawbah (9) and Al-Fatihah (already has it in text) */}
                    {group.surahNumber !== 9 && group.surahNumber !== 1 && (
                      <p className="text-center font-arabic text-xl text-neutral-700 mt-4 mb-2 leading-loose">
                        {BISMILLAH}
                      </p>
                    )}
                  </div>
                )}

                {/* Render ayahs inline (continuous Mushaf style) */}
                <span className="font-arabic text-[1.4rem] sm:text-[1.6rem] leading-[2.8] sm:leading-[3] text-neutral-900 text-justify">
                  {group.ayahs.map((ayah) => (
                    <span key={ayah.number}>
                      <span>{ayah.text}</span>
                      <span className="inline-flex items-center justify-center mx-1 text-emerald-600 text-sm font-semibold select-none">
                        ﴿{ayah.numberInSurah.toLocaleString('ar-EG')}﴾
                      </span>
                    </span>
                  ))}
                </span>
              </div>
            );
          })}
        </div>

        {/* Page footer */}
        <div className="border-t border-neutral-200/60 px-6 py-2 text-center text-[10px] text-neutral-400">
          Mushaf Al-Madinah &middot; Hafs an Asim
        </div>
      </div>

      {/* Quick jump */}
      <div className="mt-4 flex items-center justify-center gap-2 flex-wrap">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 25, 30].map((juz) => {
          // Approximate page numbers for each juz start
          const juzPages: Record<number, number> = {
            1: 1, 2: 22, 3: 42, 4: 62, 5: 82, 6: 102, 7: 121, 8: 142,
            9: 162, 10: 182, 11: 201, 12: 222, 13: 242, 14: 262, 15: 282,
            16: 302, 17: 322, 18: 342, 19: 362, 20: 382, 21: 402, 22: 422,
            23: 442, 24: 462, 25: 482, 26: 502, 27: 522, 28: 542, 29: 562, 30: 582,
          };
          return (
            <button
              key={juz}
              onClick={() => goTo(juzPages[juz])}
              className={`rounded-md border px-2.5 py-1 text-xs font-medium transition-colors ${
                page.juz === juz
                  ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                  : 'border-neutral-200 text-neutral-500 hover:border-emerald-300 hover:text-emerald-600'
              }`}
            >
              Juz {juz}
            </button>
          );
        })}
      </div>
    </div>
  );
}
