"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { IoCaretBackCircle } from "react-icons/io5";
import { auth } from "@/firebase";
import { toTitleCase } from "@/helper/string";
import useUserData from "@/hooks/useUserData"; // Import the custom hook

const Account: React.FC = () => {
  const router = useRouter();
  const { firstname, lastname, userRole } = useUserData(); // Destructure the data from the hook

  const handleSignOut = async () => {
    await auth.signOut();
    router.push("/sign-in");
  };

  return (
    <React.Fragment>
      <ul
        tabIndex={0}
        className="flex flex-col mt-2 dropdown-content menu bg-base-100 border border-zinc-300 z-50 h-auto shadow w-[13rem] p-0 absolute"
      >
        <span className="w-full h-auto border-b-2 gap-3 p-3 flex justify-start items-center">
          <span className="w-auto">
            <h1 className="font-bold text-primary">
              Hello, {userRole === "admin" ? "Admin" : `${firstname} ${lastname}`}!
            </h1>
            <h1 className="text-xs text-zinc-500">
              {userRole !== "admin" && toTitleCase(userRole || "")}
            </h1>
          </span>
        </span>

        <button
          className="flex gap-2 w-full border-b-2 p-3 font-semibold text-red-700 hover:bg-primary hover:text-white"
          onClick={handleSignOut}
        >
          <IoCaretBackCircle className="text-lg" /> <h1>Sign Out</h1>
        </button>
      </ul>
    </React.Fragment>
  );
};

export default Account;
