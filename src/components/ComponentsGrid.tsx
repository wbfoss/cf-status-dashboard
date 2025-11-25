'use client';

import { Component } from '@/lib/types';
import { getStatusColor, getStatusBgColor, getStatusLabel } from '@/lib/api';

interface ComponentsGridProps {
  components: Component[];
}

export default function ComponentsGrid({ components }: ComponentsGridProps) {
  // Filter to only show main components (not groups)
  const mainComponents = components.filter(c => !c.group_id || c.components);

  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{
        backgroundColor: 'var(--noc-bg-card)',
        borderColor: 'var(--noc-border)',
      }}
    >
      {/* Header */}
      <div
        className="px-5 py-4 border-b flex items-center justify-between"
        style={{
          backgroundColor: 'var(--noc-bg-secondary)',
          borderColor: 'var(--noc-border)',
        }}
      >
        <div className="flex items-center gap-3">
          <svg
            className="w-5 h-5"
            style={{ color: 'var(--noc-text-secondary)' }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <h3 className="font-semibold" style={{ color: 'var(--noc-text-primary)' }}>
            System Components
          </h3>
        </div>
        <span
          className="text-xs px-2 py-1 rounded"
          style={{
            backgroundColor: 'var(--noc-bg-primary)',
            color: 'var(--noc-text-secondary)',
          }}
        >
          {mainComponents.length} services
        </span>
      </div>

      {/* Grid */}
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {mainComponents.map((component) => (
          <ComponentCard key={component.id} component={component} />
        ))}
      </div>
    </div>
  );
}

function ComponentCard({ component }: { component: Component }) {
  const isOperational = component.status === 'operational';

  return (
    <div
      className="rounded-lg border p-4 transition-all hover:border-opacity-80"
      style={{
        backgroundColor: 'var(--noc-bg-secondary)',
        borderColor: isOperational ? 'var(--noc-border)' : getStatusColor(component.status),
        borderLeftWidth: '3px',
        borderLeftColor: getStatusColor(component.status),
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <span
          className="font-medium text-sm leading-tight"
          style={{ color: 'var(--noc-text-primary)' }}
        >
          {component.name}
        </span>
        <StatusBadge status={component.status} />
      </div>

      {/* Show sub-components if any */}
      {component.components && component.components.length > 0 && (
        <div className="mt-3 space-y-1.5">
          {component.components.map((sub) => (
            <div
              key={sub.id}
              className="flex items-center justify-between text-xs"
            >
              <span style={{ color: 'var(--noc-text-secondary)' }}>
                {sub.name}
              </span>
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: getStatusColor(sub.status) }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className="text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap"
      style={{
        backgroundColor: getStatusBgColor(status),
        color: getStatusColor(status),
      }}
    >
      {getStatusLabel(status)}
    </span>
  );
}
