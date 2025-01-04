"use client";
import NavLayout from "@/components/NavLayout";
import React, { useState } from "react";
import UnverifiedResident from "./UnverifiedResident";
import VerifiedResident from "./VerifiedResident";
import ArchivedResident from "./ArchivedResident";
import Link from "next/link";
import AdminRouteGuard from "@/components/AdminRouteGuard";

const Resident: React.FC = (): JSX.Element => {
  const [filter, setFilter] = useState<"unverified" | "verified" | "archived">(
    "unverified"
  );

  return (
    <AdminRouteGuard>
      <NavLayout>
        <div className="md:px-4 flex flex-col">
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setFilter("unverified")}
              className={`py-2 px-4 w-40 ${
                filter === "unverified"
                  ? "btn btn-primary text-white rounded-none"
                  : "btn btn-outline text-neutral rounded-none"
              }`}
            >
              Unverified
            </button>
            <button
              onClick={() => setFilter("verified")}
              className={`w-40 py-2 px-4 ${
                filter === "verified"
                  ? "btn btn-primary text-white rounded-none"
                  : "btn btn-outline text-neutral rounded-none"
              }`}
            >
              Verified
            </button>
            <button
              onClick={() => setFilter("archived")}
              className={`w-40 py-2 px-4 ${
                filter === "archived"
                  ? "btn btn-primary text-white rounded-none"
                  : "btn btn-outline text-neutral rounded-none"
              }`}
            >
              Archived
            </button>
            <Link
              href={"/admin/resident/add-resident"}
              className={`w-40 py-2 px-4 btn btn-outline text-neutral rounded-none`}
            >
              Add Resident
            </Link>
          </div>
          <hr className="w-full mb-5" />

          {/* Render the selected component */}
          {filter === "unverified" ? (
            <UnverifiedResident />
          ) : filter === "verified" ? (
            <VerifiedResident />
          ) : (
            <ArchivedResident />
          )}
        </div>
      </NavLayout>
    </AdminRouteGuard>
  );
};

export default Resident;
