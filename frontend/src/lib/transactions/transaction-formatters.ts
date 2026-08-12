import { formatCentsToBrl } from "@/lib/money";
import type { PaymentMethod, TransactionApiType } from "@/types/transaction";
import { paymentMethodOptions } from "@/types/transaction";

const paymentMethodLabelByValue = Object.fromEntries(
  paymentMethodOptions.map((option) => [option.value, option.label])
) as Record<PaymentMethod, string>;

export function formatTransactionDate(transactionDate: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${transactionDate}T00:00:00`));
}

export function formatTransactionAmount(amountInCents: number, type: TransactionApiType) {
  const formattedAmount = formatCentsToBrl(amountInCents);
  return type === "EXPENSE" ? `- ${formattedAmount}` : `+ ${formattedAmount}`;
}

export function getPaymentMethodLabel(paymentMethod: PaymentMethod) {
  return paymentMethodLabelByValue[paymentMethod];
}
