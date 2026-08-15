import { PaymentMethod } from "./transaction";

export interface FixedExpense {
    id: string;
    description: string;
    amountInCents: number;
    category: string;
    dueDate: string;
    paymentMethod: PaymentMethod;
    notes?: string | null;
    createdAt: string;
    updatedAt: string;
    installments?: number | null;
    paid?: boolean;
}

export interface CreateFixedExpensePayload {
    description: string;
    amountInCents: number;
    category: string;
    dueDate: string;
    paymentMethod: PaymentMethod;
    notes?: string | null;
    installments?: number | null;
}
