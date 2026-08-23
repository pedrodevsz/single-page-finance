import {
    ArrowDownRight,
    ArrowUpRight,
    Wallet,
    CalendarDays,
} from "lucide-react";
import { isApiConfigured } from "@/lib/api/axios";
import { useFinancialSummary } from "@/hooks/dashboard/use-dashboard";
import { formatCentsToBrl } from "@/lib/money";
import { Loading } from "@/components/shared/loading";
import { DashboardQueryError } from "./dashboard-query-state";
import { FinancialSummaryCard } from "./finance-summary-card";



export function FinancialSummary() {
    const summaryQuery = useFinancialSummary();

    if (!isApiConfigured) {
        return <DashboardQueryError message="Configure a API para carregar o resumo financeiro." />;
    }

    if (summaryQuery.isPending) {
        return <Loading label="Carregando resumo financeiro..." className="min-h-24" />;
    }

    if (summaryQuery.isError || !summaryQuery.data) {
        return <DashboardQueryError message={summaryQuery.error?.message ?? "Não foi possível carregar o resumo financeiro."} />;
    }

    const { data } = summaryQuery;

    return (
        <section className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <FinancialSummaryCard
                    title="Entradas"
                    value={formatCentsToBrl(data.incomeInCents)}
                    icon={ArrowUpRight}
                />

                <FinancialSummaryCard
                    title="Saídas"
                    value={formatCentsToBrl(data.expenseInCents)}
                    icon={ArrowDownRight}
                />

                <FinancialSummaryCard
                    title="Saldo"
                    value={formatCentsToBrl(data.balanceInCents)}
                    icon={Wallet}
                />

                <FinancialSummaryCard
                    title="Contas fixas"
                    value={formatCentsToBrl(data.fixedExpensesInCents)}
                    icon={CalendarDays}
                />
            </div>
        </section>
    );
}
