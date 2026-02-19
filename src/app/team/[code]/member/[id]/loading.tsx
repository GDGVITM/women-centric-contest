export default function Loading() {
  return (
    <div className="h-screen flex flex-col pt-16 bg-black">
      {/* Toolbar Skeleton */}
      <div className="h-16 border-b border-white/10 flex items-center px-6 justify-between bg-white/5">
        <div className="flex items-center gap-4">
          <div className="h-8 w-24 bg-white/10 rounded animate-pulse" />
          <div className="h-4 w-32 bg-white/5 rounded animate-pulse" />
        </div>
        <div className="flex gap-3">
          <div className="h-9 w-24 bg-white/10 rounded animate-pulse" />
          <div className="h-9 w-24 bg-blue-500/20 rounded animate-pulse" />
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="flex-1 grid grid-cols-12 overflow-hidden">
        {/* Editor Area */}
        <div className="col-span-7 border-r border-white/10 p-6 space-y-4">
          {[...Array(12)].map((_, i) => (
            <div 
              key={i} 
              className="h-4 bg-white/5 rounded animate-pulse" 
              style={{ width: `${Math.random() * 40 + 30}%` }}
            />
          ))}
        </div>

        {/* Console Area */}
        <div className="col-span-5 bg-[#0D0D0D] p-4">
          <div className="h-6 w-32 bg-white/10 rounded mb-4 animate-pulse" />
          <div className="space-y-3">
             <div className="h-3 w-full bg-white/5 rounded animate-pulse" />
             <div className="h-3 w-2/3 bg-white/5 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
