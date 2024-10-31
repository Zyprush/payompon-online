import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const useUserData = () => {
  const [userUid, setUserUid] = useState<string>("");
  const [firstname, setFirstname] = useState<string | null>(null);
  const [middlename, setMiddlename] = useState<string | null>(null);
  const [lastname, setLastname] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [verified, setVerified] = useState<boolean>(false);
  const [infoErrors, setInfoErrors] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserUid(user.uid);
        fetchUserData(user.uid);
      } else {
        setUserUid("");
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchUserData = async (uid: string) => {
    try {
      const userDocRef = doc(db, "users", uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        setFirstname(userData?.firstname || null);
        setMiddlename(userData?.middlename || null);
        setLastname(userData?.lastname || null);
        setUserEmail(userData?.email || null);
        setUserRole(userData?.role || null);
        setVerified(userData?.verified);
        setInfoErrors(userData?.infoErrors);
        setSubmitted(userData?.submitted);
      } else {
        console.error("No such user!");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  return {
    userUid,
    firstname,
    middlename,
    lastname,
    userEmail,
    userRole,
    verified,
    infoErrors,
    submitted,
  };
};

export default useUserData;
