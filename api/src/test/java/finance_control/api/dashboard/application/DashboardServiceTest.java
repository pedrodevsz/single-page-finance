package finance_control.api.dashboard.application;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import finance_control.api.dashboard.api.dto.DashboardSummaryResponse;
import finance_control.api.dashboard.api.dto.ExpenseByCategoryResponse;
import finance_control.api.dashboard.api.dto.FinancialEvolutionResponse;
import finance_control.api.fixedexpense.infrastructure.FixedExpenseInstallmentRepository;
import finance_control.api.transaction.domain.TransactionType;
import finance_control.api.transaction.infrastructure.CategoryTransactionTotal;
import finance_control.api.transaction.infrastructure.MonthlyTransactionTotal;
import finance_control.api.transaction.infrastructure.TransactionRepository;

@ExtendWith(MockitoExtension.class)
class DashboardServiceTest {

    @Mock
    private TransactionRepository transactionRepository;

    @Mock
    private FixedExpenseInstallmentRepository fixedExpenseRepository;

    @InjectMocks
    private DashboardService dashboardService;

    @Test
    void shouldBuildCurrentMonthSummary() {
        YearMonth currentMonth = YearMonth.now();
        LocalDate startDate = currentMonth.atDay(1);
        LocalDate endDate = currentMonth.plusMonths(1).atDay(1);

        when(transactionRepository.sumAmountInCentsByTypeAndDateRange(TransactionType.INCOME, startDate, endDate))
                .thenReturn(500_000L);
        when(transactionRepository.sumAmountInCentsByTypeAndDateRange(TransactionType.EXPENSE, startDate, endDate))
                .thenReturn(320_000L);
        when(fixedExpenseRepository.sumAmountInCentsByDueDateRange(startDate, endDate)).thenReturn(145_000L);
        when(fixedExpenseRepository.countByDueDateGreaterThanEqualAndDueDateLessThanAndPaidTrue(startDate, endDate))
                .thenReturn(6L);
        when(fixedExpenseRepository.countByDueDateGreaterThanEqualAndDueDateLessThanAndPaidFalse(startDate, endDate))
                .thenReturn(2L);

        DashboardSummaryResponse summary = dashboardService.summary();

        assertThat(summary).isEqualTo(new DashboardSummaryResponse(500_000L, 320_000L, 180_000L, 145_000L, 6L, 2L));
    }

    @Test
    void shouldReturnEvolutionWithEmptyMonths() {
        YearMonth currentMonth = YearMonth.now();
        MonthlyTransactionTotal firstMonth = monthlyTotal(currentMonth.minusMonths(2), 100_000L, 40_000L);
        MonthlyTransactionTotal lastMonth = monthlyTotal(currentMonth, 250_000L, 90_000L);

        when(transactionRepository.findMonthlyTotals(any(LocalDate.class), any(LocalDate.class)))
                .thenReturn(List.of(firstMonth, lastMonth));

        List<FinancialEvolutionResponse> evolution = dashboardService.evolution(3);

        assertThat(evolution).containsExactly(
                new FinancialEvolutionResponse(currentMonth.minusMonths(2).toString(), 100_000L, 40_000L),
                new FinancialEvolutionResponse(currentMonth.minusMonths(1).toString(), 0L, 0L),
                new FinancialEvolutionResponse(currentMonth.toString(), 250_000L, 90_000L));
    }

    @Test
    void shouldReturnExpenseTotalsByCategoryForCurrentMonth() {
        CategoryTransactionTotal food = categoryTotal("Alimentação", 65_000L);
        CategoryTransactionTotal transport = categoryTotal("Transporte", 42_000L);

        when(transactionRepository.findExpenseTotalsByCategory(any(LocalDate.class), any(LocalDate.class)))
                .thenReturn(List.of(food, transport));

        List<ExpenseByCategoryResponse> expenses = dashboardService.expensesByCategory();

        assertThat(expenses).containsExactly(
                new ExpenseByCategoryResponse("Alimentação", 65_000L),
                new ExpenseByCategoryResponse("Transporte", 42_000L));
    }

    private static MonthlyTransactionTotal monthlyTotal(YearMonth month, Long incomeInCents, Long expenseInCents) {
        MonthlyTransactionTotal total = mock(MonthlyTransactionTotal.class);
        when(total.getMonth()).thenReturn(month.toString());
        when(total.getIncomeInCents()).thenReturn(incomeInCents);
        when(total.getExpenseInCents()).thenReturn(expenseInCents);
        return total;
    }

    private static CategoryTransactionTotal categoryTotal(String category, Long amountInCents) {
        CategoryTransactionTotal total = mock(CategoryTransactionTotal.class);
        when(total.getCategory()).thenReturn(category);
        when(total.getAmountInCents()).thenReturn(amountInCents);
        return total;
    }
}
