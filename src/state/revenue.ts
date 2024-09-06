import { create } from "zustand";
import { db } from "@/firebase";
import {
  addDoc,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
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
  fetchRecentRevenue: () => Promise<void>;
  fetchRevenueThisMonth: () => Promise<number>; // New function for fetching total revenue
  addRevenue: (data: object) => Promise<void>;
  fetchRevenueEachMonth: () => Promise<number[]>;
}

export const useRevenueStore = create<RevenueStore>((set) => ({
  revenue: null,
  loadingRevenue: false,

  // Function to add revenue
  addRevenue: async (data: object) => {
    set({ loadingRevenue: true });
    try {
      const timestampedData = { ...data, time: currentTime }; // Add timestamp
      const submittedDoc = await addDoc(
        collection(db, "revenue"),
        timestampedData
      );

      const newRevenueItem = { id: submittedDoc.id, ...timestampedData };

      set((state) => ({
        revenue: state.revenue
          ? [...state.revenue, newRevenueItem]
          : [newRevenueItem],
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
  
      // Convert dates to ISO string format (for querying)
      const startISO = start.toISOString();
      const endISO = end.toISOString();
      console.log("startISO", startISO);
      console.log("endISO", endISO);
  
      // Query Firestore using ISO date strings
      const revQuery = query(
        collection(db, "revenue"),
        where("time", ">=", startISO),
        where("time", "<=", endISO)
      );
  
      const revenueDocSnap = await getDocs(revQuery);
      let totalRevenue = 0;
  
      // Calculate total revenue from fetched documents
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
  
  // Function to fetch revenue
  fetchRecentRevenue: async () => {
    set({ loadingRevenue: true });
    try {
      const revQuery = query(
        collection(db, "revenue"),
        orderBy("time", "desc"),
        limit(10)
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

  fetchRevenueEachMonth: async () => {
    set({ loadingRevenue: true });
    try {
      const now = new Date();
      const year = now.getFullYear();
      const monthlyRevenues: number[] = [];
  
      // Loop through each month of the current year
      for (let month = 0; month < 12; month++) {
        // Get start and end dates for the current month
        const start = new Date(year, month, 1);
        const end = new Date(year, month + 1, 0, 23, 59, 59); // Last day of the month
  
        // Convert to ISO string format for querying
        const startISO = start.toISOString();
        const endISO = end.toISOString();
  
        // Query Firestore for revenues in this month
        const revQuery = query(
          collection(db, "revenue"),
          where("time", ">=", startISO),
          where("time", "<=", endISO)
        );
  
        const revenueDocSnap = await getDocs(revQuery);
        let totalRevenue = 0;
  
        // Calculate total revenue for this month
        revenueDocSnap.docs.forEach((doc) => {
          const data = doc.data();
          const amount = parseFloat(data.amount);
          if (!isNaN(amount)) {
            totalRevenue += amount;
          }
        });
  
        // Push the total revenue for this month to the array
        monthlyRevenues.push(totalRevenue);
      }
  
      set({ loadingRevenue: false });
      return monthlyRevenues; // Returns an array of total revenues for each month
    } catch (error: any) {
      console.error("Error fetching revenue for each month", error);
      set({ loadingRevenue: false });
      return Array(12).fill(0); // Return an array of 0s if there's an error
    }
  },
  
}));
