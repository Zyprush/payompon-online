"use client";
import Header from "@/app/document/certification/[id]/Header";
import NavLayout from "@/components/NavLayout";
import { useRevenueStore } from "@/state/revenue";
import { format, parseISO } from "date-fns";
import React, { useEffect, useRef, useState } from "react";
import ReactToPrint from "react-to-print";

const Revenue: React.FC = (): JSX.Element => {
  const { revenue, fetchRevenue, loadingRevenue } = useRevenueStore();
  const currentYear = new Date().getFullYear().toString();

  // State for filtering
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>(currentYear);

  // Ref to the printable content
  const printRef = useRef<HTMLDivElement>(null);

  // Fetch the revenue data when the component mounts
  useEffect(() => {
    fetchRevenue();
  }, [fetchRevenue]);

  // Function to filter revenue by selected month and year
  const filteredRevenue = revenue?.filter((item) => {
    const itemDate = parseISO(item.time);
    const itemMonth = format(itemDate, "MM");
    const itemYear = format(itemDate, "yyyy");

    const isMonthMatch = selectedMonth ? itemMonth === selectedMonth : true;
    const isYearMatch = itemYear === selectedYear;

    return isMonthMatch && isYearMatch;
  });

  // Calculate total revenue for filtered data
  const totalRevenue = filteredRevenue?.reduce((sum, item) => {
    const amount = parseFloat(item.amount);
    return !isNaN(amount) ? sum + amount : sum;
  }, 0);

  return (
    <NavLayout>
      <div className="flex gap-5 p-5 flex-col" ref={printRef}>
        <div className="print-header hidden"><Header/></div>
        <h1 className="text-xl text-primary flex gap-2 items-center font-bold print:hidden">
          <span className="ml-2">Revenue</span>
          <div className="flex gap-4">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="p-2 border rounded text-sm"
            >
              <option value="">All Months</option>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={String(i + 1).padStart(2, "0")}>
                  {format(new Date(0, i), "MMMM")}
                </option>
              ))}
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="p-2 border rounded text-sm"
            >
              {Array.from({ length: 10 }, (_, i) => {
                const year = new Date().getFullYear() - i;
                return (
                  <option key={year} value={String(year)}>
                    {year}
                  </option>
                );
              })}
            </select>
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
            Total Revenue for {selectedMonth ? format(new Date(2024, parseInt(selectedMonth) - 1), "MMMM") : "Year"} {selectedYear}
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
  );
};

export default Revenue;
