import React from 'react'

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const emptyChartData = {
    labels: [],
    datasets: [{ label: "Tasks", data: [], backgroundColor: "#4F46E5" }],
};

export default function DashboardBarChart({ chartData }) {

    const data = chartData?.labels?.length ? chartData : emptyChartData;

return <>
    
    <div className='w-100 chart-container'>
        <Bar
            data={data}
            options={{
                responsive: true,
                maintainAspectRatio: false,
            }}
        />
    </div>

</>
}
