"use client";

import { create } from "zustand";

export type FinanceView = "income" | "expense" | "fixed-expense";

type FinanceUiState = {
  activeFinanceView: FinanceView;
  setActiveFinanceView: (view: FinanceView) => void;
};

export const useFinanceUiStore = create<FinanceUiState>((set) => ({
  activeFinanceView: "income",
  setActiveFinanceView: (activeFinanceView) => set({ activeFinanceView }),
}));
