'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useCloudflareStatus } from '@/lib/api';
import { Header } from '@/components';
import {
  StatusSummarySkeleton,
  MapSkeleton,
  PanelSkeleton,
} from '@/components/Skeleton';

// Lazy load heavy components
const StatusSummary = dynamic(() => import('@/components/StatusSummary'), {
  loading: () => <StatusSummarySkeleton />,
  ssr: false,
});

const WorldMap = dynamic(() => import('@/components/WorldMap'), {
  loading: () => <MapSkeleton />,
  ssr: false,
});

const Globe3D = dynamic(() => import('@/components/Globe3D'), {
  loading: () => <MapSkeleton />,
  ssr: false,
});

const IncidentsPanel = dynamic(() => import('@/components/IncidentsPanel'), {
  loading: () => <PanelSkeleton />,
  ssr: false,
});

const MaintenancePanel = dynamic(() => import('@/components/MaintenancePanel'), {
  loading: () => <PanelSkeleton />,
  ssr: false,
});

const AboutSection = dynamic(() => import('@/components/AboutSection'), {
  ssr: false,
});

const ShareToolbar = dynamic(() => import('@/components/ShareToolbar'), {
  ssr: false,
});

type ViewMode = 'globe' | 'map';

export default function Dashboard() {
  const { data, isLoading, isError, refresh } = useCloudflareStatus();
  const [viewMode, setViewMode] = useState<ViewMode>('globe');

  const components = data?.components || [];
  const incidents = data?.incidents || [];
  const maintenances = data?.scheduled_maintenances || [];

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div
            className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center"
            style={{ backgroundColor: 'var(--noc-major-bg)' }}
          >
            <svg className="w-7 h-7" style={{ color: 'var(--noc-major)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold mb-2" style={{ color: 'var(--noc-major)' }}>
            Connection Error
          </h2>
          <p className="text-sm mb-4" style={{ color: 'var(--noc-text-secondary)' }}>
            Unable to fetch status data
          </p>
          <button
            onClick={() => refresh()}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-opacity hover:opacity-80"
            style={{ backgroundColor: 'var(--noc-accent)', color: 'white' }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen noc-grid-bg">
      <Header
        lastUpdated={data?.page?.updated_at || null}
        isLoading={isLoading}
      />

      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 py-5">
        {/* Status Summary */}
        <section className="mb-5">
          <StatusSummary
            components={components}
            incidents={incidents}
            maintenances={maintenances}
            statusIndicator={data?.status?.indicator || 'none'}
            statusDescription={data?.status?.description || 'Loading...'}
          />
        </section>

        {/* Globe/Map View */}
        <section className="mb-5">
          {/* View Toggle */}
          <div className="flex items-center justify-end mb-3">
            <div
              className="inline-flex rounded-lg p-1"
              style={{ backgroundColor: 'var(--noc-bg-card)', border: '1px solid var(--noc-border)' }}
            >
              <button
                onClick={() => setViewMode('globe')}
                className="flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all"
                style={{
                  backgroundColor: viewMode === 'globe' ? 'var(--noc-accent)' : 'transparent',
                  color: viewMode === 'globe' ? 'white' : 'var(--noc-text-secondary)',
                }}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                3D Globe
              </button>
              <button
                onClick={() => setViewMode('map')}
                className="flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all"
                style={{
                  backgroundColor: viewMode === 'map' ? 'var(--noc-accent)' : 'transparent',
                  color: viewMode === 'map' ? 'white' : 'var(--noc-text-secondary)',
                }}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                2D Map
              </button>
            </div>
          </div>

          {/* View Container */}
          {viewMode === 'globe' ? (
            <div
              className="rounded-lg border overflow-hidden h-[400px] sm:h-[500px] lg:h-[600px]"
              style={{
                backgroundColor: '#000',
                borderColor: 'var(--noc-border)',
              }}
            >
              <Globe3D components={components} />
            </div>
          ) : (
            <WorldMap components={components} />
          )}
        </section>

        {/* Incidents & Maintenance */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <IncidentsPanel incidents={incidents} />
          <MaintenancePanel maintenances={maintenances} />
        </section>

        {/* About Section */}
        <AboutSection />

        {/* Share Toolbar */}
        <ShareToolbar />
      </main>

      {/* Footer */}
      <footer className="border-t py-4 mt-6" style={{ borderColor: 'var(--noc-border)' }}>
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs" style={{ color: 'var(--noc-text-muted)' }}>
            <div className="flex items-center gap-4">
              <span>
                Source:{' '}
                <a href="https://www.cloudflarestatus.com" target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: 'var(--noc-accent)' }}>
                  cloudflarestatus.com
                </a>
              </span>
              <span className="hidden sm:inline">•</span>
              <span>Auto-refresh: 30m</span>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <span>
                An open source project by{' '}
                <a href="https://wbfoss.org" target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: 'var(--noc-accent)' }}>
                  wbfoss.org
                </a>
              </span>
              <span className="hidden sm:inline">•</span>
              <span
                className="px-2 py-1 rounded text-[11px] font-medium"
                style={{
                  backgroundColor: 'var(--noc-major-bg)',
                  color: 'var(--noc-major)',
                  border: '1px solid var(--noc-major)'
                }}
              >
                Not affiliated with <a href="https://cloudflare.com" target="_blank" rel="noopener noreferrer" className="underline hover:no-underline">Cloudflare, Inc.</a>
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
