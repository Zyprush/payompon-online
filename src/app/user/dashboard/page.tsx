"use client";
import UserNavLayout from "@/components/UserNavLayout";
import React from "react";
import Verify from "./Verify";
import SampleDash from "@/app/admin/dashboard/SampleDash";

const Dashboard: React.FC = (): JSX.Element => {
  return (
    <UserNavLayout>
      <div className="flex flex-col gap-5 md:items-start">
        <Verify />
        <SampleDash />
      </div>
    </UserNavLayout>
  );
};

export default Dashboard;
