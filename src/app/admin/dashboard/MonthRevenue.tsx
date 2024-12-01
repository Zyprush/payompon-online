import React, { useEffect, useState } from "react";
import { useRevenueStore } from "@/state/revenue";
import { TbCurrencyPeso } from "react-icons/tb";

const MonthRevenue: React.FC = () => {
  const [monthlyRevenue, setMonthlyRevenue] = useState<number | null>(null);
  const { fetchRevenueThisMonth } = useRevenueStore();

  useEffect(() => {
    const fetchRevenue = async () => {
      const totalRevenue = await fetchRevenueThisMonth();
      setMonthlyRevenue(totalRevenue);
    };

    fetchRevenue();
  }, [fetchRevenueThisMonth]);

  return (
    <div className="flex items-center w-full justify-between p-6 bg-white shadow rounded-lg">
      {/* Icon Section */}
      <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
        <TbCurrencyPeso className="text-green-600 text-4xl" />
      </div>

      {/* Revenue Details Section */}
      <div className="ml-4 flex-1">
        <h3 className="text-lg font-semibold text-gray-700">Monthly Revenue</h3>
        <div className="mt-2 text-4xl font-bold text-primary flex items-center">
          {monthlyRevenue !== null ? (
            `₱${monthlyRevenue.toLocaleString()}`
          ) : (
            "Loading..."
          )}
        </div>
        <p className="mt-1 text-xs text-gray-500">Total revenue this month</p>
      </div>
    </div>
  );
};

export default MonthRevenue;
