package finance_control.api.fixedexpense.application;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import finance_control.api.fixedexpense.api.dto.CreateFixedExpenseRequest;
import finance_control.api.fixedexpense.api.dto.FixedExpenseInstallmentResponse;
import finance_control.api.fixedexpense.domain.FixedExpenseInstallment;
import finance_control.api.fixedexpense.domain.FixedExpenseSeries;
import finance_control.api.fixedexpense.infrastructure.FixedExpenseInstallmentRepository;
import finance_control.api.fixedexpense.infrastructure.FixedExpenseSeriesRepository;

@Service
public class FixedExpenseSeriesService {
    private final FixedExpenseSeriesRepository seriesRepository;
    private final FixedExpenseInstallmentRepository installmentRepository;

    public FixedExpenseSeriesService(
            FixedExpenseSeriesRepository seriesRepository,
            FixedExpenseInstallmentRepository installmentRepository) {
        this.seriesRepository = seriesRepository;
        this.installmentRepository = installmentRepository;
    }

    @Transactional
    public FixedExpenseInstallmentResponse create(CreateFixedExpenseRequest request) {
        FixedExpenseSeries series = seriesRepository.save(FixedExpenseSeries.create(request));
        int count = request.installments() == null ? 1 : request.installments();
        List<FixedExpenseInstallment> installments = new ArrayList<>(count);
        for (int number = 1; number <= count; number++) {
            Integer installmentNumber = request.installments() == null ? null : number;
            installments.add(FixedExpenseInstallment.create(
                    series, installmentNumber, dueDateFor(request.dueDate(), number - 1)));
        }
        return FixedExpenseInstallmentResponse.from(installmentRepository.saveAll(installments).get(0));
    }

    @Transactional
    public void delete(UUID seriesId) {
        FixedExpenseSeries series = seriesRepository.findById(seriesId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Série de conta fixa não encontrada"));

        installmentRepository.deleteAll(installmentRepository.findAllBySeriesIdOrderByDueDateDesc(seriesId));
        seriesRepository.delete(series);
    }

    static LocalDate dueDateFor(LocalDate firstDueDate, int monthOffset) {
        YearMonth targetMonth = YearMonth.from(firstDueDate).plusMonths(monthOffset);
        int day = Math.min(firstDueDate.getDayOfMonth(), targetMonth.lengthOfMonth());
        return targetMonth.atDay(day);
    }

    static LocalDate nextMonthlyDate(LocalDate currentDueDate) {
        YearMonth targetMonth = YearMonth.from(currentDueDate).plusMonths(1);
        if (currentDueDate.getDayOfMonth() == YearMonth.from(currentDueDate).lengthOfMonth()) {
            return targetMonth.atEndOfMonth();
        }
        return targetMonth.atDay(Math.min(currentDueDate.getDayOfMonth(), targetMonth.lengthOfMonth()));
    }
}
