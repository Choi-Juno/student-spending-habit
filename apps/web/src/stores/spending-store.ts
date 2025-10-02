import { create } from "zustand";

export interface SpendingData {
  id: string;
  category: string;
  amount: number;
  date: string;
  description?: string;
}

interface SpendingStore {
  data: SpendingData[];
  selectedPeriod: "week" | "month" | "year";
  setData: (data: SpendingData[]) => void;
  setSelectedPeriod: (period: "week" | "month" | "year") => void;
}

export const useSpendingStore = create<SpendingStore>((set) => ({
  data: [],
  selectedPeriod: "month",
  setData: (data) => set({ data }),
  setSelectedPeriod: (period) => set({ selectedPeriod: period }),
}));

