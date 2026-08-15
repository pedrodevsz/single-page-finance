package finance_control.api.fixedexpense.infrastructure;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import finance_control.api.fixedexpense.domain.FixedExpense;

public interface FixedExpenseRepository extends JpaRepository<FixedExpense, UUID> {

    java.util.List<FixedExpense> findAllByPaidFalse();

    java.util.List<FixedExpense> findAllByDueDateIsNull();
}
