'use client';

import { Incident } from '@/lib/types';
import { getStatusColor, getStatusBgColor, getStatusLabel, formatDateTime, getRelativeTime } from '@/lib/api';

interface IncidentsPanelProps {
  incidents: Incident[];
}

export default function IncidentsPanel({ incidents }: IncidentsPanelProps) {
  // Filter for active incidents
  const activeIncidents = incidents.filter(i =>
    ['investigating', 'identified', 'monitoring'].includes(i.status)
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
          backgroundColor: activeIncidents.length > 0 ? 'var(--noc-major-bg)' : 'var(--noc-bg-secondary)',
          borderColor: 'var(--noc-border)',
        }}
      >
        <div className="flex items-center gap-3">
          <svg
            className="w-5 h-5"
            style={{ color: activeIncidents.length > 0 ? 'var(--noc-major)' : 'var(--noc-text-secondary)' }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3
            className="font-semibold"
            style={{ color: activeIncidents.length > 0 ? 'var(--noc-major)' : 'var(--noc-text-primary)' }}
          >
            Active Incidents
          </h3>
        </div>
        <span
          className="text-xs px-2 py-1 rounded font-medium"
          style={{
            backgroundColor: activeIncidents.length > 0 ? 'var(--noc-major-bg)' : 'var(--noc-bg-primary)',
            color: activeIncidents.length > 0 ? 'var(--noc-major)' : 'var(--noc-text-secondary)',
          }}
        >
          {activeIncidents.length} active
        </span>
      </div>

      {/* Content */}
      <div className="p-4 max-h-96 overflow-y-auto">
        {activeIncidents.length === 0 ? (
          <div className="text-center py-8">
            <div
              className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center"
              style={{ backgroundColor: 'var(--noc-operational-bg)' }}
            >
              <svg
                className="w-6 h-6"
                style={{ color: 'var(--noc-operational)' }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p style={{ color: 'var(--noc-operational)' }} className="font-medium">
              No Active Incidents
            </p>
            <p className="text-xs mt-1" style={{ color: 'var(--noc-text-muted)' }}>
              All systems operating normally
            </p>
          </div>
        ) : (
          <div className="space-y-4">
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
      className="rounded-lg border p-4"
      style={{
        backgroundColor: 'var(--noc-bg-secondary)',
        borderColor: 'var(--noc-border)',
        borderLeftWidth: '3px',
        borderLeftColor: getStatusColor(incident.status),
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4
          className="font-medium text-sm"
          style={{ color: 'var(--noc-text-primary)' }}
        >
          {incident.name}
        </h4>
        <span
          className="text-xs px-2 py-0.5 rounded font-medium uppercase whitespace-nowrap"
          style={{
            backgroundColor: getStatusBgColor(incident.status),
            color: getStatusColor(incident.status),
          }}
        >
          {getStatusLabel(incident.status)}
        </span>
      </div>

      {/* Latest update */}
      {latestUpdate && (
        <p
          className="text-xs leading-relaxed mb-3 pl-3 border-l-2"
          style={{
            color: 'var(--noc-text-secondary)',
            borderColor: 'var(--noc-border)',
          }}
        >
          {latestUpdate.body}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between">
        <span className="text-xs" style={{ color: 'var(--noc-text-muted)' }}>
          Started {getRelativeTime(incident.created_at)}
        </span>
        {incident.components.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {incident.components.slice(0, 2).map((c) => (
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
            {incident.components.length > 2 && (
              <span className="text-xs" style={{ color: 'var(--noc-text-muted)' }}>
                +{incident.components.length - 2}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
