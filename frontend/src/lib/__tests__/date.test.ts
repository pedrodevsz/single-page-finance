import { describe, it, expect } from "vitest";
import { parseApiDate } from "../date";
import { formatTransactionDate } from "../transactions/transaction-formatters";

describe("parseApiDate", () => {
    it("parses YYYY-MM-DD as local date", () => {
        const d = parseApiDate("2026-08-10");
        expect(d).not.toBeNull();
        expect(d!.getFullYear()).toBe(2026);
        expect(d!.getMonth()).toBe(7);
        expect(d!.getDate()).toBe(10);
    });

    it("parses ISO datetime", () => {
        const d = parseApiDate("2026-08-10T00:00:00Z");
        expect(d).not.toBeNull();
        expect(d!.getUTCFullYear()).toBe(2026);
    });

    it("returns null for invalid values", () => {
        expect(parseApiDate("not-a-date")).toBeNull();
        expect(parseApiDate(null)).toBeNull();
        expect(parseApiDate(undefined)).toBeNull();
    });
});

describe("formatTransactionDate", () => {
    it("formats YYYY-MM-DD correctly", () => {
        const formatted = formatTransactionDate("2026-08-10");
        expect(typeof formatted).toBe("string");
    });

    it("throws on invalid input", () => {
        expect(() => formatTransactionDate("invalid")).toThrow();
    });
});
