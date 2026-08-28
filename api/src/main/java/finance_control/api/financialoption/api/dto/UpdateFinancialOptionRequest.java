package finance_control.api.financialoption.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpdateFinancialOptionRequest(
        @NotBlank(message = "Informe um nome.")
        @Size(max = 80, message = "O nome deve ter no máximo 80 caracteres.")
        String name) {
}
