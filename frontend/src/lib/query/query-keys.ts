import type { TransactionType } from "@/types/transaction";

export const transactionKeys = {
  all: ["transactions"] as const,
  list: (transactionType: TransactionType) =>
    [...transactionKeys.all, "list", transactionType] as const,
};

export const fixedExpenseKeys = {
  all: ["fixed-expenses"] as const,
  history: ["fixed-expenses", "history"] as const,
  historyDetails: (id: string) => ["fixed-expenses", "history", id] as const,
};

export const dashboardKeys = {
  all: ["dashboard"] as const,
  summary: ["dashboard", "summary"] as const,
  evolution: (months: number) => ["dashboard", "evolution", { months }] as const,
  expensesByCategory: ["dashboard", "expenses-by-category"] as const,
};

export const financialOptionKeys = {
  all: ["financial-options"] as const,
  list: (type: string) => [...financialOptionKeys.all, type] as const,
};
