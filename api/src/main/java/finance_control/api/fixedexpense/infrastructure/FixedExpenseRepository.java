package finance_control.api.fixedexpense.infrastructure;

import java.time.LocalDate;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import finance_control.api.fixedexpense.domain.FixedExpense;

public interface FixedExpenseRepository extends JpaRepository<FixedExpense, UUID> {

    java.util.List<FixedExpense> findAllByPaidFalse();

    java.util.List<FixedExpense> findAllByDueDateIsNull();

    @Query("""
            select coalesce(sum(fixedExpense.amountInCents), 0)
            from FixedExpense fixedExpense
            where fixedExpense.dueDate >= :startDate
              and fixedExpense.dueDate < :endDate
            """)
    Long sumAmountInCentsByDueDateRange(
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    long countByDueDateGreaterThanEqualAndDueDateLessThanAndPaidTrue(LocalDate startDate, LocalDate endDate);

    long countByDueDateGreaterThanEqualAndDueDateLessThanAndPaidFalse(LocalDate startDate, LocalDate endDate);
}
