package finance_control.api.fixedexpense.api.dto;

import finance_control.api.transaction.domain.PaymentMethod;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record CreateFixedExpenseRequest(
        @NotBlank String description,
        @NotNull Long amountInCents,
        @NotBlank String category,
        @NotNull LocalDate dueDate,
        @NotNull PaymentMethod paymentMethod,
        String notes,
        Integer installments) {
}
