'use client';

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
  ssr: false, // Map doesn't need SSR
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

export default function Dashboard() {
  const { data, isLoading, isError, refresh } = useCloudflareStatus();

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

        {/* World Map */}
        <section className="mb-5">
          <WorldMap components={components} />
        </section>

        {/* Incidents & Maintenance */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <IncidentsPanel incidents={incidents} />
          <MaintenancePanel maintenances={maintenances} />
        </section>

        {/* About Section */}
        <AboutSection />
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
