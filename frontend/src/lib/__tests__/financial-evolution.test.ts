import { describe, expect, it } from "vitest";

import type { Transaction } from "@/types/transaction";

import { buildFinancialEvolutionSeries } from "../transactions/financial-evolution";

const mockTransactions: Transaction[] = [
  {
    id: "1",
    type: "INCOME",
    description: "Salário",
    amountInCents: 1000,
    category: "Salário",
    transactionDate: "2026-05-10",
    paymentMethod: "BANK_ACCOUNT",
    notes: null,
    createdAt: "2026-05-10T00:00:00Z",
    updatedAt: "2026-05-10T00:00:00Z",
  },
  {
    id: "2",
    type: "EXPENSE",
    description: "Mercado",
    amountInCents: 250,
    category: "Alimentação",
    transactionDate: "2026-05-11",
    paymentMethod: "CASH",
    notes: null,
    createdAt: "2026-05-11T00:00:00Z",
    updatedAt: "2026-05-11T00:00:00Z",
  },
  {
    id: "3",
    type: "EXPENSE",
    description: "Curso",
    amountInCents: 500,
    category: "Educação",
    transactionDate: "2026-07-01",
    paymentMethod: "PIX",
    notes: null,
    createdAt: "2026-07-01T00:00:00Z",
    updatedAt: "2026-07-01T00:00:00Z",
  },
];

describe("buildFinancialEvolutionSeries", () => {
  it("groups transactions by month and fills missing months", () => {
    const series = buildFinancialEvolutionSeries(mockTransactions);

    expect(series).toEqual([
      {
        month: expect.any(String),
        monthKey: "2026-05",
        incomeInCents: 1000,
        expenseInCents: 250,
      },
      {
        month: expect.any(String),
        monthKey: "2026-06",
        incomeInCents: 0,
        expenseInCents: 0,
      },
      {
        month: expect.any(String),
        monthKey: "2026-07",
        incomeInCents: 0,
        expenseInCents: 500,
      },
    ]);
  });
});
