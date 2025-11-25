'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useCloudflareStatus, getStatusColor, getStatusLabel } from '@/lib/api';
import { extractAirportCode } from '@/lib/datacenters';
import { Component } from '@/lib/types';
import { AboutSection } from '@/components';

type SortField = 'name' | 'status' | 'code';
type SortOrder = 'asc' | 'desc';

export default function DataCentersPage() {
  const { data, isLoading, isError, refresh } = useCloudflareStatus();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('status');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const components = data?.components || [];

  // Filter to get only data centers (with airport codes)
  const allDataCenters = useMemo(() => {
    return components
      .filter(c => !c.group && extractAirportCode(c.name))
      .map(c => ({
        ...c,
        code: extractAirportCode(c.name) || '',
        displayName: c.name.replace(/ - \([A-Z]{3}\)$/, ''),
      }));
  }, [components]);

  // Count by status
  const statusCounts = useMemo(() => ({
    operational: allDataCenters.filter(s => s.status === 'operational').length,
    degraded: allDataCenters.filter(s => s.status === 'degraded_performance').length,
    partial: allDataCenters.filter(s => s.status === 'partial_outage').length,
    major: allDataCenters.filter(s => s.status === 'major_outage').length,
    maintenance: allDataCenters.filter(s => s.status === 'under_maintenance').length,
  }), [allDataCenters]);

  // Filter and sort
  const filteredDataCenters = useMemo(() => {
    let result = allDataCenters;

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(dc =>
        dc.displayName.toLowerCase().includes(searchLower) ||
        dc.code.toLowerCase().includes(searchLower)
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(dc => dc.status === statusFilter);
    }

    // Apply sorting
    const statusOrder: Record<string, number> = {
      major_outage: 0,
      partial_outage: 1,
      degraded_performance: 2,
      under_maintenance: 3,
      operational: 4,
    };

    result.sort((a, b) => {
      let comparison = 0;
      if (sortField === 'status') {
        comparison = (statusOrder[a.status] ?? 5) - (statusOrder[b.status] ?? 5);
      } else if (sortField === 'name') {
        comparison = a.displayName.localeCompare(b.displayName);
      } else if (sortField === 'code') {
        comparison = a.code.localeCompare(b.code);
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [allDataCenters, search, statusFilter, sortField, sortOrder]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
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
              Data Centers
            </h1>
            <div className="w-32" />
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
              {allDataCenters.length} <span className="text-sm font-normal" style={{ color: 'var(--noc-text-muted)' }}>data centers</span>
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

        {/* Filters */}
        <div
          className="rounded-lg border p-4 mb-4"
          style={{
            backgroundColor: 'var(--noc-bg-card)',
            borderColor: 'var(--noc-border)',
          }}
        >
          <div className="flex flex-wrap gap-4">
            {/* Search */}
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                  style={{ color: 'var(--noc-text-muted)' }}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search by location or code..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border text-sm"
                  style={{
                    backgroundColor: 'var(--noc-bg-primary)',
                    borderColor: 'var(--noc-border)',
                    color: 'var(--noc-text-primary)',
                  }}
                />
              </div>
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 rounded-lg border text-sm"
              style={{
                backgroundColor: 'var(--noc-bg-primary)',
                borderColor: 'var(--noc-border)',
                color: 'var(--noc-text-primary)',
              }}
            >
              <option value="all">All Status</option>
              <option value="operational">Operational</option>
              <option value="degraded_performance">Degraded</option>
              <option value="partial_outage">Partial Outage</option>
              <option value="major_outage">Major Outage</option>
              <option value="under_maintenance">Maintenance</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4 text-sm" style={{ color: 'var(--noc-text-muted)' }}>
          Showing {filteredDataCenters.length} of {allDataCenters.length} data centers
        </div>

        {/* Data Centers Grid/Table */}
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
                    <th
                      className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider cursor-pointer hover:opacity-80"
                      style={{ color: 'var(--noc-text-muted)' }}
                      onClick={() => handleSort('code')}
                    >
                      <div className="flex items-center gap-1">
                        Code
                        <SortIcon active={sortField === 'code'} order={sortOrder} />
                      </div>
                    </th>
                    <th
                      className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider cursor-pointer hover:opacity-80"
                      style={{ color: 'var(--noc-text-muted)' }}
                      onClick={() => handleSort('name')}
                    >
                      <div className="flex items-center gap-1">
                        Location
                        <SortIcon active={sortField === 'name'} order={sortOrder} />
                      </div>
                    </th>
                    <th
                      className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider cursor-pointer hover:opacity-80"
                      style={{ color: 'var(--noc-text-muted)' }}
                      onClick={() => handleSort('status')}
                    >
                      <div className="flex items-center gap-1">
                        Status
                        <SortIcon active={sortField === 'status'} order={sortOrder} />
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: 'var(--noc-border)' }}>
                  {filteredDataCenters.map((dc) => (
                    <DataCenterRow key={dc.id} dataCenter={dc} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* About Section */}
        <AboutSection />
      </main>
    </div>
  );
}

function DataCenterRow({ dataCenter }: { dataCenter: Component & { code: string; displayName: string } }) {
  const statusColor = getStatusColor(dataCenter.status);
  const statusLabel = getStatusLabel(dataCenter.status);

  return (
    <tr
      className="hover:bg-opacity-50 transition-colors"
      style={{ borderColor: 'var(--noc-border)' }}
    >
      <td className="px-4 py-3">
        <span
          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-semibold"
          style={{
            backgroundColor: 'var(--noc-bg-elevated)',
            color: 'var(--noc-text-primary)',
          }}
        >
          {dataCenter.code}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <span
            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
            style={{ backgroundColor: statusColor }}
          />
          <span className="font-medium" style={{ color: 'var(--noc-text-primary)' }}>
            {dataCenter.displayName}
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

function SortIcon({ active, order }: { active: boolean; order: SortOrder }) {
  return (
    <svg
      className="w-3 h-3"
      style={{ color: active ? 'var(--noc-accent)' : 'var(--noc-text-muted)', opacity: active ? 1 : 0.5 }}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      {order === 'asc' ? (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      ) : (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      )}
    </svg>
  );
}
