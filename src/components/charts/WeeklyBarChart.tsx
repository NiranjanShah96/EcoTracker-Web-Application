import React from 'react';
import './ChartSetup';
import { Bar } from 'react-chartjs-2';
import { FootprintRecord } from '../../types';

interface Props {
  records: FootprintRecord[];
  height?: number;
}

export const WeeklyBarChart: React.FC<Props> = ({ records, height = 280 }) => {
  const recent = [...records].slice(-5);

  const labels = recent.map((r) => r.dateFormatted);

  const data = {
    labels,
    datasets: [
      {
        label: 'Transportation',
        data: recent.map((r) => r.breakdown.transportation),
        backgroundColor: '#10b981',
        borderRadius: 4,
      },
      {
        label: 'Electricity',
        data: recent.map((r) => r.breakdown.electricity),
        backgroundColor: '#f59e0b',
        borderRadius: 4,
      },
      {
        label: 'Food',
        data: recent.map((r) => r.breakdown.food),
        backgroundColor: '#06b6d4',
        borderRadius: 4,
      },
      {
        label: 'Waste',
        data: recent.map((r) => r.breakdown.waste),
        backgroundColor: '#8b5cf6',
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
          boxWidth: 10,
          usePointStyle: true,
          font: {
            family: "'Plus Jakarta Sans', sans-serif",
            size: 11,
          },
          color: '#475569',
        },
      },
      tooltip: {
        backgroundColor: '#0f172a',
        padding: 10,
        callbacks: {
          label: (context: any) => ` ${context.dataset.label}: ${context.raw} kg CO₂e`,
        },
      },
    },
    scales: {
      x: {
        stacked: true,
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
        stacked: true,
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
      <Bar data={data} options={options} />
    </div>
  );
};
