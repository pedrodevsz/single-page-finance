package finance_control.api.fixedexpense.api.dto;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

import finance_control.api.transaction.domain.PaymentMethod;

public record FixedExpenseHistoryRecordResponse(
        UUID id,
        UUID seriesId,
        String description,
        String category,
        LocalDate dueDate,
        Long amountInCents,
        boolean paid,
        Instant paidAt,
        PaymentMethod paymentMethod,
        String notes,
        Integer installmentNumber,
        Integer totalInstallments) {
}
