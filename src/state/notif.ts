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
      const notifQuery = query(
        collection(db, "notif"),
        orderBy("time", "desc")
      );

      const notifDocSnap = await getDocs(notifQuery);
      if (notifDocSnap) {
        set({
          notif: notifDocSnap.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })),
          loadingNotif: false,
        });
      } else {
        set({ loadingNotif: false });
      }
    } catch (error: any) {
      console.log("error", error);
    }
    set({ loadingNotif: false });
  },

  fetchNotifByUser: async (userId) => {
    set({ loadingNotif: true });
    try {
      const notifByUserQuery = query(
        collection(db, "notif"),
        where("userId", "==", userId),
        orderBy("time", "desc")
      );
      const notifDocSnap = await getDocs(notifByUserQuery);
      if (notifDocSnap) {
        set({
          notif: notifDocSnap.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })),
          loadingNotif: false,
        });
      } else {
        set({ loadingNotif: false });
      }
    } catch (error: any) {
      console.log("error", error);
    }
    set({ loadingNotif: false });
  },

  fetchNotifByAdmin: async () => {
    set({ loadingNotif: true });
    try {
      const notifByUserQuery = query(
        collection(db, "notif"),
        where("type", "in", ["admin"]),
        orderBy("time", "desc")
      );
      const notifDocSnap = await getDocs(notifByUserQuery);
      if (notifDocSnap) {
        set({
          notif: notifDocSnap.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })),
          loadingNotif: false,
        });
      } else {
        set({ loadingNotif: false });
      }
    } catch (error: any) {
      console.log("error", error);
    }
    set({ loadingNotif: false });
  },
}));