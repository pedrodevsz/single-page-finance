package finance_control.api.fixedexpense.application;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.Clock;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import finance_control.api.fixedexpense.domain.FixedExpenseInstallment;
import finance_control.api.fixedexpense.domain.FixedExpenseSeries;
import finance_control.api.fixedexpense.infrastructure.FixedExpenseInstallmentRepository;

@ExtendWith(MockitoExtension.class)
class FixedExpenseInstallmentServiceTest {
    @Mock
    private FixedExpenseInstallmentRepository repository;

    @Test
    void shouldQueryOnlyPendingInstallmentsFromCurrentMonth() {
        Clock clock = Clock.fixed(
                LocalDate.of(2026, 8, 15).atStartOfDay().toInstant(ZoneOffset.UTC), ZoneOffset.UTC);
        LocalDate[] range = FixedExpenseInstallmentService.currentMonthRange(clock);

        assertThat(range).containsExactly(LocalDate.of(2026, 8, 1), LocalDate.of(2026, 9, 1));
    }

    @Test
    void shouldPayInstallmentAndCreateOnlyOneNextRecurringOccurrence() {
        UUID id = UUID.randomUUID();
        UUID seriesId = UUID.randomUUID();
        FixedExpenseInstallment installment = mock(FixedExpenseInstallment.class);
        FixedExpenseSeries series = mock(FixedExpenseSeries.class);
        when(repository.findById(id)).thenReturn(Optional.of(installment));
        when(installment.isPaid()).thenReturn(false);
        when(installment.getSeries()).thenReturn(series);
        when(series.getId()).thenReturn(seriesId);
        when(series.getInstallments()).thenReturn(null);
        when(installment.getDueDate()).thenReturn(LocalDate.of(2026, 1, 31));
        when(repository.findBySeriesIdAndDueDate(seriesId, LocalDate.of(2026, 2, 28)))
                .thenReturn(Optional.empty());

        new FixedExpenseInstallmentService(repository).markAsPaid(id);

        verify(installment).markAsPaid(any());
        verify(repository).save(installment);
        verify(repository, times(2)).save(any(FixedExpenseInstallment.class));
    }

    @Test
    void shouldBeIdempotentWhenInstallmentIsAlreadyPaid() {
        UUID id = UUID.randomUUID();
        FixedExpenseInstallment installment = mock(FixedExpenseInstallment.class);
        when(repository.findById(id)).thenReturn(Optional.of(installment));
        when(installment.isPaid()).thenReturn(true);

        new FixedExpenseInstallmentService(repository).markAsPaid(id);

        verify(repository, never()).save(any());
    }
}
