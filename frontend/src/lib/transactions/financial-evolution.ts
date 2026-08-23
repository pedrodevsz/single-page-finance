import type { Transaction } from "@/types/transaction";

export type FinancialEvolutionPoint = {
  month: string;
  monthKey: string;
  incomeInCents: number;
  expenseInCents: number;
};

function getMonthKey(transactionDate: string) {
  return transactionDate.slice(0, 7);
}

function isMonthKey(value: string) {
  return /^\d{4}-\d{2}$/.test(value);
}

function createMonthKey(year: number, month: number) {
  return `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}`;
}

function parseMonthKey(monthKey: string) {
  if (!isMonthKey(monthKey)) {
    return null;
  }

  const [year, month] = monthKey.split("-").map((value) => Number(value));
  if (!Number.isFinite(year) || !Number.isFinite(month)) {
    return null;
  }

  return { month, year };
}

function nextMonthKey(monthKey: string) {
  const parsed = parseMonthKey(monthKey);
  if (!parsed) {
    return null;
  }

  const nextMonth = parsed.month === 12 ? 1 : parsed.month + 1;
  const nextYear = parsed.month === 12 ? parsed.year + 1 : parsed.year;
  return createMonthKey(nextYear, nextMonth);
}

function formatMonthLabel(monthKey: string) {
  const parsed = parseMonthKey(monthKey);
  if (!parsed) {
    return monthKey;
  }

  const date = new Date(parsed.year, parsed.month - 1, 1);
  const monthLabel = new Intl.DateTimeFormat("pt-BR", { month: "short" })
    .format(date)
    .replace(".", "")
    .trim();

  return monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1);
}

export function buildFinancialEvolutionSeries(transactions: Transaction[]): FinancialEvolutionPoint[] {
  if (transactions.length === 0) {
    return [];
  }

  const totalsByMonth = new Map<string, FinancialEvolutionPoint>();

  for (const transaction of transactions) {
    const monthKey = getMonthKey(transaction.transactionDate);
    const current = totalsByMonth.get(monthKey) ?? {
      month: formatMonthLabel(monthKey),
      monthKey,
      incomeInCents: 0,
      expenseInCents: 0,
    };

    if (transaction.type === "INCOME") {
      current.incomeInCents += transaction.amountInCents;
    } else {
      current.expenseInCents += transaction.amountInCents;
    }

    totalsByMonth.set(monthKey, current);
  }

  const orderedMonthKeys = Array.from(totalsByMonth.keys()).sort();
  const firstMonthKey = orderedMonthKeys[0];
  const lastMonthKey = orderedMonthKeys[orderedMonthKeys.length - 1];

  const series: FinancialEvolutionPoint[] = [];
  let currentMonthKey: string | null = firstMonthKey;

  while (currentMonthKey) {
    const existingPoint = totalsByMonth.get(currentMonthKey);
    series.push(
      existingPoint ?? {
        month: formatMonthLabel(currentMonthKey),
        monthKey: currentMonthKey,
        incomeInCents: 0,
        expenseInCents: 0,
      }
    );

    if (currentMonthKey === lastMonthKey) {
      break;
    }

    currentMonthKey = nextMonthKey(currentMonthKey);
  }

  return series;
}
