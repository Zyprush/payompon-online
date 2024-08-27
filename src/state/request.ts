import { create } from "zustand";

interface RequestStore {
  id: string;
  setId: (data: string) => {};
}

export const useRequestStore = create<RequestStore>((set) => ({
  id: "",

  setId: (data: string) => {
    set({ id: data }); // Spread the request object from data
    return {}; // Return an empty object to match the type
  },
}));
