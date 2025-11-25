'use client';

import { useState, useMemo, useCallback } from 'react';
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
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [center, setCenter] = useState<[number, number]>([20, 20]);

  // Process components to get data centers with coordinates
  const dataCenters = useMemo(() => {
    const centers: DataCenter[] = [];

    components.forEach((component) => {
      if (component.group) return;

      const coords = getComponentCoordinates(component.name);
      const code = extractAirportCode(component.name);

      if (coords && code) {
        centers.push({
          name: component.name.replace(/ - \([A-Z]{3}\)$/, ''),
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

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setTooltipPos({ x: e.clientX, y: e.clientY });
  }, []);

  const handleZoomIn = () => setZoom(z => Math.min(z * 1.5, 8));
  const handleZoomOut = () => setZoom(z => Math.max(z / 1.5, 1));
  const handleReset = () => {
    setZoom(1);
    setCenter([20, 20]);
  };

  // Pre-defined region views
  const regionViews: Record<string, { center: [number, number]; zoom: number }> = {
    world: { center: [20, 20], zoom: 1 },
    americas: { center: [-90, 20], zoom: 1.8 },
    europe: { center: [15, 50], zoom: 3 },
    asia: { center: [100, 30], zoom: 1.8 },
    africa: { center: [20, 0], zoom: 2 },
    oceania: { center: [140, -25], zoom: 2.5 },
  };

  const setRegion = (region: string) => {
    const view = regionViews[region];
    if (view) {
      setCenter(view.center);
      setZoom(view.zoom);
    }
  };

  // Get marker size based on status and zoom
  const getMarkerSize = (status: string) => {
    const baseSize = status === 'operational' ? 3.5 : 5;
    return baseSize / Math.sqrt(zoom);
  };

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
        className="px-4 py-3 border-b flex items-center justify-between flex-wrap gap-2"
        style={{
          backgroundColor: 'var(--noc-bg-secondary)',
          borderColor: 'var(--noc-border)',
        }}
      >
        <div className="flex items-center gap-4">
          <h3 className="font-semibold text-sm" style={{ color: 'var(--noc-text-primary)' }}>
            Global Network
          </h3>
          <div className="flex items-center gap-3 text-xs">
            <LegendItem color="var(--noc-operational)" label="Operational" count={statusCounts.operational} />
            {statusCounts.degraded > 0 && <LegendItem color="var(--noc-degraded)" label="Degraded" count={statusCounts.degraded} />}
            {statusCounts.outage > 0 && <LegendItem color="var(--noc-major)" label="Outage" count={statusCounts.outage} />}
            {statusCounts.maintenance > 0 && <LegendItem color="var(--noc-maintenance)" label="Maintenance" count={statusCounts.maintenance} />}
          </div>
        </div>

        {/* Region Quick Select */}
        <div className="flex items-center gap-1">
          {['world', 'americas', 'europe', 'asia', 'africa', 'oceania'].map((region) => (
            <button
              key={region}
              onClick={() => setRegion(region)}
              className="px-2 py-1 rounded text-xs capitalize transition-colors hover:opacity-80"
              style={{
                backgroundColor: 'var(--noc-bg-elevated)',
                color: 'var(--noc-text-secondary)',
              }}
            >
              {region}
            </button>
          ))}
        </div>
      </div>

      {/* Map Container */}
      <div
        className="relative"
        style={{ height: '500px' }}
        onMouseMove={handleMouseMove}
      >
        <ComposableMap
          projection="geoEqualEarth"
          projectionConfig={{
            scale: 180,
            center: [0, 0],
          }}
          style={{ width: '100%', height: '100%' }}
        >
          <ZoomableGroup
            zoom={zoom}
            center={center}
            onMoveEnd={({ coordinates, zoom: newZoom }) => {
              setCenter(coordinates);
              setZoom(newZoom);
            }}
            minZoom={1}
            maxZoom={8}
          >
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill="var(--noc-bg-elevated)"
                    stroke="var(--noc-border)"
                    strokeWidth={0.4}
                    style={{
                      default: { outline: 'none' },
                      hover: { outline: 'none', fill: 'var(--noc-bg-card)' },
                      pressed: { outline: 'none' },
                    }}
                  />
                ))
              }
            </Geographies>

            {/* Render operational markers first (below) */}
            {dataCenters
              .filter(dc => dc.status === 'operational')
              .map((dc) => (
                <Marker
                  key={dc.code}
                  coordinates={dc.coordinates}
                  onMouseEnter={() => setTooltip(dc)}
                  onMouseLeave={() => setTooltip(null)}
                >
                  <circle
                    r={getMarkerSize(dc.status)}
                    fill={getStatusColor(dc.status)}
                    fillOpacity={0.8}
                    stroke="rgba(255,255,255,0.3)"
                    strokeWidth={0.5}
                    style={{ cursor: 'pointer' }}
                  />
                </Marker>
              ))}

            {/* Render non-operational markers on top with glow effect */}
            {dataCenters
              .filter(dc => dc.status !== 'operational')
              .map((dc) => (
                <Marker
                  key={dc.code}
                  coordinates={dc.coordinates}
                  onMouseEnter={() => setTooltip(dc)}
                  onMouseLeave={() => setTooltip(null)}
                >
                  {/* Glow effect */}
                  <circle
                    r={getMarkerSize(dc.status) * 2.5}
                    fill={getStatusColor(dc.status)}
                    fillOpacity={0.2}
                  />
                  <circle
                    r={getMarkerSize(dc.status) * 1.5}
                    fill={getStatusColor(dc.status)}
                    fillOpacity={0.3}
                  />
                  {/* Main marker */}
                  <circle
                    r={getMarkerSize(dc.status)}
                    fill={getStatusColor(dc.status)}
                    stroke="rgba(255,255,255,0.5)"
                    strokeWidth={1}
                    style={{ cursor: 'pointer' }}
                  />
                </Marker>
              ))}
          </ZoomableGroup>
        </ComposableMap>

        {/* Zoom Controls */}
        <div
          className="absolute top-4 right-4 flex flex-col gap-1"
          style={{ zIndex: 10 }}
        >
          <button
            onClick={handleZoomIn}
            className="w-8 h-8 rounded flex items-center justify-center transition-colors hover:opacity-80"
            style={{
              backgroundColor: 'var(--noc-bg-card)',
              border: '1px solid var(--noc-border)',
              color: 'var(--noc-text-primary)',
            }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
          <button
            onClick={handleZoomOut}
            className="w-8 h-8 rounded flex items-center justify-center transition-colors hover:opacity-80"
            style={{
              backgroundColor: 'var(--noc-bg-card)',
              border: '1px solid var(--noc-border)',
              color: 'var(--noc-text-primary)',
            }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
          <button
            onClick={handleReset}
            className="w-8 h-8 rounded flex items-center justify-center transition-colors hover:opacity-80"
            style={{
              backgroundColor: 'var(--noc-bg-card)',
              border: '1px solid var(--noc-border)',
              color: 'var(--noc-text-primary)',
            }}
            title="Reset view"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
            </svg>
          </button>
        </div>

        {/* Floating Tooltip */}
        {tooltip && (
          <div
            className="fixed px-3 py-2 rounded-lg text-xs pointer-events-none"
            style={{
              left: tooltipPos.x + 15,
              top: tooltipPos.y - 10,
              backgroundColor: 'var(--noc-bg-card)',
              border: '1px solid var(--noc-border)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              zIndex: 50,
            }}
          >
            <div className="flex items-center gap-2 mb-1">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: getStatusColor(tooltip.status) }}
              />
              <span className="font-semibold" style={{ color: 'var(--noc-text-primary)' }}>
                {tooltip.name}
              </span>
              <span
                className="px-1.5 py-0.5 rounded text-[10px] font-mono"
                style={{ backgroundColor: 'var(--noc-bg-elevated)', color: 'var(--noc-text-secondary)' }}
              >
                {tooltip.code}
              </span>
            </div>
            <div style={{ color: getStatusColor(tooltip.status) }}>
              {getStatusLabel(tooltip.status)}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div
        className="px-4 py-2 border-t text-xs flex items-center justify-between"
        style={{
          backgroundColor: 'var(--noc-bg-secondary)',
          borderColor: 'var(--noc-border)',
          color: 'var(--noc-text-muted)',
        }}
      >
        <span>{dataCenters.length} data centers worldwide</span>
        <span>Scroll to zoom • Drag to pan • Click regions to navigate</span>
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
