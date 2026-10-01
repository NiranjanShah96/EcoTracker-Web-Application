import React from 'react';
import './ChartSetup';
import { Doughnut } from 'react-chartjs-2';
import { EmissionBreakdown } from '../../types';

interface Props {
  breakdown: EmissionBreakdown;
  height?: number;
}

export const CategoryDoughnutChart: React.FC<Props> = ({ breakdown, height = 240 }) => {
  const data = {
    labels: ['Transportation', 'Electricity', 'Food', 'Waste'],
    datasets: [
      {
        data: [
          breakdown.transportation,
          breakdown.electricity,
          breakdown.food,
          breakdown.waste,
        ],
        backgroundColor: [
          '#059669', // emerald-600
          '#d97706', // amber-600
          '#0891b2', // cyan-600
          '#7c3aed', // violet-600
        ],
        borderColor: '#ffffff',
        borderWidth: 3,
        hoverOffset: 6,
        borderRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          boxWidth: 8,
          boxHeight: 8,
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 16,
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
        boxPadding: 4,
        titleFont: {
          family: "'Plus Jakarta Sans', sans-serif",
          size: 12,
          weight: 700 as const,
        },
        bodyFont: {
          family: "'Plus Jakarta Sans', sans-serif",
          size: 12,
        },
        callbacks: {
          label: (item: any) => {
            const val = item.raw || 0;
            const total = breakdown.total || 1;
            const pct = Math.round((val / total) * 100);
            return ` ${item.label}: ${val.toFixed(1)} kg CO₂e (${pct}%)`;
          },
        },
      },
    },
    cutout: '72%',
  };

  return (
    <div style={{ height }} className="relative flex items-center justify-center w-full">
      <Doughnut data={data} options={options} />
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-7">
        <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Total</span>
        <span className="text-2xl font-black text-slate-900 font-heading tracking-tight leading-none mt-0.5">
          {breakdown.total.toFixed(1)}
        </span>
        <span className="text-[10px] text-slate-500 font-medium">kg CO₂e / mo</span>
      </div>
    </div>
  );
};
