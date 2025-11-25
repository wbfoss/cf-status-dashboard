'use client';

import Link from 'next/link';
import { Component, Incident, ScheduledMaintenance } from '@/lib/types';
import { extractAirportCode } from '@/lib/datacenters';
import { getStatusColor } from '@/lib/api';

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
  statusIndicator,
  statusDescription,
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

  // Simple status - use API description or fallback
  const isHealthy = statusIndicator === 'none';
  const displayStatus = isHealthy ? 'All Systems Operational' : statusDescription;

  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{
        backgroundColor: 'var(--noc-bg-card)',
        borderColor: 'var(--noc-border)',
      }}
    >
      {/* Main Status */}
      <div
        className="p-6"
        style={{
          background: isHealthy
            ? 'linear-gradient(135deg, rgba(63, 185, 80, 0.08) 0%, transparent 100%)'
            : 'linear-gradient(135deg, rgba(248, 81, 73, 0.08) 0%, transparent 100%)',
        }}
      >
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          {/* Status Icon & Text */}
          <div className="flex items-center gap-4">
            <div
              className={`w-14 h-14 rounded-full flex items-center justify-center ${
                isHealthy ? 'pulse-operational' : 'pulse-outage'
              }`}
              style={{ backgroundColor: getStatusColor(statusIndicator) }}
            >
              {isHealthy ? (
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              )}
            </div>
            <div>
              <h1 className="text-xl font-bold" style={{ color: getStatusColor(statusIndicator) }}>
                {displayStatus}
              </h1>
              <p className="text-sm mt-0.5" style={{ color: 'var(--noc-text-muted)' }}>
                Cloudflare Global Network
              </p>
            </div>
          </div>

          {/* Stats Grid - Desktop */}
          <div className="hidden md:flex flex-1 justify-end gap-8">
            <Link href="/datacenters" className="group text-center hover:opacity-80 transition-opacity">
              <div className="text-2xl font-bold tabular-nums" style={{ color: dcIssues > 0 ? 'var(--noc-partial)' : 'var(--noc-operational)' }}>
                {dcOperational}<span className="text-base font-normal" style={{ color: 'var(--noc-text-muted)' }}>/{dcTotal}</span>
              </div>
              <div className="text-xs flex items-center justify-center gap-1" style={{ color: dcIssues > 0 ? 'var(--noc-partial)' : 'var(--noc-text-muted)' }}>
                {getDcStatusLabel()}
                <svg className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </div>
            </Link>

            <Link href="/services" className="group text-center hover:opacity-80 transition-opacity">
              <div className="text-2xl font-bold tabular-nums" style={{ color: svcIssues > 0 ? 'var(--noc-major)' : 'var(--noc-operational)' }}>
                {svcOperational}<span className="text-base font-normal" style={{ color: 'var(--noc-text-muted)' }}>/{svcTotal}</span>
              </div>
              <div className="text-xs flex items-center justify-center gap-1" style={{ color: svcIssues > 0 ? 'var(--noc-major)' : 'var(--noc-text-muted)' }}>
                {svcIssues > 0 ? `${svcIssues} Service Issue${svcIssues > 1 ? 's' : ''}` : 'Services'}
                <svg className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </div>
            </Link>

            <div className="text-center">
              <div className="text-2xl font-bold tabular-nums" style={{ color: activeIncidents > 0 ? 'var(--noc-major)' : 'var(--noc-operational)' }}>
                {activeIncidents}
              </div>
              <div className="text-xs" style={{ color: activeIncidents > 0 ? 'var(--noc-major)' : 'var(--noc-text-muted)' }}>
                {activeIncidents > 0 ? 'Active Incidents' : 'No Incidents'}
              </div>
            </div>

            {activeMaintenance > 0 && (
              <div className="text-center">
                <div className="text-2xl font-bold tabular-nums" style={{ color: 'var(--noc-maintenance)' }}>
                  {activeMaintenance}
                </div>
                <div className="text-xs" style={{ color: 'var(--noc-maintenance)' }}>
                  Maintenance
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Stats */}
        <div className="md:hidden mt-5 grid grid-cols-3 gap-4">
          <Link href="/datacenters" className="text-center p-3 rounded-lg" style={{ backgroundColor: dcIssues > 0 ? 'var(--noc-partial-bg)' : 'var(--noc-bg-secondary)' }}>
            <div className="text-xl font-bold tabular-nums" style={{ color: dcIssues > 0 ? 'var(--noc-partial)' : 'var(--noc-operational)' }}>
              {dcOperational}/{dcTotal}
            </div>
            <div className="text-[10px] uppercase tracking-wide leading-tight" style={{ color: dcIssues > 0 ? 'var(--noc-partial)' : 'var(--noc-text-muted)' }}>
              {dcIssues > 0 ? `${dcIssues} issues` : 'DCs OK'}
            </div>
          </Link>

          <Link href="/services" className="text-center p-3 rounded-lg" style={{ backgroundColor: svcIssues > 0 ? 'var(--noc-major-bg)' : 'var(--noc-bg-secondary)' }}>
            <div className="text-xl font-bold tabular-nums" style={{ color: svcIssues > 0 ? 'var(--noc-major)' : 'var(--noc-operational)' }}>
              {svcOperational}/{svcTotal}
            </div>
            <div className="text-[10px] uppercase tracking-wide" style={{ color: svcIssues > 0 ? 'var(--noc-major)' : 'var(--noc-text-muted)' }}>
              Services
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
    </div>
  );
}
