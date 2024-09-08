import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/firebase";

const DashVerified = () => {
  const [verifiedCount, setVerifiedCount] = useState(0);

  useEffect(() => {
    const fetchVerifiedUsersCount = async () => {
      const usersRef = collection(db, "users");
      const verifiedUsersQuery = query(usersRef, where("verified", "==", true));
      const querySnapshot = await getDocs(verifiedUsersQuery);
      setVerifiedCount(querySnapshot.size);
    };

    fetchVerifiedUsersCount();
  }, []);

  return (
    <div className="stats shadow">
      <div className="stat">
        <div className="stat-title font-semibold">Verified Resident</div>
        <div className="stat-value text-primary">{verifiedCount}</div>
        <div className="stat-desc">Verified registered resident</div>
      </div>
    </div>
  );
};

export default DashVerified;