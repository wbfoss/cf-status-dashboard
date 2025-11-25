'use client';

import { formatTime } from '@/lib/api';

interface HeaderProps {
  lastUpdated: string | null;
  isLoading: boolean;
  onRefresh: () => void;
}

export default function Header({ lastUpdated, isLoading, onRefresh }: HeaderProps) {
  return (
    <header
      className="border-b sticky top-0 z-50 backdrop-blur-sm"
      style={{
        backgroundColor: 'rgba(10, 14, 20, 0.9)',
        borderColor: 'var(--noc-border)',
      }}
    >
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">
          {/* Logo & Title */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              {/* Cloudflare-inspired logo */}
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: 'var(--noc-accent)' }}
              >
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16.5 12c0-1.5-1.5-2.5-3-2.5h-3c-.5 0-1 .5-1 1s.5 1 1 1h3c.5 0 1 .5 1 1s-.5 1-1 1h-3c-1.5 0-3-1-3-2.5s1.5-2.5 3-2.5h3c2.5 0 4.5 2 4.5 4.5S16 17 13.5 17h-3c-1.5 0-2.5-1-2.5-2.5" />
                  <circle cx="18" cy="12" r="2" />
                  <circle cx="6" cy="12" r="2" />
                </svg>
              </div>
              <div>
                <h1 className="text-lg font-bold" style={{ color: 'var(--noc-text-primary)' }}>
                  Cloudflare Status
                </h1>
                <p className="text-xs" style={{ color: 'var(--noc-text-muted)' }}>
                  Infrastructure Monitor
                </p>
              </div>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {/* Last updated */}
            <div className="hidden sm:flex items-center gap-2 text-xs" style={{ color: 'var(--noc-text-secondary)' }}>
              <span
                className={`w-2 h-2 rounded-full ${isLoading ? 'animate-pulse' : ''}`}
                style={{ backgroundColor: isLoading ? 'var(--noc-degraded)' : 'var(--noc-operational)' }}
              />
              <span>
                {lastUpdated ? `Updated ${formatTime(lastUpdated)}` : 'Loading...'}
              </span>
            </div>

            {/* Auto-refresh indicator */}
            <div
              className="hidden md:flex items-center gap-1.5 text-xs px-2 py-1 rounded"
              style={{
                backgroundColor: 'var(--noc-bg-card)',
                color: 'var(--noc-text-muted)',
              }}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>5m auto</span>
            </div>

            {/* Refresh button */}
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border transition-all hover:border-opacity-80 disabled:opacity-50"
              style={{
                backgroundColor: 'var(--noc-bg-card)',
                borderColor: 'var(--noc-border)',
                color: 'var(--noc-text-primary)',
              }}
            >
              <svg
                className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              <span className="text-sm font-medium hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
