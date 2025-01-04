"use client";
import React, { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";

interface NavbarProps {
  children: ReactNode;
}

const AdminRouteGuard: React.FC<NavbarProps> = ({ children }) => {
  const [user, loading] = useAuthState(getAuth());
  const [userRole, setUserRole] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async (uid: string) => {
      try {
        const userDocRef = doc(db, "users", uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserRole(userData?.role || null);
        } else {
          console.error("No such user!");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (user) {
      fetchUserData(user.uid);
    } else if (!loading) {
      // Redirect if no user is logged in
      router.push("/");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!loading && userRole && !["admin", "staff", "secretary", "treasurer"].includes(userRole)) {
      console.log(`Redirecting: User role is "${userRole}"`);
      router.push("/");
    }
  }, [userRole, loading, router]);

  if (loading || userRole === null) {
    // Optionally, render a loading spinner or placeholder
    return (
      <div className="fixed top-0 left-0 w-full h-full bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AdminRouteGuard;
