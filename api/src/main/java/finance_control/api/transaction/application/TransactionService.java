package finance_control.api.transaction.application;

import java.util.List;
import java.util.UUID;

import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import finance_control.api.transaction.api.dto.CreateTransactionRequest;
import finance_control.api.transaction.api.dto.TransactionResponse;
import finance_control.api.transaction.domain.Transaction;
import finance_control.api.transaction.domain.TransactionType;
import finance_control.api.transaction.infrastructure.TransactionRepository;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;

    public TransactionService(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    @Transactional
    public TransactionResponse create(CreateTransactionRequest request) {
        Transaction transaction = Transaction.create(
                request.type(),
                request.description(),
                request.amountInCents(),
                request.category(),
                request.transactionDate(),
                request.paymentMethod(),
                request.notes());

        Transaction savedTransaction = transactionRepository.save(transaction);
        return TransactionResponse.from(savedTransaction);
    }

    @Transactional(readOnly = true)
    public List<TransactionResponse> list(TransactionType type) {
        Sort sort = Sort.by(
                Sort.Order.desc("transactionDate"),
                Sort.Order.desc("createdAt"),
                Sort.Order.desc("id"));

        List<Transaction> transactions = type == null
                ? transactionRepository.findAll(sort)
                : transactionRepository.findAllByType(type, sort);

        return transactions.stream()
                .map(TransactionResponse::from)
                .toList();
    }

    @Transactional
    public void delete(UUID id) {
        try {
            transactionRepository.deleteById(id);
        } catch (EmptyResultDataAccessException ex) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Transação não encontrada");
        }
    }
}
