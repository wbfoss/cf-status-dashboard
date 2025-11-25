import useSWR from 'swr';
import type { SummaryResponse } from './types';

const API_BASE = 'https://www.cloudflarestatus.com/api/v2';
const REFRESH_INTERVAL = 30 * 60 * 1000; // 30 minutes

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

export function useCloudflareStatus() {
  const { data, error, isLoading, isValidating, mutate } = useSWR<SummaryResponse>(
    `${API_BASE}/summary.json`,
    fetcher,
    {
      refreshInterval: REFRESH_INTERVAL,
      revalidateOnFocus: true,
      dedupingInterval: 5000, // Reduced to allow more frequent manual refreshes
    }
  );

  // Manual refresh function that forces revalidation
  const refresh = async () => {
    await mutate(undefined, { revalidate: true });
  };

  return {
    data,
    isLoading: isLoading || isValidating, // Show loading during both initial load and revalidation
    isError: error,
    refresh,
  };
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'operational':
    case 'none':
      return 'var(--noc-operational)';
    case 'degraded_performance':
      return 'var(--noc-degraded)';
    case 'partial_outage':
    case 'minor': // API "Minor Service Outage" = partial outage
      return 'var(--noc-partial)';
    case 'major_outage':
    case 'major': // API "Partial System Outage" = major issues
    case 'critical': // API "Major System Outage" = critical
      return 'var(--noc-major)';
    case 'under_maintenance':
      return 'var(--noc-maintenance)';
    default:
      return 'var(--noc-text-secondary)';
  }
}

export function getStatusBgColor(status: string): string {
  switch (status) {
    case 'operational':
    case 'none':
      return 'var(--noc-operational-bg)';
    case 'degraded_performance':
      return 'var(--noc-degraded-bg)';
    case 'partial_outage':
    case 'minor': // API "Minor Service Outage" = partial outage
      return 'var(--noc-partial-bg)';
    case 'major_outage':
    case 'major': // API "Partial System Outage" = major issues
    case 'critical': // API "Major System Outage" = critical
      return 'var(--noc-major-bg)';
    case 'under_maintenance':
      return 'var(--noc-maintenance-bg)';
    default:
      return 'var(--noc-bg-elevated)';
  }
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    operational: 'Operational',
    degraded_performance: 'Degraded',
    partial_outage: 'Partial Outage',
    major_outage: 'Major Outage',
    under_maintenance: 'Maintenance',
    none: 'All Systems Operational',
    minor: 'Minor Issues',
    major: 'Major Issues',
    critical: 'Critical',
    investigating: 'Investigating',
    identified: 'Identified',
    monitoring: 'Monitoring',
    resolved: 'Resolved',
    scheduled: 'Scheduled',
    in_progress: 'In Progress',
    verifying: 'Verifying',
    completed: 'Completed',
  };
  return labels[status] || status;
}

export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

export function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}
