export default function ChapterHadithsLoading() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header skeleton */}
      <section className="border-b border-neutral-100">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <div className="h-3 w-64 bg-neutral-100 rounded animate-pulse mb-6" />
          <div className="h-3 w-24 bg-neutral-100 rounded animate-pulse mb-3" />
          <div className="h-9 w-72 bg-neutral-100 rounded animate-pulse mb-2" />
          <div className="h-5 w-48 bg-neutral-100 rounded animate-pulse" />
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6">
        {/* Hadiths skeleton */}
        <section className="py-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-6 w-20 bg-neutral-100 rounded animate-pulse" />
            <div className="flex-1 h-px bg-neutral-100" />
          </div>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-neutral-200 bg-white p-5">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-neutral-100 animate-pulse" />
                    <div className="h-4 w-20 bg-neutral-100 rounded animate-pulse" />
                  </div>
                  <div className="h-5 w-12 bg-neutral-100 rounded-full animate-pulse" />
                </div>
                {/* Arabic block */}
                <div className="rounded-lg bg-neutral-50 border border-neutral-100 p-4 mb-4">
                  <div className="h-4 w-full bg-neutral-100 rounded animate-pulse mb-2" />
                  <div className="h-4 w-3/4 bg-neutral-100 rounded animate-pulse" />
                </div>
                {/* English block */}
                <div className="mb-4">
                  <div className="h-3 w-16 bg-neutral-100 rounded animate-pulse mb-2" />
                  <div className="h-4 w-full bg-neutral-100 rounded animate-pulse mb-1" />
                  <div className="h-4 w-full bg-neutral-100 rounded animate-pulse mb-1" />
                  <div className="h-4 w-2/3 bg-neutral-100 rounded animate-pulse" />
                </div>
                {/* Footer */}
                <div className="flex items-center gap-4 pt-3 border-t border-neutral-100">
                  <div className="h-3 w-32 bg-neutral-100 rounded animate-pulse" />
                  <div className="h-3 w-24 bg-neutral-100 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
