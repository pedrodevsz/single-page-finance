import { describe, expect, it } from "vitest";

import type { FixedExpense } from "@/types/fixed-expense";

import { buildFixedExpensesSummary } from "../transactions/fixed-expenses-summary";

const fixedExpenses: FixedExpense[] = [
  {
    id: "1",
    description: "Aluguel",
    amountInCents: 1000,
    category: "Moradia",
    dueDate: "2026-08-10",
    paymentMethod: "BANK_TRANSFER",
    notes: null,
    installments: null,
    paid: true,
    createdAt: "2026-08-01T00:00:00Z",
    updatedAt: "2026-08-01T00:00:00Z",
  },
  {
    id: "2",
    description: "Internet",
    amountInCents: 250,
    category: "Assinaturas",
    dueDate: "2026-08-15",
    paymentMethod: "CREDIT_CARD",
    notes: null,
    installments: null,
    paid: false,
    createdAt: "2026-08-01T00:00:00Z",
    updatedAt: "2026-08-01T00:00:00Z",
  },
];

describe("buildFixedExpensesSummary", () => {
  it("counts paid and pending fixed expenses and sums the total", () => {
    expect(buildFixedExpensesSummary(fixedExpenses)).toEqual({
      paidCount: 1,
      pendingCount: 1,
      totalInCents: 1250,
    });
  });
});
