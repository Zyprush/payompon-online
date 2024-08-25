import NavLayout from "@/components/NavLayout";
import React from "react";
import SampleDash from "./SampleDash";

const Dashboard: React.FC = (): JSX.Element => {
  return (
    <NavLayout>
      <div>
        <SampleDash />
      </div>
    </NavLayout>
  );
};

export default Dashboard;
