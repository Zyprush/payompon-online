import { create } from "zustand";
import { db } from "@/firebase";
import {
  addDoc,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
} from "firebase/firestore";

interface RevenueStore {
  revenue: Array<any> | null;
  loadingRevenue: boolean;
  fetchRevenue: () => Promise<void>;
  addRevenue: (data: object) => Promise<void>;
}

export const useRevenueStore = create<RevenueStore>((set) => ({
  revenue: null,
  loadingRevenue: false,

  addRevenue: async (data: object) => {
    set({ loadingRevenue: true });
    try {
      const submittedDoc = await addDoc(collection(db, "revenue"), data);
      console.log("Upload successful");
      set((state) => ({
        revenue: state.revenue
          ? [...state.revenue, submittedDoc]
          : [submittedDoc],
        loadingRevenue: false,
      }));
    } catch (error) {
      console.log("error", error);
    }
    set({ loadingRevenue: false });
  },
  
 
  fetchRevenue: async () => {
    set({ loadingRevenue: true });
    try {
      const revQue = query(
        collection(db, "revenue"),
        orderBy("time", "desc"),
        limit(50)
      );
      const revenueDocSnap = await getDocs(revQue);

      set({
        revenue: revenueDocSnap as any,
        loadingRevenue: false,
      });
    } catch (error: any) {
      console.log("error", error);
    }
    set({ loadingRevenue: false });
  },
}));
