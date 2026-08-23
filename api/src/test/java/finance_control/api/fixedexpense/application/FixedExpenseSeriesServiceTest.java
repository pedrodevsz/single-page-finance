package finance_control.api.fixedexpense.application;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import finance_control.api.fixedexpense.api.dto.CreateFixedExpenseRequest;
import finance_control.api.fixedexpense.domain.FixedExpenseInstallment;
import finance_control.api.fixedexpense.domain.FixedExpenseSeries;
import finance_control.api.fixedexpense.infrastructure.FixedExpenseInstallmentRepository;
import finance_control.api.fixedexpense.infrastructure.FixedExpenseSeriesRepository;
import finance_control.api.transaction.domain.PaymentMethod;

@ExtendWith(MockitoExtension.class)
class FixedExpenseSeriesServiceTest {
    @Mock
    private FixedExpenseSeriesRepository seriesRepository;

    @Mock
    private FixedExpenseInstallmentRepository installmentRepository;

    @Test
    void shouldCalculateDefinedInstallmentDates() {
        assertThat(FixedExpenseSeriesService.dueDateFor(LocalDate.of(2026, 8, 25), 0))
                .isEqualTo(LocalDate.of(2026, 8, 25));
        assertThat(FixedExpenseSeriesService.dueDateFor(LocalDate.of(2026, 8, 25), 1))
                .isEqualTo(LocalDate.of(2026, 9, 25));
    }

    @Test
    void shouldPreserveEndOfMonthWhenGeneratingDates() {
        assertThat(FixedExpenseSeriesService.dueDateFor(LocalDate.of(2026, 1, 31), 1))
                .isEqualTo(LocalDate.of(2026, 2, 28));
        assertThat(FixedExpenseSeriesService.dueDateFor(LocalDate.of(2026, 1, 31), 2))
                .isEqualTo(LocalDate.of(2026, 3, 31));
        assertThat(FixedExpenseSeriesService.nextMonthlyDate(LocalDate.of(2026, 2, 28)))
                .isEqualTo(LocalDate.of(2026, 3, 31));
    }

    @Test
    void shouldCreateOneInitialInstallmentForIndefiniteSeries() {
        FixedExpenseSeries series = mock(FixedExpenseSeries.class);
        FixedExpenseInstallment installment = mock(FixedExpenseInstallment.class);
        when(seriesRepository.save(any(FixedExpenseSeries.class))).thenReturn(series);
        when(installmentRepository.saveAll(any())).thenReturn(List.of(installment));
        when(installment.getSeries()).thenReturn(series);
        when(series.getAmountInCents()).thenReturn(40_000L);

        var request = new CreateFixedExpenseRequest(
                "Aluguel", 40_000L, "Moradia", LocalDate.of(2026, 8, 22),
                PaymentMethod.PIX, null, null);

        var response = new FixedExpenseSeriesService(seriesRepository, installmentRepository).create(request);

        assertThat(response).isNotNull();
        org.mockito.Mockito.verify(installmentRepository).saveAll(any());
    }

    @Test
    void shouldDeleteSeriesAndAllRelatedInstallments() {
        UUID seriesId = UUID.randomUUID();
        FixedExpenseSeries series = mock(FixedExpenseSeries.class);
        when(seriesRepository.findById(seriesId)).thenReturn(java.util.Optional.of(series));
        when(installmentRepository.findAllBySeriesIdOrderByDueDateDesc(seriesId)).thenReturn(List.of());

        new FixedExpenseSeriesService(seriesRepository, installmentRepository).delete(seriesId);

        verify(installmentRepository).deleteAll(any());
        verify(seriesRepository).delete(series);
    }

    @Test
    void shouldNotDeleteAnythingWhenSeriesDoesNotExist() {
        UUID seriesId = UUID.randomUUID();
        when(seriesRepository.findById(seriesId)).thenReturn(java.util.Optional.empty());

        org.assertj.core.api.Assertions.assertThatThrownBy(
                () -> new FixedExpenseSeriesService(seriesRepository, installmentRepository).delete(seriesId))
                .isInstanceOf(org.springframework.web.server.ResponseStatusException.class);

        verify(installmentRepository, never()).deleteAll(any());
        verify(seriesRepository, never()).delete(any(FixedExpenseSeries.class));
    }
}
