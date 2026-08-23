import {
    ArrowDownRight,
    ArrowUpRight,
    Wallet,
    CalendarDays,
} from "lucide-react";
import { FinancialSummaryCard } from "./finance-summary-card";



export function FinancialSummary() {
    return (
        <section className="space-y-4">

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <FinancialSummaryCard
                    title="Entradas"
                    value="R$ 5.000,00"
                    icon={ArrowUpRight}
                />

                <FinancialSummaryCard
                    title="Saídas"
                    value="R$ 3.200,00"
                    icon={ArrowDownRight}
                />

                <FinancialSummaryCard
                    title="Saldo"
                    value="R$ 1.800,00"
                    icon={Wallet}
                />

                <FinancialSummaryCard
                    title="Contas fixas"
                    value="R$ 1.450,00"
                    icon={CalendarDays}
                />
            </div>
        </section>
    );
}