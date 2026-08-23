package finance_control.api.dashboard.api.dto;

public record DashboardSummaryResponse(
        Long incomeInCents,
        Long expenseInCents,
        Long balanceInCents,
        Long fixedExpensesInCents,
        long paidFixedExpenses,
        long pendingFixedExpenses) {
}
