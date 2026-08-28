import { formatCentsToBrl } from "@/lib/money";
import { parseApiDate } from "@/lib/date";
import type { PaymentMethod, TransactionApiType } from "@/types/transaction";
import { paymentMethodOptions } from "@/types/transaction";

const paymentMethodLabelByValue: Record<string, string> = Object.fromEntries(
  paymentMethodOptions.map((option) => [option.value, option.label])
) as Record<PaymentMethod, string>;

export function formatTransactionDate(transactionDate: string) {
  const parsed = parseApiDate(transactionDate);
  if (!parsed) {
    throw new Error(`Invalid date value: ${String(transactionDate)}`);
  }

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parsed);
}

export function formatTransactionAmount(amountInCents: number, type: TransactionApiType) {
  const formattedAmount = formatCentsToBrl(amountInCents);
  return type === "EXPENSE" ? `- ${formattedAmount}` : `+ ${formattedAmount}`;
}

export function getPaymentMethodLabel(paymentMethod: PaymentMethod) {
  return paymentMethodLabelByValue[paymentMethod] ?? paymentMethod;
}
