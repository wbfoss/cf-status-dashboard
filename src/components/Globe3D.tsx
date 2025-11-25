'use client';

import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { Component } from '@/lib/types';
import { getComponentCoordinates, extractAirportCode } from '@/lib/datacenters';

// Dynamically import Globe to avoid SSR issues
const Globe = dynamic(() => import('react-globe.gl'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-2 border-t-transparent rounded-full" style={{ borderColor: 'var(--noc-accent)', borderTopColor: 'transparent' }} />
    </div>
  ),
});

interface Globe3DProps {
  components: Component[];
}

interface DataCenterPoint {
  lat: number;
  lng: number;
  name: string;
  code: string;
  status: string;
  color: string;
}

export default function Globe3D({ components }: Globe3DProps) {
  const globeRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [hoveredPoint, setHoveredPoint] = useState<DataCenterPoint | null>(null);
  const [isHovering, setIsHovering] = useState(false);

  // Process components to get data centers with coordinates
  const dataCenters = useMemo(() => {
    const centers: DataCenterPoint[] = [];

    components.forEach((component) => {
      if (component.group) return;

      const coords = getComponentCoordinates(component.name);
      const code = extractAirportCode(component.name);

      if (coords && code) {
        centers.push({
          lat: coords[1],
          lng: coords[0],
          name: component.name.replace(/ - \([A-Z]{3}\)$/, ''),
          code,
          status: component.status,
          color: getStatusColorHex(component.status),
        });
      }
    });

    return centers;
  }, [components]);

  // Status counts - matching WorldMap categories
  const statusCounts = useMemo(() => {
    const counts = { operational: 0, degraded: 0, partialOutage: 0, majorOutage: 0, maintenance: 0 };
    dataCenters.forEach((dc) => {
      if (dc.status === 'operational') counts.operational++;
      else if (dc.status === 'degraded_performance') counts.degraded++;
      else if (dc.status === 'partial_outage') counts.partialOutage++;
      else if (dc.status === 'major_outage') counts.majorOutage++;
      else if (dc.status === 'under_maintenance') counts.maintenance++;
    });
    return counts;
  }, [dataCenters]);

  // Handle resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Auto-rotate and initial position
  useEffect(() => {
    if (globeRef.current) {
      // Set initial point of view - closer zoom for better visibility
      globeRef.current.pointOfView({ lat: 25, lng: 0, altitude: 1.8 }, 0);

      // Enable slow auto-rotation
      const controls = globeRef.current.controls();
      if (controls) {
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.3; // Very slow rotation
        controls.enableZoom = true;
        controls.minDistance = 120;
        controls.maxDistance = 400;
      }
    }
  }, [dimensions]);

  // Pause auto-rotate on hover
  useEffect(() => {
    if (globeRef.current) {
      const controls = globeRef.current.controls();
      if (controls) {
        controls.autoRotate = !isHovering;
      }
    }
  }, [isHovering]);

  // Label accessors
  const getLabelColor = useCallback((d: object) => {
    const dc = d as DataCenterPoint;
    return dc.color;
  }, []);

  const getLabelSize = useCallback((d: object) => {
    const dc = d as DataCenterPoint;
    // Non-operational DCs get larger labels
    return dc.status === 'operational' ? 0.5 : 1.0;
  }, []);

  const getLabelDotRadius = useCallback((d: object) => {
    const dc = d as DataCenterPoint;
    // Non-operational DCs get larger dots
    return dc.status === 'operational' ? 0.3 : 0.6;
  }, []);

  const getLabelText = useCallback((d: object) => {
    const dc = d as DataCenterPoint;
    return dc.code;
  }, []);

  return (
    <div
      className="relative w-full h-full"
      ref={containerRef}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {dimensions.width > 0 && (
        <Globe
          ref={globeRef}
          width={dimensions.width}
          height={dimensions.height}
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
          bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
          backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
          // Atmosphere
          atmosphereColor="#3a86ff"
          atmosphereAltitude={0.15}
          // Labels layer - creates dots with text labels
          labelsData={dataCenters}
          labelLat="lat"
          labelLng="lng"
          labelText={getLabelText}
          labelSize={getLabelSize}
          labelDotRadius={getLabelDotRadius}
          labelColor={getLabelColor}
          labelResolution={2}
          labelAltitude={0.01}
          labelDotOrientation={() => 'bottom'}
          onLabelHover={(label: object | null) => setHoveredPoint(label as DataCenterPoint | null)}
          onLabelClick={(label: object) => setHoveredPoint(label as DataCenterPoint)}
        />
      )}

      {/* Legend - Responsive */}
      <div
        className="absolute top-2 left-2 sm:top-4 sm:left-4 p-2 sm:p-4 rounded-lg"
        style={{
          backgroundColor: 'rgba(10, 14, 20, 0.85)',
          border: '1px solid var(--noc-border)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <h3 className="text-xs sm:text-sm font-semibold mb-2 sm:mb-3" style={{ color: 'var(--noc-text-primary)' }}>
          Cloudflare Global DCs
        </h3>
        <div className="space-y-1.5 sm:space-y-2 text-[10px] sm:text-xs">
          <LegendItem color="#3fb950" label="Operational" count={statusCounts.operational} />
          {statusCounts.degraded > 0 && (
            <LegendItem color="#d29922" label="Degraded" count={statusCounts.degraded} />
          )}
          {statusCounts.partialOutage > 0 && (
            <LegendItem color="#db6d28" label="Partial Outage" count={statusCounts.partialOutage} />
          )}
          {statusCounts.majorOutage > 0 && (
            <LegendItem color="#f85149" label="Major Outage" count={statusCounts.majorOutage} />
          )}
          {statusCounts.maintenance > 0 && (
            <LegendItem color="#58a6ff" label="Maintenance" count={statusCounts.maintenance} />
          )}
        </div>
        <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t text-[9px] sm:text-[10px]" style={{ borderColor: 'var(--noc-border)', color: 'var(--noc-text-muted)' }}>
          {dataCenters.length} data centers
        </div>
      </div>

      {/* Tooltip - Responsive */}
      {hoveredPoint && (
        <div
          className="absolute bottom-16 sm:bottom-4 left-1/2 -translate-x-1/2 px-3 sm:px-4 py-2 sm:py-3 rounded-lg max-w-[90vw] sm:max-w-none"
          style={{
            backgroundColor: 'rgba(10, 14, 20, 0.95)',
            border: '1px solid var(--noc-border)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <div className="flex items-center gap-2 sm:gap-3">
            <span
              className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: hoveredPoint.color }}
            />
            <div className="min-w-0">
              <div className="font-semibold text-xs sm:text-sm truncate" style={{ color: 'var(--noc-text-primary)' }}>
                {hoveredPoint.name}
              </div>
              <div className="text-[10px] sm:text-xs flex items-center gap-1.5" style={{ color: 'var(--noc-text-muted)' }}>
                <span className="font-mono">{hoveredPoint.code}</span>
                <span>•</span>
                <span style={{ color: hoveredPoint.color }}>{getStatusLabel(hoveredPoint.status)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Controls hint - Responsive */}
      <div
        className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 text-[9px] sm:text-[10px] px-2 sm:px-3 py-1.5 sm:py-2 rounded"
        style={{
          backgroundColor: 'rgba(10, 14, 20, 0.7)',
          color: 'var(--noc-text-muted)',
        }}
      >
        <span className="hidden sm:inline">Drag to rotate • Scroll to zoom</span>
        <span className="sm:hidden">Swipe to rotate • Pinch to zoom</span>
      </div>
    </div>
  );
}

function LegendItem({ color, label, count }: { color: string; label: string; count: number }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
        <span style={{ color: 'var(--noc-text-secondary)' }}>{label}</span>
      </div>
      <span className="font-semibold" style={{ color }}>{count}</span>
    </div>
  );
}

// Hex colors matching CSS variables in globals.css
function getStatusColorHex(status: string): string {
  switch (status) {
    case 'operational':
      return '#3fb950';  // --noc-operational
    case 'degraded_performance':
      return '#d29922';  // --noc-degraded
    case 'partial_outage':
      return '#db6d28';  // --noc-partial
    case 'major_outage':
      return '#f85149';  // --noc-major
    case 'under_maintenance':
      return '#58a6ff';  // --noc-maintenance
    default:
      return '#8b949e';
  }
}

function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    operational: 'Operational',
    degraded_performance: 'Degraded',
    partial_outage: 'Partial Outage',
    major_outage: 'Major Outage',
    under_maintenance: 'Maintenance',
  };
  return labels[status] || status;
}
