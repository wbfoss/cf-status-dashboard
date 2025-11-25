'use client';

import { Incident } from '@/lib/types';
import { getStatusColor, getStatusBgColor, getStatusLabel, getRelativeTime } from '@/lib/api';

interface IncidentsPanelProps {
  incidents: Incident[];
}

export default function IncidentsPanel({ incidents }: IncidentsPanelProps) {
  const activeIncidents = incidents.filter(i =>
    ['investigating', 'identified', 'monitoring'].includes(i.status)
  );

  const hasActive = activeIncidents.length > 0;

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
          backgroundColor: hasActive ? 'var(--noc-major-bg)' : 'var(--noc-bg-secondary)',
          borderColor: 'var(--noc-border)',
        }}
      >
        <h3
          className="font-semibold text-sm"
          style={{ color: hasActive ? 'var(--noc-major)' : 'var(--noc-text-primary)' }}
        >
          Active Incidents
        </h3>
        <span
          className="text-xs"
          style={{ color: hasActive ? 'var(--noc-major)' : 'var(--noc-text-muted)' }}
        >
          {activeIncidents.length}
        </span>
      </div>

      {/* Content */}
      <div className="p-3 max-h-72 overflow-y-auto">
        {!hasActive ? (
          <div className="text-center py-6">
            <div
              className="w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center"
              style={{ backgroundColor: 'var(--noc-operational-bg)' }}
            >
              <svg className="w-5 h-5" style={{ color: 'var(--noc-operational)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-sm font-medium" style={{ color: 'var(--noc-operational)' }}>
              No Active Incidents
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {activeIncidents.map((incident) => (
              <IncidentCard key={incident.id} incident={incident} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function IncidentCard({ incident }: { incident: Incident }) {
  const latestUpdate = incident.incident_updates?.[0];

  return (
    <div
      className="rounded border-l-2 p-3"
      style={{
        backgroundColor: 'var(--noc-bg-secondary)',
        borderLeftColor: getStatusColor(incident.status),
      }}
    >
      <div className="flex items-start justify-between gap-2 mb-1">
        <h4 className="font-medium text-sm" style={{ color: 'var(--noc-text-primary)' }}>
          {incident.name}
        </h4>
        <span
          className="text-[10px] px-1.5 py-0.5 rounded font-medium uppercase shrink-0"
          style={{
            backgroundColor: getStatusBgColor(incident.status),
            color: getStatusColor(incident.status),
          }}
        >
          {getStatusLabel(incident.status)}
        </span>
      </div>

      {latestUpdate && (
        <p className="text-xs leading-relaxed mb-2 line-clamp-2" style={{ color: 'var(--noc-text-secondary)' }}>
          {latestUpdate.body}
        </p>
      )}

      <div className="flex items-center justify-between text-[10px]" style={{ color: 'var(--noc-text-muted)' }}>
        <span>{getRelativeTime(incident.created_at)}</span>
        {incident.components.length > 0 && (
          <span>{incident.components.length} affected</span>
        )}
      </div>
    </div>
  );
}
