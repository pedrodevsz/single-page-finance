import type { PaymentMethod } from "@/types/transaction";

export interface FixedExpenseHistorySummary {
    seriesId: string;
    description: string;
    category: string;
    recordCount: number;
    paidCount: number;
    pendingCount: number;
}

export interface FixedExpenseHistoryRecord {
    id: string;
    seriesId: string;
    description: string;
    category: string;
    dueDate: string;
    amountInCents: number;
    paid: boolean;
    paidAt: string | null;
    paymentMethod: PaymentMethod;
    notes: string | null;
    installmentNumber: number | null;
    totalInstallments: number | null;
}
