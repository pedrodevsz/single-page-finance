package finance_control.api.transaction.infrastructure;

import java.util.UUID;
import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import finance_control.api.transaction.domain.Transaction;
import finance_control.api.transaction.domain.TransactionType;

public interface TransactionRepository extends JpaRepository<Transaction, UUID> {
    List<Transaction> findAllByType(TransactionType type, Sort sort);
    long countByCategoryIgnoreCaseAndType(String category, TransactionType type);
    long countByPaymentMethodIgnoreCaseAndType(String paymentMethod, TransactionType type);

    @Query("""
            select coalesce(sum(transaction.amountInCents), 0)
            from Transaction transaction
            where transaction.type = :type
              and transaction.transactionDate >= :startDate
              and transaction.transactionDate < :endDate
            """)
    Long sumAmountInCentsByTypeAndDateRange(
            @Param("type") TransactionType type,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    @Query("""
            select transaction.category as category,
                   sum(transaction.amountInCents) as amountInCents
            from Transaction transaction
            where transaction.type = finance_control.api.transaction.domain.TransactionType.EXPENSE
              and transaction.transactionDate >= :startDate
              and transaction.transactionDate < :endDate
            group by transaction.category
            order by sum(transaction.amountInCents) desc, transaction.category asc
            """)
    List<CategoryTransactionTotal> findExpenseTotalsByCategory(
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    @Query(value = """
            select to_char(date_trunc('month', transaction_date), 'YYYY-MM') as month,
                   cast(coalesce(sum(case when type = 'INCOME' then amount_in_cents else 0 end), 0) as bigint) as incomeInCents,
                   cast(coalesce(sum(case when type = 'EXPENSE' then amount_in_cents else 0 end), 0) as bigint) as expenseInCents
            from public.transactions
            where transaction_date >= :startDate
              and transaction_date < :endDate
            group by date_trunc('month', transaction_date)
            order by date_trunc('month', transaction_date)
            """, nativeQuery = true)
    List<MonthlyTransactionTotal> findMonthlyTotals(
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);
}
