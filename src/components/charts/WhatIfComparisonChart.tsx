import React from 'react';
import './ChartSetup';
import { Bar } from 'react-chartjs-2';
import { EmissionBreakdown } from '../../types';

interface Props {
  currentBreakdown: EmissionBreakdown;
  simulatedBreakdown: EmissionBreakdown;
  height?: number;
}

export const WhatIfComparisonChart: React.FC<Props> = ({
  currentBreakdown,
  simulatedBreakdown,
  height = 300,
}) => {
  const categories = ['Transportation', 'Electricity', 'Food', 'Waste', 'Total'];

  const currentValues = [
    currentBreakdown.transportation,
    currentBreakdown.electricity,
    currentBreakdown.food,
    currentBreakdown.waste,
    currentBreakdown.total,
  ];

  const simulatedValues = [
    simulatedBreakdown.transportation,
    simulatedBreakdown.electricity,
    simulatedBreakdown.food,
    simulatedBreakdown.waste,
    simulatedBreakdown.total,
  ];

  const data = {
    labels: categories,
    datasets: [
      {
        label: 'Current Footprint',
        data: currentValues,
        backgroundColor: '#64748b', // slate-500
        borderRadius: 6,
        barPercentage: 0.7,
        categoryPercentage: 0.7,
      },
      {
        label: 'Simulated Footprint',
        data: simulatedValues,
        backgroundColor: '#059669', // emerald-600
        borderRadius: 6,
        barPercentage: 0.7,
        categoryPercentage: 0.7,
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
          label: (ctx: any) => ` ${ctx.dataset.label}: ${ctx.raw} kg CO₂e`,
          afterBody: (items: any) => {
            if (items.length > 0) {
              const idx = items[0].dataIndex;
              const cur = currentValues[idx] || 0;
              const sim = simulatedValues[idx] || 0;
              const diff = cur - sim;
              if (diff > 0) {
                const pct = cur > 0 ? Math.round((diff / cur) * 100) : 0;
                return `\nReduction: -${diff.toFixed(1)} kg CO₂e (-${pct}%)`;
              } else if (diff < 0) {
                return `\nIncrease: +${Math.abs(diff).toFixed(1)} kg CO₂e`;
              }
              return '\nNo change in this category';
            }
            return '';
          },
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          font: {
            family: "'Plus Jakarta Sans', sans-serif",
            size: 11,
            weight: 600 as const,
          },
          color: '#64748b',
        },
      },
      y: {
        beginAtZero: true,
        grid: { color: '#f1f5f9' },
        ticks: {
          font: {
            family: "'Plus Jakarta Sans', sans-serif",
            size: 11,
          },
          color: '#64748b',
          callback: (v: any) => `${v} kg`,
        },
      },
    },
  };

  return (
    <div style={{ height }} className="w-full">
      <Bar data={data} options={options} />
    </div>
  );
};
