"use client";
import UserNavLayout from "@/components/UserNavLayout";
import React from "react";
import Verify from "./Verify";
import RecentRevenue from "@/app/admin/dashboard/SampleDash";
import OfficialTable from "./OfficialTable";

const Dashboard: React.FC = (): JSX.Element => {
  return (
    <UserNavLayout>
      <div className="flex flex-col gap-5 md:items-start">
        <Verify />
        <div className="flex gap-10 flex-col md:flex-row">
          <RecentRevenue />
          <OfficialTable />
        </div>
      </div>
    </UserNavLayout>
  );
};

export default Dashboard;
