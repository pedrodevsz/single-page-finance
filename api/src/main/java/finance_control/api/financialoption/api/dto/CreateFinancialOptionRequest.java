package finance_control.api.financialoption.api.dto;

import finance_control.api.financialoption.domain.FinancialOptionType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateFinancialOptionRequest(
        @NotBlank(message = "Informe um nome.")
        @Size(max = 80, message = "O nome deve ter no máximo 80 caracteres.")
        String name,
        @NotNull(message = "Informe o tipo da opção.")
        FinancialOptionType type) {
}
