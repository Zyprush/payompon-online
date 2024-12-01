"use client";
import React, { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import { useLogs } from "@/hooks/useLogs";
import NavLayout from "@/components/NavLayout";
import { format } from "date-fns";

const ActivityLog = () => {
  const { logs, loadingLogs, deleteLog, fetchLogsByAdmin } = useLogs();
  const [currentPage, setCurrentPage] = useState(0);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [filteredLogs, setFilteredLogs] = useState(logs);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  // Pagination settings
  const logsPerPage = 10;
  const pageCount = filteredLogs
    ? Math.ceil(filteredLogs.length / logsPerPage)
    : 0;
  const offset = currentPage * logsPerPage;

  useEffect(() => {
    fetchLogsByAdmin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setFilteredLogs(logs);
  }, [logs]);

  const handleDateFilter = () => {
    if (!logs) return;

    if (!startDate && !endDate) {
      setFilteredLogs(logs);
      return;
    }

    const filtered = logs.filter((log) => {
      const logDate = new Date(log.date);
      const start = startDate ? new Date(startDate) : new Date(0);
      const end = endDate ? new Date(endDate) : new Date();

      // Set the time to the start and end of the day
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);

      return logDate >= start && logDate <= end;
    });

    setFilteredLogs(filtered);
    setCurrentPage(0); // Reset to first page when filtering
  };

  const handleReset = () => {
    setStartDate("");
    setEndDate("");
    setFilteredLogs(logs);
    setCurrentPage(0);
  };

  const handlePageClick = ({ selected }: { selected: number }) => {
    setCurrentPage(selected);
  };

  const handleDelete = async (logId: string) => {
    if (window.confirm("Are you sure you want to delete this log?")) {
      setDeleteLoading(logId);
      try {
        const success = await deleteLog(logId);
        if (success) {
          setFilteredLogs((prevLogs) =>
            prevLogs ? prevLogs.filter((log) => log.id !== logId) : null
          );
        }
      } catch (error) {
        console.error("Error deleting log:", error);
      } finally {
        setDeleteLoading(null);
      }
    }
  };

  return (
    <NavLayout>
      <div className="mb-6">
        <div className="mt-2 flex flex-col items-start justify-start p-8 border-t border-gray-200 bg-opacity-35 bg-zinc-200">
          {/* Date Filter Controls */}
          <div className="w-full mb-4 flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <label htmlFor="startDate" className="text-sm">
                From:
              </label>
              <input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border rounded-md p-1 text-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="endDate" className="text-sm">
                To:
              </label>
              <input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border rounded-md p-1 text-sm"
              />
            </div>
            <button
              onClick={handleDateFilter}
              className="btn btn-sm btn-primary text-white rounded-none"
            >
              Filter
            </button>
            <button
              onClick={handleReset}
              className="btn btn-sm btn-outline text-secondary rounded-none"
            >
              Reset
            </button>
          </div>

          {loadingLogs ? (
            <p className="text-gray-500 text-xs border-2 p-2 mr-auto border-gray-400">
              Loading...
            </p>
          ) : filteredLogs && filteredLogs.length > 0 ? (
            <>
              <div className="w-full overflow-x-auto">
                <table className="w-full min-w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Process By
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredLogs
                      .slice(offset, offset + logsPerPage)
                      .map((log) => (
                        <tr key={log.id} className="hover:bg-gray-50">
                          <td className="px-4 py-2 text-sm text-gray-800 whitespace-nowrap">
                            {log.name}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-800 whitespace-nowrap capitalize">
                            {log.role}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-800 whitespace-nowrap capitalize">
                            {log.actionBy}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-800 whitespace-nowrap">
                            {format(
                              new Date(log.date),
                              "MMM dd, yyyy : hh:mm a"
                            )}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-800 whitespace-nowrap">
                            <button
                              onClick={() => handleDelete(log.id)}
                              disabled={deleteLoading === log.id}
                              className={`btn btn-sm btn-error text-white rounded-none ${
                                deleteLoading === log.id
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }`}
                            >
                              {deleteLoading === log.id ? (
                                <span className="loading loading-spinner loading-xs"></span>
                              ) : (
                                "Delete"
                              )}
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 w-full flex justify-center">
                <ReactPaginate
                  previousLabel={"Previous"}
                  nextLabel={"Next"}
                  pageCount={pageCount}
                  onPageChange={handlePageClick}
                  previousLinkClassName={"prev-link"}
                  nextLinkClassName={"next-link"}
                  disabledClassName={"disabled"}
                  marginPagesDisplayed={2}
                  pageRangeDisplayed={3}
                  pageLinkClassName={"page-link"}
                  breakLabel="..."
                  containerClassName={"pagination mt-5"}
                  activeClassName={"active"}
                  pageClassName="inline-block px-3 py-2 border rounded-md hover:bg-gray-200 text-sm"
                  previousClassName="inline-block px-4 py-2 border rounded-md hover:bg-gray-200 mr-1 text-sm"
                  nextClassName="inline-block px-4 py-2 border rounded-md hover:bg-gray-200 ml-1 text-sm"
                  activeLinkClassName="text-black font-bold text-sm"
                />
              </div>
            </>
          ) : (
            <p className="text-gray-500 text-xs border-2 p-2 mr-auto border-gray-400">
              No logs available
            </p>
          )}
        </div>
      </div>
    </NavLayout>
  );
};

export default ActivityLog;
