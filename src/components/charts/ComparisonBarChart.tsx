import React from 'react';
import './ChartSetup';
import { Bar } from 'react-chartjs-2';
import { FootprintRecord } from '../../types';

interface Props {
  recordA: FootprintRecord;
  recordB: FootprintRecord;
  height?: number;
}

export const ComparisonBarChart: React.FC<Props> = ({ recordA, recordB, height = 300 }) => {
  const categories = ['Transportation', 'Electricity', 'Food', 'Waste', 'Total'];

  const valuesA = [
    recordA.breakdown.transportation,
    recordA.breakdown.electricity,
    recordA.breakdown.food,
    recordA.breakdown.waste,
    recordA.breakdown.total,
  ];

  const valuesB = [
    recordB.breakdown.transportation,
    recordB.breakdown.electricity,
    recordB.breakdown.food,
    recordB.breakdown.waste,
    recordB.breakdown.total,
  ];

  const data = {
    labels: categories,
    datasets: [
      {
        label: `Record 1 (${recordA.dateFormatted})`,
        data: valuesA,
        backgroundColor: '#0284c7', // sky-600
        borderRadius: 4,
      },
      {
        label: `Record 2 (${recordB.dateFormatted})`,
        data: valuesB,
        backgroundColor: '#10b981', // emerald-500
        borderRadius: 4,
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
          boxWidth: 12,
          usePointStyle: true,
          font: {
            family: "'Plus Jakarta Sans', sans-serif",
            size: 11,
          },
        },
      },
      tooltip: {
        backgroundColor: '#0f172a',
        padding: 10,
        callbacks: {
          label: (ctx: any) => ` ${ctx.dataset.label}: ${ctx.raw} kg CO₂e`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
      },
      y: {
        beginAtZero: true,
        ticks: {
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
