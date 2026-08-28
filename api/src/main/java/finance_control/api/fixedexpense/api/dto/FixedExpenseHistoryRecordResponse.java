package finance_control.api.fixedexpense.api.dto;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;


public record FixedExpenseHistoryRecordResponse(
        UUID id,
        UUID seriesId,
        String description,
        String category,
        LocalDate dueDate,
        Long amountInCents,
        boolean paid,
        Instant paidAt,
        String paymentMethod,
        String notes,
        Integer installmentNumber,
        Integer totalInstallments) {
}
