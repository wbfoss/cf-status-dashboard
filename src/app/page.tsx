'use client';

import { useCloudflareStatus } from '@/lib/api';
import {
  Header,
  StatusHero,
  MetricCard,
  ComponentsGrid,
  IncidentsPanel,
  MaintenancePanel,
} from '@/components';

export default function Dashboard() {
  const { data, isLoading, isError, refresh } = useCloudflareStatus();

  // Calculate metrics
  const components = data?.components || [];
  const incidents = data?.incidents || [];
  const maintenances = data?.scheduled_maintenances || [];

  const operationalCount = components.filter(c => c.status === 'operational' && !c.group_id).length;
  const degradedCount = components.filter(c => c.status === 'degraded_performance' && !c.group_id).length;
  const outageCount = components.filter(c =>
    (c.status === 'partial_outage' || c.status === 'major_outage') && !c.group_id
  ).length;
  const totalComponents = components.filter(c => !c.group_id).length;

  const activeIncidents = incidents.filter(i =>
    ['investigating', 'identified', 'monitoring'].includes(i.status)
  ).length;

  const scheduledMaintenance = maintenances.filter(m =>
    ['scheduled', 'in_progress', 'verifying'].includes(m.status)
  ).length;

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div
            className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
            style={{ backgroundColor: 'var(--noc-major-bg)' }}
          >
            <svg
              className="w-8 h-8"
              style={{ color: 'var(--noc-major)' }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--noc-major)' }}>
            Failed to Load Status
          </h2>
          <p className="text-sm mb-4" style={{ color: 'var(--noc-text-secondary)' }}>
            Unable to fetch Cloudflare status data
          </p>
          <button
            onClick={() => refresh()}
            className="px-4 py-2 rounded-lg font-medium"
            style={{
              backgroundColor: 'var(--noc-accent)',
              color: 'white',
            }}
          >
            Try Again
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
        onRefresh={() => refresh()}
      />

      <main className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Status Hero */}
        <section className="mb-6">
          <StatusHero
            indicator={data?.status?.indicator || 'none'}
            description={data?.status?.description || 'Loading...'}
          />
        </section>

        {/* Metrics Row */}
        <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <MetricCard
            title="Operational"
            value={operationalCount}
            subtitle={`of ${totalComponents} services`}
            color="var(--noc-operational)"
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            }
          />
          <MetricCard
            title="Degraded"
            value={degradedCount}
            subtitle="performance issues"
            color={degradedCount > 0 ? 'var(--noc-degraded)' : 'var(--noc-text-secondary)'}
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
              </svg>
            }
          />
          <MetricCard
            title="Outage"
            value={outageCount}
            subtitle="service disruptions"
            color={outageCount > 0 ? 'var(--noc-major)' : 'var(--noc-text-secondary)'}
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <MetricCard
            title="Active Incidents"
            value={activeIncidents}
            subtitle="being investigated"
            color={activeIncidents > 0 ? 'var(--noc-major)' : 'var(--noc-text-secondary)'}
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            }
          />
          <MetricCard
            title="Maintenance"
            value={scheduledMaintenance}
            subtitle="windows scheduled"
            color={scheduledMaintenance > 0 ? 'var(--noc-maintenance)' : 'var(--noc-text-secondary)'}
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            }
          />
          <MetricCard
            title="Uptime"
            value="99.9%"
            subtitle="last 30 days"
            color="var(--noc-operational)"
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            }
          />
        </section>

        {/* Components Grid */}
        <section className="mb-6">
          <ComponentsGrid components={components} />
        </section>

        {/* Incidents & Maintenance */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <IncidentsPanel incidents={incidents} />
          <MaintenancePanel maintenances={maintenances} />
        </section>
      </main>

      {/* Footer */}
      <footer
        className="border-t mt-8 py-6"
        style={{
          backgroundColor: 'var(--noc-bg-secondary)',
          borderColor: 'var(--noc-border)',
        }}
      >
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm" style={{ color: 'var(--noc-text-muted)' }}>
              Data sourced from{' '}
              <a
                href="https://www.cloudflarestatus.com"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:no-underline"
                style={{ color: 'var(--noc-accent)' }}
              >
                cloudflarestatus.com
              </a>
            </p>
            <p className="text-sm" style={{ color: 'var(--noc-text-muted)' }}>
              Auto-refreshes every 5 minutes
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
