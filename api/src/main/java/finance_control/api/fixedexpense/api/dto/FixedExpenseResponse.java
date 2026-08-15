package finance_control.api.fixedexpense.api.dto;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

import finance_control.api.fixedexpense.domain.FixedExpense;
import finance_control.api.transaction.domain.PaymentMethod;

public record FixedExpenseResponse(
        UUID id,
        String description,
        Long amountInCents,
        String category,
        LocalDate dueDate,
        PaymentMethod paymentMethod,
        String notes,
        Integer installments,
        boolean paid,
        Instant createdAt,
        Instant updatedAt) {
    public static FixedExpenseResponse from(FixedExpense fe) {
        return new FixedExpenseResponse(
                fe.getId(),
                fe.getDescription(),
                fe.getAmountInCents(),
                fe.getCategory(),
                fe.getDueDate(),
                fe.getPaymentMethod(),
                fe.getNotes(),
                fe.getInstallments(),
                fe.isPaid(),
                fe.getCreatedAt(),
                fe.getUpdatedAt());
    }
}
