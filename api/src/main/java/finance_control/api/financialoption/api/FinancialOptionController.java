package finance_control.api.financialoption.api;

import java.net.URI;
import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import finance_control.api.financialoption.api.dto.CreateFinancialOptionRequest;
import finance_control.api.financialoption.api.dto.FinancialOptionResponse;
import finance_control.api.financialoption.api.dto.UpdateFinancialOptionRequest;
import finance_control.api.financialoption.application.FinancialOptionService;
import finance_control.api.financialoption.domain.FinancialOptionType;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/financial-options")
public class FinancialOptionController {
    private final FinancialOptionService service;

    public FinancialOptionController(FinancialOptionService service) {
        this.service = service;
    }

    @GetMapping
    public List<FinancialOptionResponse> list(@RequestParam FinancialOptionType type) {
        return service.list(type);
    }

    @PostMapping
    public ResponseEntity<FinancialOptionResponse> create(@Valid @RequestBody CreateFinancialOptionRequest request) {
        FinancialOptionResponse response = service.create(request);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}")
                .buildAndExpand(response.id()).toUri();
        return ResponseEntity.created(location).body(response);
    }

    @PutMapping("/{id}")
    public FinancialOptionResponse update(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateFinancialOptionRequest request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
