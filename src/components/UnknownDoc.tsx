"use client";
import Link from "next/link";
import React from "react";

const UnknownDoc = () => {
  return (
    <div>
      <div className="flex flex-col items-center justify-center min-h-screen text-center ">
        <h1 className="text-6xl font-bold text-neutral">404</h1>
        <h2 className="text-lg font-semibold text-zinc-500">
          Document Not Found
        </h2>
        <p className="mt-4 text-zinc-500 text-sm mx-20 w-80 md:mx-auto">
          The document your looking for does not exist or has been deleted.
        </p>
        <div className="flex  gap-3 flex-col mt-10">
          <Link
            href="/"
            className="px-4 py-2 bg-primary text-xs text-white rounded hover:bg-neutral"
          >
            Homepage
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UnknownDoc;
