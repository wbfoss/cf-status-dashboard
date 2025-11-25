'use client';

import { ScheduledMaintenance } from '@/lib/types';
import { getStatusColor, getStatusBgColor, getStatusLabel, formatDateTime } from '@/lib/api';

interface MaintenancePanelProps {
  maintenances: ScheduledMaintenance[];
}

export default function MaintenancePanel({ maintenances }: MaintenancePanelProps) {
  // Filter active maintenance and sort: in_progress first, then verifying, then scheduled
  const activeMaintenance = maintenances
    .filter(m => ['scheduled', 'in_progress', 'verifying'].includes(m.status))
    .sort((a, b) => {
      const priority: Record<string, number> = { in_progress: 0, verifying: 1, scheduled: 2 };
      return (priority[a.status] ?? 3) - (priority[b.status] ?? 3);
    });

  const hasActive = activeMaintenance.length > 0;

  return (
    <div
      className="rounded-lg border overflow-hidden"
      style={{
        backgroundColor: 'var(--noc-bg-card)',
        borderColor: 'var(--noc-border)',
      }}
    >
      {/* Header */}
      <div
        className="px-4 py-3 border-b flex items-center justify-between"
        style={{
          backgroundColor: hasActive ? 'var(--noc-maintenance-bg)' : 'var(--noc-bg-secondary)',
          borderColor: 'var(--noc-border)',
        }}
      >
        <h3
          className="font-semibold text-sm"
          style={{ color: hasActive ? 'var(--noc-maintenance)' : 'var(--noc-text-primary)' }}
        >
          Scheduled Maintenance
        </h3>
        <span
          className="text-xs"
          style={{ color: hasActive ? 'var(--noc-maintenance)' : 'var(--noc-text-muted)' }}
        >
          {activeMaintenance.length}
        </span>
      </div>

      {/* Content */}
      <div className="p-3 max-h-72 overflow-y-auto">
        {!hasActive ? (
          <div className="text-center py-6">
            <div
              className="w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center"
              style={{ backgroundColor: 'var(--noc-bg-elevated)' }}
            >
              <svg className="w-5 h-5" style={{ color: 'var(--noc-text-muted)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-sm font-medium" style={{ color: 'var(--noc-text-secondary)' }}>
              No Scheduled Maintenance
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {activeMaintenance.map((maintenance) => (
              <MaintenanceCard key={maintenance.id} maintenance={maintenance} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function MaintenanceCard({ maintenance }: { maintenance: ScheduledMaintenance }) {
  const isInProgress = maintenance.status === 'in_progress';

  return (
    <div
      className="rounded border-l-2 p-3"
      style={{
        backgroundColor: 'var(--noc-bg-secondary)',
        borderLeftColor: isInProgress ? 'var(--noc-degraded)' : 'var(--noc-maintenance)',
      }}
    >
      <div className="flex items-start justify-between gap-2 mb-1">
        <h4 className="font-medium text-sm" style={{ color: 'var(--noc-text-primary)' }}>
          {maintenance.name}
        </h4>
        <span
          className="text-[10px] px-1.5 py-0.5 rounded font-medium uppercase shrink-0"
          style={{
            backgroundColor: isInProgress ? getStatusBgColor('minor') : 'var(--noc-maintenance-bg)',
            color: isInProgress ? getStatusColor('minor') : 'var(--noc-maintenance)',
          }}
        >
          {getStatusLabel(maintenance.status)}
        </span>
      </div>

      <div className="text-xs mb-1" style={{ color: 'var(--noc-text-secondary)' }}>
        {formatDateTime(maintenance.scheduled_for)} — {formatDateTime(maintenance.scheduled_until)}
      </div>

      {maintenance.components.length > 0 && (
        <div className="text-[10px]" style={{ color: 'var(--noc-text-muted)' }}>
          {maintenance.components.length} service{maintenance.components.length > 1 ? 's' : ''} affected
        </div>
      )}
    </div>
  );
}
