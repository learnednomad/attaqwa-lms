import { Library, BookOpen, Check } from 'lucide-react';
import { fetchBooks, fetchDailyHadith } from '@/lib/services/hadith-api';
import { BookCard } from '@/components/features/hadith/book-card';
import { DailyHadith } from '@/components/features/hadith/daily-hadith';

export const metadata = {
  title: 'Hadith Collections | Masjid At-Taqwa',
  description:
    'Browse authentic hadith collections from Sahih Bukhari, Sahih Muslim, and more. Explore the words and traditions of the Prophet Muhammad (peace be upon him).',
};

export default async function HadithCollectionsPage() {
  const [books, dailyHadith] = await Promise.all([fetchBooks(), fetchDailyHadith()]);

  const activeBooks = books.filter((b) => Number(b.hadiths_count) > 0);
  const totalHadiths = books.reduce((sum, b) => sum + Number(b.hadiths_count || 0), 0);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="border-b border-neutral-100">
        <div className="max-w-5xl mx-auto px-6 py-16 text-center">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-emerald-700 mb-3">
            Masjid At-Taqwa
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 mb-4">
            Hadith Collections
          </h1>
          <p className="text-base text-neutral-500 max-w-2xl mx-auto leading-relaxed">
            Authentic narrations from the Prophet Muhammad (peace be upon him) from the major hadith
            collections, powered by HadithAPI.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6">
        {/* Stats */}
        <section className="py-10">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-neutral-200 bg-white p-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                  <Library className="h-4 w-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-lg font-bold text-neutral-900 leading-tight">
                    {activeBooks.length}
                  </p>
                  <p className="text-xs text-neutral-500">Collections</p>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-neutral-200 bg-white p-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                  <BookOpen className="h-4 w-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-lg font-bold text-neutral-900 leading-tight">
                    {totalHadiths.toLocaleString()}
                  </p>
                  <p className="text-xs text-neutral-500">Total Hadiths</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Daily Hadith */}
        {dailyHadith && (
          <section className="pb-10">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-xl font-semibold text-neutral-900">Hadith of the Day</h2>
              <div className="flex-1 h-px bg-neutral-100" />
            </div>
            <DailyHadith hadith={dailyHadith} />
          </section>
        )}

        {/* Books Grid */}
        <section className="pb-10">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-xl font-semibold text-neutral-900">Browse Collections</h2>
            <div className="flex-1 h-px bg-neutral-100" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {activeBooks.map((book) => (
              <BookCard key={book.bookSlug} book={book} />
            ))}
          </div>
        </section>

        {/* About Section */}
        <section className="pb-20">
          <div className="rounded-xl border border-neutral-200 bg-neutral-50/50 p-6 sm:p-8">
            <h3 className="text-base font-semibold text-neutral-900 mb-1">
              About Our Hadith Collection
            </h3>
            <p className="text-sm text-neutral-500 mb-6">
              All hadiths are sourced from authentic, verified collections and graded by qualified
              scholars.
            </p>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="h-4 w-4 text-emerald-600" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-neutral-900">Verified Sources</h4>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Nine major hadith collections including Sahih Bukhari, Sahih Muslim, and more.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="h-4 w-4 text-emerald-600" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-neutral-900">Graded Authenticity</h4>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Each hadith is graded as Sahih (authentic), Hasan (good), or Da&apos;eef (weak).
                  </p>
                </div>
              </div>
            </div>
            <p className="text-center text-xs text-neutral-400 mt-6">Powered by HadithAPI.com</p>
          </div>
        </section>
      </div>
    </div>
  );
}
