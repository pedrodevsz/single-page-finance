package finance_control.api.dashboard.api.dto;

public record FinancialEvolutionResponse(
        String month,
        Long incomeInCents,
        Long expenseInCents) {
}
