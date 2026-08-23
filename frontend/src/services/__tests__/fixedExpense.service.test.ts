import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
    api: {
        delete: vi.fn(),
        patch: vi.fn(),
    },
}));

vi.mock("@/lib/api/axios", () => ({
    api: mocks.api,
    isApiConfigured: true,
}));

import {
    deleteFixedExpenseInstallment,
    deleteFixedExpenseSeries,
    payFixedExpenseInstallment,
} from "@/services/fixedExpense.service";

describe("fixed expense history actions", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("deletes an entire fixed expense series", async () => {
        await deleteFixedExpenseSeries("series-1");

        expect(mocks.api.delete).toHaveBeenCalledWith("/api/v1/fixed-expenses/series/series-1");
    });

    it("deletes one installment without changing the series route", async () => {
        await deleteFixedExpenseInstallment("installment-1");

        expect(mocks.api.delete).toHaveBeenCalledWith("/api/v1/fixed-expenses/installments/installment-1");
    });

    it("uses the payment endpoint for pending or future installments", async () => {
        await payFixedExpenseInstallment("installment-1");

        expect(mocks.api.patch).toHaveBeenCalledWith("/api/v1/fixed-expenses/installments/installment-1/payment");
    });
});
