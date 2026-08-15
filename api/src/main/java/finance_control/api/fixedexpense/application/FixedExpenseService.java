package finance_control.api.fixedexpense.application;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import finance_control.api.fixedexpense.api.dto.CreateFixedExpenseRequest;
import finance_control.api.fixedexpense.api.dto.FixedExpenseResponse;
import finance_control.api.fixedexpense.domain.FixedExpense;
import finance_control.api.fixedexpense.infrastructure.FixedExpenseRepository;

@Service
public class FixedExpenseService {

    private final FixedExpenseRepository repository;

    public FixedExpenseService(FixedExpenseRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public FixedExpenseResponse create(CreateFixedExpenseRequest request) {
        FixedExpense fe = FixedExpense.create(
                request.description(),
                request.amountInCents(),
                request.category(),
                request.dueDate(),
                request.paymentMethod(),
                request.notes(),
                request.installments());

        FixedExpense saved = repository.save(fe);
        return FixedExpenseResponse.from(saved);
    }

    @Transactional(readOnly = true)
    public List<FixedExpenseResponse> list(Boolean paid) {
        if (paid == null) {
            return repository.findAll().stream().map(FixedExpenseResponse::from).toList();
        }
        if (!paid) {
            return repository.findAllByPaidFalse().stream().map(FixedExpenseResponse::from).toList();
        }
        return repository.findAll().stream().filter(fe -> fe.isPaid() == paid).map(FixedExpenseResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public List<FixedExpense> listMissingDueDate() {
        return repository.findAllByDueDateIsNull();
    }

    @Transactional
    public void delete(UUID id) {
        try {
            repository.deleteById(id);
        } catch (EmptyResultDataAccessException ex) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Gasto fixo não encontrado");
        }
    }

    @Transactional
    public void markAsPaid(UUID id) {
        FixedExpense fe = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Gasto fixo não encontrado"));
        if (!fe.isPaid()) {
            fe.markPaid();
            repository.save(fe);
        }
    }
}
