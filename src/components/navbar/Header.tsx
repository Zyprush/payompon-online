import React, { useState, useEffect } from 'react';
import { auth, db } from "@/firebase"; // Import your firebase config
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from 'firebase/auth';
import Account from './Account';

const Header = () => {
    const [userData, setUserData] = useState<any>(null);
    const [showNotif, setShowNotif] = useState<boolean>(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
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

    return (
        <span className="w-full h-14 bg-gray-100 justify-between px-5 items-center border-b border-gray-300 hidden md:flex">
            <div className="flex items-center gap-4 ml-auto">
                <details className="dropdown dropdown-end">
                    <summary
                        tabIndex={0}
                        role="button"
                        className="h-10 w-10 flex items-center justify-center overflow-hidden custom-shadow border-zinc-700 border bg-white rounded-full"
                    >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={userData?.profilePicUrl || "/img/brgy-logo.png"}
                            alt="profile"
                            width={40}
                            height={40}
                            className="h-full w-full object-cover"
                        />
                    </summary>
                    <Account userData={userData} />
                </details>
            </div>
        </span>
    );
}

export default Header;
