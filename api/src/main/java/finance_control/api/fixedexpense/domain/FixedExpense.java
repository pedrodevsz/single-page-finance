package finance_control.api.fixedexpense.domain;

import java.time.Instant;
import java.time.LocalDate;
import java.util.Objects;
import java.util.UUID;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import finance_control.api.transaction.domain.PaymentMethod;

import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "fixed_expenses")
@EntityListeners(AuditingEntityListener.class)
public class FixedExpense {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 120)
    private String description;

    @Column(nullable = false)
    private Long amountInCents;

    @Column(nullable = false, length = 80)
    private String category;

    @Column(name = "due_date", nullable = true)
    private LocalDate dueDate;

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

    @Column(nullable = true)
    private Integer installments;

    @Column(nullable = false)
    private boolean paid = false;

    protected FixedExpense() {
    }

    public static FixedExpense create(
            String description,
            Long amountInCents,
            String category,
            LocalDate dueDate,
            PaymentMethod paymentMethod,
            String notes,
            Integer installments) {
        FixedExpense fe = new FixedExpense();
        fe.description = normalizeRequired(description, "description");
        fe.amountInCents = Objects.requireNonNull(amountInCents, "amountInCents");
        fe.category = normalizeRequired(category, "category");
        fe.dueDate = Objects.requireNonNull(dueDate, "dueDate");
        fe.paymentMethod = Objects.requireNonNull(paymentMethod, "paymentMethod");
        fe.notes = normalizeOptional(notes);
        fe.installments = installments;
        return fe;
    }

    public UUID getId() {
        return id;
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

    public LocalDate getDueDate() {
        return dueDate;
    }

    public PaymentMethod getPaymentMethod() {
        return paymentMethod;
    }

    public String getNotes() {
        return notes;
    }

    public Integer getInstallments() {
        return installments;
    }

    public boolean isPaid() {
        return paid;
    }

    public void markPaid() {
        this.paid = true;
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
