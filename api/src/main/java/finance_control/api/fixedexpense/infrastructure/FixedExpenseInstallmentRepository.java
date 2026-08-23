package finance_control.api.fixedexpense.infrastructure;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import finance_control.api.fixedexpense.domain.FixedExpenseInstallment;

public interface FixedExpenseInstallmentRepository extends JpaRepository<FixedExpenseInstallment, UUID> {
    @EntityGraph(attributePaths = "series")
    List<FixedExpenseInstallment> findAllByPaidFalseAndDueDateGreaterThanEqualAndDueDateLessThanOrderByDueDateAsc(
            LocalDate startDate, LocalDate endDate);
    @EntityGraph(attributePaths = "series")
    List<FixedExpenseInstallment> findAllBySeriesIdOrderByDueDateDesc(UUID seriesId);
    Optional<FixedExpenseInstallment> findTopBySeriesIdOrderByDueDateDesc(UUID seriesId);
    Optional<FixedExpenseInstallment> findBySeriesIdAndDueDate(UUID seriesId, LocalDate dueDate);

    @Query("""
            select coalesce(sum(installment.amountInCents), 0)
            from FixedExpenseInstallment installment
            where installment.dueDate >= :startDate and installment.dueDate < :endDate
            """)
    Long sumAmountInCentsByDueDateRange(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    long countByDueDateGreaterThanEqualAndDueDateLessThanAndPaidTrue(LocalDate startDate, LocalDate endDate);
    long countByDueDateGreaterThanEqualAndDueDateLessThanAndPaidFalse(LocalDate startDate, LocalDate endDate);

    @Query("""
            select series.id as seriesId, series.description as description, series.category as category,
                   count(installment.id) as recordCount,
                   coalesce(sum(case when installment.paid = true then 1 else 0 end), 0) as paidCount,
                   coalesce(sum(case when installment.paid = false then 1 else 0 end), 0) as pendingCount
            from FixedExpenseInstallment installment
            join installment.series series
            group by series.id, series.description, series.category
            order by series.description
            """)
    List<FixedExpenseInstallmentSummary> findHistorySummaries();
}
