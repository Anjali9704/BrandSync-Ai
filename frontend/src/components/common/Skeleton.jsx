export default function Skeleton({ className = '', lines = 1, height = 'h-4' }) {
  if (lines === 1) {
    return <div className={`animate-pulse bg-bg-secondary rounded ${height} ${className}`} />;
  }
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {[...Array(lines)].map((_, i) => (
        <div
          key={i}
          className={`animate-pulse bg-bg-secondary rounded ${height}`}
          style={{ width: i === lines - 1 ? '70%' : '100%' }}
        />
      ))}
    </div>
  );
}

export function SkeletonCard({ rows = 3 }) {
  return (
    <div className="bg-card border border-border rounded-lg p-5 flex flex-col gap-3">
      <Skeleton height="h-5" className="w-1/3" />
      {[...Array(rows)].map((_, i) => (
        <Skeleton key={i} height="h-3.5" className={i === rows - 1 ? 'w-2/3' : 'w-full'} />
      ))}
    </div>
  );
}

