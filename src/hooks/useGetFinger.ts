import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";

interface UseGetFingerProps {
  uid: string;
}

const useGetFinger = ({ uid }: UseGetFingerProps) => {
  const [leftThumb, setLeftThumb] = useState<string | null>(null);
  const [rightThumb, setRightThumb] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDocRef = doc(db, "users", uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setLeftThumb(userData?.leftThumb || "");
          setRightThumb(userData?.rightThumb || "");
        } else {
          console.error("No such user!");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (uid) {
      fetchUserData();
    }
  }, [uid]);

  return {
    leftThumb,
    rightThumb
  };
};

export default useGetFinger;
