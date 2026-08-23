import { mockFixedExpenses } from "@/lib/mock/finance-mock";
import type { CreateFixedExpensePayload, FixedExpense } from "@/types/fixed-expense";

let fixedExpenses = [...mockFixedExpenses];

export async function getFixedExpenses() {
    return fixedExpenses.filter((expense) => !expense.paid);
}

export async function createFixedExpense(payload: CreateFixedExpensePayload) {
    const now = new Date().toISOString();
    const expense: FixedExpense = { ...payload, id: `mock-fixed-${now}`, notes: payload.notes ?? null, paid: false, createdAt: now, updatedAt: now };
    fixedExpenses = [expense, ...fixedExpenses];
    return expense;
}

export async function deleteFixedExpense(id: string) {
    fixedExpenses = fixedExpenses.filter((expense) => expense.id !== id);
}

export async function markFixedExpenseAsPaid(id: string) {
    fixedExpenses = fixedExpenses.map((expense) => expense.id === id ? { ...expense, paid: true } : expense);
}

export const fixedExpenseService = {
    getFixedExpenses,
    createFixedExpense,
    deleteFixedExpense,
    markFixedExpenseAsPaid,
};
