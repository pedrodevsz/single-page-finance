import type { Transaction } from "@/types/transaction";

export type ExpensesByCategoryPoint = {
  category: string;
  amountInCents: number;
};

export function buildExpensesByCategoryData(transactions: Transaction[]): ExpensesByCategoryPoint[] {
  const expensesByCategory = new Map<string, number>();

  for (const transaction of transactions) {
    if (transaction.type !== "EXPENSE") {
      continue;
    }

    const currentAmount = expensesByCategory.get(transaction.category) ?? 0;
    expensesByCategory.set(transaction.category, currentAmount + transaction.amountInCents);
  }

  return Array.from(expensesByCategory.entries())
    .map(([category, amountInCents]) => ({ category, amountInCents }))
    .sort((left, right) => right.amountInCents - left.amountInCents || left.category.localeCompare(right.category, "pt-BR"));
}
