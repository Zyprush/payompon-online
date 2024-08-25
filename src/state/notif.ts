import { create } from "zustand";
import { db } from "@/firebase";
import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";

interface NotifStore {
  notif: Array<any> | null;
  loadingNotif: boolean;
  fetchNotif: () => Promise<void>;
  fetchNotifByUser: (userId: string) => Promise<void>;
  fetchNotifByAdmin: () => Promise<void>;
  addNotif: (data: object) => Promise<void>;
}

export const useNotifStore = create<NotifStore>((set) => ({
  notif: null,
  loadingNotif: false,

  addNotif: async (data: object) => {
    set({ loadingNotif: true });
    try {
      const submittedDoc = await addDoc(collection(db, "notif"), data);
      console.log("Upload successful");
      set((state) => ({
        notif: state.notif
          ? [...state.notif, submittedDoc]
          : [submittedDoc],
        loadingNotif: false,
      }));
    } catch (error) {
      console.log("error", error);
    }
    set({ loadingNotif: false });
  },
  
  fetchNotif: async () => {
    set({ loadingNotif: true });
    try {
      // Fetch unread notifications first
      const unreadNotifQuery = query(
        collection(db, "notif"),
        where("read", "==", false),
        orderBy("time", "desc")
      );

      const unreadNotifDocSnap = await getDocs(unreadNotifQuery);

      // Fetch read notifications
      const readNotifQuery = query(
        collection(db, "notif"),
        where("read", "==", true),
        orderBy("time", "desc")
      );

      const readNotifDocSnap = await getDocs(readNotifQuery);

      // Combine unread and read notifications
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

      set({
        notif: allNotifications,
        loadingNotif: false,
      });
    } catch (error: any) {
      console.log("error", error);
    }
    set({ loadingNotif: false });
  },

  fetchNotifByUser: async (userId) => {
    set({ loadingNotif: true });
    try {
      // Fetch unread notifications for the user first
      const unreadNotifByUserQuery = query(
        collection(db, "notif"),
        where("userId", "==", userId),
        where("read", "==", false),
        orderBy("time", "desc")
      );
      const unreadNotifDocSnap = await getDocs(unreadNotifByUserQuery);

      // Fetch read notifications for the user
      const readNotifByUserQuery = query(
        collection(db, "notif"),
        where("userId", "==", userId),
        where("read", "==", true),
        orderBy("time", "desc")
      );
      const readNotifDocSnap = await getDocs(readNotifByUserQuery);

      // Combine unread and read notifications
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

      set({
        notif: allNotifications,
        loadingNotif: false,
      });
    } catch (error: any) {
      console.log("error", error);
    }
    set({ loadingNotif: false });
  },

  fetchNotifByAdmin: async () => {
    set({ loadingNotif: true });
    try {
      // Fetch unread notifications for the admin first
      const unreadNotifByAdminQuery = query(
        collection(db, "notif"),
        where("type", "in", ["admin"]),
        where("read", "==", false),
        orderBy("time", "desc")
      );
      const unreadNotifDocSnap = await getDocs(unreadNotifByAdminQuery);

      // Fetch read notifications for the admin
      const readNotifByAdminQuery = query(
        collection(db, "notif"),
        where("type", "in", ["admin"]),
        where("read", "==", true),
        orderBy("time", "desc")
      );
      const readNotifDocSnap = await getDocs(readNotifByAdminQuery);

      // Combine unread and read notifications
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

      set({
        notif: allNotifications,
        loadingNotif: false,
      });
    } catch (error: any) {
      console.log("error", error);
    }
    set({ loadingNotif: false });
  },
}));
