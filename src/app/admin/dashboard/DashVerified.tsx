import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/firebase";
import { MdVerified } from "react-icons/md";

const DashVerified = () => {
  const [verifiedCount, setVerifiedCount] = useState(0);

  useEffect(() => {
    const fetchVerifiedUsersCount = async () => {
      const usersRef = collection(db, "users");
      const verifiedUsersQuery = query(usersRef, where("verified", "==", true),where("role", "==", "resident"));
      const querySnapshot = await getDocs(verifiedUsersQuery);
      setVerifiedCount(querySnapshot.size);
    };

    fetchVerifiedUsersCount();
  }, []);

  return (
    <div className="flex items-center justify-between p-6 w-full bg-white shadow rounded-lg">
      {/* Icon Section */}
      <div className="flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full">
        <MdVerified className="text-orange-600 text-4xl" />
      </div>

      <div className="ml-4 flex-1">
        <h3 className="text-lg font-semibold text-gray-700">Verified Resident</h3>
        <div className="mt-2 text-4xl font-bold text-primary flex items-center">
        {verifiedCount}
        </div>
        <p className="mt-1 text-xs text-gray-500">Verified registered resident</p>
      </div>
    </div>
  );
};

export default DashVerified;