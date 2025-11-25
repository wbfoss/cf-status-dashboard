'use client';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  color?: string;
  bgColor?: string;
  icon?: React.ReactNode;
}

export default function MetricCard({
  title,
  value,
  subtitle,
  color = 'var(--noc-text-primary)',
  bgColor,
  icon,
}: MetricCardProps) {
  return (
    <div
      className="rounded-lg border p-5 transition-all hover:border-opacity-60"
      style={{
        backgroundColor: bgColor || 'var(--noc-bg-card)',
        borderColor: 'var(--noc-border)',
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <span
          className="text-xs font-medium uppercase tracking-wider"
          style={{ color: 'var(--noc-text-secondary)' }}
        >
          {title}
        </span>
        {icon && (
          <span style={{ color }}>{icon}</span>
        )}
      </div>
      <div
        className="text-4xl font-bold tabular-nums"
        style={{ color }}
      >
        {value}
      </div>
      {subtitle && (
        <p
          className="text-xs mt-2"
          style={{ color: 'var(--noc-text-muted)' }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
