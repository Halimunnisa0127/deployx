
export function LogsSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="h-10 rounded-xl bg-muted animate-pulse" />
      ))}
    </div>
  );
}
