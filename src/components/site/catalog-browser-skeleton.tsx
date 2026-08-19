import { Skeleton } from "@/components/ui/skeleton";

export function CatalogBrowserSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 rounded-xl border border-border/60 bg-card p-3 shadow-elevation-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-1.5">
            <Skeleton className="h-7 w-16 rounded-lg" />
            <Skeleton className="h-7 w-20 rounded-lg" />
            <Skeleton className="h-7 w-20 rounded-lg" />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Skeleton className="h-7 w-52 rounded-lg" />
            <Skeleton className="h-7 w-36 rounded-lg" />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-1.5 border-t border-border/60 pt-3">
          <Skeleton className="h-5 w-28 rounded-full" />
          <Skeleton className="h-5 w-24 rounded-full" />
          <Skeleton className="h-5 w-24 rounded-full" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
      </div>

      <Skeleton className="h-4 w-32 rounded-md" />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex flex-col overflow-hidden rounded-xl border border-border/60 bg-card shadow-elevation-sm">
            <Skeleton className="aspect-4/3 w-full rounded-none" />
            <div className="flex flex-1 flex-col gap-2 p-3">
              <Skeleton className="h-4 w-3/4 rounded-md" />
              <Skeleton className="h-3 w-full rounded-md" />
              <Skeleton className="h-3 w-2/3 rounded-md" />
              <div className="mt-auto flex items-end justify-between pt-2">
                <Skeleton className="h-5 w-16 rounded-md" />
                <Skeleton className="size-8 rounded-lg" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
