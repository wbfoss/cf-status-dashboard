'use client';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded ${className}`}
      style={{ backgroundColor: 'var(--noc-bg-elevated)' }}
    />
  );
}

export function MapSkeleton() {
  return (
    <div
      className="rounded-lg border overflow-hidden"
      style={{
        backgroundColor: 'var(--noc-bg-card)',
        borderColor: 'var(--noc-border)',
      }}
    >
      {/* Header */}
      <div
        className="px-4 py-3 border-b flex items-center justify-between"
        style={{
          backgroundColor: 'var(--noc-bg-secondary)',
          borderColor: 'var(--noc-border)',
        }}
      >
        <div className="flex items-center gap-4">
          <Skeleton className="h-5 w-28" />
          <div className="flex items-center gap-3">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
        <Skeleton className="h-8 w-36" />
      </div>

      {/* Map area */}
      <div className="relative h-[300px] sm:h-[400px] md:h-[500px] flex items-center justify-center">
        <div className="text-center">
          <div
            className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center animate-pulse"
            style={{ backgroundColor: 'var(--noc-bg-elevated)' }}
          >
            <svg
              className="w-6 h-6 animate-spin"
              style={{ color: 'var(--noc-text-muted)' }}
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          </div>
          <p className="text-sm" style={{ color: 'var(--noc-text-muted)' }}>
            Loading world map...
          </p>
        </div>
      </div>

      {/* Footer */}
      <div
        className="px-4 py-2 border-t"
        style={{
          backgroundColor: 'var(--noc-bg-secondary)',
          borderColor: 'var(--noc-border)',
        }}
      >
        <Skeleton className="h-4 w-48" />
      </div>
    </div>
  );
}

export function PanelSkeleton() {
  return (
    <div
      className="rounded-lg border overflow-hidden"
      style={{
        backgroundColor: 'var(--noc-bg-card)',
        borderColor: 'var(--noc-border)',
      }}
    >
      {/* Header */}
      <div
        className="px-4 py-3 border-b"
        style={{
          backgroundColor: 'var(--noc-bg-secondary)',
          borderColor: 'var(--noc-border)',
        }}
      >
        <Skeleton className="h-5 w-32" />
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function StatusSummarySkeleton() {
  return (
    <div
      className="rounded-lg border overflow-hidden"
      style={{
        backgroundColor: 'var(--noc-bg-card)',
        borderColor: 'var(--noc-border)',
      }}
    >
      <div className="px-5 py-4 flex items-center gap-6">
        <div className="flex items-center gap-4">
          <Skeleton className="w-12 h-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-3 w-32" />
          </div>
        </div>
        <div className="hidden md:flex flex-1 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-1">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-6 w-16" />
            </div>
          ))}
        </div>
      </div>
      <div
        className="px-5 py-3 border-t"
        style={{
          backgroundColor: 'var(--noc-bg-secondary)',
          borderColor: 'var(--noc-border)',
        }}
      >
        <Skeleton className="h-2 w-full rounded-full" />
      </div>
    </div>
  );
}
