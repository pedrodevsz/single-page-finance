package finance_control.api.fixedexpense.application;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import finance_control.api.fixedexpense.api.dto.FixedExpenseHistoryRecordResponse;
import finance_control.api.fixedexpense.api.dto.FixedExpenseHistorySummaryResponse;
import finance_control.api.fixedexpense.infrastructure.FixedExpenseInstallmentRepository;
import finance_control.api.fixedexpense.infrastructure.FixedExpenseSeriesRepository;

@Service
public class FixedExpenseHistoryService {
    private final FixedExpenseInstallmentRepository installmentRepository;
    private final FixedExpenseSeriesRepository seriesRepository;

    public FixedExpenseHistoryService(
            FixedExpenseInstallmentRepository installmentRepository,
            FixedExpenseSeriesRepository seriesRepository) {
        this.installmentRepository = installmentRepository;
        this.seriesRepository = seriesRepository;
    }

    @Transactional(readOnly = true)
    public List<FixedExpenseHistorySummaryResponse> listSummaries() {
        return installmentRepository.findHistorySummaries().stream()
                .map(item -> new FixedExpenseHistorySummaryResponse(
                        item.getSeriesId(), item.getDescription(), item.getCategory(),
                        item.getRecordCount(), item.getPaidCount(), item.getPendingCount()))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<FixedExpenseHistoryRecordResponse> listRecords(UUID seriesId) {
        if (!seriesRepository.existsById(seriesId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Série de conta fixa não encontrada");
        }
        return installmentRepository.findAllBySeriesIdOrderByDueDateDesc(seriesId).stream()
                .map(item -> new FixedExpenseHistoryRecordResponse(
                        item.getId(), item.getSeries().getId(), item.getSeries().getDescription(),
                        item.getSeries().getCategory(), item.getDueDate(), item.getAmountInCents(),
                        item.isPaid(), item.getPaidAt(), item.getSeries().getPaymentMethod(),
                        item.getSeries().getNotes(), item.getInstallmentNumber(),
                        item.getSeries().getInstallments()))
                .toList();
    }
}
