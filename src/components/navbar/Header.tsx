import React, { useState, useEffect } from "react";
import { auth, db } from "@/firebase"; // Import your firebase config
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import Account from "./Account";
import GetImage from "../GetImage";
import MessageIndicator from "./MessageIndicator";

const Header = () => {
  // const handleSignOut = async () => {
  //   await auth.signOut();
  // };
  const [userData, setUserData] = useState<any>(null);
  const [showNotif, setShowNotif] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log("user", user);
      if (user) {
        try {
          // Fetch the document directly using the user.uid as the document ID
          const docRef = doc(db, "users", user.uid);
          const docSnapshot = await getDoc(docRef);

          if (docSnapshot.exists()) {
            setUserData(docSnapshot.data());
          } else {
            console.log("No matching user data found!");
          }
        } catch (error) {
          console.error("Error fetching user data: ", error);
        }
      } else {
        setUserData(null);
      }
    });

    return () => unsubscribe();
  }, []);
  console.log("userData", userData);
  return (
    <span className="w-full h-14 bg-gray-100 justify-between px-5 items-center border-b border-gray-300 hidden md:flex">
      <div className="flex items-center gap-4 ml-auto">
        <MessageIndicator />
        {/* <button
          className="flex gap-2 w-full border-b-2 p-3 font-semibold text-red-700 hover:bg-primary hover:text-white"
          onClick={handleSignOut}
        >
          <h1>Sign Out</h1>
        </button> */}
        <details className="dropdown dropdown-end">
          <summary
            tabIndex={0}
            role="button"
            className="h-10 w-10 flex items-center justify-center overflow-hidden custom-shadow border-zinc-700 border bg-white rounded-full"
          >
            <div className="width-[40px]">
              <GetImage storageLink="settings/brgyLogo" />
            </div>
          </summary>
          <Account userData={userData} />
        </details>
      </div>
    </span>
  );
};

export default Header;
