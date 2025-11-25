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
  continent: string;
}

// Map airport codes to continents
const continentMapping: Record<string, string> = {
  // North America
  ABQ: 'North America', ANC: 'North America', ATL: 'North America', AUS: 'North America',
  BNA: 'North America', BOS: 'North America', BGR: 'North America', BUF: 'North America',
  CLE: 'North America', CLT: 'North America', CMH: 'North America', DEN: 'North America',
  DFW: 'North America', DTW: 'North America', EWR: 'North America', FSD: 'North America',
  HNL: 'North America', IAD: 'North America', IAH: 'North America', IND: 'North America',
  JAX: 'North America', LAS: 'North America', LAX: 'North America', MCI: 'North America',
  MEM: 'North America', MFE: 'North America', MIA: 'North America', MSP: 'North America',
  OKC: 'North America', OMA: 'North America', ORD: 'North America', ORF: 'North America',
  PDX: 'North America', PHL: 'North America', PHX: 'North America', PIT: 'North America',
  RDU: 'North America', RIC: 'North America', SAN: 'North America', SAT: 'North America',
  SEA: 'North America', SFO: 'North America', SJC: 'North America', SLC: 'North America',
  SMF: 'North America', STL: 'North America', TLH: 'North America', TPA: 'North America',
  YHZ: 'North America', YOW: 'North America', YUL: 'North America', YVR: 'North America',
  YWG: 'North America', YXE: 'North America', YYC: 'North America', YYZ: 'North America',
  GDL: 'North America', MEX: 'North America', QRO: 'North America',
  BGI: 'North America', GND: 'North America', GUA: 'North America', KIN: 'North America',
  POS: 'North America', PTY: 'North America', SAP: 'North America', SDQ: 'North America',
  SJO: 'North America', SJU: 'North America', STI: 'North America', TGU: 'North America',

  // South America
  ARI: 'South America', ARU: 'South America', ASU: 'South America', BAQ: 'South America',
  BEL: 'South America', BNU: 'South America', BOG: 'South America', BSB: 'South America',
  CAW: 'South America', CCP: 'South America', CFC: 'South America', CGB: 'South America',
  CLO: 'South America', CNF: 'South America', COR: 'South America', CWB: 'South America',
  EZE: 'South America', FLN: 'South America', FOR: 'South America', GEO: 'South America',
  GIG: 'South America', GRU: 'South America', GYE: 'South America', GYN: 'South America',
  JDO: 'South America', JOI: 'South America', LIM: 'South America', LPB: 'South America',
  MAO: 'South America', MDE: 'South America', NQN: 'South America', NVT: 'South America',
  PBM: 'South America', PMW: 'South America', POA: 'South America', QWJ: 'South America',
  RAO: 'South America', REC: 'South America', SCL: 'South America', SJK: 'South America',
  SJP: 'South America', SOD: 'South America', SSA: 'South America', UDI: 'South America',
  UIO: 'South America', VCP: 'South America', VIX: 'South America', XAP: 'South America',

  // Europe
  AMS: 'Europe', BCN: 'Europe', BOD: 'Europe', BRU: 'Europe', CDG: 'Europe',
  DUB: 'Europe', DUS: 'Europe', EDI: 'Europe', FRA: 'Europe', GVA: 'Europe',
  HAM: 'Europe', LHR: 'Europe', LIS: 'Europe', LUX: 'Europe', LYS: 'Europe',
  MAD: 'Europe', MAN: 'Europe', MRS: 'Europe', MUC: 'Europe', MXP: 'Europe',
  PMO: 'Europe', STR: 'Europe', ZRH: 'Europe', ARN: 'Europe', CPH: 'Europe',
  GOT: 'Europe', HEL: 'Europe', KEF: 'Europe', OSL: 'Europe', RIX: 'Europe',
  TLL: 'Europe', VNO: 'Europe', BEG: 'Europe', BTS: 'Europe', BUD: 'Europe',
  KBP: 'Europe', KIV: 'Europe', MSQ: 'Europe', OTP: 'Europe', PRG: 'Europe',
  SKP: 'Europe', SOF: 'Europe', TIA: 'Europe', TXL: 'Europe', VIE: 'Europe',
  WAW: 'Europe', ZAG: 'Europe', ATH: 'Europe', FCO: 'Europe', SKG: 'Europe',
  IST: 'Europe', ADB: 'Europe', LCA: 'Europe',

  // Asia
  AKX: 'Asia', ALA: 'Asia', DME: 'Asia', EVN: 'Asia', FRU: 'Asia',
  GYD: 'Asia', KJA: 'Asia', LED: 'Asia', LLK: 'Asia', NQZ: 'Asia',
  TBS: 'Asia', ULN: 'Asia', AMM: 'Asia', BAH: 'Asia', BEY: 'Asia',
  BGW: 'Asia', BSR: 'Asia', DMM: 'Asia', DOH: 'Asia', DXB: 'Asia',
  EBL: 'Asia', HFA: 'Asia', ISU: 'Asia', JED: 'Asia', KWI: 'Asia',
  MCT: 'Asia', NJF: 'Asia', RUH: 'Asia', TLV: 'Asia', XNH: 'Asia',
  ZDM: 'Asia', AMD: 'Asia', BLR: 'Asia', BOM: 'Asia', CCU: 'Asia',
  CMB: 'Asia', CNN: 'Asia', COK: 'Asia', DAC: 'Asia', CGP: 'Asia',
  DEL: 'Asia', HYD: 'Asia', ISB: 'Asia', IXC: 'Asia', KHI: 'Asia',
  KNU: 'Asia', KTM: 'Asia', MAA: 'Asia', MLE: 'Asia', NAG: 'Asia',
  PAT: 'Asia', PBH: 'Asia', BKK: 'Asia', BWN: 'Asia', CEB: 'Asia',
  CGK: 'Asia', CGY: 'Asia', CNX: 'Asia', CRK: 'Asia', DAD: 'Asia',
  DPS: 'Asia', HAN: 'Asia', JHB: 'Asia', JOG: 'Asia', KCH: 'Asia',
  KUL: 'Asia', MLG: 'Asia', MNL: 'Asia', PNH: 'Asia', SGN: 'Asia',
  SIN: 'Asia', URT: 'Asia', VTE: 'Asia', BHY: 'Asia', CAN: 'Asia',
  CGD: 'Asia', CGO: 'Asia', CKG: 'Asia', CSX: 'Asia', CZX: 'Asia',
  DLC: 'Asia', FOC: 'Asia', FUO: 'Asia', HAK: 'Asia', HGH: 'Asia',
  HYN: 'Asia', JXG: 'Asia', KHN: 'Asia', KMG: 'Asia', KWE: 'Asia',
  NNG: 'Asia', PEK: 'Asia', PKX: 'Asia', PVG: 'Asia', SHA: 'Asia',
  SJW: 'Asia', SZX: 'Asia', TAO: 'Asia', TEN: 'Asia', TNA: 'Asia',
  TYN: 'Asia', XFN: 'Asia', XIY: 'Asia', XNN: 'Asia', FUK: 'Asia',
  ICN: 'Asia', KIX: 'Asia', NRT: 'Asia', OKA: 'Asia', HKG: 'Asia',
  KHH: 'Asia', MFM: 'Asia', TPE: 'Asia',

  // Africa
  AAE: 'Africa', ALG: 'Africa', CAI: 'Africa', CMN: 'Africa', CZL: 'Africa',
  ORN: 'Africa', TUN: 'Africa', ABJ: 'Africa', ACC: 'Africa', ASK: 'Africa',
  DKR: 'Africa', LOS: 'Africa', OUA: 'Africa', ADD: 'Africa', DAR: 'Africa',
  EBB: 'Africa', JIB: 'Africa', KGL: 'Africa', MBA: 'Africa', NBO: 'Africa',
  FIH: 'Africa', LAD: 'Africa', CPT: 'Africa', DUR: 'Africa', GBE: 'Africa',
  HRE: 'Africa', JNB: 'Africa', LLW: 'Africa', LUN: 'Africa', MPM: 'Africa',
  WDH: 'Africa', MRU: 'Africa', RUN: 'Africa', TNR: 'Africa',

  // Oceania
  ADL: 'Oceania', BNE: 'Oceania', CBR: 'Oceania', HBA: 'Oceania',
  MEL: 'Oceania', PER: 'Oceania', SYD: 'Oceania', AKL: 'Oceania',
  CHC: 'Oceania', GUM: 'Oceania', NOU: 'Oceania', PPT: 'Oceania', SUV: 'Oceania',
};

