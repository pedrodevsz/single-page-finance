package finance_control.api.fixedexpense.application;

import java.time.Instant;
import java.time.Clock;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import finance_control.api.fixedexpense.api.dto.FixedExpenseInstallmentResponse;
import finance_control.api.fixedexpense.domain.FixedExpenseInstallment;
import finance_control.api.fixedexpense.infrastructure.FixedExpenseInstallmentRepository;

@Service
public class FixedExpenseInstallmentService {
    private final FixedExpenseInstallmentRepository repository;

    public FixedExpenseInstallmentService(FixedExpenseInstallmentRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public List<FixedExpenseInstallmentResponse> list(Boolean paid) {
        List<FixedExpenseInstallment> installments = paid == null
                ? repository.findAll()
                : paid ? repository.findAll().stream().filter(FixedExpenseInstallment::isPaid).toList()
                        : currentMonthPending();
        return installments.stream().map(FixedExpenseInstallmentResponse::from).toList();
    }

    private List<FixedExpenseInstallment> currentMonthPending() {
        LocalDate[] range = currentMonthRange(Clock.systemDefaultZone());
        return repository.findAllByPaidFalseAndDueDateGreaterThanEqualAndDueDateLessThanOrderByDueDateAsc(
                range[0], range[1]);
    }

    static LocalDate[] currentMonthRange(Clock clock) {
        LocalDate start = LocalDate.now(clock).withDayOfMonth(1);
        return new LocalDate[] { start, start.plusMonths(1) };
    }

    @Transactional
    public void markAsPaid(UUID installmentId) {
        FixedExpenseInstallment installment = repository.findById(installmentId)
                .orElseThrow(() -> notFound("Parcela não encontrada"));
        if (installment.isPaid()) return;

        installment.markAsPaid(Instant.now());
        repository.save(installment);

        if (installment.getSeries().getInstallments() == null) {
            var nextDueDate = FixedExpenseSeriesService.nextMonthlyDate(installment.getDueDate());
            if (repository.findBySeriesIdAndDueDate(installment.getSeries().getId(), nextDueDate).isEmpty()) {
                repository.save(FixedExpenseInstallment.create(installment.getSeries(), null, nextDueDate));
            }
        }
    }

    @Transactional
    public void delete(UUID installmentId) {
        try {
            repository.deleteById(installmentId);
        } catch (EmptyResultDataAccessException ex) {
            throw notFound("Parcela não encontrada");
        }
    }

    private static ResponseStatusException notFound(String message) {
        return new ResponseStatusException(HttpStatus.NOT_FOUND, message);
    }
}
