package finance_control.api.fixedexpense.domain;

import java.time.Instant;
import java.util.Objects;
import java.util.UUID;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import finance_control.api.fixedexpense.api.dto.CreateFixedExpenseRequest;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "fixed_expense_series")
@EntityListeners(AuditingEntityListener.class)
public class FixedExpenseSeries {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 120)
    private String description;

    @Column(nullable = false)
    private Long amountInCents;

    @Column(nullable = false, length = 80)
    private String category;

    @Column(nullable = false, length = 80)
    private String paymentMethod;

    @Column(length = 255)
    private String notes;

    @Column(nullable = true)
    private Integer installments;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @LastModifiedDate
    @Column(nullable = false)
    private Instant updatedAt;

    protected FixedExpenseSeries() {
    }

    public static FixedExpenseSeries create(CreateFixedExpenseRequest request) {
        FixedExpenseSeries series = new FixedExpenseSeries();
        series.description = normalizeRequired(request.description(), "description");
        series.amountInCents = Objects.requireNonNull(request.amountInCents(), "amountInCents");
        series.category = normalizeRequired(request.category(), "category");
        series.paymentMethod = normalizeRequired(request.paymentMethod(), "paymentMethod");
        series.notes = normalizeOptional(request.notes());
        series.installments = request.installments();
        return series;
    }

    public UUID getId() { return id; }
    public String getDescription() { return description; }
    public Long getAmountInCents() { return amountInCents; }
    public String getCategory() { return category; }
    public String getPaymentMethod() { return paymentMethod; }
    public String getNotes() { return notes; }
    public Integer getInstallments() { return installments; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }

    private static String normalizeRequired(String value, String fieldName) {
        String normalized = Objects.requireNonNull(value, fieldName).trim();
        if (normalized.isEmpty()) throw new IllegalArgumentException(fieldName + " must not be blank");
        return normalized;
    }

    private static String normalizeOptional(String value) {
        if (value == null) return null;
        String normalized = value.trim();
        return normalized.isEmpty() ? null : normalized;
    }
}
