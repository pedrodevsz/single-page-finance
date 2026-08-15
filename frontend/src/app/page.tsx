
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { TransactionFormSection } from "@/components/finance/transaction-form-section";
import { TransactionListSection } from "@/components/finance/transaction-list-section";
import { FixedExpenseForm } from "@/components/finance/fixed-expense-form";
import { FixedExpenseList } from "@/components/finance/fixed-expense-list";

export default function Home() {
  return (
    <main className="relative min-h-dvh bg-background text-foreground">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>
      <div className="mx-auto flex min-h-dvh w-full max-w-7xl flex-col gap-8 px-4 py-20 sm:px-6 lg:px-8">

        <div className="grid items-stretch gap-6 lg:grid-cols-2">
          <TransactionFormSection />
          <TransactionListSection />
        </div>
      </div>
    </main>
  );
}
