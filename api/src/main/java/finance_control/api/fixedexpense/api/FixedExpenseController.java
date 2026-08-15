package finance_control.api.fixedexpense.api;

import java.net.URI;
import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import finance_control.api.fixedexpense.api.dto.CreateFixedExpenseRequest;
import finance_control.api.fixedexpense.api.dto.FixedExpenseResponse;
import finance_control.api.fixedexpense.api.dto.FixedExpenseMissingDueDateResponse;
import finance_control.api.fixedexpense.application.FixedExpenseService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/fixed-expenses")
public class FixedExpenseController {

    private final FixedExpenseService fixedExpenseService;

    public FixedExpenseController(FixedExpenseService fixedExpenseService) {
        this.fixedExpenseService = fixedExpenseService;
    }

    @GetMapping
    public List<FixedExpenseResponse> list(
            @org.springframework.web.bind.annotation.RequestParam(required = false) Boolean paid) {
        return fixedExpenseService.list(paid);
    }

    @GetMapping("/missing-due-date")
    public List<FixedExpenseMissingDueDateResponse> missingDueDate() {
        return fixedExpenseService.listMissingDueDate().stream()
                .map(fe -> new FixedExpenseMissingDueDateResponse(fe.getId(), fe.getDescription()))
                .toList();
    }

    @PostMapping
    public ResponseEntity<FixedExpenseResponse> create(@Valid @RequestBody CreateFixedExpenseRequest request) {
        FixedExpenseResponse response = fixedExpenseService.create(request);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(response.id())
                .toUri();
        return ResponseEntity.created(location).body(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        fixedExpenseService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/paid")
    public ResponseEntity<Void> markAsPaid(@PathVariable UUID id) {
        fixedExpenseService.markAsPaid(id);
        return ResponseEntity.noContent().build();
    }
}
