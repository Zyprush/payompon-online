import { useState } from 'react';
import { db } from "@/firebase";
import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";

// Custom hook for notifications
export const useNotifications = () => {
  const [notif, setNotif] = useState<Array<any> | null>(null);
  const [loadingNotif, setLoadingNotif] = useState(false);

  // Add notification
  const addNotif = async (data: object) => {
    setLoadingNotif(true);
    try {
      const submittedDoc = await addDoc(collection(db, "notif"), data);
      console.log("Upload successful");
      
      setNotif(prevNotif => 
        prevNotif ? [...prevNotif, { id: submittedDoc.id, ...data }] : [{ id: submittedDoc.id, ...data }]
      );
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoadingNotif(false);
    }
  };

  // Fetch notifications by user
  const fetchNotifByUser = async (userId: string) => {
    console.log('userId', userId);
    setLoadingNotif(true);
    try {
      const unreadNotifByUserQuery = query(
        collection(db, "notif"),
        where("for", "==", userId),
        where("read", "==", false),
        orderBy("time", "desc")
      );
      const unreadNotifDocSnap = await getDocs(unreadNotifByUserQuery);

      const readNotifByUserQuery = query(
        collection(db, "notif"),
        where("for", "==", userId),
        where("read", "==", true),
        orderBy("time", "desc")
      );
      const readNotifDocSnap = await getDocs(readNotifByUserQuery);

      const allNotifications = [
        ...unreadNotifDocSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })),
        ...readNotifDocSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })),
      ];

      setNotif(allNotifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoadingNotif(false);
    }
  };

  // Fetch notifications by admin
  const fetchNotifByAdmin = async () => {
    setLoadingNotif(true);
    try {
      const unreadNotifByAdminQuery = query(
        collection(db, "notif"),
        where("type", "in", ["admin"]),
        where("read", "==", false),
        orderBy("time", "desc")
      );
      const unreadNotifDocSnap = await getDocs(unreadNotifByAdminQuery);

      const readNotifByAdminQuery = query(
        collection(db, "notif"),
        where("type", "in", ["admin"]),
        where("read", "==", true),
        orderBy("time", "desc")
      );
      const readNotifDocSnap = await getDocs(readNotifByAdminQuery);

      const allNotifications = [
        ...unreadNotifDocSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })),
        ...readNotifDocSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })),
      ];

      setNotif(allNotifications);
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoadingNotif(false);
    }
  };

  return {
    notif,
    loadingNotif,
    addNotif,
    fetchNotifByUser,
    fetchNotifByAdmin
  };
};

// Usage in a component

//   const { 
//     notif, 
//     loadingNotif, 
//     addNotif, 
//     fetchNotifByUser, 
//     fetchNotifByAdmin 
//   } = useNotifications();
