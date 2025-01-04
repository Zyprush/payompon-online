"use client";
import NavLayout from "@/components/NavLayout";
import React, { useState } from "react";
import PendingCertificate from "./PendingCertificate";
import ApprovedCertificate from "./ApprovedCertificate";
import DeclinedCertificate from "./DeclinedCertificate";
import AdminRouteGuard from "@/components/AdminRouteGuard";

const Certificate: React.FC = (): JSX.Element => {
  const [filter, setFilter] = useState<string>("pending");

  return (
    <AdminRouteGuard>
      <NavLayout>
        <div className="md:px-4 flex flex-col">
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setFilter("pending")}
              className={`py-2 px-4 w-40 ${
                filter === "pending"
                  ? "btn btn-primary text-white rounded-none"
                  : "btn btn-outline text-neutral rounded-none"
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilter("completed")}
              className={`w-40 py-2 px-4 ${
                filter === "completed"
                  ? "btn btn-primary text-white rounded-none"
                  : "btn btn-outline text-neutral rounded-none"
              }`}
            >
              Completed
            </button>
            <button
              onClick={() => setFilter("declined")}
              className={`w-40 py-2 px-4 ${
                filter === "declined"
                  ? "btn btn-primary text-white rounded-none"
                  : "btn btn-outline text-neutral rounded-none"
              }`}
            >
              Declined
            </button>
          </div>
          <hr className="w-full mb-5" />

          {/* Render the selected component */}
          {filter === "pending" && <PendingCertificate />}
          {filter === "completed" && <ApprovedCertificate />}
          {filter === "declined" && <DeclinedCertificate />}
        </div>
      </NavLayout>
    </AdminRouteGuard>
  );
};

export default Certificate;
