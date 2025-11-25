'use client';

import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface StatusChartProps {
  operational: number;
  degraded: number;
  outage: number;
  maintenance: number;
}

export default function StatusChart({ operational, degraded, outage, maintenance }: StatusChartProps) {
  const total = operational + degraded + outage + maintenance;
  const healthPercentage = total > 0 ? Math.round((operational / total) * 100) : 100;

  const data = {
    labels: ['Operational', 'Degraded', 'Outage', 'Maintenance'],
    datasets: [
      {
        data: [operational, degraded, outage, maintenance],
        backgroundColor: [
          'rgba(63, 185, 80, 0.8)',
          'rgba(210, 153, 34, 0.8)',
          'rgba(248, 81, 73, 0.8)',
          'rgba(88, 166, 255, 0.8)',
        ],
        borderColor: [
          'rgba(63, 185, 80, 1)',
          'rgba(210, 153, 34, 1)',
          'rgba(248, 81, 73, 1)',
          'rgba(88, 166, 255, 1)',
        ],
        borderWidth: 1,
        cutout: '70%',
      },
    ],
  };

  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(22, 27, 34, 0.95)',
        titleColor: '#f0f6fc',
        bodyColor: '#8b949e',
        borderColor: 'rgba(48, 54, 61, 1)',
        borderWidth: 1,
        padding: 10,
        displayColors: true,
      },
    },
  };

  return (
    <div
      className="rounded-lg border p-4 h-full flex flex-col"
      style={{
        backgroundColor: 'var(--noc-bg-card)',
        borderColor: 'var(--noc-border)',
      }}
    >
      <h3 className="text-xs font-medium uppercase tracking-wider mb-3" style={{ color: 'var(--noc-text-secondary)' }}>
        Service Health
      </h3>
      <div className="relative flex-1 min-h-[120px]">
        <Doughnut data={data} options={options} />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: healthPercentage >= 90 ? 'var(--noc-operational)' : healthPercentage >= 70 ? 'var(--noc-degraded)' : 'var(--noc-major)' }}>
              {healthPercentage}%
            </div>
            <div className="text-[10px]" style={{ color: 'var(--noc-text-muted)' }}>healthy</div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
        <LegendItem color="var(--noc-operational)" label="Operational" value={operational} />
        <LegendItem color="var(--noc-degraded)" label="Degraded" value={degraded} />
        <LegendItem color="var(--noc-major)" label="Outage" value={outage} />
        <LegendItem color="var(--noc-maintenance)" label="Maintenance" value={maintenance} />
      </div>
    </div>
  );
}

function LegendItem({ color, label, value }: { color: string; label: string; value: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
      <span style={{ color: 'var(--noc-text-muted)' }}>{label}</span>
      <span className="font-medium ml-auto" style={{ color: value > 0 ? color : 'var(--noc-text-muted)' }}>{value}</span>
    </div>
  );
}
