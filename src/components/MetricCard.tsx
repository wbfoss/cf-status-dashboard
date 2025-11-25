'use client';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  color?: string;
}

export default function MetricCard({
  title,
  value,
  subtitle,
  color = 'var(--noc-text-primary)',
}: MetricCardProps) {
  return (
    <div
      className="rounded-lg border p-5 h-full flex flex-col justify-center"
      style={{
        backgroundColor: 'var(--noc-bg-card)',
        borderColor: 'var(--noc-border)',
      }}
    >
      <span
        className="text-xs font-medium uppercase tracking-wider"
        style={{ color: 'var(--noc-text-secondary)' }}
      >
        {title}
      </span>
      <div
        className="text-3xl font-bold tabular-nums mt-1"
        style={{ color }}
      >
        {value}
      </div>
      {subtitle && (
        <p className="text-xs mt-1" style={{ color: 'var(--noc-text-muted)' }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
