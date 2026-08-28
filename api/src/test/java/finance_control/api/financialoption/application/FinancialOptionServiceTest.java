package finance_control.api.financialoption.application;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import finance_control.api.financialoption.api.dto.CreateFinancialOptionRequest;
import finance_control.api.financialoption.api.dto.UpdateFinancialOptionRequest;
import finance_control.api.financialoption.domain.FinancialOption;
import finance_control.api.financialoption.domain.FinancialOptionType;
import finance_control.api.financialoption.infrastructure.FinancialOptionRepository;
import finance_control.api.fixedexpense.infrastructure.FixedExpenseSeriesRepository;
import finance_control.api.transaction.infrastructure.TransactionRepository;

@ExtendWith(MockitoExtension.class)
class FinancialOptionServiceTest {
    @Mock
    private FinancialOptionRepository optionRepository;
    @Mock
    private TransactionRepository transactionRepository;
    @Mock
    private FixedExpenseSeriesRepository fixedExpenseSeriesRepository;
    @InjectMocks
    private FinancialOptionService service;

    @Test
    void shouldRejectCreationWhenOptionTypeReachesLimit() {
        when(optionRepository.findAllByTypeOrderByDefaultOptionDescNameAsc(FinancialOptionType.EXPENSE_CATEGORY))
                .thenReturn(List.of(
                        FinancialOption.create("A", FinancialOptionType.EXPENSE_CATEGORY, false),
                        FinancialOption.create("B", FinancialOptionType.EXPENSE_CATEGORY, false),
                        FinancialOption.create("C", FinancialOptionType.EXPENSE_CATEGORY, false),
                        FinancialOption.create("D", FinancialOptionType.EXPENSE_CATEGORY, false),
                        FinancialOption.create("E", FinancialOptionType.EXPENSE_CATEGORY, false),
                        FinancialOption.create("F", FinancialOptionType.EXPENSE_CATEGORY, false),
                        FinancialOption.create("G", FinancialOptionType.EXPENSE_CATEGORY, false),
                        FinancialOption.create("H", FinancialOptionType.EXPENSE_CATEGORY, false),
                        FinancialOption.create("I", FinancialOptionType.EXPENSE_CATEGORY, false),
                        FinancialOption.create("J", FinancialOptionType.EXPENSE_CATEGORY, false),
                        FinancialOption.create("K", FinancialOptionType.EXPENSE_CATEGORY, false),
                        FinancialOption.create("L", FinancialOptionType.EXPENSE_CATEGORY, false),
                        FinancialOption.create("M", FinancialOptionType.EXPENSE_CATEGORY, false),
                        FinancialOption.create("N", FinancialOptionType.EXPENSE_CATEGORY, false),
                        FinancialOption.create("Outros", FinancialOptionType.EXPENSE_CATEGORY, true)));

        assertThatThrownBy(() -> service.create(new CreateFinancialOptionRequest("Academia", FinancialOptionType.EXPENSE_CATEGORY)))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("Limite de 15 opções");
    }

    @Test
    void shouldRejectCaseInsensitiveDuplicate() {
        when(optionRepository.findAllByTypeOrderByDefaultOptionDescNameAsc(any())).thenReturn(List.of());
        when(optionRepository.existsByTypeAndNameIgnoreCase(FinancialOptionType.PAYMENT_METHOD, "Pix")).thenReturn(true);

        assertThatThrownBy(() -> service.create(new CreateFinancialOptionRequest(" Pix ", FinancialOptionType.PAYMENT_METHOD)))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("Já existe");
    }

    @Test
    void shouldRejectDeletingDefaultOption() {
        UUID id = UUID.randomUUID();
        FinancialOption option = FinancialOption.create("Outros", FinancialOptionType.INCOME_CATEGORY, true);
        when(optionRepository.findById(id)).thenReturn(Optional.of(option));

        assertThatThrownBy(() -> service.delete(id))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("padrão");
    }

    @Test
    void shouldRejectDeletingOptionInUse() {
        UUID id = UUID.randomUUID();
        FinancialOption option = FinancialOption.create("Mercado", FinancialOptionType.EXPENSE_CATEGORY, false);
        when(optionRepository.findById(id)).thenReturn(Optional.of(option));
        when(transactionRepository.countByCategoryIgnoreCaseAndType("Mercado", finance_control.api.transaction.domain.TransactionType.EXPENSE)).thenReturn(1L);
        when(fixedExpenseSeriesRepository.countByCategoryIgnoreCase("Mercado")).thenReturn(0L);

        assertThatThrownBy(() -> service.delete(id))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("sendo utilizada");
    }

    @Test
    void shouldRejectRenamingDefaultOption() {
        UUID id = UUID.randomUUID();
        FinancialOption option = FinancialOption.create("Outros", FinancialOptionType.PAYMENT_METHOD, true);
        when(optionRepository.findById(id)).thenReturn(Optional.of(option));

        assertThatThrownBy(() -> service.update(id, new UpdateFinancialOptionRequest("Outro nome")))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("padrão");
    }
}
