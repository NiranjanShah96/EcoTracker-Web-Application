import React from 'react';
import './ChartSetup';
import { Line } from 'react-chartjs-2';
import { FootprintRecord } from '../../types';

interface Props {
  records: FootprintRecord[];
  height?: number;
}

export const HistoricalTrendChart: React.FC<Props> = ({ records, height = 280 }) => {
  const sorted = [...records].sort((a, b) => a.timestamp - b.timestamp);

  const labels = sorted.map((r) => r.dateFormatted);
  const dataPoints = sorted.map((r) => r.breakdown.total);

  const data = {
    labels,
    datasets: [
      {
        label: 'Total Footprint',
        data: dataPoints,
        borderColor: '#059669',
        backgroundColor: 'rgba(5, 150, 105, 0.08)',
        tension: 0.35,
        fill: true,
        pointBackgroundColor: '#059669',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: '1.5°C Goal (200 kg)',
        data: sorted.map(() => 200),
        borderColor: '#0284c7',
        borderDash: [5, 5],
        borderWidth: 1.5,
        fill: false,
        pointRadius: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        align: 'end' as const,
        labels: {
          boxWidth: 8,
          boxHeight: 8,
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 12,
          font: {
            family: "'Plus Jakarta Sans', sans-serif",
            size: 11,
            weight: 600 as const,
          },
          color: '#475569',
        },
      },
      tooltip: {
        backgroundColor: '#0f172a',
        padding: 12,
        cornerRadius: 10,
        callbacks: {
          label: (context: any) => ` ${context.dataset.label}: ${context.raw} kg CO₂e`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            family: "'Plus Jakarta Sans', sans-serif",
            size: 11,
          },
          color: '#64748b',
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: '#f1f5f9',
        },
        ticks: {
          font: {
            family: "'Plus Jakarta Sans', sans-serif",
            size: 11,
          },
          color: '#64748b',
          callback: (val: any) => `${val} kg`,
        },
      },
    },
  };

  return (
    <div style={{ height }} className="w-full">
      <Line data={data} options={options} />
    </div>
  );
};
