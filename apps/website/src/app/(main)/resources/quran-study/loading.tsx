export default function QuranStudyLoading() {
  return (
    <div className="min-h-screen bg-white">
      <section className="border-b border-neutral-100">
        <div className="max-w-5xl mx-auto px-6 py-16 text-center">
          <div className="h-3 w-24 bg-neutral-100 rounded mx-auto mb-4 animate-pulse" />
          <div className="h-9 w-64 bg-neutral-100 rounded mx-auto mb-4 animate-pulse" />
          <div className="h-4 w-96 max-w-full bg-neutral-100 rounded mx-auto animate-pulse" />
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6">
        {/* Ayah of the Day skeleton */}
        <section className="py-10">
          <div className="h-6 w-40 bg-neutral-100 rounded mb-6 animate-pulse" />
          <div className="rounded-xl border border-neutral-200 p-8">
            <div className="h-4 w-48 bg-neutral-100 rounded mb-6 animate-pulse" />
            <div className="bg-neutral-50/50 rounded-lg p-6 mb-6">
              <div className="h-8 w-3/4 bg-neutral-100 rounded ml-auto animate-pulse" />
            </div>
            <div className="border-t border-neutral-100 pt-5">
              <div className="h-3 w-20 bg-neutral-100 rounded mb-3 animate-pulse" />
              <div className="h-4 w-full bg-neutral-100 rounded animate-pulse" />
            </div>
          </div>
        </section>

        {/* Popular Surahs skeleton */}
        <section className="pb-10">
          <div className="h-6 w-36 bg-neutral-100 rounded mb-6 animate-pulse" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-neutral-200 p-4 animate-pulse">
                <div className="h-4 w-20 bg-neutral-100 rounded mb-2" />
                <div className="h-3 w-24 bg-neutral-100 rounded" />
              </div>
            ))}
          </div>
        </section>

        {/* Thematic groups skeleton */}
        <section className="pb-10">
          <div className="h-6 w-72 bg-neutral-100 rounded mb-6 animate-pulse" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-neutral-200 p-4 animate-pulse">
                <div className="h-4 w-40 bg-neutral-100 rounded mb-2" />
                <div className="h-3 w-full bg-neutral-100 rounded mb-3" />
                <div className="h-3 w-16 bg-neutral-100 rounded" />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
