export default function Loading() {
  return (
    <div className="min-h-screen bg-black text-white p-8 pt-24">
      {/* Header Skeleton */}
      <div className="max-w-4xl mx-auto mb-12 text-center space-y-4">
        <div className="h-10 w-48 bg-white/5 rounded mx-auto animate-pulse" />
        <div className="h-4 w-96 bg-white/5 rounded mx-auto animate-pulse" />
      </div>

      {/* Grid Skeleton */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-64 bg-white/5 rounded-xl border border-white/10 animate-pulse p-6 space-y-4">
            <div className="flex justify-between">
              <div className="h-6 w-24 bg-white/10 rounded" />
              <div className="h-6 w-6 bg-white/10 rounded-full" />
            </div>
            <div className="h-8 w-3/4 bg-white/10 rounded" />
            <div className="space-y-2 pt-4">
              <div className="h-3 w-full bg-white/5 rounded" />
              <div className="h-3 w-5/6 bg-white/5 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
