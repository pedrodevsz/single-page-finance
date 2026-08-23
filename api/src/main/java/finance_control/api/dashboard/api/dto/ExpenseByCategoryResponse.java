package finance_control.api.dashboard.api.dto;

public record ExpenseByCategoryResponse(
        String category,
        Long amountInCents) {
}
