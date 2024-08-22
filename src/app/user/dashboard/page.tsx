import UserNavLayout from "@/components/UserNavLayout";
import React from "react";

const Dashboard: React.FC = (): JSX.Element => {
  return (
    <UserNavLayout>
      <div>
        {" "}
        <div className="flex-1 p-6 bg-gray-100">
          <div className="text-2xl font-bold">Dashboard Overview</div>
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition duration-200">
              <h3 className="font-semibold text-lg">Card 1</h3>
              <p className="text-gray-600">Placeholder content for card 1.</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition duration-200">
              <h3 className="font-semibold text-lg">Card 2</h3>
              <p className="text-gray-600">Placeholder content for card 2.</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition duration-200">
              <h3 className="font-semibold text-lg">Card 3</h3>
              <p className="text-gray-600">Placeholder content for card 3.</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition duration-200">
              <h3 className="font-semibold text-lg">Card 4</h3>
              <p className="text-gray-600">Placeholder content for card 4.</p>
            </div>
          </div>
        </div>
      </div>
    </UserNavLayout>
  );
};

export default Dashboard;
