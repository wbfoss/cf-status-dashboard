'use client';

import { useCloudflareStatus } from '@/lib/api';
import {
  Header,
  StatusHero,
  MetricCard,
  StatusChart,
  ComponentsGrid,
  IncidentsPanel,
  MaintenancePanel,
} from '@/components';

export default function Dashboard() {
  const { data, isLoading, isError, refresh } = useCloudflareStatus();

  const components = data?.components || [];
  const incidents = data?.incidents || [];
  const maintenances = data?.scheduled_maintenances || [];

  // Filter to only count non-group components (actual services)
  const services = components.filter(c => !c.group);

  const operationalCount = services.filter(c => c.status === 'operational').length;
  const degradedCount = services.filter(c => c.status === 'degraded_performance').length;
  const outageCount = services.filter(c =>
    c.status === 'partial_outage' || c.status === 'major_outage'
  ).length;
  const maintenanceCount = services.filter(c => c.status === 'under_maintenance').length;

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
        onRefresh={() => refresh()}
      />

      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 py-5">
        {/* Top Row: Status + Metrics + Chart */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-5">
          <div className="lg:col-span-2">
            <StatusHero
              indicator={data?.status?.indicator || 'none'}
              description={data?.status?.description || 'Loading...'}
            />
          </div>
          <MetricCard
            title="Services"
            value={`${operationalCount}/${services.length}`}
            subtitle="operational"
            color="var(--noc-operational)"
          />
          <MetricCard
            title="Issues"
            value={degradedCount + outageCount + activeIncidents}
            subtitle={activeIncidents > 0 ? `${activeIncidents} incident${activeIncidents > 1 ? 's' : ''}` : 'none active'}
            color={degradedCount + outageCount + activeIncidents > 0 ? 'var(--noc-major)' : 'var(--noc-operational)'}
          />
          <StatusChart
            operational={operationalCount}
            degraded={degradedCount}
            outage={outageCount}
            maintenance={maintenanceCount}
          />
        </div>

        {/* Components */}
        <section className="mb-5">
          <ComponentsGrid components={components} />
        </section>

        {/* Incidents & Maintenance */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <IncidentsPanel incidents={incidents} />
          <MaintenancePanel maintenances={maintenances} />
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-4 mt-6" style={{ borderColor: 'var(--noc-border)' }}>
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 flex items-center justify-between text-xs" style={{ color: 'var(--noc-text-muted)' }}>
          <span>
            Source:{' '}
            <a href="https://www.cloudflarestatus.com" target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: 'var(--noc-accent)' }}>
              cloudflarestatus.com
            </a>
          </span>
          <span>Auto-refresh: 5min</span>
        </div>
      </footer>
    </div>
  );
}
