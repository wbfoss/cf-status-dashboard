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
      className="relative overflow-hidden rounded-xl border"
      style={{
        backgroundColor: 'var(--noc-bg-card)',
        borderColor: 'var(--noc-border)',
      }}
    >
      {/* Background glow effect */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background: `radial-gradient(ellipse at center, ${getStatusColor(indicator)} 0%, transparent 70%)`,
        }}
      />

      <div className="relative px-8 py-12 text-center">
        {/* Large status indicator */}
        <div className="flex justify-center mb-6">
          <div
            className={`w-20 h-20 rounded-full flex items-center justify-center ${pulseClass}`}
            style={{
              backgroundColor: getStatusColor(indicator),
            }}
          >
            {isOperational ? (
              <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            )}
          </div>
        </div>

        {/* Status text */}
        <h2
          className="text-3xl font-bold mb-2"
          style={{ color: getStatusColor(indicator) }}
        >
          {description}
        </h2>
        <p className="text-sm" style={{ color: 'var(--noc-text-secondary)' }}>
          Cloudflare Infrastructure Status
        </p>
      </div>
    </div>
  );
}
