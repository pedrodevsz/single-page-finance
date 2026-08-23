export type DashboardSummary = {
  incomeInCents: number;
  expenseInCents: number;
  balanceInCents: number;
  fixedExpensesInCents: number;
  paidFixedExpenses: number;
  pendingFixedExpenses: number;
};

export type FinancialEvolutionItem = {
  month: string;
  incomeInCents: number;
  expenseInCents: number;
};

export type ExpenseByCategory = {
  category: string;
  amountInCents: number;
};
