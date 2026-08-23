package finance_control.api.fixedexpense.domain;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "fixed_expense_installments")
@EntityListeners(AuditingEntityListener.class)
public class FixedExpenseInstallment {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "series_id", nullable = false)
    private FixedExpenseSeries series;

    @Column(name = "installment_number")
    private Integer installmentNumber;

    @Column(name = "amount_in_cents", nullable = false)
    private Long amountInCents;

    @Column(name = "due_date", nullable = false)
    private LocalDate dueDate;

    @Column(nullable = false)
    private boolean paid;

    @Column(name = "paid_at")
    private Instant paidAt;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @LastModifiedDate
    @Column(nullable = false)
    private Instant updatedAt;

    protected FixedExpenseInstallment() {
    }

    public static FixedExpenseInstallment create(FixedExpenseSeries series, Integer number, LocalDate dueDate) {
        FixedExpenseInstallment installment = new FixedExpenseInstallment();
        installment.series = series;
        installment.installmentNumber = number;
        installment.amountInCents = series.getAmountInCents();
        installment.dueDate = dueDate;
        return installment;
    }

    public void markAsPaid(Instant paidAt) {
        if (!paid) {
            paid = true;
            this.paidAt = paidAt;
        }
    }

    public UUID getId() { return id; }
    public FixedExpenseSeries getSeries() { return series; }
    public Integer getInstallmentNumber() { return installmentNumber; }
    public Long getAmountInCents() { return amountInCents; }
    public LocalDate getDueDate() { return dueDate; }
    public boolean isPaid() { return paid; }
    public Instant getPaidAt() { return paidAt; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
}
