import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/firebase";
import { MdOutlineVerified } from "react-icons/md";

const DashNotVerified = () => {
  const [unverifiedCount, setUnverifiedCount] = useState(0);

  useEffect(() => {
    const fetchUnverifiedUsersCount = async () => {
      const usersRef = collection(db, "users");
      const unverifiedUsersQuery = query(
        usersRef,
        where("verified", "==", false),
        where("role", "==", "resident"),
        where("submitted", "==", true)
      );
      const querySnapshot = await getDocs(unverifiedUsersQuery);
      setUnverifiedCount(querySnapshot.size);
    };

    fetchUnverifiedUsersCount();
  }, []);

  return (
    <div className="flex items-center w-full justify-between p-6 bg-white shadow rounded-lg">
      {/* Icon Section */}
      <div className="flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full">
        <MdOutlineVerified className="text-yellow-600 text-4xl" />
      </div>

      <div className="ml-4 flex-1">
        <h3 className="text-lg font-semibold text-gray-700">Verification</h3>
        <div className="mt-2 text-4xl font-bold text-primary flex items-center ml-5">
          {unverifiedCount}
        </div>
        <p className="mt-1 text-xs text-gray-500">
          Pending account verification
        </p>
      </div>
    </div>
  );
};

export default DashNotVerified;
