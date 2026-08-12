package finance_control.api.transaction.api.dto;

import java.time.LocalDate;

import org.springframework.validation.annotation.Validated;

import finance_control.api.transaction.domain.PaymentMethod;
import finance_control.api.transaction.domain.TransactionType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

@Validated
public record CreateTransactionRequest(
        @NotNull(message = "Informe o tipo da transação.")
        TransactionType type,

        @NotBlank(message = "Informe uma descrição.")
        @Size(max = 120, message = "A descrição deve ter no máximo 120 caracteres.")
        String description,

        @NotNull(message = "Informe um valor maior que zero.")
        @Positive(message = "Informe um valor maior que zero.")
        Long amountInCents,

        @NotBlank(message = "Informe uma categoria.")
        @Size(max = 80, message = "A categoria deve ter no máximo 80 caracteres.")
        String category,

        @NotNull(message = "Informe uma data.")
        LocalDate transactionDate,

        @NotNull(message = "Selecione um meio de pagamento ou recebimento.")
        PaymentMethod paymentMethod,

        @Size(max = 255, message = "A observação deve ter no máximo 255 caracteres.")
        String notes
) {
}
