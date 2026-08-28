package finance_control.api.transaction.application;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDate;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import finance_control.api.transaction.api.dto.CreateTransactionRequest;
import finance_control.api.transaction.api.dto.TransactionResponse;
import finance_control.api.transaction.domain.PaymentMethod;
import finance_control.api.transaction.domain.Transaction;
import finance_control.api.transaction.domain.TransactionType;
import finance_control.api.transaction.infrastructure.TransactionRepository;

@ExtendWith(MockitoExtension.class)
class TransactionServiceTest {

    @Mock
    private TransactionRepository transactionRepository;

    @Test
    void shouldCreateValidTransaction() {
        TransactionService transactionService = new TransactionService(transactionRepository);
        CreateTransactionRequest request = new CreateTransactionRequest(
                TransactionType.INCOME,
                "Freelance - Landing Page",
                150000L,
                "Freelance",
                LocalDate.of(2026, 8, 10),
                PaymentMethod.PIX.name(),
                "Pagamento referente ao projeto X"
        );

        when(transactionRepository.save(any(Transaction.class))).thenAnswer(invocation -> invocation.getArgument(0));

        TransactionResponse response = transactionService.create(request);

        ArgumentCaptor<Transaction> transactionCaptor = ArgumentCaptor.forClass(Transaction.class);
        verify(transactionRepository).save(transactionCaptor.capture());

        Transaction savedTransaction = transactionCaptor.getValue();
        assertThat(savedTransaction.getType()).isEqualTo(TransactionType.INCOME);
        assertThat(savedTransaction.getDescription()).isEqualTo("Freelance - Landing Page");
        assertThat(savedTransaction.getAmountInCents()).isEqualTo(150000L);
        assertThat(savedTransaction.getCategory()).isEqualTo("Freelance");
        assertThat(savedTransaction.getTransactionDate()).isEqualTo(LocalDate.of(2026, 8, 10));
        assertThat(savedTransaction.getPaymentMethod()).isEqualTo(PaymentMethod.PIX.name());
        assertThat(savedTransaction.getNotes()).isEqualTo("Pagamento referente ao projeto X");
        assertThat(response.type()).isEqualTo(TransactionType.INCOME);
    }
}
