import { notFound } from 'next/navigation';
import { fetchBook, fetchChapters, fetchHadiths } from '@/lib/services/hadith-api';
import { generateSEOMetadata, generateBreadcrumbStructuredData } from '@/lib/seo';
import { HadithBreadcrumb } from '@/components/features/hadith/hadith-breadcrumb';
import { HadithCard } from '@/components/features/hadith/hadith-card';
import { HadithPagination } from '@/components/features/hadith/hadith-pagination';

interface PageProps {
  params: Promise<{ bookSlug: string; chapterNumber: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { bookSlug, chapterNumber } = await params;
  const [book, chapters] = await Promise.all([fetchBook(bookSlug), fetchChapters(bookSlug)]);
  if (!book) return {};

  const chapter = chapters.find((c) => c.chapterNumber === chapterNumber);
  const chapterName = chapter?.chapterEnglish ?? `Chapter ${chapterNumber}`;

  return generateSEOMetadata({
    title: `${chapterName} - ${book.bookName}`,
    description: `Read hadiths from ${chapterName} in ${book.bookName} by ${book.writerName}. Authentic narrations with Arabic text and English translation.`,
    keywords: ['hadith', book.bookName.toLowerCase(), chapterName.toLowerCase(), 'islamic hadith'],
    canonical: `/resources/hadith-collections/${bookSlug}/${chapterNumber}`,
  });
}

export default async function ChapterHadithsPage({ params, searchParams }: PageProps) {
  const { bookSlug, chapterNumber } = await params;
  const { page: pageParam } = await searchParams;
  const currentPage = Math.max(1, Number(pageParam) || 1);

  const [book, chapters, hadithResult] = await Promise.all([
    fetchBook(bookSlug),
    fetchChapters(bookSlug),
    fetchHadiths({ bookSlug, chapterNumber, page: currentPage, pageSize: 20 }),
  ]);

  if (!book) notFound();

  const chapter = chapters.find((c) => c.chapterNumber === chapterNumber);
  const chapterName = chapter?.chapterEnglish ?? `Chapter ${chapterNumber}`;

  const breadcrumbData = generateBreadcrumbStructuredData([
    { name: 'Hadith Collections', url: '/resources/hadith-collections' },
    { name: book.bookName, url: `/resources/hadith-collections/${bookSlug}` },
    {
      name: chapterName,
      url: `/resources/hadith-collections/${bookSlug}/${chapterNumber}`,
    },
  ]);

  const basePath = `/resources/hadith-collections/${bookSlug}/${chapterNumber}`;

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
                { label: book.bookName, href: `/resources/hadith-collections/${bookSlug}` },
                { label: chapterName },
              ]}
            />
          </div>
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-emerald-700 mb-3">
            {book.bookName}
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 mb-2">
            {chapterName}
          </h1>
          {chapter?.chapterArabic && (
            <p className="text-lg text-neutral-400 font-arabic" dir="rtl">
              {chapter.chapterArabic}
            </p>
          )}
          {hadithResult.pagination.total > 0 && (
            <p className="text-sm text-neutral-500 mt-2">
              {hadithResult.pagination.total.toLocaleString()} hadiths in this chapter
            </p>
          )}
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6">
        {/* Hadiths List */}
        <section className="py-10">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-xl font-semibold text-neutral-900">Hadiths</h2>
            <div className="flex-1 h-px bg-neutral-100" />
          </div>

          {hadithResult.data.length === 0 ? (
            <div className="rounded-xl border border-neutral-200 bg-neutral-50/50 p-12 text-center">
              <p className="text-sm text-neutral-500">No hadiths found for this chapter.</p>
              <p className="text-xs text-neutral-400 mt-1">
                Try selecting a different chapter.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {hadithResult.data.map((hadith) => (
                <HadithCard key={hadith.id} hadith={hadith} />
              ))}
            </div>
          )}
        </section>

        {/* Pagination */}
        <section className="pb-20">
          <HadithPagination pagination={hadithResult.pagination} basePath={basePath} />
        </section>
      </div>
    </div>
  );
}
