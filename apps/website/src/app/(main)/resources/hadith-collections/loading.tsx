export default function HadithCollectionsLoading() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header skeleton */}
      <section className="border-b border-neutral-100">
        <div className="max-w-5xl mx-auto px-6 py-16 text-center">
          <div className="h-3 w-24 bg-neutral-100 rounded mx-auto mb-4 animate-pulse" />
          <div className="h-9 w-64 bg-neutral-100 rounded mx-auto mb-4 animate-pulse" />
          <div className="h-4 w-96 max-w-full bg-neutral-100 rounded mx-auto animate-pulse" />
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6">
        {/* Stats skeleton */}
        <section className="py-10">
          <div className="grid grid-cols-2 gap-4">
            {[0, 1].map((i) => (
              <div key={i} className="rounded-xl border border-neutral-200 bg-white p-5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-neutral-100 animate-pulse" />
                  <div>
                    <div className="h-5 w-12 bg-neutral-100 rounded animate-pulse mb-1" />
                    <div className="h-3 w-16 bg-neutral-100 rounded animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Books grid skeleton */}
        <section className="pb-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-6 w-40 bg-neutral-100 rounded animate-pulse" />
            <div className="flex-1 h-px bg-neutral-100" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-neutral-200 bg-white p-5">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-neutral-100 animate-pulse shrink-0" />
                  <div className="flex-1">
                    <div className="h-4 w-full bg-neutral-100 rounded animate-pulse mb-2" />
                    <div className="h-3 w-20 bg-neutral-100 rounded animate-pulse" />
                  </div>
                </div>
                <div className="flex gap-3 mt-3 pt-3 border-t border-neutral-100">
                  <div className="h-3 w-16 bg-neutral-100 rounded animate-pulse" />
                  <div className="h-3 w-16 bg-neutral-100 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
