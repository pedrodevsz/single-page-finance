package finance_control.api.dashboard.application;

import java.time.YearMonth;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import finance_control.api.dashboard.api.dto.DashboardSummaryResponse;
import finance_control.api.dashboard.api.dto.ExpenseByCategoryResponse;
import finance_control.api.dashboard.api.dto.FinancialEvolutionResponse;
import finance_control.api.fixedexpense.infrastructure.FixedExpenseInstallmentRepository;
import finance_control.api.transaction.domain.TransactionType;
import finance_control.api.transaction.infrastructure.CategoryTransactionTotal;
import finance_control.api.transaction.infrastructure.MonthlyTransactionTotal;
import finance_control.api.transaction.infrastructure.TransactionRepository;

@Service
public class DashboardService {

    private static final int DEFAULT_EVOLUTION_MONTHS = 6;

    private final TransactionRepository transactionRepository;
    private final FixedExpenseInstallmentRepository fixedExpenseRepository;

    public DashboardService(
            TransactionRepository transactionRepository,
            FixedExpenseInstallmentRepository fixedExpenseRepository) {
        this.transactionRepository = transactionRepository;
        this.fixedExpenseRepository = fixedExpenseRepository;
    }

    @Transactional(readOnly = true)
    public DashboardSummaryResponse summary() {
        YearMonth currentMonth = YearMonth.now();
        var startDate = currentMonth.atDay(1);
        var endDate = currentMonth.plusMonths(1).atDay(1);

        Long incomeInCents = transactionRepository.sumAmountInCentsByTypeAndDateRange(
                TransactionType.INCOME, startDate, endDate);
        Long expenseInCents = transactionRepository.sumAmountInCentsByTypeAndDateRange(
                TransactionType.EXPENSE, startDate, endDate);
        Long fixedExpensesInCents = fixedExpenseRepository.sumAmountInCentsByDueDateRange(startDate, endDate);
        long paidFixedExpenses = fixedExpenseRepository
                .countByDueDateGreaterThanEqualAndDueDateLessThanAndPaidTrue(startDate, endDate);
        long pendingFixedExpenses = fixedExpenseRepository
                .countByDueDateGreaterThanEqualAndDueDateLessThanAndPaidFalse(startDate, endDate);

        return new DashboardSummaryResponse(
                valueOrZero(incomeInCents),
                valueOrZero(expenseInCents),
                valueOrZero(incomeInCents) - valueOrZero(expenseInCents),
                valueOrZero(fixedExpensesInCents),
                paidFixedExpenses,
                pendingFixedExpenses);
    }

    @Transactional(readOnly = true)
    public List<FinancialEvolutionResponse> evolution(Integer requestedMonths) {
        int months = requestedMonths == null ? DEFAULT_EVOLUTION_MONTHS : requestedMonths;
        if (months < 1 || months > 24) {
            throw new IllegalArgumentException("months must be between 1 and 24");
        }

        YearMonth currentMonth = YearMonth.now();
        YearMonth firstMonth = currentMonth.minusMonths(months - 1L);
        var startDate = firstMonth.atDay(1);
        var endDate = currentMonth.plusMonths(1).atDay(1);

        Map<String, MonthlyTransactionTotal> totalsByMonth = transactionRepository
                .findMonthlyTotals(startDate, endDate)
                .stream()
                .collect(Collectors.toMap(MonthlyTransactionTotal::getMonth, Function.identity()));

        return Stream.iterate(firstMonth, month -> month.plusMonths(1))
                .limit(months)
                .map(month -> {
                    String monthKey = month.toString();
                    MonthlyTransactionTotal total = totalsByMonth.get(monthKey);
                    return new FinancialEvolutionResponse(
                            monthKey,
                            total == null ? 0L : valueOrZero(total.getIncomeInCents()),
                            total == null ? 0L : valueOrZero(total.getExpenseInCents()));
                })
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ExpenseByCategoryResponse> expensesByCategory() {
        YearMonth currentMonth = YearMonth.now();
        var startDate = currentMonth.atDay(1);
        var endDate = currentMonth.plusMonths(1).atDay(1);

        return transactionRepository.findExpenseTotalsByCategory(startDate, endDate)
                .stream()
                .map(this::toExpenseByCategoryResponse)
                .toList();
    }

    private ExpenseByCategoryResponse toExpenseByCategoryResponse(CategoryTransactionTotal total) {
        return new ExpenseByCategoryResponse(total.getCategory(), valueOrZero(total.getAmountInCents()));
    }

    private static Long valueOrZero(Long value) {
        return value == null ? 0L : value;
    }
}
