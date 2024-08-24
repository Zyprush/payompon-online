import NavLayout from "@/components/NavLayout";
import React from "react";

const Dashboard: React.FC = (): JSX.Element => {
  return (
    <NavLayout>
      <div>
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-primary mb-4">Recent Orders</h2>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="py-3 px-6 text-left  font-bold text-gray-700 text-xs uppercase tracking-wider"
                >
                  Document
                </th>
                <th
                  scope="col"
                  className="py-3 px-6 text-left  font-bold text-gray-700 text-xs uppercase tracking-wider"
                >
                  Price
                </th>
                <th
                  scope="col"
                  className="py-3 px-6 text-left  font-bold text-gray-700 text-xs uppercase tracking-wider"
                >
                  Date
                </th>
                <th
                  scope="col"
                  className="py-3 px-6 text-left  font-bold text-gray-700 text-xs uppercase tracking-wider"
                >
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="py-4 px-6 whitespace-nowrap">
                Barangay clearance
                </td>
                <td className="py-4 px-6 whitespace-nowrap">$99</td>
                <td className="py-4 px-6 whitespace-nowrap">23 Aug 2024</td>
                <td className="py-4 px-6 whitespace-nowrap">
                  <span className="text-green-500">Delivered</span>
                </td>
              </tr>
              <tr>
                <td className="py-4 px-6 whitespace-nowrap">Barangay clearance</td>
                <td className="py-4 px-6 whitespace-nowrap">$99</td>
                <td className="py-4 px-6 whitespace-nowrap">20 Aug 2024</td>
                <td className="py-4 px-6 whitespace-nowrap">
                  <span className="text-yellow-500">On Going</span>
                </td>
              </tr>
              <tr>
                <td className="py-4 px-6 whitespace-nowrap">Business permit</td>
                <td className="py-4 px-6 whitespace-nowrap">$99</td>
                <td className="py-4 px-6 whitespace-nowrap">19 Aug 2024</td>
                <td className="py-4 px-6 whitespace-nowrap">
                  <span className="text-green-500">Delivered</span>
                </td>
              </tr>
              <tr>
                <td className="py-4 px-6 whitespace-nowrap">Indigency</td>
                <td className="py-4 px-6 whitespace-nowrap">$99</td>
                <td className="py-4 px-6 whitespace-nowrap">21 Aug 2024</td>
                <td className="py-4 px-6 whitespace-nowrap">
                  <span className="text-red-500">Cancelled</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </NavLayout>
  );
};

export default Dashboard;
