import { PaymentMethod } from "./transaction";

export interface FixedExpenseInstallment {
    id: string;
    seriesId: string;
    description: string;
    amountInCents: number;
    category: string;
    dueDate: string;
    paymentMethod: PaymentMethod;
    notes?: string | null;
    createdAt: string;
    updatedAt: string;
    installmentNumber: number | null;
    totalInstallments: number | null;
    paid: boolean;
    paidAt: string | null;
}

export type FixedExpense = FixedExpenseInstallment;

export interface CreateFixedExpensePayload {
    description: string;
    amountInCents: number;
    category: string;
    dueDate: string;
    paymentMethod: PaymentMethod;
    notes?: string | null;
    installments?: number | null;
}
