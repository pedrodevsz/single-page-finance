package finance_control.api.fixedexpense.api;

import java.net.URI;
import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import finance_control.api.fixedexpense.api.dto.CreateFixedExpenseRequest;
import finance_control.api.fixedexpense.api.dto.FixedExpenseHistoryRecordResponse;
import finance_control.api.fixedexpense.api.dto.FixedExpenseHistorySummaryResponse;
import finance_control.api.fixedexpense.api.dto.FixedExpenseInstallmentResponse;
import finance_control.api.fixedexpense.application.FixedExpenseHistoryService;
import finance_control.api.fixedexpense.application.FixedExpenseInstallmentService;
import finance_control.api.fixedexpense.application.FixedExpenseSeriesService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/fixed-expenses")
public class FixedExpenseController {
    private final FixedExpenseSeriesService seriesService;
    private final FixedExpenseInstallmentService installmentService;
    private final FixedExpenseHistoryService historyService;

    public FixedExpenseController(
            FixedExpenseSeriesService seriesService,
            FixedExpenseInstallmentService installmentService,
            FixedExpenseHistoryService historyService) {
        this.seriesService = seriesService;
        this.installmentService = installmentService;
        this.historyService = historyService;
    }

    @GetMapping
    public List<FixedExpenseInstallmentResponse> list(@RequestParam(required = false) Boolean paid) {
        return installmentService.list(paid);
    }

    @GetMapping("/history")
    public List<FixedExpenseHistorySummaryResponse> history() {
        return historyService.listSummaries();
    }

    @GetMapping("/{seriesId}/history")
    public List<FixedExpenseHistoryRecordResponse> history(@PathVariable UUID seriesId) {
        return historyService.listRecords(seriesId);
    }

    @PostMapping
    public ResponseEntity<FixedExpenseInstallmentResponse> create(@Valid @RequestBody CreateFixedExpenseRequest request) {
        FixedExpenseInstallmentResponse response = seriesService.create(request);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}")
                .buildAndExpand(response.seriesId()).toUri();
        return ResponseEntity.created(location).body(response);
    }

    /** Compatibility path: the id now identifies an installment, not a series. */
    @DeleteMapping("/{installmentId}")
    public ResponseEntity<Void> delete(@PathVariable UUID installmentId) {
        installmentService.delete(installmentId);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{installmentId}/paid")
    public ResponseEntity<Void> markAsPaid(@PathVariable UUID installmentId) {
        installmentService.markAsPaid(installmentId);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/installments/{installmentId}/payment")
    public ResponseEntity<Void> markInstallmentAsPaid(@PathVariable UUID installmentId) {
        installmentService.markAsPaid(installmentId);
        return ResponseEntity.noContent().build();
    }
}
