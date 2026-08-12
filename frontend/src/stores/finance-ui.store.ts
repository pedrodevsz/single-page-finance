"use client";

import { create } from "zustand";

import type { TransactionType } from "@/types/transaction";

type FinanceUiState = {
  transactionType: TransactionType;
  setTransactionType: (transactionType: TransactionType) => void;
  transactionListType: TransactionType;
  setTransactionListType: (transactionListType: TransactionType) => void;
};

export const useFinanceUiStore = create<FinanceUiState>((set) => ({
  transactionType: "income",
  setTransactionType: (transactionType) => set({ transactionType }),
  transactionListType: "income",
  setTransactionListType: (transactionListType) => set({ transactionListType }),
}));
