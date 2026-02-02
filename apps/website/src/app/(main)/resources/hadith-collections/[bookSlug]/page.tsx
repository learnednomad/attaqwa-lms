import { notFound } from 'next/navigation';
import { BookOpen, Hash } from 'lucide-react';
import { fetchBook, fetchChapters } from '@/lib/services/hadith-api';
import { generateSEOMetadata, generateBreadcrumbStructuredData } from '@/lib/seo';
import { HadithBreadcrumb } from '@/components/features/hadith/hadith-breadcrumb';
import { ChapterCard } from '@/components/features/hadith/chapter-card';

interface PageProps {
  params: Promise<{ bookSlug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { bookSlug } = await params;
  const book = await fetchBook(bookSlug);
  if (!book) return {};

  return generateSEOMetadata({
    title: `${book.bookName} - Hadith Collection`,
    description: `Browse ${Number(book.chapters_count)} chapters and ${Number(book.hadiths_count).toLocaleString()} hadiths from ${book.bookName} by ${book.writerName}.`,
    keywords: ['hadith', book.bookName.toLowerCase(), book.writerName.toLowerCase(), 'islamic hadith'],
    canonical: `/resources/hadith-collections/${bookSlug}`,
  });
}

export default async function BookChaptersPage({ params }: PageProps) {
  const { bookSlug } = await params;
  const [book, chapters] = await Promise.all([fetchBook(bookSlug), fetchChapters(bookSlug)]);

  if (!book) notFound();

  const breadcrumbData = generateBreadcrumbStructuredData([
    { name: 'Hadith Collections', url: '/resources/hadith-collections' },
    { name: book.bookName, url: `/resources/hadith-collections/${bookSlug}` },
  ]);

  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      />

      {/* Header */}
      <section className="border-b border-neutral-100">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <div className="mb-6">
            <HadithBreadcrumb
              crumbs={[
                { label: 'Hadith Collections', href: '/resources/hadith-collections' },
                { label: book.bookName },
              ]}
            />
          </div>
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-emerald-700 mb-3">
            Masjid At-Taqwa
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 mb-2">
            {book.bookName}
          </h1>
          <p className="text-base text-neutral-500">{book.writerName}</p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6">
        {/* Stats */}
        <section className="py-10">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-neutral-200 bg-white p-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                  <Hash className="h-4 w-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-lg font-bold text-neutral-900 leading-tight">
                    {Number(book.chapters_count)}
                  </p>
                  <p className="text-xs text-neutral-500">Chapters</p>
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
                    {Number(book.hadiths_count).toLocaleString()}
                  </p>
                  <p className="text-xs text-neutral-500">Hadiths</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Chapters List */}
        <section className="pb-20">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-xl font-semibold text-neutral-900">Chapters</h2>
            <div className="flex-1 h-px bg-neutral-100" />
          </div>
          {chapters.length === 0 ? (
            <div className="rounded-xl border border-neutral-200 bg-neutral-50/50 p-12 text-center">
              <p className="text-sm text-neutral-500">No chapters found for this collection.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {chapters.map((chapter) => (
                <ChapterCard key={chapter.id} chapter={chapter} bookSlug={bookSlug} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
