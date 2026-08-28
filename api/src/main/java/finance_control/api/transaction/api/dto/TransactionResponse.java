package finance_control.api.transaction.api.dto;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

import finance_control.api.transaction.domain.Transaction;
import finance_control.api.transaction.domain.TransactionType;

public record TransactionResponse(
        UUID id,
        TransactionType type,
        String description,
        Long amountInCents,
        String category,
        LocalDate transactionDate,
        String paymentMethod,
        String notes,
        Instant createdAt,
        Instant updatedAt
) {

    public static TransactionResponse from(Transaction transaction) {
        return new TransactionResponse(
                transaction.getId(),
                transaction.getType(),
                transaction.getDescription(),
                transaction.getAmountInCents(),
                transaction.getCategory(),
                transaction.getTransactionDate(),
                transaction.getPaymentMethod(),
                transaction.getNotes(),
                transaction.getCreatedAt(),
                transaction.getUpdatedAt()
        );
    }
}
