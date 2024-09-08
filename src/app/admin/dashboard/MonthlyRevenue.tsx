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
    <div className="p-5 bg-white rounded-2xl shadow-sm border h-80 mr-auto border-gray-300 border-opacity-50">
      <Bar data={data} options={options} />
    </div>
  );
};

export default MonthlyRevenue;
