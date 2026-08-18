import { Skeleton } from "@/components/ui/skeleton";

export function CatalogBrowserSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 border border-border bg-card p-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-1.5">
            <Skeleton className="h-7 w-16 rounded-none" />
            <Skeleton className="h-7 w-20 rounded-none" />
            <Skeleton className="h-7 w-20 rounded-none" />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Skeleton className="h-7 w-52 rounded-none" />
            <Skeleton className="h-7 w-36 rounded-none" />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-1.5 border-t border-border pt-3">
          <Skeleton className="h-5 w-28 rounded-none" />
          <Skeleton className="h-5 w-24 rounded-none" />
          <Skeleton className="h-5 w-24 rounded-none" />
          <Skeleton className="h-5 w-20 rounded-none" />
        </div>
      </div>

      <Skeleton className="h-4 w-32 rounded-none" />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex flex-col border border-border bg-card">
            <Skeleton className="aspect-4/3 w-full rounded-none" />
            <div className="flex flex-1 flex-col gap-2 p-3">
              <Skeleton className="h-4 w-3/4 rounded-none" />
              <Skeleton className="h-3 w-full rounded-none" />
              <Skeleton className="h-3 w-2/3 rounded-none" />
              <div className="mt-auto flex items-end justify-between pt-2">
                <Skeleton className="h-5 w-16 rounded-none" />
                <Skeleton className="size-8 rounded-none" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
