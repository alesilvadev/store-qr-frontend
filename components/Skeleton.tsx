export const SkeletonProduct = () => (
  <div className="card p-4 space-y-3">
    <div className="h-6 bg-secondary rounded-md w-3/4 animate-pulse" />
    <div className="h-4 bg-secondary rounded-md w-1/2 animate-pulse" />
    <div className="h-8 bg-secondary rounded-md w-1/4 animate-pulse" />
  </div>
);

export const SkeletonProductList = ({ count = 5 }: { count?: number }) => (
  <div className="space-y-3">
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonProduct key={i} />
    ))}
  </div>
);

export const SkeletonOrder = () => (
  <div className="card p-4 space-y-4">
    <div className="h-5 bg-secondary rounded-md w-1/3 animate-pulse" />
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex justify-between">
          <div className="h-4 bg-secondary rounded-md w-1/2 animate-pulse" />
          <div className="h-4 bg-secondary rounded-md w-1/4 animate-pulse" />
        </div>
      ))}
    </div>
    <div className="h-8 bg-secondary rounded-md w-full animate-pulse mt-4" />
  </div>
);
