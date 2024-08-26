import NavLayout from "@/components/NavLayout";
import React from "react";
import SampleDash from "./SampleDash";
import SampleFooter from "./SampleFooter";

const Dashboard: React.FC = (): JSX.Element => {
  return (
    <NavLayout>
      <div className="flex gap-10 flex-col">
        <div className="flex gap-8">
          <div className="stats shadow">
            <div className="stat">
              <div className="stat-title font-semibold">Total Revenue</div>
              <div className="stat-value text-primary">₱89,400</div>
              <div className="stat-desc">Total revenue this month</div>
            </div>
          </div>

          <div className="stats shadow">
            <div className="stat">
              <div className="stat-title font-semibold">Verified Resident</div>
              <div className="stat-value text-primary">9,400</div>
              <div className="stat-desc">Verified registered resident</div>
            </div>
          </div>

          <div className="stats shadow">
            <div className="stat">
              <div className="stat-title font-semibold">
                Verification
              </div>
              <div className="stat-value text-primary">200</div>
              <div className="stat-desc">Pending account verification</div>
            </div>
          </div>
        </div>
        <SampleDash />

        {/* <SampleFooter /> */}
      </div>
    </NavLayout>
  );
};

export default Dashboard;
