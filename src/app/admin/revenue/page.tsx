"use client";
import NavLayout from "@/components/NavLayout";
import { useRevenueStore } from "@/state/revenue";
import { formatDate } from "date-fns";
import React, { useEffect } from "react";

const Revenue: React.FC = (): JSX.Element => {
  const { revenue, fetchRevenue, loadingRevenue } = useRevenueStore();

  // Fetch the revenue data when the component mounts
  useEffect(() => {
    fetchRevenue();
  }, [fetchRevenue]);

  return (
    <NavLayout>
      <div className="flex gap-10 flex-col">
        <h1 className="text-xl text-primary drop-shadow font-bold">Revenue</h1>

        {loadingRevenue ? (
          <p className="text-sm font-semibold flex items-center gap-3 text-zinc-600 border rounded-sm p-2 px-6 m-auto md:ml-0 md:mr-auto justify-center w-40">
            Loading revenue data...
          </p>
        ) : (
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b-2 border-gray-200 text-sm text-left">
                  Cert Type
                </th>
                <th className="py-2 px-4 border-b-2 border-gray-200 text-sm text-left">
                  Resident Name
                </th>
                <th className="py-2 px-4 border-b-2 border-gray-200 text-sm text-left">
                  Amount
                </th>
                <th className="py-2 px-4 border-b-2 border-gray-200 text-sm text-left">
                  Time
                </th>
              </tr>
            </thead>
            <tbody>
              {revenue && revenue.length > 0 ? (
                revenue.map((item) => (
                  <tr key={item.id}>
                    <td className="py-2 px-4 border-b text-xs">{item.certType}</td>
                    <td className="py-2 px-4 border-b text-xs">
                      {item.name || "N/A"}
                    </td>
                    <td className="py-2 px-4 border-b text-xs">
                      {item.amount || "N/A"}
                    </td>
                    <td className="py-2 px-4 border-b text-xs">
                      {formatDate(item.time, "MMM dd, yyyy")}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-2 px-4 text-center border-b">
                    No revenue data found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </NavLayout>
  );
};

export default Revenue;