// Region views configuration
const regionViews: Record<string, { center: [number, number]; zoom: number; label: string }> = {
  all: { center: [20, 20], zoom: 1, label: 'All Regions' },
  'North America': { center: [-95, 40], zoom: 2, label: 'North America' },
  'South America': { center: [-60, -15], zoom: 2, label: 'South America' },
  Europe: { center: [15, 50], zoom: 3, label: 'Europe' },
  Asia: { center: [100, 30], zoom: 1.8, label: 'Asia' },
  Africa: { center: [20, 0], zoom: 2, label: 'Africa' },
  Oceania: { center: [140, -25], zoom: 2.5, label: 'Oceania' },
};

export default function WorldMap({ components }: WorldMapProps) {
  const [tooltip, setTooltip] = useState<DataCenter | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [center, setCenter] = useState<[number, number]>([20, 20]);
  const [selectedContinent, setSelectedContinent] = useState<string>('all');

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
          continent: continentMapping[code] || 'Other',
        });
      }
    });

    return centers;
  }, [components]);

  // Filter data centers by selected continent
  const filteredDataCenters = useMemo(() => {
    if (selectedContinent === 'all') return dataCenters;
    return dataCenters.filter(dc => dc.continent === selectedContinent);
  }, [dataCenters, selectedContinent]);

  // Count by status (for filtered)
  const statusCounts = useMemo(() => {
    const counts = { operational: 0, degraded: 0, partialOutage: 0, majorOutage: 0, maintenance: 0 };
    filteredDataCenters.forEach((dc) => {
      if (dc.status === 'operational') counts.operational++;
      else if (dc.status === 'degraded_performance') counts.degraded++;
      else if (dc.status === 'partial_outage') counts.partialOutage++;
      else if (dc.status === 'major_outage') counts.majorOutage++;
      else if (dc.status === 'under_maintenance') counts.maintenance++;
    });
    return counts;
  }, [filteredDataCenters]);

  // Count by continent
  const continentCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    dataCenters.forEach(dc => {
      counts[dc.continent] = (counts[dc.continent] || 0) + 1;
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
    setSelectedContinent('all');
  };

  const handleContinentChange = (continent: string) => {
    setSelectedContinent(continent);
    const view = regionViews[continent];
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
        className="px-4 py-3 border-b flex items-center justify-between flex-wrap gap-3"
        style={{
          backgroundColor: 'var(--noc-bg-secondary)',
          borderColor: 'var(--noc-border)',
        }}
      >
        <div className="flex items-center gap-4">
          <h3 className="font-semibold text-sm" style={{ color: 'var(--noc-text-primary)' }}>
            Global Network
          </h3>
          <div className="flex items-center gap-3 text-xs flex-wrap">
            <LegendItem color="var(--noc-operational)" label="Operational" count={statusCounts.operational} />
            {statusCounts.degraded > 0 && <LegendItem color="var(--noc-degraded)" label="Degraded" count={statusCounts.degraded} />}
            {statusCounts.partialOutage > 0 && <LegendItem color="var(--noc-partial)" label="Partial Outage" count={statusCounts.partialOutage} />}
            {statusCounts.majorOutage > 0 && <LegendItem color="var(--noc-major)" label="Major Outage" count={statusCounts.majorOutage} />}
            {statusCounts.maintenance > 0 && <LegendItem color="var(--noc-maintenance)" label="Maintenance" count={statusCounts.maintenance} />}
          </div>
        </div>

        {/* Continent Filter Dropdown */}
        <div className="flex items-center gap-2">
          <label className="text-xs" style={{ color: 'var(--noc-text-muted)' }}>
            Region:
          </label>
          <select
            value={selectedContinent}
            onChange={(e) => handleContinentChange(e.target.value)}
            className="px-3 py-1.5 rounded text-sm"
            style={{
              backgroundColor: 'var(--noc-bg-elevated)',
              border: '1px solid var(--noc-border)',
              color: 'var(--noc-text-primary)',
            }}
          >
            <option value="all">All Regions ({dataCenters.length})</option>
            {Object.keys(regionViews)
              .filter(r => r !== 'all')
              .map(continent => (
                <option key={continent} value={continent}>
                  {continent} ({continentCounts[continent] || 0})
                </option>
              ))}
          </select>
        </div>
      </div>

      {/* Map Container - Responsive height */}
      <div
        className="relative h-[300px] sm:h-[400px] md:h-[500px]"
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
            {filteredDataCenters
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
            {filteredDataCenters
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
            title="Zoom in"
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
            title="Zoom out"
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
            <div className="flex items-center justify-between gap-4">
              <span style={{ color: getStatusColor(tooltip.status) }}>
                {getStatusLabel(tooltip.status)}
              </span>
              <span style={{ color: 'var(--noc-text-muted)' }}>
                {tooltip.continent}
              </span>
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
        <span>
          {selectedContinent === 'all'
            ? `${dataCenters.length} data centers worldwide`
            : `${filteredDataCenters.length} data centers in ${selectedContinent}`}
        </span>
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
