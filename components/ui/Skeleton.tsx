"use client";

export function SkeletonLine({
  width = "100%",
  height = "14px",
}: {
  width?: string;
  height?: string;
}) {
  return <div className="skeleton-line" style={{ width, height }} />;
}

export function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="flex items-center gap-4 mb-4">
        <div className="skeleton-avatar" />
        <div className="flex-1 space-y-2">
          <SkeletonLine width="60%" />
          <SkeletonLine width="40%" />
        </div>
      </div>
      <div className="space-y-2">
        <SkeletonLine />
        <SkeletonLine width="80%" />
      </div>
    </div>
  );
}

export function SkeletonTable({
  rows = 5,
  cols = 6,
}: {
  rows?: number;
  cols?: number;
}) {
  return (
    <div className="skeleton-table">
      <div className="skeleton-table-header">
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className="skeleton-table-cell">
            <SkeletonLine width="80%" />
          </div>
        ))}
      </div>
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div key={rowIdx} className="skeleton-table-row">
          {Array.from({ length: cols }).map((_, colIdx) => (
            <div key={colIdx} className="skeleton-table-cell">
              <SkeletonLine
                width={
                  colIdx === 0 ? "30px" : colIdx === cols - 1 ? "70px" : "100%"
                }
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export function SkeletonStats({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton-stat">
          <div className="flex items-center justify-between">
            <div className="space-y-3 flex-1">
              <SkeletonLine width="50%" height="12px" />
              <SkeletonLine width="40%" height="28px" />
              <SkeletonLine width="60%" height="12px" />
            </div>
            <div className="skeleton-icon" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function SkeletonBanner() {
  return (
    <div className="skeleton-banner">
      <div className="flex items-center justify-between">
        <div className="space-y-3 flex-1">
          <SkeletonLine width="45%" height="28px" />
          <SkeletonLine width="65%" height="16px" />
        </div>
        <div className="skeleton-icon-lg hidden md:block" />
      </div>
    </div>
  );
}

export function SkeletonQuickActions() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="skeleton-card text-center p-5">
          <div
            className="skeleton-icon mx-auto mb-3"
            style={{ width: 48, height: 48, borderRadius: 12 }}
          />
          <SkeletonLine width="70%" height="14px" />
        </div>
      ))}
    </div>
  );
}
