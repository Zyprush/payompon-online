"use client";
import NavLayout from "@/components/NavLayout";
import React from "react";
import RecentRevenue from "./RecentRevenue";
import MonthRevenue from "./MonthRevenue";
import MonthlyRevenue from "./MonthlyRevenue";
import DashVerified from "./DashVerified";
import DashNotVerfied from "./DashNotVerfied";

const Dashboard: React.FC = (): JSX.Element => {
  return (
    <NavLayout>
      <div className="flex gap-5 flex-col w-full">
        <div className="flex gap-8">
          <MonthRevenue />
          <DashNotVerfied />
          <DashVerified />
        </div>
        <div className="flex w-full gap-5 flex-col">
          <MonthlyRevenue />
          <RecentRevenue />
        </div>

        {/* <SampleFooter /> */}
      </div>
    </NavLayout>
  );
};

export default Dashboard;
