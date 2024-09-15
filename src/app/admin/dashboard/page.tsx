"use client";
import NavLayout from "@/components/NavLayout";
import React from "react";
import RecentRevenue from "./RecentRevenue";
import MonthRevenue from "./MonthRevenue";
import MonthlyRevenue from "./MonthlyRevenue";
import DashVerified from "./DashVerified";
import DashNotVerified from "./DashNotVerfied";


const Dashboard: React.FC = (): JSX.Element => {
  return (
    <NavLayout>
      <div className="flex flex-col gap-5 w-full">
        {/* First row: Made them equal sides */}
        <div className="flex flex-col md:flex-row gap-5 w-full">
          <MonthRevenue />
          <DashNotVerified />
          <DashVerified />
        </div>

        {/* Second row */}
        <div className="grid grid-cols-1 gap-4 w-full md:grid-cols-2">
          <MonthlyRevenue />
          <RecentRevenue />
        </div>


        {/* <SampleFooter /> */}
      </div>
    </NavLayout>
  );
};

export default Dashboard;
