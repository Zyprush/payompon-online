"use client";
import NavLayout from "@/components/NavLayout";
import React from "react";
import RecentRevenue from "./RecentRevenue";
import MonthRevenue from "./MonthRevenue";
import MonthlyRevenue from "./MonthlyRevenue";

const Dashboard: React.FC = (): JSX.Element => {
  return (
    <NavLayout>
      <div className="flex gap-10 flex-col">
        <div className="flex gap-8">
          <MonthRevenue />

          <div className="stats shadow">
            <div className="stat">
              <div className="stat-title font-semibold">Verified Resident</div>
              {/* TODO: add feature */}
              <div className="stat-value text-primary">9,400</div>
              <div className="stat-desc">Verified registered resident</div>
            </div>
          </div>

          <div className="stats shadow">
            <div className="stat">
              <div className="stat-title font-semibold">Verification</div>
              {/* TODO: add feature */}
              <div className="stat-value text-primary">200</div>
              <div className="stat-desc">Pending account verification</div>
            </div>
          </div>
        </div>
        <div className="flex gap-5">
          <RecentRevenue />
          <MonthlyRevenue />
        </div>

        {/* <SampleFooter /> */}
      </div>
    </NavLayout>
  );
};

export default Dashboard;
