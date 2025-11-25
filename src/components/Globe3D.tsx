'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Component } from '@/lib/types';
import { getComponentCoordinates, extractAirportCode } from '@/lib/datacenters';
import { getStatusColor } from '@/lib/api';

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
  altitude: number;
  color: string;
}

export default function Globe3D({ components }: Globe3DProps) {
  const globeRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [hoveredPoint, setHoveredPoint] = useState<DataCenterPoint | null>(null);

  // Process components to get data centers with coordinates
  const dataCenters = useMemo(() => {
    const centers: DataCenterPoint[] = [];

    components.forEach((component) => {
      if (component.group) return;

      const coords = getComponentCoordinates(component.name);
      const code = extractAirportCode(component.name);

      if (coords && code) {
        const isOperational = component.status === 'operational';
        centers.push({
          lat: coords[1],
          lng: coords[0],
          name: component.name.replace(/ - \([A-Z]{3}\)$/, ''),
          code,
          status: component.status,
          // Spikes: operational = shorter, issues = taller
          altitude: isOperational ? 0.05 : 0.15,
          color: getStatusColorHex(component.status),
        });
      }
    });

    return centers;
  }, [components]);

  // Status counts
  const statusCounts = useMemo(() => {
    const counts = { operational: 0, issues: 0, maintenance: 0 };
    dataCenters.forEach((dc) => {
      if (dc.status === 'operational') counts.operational++;
      else if (dc.status === 'under_maintenance') counts.maintenance++;
      else counts.issues++;
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
      // Set initial point of view
      globeRef.current.pointOfView({ lat: 20, lng: 0, altitude: 2.5 }, 0);

      // Enable auto-rotation
      const controls = globeRef.current.controls();
      if (controls) {
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.5;
        controls.enableZoom = true;
        controls.minDistance = 150;
        controls.maxDistance = 500;
      }
    }
  }, [dimensions]);

  return (
    <div className="relative w-full h-full" ref={containerRef}>
      {dimensions.width > 0 && (
        <Globe
          ref={globeRef}
          width={dimensions.width}
          height={dimensions.height}
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
          bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
          backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
          // Points layer for data centers
          pointsData={dataCenters}
          pointLat="lat"
          pointLng="lng"
          pointAltitude="altitude"
          pointColor="color"
          pointRadius={0.3}
          pointsMerge={false}
          pointResolution={12}
          // Hover interaction
          onPointHover={(point: object | null) => setHoveredPoint(point as DataCenterPoint | null)}
          // Atmosphere
          atmosphereColor="#3a86ff"
          atmosphereAltitude={0.15}
          // Custom rendering for glow effect
          customLayerData={dataCenters.filter(dc => dc.status !== 'operational')}
          customThreeObject={(d: object) => {
            // Create glowing spike for non-operational DCs
            const dc = d as DataCenterPoint;
            const THREE = require('three');
            const geometry = new THREE.CylinderGeometry(0.3, 0.1, dc.altitude * 100, 8);
            const material = new THREE.MeshBasicMaterial({
              color: dc.color,
              transparent: true,
              opacity: 0.9,
            });
            const mesh = new THREE.Mesh(geometry, material);
            mesh.rotation.x = Math.PI / 2;
            return mesh;
          }}
          customThreeObjectUpdate={(obj: any, d: object) => {
            const dc = d as DataCenterPoint;
            Object.assign(obj.position, globeRef.current?.getCoords(dc.lat, dc.lng, dc.altitude / 2));
          }}
        />
      )}

      {/* Legend */}
      <div
        className="absolute top-4 left-4 p-4 rounded-lg"
        style={{
          backgroundColor: 'rgba(10, 14, 20, 0.85)',
          border: '1px solid var(--noc-border)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--noc-text-primary)' }}>
          Global Network
        </h3>
        <div className="space-y-2 text-xs">
          <LegendItem color="#3fb950" label="Operational" count={statusCounts.operational} />
          {statusCounts.issues > 0 && (
            <LegendItem color="#f85149" label="Issues" count={statusCounts.issues} />
          )}
          {statusCounts.maintenance > 0 && (
            <LegendItem color="#6e40c9" label="Maintenance" count={statusCounts.maintenance} />
          )}
        </div>
        <div className="mt-3 pt-3 border-t text-[10px]" style={{ borderColor: 'var(--noc-border)', color: 'var(--noc-text-muted)' }}>
          {dataCenters.length} data centers
        </div>
      </div>

      {/* Tooltip */}
      {hoveredPoint && (
        <div
          className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-3 rounded-lg"
          style={{
            backgroundColor: 'rgba(10, 14, 20, 0.95)',
            border: '1px solid var(--noc-border)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <div className="flex items-center gap-3">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: hoveredPoint.color }}
            />
            <div>
              <div className="font-semibold text-sm" style={{ color: 'var(--noc-text-primary)' }}>
                {hoveredPoint.name}
              </div>
              <div className="text-xs" style={{ color: 'var(--noc-text-muted)' }}>
                {hoveredPoint.code} • {getStatusLabel(hoveredPoint.status)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Controls hint */}
      <div
        className="absolute bottom-4 right-4 text-[10px] px-3 py-2 rounded"
        style={{
          backgroundColor: 'rgba(10, 14, 20, 0.7)',
          color: 'var(--noc-text-muted)',
        }}
      >
        Drag to rotate • Scroll to zoom
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

function getStatusColorHex(status: string): string {
  switch (status) {
    case 'operational':
      return '#3fb950';
    case 'degraded_performance':
      return '#d29922';
    case 'partial_outage':
      return '#db6d28';
    case 'major_outage':
      return '#f85149';
    case 'under_maintenance':
      return '#6e40c9';
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
