package finance_control.api.fixedexpense.api.dto;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record CreateFixedExpenseRequest(
        @NotBlank String description,
        @NotNull Long amountInCents,
        @NotBlank String category,
        @NotNull LocalDate dueDate,
        @NotBlank @Size(max = 80) String paymentMethod,
        String notes,
        Integer installments) {
}
