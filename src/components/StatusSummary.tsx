'use client';

import Link from 'next/link';
import { Component, Incident, ScheduledMaintenance } from '@/lib/types';
import { extractAirportCode } from '@/lib/datacenters';

interface StatusSummaryProps {
  components: Component[];
  incidents: Incident[];
  maintenances: ScheduledMaintenance[];
  statusIndicator: string;
  statusDescription: string;
}

export default function StatusSummary({
  components,
  incidents,
  maintenances,
}: StatusSummaryProps) {
  // Separate data centers from services
  const allItems = components.filter(c => !c.group);
  const dataCenters = allItems.filter(c => extractAirportCode(c.name));
  const coreServices = allItems.filter(c => !extractAirportCode(c.name));

  // DC Stats
  const dcOperational = dataCenters.filter(c => c.status === 'operational').length;
  const dcPartialOutage = dataCenters.filter(c => c.status === 'partial_outage').length;
  const dcMajorOutage = dataCenters.filter(c => c.status === 'major_outage').length;
  const dcMaintenance = dataCenters.filter(c => c.status === 'under_maintenance').length;
  const dcTotal = dataCenters.length;
  const dcIssues = dcPartialOutage + dcMajorOutage;

  // Service Stats
  const svcOperational = coreServices.filter(c => c.status === 'operational').length;
  const svcIssues = coreServices.filter(c => c.status !== 'operational').length;
  const svcTotal = coreServices.length;

  // DC status label
  const getDcStatusLabel = () => {
    if (dcIssues === 0 && dcMaintenance === 0) return 'All Operational';
    const parts = [];
    if (dcMajorOutage > 0) parts.push(`${dcMajorOutage} outage`);
    if (dcPartialOutage > 0) parts.push(`${dcPartialOutage} partial`);
    if (dcMaintenance > 0) parts.push(`${dcMaintenance} maintenance`);
    return parts.join(', ');
  };

  // Active incidents & maintenance
  const activeIncidents = incidents.filter(i =>
    ['investigating', 'identified', 'monitoring'].includes(i.status)
  ).length;
  const activeMaintenance = maintenances.filter(m =>
    ['scheduled', 'in_progress', 'verifying'].includes(m.status)
  ).length;

  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{
        backgroundColor: 'var(--noc-bg-card)',
        borderColor: 'var(--noc-border)',
      }}
    >
      {/* Desktop Stats */}
      <div className="hidden md:flex p-6 justify-between items-center gap-8">
        <Link href="/datacenters" className="group text-center hover:opacity-80 transition-opacity flex-1">
          <div className="text-3xl font-bold tabular-nums" style={{ color: 'var(--noc-operational)' }}>
            {dcOperational}<span className="text-lg font-normal" style={{ color: 'var(--noc-text-muted)' }}>/{dcTotal}</span>
          </div>
          <div className="text-xs flex items-center justify-center gap-1 mt-1" style={{ color: 'var(--noc-text-muted)' }}>
            Data Centers • {dcIssues > 0 || dcMaintenance > 0 ? (
              <span style={{ color: dcIssues > 0 ? 'var(--noc-partial)' : 'var(--noc-maintenance)' }}>{getDcStatusLabel()}</span>
            ) : 'All Operational'}
            <svg className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </div>
        </Link>

        <div className="w-px h-12" style={{ backgroundColor: 'var(--noc-border)' }} />

        <Link href="/services" className="group text-center hover:opacity-80 transition-opacity flex-1">
          <div className="text-3xl font-bold tabular-nums" style={{ color: 'var(--noc-operational)' }}>
            {svcOperational}<span className="text-lg font-normal" style={{ color: 'var(--noc-text-muted)' }}>/{svcTotal}</span>
          </div>
          <div className="text-xs flex items-center justify-center gap-1 mt-1" style={{ color: 'var(--noc-text-muted)' }}>
            Services • {svcIssues > 0 ? (
              <span style={{ color: 'var(--noc-major)' }}>{svcIssues} issue{svcIssues > 1 ? 's' : ''}</span>
            ) : 'All Operational'}
            <svg className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </div>
        </Link>

        <div className="w-px h-12" style={{ backgroundColor: 'var(--noc-border)' }} />

        <div className="text-center flex-1">
          <div className="text-3xl font-bold tabular-nums" style={{ color: activeIncidents > 0 ? 'var(--noc-major)' : 'var(--noc-operational)' }}>
            {activeIncidents}
          </div>
          <div className="text-xs mt-1" style={{ color: activeIncidents > 0 ? 'var(--noc-major)' : 'var(--noc-text-muted)' }}>
            {activeIncidents > 0 ? 'Active Incidents' : 'No Incidents'}
          </div>
        </div>

        {activeMaintenance > 0 && (
          <>
            <div className="w-px h-12" style={{ backgroundColor: 'var(--noc-border)' }} />
            <div className="text-center flex-1">
              <div className="text-3xl font-bold tabular-nums" style={{ color: 'var(--noc-maintenance)' }}>
                {activeMaintenance}
              </div>
              <div className="text-xs mt-1" style={{ color: 'var(--noc-maintenance)' }}>
                Maintenance
              </div>
            </div>
          </>
        )}
      </div>

      {/* Mobile Stats */}
      <div className="md:hidden p-4 grid grid-cols-3 gap-3">
        <Link href="/datacenters" className="text-center p-3 rounded-lg" style={{ backgroundColor: 'var(--noc-bg-secondary)' }}>
          <div className="text-xl font-bold tabular-nums" style={{ color: 'var(--noc-operational)' }}>
            {dcOperational}/{dcTotal}
          </div>
          <div className="text-[10px] uppercase tracking-wide leading-tight" style={{ color: dcIssues > 0 ? 'var(--noc-partial)' : 'var(--noc-text-muted)' }}>
            {dcIssues > 0 ? `${dcIssues} DC issues` : 'DCs OK'}
          </div>
        </Link>

        <Link href="/services" className="text-center p-3 rounded-lg" style={{ backgroundColor: 'var(--noc-bg-secondary)' }}>
          <div className="text-xl font-bold tabular-nums" style={{ color: 'var(--noc-operational)' }}>
            {svcOperational}/{svcTotal}
          </div>
          <div className="text-[10px] uppercase tracking-wide" style={{ color: svcIssues > 0 ? 'var(--noc-major)' : 'var(--noc-text-muted)' }}>
            {svcIssues > 0 ? `${svcIssues} issue${svcIssues > 1 ? 's' : ''}` : 'Services OK'}
          </div>
        </Link>

        <div className="text-center p-3 rounded-lg" style={{ backgroundColor: activeIncidents > 0 ? 'var(--noc-major-bg)' : 'var(--noc-bg-secondary)' }}>
          <div className="text-xl font-bold tabular-nums" style={{ color: activeIncidents > 0 ? 'var(--noc-major)' : 'var(--noc-operational)' }}>
            {activeIncidents}
          </div>
          <div className="text-[10px] uppercase tracking-wide" style={{ color: activeIncidents > 0 ? 'var(--noc-major)' : 'var(--noc-text-muted)' }}>
            Incidents
          </div>
        </div>
      </div>
    </div>
  );
}
