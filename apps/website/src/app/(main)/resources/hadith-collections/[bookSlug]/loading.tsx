export default function BookChaptersLoading() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header skeleton */}
      <section className="border-b border-neutral-100">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <div className="h-3 w-48 bg-neutral-100 rounded animate-pulse mb-6" />
          <div className="h-3 w-24 bg-neutral-100 rounded animate-pulse mb-3" />
          <div className="h-9 w-56 bg-neutral-100 rounded animate-pulse mb-2" />
          <div className="h-4 w-32 bg-neutral-100 rounded animate-pulse" />
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

        {/* Chapters skeleton */}
        <section className="pb-20">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-6 w-24 bg-neutral-100 rounded animate-pulse" />
            <div className="flex-1 h-px bg-neutral-100" />
          </div>
          <div className="space-y-2">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-xl border border-neutral-200 bg-white px-5 py-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg bg-neutral-100 animate-pulse" />
                  <div>
                    <div className="h-4 w-48 bg-neutral-100 rounded animate-pulse mb-1" />
                    <div className="h-3 w-32 bg-neutral-100 rounded animate-pulse" />
                  </div>
                </div>
                <div className="w-4 h-4 bg-neutral-100 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
