'use client';

import { getStatusColor } from '@/lib/api';

interface StatusHeroProps {
  indicator: string;
  description: string;
}

export default function StatusHero({ indicator, description }: StatusHeroProps) {
  const isOperational = indicator === 'none';
  const pulseClass = isOperational
    ? 'pulse-operational'
    : indicator === 'minor'
      ? 'pulse-degraded'
      : 'pulse-outage';

  return (
    <div
      className="relative overflow-hidden rounded-lg border h-full"
      style={{
        backgroundColor: 'var(--noc-bg-card)',
        borderColor: 'var(--noc-border)',
      }}
    >
      {/* Subtle background glow */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          background: `radial-gradient(ellipse at 30% 50%, ${getStatusColor(indicator)} 0%, transparent 60%)`,
        }}
      />

      <div className="relative px-6 py-6 flex items-center gap-5">
        {/* Status indicator */}
        <div
          className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 ${pulseClass}`}
          style={{ backgroundColor: getStatusColor(indicator) }}
        >
          {isOperational ? (
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          )}
        </div>

        {/* Status text */}
        <div>
          <h2
            className="text-xl font-bold leading-tight"
            style={{ color: getStatusColor(indicator) }}
          >
            {description}
          </h2>
          <p className="text-xs mt-1" style={{ color: 'var(--noc-text-muted)' }}>
            Cloudflare Infrastructure
          </p>
        </div>
      </div>
    </div>
  );
}
