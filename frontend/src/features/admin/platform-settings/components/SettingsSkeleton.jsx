import Skeleton from "../../../../components/ui/Skeleton";

export function SettingsSkeleton() {
  return (
    <div className="space-y-12 animate-pulse mt-6">
      <div className="bg-card rounded-2xl border border-border p-6 shadow-sm dark:shadow-lg">
        <div className="mb-6 border-b border-border pb-4">
          <Skeleton className="h-6 w-40 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="space-y-6 max-w-2xl">
          <div>
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
          <div>
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
            <div>
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-border p-6 shadow-sm dark:shadow-lg">
        <div className="mb-6 border-b border-border pb-4">
          <Skeleton className="h-6 w-40 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="space-y-4 max-w-3xl">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex justify-between items-center p-4 bg-slate-900/40 rounded-xl"
            >
              <div>
                <Skeleton className="h-5 w-32 mb-2" />
                <Skeleton className="h-4 w-48" />
              </div>
              <Skeleton className="h-6 w-11 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
