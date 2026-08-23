import { describe, expect, it } from "vitest";

import type { Transaction } from "@/types/transaction";

import { buildExpensesByCategoryData } from "../transactions/expenses-by-category";

const transactions: Transaction[] = [
  {
    id: "1",
    type: "EXPENSE",
    description: "Mercado",
    amountInCents: 300,
    category: "Alimentação",
    transactionDate: "2026-08-01",
    paymentMethod: "PIX",
    notes: null,
    createdAt: "2026-08-01T00:00:00Z",
    updatedAt: "2026-08-01T00:00:00Z",
  },
  {
    id: "2",
    type: "EXPENSE",
    description: "Aluguel",
    amountInCents: 700,
    category: "Moradia",
    transactionDate: "2026-08-02",
    paymentMethod: "BANK_TRANSFER",
    notes: null,
    createdAt: "2026-08-02T00:00:00Z",
    updatedAt: "2026-08-02T00:00:00Z",
  },
  {
    id: "3",
    type: "EXPENSE",
    description: "Farmácia",
    amountInCents: 200,
    category: "Saúde",
    transactionDate: "2026-08-03",
    paymentMethod: "CASH",
    notes: null,
    createdAt: "2026-08-03T00:00:00Z",
    updatedAt: "2026-08-03T00:00:00Z",
  },
  {
    id: "4",
    type: "INCOME",
    description: "Salário",
    amountInCents: 1000,
    category: "Salário",
    transactionDate: "2026-08-04",
    paymentMethod: "BANK_ACCOUNT",
    notes: null,
    createdAt: "2026-08-04T00:00:00Z",
    updatedAt: "2026-08-04T00:00:00Z",
  },
];

describe("buildExpensesByCategoryData", () => {
  it("groups only expenses by category and sorts descending", () => {
    expect(buildExpensesByCategoryData(transactions)).toEqual([
      { category: "Moradia", amountInCents: 700 },
      { category: "Alimentação", amountInCents: 300 },
      { category: "Saúde", amountInCents: 200 },
    ]);
  });
});
