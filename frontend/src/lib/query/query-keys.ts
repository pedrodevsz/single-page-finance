import type { TransactionType } from "@/types/transaction";

export const transactionKeys = {
  all: ["transactions"] as const,
  list: (transactionType: TransactionType) =>
    [...transactionKeys.all, "list", transactionType] as const,
};
