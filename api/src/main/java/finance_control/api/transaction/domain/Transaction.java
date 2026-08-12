package finance_control.api.transaction.domain;

import java.time.Instant;
import java.time.LocalDate;
import java.util.Objects;
import java.util.UUID;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "transactions")
@EntityListeners(AuditingEntityListener.class)
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private TransactionType type;

    @Column(nullable = false, length = 120)
    private String description;

    @Column(nullable = false)
    private Long amountInCents;

    @Column(nullable = false, length = 80)
    private String category;

    @Column(nullable = false)
    private LocalDate transactionDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private PaymentMethod paymentMethod;

    @Column(length = 255)
    private String notes;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @LastModifiedDate
    @Column(nullable = false)
    private Instant updatedAt;

    protected Transaction() {
    }

    public static Transaction create(
            TransactionType type,
            String description,
            Long amountInCents,
            String category,
            LocalDate transactionDate,
            PaymentMethod paymentMethod,
            String notes
    ) {
        Transaction transaction = new Transaction();
        transaction.type = Objects.requireNonNull(type, "type");
        transaction.description = normalizeRequired(description, "description");
        transaction.amountInCents = Objects.requireNonNull(amountInCents, "amountInCents");
        transaction.category = normalizeRequired(category, "category");
        transaction.transactionDate = Objects.requireNonNull(transactionDate, "transactionDate");
        transaction.paymentMethod = Objects.requireNonNull(paymentMethod, "paymentMethod");
        transaction.notes = normalizeOptional(notes);
        return transaction;
    }

    public UUID getId() {
        return id;
    }

    public TransactionType getType() {
        return type;
    }

    public String getDescription() {
        return description;
    }

    public Long getAmountInCents() {
        return amountInCents;
    }

    public String getCategory() {
        return category;
    }

    public LocalDate getTransactionDate() {
        return transactionDate;
    }

    public PaymentMethod getPaymentMethod() {
        return paymentMethod;
    }

    public String getNotes() {
        return notes;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    private static String normalizeRequired(String value, String fieldName) {
        String normalized = Objects.requireNonNull(value, fieldName).trim();
        if (normalized.isEmpty()) {
            throw new IllegalArgumentException(fieldName + " must not be blank");
        }
        return normalized;
    }

    private static String normalizeOptional(String value) {
        if (value == null) {
            return null;
        }

        String normalized = value.trim();
        return normalized.isEmpty() ? null : normalized;
    }
}
