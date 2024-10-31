"use client";
import UserNavLayout from "@/components/UserNavLayout";
import React from "react";
import Verify from "./Verify";
import OfficialTable from "./OfficialTable";
import InfoErrors from "./InfoErrors";

const Dashboard: React.FC = (): JSX.Element => {
  return (
    <UserNavLayout>
      <div className="flex flex-col gap-5 md:items-start">
        <InfoErrors />
        <Verify />
        <div className="flex gap-10 flex-col md:flex-row">
          <OfficialTable />
        </div>
      </div>
    </UserNavLayout>
  );
};

export default Dashboard;
