import React, { useEffect, useState } from "react";
import { useRevenueStore } from "@/state/revenue";

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
    <div className="stats shadow">
      <div className="stat">
        <div className="stat-title font-semibold">Monthly Revenue</div>
        <div className="stat-value text-primary">
          {monthlyRevenue !== null ? `₱${monthlyRevenue.toLocaleString()}` : "Loading..."}
        </div>
        <div className="stat-desc">Total revenue this month</div>
      </div>
    </div>
  );
};

export default MonthRevenue;
