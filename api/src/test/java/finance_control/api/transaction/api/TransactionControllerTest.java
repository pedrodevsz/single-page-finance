package finance_control.api.transaction.api;

import static org.hamcrest.Matchers.hasEntry;
import static org.hamcrest.Matchers.hasKey;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import finance_control.api.shared.exception.ApiExceptionHandler;
import finance_control.api.transaction.api.dto.CreateTransactionRequest;
import finance_control.api.transaction.api.dto.TransactionResponse;
import finance_control.api.transaction.application.TransactionService;
import finance_control.api.transaction.domain.PaymentMethod;
import finance_control.api.transaction.domain.TransactionType;

@WebMvcTest(TransactionController.class)
@Import(ApiExceptionHandler.class)
class TransactionControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private TransactionService transactionService;

    @Test
    void shouldCreateTransactionAndReturn201() throws Exception {
        UUID transactionId = UUID.fromString("8d4a8a9d-4f4a-4b87-b97d-6c3f9cc1d901");
        TransactionResponse response = new TransactionResponse(
                transactionId,
                TransactionType.INCOME,
                "Freelance - Landing Page",
                150000L,
                "Freelance",
                LocalDate.of(2026, 8, 10),
                PaymentMethod.PIX,
                "Pagamento referente ao projeto X",
                Instant.parse("2026-08-10T12:00:00Z"),
                Instant.parse("2026-08-10T12:00:00Z")
        );

        when(transactionService.create(any(CreateTransactionRequest.class))).thenReturn(response);

        String payload = """
                {
                  "type": "INCOME",
                  "description": "Freelance - Landing Page",
                  "amountInCents": 150000,
                  "category": "Freelance",
                  "transactionDate": "2026-08-10",
                  "paymentMethod": "PIX",
                  "notes": "Pagamento referente ao projeto X"
                }
                """;

                mockMvc.perform(post("/api/v1/transactions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isCreated())
                .andExpect(header().string("Location", "http://localhost/api/v1/transactions/" + transactionId))
                .andExpect(jsonPath("$.id").value(transactionId.toString()))
                .andExpect(jsonPath("$.type").value("INCOME"))
                .andExpect(jsonPath("$.description").value("Freelance - Landing Page"))
                .andExpect(jsonPath("$.amountInCents").value(150000))
                .andExpect(jsonPath("$.category").value("Freelance"))
                .andExpect(jsonPath("$.transactionDate").value("2026-08-10"))
                .andExpect(jsonPath("$.paymentMethod").value("PIX"))
                .andExpect(jsonPath("$.notes").value("Pagamento referente ao projeto X"));
    }

    @Test
    void shouldReturn400WhenDescriptionIsBlank() throws Exception {
        String payload = """
                {
                  "type": "INCOME",
                  "description": "",
                  "amountInCents": 150000,
                  "category": "Freelance",
                  "transactionDate": "2026-08-10",
                  "paymentMethod": "PIX",
                  "notes": "Pagamento referente ao projeto X"
                }
                """;

        mockMvc.perform(post("/api/v1/transactions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.description").value("Informe uma descrição."));
    }

    @Test
    void shouldReturn400WhenAmountIsZero() throws Exception {
        String payload = """
                {
                  "type": "INCOME",
                  "description": "Freelance - Landing Page",
                  "amountInCents": 0,
                  "category": "Freelance",
                  "transactionDate": "2026-08-10",
                  "paymentMethod": "PIX",
                  "notes": "Pagamento referente ao projeto X"
                }
                """;

        mockMvc.perform(post("/api/v1/transactions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.amountInCents").value("Informe um valor maior que zero."));
    }

    @Test
    void shouldReturn400WhenTypeIsMissing() throws Exception {
        String payload = """
                {
                  "description": "Freelance - Landing Page",
                  "amountInCents": 150000,
                  "category": "Freelance",
                  "transactionDate": "2026-08-10",
                  "paymentMethod": "PIX",
                  "notes": "Pagamento referente ao projeto X"
                }
                """;

        mockMvc.perform(post("/api/v1/transactions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors").value(hasKey("type")));
    }

    @Test
    void shouldReturn400WhenPaymentMethodIsMissing() throws Exception {
        String payload = """
                {
                  "type": "INCOME",
                  "description": "Freelance - Landing Page",
                  "amountInCents": 150000,
                  "category": "Freelance",
                  "transactionDate": "2026-08-10",
                  "notes": "Pagamento referente ao projeto X"
                }
                """;

        mockMvc.perform(post("/api/v1/transactions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors").value(hasKey("paymentMethod")));
    }
}
