package finance_control.api.fixedexpense.infrastructure;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import finance_control.api.fixedexpense.domain.FixedExpenseSeries;

public interface FixedExpenseSeriesRepository extends JpaRepository<FixedExpenseSeries, UUID> {
    long countByCategoryIgnoreCase(String category);
    long countByPaymentMethodIgnoreCase(String paymentMethod);
}
