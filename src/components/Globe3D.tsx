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
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const rotateSpeedRef = useRef(0.3);
  const targetSpeedRef = useRef(0.3);
  const animationFrameRef = useRef<number | null>(null);

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

  // Smooth rotation speed animation
  useEffect(() => {
    const animate = () => {
      const controls = globeRef.current?.controls();
      if (controls) {
        // Smoothly interpolate towards target speed (easing)
        const diff = targetSpeedRef.current - rotateSpeedRef.current;
        rotateSpeedRef.current += diff * 0.08; // Smooth easing factor

        // Apply the speed
        controls.autoRotateSpeed = rotateSpeedRef.current;

        // Keep animating if not at target
        if (Math.abs(diff) > 0.001) {
          animationFrameRef.current = requestAnimationFrame(animate);
        }
      }
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Handle hover state for smooth rotation pause
  const handleMouseEnter = useCallback(() => {
    targetSpeedRef.current = 0;
    // Restart animation loop
    const animate = () => {
      const controls = globeRef.current?.controls();
      if (controls) {
        const diff = targetSpeedRef.current - rotateSpeedRef.current;
        rotateSpeedRef.current += diff * 0.08;
        controls.autoRotateSpeed = rotateSpeedRef.current;
        if (Math.abs(diff) > 0.001) {
          animationFrameRef.current = requestAnimationFrame(animate);
        }
      }
    };
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    animate();
  }, []);

  const handleMouseLeave = useCallback(() => {
    targetSpeedRef.current = 0.3;
    // Clear tooltip with delay for smooth fade
    setTimeout(() => {
      if (targetSpeedRef.current === 0.3) {
        setHoveredPoint(null);
        setTooltipVisible(false);
      }
    }, 200);
    // Restart animation loop
    const animate = () => {
      const controls = globeRef.current?.controls();
      if (controls) {
        const diff = targetSpeedRef.current - rotateSpeedRef.current;
        rotateSpeedRef.current += diff * 0.08;
        controls.autoRotateSpeed = rotateSpeedRef.current;
        if (Math.abs(diff) > 0.001) {
          animationFrameRef.current = requestAnimationFrame(animate);
        }
      }
    };
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    animate();
  }, []);

  // Handle tooltip visibility with smooth transition
  const handleLabelHover = useCallback((label: object | null, prevLabel: object | null) => {
    if (label) {
      const dc = label as DataCenterPoint;
      setHoveredPoint(dc);
      setTooltipVisible(true);

      // Get screen coordinates from the globe
      if (globeRef.current) {
        const coords = globeRef.current.getScreenCoords(dc.lat, dc.lng, 0.01);
        if (coords) {
          setTooltipPos({ x: coords.x, y: coords.y });
        }
      }
    } else {
      // Delay hiding for smooth fade out
      setTooltipVisible(false);
      setTimeout(() => {
        setHoveredPoint(null);
      }, 150);
    }
  }, []);

  const handleLabelClick = useCallback((label: object, event: MouseEvent) => {
    const dc = label as DataCenterPoint;
    setHoveredPoint(dc);
    setTooltipVisible(true);

    // Get screen coordinates from the globe
    if (globeRef.current) {
      const coords = globeRef.current.getScreenCoords(dc.lat, dc.lng, 0.01);
      if (coords) {
        setTooltipPos({ x: coords.x, y: coords.y });
      }
    }
  }, []);

  // Label accessors
  const getLabelColor = useCallback((d: object) => {
    const dc = d as DataCenterPoint;
    return dc.color;
  }, []);

  const getLabelSize = useCallback((d: object) => {
    const dc = d as DataCenterPoint;
    // Larger labels for better visibility and tap area
    return dc.status === 'operational' ? 0.6 : 1.2;
  }, []);

  const getLabelDotRadius = useCallback((d: object) => {
    const dc = d as DataCenterPoint;
    // Larger dots for easier clicking/tapping
    return dc.status === 'operational' ? 0.5 : 0.9;
  }, []);

  const getLabelText = useCallback((d: object) => {
    const dc = d as DataCenterPoint;
    return dc.code;
  }, []);

  return (
    <div
      className="relative w-full h-full"
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleMouseEnter}
      onTouchEnd={handleMouseLeave}
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
          onLabelHover={handleLabelHover}
          onLabelClick={handleLabelClick}
        />
      )}

      {/* Legend - Mobile: compact row, Desktop: full */}
      {/* Mobile Legend - Compact */}
      <div
        className="sm:hidden absolute top-2 left-2 right-2 flex items-center justify-between px-2 py-1.5 rounded-lg"
        style={{
          backgroundColor: 'rgba(10, 14, 20, 0.8)',
          border: '1px solid var(--noc-border)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <span className="text-[10px] font-medium" style={{ color: 'var(--noc-text-muted)' }}>
          {dataCenters.length} DCs
        </span>
        <div className="flex items-center gap-2">
          <MiniLegendItem color="#3fb950" count={statusCounts.operational} />
          {statusCounts.degraded > 0 && <MiniLegendItem color="#d29922" count={statusCounts.degraded} />}
          {statusCounts.partialOutage > 0 && <MiniLegendItem color="#db6d28" count={statusCounts.partialOutage} />}
          {statusCounts.majorOutage > 0 && <MiniLegendItem color="#f85149" count={statusCounts.majorOutage} />}
          {statusCounts.maintenance > 0 && <MiniLegendItem color="#58a6ff" count={statusCounts.maintenance} />}
        </div>
      </div>

      {/* Desktop Legend - Full */}
      <div
        className="hidden sm:block absolute top-4 left-4 p-4 rounded-lg"
        style={{
          backgroundColor: 'rgba(10, 14, 20, 0.85)',
          border: '1px solid var(--noc-border)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--noc-text-primary)' }}>
          Cloudflare Global DCs
        </h3>
        <div className="space-y-2 text-xs">
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
        <div className="mt-3 pt-3 border-t text-[10px]" style={{ borderColor: 'var(--noc-border)', color: 'var(--noc-text-muted)' }}>
          {dataCenters.length} data centers
        </div>
      </div>

      {/* Tooltip positioned at marker location */}
      <div
        className="absolute px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg pointer-events-none whitespace-nowrap"
        style={{
          left: tooltipPos.x,
          top: tooltipPos.y,
          backgroundColor: 'rgba(10, 14, 20, 0.95)',
          border: '1px solid var(--noc-border)',
          backdropFilter: 'blur(8px)',
          opacity: tooltipVisible && hoveredPoint ? 1 : 0,
          transform: `translate(-50%, calc(-100% - 12px)) translateY(${tooltipVisible && hoveredPoint ? 0 : 4}px)`,
          transition: 'opacity 120ms ease-out, transform 120ms ease-out',
          visibility: hoveredPoint ? 'visible' : 'hidden',
          zIndex: 100,
        }}
      >
        {hoveredPoint && (
          <div className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: hoveredPoint.color }}
            />
            <div>
              <div className="font-semibold text-[11px] sm:text-xs" style={{ color: 'var(--noc-text-primary)' }}>
                {hoveredPoint.name}
              </div>
              <div className="text-[9px] sm:text-[10px] flex items-center gap-1" style={{ color: 'var(--noc-text-muted)' }}>
                <span className="font-mono">{hoveredPoint.code}</span>
                <span>•</span>
                <span style={{ color: hoveredPoint.color }}>{getStatusLabel(hoveredPoint.status)}</span>
              </div>
            </div>
          </div>
        )}
      </div>

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

// Compact legend item for mobile - just dot and count
function MiniLegendItem({ color, count }: { color: string; count: number }) {
  return (
    <div className="flex items-center gap-1">
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
      <span className="text-[10px] font-medium" style={{ color }}>{count}</span>
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
