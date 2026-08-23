import type { FixedExpense } from "@/types/fixed-expense";

export type FixedExpensesSummary = {
  paidCount: number;
  pendingCount: number;
  totalInCents: number;
};

export function buildFixedExpensesSummary(fixedExpenses: FixedExpense[]): FixedExpensesSummary {
  return fixedExpenses.reduce<FixedExpensesSummary>(
    (summary, fixedExpense) => {
      summary.totalInCents += fixedExpense.amountInCents;

      if (fixedExpense.paid === true) {
        summary.paidCount += 1;
      } else {
        summary.pendingCount += 1;
      }

      return summary;
    },
    {
      paidCount: 0,
      pendingCount: 0,
      totalInCents: 0,
    }
  );
}
