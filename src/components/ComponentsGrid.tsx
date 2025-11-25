'use client';

import { Component } from '@/lib/types';
import { getStatusColor, getStatusBgColor, getStatusLabel } from '@/lib/api';

interface ComponentsGridProps {
  components: Component[];
}

export default function ComponentsGrid({ components }: ComponentsGridProps) {
  // Separate groups and individual components
  const groups = components.filter(c => c.group);
  const nonGroupComponents = components.filter(c => !c.group);

  // Create a map for quick lookup
  const componentMap = new Map(components.map(c => [c.id, c]));

  // Get children for a group
  const getGroupChildren = (group: Component) => {
    return nonGroupComponents
      .filter(c => c.group_id === group.id)
      .sort((a, b) => a.position - b.position);
  };

  // Get standalone components (not in any group)
  const standaloneComponents = nonGroupComponents.filter(c => !c.group_id);

  // Count all services
  const totalServices = nonGroupComponents.length;

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
          backgroundColor: 'var(--noc-bg-secondary)',
          borderColor: 'var(--noc-border)',
        }}
      >
        <h3 className="font-semibold text-sm" style={{ color: 'var(--noc-text-primary)' }}>
          System Components
        </h3>
        <span className="text-xs" style={{ color: 'var(--noc-text-muted)' }}>
          {totalServices} services
        </span>
      </div>

      <div className="p-4 space-y-4">
        {/* Standalone components first */}
        {standaloneComponents.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
            {standaloneComponents.map((component) => (
              <ComponentItem key={component.id} component={component} />
            ))}
          </div>
        )}

        {/* Grouped components */}
        {groups.map((group) => {
          const children = getGroupChildren(group);
          if (children.length === 0) return null;

          return (
            <div key={group.id}>
              <div className="flex items-center gap-2 mb-2">
                <h4 className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--noc-text-muted)' }}>
                  {group.name}
                </h4>
                <div className="flex-1 h-px" style={{ backgroundColor: 'var(--noc-border)' }} />
                <span className="text-xs" style={{ color: 'var(--noc-text-muted)' }}>
                  {children.length}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
                {children.map((component) => (
                  <ComponentItem key={component.id} component={component} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ComponentItem({ component }: { component: Component }) {
  const isOperational = component.status === 'operational';

  return (
    <div
      className="flex items-center justify-between gap-2 px-3 py-2 rounded border-l-2"
      style={{
        backgroundColor: 'var(--noc-bg-secondary)',
        borderLeftColor: getStatusColor(component.status),
      }}
    >
      <span
        className="text-sm truncate"
        style={{ color: isOperational ? 'var(--noc-text-secondary)' : 'var(--noc-text-primary)' }}
        title={component.name}
      >
        {component.name}
      </span>
      <span
        className="w-2 h-2 rounded-full shrink-0"
        style={{ backgroundColor: getStatusColor(component.status) }}
        title={getStatusLabel(component.status)}
      />
    </div>
  );
}
