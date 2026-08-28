package finance_control.api.financialoption.application;

import java.util.List;
import java.util.UUID;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import finance_control.api.financialoption.api.dto.CreateFinancialOptionRequest;
import finance_control.api.financialoption.api.dto.FinancialOptionResponse;
import finance_control.api.financialoption.api.dto.UpdateFinancialOptionRequest;
import finance_control.api.financialoption.domain.FinancialOption;
import finance_control.api.financialoption.domain.FinancialOptionType;
import finance_control.api.financialoption.infrastructure.FinancialOptionRepository;
import finance_control.api.fixedexpense.infrastructure.FixedExpenseSeriesRepository;
import finance_control.api.transaction.domain.TransactionType;
import finance_control.api.transaction.infrastructure.TransactionRepository;

@Service
public class FinancialOptionService {
    private static final int MAX_OPTIONS = 15;

    private final FinancialOptionRepository optionRepository;
    private final TransactionRepository transactionRepository;
    private final FixedExpenseSeriesRepository fixedExpenseSeriesRepository;

    public FinancialOptionService(
            FinancialOptionRepository optionRepository,
            TransactionRepository transactionRepository,
            FixedExpenseSeriesRepository fixedExpenseSeriesRepository) {
        this.optionRepository = optionRepository;
        this.transactionRepository = transactionRepository;
        this.fixedExpenseSeriesRepository = fixedExpenseSeriesRepository;
    }

    @Transactional(readOnly = true)
    public List<FinancialOptionResponse> list(FinancialOptionType type) {
        return optionRepository.findAllByTypeOrderByDefaultOptionDescNameAsc(type).stream()
                .map(option -> toResponse(option, usageCount(option)))
                .toList();
    }

    @Transactional
    public FinancialOptionResponse create(CreateFinancialOptionRequest request) {
        long count = optionRepository.findAllByTypeOrderByDefaultOptionDescNameAsc(request.type()).size();
        if (count >= MAX_OPTIONS) {
            throw businessError("Limite de 15 opções atingido.");
        }

        String name = FinancialOption.normalize(request.name());
        if (optionRepository.existsByTypeAndNameIgnoreCase(request.type(), name)) {
            throw businessError("Já existe uma opção com este nome.");
        }

        try {
            FinancialOption saved = optionRepository.save(FinancialOption.create(name, request.type(), false));
            return toResponse(saved, 0);
        } catch (DataIntegrityViolationException exception) {
            throw businessError("Já existe uma opção com este nome.");
        }
    }

    @Transactional
    public FinancialOptionResponse update(UUID id, UpdateFinancialOptionRequest request) {
        FinancialOption option = findOption(id);
        if (option.isDefaultOption()) {
            throw businessError("A opção padrão não pode ser editada.");
        }

        long usageCount = usageCount(option);
        if (usageCount > 0) {
            throw businessError("Esta opção está sendo utilizada e não pode ser editada.");
        }

        String name = FinancialOption.normalize(request.name());
        if (optionRepository.existsByTypeAndNameIgnoreCaseAndIdNot(option.getType(), name, id)) {
            throw businessError("Já existe uma opção com este nome.");
        }

        option.rename(name);
        return toResponse(optionRepository.save(option), 0);
    }

    @Transactional
    public void delete(UUID id) {
        FinancialOption option = findOption(id);
        if (option.isDefaultOption()) {
            throw businessError("A opção padrão não pode ser excluída.");
        }
        if (usageCount(option) > 0) {
            throw businessError("Esta opção está sendo utilizada e não pode ser excluída.");
        }
        optionRepository.delete(option);
    }

    private FinancialOption findOption(UUID id) {
        return optionRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Opção não encontrada."));
    }

    private long usageCount(FinancialOption option) {
        return switch (option.getType()) {
            case INCOME_CATEGORY -> transactionRepository.countByCategoryIgnoreCaseAndType(option.getName(), TransactionType.INCOME);
            case EXPENSE_CATEGORY -> transactionRepository.countByCategoryIgnoreCaseAndType(option.getName(), TransactionType.EXPENSE)
                    + fixedExpenseSeriesRepository.countByCategoryIgnoreCase(option.getName());
            case RECEIPT_METHOD -> transactionRepository.countByPaymentMethodIgnoreCaseAndType(option.getName(), TransactionType.INCOME);
            case PAYMENT_METHOD -> transactionRepository.countByPaymentMethodIgnoreCaseAndType(option.getName(), TransactionType.EXPENSE)
                    + fixedExpenseSeriesRepository.countByPaymentMethodIgnoreCase(option.getName());
        };
    }

    private FinancialOptionResponse toResponse(FinancialOption option, long usageCount) {
        return FinancialOptionResponse.from(option, usageCount);
    }

    private ResponseStatusException businessError(String message) {
        return new ResponseStatusException(HttpStatus.CONFLICT, message);
    }
}
