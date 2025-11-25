'use client';

import { useState, useEffect } from 'react';

interface HeaderProps {
  lastUpdated: string | null;
  isLoading: boolean;
  onRefresh: () => void;
}

function formatLocalTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
}

function formatLocalDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
}

function getTimezoneAbbr(): string {
  const date = new Date();
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  // Get short timezone name
  const parts = date.toLocaleTimeString('en-US', { timeZoneName: 'short' }).split(' ');
  return parts[parts.length - 1];
}

export default function Header({ lastUpdated, isLoading, onRefresh }: HeaderProps) {
  const [timezone, setTimezone] = useState('');

  useEffect(() => {
    setTimezone(getTimezoneAbbr());
  }, []);

  const handleRefresh = () => {
    if (!isLoading) {
      onRefresh();
    }
  };

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
          <div className="flex items-center gap-3">
            {/* Last updated - Highlighted */}
            {lastUpdated && (
              <div
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg"
                style={{
                  backgroundColor: 'var(--noc-operational-bg)',
                  border: '1px solid var(--noc-operational)',
                }}
              >
                <span
                  className={`w-2 h-2 rounded-full ${isLoading ? 'animate-pulse' : ''}`}
                  style={{ backgroundColor: isLoading ? 'var(--noc-degraded)' : 'var(--noc-operational)' }}
                />
                <div className="text-xs">
                  <span style={{ color: 'var(--noc-text-muted)' }}>Updated: </span>
                  <span className="font-semibold" style={{ color: 'var(--noc-operational)' }}>
                    {formatLocalTime(lastUpdated)}
                  </span>
                  {timezone && (
                    <span className="ml-1" style={{ color: 'var(--noc-text-muted)' }}>
                      {timezone}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Mobile: Just show time */}
            {lastUpdated && (
              <div
                className="sm:hidden flex items-center gap-1.5 text-xs"
                style={{ color: 'var(--noc-text-secondary)' }}
              >
                <span
                  className={`w-2 h-2 rounded-full ${isLoading ? 'animate-pulse' : ''}`}
                  style={{ backgroundColor: isLoading ? 'var(--noc-degraded)' : 'var(--noc-operational)' }}
                />
                <span>{formatLocalTime(lastUpdated)}</span>
              </div>
            )}

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
              <span>1h auto</span>
            </div>

            {/* Refresh button */}
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border transition-all hover:border-opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: 'var(--noc-bg-card)',
                borderColor: 'var(--noc-border)',
                color: 'var(--noc-text-primary)',
              }}
              title={lastUpdated ? `Last updated: ${formatLocalDateTime(lastUpdated)} ${timezone}` : 'Refresh data'}
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

            {/* GitHub link */}
            <a
              href="https://github.com/wbfoss/cf-status-dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-10 h-10 rounded-lg border transition-all hover:border-opacity-80"
              style={{
                backgroundColor: 'var(--noc-bg-card)',
                borderColor: 'var(--noc-border)',
                color: 'var(--noc-text-primary)',
              }}
              title="View on GitHub"
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
