export function parseBrlInputToCents(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits.length > 0 ? Number(digits) : 0;
}

export function formatCentsToBrl(amountInCents: number) {
  return new Intl.NumberFormat("pt-BR", {
    currency: "BRL",
    style: "currency",
  }).format(amountInCents / 100);
}
