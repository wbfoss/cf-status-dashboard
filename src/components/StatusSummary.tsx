'use client';

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
  // Separate data centers (locations) from services
  const allItems = components.filter(c => !c.group);

  // Data centers have airport codes like (AMS), (LAX)
  const dataCenters = allItems.filter(c => extractAirportCode(c.name));
  const coreServices = allItems.filter(c => !extractAirportCode(c.name));

  // Data center stats
  const dcOperational = dataCenters.filter(c => c.status === 'operational').length;
  const dcDegraded = dataCenters.filter(c => c.status === 'degraded_performance').length;
  const dcOutage = dataCenters.filter(c => c.status === 'partial_outage' || c.status === 'major_outage').length;
  const dcMaintenance = dataCenters.filter(c => c.status === 'under_maintenance').length;
  const dcTotal = dataCenters.length;

  // Core services stats
  const svcOperational = coreServices.filter(c => c.status === 'operational').length;
  const svcIssues = coreServices.filter(c => c.status !== 'operational').length;
  const svcTotal = coreServices.length;

  // Active incidents
  const activeIncidents = incidents.filter(i =>
    ['investigating', 'identified', 'monitoring'].includes(i.status)
  ).length;

  // Active maintenance
  const activeMaintenance = maintenances.filter(m =>
    ['scheduled', 'in_progress', 'verifying'].includes(m.status)
  ).length;

  // Overall health percentage (based on data centers)
  const healthPercent = dcTotal > 0 ? Math.round((dcOperational / dcTotal) * 100) : 100;

  const isHealthy = statusIndicator === 'none';

  return (
    <div
      className="rounded-lg border overflow-hidden"
      style={{
        backgroundColor: 'var(--noc-bg-card)',
        borderColor: 'var(--noc-border)',
      }}
    >
      {/* Main Status Bar */}
      <div
        className="px-5 py-4 flex items-center gap-6"
        style={{
          background: isHealthy
            ? 'linear-gradient(135deg, rgba(63, 185, 80, 0.1) 0%, transparent 100%)'
            : 'linear-gradient(135deg, rgba(248, 81, 73, 0.1) 0%, transparent 100%)',
        }}
      >
        {/* Status Indicator */}
        <div className="flex items-center gap-4">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center ${isHealthy ? 'pulse-operational' : 'pulse-outage'}`}
            style={{ backgroundColor: getStatusColor(statusIndicator) }}
          >
            {isHealthy ? (
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01" />
              </svg>
            )}
          </div>
          <div>
            <div className="font-bold text-lg" style={{ color: getStatusColor(statusIndicator) }}>
              {statusDescription}
            </div>
            <div className="text-xs" style={{ color: 'var(--noc-text-muted)' }}>
              Cloudflare Global Network
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-10 w-px hidden md:block" style={{ backgroundColor: 'var(--noc-border)' }} />

        {/* Quick Stats */}
        <div className="flex-1 hidden md:grid grid-cols-4 gap-4">
          <QuickStat
            label="Network Health"
            value={`${healthPercent}%`}
            color={healthPercent >= 95 ? 'var(--noc-operational)' : healthPercent >= 80 ? 'var(--noc-degraded)' : 'var(--noc-major)'}
          />
          <QuickStat
            label="Data Centers"
            value={`${dcOperational}/${dcTotal}`}
            sublabel="operational"
            color="var(--noc-operational)"
          />
          <QuickStat
            label="Core Services"
            value={`${svcOperational}/${svcTotal}`}
            sublabel={svcIssues > 0 ? `${svcIssues} issue${svcIssues > 1 ? 's' : ''}` : 'all operational'}
            color={svcIssues > 0 ? 'var(--noc-major)' : 'var(--noc-operational)'}
          />
          <QuickStat
            label="Active Incidents"
            value={activeIncidents}
            sublabel={activeMaintenance > 0 ? `+${activeMaintenance} maintenance` : 'monitoring'}
            color={activeIncidents > 0 ? 'var(--noc-major)' : 'var(--noc-operational)'}
          />
        </div>
      </div>

      {/* Status Breakdown Bar */}
      <div
        className="px-5 py-3 border-t flex flex-wrap items-center gap-x-6 gap-y-2"
        style={{
          backgroundColor: 'var(--noc-bg-secondary)',
          borderColor: 'var(--noc-border)',
        }}
      >
        {/* Progress Bar */}
        <div className="flex-1 min-w-[200px]">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs" style={{ color: 'var(--noc-text-muted)' }}>Data Center Status</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden flex" style={{ backgroundColor: 'var(--noc-bg-primary)' }}>
            {dcOperational > 0 && (
              <div
                className="h-full"
                style={{
                  width: `${(dcOperational / dcTotal) * 100}%`,
                  backgroundColor: 'var(--noc-operational)',
                }}
              />
            )}
            {dcDegraded > 0 && (
              <div
                className="h-full"
                style={{
                  width: `${(dcDegraded / dcTotal) * 100}%`,
                  backgroundColor: 'var(--noc-degraded)',
                }}
              />
            )}
            {dcOutage > 0 && (
              <div
                className="h-full"
                style={{
                  width: `${(dcOutage / dcTotal) * 100}%`,
                  backgroundColor: 'var(--noc-major)',
                }}
              />
            )}
            {dcMaintenance > 0 && (
              <div
                className="h-full"
                style={{
                  width: `${(dcMaintenance / dcTotal) * 100}%`,
                  backgroundColor: 'var(--noc-maintenance)',
                }}
              />
            )}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs">
          <LegendItem color="var(--noc-operational)" label="Operational" value={dcOperational} />
          {dcDegraded > 0 && <LegendItem color="var(--noc-degraded)" label="Degraded" value={dcDegraded} />}
          {dcOutage > 0 && <LegendItem color="var(--noc-major)" label="Outage" value={dcOutage} />}
          {dcMaintenance > 0 && <LegendItem color="var(--noc-maintenance)" label="Maintenance" value={dcMaintenance} />}
        </div>
      </div>
    </div>
  );
}

function QuickStat({
  label,
  value,
  sublabel,
  color,
}: {
  label: string;
  value: string | number;
  sublabel?: string;
  color: string;
}) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider mb-0.5" style={{ color: 'var(--noc-text-muted)' }}>
        {label}
      </div>
      <div className="text-xl font-bold tabular-nums" style={{ color }}>
        {value}
      </div>
      {sublabel && (
        <div className="text-[10px]" style={{ color: 'var(--noc-text-muted)' }}>
          {sublabel}
        </div>
      )}
    </div>
  );
}

function LegendItem({ color, label, value }: { color: string; label: string; value: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
      <span style={{ color: 'var(--noc-text-secondary)' }}>{label}</span>
      <span className="font-semibold" style={{ color }}>{value}</span>
    </div>
  );
}
