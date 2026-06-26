import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function CampaignTrendChart({ trends }) {
  const chartData = useMemo(() => {
    const labels = trends?.labels?.length ? trends.labels : ['—'];
    return {
      labels,
      datasets: [
        {
          label: 'Sent',
          data: trends?.sent?.length ? trends.sent : [0],
          borderColor: '#3b82f6',
          tension: 0.4,
          fill: false,
        },
        {
          label: 'Clicked',
          data: trends?.clicked?.length ? trends.clicked : [0],
          borderColor: '#f59e0b',
          tension: 0.4,
          fill: false,
        },
        {
          label: 'Submitted',
          data: trends?.submitted?.length ? trends.submitted : [0],
          borderColor: '#ef4444',
          tension: 0.4,
          fill: false,
        },
      ],
    };
  }, [trends]);

  const maxValue = useMemo(() => {
    const values = chartData.datasets.flatMap((d) => d.data);
    const max = Math.max(...values, 0);
    return max > 0 ? Math.ceil(max * 1.2) : 100;
  }, [chartData]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { intersect: false, mode: 'index' },
    plugins: {
      legend: {
        position: 'top',
        align: 'end',
        labels: {
          color: '#e2e8f0',
          usePointStyle: true,
          pointStyle: 'line',
          boxWidth: 20,
          padding: 20,
        },
      },
    },
    scales: {
      y: {
        min: 0,
        max: maxValue,
        ticks: { color: '#475569' },
        grid: { color: '#1e293b' },
      },
      x: {
        grid: { display: false },
        ticks: { color: '#475569' },
      },
    },
    elements: { point: { radius: 0 } },
  };

  return (
    <div style={{ height: '400px', backgroundColor: '#0f172a', padding: '24px', borderRadius: '12px' }}>
      <div style={{ marginBottom: '16px' }}>
        <h2 style={{ color: '#ffffff', fontSize: '18px', fontWeight: 'bold', margin: '0' }}>Campaign Trend</h2>
        <p style={{ color: '#64748b', fontSize: '12px', margin: '4px 0 0' }}>Email activity from live dashboard API</p>
      </div>
      <div style={{ height: '300px' }}>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}
