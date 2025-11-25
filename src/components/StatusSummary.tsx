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
  // Separate data centers (locations) from services
  const allItems = components.filter(c => !c.group);

  // Data centers have airport codes like (AMS), (LAX)
  const dataCenters = allItems.filter(c => extractAirportCode(c.name));
  const coreServices = allItems.filter(c => !extractAirportCode(c.name));

  // Data center stats
  const dcOperational = dataCenters.filter(c => c.status === 'operational').length;
  const dcDegraded = dataCenters.filter(c => c.status === 'degraded_performance').length;
  const dcPartialOutage = dataCenters.filter(c => c.status === 'partial_outage').length;
  const dcMajorOutage = dataCenters.filter(c => c.status === 'major_outage').length;
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
  // Simple calculation: Operational DCs / Total active DCs (excluding planned maintenance)
  const activeDCs = dcTotal - dcMaintenance; // DCs that should be operational
  const healthPercent = activeDCs > 0 ? Math.round((dcOperational / activeDCs) * 100) : 100;

  // Determine overall status level
  const isHealthy = statusIndicator === 'none';
  const isMinor = statusIndicator === 'minor'; // Partial outage level
  const isMajor = statusIndicator === 'major' || statusIndicator === 'critical'; // Major/Critical level

  // Compute accurate status description based on actual component status
  const computedStatus = (() => {
    const allServicesUp = svcIssues === 0;
    const dcIssues = dcPartialOutage + dcMajorOutage + dcDegraded;

    // All operational
    if (allServicesUp && dcIssues === 0 && dcMaintenance === 0) {
      return { text: 'All Systems Operational', indicator: 'none' };
    }

    // Only maintenance, no outages
    if (allServicesUp && dcIssues === 0 && dcMaintenance > 0) {
      return { text: `Scheduled Maintenance (${dcMaintenance} DCs)`, indicator: 'none' };
    }

    // Services have issues - this is serious
    if (!allServicesUp) {
      if (isMajor) {
        return { text: statusDescription, indicator: statusIndicator }; // Use API description for major issues
      }
      return { text: `Service Degradation (${svcIssues} affected)`, indicator: 'major' };
    }

    // All services up but DC issues exist
    if (allServicesUp && dcIssues > 0) {
      if (dcMajorOutage > 0) {
        return { text: `Data Center Outages (${dcMajorOutage} major, ${dcPartialOutage} partial)`, indicator: 'major' };
      }
      if (dcPartialOutage > 0) {
        const maintText = dcMaintenance > 0 ? ` + ${dcMaintenance} maintenance` : '';
        return { text: `Partial DC Outages (${dcPartialOutage} affected${maintText})`, indicator: 'minor' };
      }
      if (dcDegraded > 0) {
        return { text: `DC Performance Degraded (${dcDegraded} affected)`, indicator: 'minor' };
      }
    }

    // Fallback to API description
    return { text: statusDescription, indicator: statusIndicator };
  })();

  // Use computed status for display
  const displayStatus = computedStatus.text;
  const displayIndicator = computedStatus.indicator;

  // Recalculate display flags based on computed indicator
  const displayIsHealthy = displayIndicator === 'none';
  const displayIsMinor = displayIndicator === 'minor';

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
          background: displayIsHealthy
            ? 'linear-gradient(135deg, rgba(63, 185, 80, 0.1) 0%, transparent 100%)' // Green for operational
            : displayIsMinor
            ? 'linear-gradient(135deg, rgba(219, 109, 40, 0.1) 0%, transparent 100%)' // Orange for partial outage
            : 'linear-gradient(135deg, rgba(248, 81, 73, 0.1) 0%, transparent 100%)', // Red for major/critical
        }}
      >
        {/* Status Indicator */}
        <div className="flex items-center gap-4">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center ${
              displayIsHealthy ? 'pulse-operational' : displayIsMinor ? 'pulse-partial' : 'pulse-outage'
            }`}
            style={{ backgroundColor: getStatusColor(displayIndicator) }}
          >
            {displayIsHealthy ? (
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
            <div className="font-bold text-lg" style={{ color: getStatusColor(displayIndicator) }}>
              {displayStatus}
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
            color={
              healthPercent >= 95
                ? 'var(--noc-operational)' // Green: 95-100%
                : healthPercent >= 85
                ? 'var(--noc-degraded)' // Yellow: 85-94%
                : healthPercent >= 70
                ? 'var(--noc-partial)' // Orange: 70-84%
                : 'var(--noc-major)' // Red: below 70%
            }
          />
          <Link href="/datacenters" className="group">
            <QuickStat
              label="Data Centers"
              value={`${dcOperational}/${dcTotal}`}
              sublabel="operational"
              color="var(--noc-operational)"
              clickable
            />
          </Link>
          <Link href="/services" className="group">
            <QuickStat
              label="Core Services"
              value={`${svcOperational}/${svcTotal}`}
              sublabel={svcIssues > 0 ? `${svcIssues} issue${svcIssues > 1 ? 's' : ''}` : 'all operational'}
              color={svcIssues > 0 ? 'var(--noc-major)' : 'var(--noc-operational)'}
              clickable
              highlighted={svcIssues > 0}
            />
          </Link>
          <QuickStat
            label="Active Incidents"
            value={activeIncidents}
            sublabel={activeMaintenance > 0 ? `+${activeMaintenance} maintenance` : 'monitoring'}
            color={activeIncidents > 0 ? 'var(--noc-major)' : 'var(--noc-operational)'}
            highlighted={activeIncidents > 0}
          />
        </div>
      </div>

      {/* Mobile Stats Links */}
      <div
        className="md:hidden px-5 py-3 border-t flex flex-col gap-3"
        style={{ borderColor: 'var(--noc-border)', backgroundColor: 'var(--noc-bg-secondary)' }}
      >
        {/* Active Incidents - Always shown first on mobile when there are incidents */}
        {activeIncidents > 0 && (
          <div
            className="p-3 rounded-lg border-2 pulse-outage"
            style={{
              backgroundColor: 'var(--noc-major-bg)',
              borderColor: 'var(--noc-major)',
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: 'var(--noc-major)' }}
                >
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--noc-major)' }}>
                    Active Incidents
                  </div>
                  <div className="text-2xl font-bold" style={{ color: 'var(--noc-major)' }}>
                    {activeIncidents}
                  </div>
                </div>
              </div>
              {activeMaintenance > 0 && (
                <div className="text-right">
                  <div className="text-[10px]" style={{ color: 'var(--noc-text-muted)' }}>+ maintenance</div>
                  <div className="text-lg font-bold" style={{ color: 'var(--noc-maintenance)' }}>{activeMaintenance}</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Core Services Alert - Show prominently when there are issues */}
        {svcIssues > 0 && (
          <Link
            href="/services"
            className="p-3 rounded-lg border-2 pulse-outage"
            style={{
              backgroundColor: 'var(--noc-major-bg)',
              borderColor: 'var(--noc-major)',
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: 'var(--noc-major)' }}
                >
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016zM12 9v2m0 4h.01" />
                  </svg>
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--noc-major)' }}>
                    Service Outage
                  </div>
                  <div className="text-lg font-bold" style={{ color: 'var(--noc-major)' }}>
                    {svcIssues} service{svcIssues > 1 ? 's' : ''} affected
                  </div>
                </div>
              </div>
              <svg className="w-5 h-5" style={{ color: 'var(--noc-major)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        )}

        {/* Regular stats grid */}
        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/datacenters"
            className="flex items-center justify-between p-3 rounded-lg border transition-colors hover:border-opacity-80"
            style={{ backgroundColor: 'var(--noc-bg-card)', borderColor: 'var(--noc-border)' }}
          >
            <div>
              <div className="text-xs" style={{ color: 'var(--noc-text-muted)' }}>Data Centers</div>
              <div className="text-lg font-bold" style={{ color: 'var(--noc-operational)' }}>{dcOperational}/{dcTotal}</div>
            </div>
            <svg className="w-4 h-4" style={{ color: 'var(--noc-text-muted)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          {/* Only show services card if no issues (otherwise shown above prominently) */}
          {svcIssues === 0 ? (
            <Link
              href="/services"
              className="flex items-center justify-between p-3 rounded-lg border transition-colors hover:border-opacity-80"
              style={{ backgroundColor: 'var(--noc-bg-card)', borderColor: 'var(--noc-border)' }}
            >
              <div>
                <div className="text-xs" style={{ color: 'var(--noc-text-muted)' }}>Core Services</div>
                <div className="text-lg font-bold" style={{ color: 'var(--noc-operational)' }}>{svcOperational}/{svcTotal}</div>
              </div>
              <svg className="w-4 h-4" style={{ color: 'var(--noc-text-muted)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ) : (
            /* Show network health instead when services have issues */
            <div
              className="flex items-center justify-between p-3 rounded-lg border"
              style={{ backgroundColor: 'var(--noc-bg-card)', borderColor: 'var(--noc-border)' }}
            >
              <div>
                <div className="text-xs" style={{ color: 'var(--noc-text-muted)' }}>Network Health</div>
                <div className="text-lg font-bold" style={{
                  color: healthPercent >= 95 ? 'var(--noc-operational)' :
                    healthPercent >= 85 ? 'var(--noc-degraded)' :
                    healthPercent >= 70 ? 'var(--noc-partial)' : 'var(--noc-major)'
                }}>{healthPercent}%</div>
              </div>
            </div>
          )}
        </div>

        {/* Show incidents count when no active incidents (for context) */}
        {activeIncidents === 0 && (
          <div
            className="p-3 rounded-lg border flex items-center justify-between"
            style={{ backgroundColor: 'var(--noc-bg-card)', borderColor: 'var(--noc-border)' }}
          >
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ backgroundColor: 'var(--noc-operational-bg)' }}
              >
                <svg className="w-4 h-4" style={{ color: 'var(--noc-operational)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <div className="text-xs" style={{ color: 'var(--noc-text-muted)' }}>Active Incidents</div>
                <div className="text-sm font-semibold" style={{ color: 'var(--noc-operational)' }}>None</div>
              </div>
            </div>
            {activeMaintenance > 0 && (
              <div className="text-right">
                <div className="text-[10px]" style={{ color: 'var(--noc-text-muted)' }}>Maintenance</div>
                <div className="text-sm font-semibold" style={{ color: 'var(--noc-maintenance)' }}>{activeMaintenance}</div>
              </div>
            )}
          </div>
        )}
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
            {dcPartialOutage > 0 && (
              <div
                className="h-full"
                style={{
                  width: `${(dcPartialOutage / dcTotal) * 100}%`,
                  backgroundColor: 'var(--noc-partial)',
                }}
              />
            )}
            {dcMajorOutage > 0 && (
              <div
                className="h-full"
                style={{
                  width: `${(dcMajorOutage / dcTotal) * 100}%`,
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
        <div className="flex items-center gap-4 text-xs flex-wrap">
          <LegendItem color="var(--noc-operational)" label="Operational" value={dcOperational} />
          {dcDegraded > 0 && <LegendItem color="var(--noc-degraded)" label="Degraded" value={dcDegraded} />}
          {dcPartialOutage > 0 && <LegendItem color="var(--noc-partial)" label="Partial Outage" value={dcPartialOutage} />}
          {dcMajorOutage > 0 && <LegendItem color="var(--noc-major)" label="Major Outage" value={dcMajorOutage} />}
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
  clickable,
  highlighted,
}: {
  label: string;
  value: string | number;
  sublabel?: string;
  color: string;
  clickable?: boolean;
  highlighted?: boolean;
}) {
  return (
    <div
      className={`${clickable ? 'group-hover:opacity-80 transition-opacity' : ''} ${
        highlighted ? 'px-3 py-2 rounded-lg pulse-outage' : ''
      }`}
      style={highlighted ? {
        backgroundColor: 'var(--noc-major-bg)',
        border: '1px solid var(--noc-major)',
      } : undefined}
    >
      <div
        className="text-[10px] uppercase tracking-wider mb-0.5 flex items-center gap-1"
        style={{ color: highlighted ? color : 'var(--noc-text-muted)' }}
      >
        {highlighted && (
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01" />
          </svg>
        )}
        {label}
        {clickable && (
          <svg className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        )}
      </div>
      <div className="text-xl font-bold tabular-nums" style={{ color }}>
        {value}
      </div>
      {sublabel && (
        <div className="text-[10px]" style={{ color: highlighted ? color : 'var(--noc-text-muted)' }}>
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
