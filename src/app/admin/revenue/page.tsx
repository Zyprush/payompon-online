"use client";
import Header from "@/app/document/certification/[id]/Header";
import AdminRouteGuard from "@/components/AdminRouteGuard";
import NavLayout from "@/components/NavLayout";
import { useRevenueStore } from "@/state/revenue";
import { format, parseISO, isWithinInterval } from "date-fns";
import React, { useEffect, useRef, useState } from "react";
import ReactToPrint from "react-to-print";

const Revenue: React.FC = (): JSX.Element => {
  const { revenue, fetchRevenue, loadingRevenue } = useRevenueStore();
  const currentDate = new Date();

  // State for date range filtering
  const [startDate, setStartDate] = useState<string>(
    format(new Date(currentDate.getFullYear(), 0, 1), "yyyy-MM-dd")
  );
  const [endDate, setEndDate] = useState<string>(
    format(currentDate, "yyyy-MM-dd")
  );

  // Ref to the printable content
  const printRef = useRef<HTMLDivElement>(null);

  // Fetch the revenue data when the component mounts
  useEffect(() => {
    fetchRevenue();
  }, [fetchRevenue]);

  // Function to filter revenue by selected date range
  const filteredRevenue = revenue?.filter((item) => {
    const itemDate = parseISO(item.time);
    return isWithinInterval(itemDate, {
      start: parseISO(startDate),
      end: parseISO(endDate),
    });
  });

  // Calculate total revenue for filtered data
  const totalRevenue = filteredRevenue?.reduce((sum, item) => {
    const amount = parseFloat(item.amount);
    return !isNaN(amount) ? sum + amount : sum;
  }, 0);

  return (
    <AdminRouteGuard>
      <NavLayout>
        <div className="flex gap-5 p-5 flex-col" ref={printRef}>
          <div className="print-header hidden">
            <Header />
          </div>
          <h1 className="text-xl text-primary flex gap-2 items-center font-bold print:hidden">
            <span className="ml-2">Revenue</span>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm">From:</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="p-2 border rounded text-sm"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm">To:</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="p-2 border rounded text-sm"
                />
              </div>
              <ReactToPrint
                trigger={() => (
                  <button className="btn-sm btn my-auto btn-primary rounded-sm text-white">
                    Print
                  </button>
                )}
                content={() => printRef.current}
              />
            </div>
          </h1>

          {/* Display Total Revenue */}
          <div className="mb-4 p-4 bg-primary/10 rounded-md text-primary">
            <h2 className="text-sm font-semibold mb-2">
              Total Revenue from {format(parseISO(startDate), "MMM dd, yyyy")}{" "}
              to {format(parseISO(endDate), "MMM dd, yyyy")}
            </h2>
            <p className="text-xl font-bold">
              ₱{totalRevenue?.toLocaleString() || "0"}
            </p>
          </div>

          {/* Content to Print */}
          <div>
            {loadingRevenue ? (
              <p className="text-sm font-semibold flex items-center gap-3 text-zinc-600 border rounded-sm p-2 px-6 m-auto md:ml-0 md:mr-auto justify-center w-40">
                Loading revenue data...
              </p>
            ) : (
              <table className="min-w-full bg-white">
                <thead className="text-primary">
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
                  {filteredRevenue && filteredRevenue.length > 0 ? (
                    filteredRevenue.map((item) => (
                      <tr key={item.id}>
                        <td className="py-2 px-4 border-b text-xs">
                          {item.certType}
                        </td>
                        <td className="py-2 px-4 border-b text-xs">
                          {item.name || "N/A"}
                        </td>
                        <td className="py-2 px-4 border-b text-xs">
                          {item.amount || "N/A"}
                        </td>
                        <td className="py-2 px-4 border-b text-xs">
                          {format(parseISO(item.time), "MMM dd, yyyy")}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={4}
                        className="py-2 px-4 text-sm text-zinc-600 text-center border-b"
                      >
                        No revenue data found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </NavLayout>
    </AdminRouteGuard>
  );
};

export default Revenue;
