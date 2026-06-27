import React from 'react';

import {
    Chart as ChartJS,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

import { Pie } from 'react-chartjs-2';

ChartJS.register(
    ArcElement,
    Title,
    Tooltip,
    Legend
);

const emptyChartData = {
    labels: [],
    datasets: [{ label: "Compliance", data: [], backgroundColor: [], borderWidth: 1 }],
};

export default function DashboardPieChart({ chartData }) {

const data = chartData?.labels?.length ? chartData : emptyChartData;

return (
<>
    <div className='pie-chart-container'>
        <Pie
            data={data}
            options={{
                responsive: true,
                maintainAspectRatio: false,
            }}
        />
    </div>
</>
);
}
