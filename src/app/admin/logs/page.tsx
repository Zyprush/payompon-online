"use client";
import React, { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import { useLogs } from "@/hooks/useLogs"; // Adjust the path based on your structure
import NavLayout from "@/components/NavLayout";
import { format } from "date-fns";

const ActivityLog = () => {
  const { logs, loadingLogs, fetchLogsByAdmin } = useLogs();
  const [currentPage, setCurrentPage] = useState(0);

  // Pagination settings
  const logsPerPage = 10;
  const pageCount = logs ? Math.ceil(logs.length / logsPerPage) : 0;
  const offset = currentPage * logsPerPage;

  useEffect(() => {
    fetchLogsByAdmin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Function to handle page click
  const handlePageClick = ({ selected }: { selected: number }) => {
    setCurrentPage(selected);
  };

  return (
    <NavLayout>
      <div className="mb-6">
        <div className="mt-2 flex flex-col items-start justify-start p-8 border-t border-gray-200 bg-opacity-35 bg-zinc-200">
          {loadingLogs ? (
            <p className="text-gray-500 text-xs border-2 p-2 mr-auto border-gray-400">
              Loading...
            </p>
          ) : logs && logs.length > 0 ? (
            <>
              <ul className="space-y-2">
                {logs.slice(offset, offset + logsPerPage).map((log) => (
                  <li
                    key={log.id}
                    className="bg-gray-100 p-2 rounded-lg"
                  >
                    <p className="text-sm text-primary">
                      <span className="text-sm font-semibold">{log.name}</span> -{" "}
                      <span className="text-gray-500">{format(new Date(log.date), "MMM dd, yyyy : hh:mm a")}</span>
                    </p>
                  </li>
                ))}
              </ul>
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
