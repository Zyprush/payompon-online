import { create } from "zustand";
import { db } from "@/firebase";
import {
  addDoc,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where
} from "firebase/firestore";
import { currentTime } from "@/helper/time";

// Utility function to get the start and end of the current month
const getStartAndEndOfMonth = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
  return { start, end };
};

interface RevenueStore {
  revenue: Array<any> | null;
  loadingRevenue: boolean;
  fetchRevenue: () => Promise<void>;
  fetchRevenueThisMonth: () => Promise<number>; // New function for fetching total revenue
  addRevenue: (data: object) => Promise<void>;
}

export const useRevenueStore = create<RevenueStore>((set) => ({
  revenue: null,
  loadingRevenue: false,

  // Function to add revenue
  addRevenue: async (data: object) => {
    set({ loadingRevenue: true });
    try {
      const timestampedData = { ...data, time: currentTime }; // Add timestamp
      const submittedDoc = await addDoc(collection(db, "revenue"), timestampedData);

      const newRevenueItem = { id: submittedDoc.id, ...timestampedData };

      set((state) => ({
        revenue: state.revenue ? [...state.revenue, newRevenueItem] : [newRevenueItem],
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

  // Function to fetch revenue for this month
  fetchRevenueThisMonth: async () => {
    set({ loadingRevenue: true });
    try {
      const { start, end } = getStartAndEndOfMonth();

      // Convert dates to timestamps for querying
      const startTimestamp = start.getTime();
      const endTimestamp = end.getTime();

      const revQuery = query(
        collection(db, "revenue"),
        where("time", ">=", startTimestamp),
        where("time", "<=", endTimestamp)
      );

      const revenueDocSnap = await getDocs(revQuery);
      let totalRevenue = 0;

      revenueDocSnap.docs.forEach((doc) => {
        const data = doc.data();
        const amount = parseFloat(data.amount);
        if (!isNaN(amount)) {
          totalRevenue += amount;
        }
      });

      set({ loadingRevenue: false });
      return totalRevenue;
    } catch (error: any) {
      console.error("Error fetching revenue for this month", error);
      set({ loadingRevenue: false });
      return 0;
    }
  },
}));
