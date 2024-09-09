import useUserData from "@/hooks/useUserData";
import { IconMessageFilled } from "@tabler/icons-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/firebase"; // Assuming your Firestore instance is exported from here

const MessageIndicator = () => {
  const { userUid, userRole } = useUserData();
  const [notReadMessage, setNotReadMessage] = useState(0); // Track the number of unread messages

  useEffect(() => {
    const fetchUnreadMessages = async () => {
      try {
        let q;
        if (userRole === "resident") {
          q = query(
            collection(db, "receiveMess"),
            where("receiverId", "==", userUid),
            where("read", "==", false)
          );
        } else if (userRole === "admin") {
          q = query(
            collection(db, "receiveMess"),
            where("receiverId", "==", "admin"),
            where("read", "==", false)
          );
        } else {
          q = query(
            collection(db, "receiveMess"),
            where("receiverId", "==", "staff"),
            where("read", "==", false)
          );
        }

        if (q) {
          const querySnapshot = await getDocs(q);
          console.log("querySnapshot", querySnapshot.docs);
          // Set the number of unread messages
          setNotReadMessage(querySnapshot.docs.length);
        }
      } catch (error) {
        console.error("Error fetching unread messages:", error);
      }
    };

    if (userUid && userRole) {
      fetchUnreadMessages();
    }
  }, [userUid, userRole]); // Re-fetch if userUid or userRole changes

  // Link based on user role
  const link = userRole === "resident" ? "/user/message" : "/admin/message";

  return notReadMessage > 0 ? (
    <Link className="indicator ml-auto mr-0" href={link}>
      <span className="indicator-item badge-xs badge badge-error"></span>
      <div className="grid bg-zinc-200 h-8 w-8 place-items-center rounded-lg">
        <IconMessageFilled className="text-primary" />
      </div>
    </Link>
  ) : null;
};

export default MessageIndicator;
