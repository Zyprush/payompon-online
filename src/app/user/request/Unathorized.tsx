"use client";
import React, { useState, useEffect } from "react";
import UserNavLayout from "@/components/UserNavLayout";
import Image from "next/image";

const Unathorized: React.FC = (): JSX.Element => {
  return (
    <UserNavLayout>
      <div className="flex flex-col h-full w-full justify-center items-center gap-5">
        <Image src={"/img/sync-file.svg"} height={200} width={150}  alt="unauhtorized" />
        <span className="border p-4 text-zinc-600 font-semibold rounded-md text-xs border-zinc-300">
        Please verify your account to access this feature
        </span>
        </div>
    </UserNavLayout>
  );
};

export default Unathorized;
