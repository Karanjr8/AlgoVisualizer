export const PageSkeletonLoader = () => {
  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 md:px-10 lg:px-12 pt-6 sm:pt-8 pb-32 space-y-8 animate-pulse">
      {/* Header Banner Skeleton */}
      <div className="w-full h-44 sm:h-52 rounded-3xl bg-card/40 border border-border/40 p-6 flex flex-col justify-between">
        <div className="space-y-3">
          <div className="w-32 h-4 rounded-full bg-muted/60" />
          <div className="w-3/4 sm:w-1/2 h-8 rounded-xl bg-muted/80" />
          <div className="w-5/6 sm:w-2/3 h-4 rounded-lg bg-muted/40" />
        </div>
        <div className="flex gap-3">
          <div className="w-24 h-8 rounded-xl bg-muted/60" />
          <div className="w-32 h-8 rounded-xl bg-muted/40" />
        </div>
      </div>

      {/* Grid Content Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-48 rounded-3xl bg-card/30 border border-border/30 p-5 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-muted/60" />
              <div className="w-2/3 h-5 rounded-lg bg-muted/80" />
              <div className="w-full h-3 rounded bg-muted/40" />
            </div>
            <div className="w-1/3 h-4 rounded bg-muted/50" />
          </div>
        ))}
      </div>
    </div>
  );
};
