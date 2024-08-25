"use client";
import NavLayout from "@/components/NavLayout";
import React, { useState } from "react";
import UnverifiedResident from "./UnverifiedResident";
import VerifiedResident from "./VerifiedResident";

const Resident: React.FC = (): JSX.Element => {
  const [filter, setFilter] = useState<"unverified" | "verified">("unverified");

  return (
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
        </div>

        {/* Render the selected component */}
        {filter === "unverified" ? <UnverifiedResident /> : <VerifiedResident />}
      </div>
    </NavLayout>
  );
};

export default Resident;
