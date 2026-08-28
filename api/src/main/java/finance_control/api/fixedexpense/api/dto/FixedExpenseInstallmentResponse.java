package finance_control.api.fixedexpense.api.dto;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

import finance_control.api.fixedexpense.domain.FixedExpenseInstallment;

public record FixedExpenseInstallmentResponse(
        UUID id,
        UUID seriesId,
        String description,
        String category,
        Long amountInCents,
        LocalDate dueDate,
        String paymentMethod,
        String notes,
        Integer installmentNumber,
        Integer totalInstallments,
        boolean paid,
        Instant paidAt,
        Instant createdAt,
        Instant updatedAt) {
    public static FixedExpenseInstallmentResponse from(FixedExpenseInstallment installment) {
        var series = installment.getSeries();
        return new FixedExpenseInstallmentResponse(
                installment.getId(), series.getId(), series.getDescription(), series.getCategory(),
                installment.getAmountInCents(), installment.getDueDate(), series.getPaymentMethod(),
                series.getNotes(), installment.getInstallmentNumber(), series.getInstallments(),
                installment.isPaid(), installment.getPaidAt(), installment.getCreatedAt(), installment.getUpdatedAt());
    }
}
