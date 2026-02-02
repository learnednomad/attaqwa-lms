import { BookOpen, ChevronRight, Layers, Scroll, Volume2 } from 'lucide-react';
import { fetchDailyAyah, popularSurahs, baqarahGroups } from '@/lib/services/quran-api';
import { AudioButton } from '@/components/features/quran/audio-button';

export const metadata = {
  title: 'Quran Study & Tafsir | Masjid At-Taqwa',
  description:
    'Daily Ayah with complete Tafsir and contextual study of the Holy Quran. Study Surahs with verses grouped by themes and context.',
};

export default async function QuranStudyPage() {
  const dailyAyah = await fetchDailyAyah();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="border-b border-neutral-100">
        <div className="max-w-5xl mx-auto px-6 py-16 text-center">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-emerald-700 mb-3">
            Masjid At-Taqwa
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 mb-4">
            Quran Study & Tafsir
          </h1>
          <p className="text-base text-neutral-500 max-w-2xl mx-auto leading-relaxed">
            Daily Ayah with translation and contextual study of the Holy Quran.
            Study Surahs with verses grouped by themes and context.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6">
        {/* Ayah of the Day */}
        {dailyAyah && (
          <section className="py-10">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-xl font-semibold text-neutral-900">Ayah of the Day</h2>
              <div className="flex-1 h-px bg-neutral-100" />
            </div>
            <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden">
              <div className="border-l-4 border-emerald-500 p-6 sm:p-8">
                {/* Reference info */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                      <Scroll className="h-3.5 w-3.5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-neutral-900">
                        Surah {dailyAyah.surahEnglishName} ({dailyAyah.surahName})
                      </p>
                      <p className="text-xs text-neutral-400">
                        {dailyAyah.surahNumber}:{dailyAyah.numberInSurah} &middot; Juz {dailyAyah.juz} &middot; {dailyAyah.revelationType}
                      </p>
                    </div>
                  </div>
                  <AudioButton src={dailyAyah.audio} />
                </div>

                {/* Arabic text */}
                <div className="bg-neutral-50/50 rounded-lg p-6 mb-6">
                  <p
                    className="text-2xl sm:text-3xl leading-[2] font-arabic text-neutral-900 text-right"
                    dir="rtl"
                  >
                    {dailyAyah.text}
                  </p>
                </div>

                {/* Translation */}
                <div className="border-t border-neutral-100 pt-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                    Translation
                  </p>
                  <p className="text-sm text-neutral-700 leading-relaxed">
                    {dailyAyah.translation}
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Popular Surahs */}
        <section className="pb-10">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-xl font-semibold text-neutral-900">Popular Surahs</h2>
            <div className="flex-1 h-px bg-neutral-100" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {popularSurahs.map((surah) => (
              <div
                key={surah.number}
                className="rounded-xl border border-neutral-200 bg-white p-4 transition-colors hover:border-emerald-300 hover:bg-emerald-50/30"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded bg-neutral-50 border border-neutral-100 flex items-center justify-center">
                    <span className="text-[10px] font-semibold text-neutral-500">{surah.number}</span>
                  </div>
                  <p className="text-sm font-medium text-neutral-900">{surah.name}</p>
                </div>
                <p className="text-xs text-neutral-400">
                  {surah.verses} verses &middot; {surah.theme}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Surah Al-Baqarah Thematic Division */}
        <section className="pb-10">
          <div className="flex items-center gap-3 mb-3">
            <h2 className="text-xl font-semibold text-neutral-900">
              Surah Al-Baqarah &mdash; Thematic Division
            </h2>
            <div className="flex-1 h-px bg-neutral-100" />
          </div>
          <p className="text-sm text-neutral-500 mb-6 max-w-3xl">
            The longest chapter of the Quran with 286 verses, containing comprehensive guidance
            for mankind. Study it through these contextual groups:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {baqarahGroups.map((group, i) => (
              <div
                key={i}
                className="group rounded-xl border border-neutral-200 bg-white p-4 transition-colors hover:border-emerald-300 hover:bg-emerald-50/30"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <p className="text-sm font-medium text-neutral-900 group-hover:text-emerald-700 transition-colors">
                    {group.title}
                  </p>
                  <span className="shrink-0 rounded-md border border-neutral-200 bg-neutral-50 px-2 py-0.5 text-[10px] font-semibold text-neutral-500">
                    Ayah {group.ayahRange[0]}&ndash;{group.ayahRange[1]}
                  </span>
                </div>
                <p className="text-xs text-neutral-400 mb-3 leading-relaxed">{group.theme}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                    <Layers className="h-3 w-3" />
                    <span>{group.ayahRange[1] - group.ayahRange[0] + 1} verses</span>
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 text-neutral-300 group-hover:text-emerald-500 transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Study Resources */}
        <section className="pb-20">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-xl font-semibold text-neutral-900">Study Resources</h2>
            <div className="flex-1 h-px bg-neutral-100" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-xl border border-neutral-200 bg-white p-5">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-3">
                <BookOpen className="h-4 w-4 text-emerald-600" />
              </div>
              <h3 className="text-sm font-semibold text-neutral-900 mb-1">Daily Recitation</h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Establish a daily Quran reading routine with a structured plan.
              </p>
            </div>
            <div className="rounded-xl border border-neutral-200 bg-white p-5">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-3">
                <Layers className="h-4 w-4 text-emerald-600" />
              </div>
              <h3 className="text-sm font-semibold text-neutral-900 mb-1">Thematic Study</h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Study verses grouped by themes to understand their full context.
              </p>
            </div>
            <div className="rounded-xl border border-neutral-200 bg-white p-5">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-3">
                <Volume2 className="h-4 w-4 text-emerald-600" />
              </div>
              <h3 className="text-sm font-semibold text-neutral-900 mb-1">Audio Recitation</h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Listen to recitations from renowned Qaris worldwide.
              </p>
            </div>
          </div>
          <p className="text-center text-xs text-neutral-400 mt-8">
            Powered by Al-Quran Cloud API
          </p>
        </section>
      </div>
    </div>
  );
}
