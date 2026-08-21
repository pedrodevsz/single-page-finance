
import { TransactionFormSection } from "@/components/finance/transaction/transaction-form-section";
import { TransactionListSection } from "@/components/finance/transaction/transaction-list-section";

import { DesktopHeader } from "@/components/header/desktop-header";

export default function Home() {
  return (
    <main className="relative min-h-dvh bg-background text-foreground">
      <DesktopHeader />
      <div className="mx-auto flex min-h-dvh w-full max-w-7xl flex-col gap-8 px-4 py-20 sm:px-6 lg:px-8">

        <div className="grid items-stretch gap-6 lg:grid-cols-2">
          <TransactionFormSection />
          <TransactionListSection />
        </div>
      </div>
    </main>
  );
}
