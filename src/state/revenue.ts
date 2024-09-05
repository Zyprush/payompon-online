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
import { currentTime } from "@/helper/time";

interface RevenueStore {
  revenue: Array<any> | null;
  loadingRevenue: boolean;
  fetchRevenue: () => Promise<void>;
  addRevenue: (data: object) => Promise<void>;
}

export const useRevenueStore = create<RevenueStore>((set) => ({
  revenue: null,
  loadingRevenue: false,

  // Function to add revenue
  addRevenue: async (data: object) => {
    set({ loadingRevenue: true });
    try {
      const timestampedData = { ...data, time: currentTime }; // Add timestamp to the data
      const submittedDoc = await addDoc(collection(db, "revenue"), timestampedData);
      
      console.log("Upload successful");

      // Update state with the new revenue data (including the document ID)
      set((state) => ({
        revenue: state.revenue
          ? [...state.revenue, { id: submittedDoc.id, ...timestampedData }]
          : [{ id: submittedDoc.id, ...timestampedData }],
        loadingRevenue: false,
      }));
    } catch (error) {
      console.error("Error adding revenue", error);
    } finally {
      set({ loadingRevenue: false });
    }
  },

  // Function to fetch revenue
  fetchRevenue: async () => {
    set({ loadingRevenue: true });
    try {
      const revQuery = query(
        collection(db, "revenue"),
        orderBy("time", "desc"),
        limit(50)
      );
      const revenueDocSnap = await getDocs(revQuery);

      // Extract revenue data from Firestore snapshots
      const revenueData = revenueDocSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      set({
        revenue: revenueData,
        loadingRevenue: false,
      });
    } catch (error: any) {
      console.error("Error fetching revenue", error);
      set({ loadingRevenue: false });
    }
  },
}));
