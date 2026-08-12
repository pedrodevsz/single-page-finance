package finance_control.api.transaction.infrastructure;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

import finance_control.api.transaction.domain.Transaction;
import finance_control.api.transaction.domain.TransactionType;

public interface TransactionRepository extends JpaRepository<Transaction, UUID> {
    List<Transaction> findAllByType(TransactionType type, Sort sort);
}
