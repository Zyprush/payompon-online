"use client";
import useUserData from "@/hooks/useUserData";
import Link from "next/link";
import React from "react";

const InfoErrors = () => {
  const { infoErrors, submitted} = useUserData();
  if (!infoErrors || submitted == true) return null;
  return (
    <div className="flex flex-col bg-white rounded-lg p-5 border text-sm text-zinc-600 font-[300]">
      <div className="flex justify-center items-center gap-2">
        There is something wrong with the data you submitted.
      </div>
      <div className="">{infoErrors}</div>
      <Link
        href="/user/dashboard/resubmit"
        className="btn btn-sm btn-primary rounded-none mt-5"
      >
        Resubmit
      </Link>
    </div>
  );
};

export default InfoErrors;
