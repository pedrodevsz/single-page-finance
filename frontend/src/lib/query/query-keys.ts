import type { TransactionType } from "@/types/transaction";

export const transactionKeys = {
  all: ["transactions"] as const,
  list: (transactionType: TransactionType) =>
    [...transactionKeys.all, "list", transactionType] as const,
};

export const fixedExpenseKeys = {
  all: ["fixed-expenses"] as const,
};

export const dashboardKeys = {
  all: ["dashboard"] as const,
  summary: ["dashboard", "summary"] as const,
  evolution: (months: number) => ["dashboard", "evolution", { months }] as const,
  expensesByCategory: ["dashboard", "expenses-by-category"] as const,
};
