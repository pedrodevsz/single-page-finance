import type {
  CreateExpensePayload,
  CreateIncomePayload,
  TransactionApiType,
  TransactionType,
} from "@/types/transaction";
import type {
  ExpenseFormValues,
  IncomeFormValues,
} from "@/lib/schemas/transaction.schema";

function normalizeNotes(notes: string) {
  const trimmedNotes = notes.trim();
  return trimmedNotes.length > 0 ? trimmedNotes : null;
}

function mapBaseTransactionValues(
  values: IncomeFormValues | ExpenseFormValues,
  type: TransactionApiType
) {
  return {
    type,
    description: values.description.trim(),
    amountInCents: values.amountInCents,
    category: values.category,
    transactionDate: values.transactionDate,
    paymentMethod: values.paymentMethod,
    notes: normalizeNotes(values.notes),
  };
}

export function toCreateIncomePayload(values: IncomeFormValues): CreateIncomePayload {
  return {
    ...mapBaseTransactionValues(values, "INCOME"),
    type: "INCOME",
  };
}

export function toCreateExpensePayload(values: ExpenseFormValues): CreateExpensePayload {
  return {
    ...mapBaseTransactionValues(values, "EXPENSE"),
    type: "EXPENSE",
  };
}

export function toTransactionApiType(transactionType: TransactionType): TransactionApiType {
  return transactionType === "income" ? "INCOME" : "EXPENSE";
}
