import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/firebase";

const DashNotVerified = () => {
  const [unverifiedCount, setUnverifiedCount] = useState(0);

  useEffect(() => {
    const fetchUnverifiedUsersCount = async () => {
      const usersRef = collection(db, "users");
      const unverifiedUsersQuery = query(usersRef, where("verified", "==", false));
      const querySnapshot = await getDocs(unverifiedUsersQuery);
      setUnverifiedCount(querySnapshot.size);
    };

    fetchUnverifiedUsersCount();
  }, []);

  return (
    <div className="stats shadow">
      <div className="stat">
        <div className="stat-title font-semibold">Verification</div>
        <div className="stat-value text-primary">{unverifiedCount}</div>
        <div className="stat-desc">Pending account verification</div>
      </div>
    </div>
  );
};

export default DashNotVerified;