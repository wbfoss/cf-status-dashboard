'use client';

import { ScheduledMaintenance } from '@/lib/types';
import { getStatusColor, getStatusBgColor, getStatusLabel, formatDateTime } from '@/lib/api';

interface MaintenancePanelProps {
  maintenances: ScheduledMaintenance[];
}

export default function MaintenancePanel({ maintenances }: MaintenancePanelProps) {
  // Filter for upcoming/active maintenance
  const activeMaintenance = maintenances.filter(m =>
    ['scheduled', 'in_progress', 'verifying'].includes(m.status)
  );

  return (
    <div
      className="rounded-xl border overflow-hidden h-full"
      style={{
        backgroundColor: 'var(--noc-bg-card)',
        borderColor: 'var(--noc-border)',
      }}
    >
      {/* Header */}
      <div
        className="px-5 py-4 border-b flex items-center justify-between"
        style={{
          backgroundColor: activeMaintenance.length > 0 ? 'var(--noc-maintenance-bg)' : 'var(--noc-bg-secondary)',
          borderColor: 'var(--noc-border)',
        }}
      >
        <div className="flex items-center gap-3">
          <svg
            className="w-5 h-5"
            style={{ color: activeMaintenance.length > 0 ? 'var(--noc-maintenance)' : 'var(--noc-text-secondary)' }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <h3
            className="font-semibold"
            style={{ color: activeMaintenance.length > 0 ? 'var(--noc-maintenance)' : 'var(--noc-text-primary)' }}
          >
            Scheduled Maintenance
          </h3>
        </div>
        <span
          className="text-xs px-2 py-1 rounded font-medium"
          style={{
            backgroundColor: activeMaintenance.length > 0 ? 'var(--noc-maintenance-bg)' : 'var(--noc-bg-primary)',
            color: activeMaintenance.length > 0 ? 'var(--noc-maintenance)' : 'var(--noc-text-secondary)',
          }}
        >
          {activeMaintenance.length} scheduled
        </span>
      </div>

      {/* Content */}
      <div className="p-4 max-h-96 overflow-y-auto">
        {activeMaintenance.length === 0 ? (
          <div className="text-center py-8">
            <div
              className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center"
              style={{ backgroundColor: 'var(--noc-bg-elevated)' }}
            >
              <svg
                className="w-6 h-6"
                style={{ color: 'var(--noc-text-muted)' }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p style={{ color: 'var(--noc-text-secondary)' }} className="font-medium">
              No Scheduled Maintenance
            </p>
            <p className="text-xs mt-1" style={{ color: 'var(--noc-text-muted)' }}>
              No upcoming maintenance windows
            </p>
          </div>
        ) : (
          <div className="space-y-4">
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
      className="rounded-lg border p-4"
      style={{
        backgroundColor: 'var(--noc-bg-secondary)',
        borderColor: 'var(--noc-border)',
        borderLeftWidth: '3px',
        borderLeftColor: isInProgress ? 'var(--noc-degraded)' : 'var(--noc-maintenance)',
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4
          className="font-medium text-sm"
          style={{ color: 'var(--noc-text-primary)' }}
        >
          {maintenance.name}
        </h4>
        <span
          className="text-xs px-2 py-0.5 rounded font-medium uppercase whitespace-nowrap"
          style={{
            backgroundColor: isInProgress ? getStatusBgColor('minor') : 'var(--noc-maintenance-bg)',
            color: isInProgress ? getStatusColor('minor') : 'var(--noc-maintenance)',
          }}
        >
          {getStatusLabel(maintenance.status)}
        </span>
      </div>

      {/* Time window */}
      <div
        className="flex items-center gap-2 text-xs mb-3"
        style={{ color: 'var(--noc-text-secondary)' }}
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>
          {formatDateTime(maintenance.scheduled_for)} — {formatDateTime(maintenance.scheduled_until)}
        </span>
      </div>

      {/* Affected components */}
      {maintenance.components.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {maintenance.components.map((c) => (
            <span
              key={c.id}
              className="text-xs px-1.5 py-0.5 rounded"
              style={{
                backgroundColor: 'var(--noc-bg-primary)',
                color: 'var(--noc-text-muted)',
              }}
            >
              {c.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
