'use client';

import { useState, useMemo } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from 'react-simple-maps';
import { Component } from '@/lib/types';
import { getComponentCoordinates, extractAirportCode } from '@/lib/datacenters';
import { getStatusColor, getStatusLabel } from '@/lib/api';

const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

interface WorldMapProps {
  components: Component[];
}

interface DataCenter {
  name: string;
  code: string;
  coordinates: [number, number];
  status: string;
}

export default function WorldMap({ components }: WorldMapProps) {
  const [tooltip, setTooltip] = useState<DataCenter | null>(null);

  // Process components to get data centers with coordinates
  const dataCenters = useMemo(() => {
    const centers: DataCenter[] = [];

    components.forEach((component) => {
      if (component.group) return; // Skip group containers

      const coords = getComponentCoordinates(component.name);
      const code = extractAirportCode(component.name);

      if (coords && code) {
        centers.push({
          name: component.name.replace(` - (${code})`, ''),
          code,
          coordinates: coords,
          status: component.status,
        });
      }
    });

    return centers;
  }, [components]);

  // Count by status
  const statusCounts = useMemo(() => {
    const counts = { operational: 0, degraded: 0, outage: 0, maintenance: 0 };
    dataCenters.forEach((dc) => {
      if (dc.status === 'operational') counts.operational++;
      else if (dc.status === 'degraded_performance') counts.degraded++;
      else if (dc.status === 'partial_outage' || dc.status === 'major_outage') counts.outage++;
      else if (dc.status === 'under_maintenance') counts.maintenance++;
    });
    return counts;
  }, [dataCenters]);

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
          Global Network
        </h3>
        <div className="flex items-center gap-4 text-xs">
          <LegendItem color="var(--noc-operational)" label="Operational" count={statusCounts.operational} />
          <LegendItem color="var(--noc-degraded)" label="Degraded" count={statusCounts.degraded} />
          <LegendItem color="var(--noc-major)" label="Outage" count={statusCounts.outage} />
          <LegendItem color="var(--noc-maintenance)" label="Maintenance" count={statusCounts.maintenance} />
        </div>
      </div>

      {/* Map */}
      <div className="relative" style={{ height: '400px' }}>
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            scale: 120,
            center: [0, 30],
          }}
          style={{ width: '100%', height: '100%' }}
        >
          <ZoomableGroup>
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill="var(--noc-bg-elevated)"
                    stroke="var(--noc-border)"
                    strokeWidth={0.5}
                    style={{
                      default: { outline: 'none' },
                      hover: { outline: 'none', fill: 'var(--noc-bg-card)' },
                      pressed: { outline: 'none' },
                    }}
                  />
                ))
              }
            </Geographies>

            {dataCenters.map((dc) => (
              <Marker
                key={dc.code}
                coordinates={dc.coordinates}
                onMouseEnter={() => setTooltip(dc)}
                onMouseLeave={() => setTooltip(null)}
              >
                <circle
                  r={4}
                  fill={getStatusColor(dc.status)}
                  stroke="var(--noc-bg-primary)"
                  strokeWidth={1}
                  style={{ cursor: 'pointer' }}
                />
              </Marker>
            ))}
          </ZoomableGroup>
        </ComposableMap>

        {/* Tooltip */}
        {tooltip && (
          <div
            className="absolute top-4 left-4 px-3 py-2 rounded-lg text-xs z-10"
            style={{
              backgroundColor: 'var(--noc-bg-secondary)',
              border: '1px solid var(--noc-border)',
            }}
          >
            <div className="flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: getStatusColor(tooltip.status) }}
              />
              <span className="font-medium" style={{ color: 'var(--noc-text-primary)' }}>
                {tooltip.name}
              </span>
              <span style={{ color: 'var(--noc-text-muted)' }}>({tooltip.code})</span>
            </div>
            <div className="mt-1" style={{ color: getStatusColor(tooltip.status) }}>
              {getStatusLabel(tooltip.status)}
            </div>
          </div>
        )}
      </div>

      {/* Footer stats */}
      <div
        className="px-4 py-2 border-t text-xs flex items-center justify-between"
        style={{
          backgroundColor: 'var(--noc-bg-secondary)',
          borderColor: 'var(--noc-border)',
          color: 'var(--noc-text-muted)',
        }}
      >
        <span>{dataCenters.length} data centers worldwide</span>
        <span>Scroll to zoom • Drag to pan</span>
      </div>
    </div>
  );
}

function LegendItem({ color, label, count }: { color: string; label: string; count: number }) {
  if (count === 0 && label !== 'Operational') return null;

  return (
    <div className="flex items-center gap-1">
      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
      <span style={{ color: 'var(--noc-text-muted)' }}>{count}</span>
    </div>
  );
}
