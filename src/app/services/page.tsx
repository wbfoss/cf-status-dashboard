'use client';

import Link from 'next/link';
import { useCloudflareStatus, getStatusColor, getStatusLabel } from '@/lib/api';
import { extractAirportCode } from '@/lib/datacenters';
import { Component } from '@/lib/types';

export default function ServicesPage() {
  const { data, isLoading, isError, refresh } = useCloudflareStatus();

  const components = data?.components || [];

  // Filter to get only core services (non-group, without airport codes)
  const services = components
    .filter(c => !c.group && !extractAirportCode(c.name))
    .sort((a, b) => {
      // Sort by status priority, then name
      const statusOrder: Record<string, number> = {
        major_outage: 0,
        partial_outage: 1,
        degraded_performance: 2,
        under_maintenance: 3,
        operational: 4,
      };
      const orderDiff = (statusOrder[a.status] ?? 5) - (statusOrder[b.status] ?? 5);
      if (orderDiff !== 0) return orderDiff;
      return a.name.localeCompare(b.name);
    });

  // Count by status
  const statusCounts = {
    operational: services.filter(s => s.status === 'operational').length,
    degraded: services.filter(s => s.status === 'degraded_performance').length,
    partial: services.filter(s => s.status === 'partial_outage').length,
    major: services.filter(s => s.status === 'major_outage').length,
    maintenance: services.filter(s => s.status === 'under_maintenance').length,
  };

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-semibold mb-2" style={{ color: 'var(--noc-major)' }}>
            Connection Error
          </h2>
          <button
            onClick={() => refresh()}
            className="px-4 py-2 rounded-lg text-sm font-medium"
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
      {/* Header */}
      <header
        className="border-b sticky top-0 z-50 backdrop-blur-sm"
        style={{
          backgroundColor: 'rgba(10, 14, 20, 0.9)',
          borderColor: 'var(--noc-border)',
        }}
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <div className="h-14 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="flex items-center gap-2 text-sm hover:opacity-80 transition-opacity"
                style={{ color: 'var(--noc-text-secondary)' }}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Dashboard
              </Link>
            </div>
            <h1 className="text-lg font-semibold" style={{ color: 'var(--noc-text-primary)' }}>
              Core Services
            </h1>
            <div className="w-32" /> {/* Spacer for centering */}
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6">
        {/* Summary Stats */}
        <div
          className="rounded-lg border p-4 mb-6"
          style={{
            backgroundColor: 'var(--noc-bg-card)',
            borderColor: 'var(--noc-border)',
          }}
        >
          <div className="flex flex-wrap items-center gap-6">
            <div className="text-2xl font-bold" style={{ color: 'var(--noc-text-primary)' }}>
              {services.length} <span className="text-sm font-normal" style={{ color: 'var(--noc-text-muted)' }}>services</span>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <StatusBadge color="var(--noc-operational)" label="Operational" count={statusCounts.operational} />
              {statusCounts.degraded > 0 && <StatusBadge color="var(--noc-degraded)" label="Degraded" count={statusCounts.degraded} />}
              {statusCounts.partial > 0 && <StatusBadge color="var(--noc-partial)" label="Partial Outage" count={statusCounts.partial} />}
              {statusCounts.major > 0 && <StatusBadge color="var(--noc-major)" label="Major Outage" count={statusCounts.major} />}
              {statusCounts.maintenance > 0 && <StatusBadge color="var(--noc-maintenance)" label="Maintenance" count={statusCounts.maintenance} />}
            </div>
          </div>
        </div>

        {/* Services List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin w-8 h-8 border-2 border-t-transparent rounded-full" style={{ borderColor: 'var(--noc-accent)', borderTopColor: 'transparent' }} />
          </div>
        ) : (
          <div
            className="rounded-lg border overflow-hidden"
            style={{
              backgroundColor: 'var(--noc-bg-card)',
              borderColor: 'var(--noc-border)',
            }}
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ backgroundColor: 'var(--noc-bg-secondary)' }}>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--noc-text-muted)' }}>
                      Service
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--noc-text-muted)' }}>
                      Status
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider hidden sm:table-cell" style={{ color: 'var(--noc-text-muted)' }}>
                      Last Updated
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: 'var(--noc-border)' }}>
                  {services.map((service) => (
                    <ServiceRow key={service.id} service={service} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function ServiceRow({ service }: { service: Component }) {
  const statusColor = getStatusColor(service.status);
  const statusLabel = getStatusLabel(service.status);
  const updatedAt = new Date(service.updated_at).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <tr
      className="hover:bg-opacity-50 transition-colors"
      style={{ borderColor: 'var(--noc-border)' }}
    >
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <span
            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
            style={{ backgroundColor: statusColor }}
          />
          <span className="font-medium" style={{ color: 'var(--noc-text-primary)' }}>
            {service.name}
          </span>
        </div>
      </td>
      <td className="px-4 py-3">
        <span
          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
          style={{
            backgroundColor: `color-mix(in srgb, ${statusColor} 15%, transparent)`,
            color: statusColor,
          }}
        >
          {statusLabel}
        </span>
      </td>
      <td className="px-4 py-3 hidden sm:table-cell text-sm" style={{ color: 'var(--noc-text-muted)' }}>
        {updatedAt}
      </td>
    </tr>
  );
}

function StatusBadge({ color, label, count }: { color: string; label: string; count: number }) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
      <span style={{ color: 'var(--noc-text-secondary)' }}>{label}</span>
      <span className="font-semibold" style={{ color }}>{count}</span>
    </div>
  );
}
