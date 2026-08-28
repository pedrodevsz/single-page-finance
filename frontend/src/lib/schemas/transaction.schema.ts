import { z } from "zod";


const descriptionSchema = z
  .string()
  .trim()
  .min(3, "Informe uma descrição.")
  .max(120, "A descrição deve ter no máximo 120 caracteres.");

const amountSchema = z
  .number()
  .int("Informe um valor maior que zero.")
  .positive("Informe um valor maior que zero.");

const dateSchema = z
  .string()
  .trim()
  .min(1, "Informe uma data.")
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Informe uma data válida.");

const notesSchema = z
  .string()
  .trim()
  .max(255, "A observação deve ter no máximo 255 caracteres.");

const categorySchema = z.string().trim().min(1, "Selecione uma categoria.").max(80);
const paymentMethodSchema = z.string().trim().min(1, "Selecione um meio de pagamento.").max(80);

export const incomeSchema = z.object({
  description: descriptionSchema,
  amountInCents: amountSchema,
  category: categorySchema,
  transactionDate: dateSchema,
  paymentMethod: paymentMethodSchema,
  notes: notesSchema,
});

export const expenseSchema = z.object({
  description: descriptionSchema,
  amountInCents: amountSchema,
  category: categorySchema,
  transactionDate: dateSchema,
  paymentMethod: paymentMethodSchema,
  notes: notesSchema,
});

export type IncomeFormValues = z.infer<typeof incomeSchema>;
export type ExpenseFormValues = z.infer<typeof expenseSchema>;
