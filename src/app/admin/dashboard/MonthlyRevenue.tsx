import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { useRevenueStore } from '@/state/revenue';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const MonthlyRevenue: React.FC = () => {
  const [monthlyRevenue, setMonthlyRevenue] = useState<number[]>([]);
  const { fetchRevenueEachMonth } = useRevenueStore();

  useEffect(() => {
    const fetchData = async () => {
      const revenueData = await fetchRevenueEachMonth();
      setMonthlyRevenue(revenueData);
    };

    fetchData();
  }, [fetchRevenueEachMonth]);

  // Chart labels (months)
  const labels = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Chart data
  const data = {
    labels,
    datasets: [
      {
        label: 'Revenue (₱)',
        data: monthlyRevenue,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false, // Allow the chart to fill the container
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      title: {
        display: false,
        text: 'Monthly Revenue for Current Year',
      },
    },
  };

  return (
    <div className="flex-1 p-5 bg-white rounded-2xl shadow-sm border border-gray-300 border-opacity-50 h-96 overflow-y-auto">
      <h2 className="font-bold text-primary mb-4">Monthly Revenue</h2>
      <div className="w-full h-full">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default MonthlyRevenue;
